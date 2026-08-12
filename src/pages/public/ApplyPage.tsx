import { useState, type ChangeEvent } from 'react';
import {
    Container,
    Box,
    Typography,
    Paper,
    Stepper,
    Step,
    StepLabel,
    Button,
    TextField,
    MenuItem,
    Stack,
    Grid,
    Alert,
    CircularProgress,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getPublicAuth } from '../../api/generated'; // Adjust relative path to your Orval output
import type { AdmissionApplicationRequest } from '../../api/generated';
import { PROGRAMS } from '../../data/programs';

const STEPS = ['Program', 'Personal Details', 'Documents'];

export default function ApplyPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [activeStep, setActiveStep] = useState(() => (searchParams.get('program') ? 1 : 0));
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        programId: searchParams.get('program') || '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        phone: '',
        dob: '',
        address: '',
        emergencyContact: '',
        nrcFile: null as File | null,
        certificateFile: null as File | null,
    });

    const handleChange = (field: string) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleFileChange = (field: 'nrcFile' | 'certificateFile') => (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData((prev) => ({ ...prev, [field]: e.target.files![0] }));
        }
    };

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);

    const isStep1Valid = Boolean(formData.programId);

    const isStep2Valid = Boolean(
        formData.firstName &&
        formData.lastName &&
        formData.email &&
        formData.password &&
        formData.phone &&
        formData.dob &&
        formData.address &&
        formData.emergencyContact
    );

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setSubmitError(null);

        try {
            const { getSanctumCsrfCookie, postApply } = getPublicAuth();

            // 1. Set Sanctum CSRF Cookie
            await getSanctumCsrfCookie();

            // 2. Construct FormData object
            const payload = new FormData();
            payload.append('program_public_id', formData.programId);
            payload.append('first_name', formData.firstName);
            payload.append('last_name', formData.lastName);
            payload.append('email', formData.email);
            payload.append('password', formData.password);
            payload.append('phone', formData.phone);
            payload.append('dob', formData.dob);
            payload.append('address', formData.address);
            payload.append('emergency_contact', formData.emergencyContact);

            if (formData.nrcFile) {
                payload.append('nrc_file', formData.nrcFile);
            }
            if (formData.certificateFile) {
                payload.append('certificate_file', formData.certificateFile);
            }

            // 3. Submit request using generated SDK (override Content-Type to multipart/form-data)
            await postApply(
                payload as unknown as AdmissionApplicationRequest,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            setIsSuccess(true);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const responseData = err.response?.data;
                if (err.response?.status === 422 && responseData?.errors) {
                    const firstFieldError = Object.values(responseData.errors)[0] as string[];
                    setSubmitError(firstFieldError?.[0] || 'Validation failed. Check your inputs.');
                } else {
                    setSubmitError(responseData?.message || 'Failed to submit application. Please try again.');
                }
            } else if (err instanceof Error) {
                setSubmitError(err.message);
            } else {
                setSubmitError('An unexpected error occurred.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <Container maxWidth="sm" sx={{ py: 8 }}>
                <Paper variant="outlined" sx={{ p: 4, borderRadius: 4, textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: 'success.main' }}>
                        Application Submitted!
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                        Thank you for applying. Your application is currently under review. You can now log in with your credentials to check your status.
                    </Typography>
                    <Button variant="contained" onClick={() => navigate('/login')} size="large">
                        Go to Login
                    </Button>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 }, px: { xs: 2, md: 3 } }}>
            <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 800, mb: 4, textAlign: 'center' }}>
                Apply for Admission
            </Typography>

            <Stepper activeStep={activeStep} sx={{ mb: 6 }}>
                {STEPS.map((label) => (
                    <Step key={label}>
                        <StepLabel>{isMobile ? '' : label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {submitError && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setSubmitError(null)}>
                    {submitError}
                </Alert>
            )}

            <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, borderColor: '#e2e8f0' }}>
                {/* STEP 1: PROGRAM SELECTION */}
                {activeStep === 0 && (
                    <Stack spacing={3}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>Select a Program</Typography>
                        <TextField
                            select
                            fullWidth
                            label="Choose Program"
                            value={formData.programId}
                            onChange={handleChange('programId')}
                        >
                            {PROGRAMS.map((p) => (
                                <MenuItem key={p.id} value={p.id}>
                                    {p.title}
                                </MenuItem>
                            ))}
                        </TextField>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={handleNext}
                            disabled={!isStep1Valid}
                        >
                            Continue
                        </Button>
                    </Stack>
                )}

                {/* STEP 2: PERSONAL INFORMATION */}
                {activeStep === 1 && (
                    <Stack spacing={2.5}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>Personal Information</Typography>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    value={formData.firstName}
                                    onChange={handleChange('firstName')}
                                    required
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    value={formData.lastName}
                                    onChange={handleChange('lastName')}
                                    required
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange('email')}
                                    required
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange('password')}
                                    required
                                />
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange('phone')}
                                    required
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Date of Birth"
                                    type="date"
                                    value={formData.dob}
                                    onChange={handleChange('dob')}
                                    slotProps={{ inputLabel: { shrink: true } }}
                                    required
                                />
                            </Grid>
                        </Grid>

                        <TextField
                            fullWidth
                            label="Residential Address"
                            multiline
                            rows={2}
                            value={formData.address}
                            onChange={handleChange('address')}
                            required
                        />

                        <TextField
                            fullWidth
                            label="Emergency Contact Phone/Name"
                            value={formData.emergencyContact}
                            onChange={handleChange('emergencyContact')}
                            required
                        />

                        <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
                            <Button fullWidth onClick={handleBack}>Back</Button>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleNext}
                                disabled={!isStep2Valid}
                            >
                                Next
                            </Button>
                        </Box>
                    </Stack>
                )}

                {/* STEP 3: DOCUMENT UPLOADS */}
                {activeStep === 2 && (
                    <Stack spacing={3}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>Upload Documents</Typography>

                        <Button
                            variant="outlined"
                            component="label"
                            sx={{ py: 1.5, justifyContent: 'space-between', px: 2 }}
                        >
                            {formData.nrcFile ? `NRC/Passport: ${formData.nrcFile.name}` : 'Upload NRC/Passport'}
                            <input type="file" hidden accept="image/*,application/pdf" onChange={handleFileChange('nrcFile')} />
                        </Button>

                        <Button
                            variant="outlined"
                            component="label"
                            sx={{ py: 1.5, justifyContent: 'space-between', px: 2 }}
                        >
                            {formData.certificateFile ? `Certificate: ${formData.certificateFile.name}` : 'Upload High School Certificate'}
                            <input type="file" hidden accept="image/*,application/pdf" onChange={handleFileChange('certificateFile')} />
                        </Button>

                        <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
                            <Button fullWidth onClick={handleBack} disabled={isSubmitting}>Back</Button>
                            <Button
                                fullWidth
                                variant="contained"
                                color="success"
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Application'}
                            </Button>
                        </Box>
                    </Stack>
                )}
            </Paper>
        </Container>
    );
}