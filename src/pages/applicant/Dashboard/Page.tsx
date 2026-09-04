import {
    Container,
    Typography,
    Paper,
    Box,
    Grid,
    Button,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Card,
    CardContent,
    Divider
} from '@mui/material';
import {
    CheckCircle as CheckIcon,
    Cancel as CrossIcon,
    HourglassEmpty as PendingIcon,
    ArrowForward as ArrowForwardIcon,
    UploadFile as UploadIcon,
    Payment as PaymentIcon,
    AssignmentTurnedIn as RegistrationIcon,
    Lock as LockIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Types for Applicant Status (Replace with API response data as needed)
type AdmissionStatus = 'pending' | 'admitted' | 'rejected';

interface ApplicationProgress {
    detailsCompleted: boolean;
    documentsUploaded: boolean;
    admissionStatus: AdmissionStatus;
    feesPaid: boolean;
    documentsSubmitted: boolean;
}

export default function ApplicantDashboard() {
    const navigate = useNavigate();

    // Mock progress data — replace with custom hook/API call (e.g., useApplicantData())
    const progress: ApplicationProgress = {
        detailsCompleted: true,
        documentsUploaded: true,
        admissionStatus: 'pending', // 'pending' | 'admitted' | 'rejected'
        feesPaid: false,
        documentsSubmitted: false,
    };

    const isApplicationComplete = progress.detailsCompleted && progress.documentsUploaded;
    const isAdmitted = progress.admissionStatus === 'admitted';
    const isRejected = progress.admissionStatus === 'rejected';

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Greeting Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                    Application Status & Progress
                </Typography>

                <Typography variant="body1" color="text.secondary">
                    Track your application process, check admission results, and complete enrollment steps.
                </Typography>
            </Box>

            {/* Main Grid Tracker */}
            <Grid container spacing={3}>

                {/* STAGE 1: APPLY */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card
                        variant="outlined"
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: 3,
                            borderColor: isApplicationComplete ? 'success.main' : 'divider',
                            borderWidth: isApplicationComplete ? 2 : 1,
                        }}
                    >
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                                    Step 1
                                </Typography>
                                {isApplicationComplete ? (
                                    <Chip icon={<CheckIcon />} label="Completed" color="success" size="small" />
                                ) : (
                                    <Chip label="In Progress" color="warning" size="small" />
                                )}
                            </Box>

                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                Submit Application
                            </Typography>

                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Fill out your personal info, academic details, and upload all required documents.
                            </Typography>

                            <List size="small" disablePadding>
                                <ListItem disableGutters>
                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                        {progress.detailsCompleted ? <CheckIcon color="success" fontSize="small" /> : <PendingIcon color="action" fontSize="small" />}
                                    </ListItemIcon>
                                    <ListItemText primary="Personal & Academic Details" primaryTypographyProps={{ variant: 'body2' }} />
                                </ListItem>
                                <ListItem disableGutters>
                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                        {progress.documentsUploaded ? <CheckIcon color="success" fontSize="small" /> : <UploadIcon color="action" fontSize="small" />}
                                    </ListItemIcon>
                                    <ListItemText primary="Document Uploads" primaryTypographyProps={{ variant: 'body2' }} />
                                </ListItem>
                            </List>
                        </CardContent>

                        <Divider />

                        <Box sx={{ p: 2 }}>
                            <Button
                                fullWidth
                                variant={isApplicationComplete ? 'outlined' : 'contained'}
                                color="primary"
                                endIcon={<ArrowForwardIcon />}
                                onClick={() => navigate('/applicant/application')}
                            >
                                {isApplicationComplete ? 'View Application' : 'Complete Application'}
                            </Button>
                        </Box>
                    </Card>
                </Grid>

                {/* STAGE 2: ADMISSION */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card
                        variant="outlined"
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: 3,
                            borderColor: isAdmitted ? 'success.main' : isRejected ? 'error.main' : 'divider',
                            borderWidth: isAdmitted || isRejected ? 2 : 1,
                        }}
                    >
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                                    Step 2
                                </Typography>
                                {isAdmitted && <Chip icon={<CheckIcon />} label="Admitted" color="success" size="small" />}
                                {isRejected && <Chip icon={<CrossIcon />} label="Not Admitted" color="error" size="small" />}
                                {progress.admissionStatus === 'pending' && <Chip icon={<PendingIcon />} label="Under Review" color="info" size="small" />}
                            </Box>

                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                Admission Status
                            </Typography>

                            <Box sx={{ textAlign: 'center', py: 3 }}>
                                {isAdmitted && (
                                    <>
                                        <CheckIcon color="success" sx={{ fontSize: 48, mb: 1 }} />
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'success.main' }}>
                                            Congratulations!
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            You have been offered admission to the university.
                                        </Typography>
                                    </>
                                )}

                                {isRejected && (
                                    <>
                                        <CrossIcon color="error" sx={{ fontSize: 48, mb: 1 }} />
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'error.main' }}>
                                            Application Unsuccessful
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Unfortunately, we are unable to offer you admission at this time.
                                        </Typography>
                                    </>
                                )}

                                {progress.admissionStatus === 'pending' && (
                                    <>
                                        <PendingIcon color="info" sx={{ fontSize: 48, mb: 1 }} />
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                            Under Committee Review
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Your application has been received and is currently being evaluated.
                                        </Typography>
                                    </>
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* STAGE 3: REGISTRATION */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card
                        variant="outlined"
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: 3,
                            opacity: isAdmitted ? 1 : 0.6,
                            backgroundColor: isAdmitted ? 'background.paper' : 'action.hover',
                        }}
                    >
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                                    Step 3
                                </Typography>
                                {!isAdmitted ? (
                                    <Chip icon={<LockIcon />} label="Locked" size="small" variant="outlined" />
                                ) : (
                                    <Chip label="Action Required" color="primary" size="small" />
                                )}
                            </Box>

                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                Complete Registration
                            </Typography>

                            {!isAdmitted ? (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <LockIcon color="disabled" sx={{ fontSize: 40, mb: 1 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        Registration instructions will unlock once your admission is approved.
                                    </Typography>
                                </Box>
                            ) : (
                                <>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Follow the steps below to finalize your student enrolment:
                                    </Typography>

                                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                                        <List size="small" disablePadding>
                                            <ListItem disableGutters>
                                                <ListItemIcon sx={{ minWidth: 32 }}>
                                                    <PaymentIcon color="primary" fontSize="small" />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary="1. Pay Acceptance & Tuition Fees"
                                                    secondary="Bank transfer or online payment portal"
                                                />
                                            </ListItem>
                                            <ListItem disableGutters sx={{ mt: 1 }}>
                                                <ListItemIcon sx={{ minWidth: 32 }}>
                                                    <RegistrationIcon color="primary" fontSize="small" />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary="2. Submit Physical Documents"
                                                    secondary="Bring certified copies to the Admissions Office"
                                                />
                                            </ListItem>
                                        </List>
                                    </Paper>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

            </Grid>
        </Container>
    );
}