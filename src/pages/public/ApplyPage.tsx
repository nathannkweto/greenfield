import { useState, type ChangeEvent, type FormEvent } from 'react';
import {
    Container,
    Typography,
    Paper,
    Button,
    TextField,
    Stack,
    Grid,
    Alert,
    CircularProgress,
    Link
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getApplicants } from '../../api/generated';

const { postApplicantsCreate } = getApplicants();

export default function ApplyPage() {
    const navigate = useNavigate();

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    const [formData, setFormData] = useState({
        first_name: '',
        middle_names: '',
        last_name: '',
        email: '',
        phone: '',
    });

    const handleChange = (field: keyof typeof formData) => (e: ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const isFormValid = Boolean(
        formData.first_name &&
        formData.last_name &&
        formData.email &&
        formData.phone
    );

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;

        setIsSubmitting(true);
        setSubmitError(null);

        try {
            await postApplicantsCreate({
                first_name: formData.first_name,
                middle_names: formData.middle_names || null,
                last_name: formData.last_name,
                email: formData.email,
                phone: formData.phone,
            });

            setIsSuccess(true);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                const responseData = err.response?.data;
                if (err.response?.status === 422 && responseData?.errors) {
                    const firstFieldError = Object.values(responseData.errors)[0] as string[];
                    setSubmitError(firstFieldError?.[0] || 'Validation failed. Check your inputs.');
                } else {
                    setSubmitError(responseData?.message || responseData?.error || 'Failed to create applicant profile.');
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
                        Account Created Successfully!
                    </Typography>

                    <Typography variant="body1" color="text.secondary">
                        Thank you for creating an account, please{' '}
                        <Link
                            component="button"
                            variant="body1"
                            onClick={() => navigate('/login')}
                            sx={{ verticalAlign: 'baseline', fontWeight: 700, cursor: 'pointer' }}
                        >
                            login
                        </Link>{' '}
                        with your email and password sent to your email.
                    </Typography>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm" sx={{ py: { xs: 4, md: 6 } }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, textAlign: 'center' }}>
                Create Applicant Profile
            </Typography>

            {submitError && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setSubmitError(null)}>
                    {submitError}
                </Alert>
            )}

            <Paper
                component="form"
                onSubmit={handleSubmit}
                variant="outlined"
                sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, borderColor: '#e2e8f0' }}
            >
                <Stack spacing={2.5}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="First Name"
                                value={formData.first_name}
                                onChange={handleChange('first_name')}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                label="Middle Names"
                                value={formData.middle_names}
                                onChange={handleChange('middle_names')}
                                helperText="Optional"
                            />
                        </Grid>
                    </Grid>

                    <TextField
                        fullWidth
                        label="Last Name"
                        value={formData.last_name}
                        onChange={handleChange('last_name')}
                        required
                    />

                    <TextField
                        fullWidth
                        label="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={handleChange('email')}
                        required
                    />

                    <TextField
                        fullWidth
                        label="Phone Number"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange('phone')}
                        placeholder="+260971234567"
                        required
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        size="large"
                        disabled={isSubmitting || !isFormValid}
                        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                        sx={{ mt: 1 }}
                    >
                        {isSubmitting ? 'Creating Account...' : 'Submit Profile'}
                    </Button>
                </Stack>
            </Paper>
        </Container>
    );
}