import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Container, Typography, Paper, Button, Avatar, Chip, Grid, Divider, LinearProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';

import { MOCK_STUDENTS } from '../../data/studentsData';

export default function StudentDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const student = MOCK_STUDENTS.find(s => s.id === id);

    if (!student) {
        return (
            <Container sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="h5">Student not found</Typography>
                <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>Go Back</Button>
            </Container>
        );
    }

    const progressPercent = (student.academicDetails.creditsCompleted / student.academicDetails.creditsRequired) * 100;

    return (
        <Box sx={{ backgroundColor: 'background.default', minHeight: '70vh', width: '100%', py: { xs: 2, md: 4 } }}>
            <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ alignSelf: 'flex-start' }}>
                    Back to List
                </Button>

                {/* Header Profile Card */}
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 3 }}>
                    <Avatar sx={{ width: 80, height: 80, backgroundColor: 'primary.main' }}>
                        <PersonIcon sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 200 }}>
                        <Typography variant="h4" sx={{ fontWeight: 800 }}>{student.firstName} {student.lastName}</Typography>
                        <Typography variant="subtitle1" color="text.secondary">{student.id} | {student.program}</Typography>
                        <Typography variant="body2" color="text.secondary">{student.school}</Typography>
                    </Box>
                    <Chip
                        label={student.status}
                        color={student.status === 'Registered' ? 'success' : student.status === 'Pending' ? 'warning' : 'default'}
                        sx={{ fontWeight: 600 }}
                    />
                </Paper>

                <Grid container spacing={3}>
                    {/* Left Column: Personal & Financial (FIXED FOR MUI V6) */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                            {/* Personal Details */}
                            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Personal Details</Typography>
                                <Typography variant="body2" color="text.secondary">Email</Typography>
                                <Typography variant="body1" sx={{ mb: 1.5 }}>{student.email}</Typography>

                                <Typography variant="body2" color="text.secondary">Phone</Typography>
                                <Typography variant="body1" sx={{ mb: 1.5 }}>{student.phone}</Typography>

                                <Typography variant="body2" color="text.secondary">Date of Birth</Typography>
                                <Typography variant="body1" sx={{ mb: 1.5 }}>{student.personalDetails.dob}</Typography>

                                <Typography variant="body2" color="text.secondary">Emergency Contact</Typography>
                                <Typography variant="body1">{student.personalDetails.emergencyContact}</Typography>
                            </Paper>

                            {/* Financial Details (Only if registered) */}
                            {student.status === 'Registered' && student.financialDetails && (
                                <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, backgroundColor: 'primary.dark', color: 'white' }}>
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Fees Overview</Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2">Total Billed:</Typography>
                                        <Typography variant="body2">{student.financialDetails.totalBilled.toLocaleString()} {student.financialDetails.currency}</Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="body2">Total Paid:</Typography>
                                        <Typography variant="body2">{student.financialDetails.totalPaid.toLocaleString()} {student.financialDetails.currency}</Typography>
                                    </Box>
                                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)', my: 1 }} />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#ffb7b2' }}>Balance:</Typography>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#ffb7b2' }}>{student.financialDetails.balance.toLocaleString()} {student.financialDetails.currency}</Typography>
                                    </Box>
                                </Paper>
                            )}
                        </Box>
                    </Grid>

                    {/* Right Column: Academic Details (FIXED FOR MUI V6) */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Academic Details</Typography>

                            {/* Progress */}
                            <Box sx={{ mb: 4 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Degree Progress</Typography>
                                    <Typography variant="body2">{student.academicDetails.creditsCompleted} / {student.academicDetails.creditsRequired} Credits</Typography>
                                </Box>
                                <LinearProgress variant="determinate" value={progressPercent} sx={{ height: 8, borderRadius: 4 }} />
                                <Typography variant="subtitle2" sx={{ mt: 1, textAlign: 'right' }}>Cumulative GPA: {student.academicDetails.gpa}</Typography>
                            </Box>

                            {/* Current Courses */}
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Currently Enrolled</Typography>
                            {student.academicDetails.currentCourses.length === 0 ? (
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>No current enrollments.</Typography>
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 4 }}>
                                    {student.academicDetails.currentCourses.map(course => (
                                        <Box key={course.code} sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2, display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{course.code} - {course.name}</Typography>
                                            <Typography variant="body2" color="text.secondary">{course.credits} Credits</Typography>
                                        </Box>
                                    ))}
                                </Box>
                            )}

                            {/* Previous Results */}
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Academic History</Typography>
                            {student.academicDetails.previousResults.length === 0 ? (
                                <Typography variant="body2" color="text.secondary">No previous academic history.</Typography>
                            ) : (
                                student.academicDetails.previousResults.map(semester => (
                                    <Box key={semester.semester} sx={{ mb: 3 }}>
                                        <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>{semester.semester}</Typography>
                                        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
                                            {semester.results.map((res, i) => (
                                                <Box key={res.code} sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5, borderBottom: i < semester.results.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                                                    <Typography variant="body2">{res.code} - {res.name}</Typography>
                                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>Grade: {res.grade}</Typography>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>
                                ))
                            )}
                        </Paper>
                    </Grid>
                </Grid>

            </Container>
        </Box>
    );
}