import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios, { AxiosError } from 'axios';
import {
    TextField,
    Button,
    Typography,
    Paper,
    Container,
    Box,
    IconButton,
    InputAdornment,
    Alert,
    CircularProgress
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Adjust this import path to match your generated Orval folder location
import { getPublicAuth } from '../../api/generated';

interface ValidationErrorResponse {
    errors?: Record<string, string[]>;
}

export default function LoginPage() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const blockInjectionRegex = new RegExp("^[^<>/\\\\\"'%]+$");

    const validationSchema = Yup.object({
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required'),
        password: Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .matches(blockInjectionRegex, 'Password contains invalid characters')
            .required('Password is required'),
    });

    const formik = useFormik({
        initialValues: { email: '', password: '' },
        validationSchema: validationSchema,
        onSubmit: async (values, { setSubmitting, setFieldError, setStatus }) => {
            setStatus(null);
            const normalizedEmail = values.email.toLowerCase().trim();

            try {
                // 1. Initialize Sanctum CSRF Cookie
                await getPublicAuth().getSanctumCsrfCookie();

                // 2. Submit credentials to Sanctum session endpoint
                const response = await getPublicAuth().postAuthLogin({
                    email: normalizedEmail,
                    password: values.password,
                });

                // 3. Extract user roles array from API response
                const user = response?.user;
                const roles = user?.roles ?? [];

                // 4. Check for roles using Array.includes()
                const isAdmin = Array.isArray(roles) && roles.includes('admin');
                const isLecturer = Array.isArray(roles) && roles.includes('lecturer');
                const isStudent = Array.isArray(roles) && roles.includes('student');

                if (isAdmin) {
                    navigate('/admin/dashboard');
                } else if (isLecturer) {
                    navigate('/lecturer/dashboard');
                } else if (isStudent) {
                    navigate('/student/dashboard');
                } else {
                    navigate('/dashboard');
                }
            } catch (error: unknown) {
                if (Axios.isAxiosError(error)) {
                    const axiosError = error as AxiosError<ValidationErrorResponse>;
                    const status = axiosError.response?.status;

                    if (status === 401) {
                        setFieldError('password', 'Invalid email or password.');
                    } else if (status === 422) {
                        const validationErrors = axiosError.response?.data?.errors;
                        if (validationErrors?.email?.[0]) {
                            setFieldError('email', validationErrors.email[0]);
                        }
                        if (validationErrors?.password?.[0]) {
                            setFieldError('password', validationErrors.password[0]);
                        }
                    } else {
                        setStatus('Unable to connect to authentication server. Please try again.');
                    }
                } else {
                    setStatus('An unexpected error occurred. Please try again.');
                }
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '75vh',
                width: '100%',
                py: 4
            }}
        >
            <Container maxWidth="xs">
                <Paper
                    variant="outlined"
                    sx={{
                        p: 4,
                        borderRadius: 3,
                        borderColor: '#e5e7eb',
                        backgroundColor: 'background.paper'
                    }}
                >
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, textAlign: 'center', color: 'text.primary' }}>
                        Login
                    </Typography>

                    {formik.status && (
                        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                            {formik.status}
                        </Alert>
                    )}

                    <form onSubmit={formik.handleSubmit}>
                        {/* Email Input */}
                        <TextField
                            fullWidth
                            id="email"
                            name="email"
                            label="Email Address"
                            value={formik.values.email}
                            onChange={formik.handleChange}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            disabled={formik.isSubmitting}
                            sx={{ mb: 2 }}
                        />

                        {/* Password Input */}
                        <TextField
                            fullWidth
                            id="password"
                            name="password"
                            label="Password"
                            type={showPassword ? 'text' : 'password'}
                            value={formik.values.password}
                            onChange={formik.handleChange}
                            error={formik.touched.password && Boolean(formik.errors.password)}
                            helperText={formik.touched.password && formik.errors.password}
                            disabled={formik.isSubmitting}
                            sx={{ mb: 3 }}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                edge="end"
                                                disabled={formik.isSubmitting}
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }
                            }}
                        />

                        {/* Sign In Button */}
                        <Button
                            color="primary"
                            variant="contained"
                            disableElevation
                            fullWidth
                            type="submit"
                            disabled={formik.isSubmitting}
                            sx={{ py: 1.2, borderRadius: 2, textTransform: 'none', fontSize: '1rem' }}
                        >
                            {formik.isSubmitting ? (
                                <CircularProgress size={24} color="inherit" />
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
}