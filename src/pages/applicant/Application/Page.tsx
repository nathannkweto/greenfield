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
    Chip,
    ListSubheader,
    ToggleButtonGroup,
    ToggleButton
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
import { useQuery } from '@apollo/client/react';

// Local GraphQL Queries
import { GET_SCHOOLS_WITH_PROGRAMS } from '../Info/queries';

// Generated Orval imports
import { getStudents, getFiles } from '../../../api/generated';
import type {
    ApplicationRequest,
    ApplicationRequestSex,
    ApplicationRequestMaritalStatus,
    ApplicationRequestIntake,
    ApplicationRequestStudyMode
} from '../../../api/generated';

// Auth Context/Hook
import { useAuth } from '../../../context/AuthContext';

export interface ApplicationFormData {
    user_public_id?: string;
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
    deposit_slip_file_public_id: string | null;
    exemption_transcript_file_public_id: string | null;
}

interface UploadedFiles {
    certificate: { name: string; file_id: string } | null;
    nrcOrPassport: { name: string; file_id: string } | null;
    depositSlip: { name: string; file_id: string } | null;
    exemptionTranscript: { name: string; file_id: string } | null;
}

interface Program {
    id: string;
    title: string;
    level: string;
}

interface School {
    id: string;
    name: string;
    programs: Program[];
}

interface SchoolsWithProgramsData {
    schools: {
        edges: Array<{
            node: School;
        }>;
    };
}

const STEPS = ['Personal & Contact Info', 'Program & Study Mode', 'Document Uploads'];

const STATIC_KEY_TO_FIELD_MAP: Partial<Record<keyof UploadedFiles, keyof ApplicationFormData>> = {
    certificate: 'certificate_file_public_id',
    depositSlip: 'deposit_slip_file_public_id',
    exemptionTranscript: 'exemption_transcript_file_public_id',
};

export default function ApplicationPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const applicant = user?.applicants?.[0];

    // Check for existing student profile
    const studentProfile = user?.students?.[0];
    const hasStudentProfile = Boolean(studentProfile);

    const { data: schoolsData, loading: loadingSchools, error: schoolsError } = useQuery<SchoolsWithProgramsData>(
        GET_SCHOOLS_WITH_PROGRAMS,
        { skip: hasStudentProfile } // Skip GraphQL query if student profile already exists
    );

    const [activeStep, setActiveStep] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isUploading, setIsUploading] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Dynamic Identity Selection State
    const [identityType, setIdentityType] = useState<'nrc' | 'passport'>('nrc');

    const [formData, setFormData] = useState<ApplicationFormData>(() => ({
        user_public_id: user?.id || '',
        program_public_id: '',
        first_name: applicant?.firstName || '',
        middle_names: applicant?.middleNames || '',
        last_name: applicant?.lastName || '',
        email: applicant?.email || user?.email || '',
        phone: applicant?.phone || user?.phone || '',
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
        deposit_slip_file_public_id: null,
        exemption_transcript_file_public_id: null,
    }));

    // Adjust state during render when user context resolves to avoid effect cascading renders
    const [prevUser, setPrevUser] = useState(user);
    if (user !== prevUser) {
        setPrevUser(user);
        const currentApplicant = user?.applicants?.[0];
        setFormData((prev) => ({
            ...prev,
            user_public_id: prev.user_public_id || user?.id || '',
            first_name: prev.first_name || currentApplicant?.firstName || '',
            middle_names: prev.middle_names || currentApplicant?.middleNames || '',
            last_name: prev.last_name || currentApplicant?.lastName || '',
            email: prev.email || currentApplicant?.email || user?.email || '',
            phone: prev.phone || currentApplicant?.phone || user?.phone || '',
        }));
    }

    const [files, setFiles] = useState<UploadedFiles>({
        certificate: null,
        nrcOrPassport: null,
        depositSlip: null,
        exemptionTranscript: null,
    });

    // Display notice if user already has an active profile
    if (hasStudentProfile) {
        return (
            <Container maxWidth="sm" sx={{ py: 8 }}>
                <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderRadius: 3 }}>
                    <Alert severity="info" sx={{ mb: 3, justifyContent: 'center' }}>
                        An application profile already exists for your account.
                    </Alert>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        You have already submitted an application. You can view your current status and progress directly on your dashboard.
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/applicant/dashboard')}
                    >
                        Go to Dashboard
                    </Button>
                </Paper>
            </Container>
        );
    }

    // Handle dynamic Identity Type changes and clear opposite payload state
    const handleIdentityTypeChange = (
        _: React.MouseEvent<HTMLElement>,
        newType: 'nrc' | 'passport' | null
    ) => {
        if (!newType) return;
        setIdentityType(newType);

        // Automated Payload Cleanup
        setFormData((prev) => ({
            ...prev,
            nrc_number: newType === 'nrc' ? prev.nrc_number : '',
            passport_number: newType === 'passport' ? prev.passport_number : '',
            nrc_file_public_id: newType === 'nrc' ? prev.nrc_file_public_id : null,
            passport_file_public_id: newType === 'passport' ? prev.passport_file_public_id : null,
        }));
    };

    const handleTextChange = (field: keyof ApplicationFormData) => (e: ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleFileUpload = async (fileKey: keyof UploadedFiles, file: File) => {
        setIsUploading(fileKey);
        setErrorMessage(null);

        const collectionMap: Record<keyof UploadedFiles, string> = {
            certificate: 'certificate_document',
            nrcOrPassport: 'identity_document',
            depositSlip: 'payment_receipt',
            exemptionTranscript: 'transcript_document',
        };

        try {
            const { postFilesUpload } = getFiles();

            const response = await postFilesUpload({
                file,
                collection: collectionMap[fileKey],
            });

            const uploadedId = response?.data?.public_id;

            setFiles((prev) => ({
                ...prev,
                [fileKey]: { name: file.name, file_id: uploadedId },
            }));

            // Resolve dynamic identity mapping based on active identity selection
            const targetField: keyof ApplicationFormData =
                fileKey === 'nrcOrPassport'
                    ? identityType === 'nrc'
                        ? 'nrc_file_public_id'
                        : 'passport_file_public_id'
                    : (STATIC_KEY_TO_FIELD_MAP[fileKey] as keyof ApplicationFormData);

            setFormData((prev) => ({
                ...prev,
                [targetField]: uploadedId,
            }));
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setErrorMessage(err.response?.data?.message || `Failed to upload ${file.name}.`);
            } else {
                setErrorMessage(`Failed to upload ${file.name}.`);
            }
        } finally {
            setIsUploading(null);
        }
    };

    const handleRemoveFile = (fileKey: keyof UploadedFiles) => {
        setFiles((prev) => ({ ...prev, [fileKey]: null }));

        const targetField: keyof ApplicationFormData =
            fileKey === 'nrcOrPassport'
                ? identityType === 'nrc'
                    ? 'nrc_file_public_id'
                    : 'passport_file_public_id'
                : (STATIC_KEY_TO_FIELD_MAP[fileKey] as keyof ApplicationFormData);

        setFormData((prev) => ({ ...prev, [targetField]: null }));
    };

    // Step 1 Validation including Identity Document requirement
    const isStep1Valid = Boolean(
        formData.first_name?.trim() &&
        formData.last_name?.trim() &&
        formData.email?.trim() &&
        formData.phone?.trim() &&
        formData.sex &&
        formData.marital_status &&
        (identityType === 'nrc' ? formData.nrc_number?.trim() : formData.passport_number?.trim())
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
            const { postApply } = getStudents();

            const payload: ApplicationRequest = {
                user_public_id: user?.id || formData.user_public_id || '',
                program_public_id: formData.program_public_id,
                first_name: formData.first_name,
                middle_names: formData.middle_names || null,
                last_name: formData.last_name,
                email: formData.email,
                phone: formData.phone,
                dob: formData.dob || null,
                address: formData.address || null,
                emergency_contact: formData.emergency_contact || null,
                sex: formData.sex as ApplicationRequestSex,
                marital_status: formData.marital_status as ApplicationRequestMaritalStatus,
                nationality: formData.nationality,
                nrc_number: identityType === 'nrc' ? formData.nrc_number || null : null,
                passport_number: identityType === 'passport' ? formData.passport_number || null : null,
                intake: formData.intake as ApplicationRequestIntake,
                study_mode: formData.study_mode as ApplicationRequestStudyMode,
                nrc_file_public_id: identityType === 'nrc' ? formData.nrc_file_public_id : null,
                passport_file_public_id: identityType === 'passport' ? formData.passport_file_public_id : null,
                certificate_file_public_id: formData.certificate_file_public_id,
                deposit_slip_file_public_id: formData.deposit_slip_file_public_id,
                exemption_transcript_file_public_id: formData.exemption_transcript_file_public_id,
            };

            await postApply(payload);
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
                                    disabled={Boolean(applicant?.firstName)}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    fullWidth
                                    label="Middle Names"
                                    value={formData.middle_names}
                                    onChange={handleTextChange('middle_names')}
                                    disabled={Boolean(applicant?.middleNames)}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    value={formData.last_name}
                                    onChange={handleTextChange('last_name')}
                                    required
                                    disabled={Boolean(applicant?.lastName)}
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
                                    disabled={Boolean(applicant?.email || user?.email)}
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
                                    disabled={Boolean(applicant?.phone || user?.phone)}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, sm: 4 }}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Date of Birth"
                                    value={formData.dob}
                                    onChange={handleTextChange('dob')}
                                    slotProps={{ inputLabel: { shrink: true } }}
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

                            {/* DYNAMIC IDENTITY DOCUMENT SELECTOR */}
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                    Identification Type *
                                </Typography>
                                <ToggleButtonGroup
                                    value={identityType}
                                    exclusive
                                    onChange={handleIdentityTypeChange}
                                    fullWidth
                                    size="small"
                                >
                                    <ToggleButton value="nrc">NRC</ToggleButton>
                                    <ToggleButton value="passport">Passport</ToggleButton>
                                </ToggleButtonGroup>
                            </Grid>

                            <Grid size={{ xs: 12, sm: 4 }}>
                                {identityType === 'nrc' ? (
                                    <TextField
                                        fullWidth
                                        label="NRC Number"
                                        value={formData.nrc_number}
                                        onChange={handleTextChange('nrc_number')}
                                        placeholder="123456/11/1"
                                        required
                                    />
                                ) : (
                                    <TextField
                                        fullWidth
                                        label="Passport Number"
                                        value={formData.passport_number}
                                        onChange={handleTextChange('passport_number')}
                                        placeholder="Z1234567"
                                        required
                                    />
                                )}
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
                            disabled={loadingSchools}
                            error={Boolean(schoolsError)}
                            helperText={schoolsError ? 'Failed to load programs' : ''}
                        >
                            {loadingSchools ? (
                                <MenuItem disabled value="">
                                    <CircularProgress size={20} sx={{ mr: 1 }} /> Loading programs...
                                </MenuItem>
                            ) : (
                                (schoolsData?.schools?.edges || [])
                                    .map((edge) => edge.node)
                                    .flatMap((school) => [
                                        <ListSubheader
                                            key={`school-${school.id}`}
                                            sx={{ fontWeight: 700, color: 'text.primary', bgcolor: 'background.paper' }}
                                        >
                                            {school.name}
                                        </ListSubheader>,
                                        ...school.programs.map((prog) => (
                                            <MenuItem key={prog.id} value={prog.id} sx={{ pl: 4 }}>
                                                {prog.title} ({prog.level})
                                            </MenuItem>
                                        )),
                                    ])
                            )}
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
                            {[
                                {
                                    key: 'certificate' as const,
                                    label: 'Highschool Certificate / Transcript',
                                    required: true,
                                },
                                {
                                    key: 'nrcOrPassport' as const,
                                    label: identityType === 'nrc' ? 'NRC Copy' : 'Passport Copy',
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
                                                            e.target.value = '';
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