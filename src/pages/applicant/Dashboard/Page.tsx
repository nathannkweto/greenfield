import { useQuery } from '@apollo/client/react';
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
    Divider,
    CircularProgress,
    Alert
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
import { GET_ME } from '../../../graphql/queries/auth';
import type { AuthUser } from '../../../context/AuthContext';

export default function ApplicantDashboard() {
    const navigate = useNavigate();

    const { data, loading, error } = useQuery<{ me: AuthUser }>(GET_ME);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" disableGutters>
                <Alert severity="error">
                    Failed to load application progress. Please try refreshing the page.
                </Alert>
            </Container>
        );
    }

    const studentProfile = data?.me?.students?.[0];
    const hasStudentProfile = Boolean(studentProfile);
    const rawStatus = (studentProfile?.status || '').toLowerCase();

    const isSubmitted = hasStudentProfile;
    const isPending = rawStatus === 'pending';
    const isAdmitted = rawStatus === 'admitted' || rawStatus === 'registered';
    const isRejected = rawStatus === 'rejected';

    return (
        /* Reduced vertical padding to prevent layout stacking */
        <Container maxWidth="lg" disableGutters sx={{ py: 1 }}>
            {/* Header */}
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
                            borderColor: isSubmitted ? 'success.main' : 'primary.main',
                            borderWidth: 2,
                        }}
                    >
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                                    Step 1
                                </Typography>
                                {isSubmitted ? (
                                    <Chip icon={<CheckIcon />} label="Completed" color="success" size="small" />
                                ) : (
                                    <Chip label="In Progress" color="warning" size="small" />
                                )}
                            </Box>

                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                Submit Application
                            </Typography>

                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {isSubmitted
                                    ? 'Your application details and documents have been successfully submitted.'
                                    : 'Fill out your personal info, academic details, and upload all required documents.'}
                            </Typography>

                            <List dense disablePadding>
                                <ListItem disableGutters>
                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                        {isSubmitted ? <CheckIcon color="success" fontSize="small" /> : <PendingIcon color="action" fontSize="small" />}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Personal & Academic Details"
                                        slotProps={{ primary: { variant: 'body2' } }}
                                    />
                                </ListItem>
                                <ListItem disableGutters>
                                    <ListItemIcon sx={{ minWidth: 32 }}>
                                        {isSubmitted ? <CheckIcon color="success" fontSize="small" /> : <UploadIcon color="action" fontSize="small" />}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary="Document Uploads"
                                        slotProps={{ primary: { variant: 'body2' } }}
                                    />
                                </ListItem>
                            </List>
                        </CardContent>

                        <Divider />

                        <Box sx={{ p: 2 }}>
                            <Button
                                fullWidth
                                variant={isSubmitted ? 'outlined' : 'contained'}
                                color="primary"
                                endIcon={<ArrowForwardIcon />}
                                onClick={() => navigate('/applicant/application')}
                            >
                                {isSubmitted ? 'View Application' : 'Complete Application'}
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
                            borderColor: isAdmitted ? 'success.main' : isRejected ? 'error.main' : isPending ? 'info.main' : 'divider',
                            borderWidth: isAdmitted || isRejected || isPending ? 2 : 1,
                            opacity: isSubmitted ? 1 : 0.6,
                        }}
                    >
                        <CardContent sx={{ flexGrow: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                                    Step 2
                                </Typography>
                                {isAdmitted && <Chip icon={<CheckIcon />} label="Admitted" color="success" size="small" />}
                                {isRejected && <Chip icon={<CrossIcon />} label="Not Admitted" color="error" size="small" />}
                                {isPending && <Chip icon={<PendingIcon />} label="Under Review" color="info" size="small" />}
                                {!isSubmitted && <Chip icon={<LockIcon />} label="Locked" size="small" variant="outlined" />}
                            </Box>

                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                                Admission Status
                            </Typography>

                            <Box sx={{ textAlign: 'center', py: 3 }}>
                                {!isSubmitted && (
                                    <>
                                        <LockIcon color="disabled" sx={{ fontSize: 48, mb: 1 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            Submit your application to enter committee review.
                                        </Typography>
                                    </>
                                )}

                                {isSubmitted && isAdmitted && (
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

                                {isSubmitted && isRejected && (
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

                                {isSubmitted && isPending && (
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
                            borderColor: isAdmitted ? 'primary.main' : 'divider',
                            borderWidth: isAdmitted ? 2 : 1,
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
                                        Follow the steps below to finalize your student enrollment:
                                    </Typography>

                                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                                        <List dense disablePadding>
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