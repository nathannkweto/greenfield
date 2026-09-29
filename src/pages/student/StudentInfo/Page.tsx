import { useQuery } from '@apollo/client/react';
import { Container, Box, Typography, CircularProgress, Alert, Paper, Stack, Grid } from '@mui/material';

import { GET_STUDENT_INFO } from './queries';
import type {GetStudentInfoResponse} from './types';
import { formatDate } from './helpers';

import { StudentHeaderCard } from './components/StudentHeaderCard';
import { AcademicProgressCard } from './components/AcademicProgressCard';
import { PersonalDetailsCard } from './components/PersonalDetailsCard';
import { ProgramSchoolCard } from './components/ProgramSchoolCard';
import { EmergencyContactCard } from './components/EmergencyContactCard';

export default function StudentInfoPage() {
    const { data, loading, error } = useQuery<GetStudentInfoResponse>(GET_STUDENT_INFO);

    const student = data?.me?.students?.[0];

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !student) {
        return (
            <Container maxWidth="xl" sx={{ py: 6 }}>
                <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderColor: 'error.main' }}>
                    <Alert severity="error">
                        {error ? `Failed to load student details: ${error.message}` : 'No active student record found.'}
                    </Alert>
                </Paper>
            </Container>
        );
    }

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '85vh', py: { xs: 3, md: 5 } }}>
            <Container maxWidth="xl">
                <Stack spacing={3.5}>

                    {/* PAGE TITLE */}
                    <Box>
                        <Typography variant="h4" fontWeight={900}>
                            Student Profile & Records
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Official personal details, academic progress, and institutional enrollment records.
                        </Typography>
                    </Box>

                    {/* HERO HEADER CARD */}
                    <StudentHeaderCard student={student} />

                    {/* ACADEMIC PROGRESS MODEL CARD */}
                    <AcademicProgressCard progress={student.academicProgress} />

                    {/* DETAILED INFORMATION GRID */}
                    <Grid container spacing={3.5}>
                        {/* LEFT COLUMN: Personal & Contact Info */}
                        <Grid size={{ xs: 12, lg: 7 }}>
                            <Stack spacing={3.5}>
                                <PersonalDetailsCard student={student} />
                                <EmergencyContactCard emergencyContact={student.emergencyContact} />
                            </Stack>
                        </Grid>

                        {/* RIGHT COLUMN: Program & System Audit Dates */}
                        <Grid size={{ xs: 12, lg: 5 }}>
                            <Stack spacing={3.5}>
                                <ProgramSchoolCard program={student.program} />

                                {/* ADMISSION & ENROLLMENT DATES CARD */}
                                <Paper variant="outlined" sx={{ p: 3, borderRadius: 3.5, borderColor: 'divider' }}>
                                    <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 2 }}>
                                        Key Institutional Dates
                                    </Typography>

                                    <Stack spacing={2}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="caption" color="text.secondary">Application Date:</Typography>
                                            <Typography variant="caption" fontWeight={700}>{formatDate(student.applicationDate)}</Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="caption" color="text.secondary">Admission Date:</Typography>
                                            <Typography variant="caption" fontWeight={700}>{formatDate(student.admissionDate)}</Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Typography variant="caption" color="text.secondary">Expected Graduation:</Typography>
                                            <Typography variant="caption" fontWeight={700}>{formatDate(student.graduationDate)}</Typography>
                                        </Box>
                                    </Stack>
                                </Paper>
                            </Stack>
                        </Grid>
                    </Grid>

                </Stack>
            </Container>
        </Box>
    );
}