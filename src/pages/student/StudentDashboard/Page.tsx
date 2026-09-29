import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { Container, Box, CircularProgress, Alert, Paper, Grid } from '@mui/material';

import { GET_STUDENT_DASHBOARD } from './queries';
import type {StudentDashboardData, Course} from './types';
import { calculateFeeSummary, getCurrentTerm, getUpcomingEvents } from './helpers';

import { WelcomeHeader } from './components/WelcomeHeader';
import { TermStatusCard } from './components/TermStatusCard';
import { FeeBalanceCard } from './components/FeeBalanceCard';
import { EnrolledCoursesCard } from './components/EnrolledCoursesCard';
import { UpcomingEventsCard } from './components/UpcomingEventsCard';
import { CourseDetailsModal } from './components/CourseDetailsModal';

export default function StudentDashboardPage() {
    const [selectedCourse, setSelectedCourse] = useState<{ course: Course; year: number } | null>(null);

    const { data, loading, error } = useQuery<StudentDashboardData>(GET_STUDENT_DASHBOARD);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    const student = data?.me?.students?.[0];

    if (error || !student) {
        return (
            <Container maxWidth="xl" sx={{ py: 6 }}>
                <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderColor: 'error.main' }}>
                    <Alert severity="error">
                        {error ? `Failed to load portal data: ${error.message}` : 'No active student record associated with this account.'}
                    </Alert>
                </Paper>
            </Container>
        );
    }

    const feeSummary = calculateFeeSummary(student.studentFees);
    const currentTerm = getCurrentTerm(data?.academicTerms);
    const upcomingEvents = getUpcomingEvents(data?.academicEvents, 5);

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '85vh', py: { xs: 3, md: 5 } }}>
            <Container maxWidth="xl">
                <Grid container spacing={3}>

                    {/* WELCOME / STUDENT HERO BANNER */}
                    <Grid size={{ xs: 12 }}>
                        <WelcomeHeader student={student} />
                    </Grid>

                    {/* KEY METRICS / STATUS ROW */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TermStatusCard currentTerm={currentTerm} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <FeeBalanceCard
                            feeSummary={feeSummary}
                            onPayClick={() => {
                                // Route to payment page or open payment flow
                                window.location.href = '/portal/finance';
                            }}
                        />
                    </Grid>

                    {/* MAIN DASHBOARD CONTENT */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <EnrolledCoursesCard
                            enrollments={student.enrollments}
                            onCourseClick={(course, year) => setSelectedCourse({ course, year })}
                        />
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <UpcomingEventsCard events={upcomingEvents} />
                    </Grid>

                </Grid>
            </Container>

            {/* CLICKABLE COURSE DETAILS DIALOG */}
            <CourseDetailsModal
                open={Boolean(selectedCourse)}
                course={selectedCourse?.course || null}
                year={selectedCourse?.year}
                onClose={() => setSelectedCourse(null)}
            />
        </Box>
    );
}