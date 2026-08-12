import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Tabs,
    Tab,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    Divider,
    Stack
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

import {
    UPCOMING_EXAMS,
    PAST_RESULTS,
    ACADEMIC_SUMMARY,
    type ExamScheduleItem,
    type ExamResultTerm,
    type ExamResultCourse
} from '../../data/examsData';

// Helper component for Tab Panels
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    );
}

export default function Exams() {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleRequestTranscript = () => {
        alert('Transcript Request Form would open here.');
    };

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '70vh', py: { xs: 2, md: 4 } }}>
            <Container maxWidth="xl">

                {/* PAGE HEADER WITH SCALING TYPOGRAPHY */}
                <Box sx={{ mb: { xs: 3, md: 4 } }}>
                    <Typography
                        component="h1"
                        sx={{
                            typography: { xs: 'h5', md: 'h4' },
                            fontWeight: 800,
                            color: 'text.primary',
                            mb: 0.5
                        }}
                    >
                        Exams & Results
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
                        View your upcoming exam timetables and academic performance.
                    </Typography>
                </Box>

                <Paper variant="outlined" sx={{ borderRadius: 4, borderColor: 'divider' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 1 }}>
                        <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                            <Tab label="Exam Timetable" sx={{ textTransform: 'none', fontWeight: 600, fontSize: '1rem' }} />
                            <Tab label="Results & Transcripts" sx={{ textTransform: 'none', fontWeight: 600, fontSize: '1rem' }} />
                        </Tabs>
                    </Box>

                    <Box sx={{ px: { xs: 1, sm: 2, md: 4 }, pb: 4 }}>

                        {/* ================= TAB 1: TIMETABLE ================= */}
                        <CustomTabPanel value={tabValue} index={0}>
                            {UPCOMING_EXAMS.length > 0 ? (
                                <TableContainer variant="outlined" component={Paper} sx={{ borderRadius: 3, borderColor: 'divider', boxShadow: 'none', overflowX: 'auto' }}>
                                    <Table sx={{ minWidth: { xs: 300, sm: 600 } }}>
                                        <TableHead sx={{ bgcolor: 'action.hover' }}>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 700 }}>Date & Time</TableCell>
                                                <TableCell sx={{ fontWeight: 700 }}>Course Details</TableCell>
                                                {/* Hidden on mobile, shown on desktop */}
                                                <TableCell sx={{ fontWeight: 700, display: { xs: 'none', md: 'table-cell' } }}>Venue</TableCell>
                                                <TableCell align="center" sx={{ fontWeight: 700, display: { xs: 'none', sm: 'table-cell' } }}>Type</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {UPCOMING_EXAMS.map((exam: ExamScheduleItem) => (
                                                <TableRow key={exam.id} hover>
                                                    <TableCell sx={{ whiteSpace: 'nowrap', verticalAlign: 'top', pt: 2 }}>
                                                        <Typography sx={{ fontWeight: 700, color: 'text.primary', fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                                                            {exam.date}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                                            {exam.time} ({exam.duration})
                                                        </Typography>
                                                    </TableCell>

                                                    <TableCell sx={{ verticalAlign: 'top', pt: 2 }}>
                                                        <Typography sx={{ fontWeight: 700, fontSize: { xs: '0.85rem', sm: '1rem' } }}>
                                                            {exam.courseCode}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" sx={{ mb: { xs: 1, md: 0 }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                                                            {exam.courseTitle}
                                                        </Typography>

                                                        {/* Mobile-only injection: Shows Venue and Type under the course name on small screens */}
                                                        <Box sx={{ display: { xs: 'block', md: 'none' }, mt: 0.5 }}>
                                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                                                <strong>Venue:</strong> {exam.venue}
                                                            </Typography>
                                                            <Chip label={exam.type} size="small" color="primary" variant="outlined" sx={{ height: 20, fontSize: '0.7rem', fontWeight: 600 }} />
                                                        </Box>
                                                    </TableCell>

                                                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' }, verticalAlign: 'top', pt: 2 }}>
                                                        {exam.venue}
                                                    </TableCell>

                                                    <TableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' }, verticalAlign: 'top', pt: 2 }}>
                                                        <Chip label={exam.type} size="small" color="primary" variant="outlined" sx={{ fontWeight: 600 }} />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 8 }}>
                                    <EventAvailableIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                                    <Typography variant="h6" color="text.secondary">No upcoming exams scheduled.</Typography>
                                </Box>
                            )}
                        </CustomTabPanel>

                        {/* ================= TAB 2: RESULTS & TRANSCRIPTS ================= */}
                        <CustomTabPanel value={tabValue} index={1}>

                            {/* Top Summary & Actions */}
                            <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, mb: 4, borderRadius: 3, borderColor: 'divider', bgcolor: 'background.default' }}>
                                <Grid container spacing={3} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Grid size={{ xs: 12, md: 8 }}>
                                        <Stack direction={{ xs: 'row' }} spacing={{ xs: 3, sm: 4 }} sx={{ justifyContent: { xs: 'space-between', sm: 'flex-start' } }}>
                                            <Box>
                                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                                                    Cumulative GPA
                                                </Typography>
                                                <Typography sx={{ typography: { xs: 'h4', md: 'h3' }, fontWeight: 800, color: 'primary.main' }}>
                                                    {ACADEMIC_SUMMARY.cgpa.toFixed(2)}
                                                </Typography>
                                            </Box>
                                            <Divider orientation="vertical" flexItem />
                                            <Box>
                                                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'uppercase', fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
                                                    Credits Earned
                                                </Typography>
                                                <Typography sx={{ typography: { xs: 'h4', md: 'h3' }, fontWeight: 800, color: 'text.primary' }}>
                                                    {ACADEMIC_SUMMARY.totalCreditsEarned}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
                                        <Button
                                            variant="contained"
                                            size="large"
                                            fullWidth // Ensures the button takes the full width on mobile for easier tapping
                                            startIcon={<DescriptionIcon />}
                                            onClick={handleRequestTranscript}
                                            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, boxShadow: 'none', maxWidth: { md: 280 } }}
                                        >
                                            Request Official Transcript
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>

                            {/* Term by Term Breakdown */}
                            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>Academic Record by Term</Typography>

                            <Stack spacing={4}>
                                {PAST_RESULTS.map((term: ExamResultTerm) => (
                                    <Box key={term.termId}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', mb: 1, flexDirection: { xs: 'column', sm: 'row' } }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                                {term.termName}
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', mt: { xs: 0.5, sm: 0 } }}>
                                                Term GPA: <Typography component="span" sx={{ color: 'text.primary', fontWeight: 800 }}>{term.termGPA.toFixed(2)}</Typography>
                                            </Typography>
                                        </Box>

                                        <TableContainer variant="outlined" component={Paper} sx={{ borderRadius: 3, borderColor: 'divider', boxShadow: 'none', overflowX: 'auto' }}>
                                            <Table size="small" sx={{ minWidth: 280 }}>
                                                <TableHead sx={{ bgcolor: 'action.hover' }}>
                                                    <TableRow>
                                                        <TableCell sx={{ fontWeight: 700 }}>Course</TableCell>
                                                        {/* Hide Credits and Points on extra small screens to save space */}
                                                        <TableCell align="center" sx={{ fontWeight: 700, display: { xs: 'none', sm: 'table-cell' } }}>Credits</TableCell>
                                                        <TableCell align="center" sx={{ fontWeight: 700 }}>Grade</TableCell>
                                                        <TableCell align="center" sx={{ fontWeight: 700, display: { xs: 'none', sm: 'table-cell' } }}>Points</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {term.courses.map((course: ExamResultCourse) => (
                                                        <TableRow key={course.courseCode}>
                                                            <TableCell sx={{ py: 1.5 }}>
                                                                <Typography sx={{ fontWeight: 600, fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                                                                    {course.courseCode}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', minWidth: { xs: 120, sm: 'auto' }, lineHeight: 1.2, mt: 0.5 }}>
                                                                    {course.courseTitle}
                                                                </Typography>
                                                            </TableCell>

                                                            <TableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                                                                {course.credits}
                                                            </TableCell>

                                                            <TableCell align="center">
                                                                <Typography sx={{ fontWeight: 700, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                                                                    {course.grade}
                                                                </Typography>
                                                            </TableCell>

                                                            <TableCell align="center" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                                                                {course.points.toFixed(1)}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </Box>
                                ))}
                            </Stack>

                        </CustomTabPanel>

                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}