import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import {
    Box, Container, Typography, Paper, Tabs, Tab, Button,
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, LinearProgress, useMediaQuery, useTheme, Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AssessmentIcon from '@mui/icons-material/Assessment';

import { GET_COURSE_DETAILS } from './queries';

export interface AssessmentResult {
    id: string;
    score: number | null;
}

export interface Assessment {
    id: string;
    title: string;
    description: string | null;
    type: string;
    term: number | null;
    weightPercentage: number;
    maxScore: number;
    isPublished: boolean;
    assessmentResults: AssessmentResult[];
}

export interface Lecturer {
    id: string;
    firstName: string;
    lastName: string;
    user?: {
        id: string;
        email: string;
    };
}

export interface Course {
    id: string;
    code: string;
    title: string;
    description: string | null;
    credits: number;
}

export interface Curriculum {
    id: string;
    course: Course;
    lecturer?: Lecturer | null;
    assessments: Assessment[];
}

export interface Enrollment {
    id: string;
    curriculum: Curriculum;
}

export interface CourseDetailsData {
    me: {
        id: string;
        students: Array<{
            id: string;
            enrollments: Enrollment[];
        }>;
    } | null;
}

function CustomTabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ py: { xs: 2, md: 3 }, width: '100%' }}>{children}</Box>}
        </div>
    );
}

export default function CourseDetails() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [tabValue, setTabValue] = useState(0);

    const { data, loading, error } = useQuery<CourseDetailsData>(GET_COURSE_DETAILS);

    const enrollments = data?.me?.students[0]?.enrollments ?? [];
    const targetEnrollment = enrollments.find((e) => e.curriculum.course.id === courseId);
    const curriculum = targetEnrollment?.curriculum;
    const course = curriculum?.course;
    const lecturer = curriculum?.lecturer;
    const assessments = curriculum?.assessments ?? [];

    if (loading) {
        return (
            <Container sx={{ py: 8, textAlign: 'center' }}>
                <Typography>Loading course details…</Typography>
            </Container>
        );
    }

    if (error || !course) {
        return (
            <Container sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h5">Course not found.</Typography>
                {error && <Typography color="error" sx={{ mt: 1 }}>{error.message}</Typography>}
                <Button sx={{ mt: 2 }} onClick={() => navigate('/student/academics')}>Back to Academics</Button>
            </Container>
        );
    }

    const lecturerName = lecturer ? `${lecturer.firstName} ${lecturer.lastName}` : 'Unassigned';

    return (
        <Box sx={{ backgroundColor: 'background.default', minHeight: '70vh', width: '100%', overflowX: 'hidden', py: { xs: 2, md: 4 } }}>
            <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 3 } }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/student/academics')}
                    sx={{ mb: 2, textTransform: 'none', color: 'text.secondary' }}
                >
                    Back to Academics
                </Button>

                <Paper variant="outlined" sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, mb: 3, overflowWrap: 'anywhere', width: '100%', boxSizing: 'border-box' }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
                        {course.code}: {course.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {course.credits} Credits • Instructor: {lecturerName}
                    </Typography>
                </Paper>

                <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
                    <Tabs
                        value={tabValue}
                        onChange={(_e, val) => setTabValue(val)}
                        variant="scrollable"
                        scrollButtons={false}
                        sx={{
                            borderBottom: 1, borderColor: 'divider', width: '100%',
                            '& .MuiTab-root': { flex: isMobile ? 1 : 'none', minWidth: 'auto', fontSize: { xs: '0.75rem', md: '1rem' }, px: { xs: 2, md: 3 } }
                        }}
                    >
                        <Tab label={isMobile ? "Info" : "Overview"} icon={<InfoOutlinedIcon />} iconPosition={isMobile ? "top" : "start"} />
                        <Tab label={isMobile ? "Grades" : "Assessments"} icon={<AssessmentIcon />} iconPosition={isMobile ? "top" : "start"} />
                    </Tabs>

                    <Box sx={{ px: { xs: 2, md: 4 }, width: '100%', boxSizing: 'border-box' }}>
                        <CustomTabPanel value={tabValue} index={0}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Description</Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, overflowWrap: 'anywhere' }}>
                                {course.description || 'No description provided for this course.'}
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Instructor Information</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>{lecturerName}</Typography>
                            {lecturer?.user?.email && (
                                <Typography variant="body2" color="text.secondary">{lecturer.user.email}</Typography>
                            )}
                        </CustomTabPanel>

                        <CustomTabPanel value={tabValue} index={1}>
                            {assessments.length === 0 ? (
                                <Typography color="text.secondary">No assessments recorded for this course.</Typography>
                            ) : isMobile ? (
                                <Stack spacing={1.5}>
                                    {assessments.map((a) => {
                                        const score = a.assessmentResults[0]?.score ?? null;
                                        return (
                                            <Paper key={a.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, pr: 1, overflowWrap: 'anywhere', minWidth: 0 }}>
                                                        {a.title}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ whiteSpace: 'nowrap', backgroundColor: 'action.hover', px: 1, py: 0.5, borderRadius: 1, flexShrink: 0 }}>
                                                        Weight: {a.weightPercentage}%
                                                    </Typography>
                                                </Box>
                                                {a.description && (
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                        {a.description}
                                                    </Typography>
                                                )}
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Score:</Typography>
                                                    <Typography variant="body2">
                                                        {score !== null ? `${score} / ${a.maxScore}` : 'Pending'}
                                                    </Typography>
                                                </Box>
                                                {score !== null && (
                                                    <LinearProgress variant="determinate" value={(score / a.maxScore) * 100} sx={{ height: 6, borderRadius: 3 }} />
                                                )}
                                            </Paper>
                                        );
                                    })}
                                </Stack>
                            ) : (
                                <TableContainer sx={{ overflowX: 'auto', width: '100%' }}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Assessment</TableCell>
                                                <TableCell>Weight</TableCell>
                                                <TableCell>Score</TableCell>
                                                <TableCell>Progress</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {assessments.map((a) => {
                                                const score = a.assessmentResults[0]?.score ?? null;
                                                return (
                                                    <TableRow key={a.id}>
                                                        <TableCell sx={{ overflowWrap: 'anywhere', minWidth: 200 }}>
                                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{a.title}</Typography>
                                                            {a.description && (
                                                                <Typography variant="caption" color="text.secondary">{a.description}</Typography>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>{a.weightPercentage}%</TableCell>
                                                        <TableCell>{score !== null ? `${score} / ${a.maxScore}` : 'Pending'}</TableCell>
                                                        <TableCell sx={{ minWidth: 150 }}>
                                                            {score !== null ? (
                                                                <LinearProgress variant="determinate" value={(score / a.maxScore) * 100} sx={{ height: 6, borderRadius: 3 }} />
                                                            ) : (
                                                                '-'
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </CustomTabPanel>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}