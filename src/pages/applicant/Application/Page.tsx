import { useState, type ChangeEvent, type FormEvent } from 'react';
import {
    Container,
    Typography,
    Paper,
    Box,
    Grid,
    TextField,
    Button,
    MenuItem,
    Stepper,
    Step,
    StepLabel,
    Alert,
    CircularProgress,
    Stack,
    IconButton,
    Chip
} from '@mui/material';
import {
    CloudUpload as UploadIcon,
    CheckCircle as CheckIcon,
    Delete as DeleteIcon,
    ArrowBack as ArrowBackIcon,
    ArrowForward as ArrowForwardIcon,
    Send as SendIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Interfaces matching API Schema
export interface ApplicationFormData {
    program_public_id: string;
    first_name: string;
    middle_names: string;
    last_name: string;
    email: string;
    phone: string;
    dob: string;
    address: string;
    emergency_contact: string;
    sex: 'male' | 'female' | '';
    marital_status: 'single' | 'married' | 'widow' | 'divorced' | '';
    nationality: string;
    nrc_number: string;
    passport_number: string;
    intake: 'January' | 'May' | 'September' | '';
    study_mode: 'full_time' | 'part_time' | 'distance_learning' | 'online' | '';
    nrc_file_public_id: string | null;
    passport_file_public_id: string | null;
    certificate_file_public_id: string | null;
}

interface UploadedFiles {
    certificate: { name: string; file_id: string } | null;
    nrcOrPassport: { name: string; file_id: string } | null;
    depositSlip: { name: string; file_id: string } | null;
    exemptionTranscript: { name: string; file_id: string } | null;
}

const STEPS = ['Personal & Contact Info', 'Program & Study Mode', 'Document Uploads'];

// Mock Program Options (Replace with dynamic API data)
const MOCK_PROGRAMS = [
    { id: '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d', name: 'Bachelor of Science in Computer Science' },
    { id: '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d', name: 'Bachelor of Business Administration' },
    { id: '8f7e6d5c-4b3a-2f1e-0d9c-8b7a6f5e4d3c', name: 'Diploma in Registered Nursing' },
];

export default function ApplicationPage() {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [formData, setFormData] = useState<ApplicationFormData>({
        program_public_id: '',
        first_name: '',
        middle_names: '',
        last_name: '',
        email: '',
        phone: '',
        dob: '',
        address: '',
        emergency_contact: '',
        sex: '',
        marital_status: '',
        nationality: 'Zambian',
        nrc_number: '',
        passport_number: '',
        intake: '',
        study_mode: '',
        nrc_file_public_id: null,
        passport_file_public_id: null,
        certificate_file_public_id: null,
    });

    const [files, setFiles] = useState<UploadedFiles>({
        certificate: null,
        nrcOrPassport: null,
        depositSlip: null,
        exemptionTranscript: null,
    });

    const handleTextChange = (field: keyof ApplicationFormData) => (e: ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

    // Simulated Document Upload Handler — connect to your file upload endpoint
    const handleFileUpload = async (fileKey: keyof UploadedFiles, file: File) => {
        setIsUploading(fileKey);
        try {
            // Simulated upload delay & UUID generation (Replace with actual POST /documents upload call)
            const simulatedUuid = crypto.randomUUID();

            setFiles((prev) => ({
                ...prev,
                [fileKey]: { name: file.name, file_id: simulatedUuid },
            }));

            if (fileKey === 'certificate') {
                setFormData((prev) => ({ ...prev, certificate_file_public_id: simulatedUuid }));
            } else if (fileKey === 'nrcOrPassport') {
                setFormData((prev) => ({ ...prev, nrc_file_public_id: simulatedUuid }));
            }
        } catch {
            setErrorMessage(`Failed to upload ${file.name}. Please try again.`);
        } finally {
            setIsUploading(null);
        }
    };

    const handleRemoveFile = (fileKey: keyof UploadedFiles) => {
        setFiles((prev) => ({ ...prev, [fileKey]: null }));
        if (fileKey === 'certificate') {
            setFormData((prev) => ({ ...prev, certificate_file_public_id: null }));
        } else if (fileKey === 'nrcOrPassport') {
            setFormData((prev) => ({ ...prev, nrc_file_public_id: null }));
        }
    };

    const isStep1Valid = Boolean(
        formData.first_name &&
        formData.last_name &&
        formData.email &&
        formData.phone &&
        formData.sex &&
        formData.marital_status
    );

    const isStep2Valid = Boolean(
        formData.program_public_id &&
        formData.intake &&
        formData.study_mode
    );

    const isStep3Valid = Boolean(
        files.certificate &&
        files.nrcOrPassport &&
        files.depositSlip
    );

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessage(null);

        try {
            await axios.post('/api/apply', formData);
            navigate('/applicant/dashboard');
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const data = err.response?.data;
                setErrorMessage(data?.message || 'Failed to submit application. Check required fields.');
            } else {
                setErrorMessage('An unexpected error occurred.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, textAlign: 'center' }}>
                Admission Application Form
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
                Complete all required steps to apply for admission.
            </Typography>

            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                {STEPS.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {errorMessage && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setErrorMessage(null)}>
                    {errorMessage}
                </Alert>
            )}

            <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 3 }}>
                {/* STEP 1: PERSONAL & CONTACT INFORMATION */}
                {activeStep === 0 && (
                    <Stack spacing={3}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            1. Personal & Identity Information
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    value={formData.first_name}
                                    onChange={handleTextChange('first_name')}
                                    required
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    fullWidth
                                    label="Middle Names"
                                    value={formData.middle_names}
                                    onChange={handleTextChange('middle_names')}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    value={formData.last_name}
                                    onChange={handleTextChange('last_name')}
                                    required
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    type="email"
                                    label="Email Address"
                                    value={formData.email}
                                    onChange={handleTextChange('email')}
                                    required
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    value={formData.phone}
                                    onChange={handleTextChange('phone')}
                                    placeholder="+260971234567"
                                    required
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Date of Birth"
                                    value={formData.dob}
                                    onChange={handleTextChange('dob')}
                                    SlotProps={{ inputLabel: { shrink: true } }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Sex"
                                    value={formData.sex}
                                    onChange={handleTextChange('sex')}
                                    required
                                >
                                    <MenuItem value="male">Male</MenuItem>
                                    <MenuItem value="female">Female</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Marital Status"
                                    value={formData.marital_status}
                                    onChange={handleTextChange('marital_status')}
                                    required
                                >
                                    <MenuItem value="single">Single</MenuItem>
                                    <MenuItem value="married">Married</MenuItem>
                                    <MenuItem value="widow">Widow</MenuItem>
                                    <MenuItem value="divorced">Divorced</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    fullWidth
                                    label="Nationality"
                                    value={formData.nationality}
                                    onChange={handleTextChange('nationality')}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    fullWidth
                                    label="NRC Number"
                                    value={formData.nrc_number}
                                    onChange={handleTextChange('nrc_number')}
                                    placeholder="123456/11/1"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    fullWidth
                                    label="Passport Number"
                                    value={formData.passport_number}
                                    onChange={handleTextChange('passport_number')}
                                    placeholder="Z1234567"
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={2}
                                    label="Residential Address"
                                    value={formData.address}
                                    onChange={handleTextChange('address')}
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    fullWidth
                                    label="Emergency Contact Person & Phone"
                                    value={formData.emergency_contact}
                                    onChange={handleTextChange('emergency_contact')}
                                    placeholder="e.g. John Phiri (+260977654321)"
                                />
                            </Grid>
                        </Grid>
                    </Stack>
                )}

                {/* STEP 2: PROGRAM & STUDY SELECTION */}
                {activeStep === 1 && (
                    <Stack spacing={3}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            2. Select Academic Program & Intake
                        </Typography>

                        <TextField
                            select
                            fullWidth
                            label="Target Academic Program"
                            value={formData.program_public_id}
                            onChange={handleTextChange('program_public_id')}
                            required
                        >
                            {MOCK_PROGRAMS.map((prog) => (
                                <MenuItem key={prog.id} value={prog.id}>
                                    {prog.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Intake"
                                    value={formData.intake}
                                    onChange={handleTextChange('intake')}
                                    required
                                >
                                    <MenuItem value="January">January</MenuItem>
                                    <MenuItem value="May">May</MenuItem>
                                    <MenuItem value="September">September</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Study Mode"
                                    value={formData.study_mode}
                                    onChange={handleTextChange('study_mode')}
                                    required
                                >
                                    <MenuItem value="full_time">Full Time</MenuItem>
                                    <MenuItem value="part_time">Part Time</MenuItem>
                                    <MenuItem value="distance_learning">Distance Learning</MenuItem>
                                    <MenuItem value="online">Online</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                    </Stack>
                )}

                {/* STEP 3: DOCUMENT UPLOADS */}
                {activeStep === 2 && (
                    <Stack spacing={3}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            3. Upload Supporting Documents
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {/* Document item renderer */}
                            {[
                                {
                                    key: 'certificate' as const,
                                    label: 'Highschool Certificate / Transcript',
                                    required: true,
                                },
                                {
                                    key: 'nrcOrPassport' as const,
                                    label: 'NRC or Passport Copy',
                                    required: true,
                                },
                                {
                                    key: 'depositSlip' as const,
                                    label: 'Application Fee Deposit Slip',
                                    required: true,
                                },
                                {
                                    key: 'exemptionTranscript' as const,
                                    label: 'Exemption Transcript',
                                    required: false,
                                },
                            ].map((doc) => {
                                const currentFile = files[doc.key];
                                const loadingThis = isUploading === doc.key;

                                return (
                                    <Paper
                                        key={doc.key}
                                        variant="outlined"
                                        sx={{
                                            p: 2,
                                            display: 'flex',
                                            justify: 'space-between',
                                            alignItems: 'center',
                                            borderRadius: 2,
                                        }}
                                    >
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                {doc.label} {doc.required ? '*' : '(Optional)'}
                                            </Typography>
                                            {currentFile && (
                                                <Chip
                                                    icon={<CheckIcon />}
                                                    label={currentFile.name}
                                                    color="success"
                                                    size="small"
                                                    sx={{ mt: 0.5 }}
                                                />
                                            )}
                                        </Box>

                                        <Box>
                                            {currentFile ? (
                                                <IconButton color="error" onClick={() => handleRemoveFile(doc.key)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            ) : (
                                                <Button
                                                    component="label"
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={
                                                        loadingThis ? <CircularProgress size={16} /> : <UploadIcon />
                                                    }
                                                    disabled={Boolean(isUploading)}
                                                >
                                                    Upload File
                                                    <input
                                                        type="file"
                                                        hidden
                                                        accept=".pdf,.png,.jpg,.jpeg"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) handleFileUpload(doc.key, file);
                                                        }}
                                                    />
                                                </Button>
                                            )}
                                        </Box>
                                    </Paper>
                                );
                            })}
                        </Box>
                    </Stack>
                )}

                {/* STEPPER CONTROLS */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                    <Button
                        disabled={activeStep === 0 || isSubmitting}
                        onClick={() => setActiveStep((prev) => prev - 1)}
                        startIcon={<ArrowBackIcon />}
                    >
                        Back
                    </Button>

                    {activeStep < STEPS.length - 1 ? (
                        <Button
                            variant="contained"
                            onClick={() => setActiveStep((prev) => prev + 1)}
                            disabled={activeStep === 0 ? !isStep1Valid : !isStep2Valid}
                            endIcon={<ArrowForwardIcon />}
                        >
                            Next Step
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleSubmit}
                            disabled={!isStep3Valid || isSubmitting}
                            startIcon={
                                isSubmitting ? <CircularProgress size={20} color="inherit" /> : <SendIcon />
                            }
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Application'}
                        </Button>
                    )}
                </Box>
            </Paper>
        </Container>
    );
}