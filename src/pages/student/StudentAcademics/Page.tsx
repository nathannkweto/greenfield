import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Chip,
    Container,
    Paper,
    Stack,
    Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { GET_STUDENT_ACADEMICS } from './queries';

export interface Course {
    id: string;
    code: string;
    title: string;
    credits: number;
}

export interface Curriculum {
    id: string;
    year: number;
    course: Course;
}

export interface Enrollment {
    id: string;
    status: string;
    grade?: string | null;
    curriculum: Curriculum;
}

export interface AcademicsData {
    me: {
        id: string;
        students: Array<{
            id: string;
            enrollments: Enrollment[];
        }>;
    } | null;
}

export default function Page() {
    const navigate = useNavigate();
    const { data, loading, error } = useQuery<AcademicsData>(GET_STUDENT_ACADEMICS);
    const [expandedYear, setExpandedYear] = useState<number | false>(false);

    const student = data?.me?.students[0];
    const enrollments = student?.enrollments ?? [];

    // Group enrollments by academic year from Curriculum
    const yearsMap = new Map<number, Enrollment[]>();
    enrollments.forEach((enrollment) => {
        const year = enrollment.curriculum.year;
        const yearEnrollments = yearsMap.get(year) ?? [];
        yearEnrollments.push(enrollment);
        yearsMap.set(year, yearEnrollments);
    });

    const sortedYears = Array.from(yearsMap.keys()).sort((a, b) => b - a);
    const latestYear = sortedYears[0];

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '70vh', py: 4 }}>
            <Container maxWidth="xl">
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                        Academic Record
                    </Typography>
                    <Typography color="text.secondary">
                        View your progress and course materials by academic year.
                    </Typography>
                </Box>

                {loading && <Typography>Loading academic record…</Typography>}
                {error && <Typography color="error">Unable to load record: {error.message}</Typography>}

                {!loading && !error && (
                    <Stack spacing={2}>
                        {sortedYears.map((year) => {
                            const yearEnrollments = yearsMap.get(year) ?? [];
                            const isCurrentYear = year === latestYear;
                            const isExpanded = expandedYear === year || (expandedYear === false && isCurrentYear);

                            return (
                                <Accordion
                                    key={year}
                                    expanded={isExpanded}
                                    onChange={(_, open) => setExpandedYear(open ? year : false)}
                                    variant="outlined"
                                    sx={{ borderRadius: '12px !important', overflow: 'hidden' }}
                                >
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography sx={{ fontWeight: isCurrentYear ? 800 : 600 }}>
                                            Year {year}
                                        </Typography>
                                        {isCurrentYear && (
                                            <Chip label="Current Year" size="small" color="primary" sx={{ ml: 2, fontWeight: 700 }} />
                                        )}
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Stack spacing={1.5}>
                                            {yearEnrollments.map((enrollment) => {
                                                const course = enrollment.curriculum.course;
                                                return (
                                                    <Paper
                                                        key={enrollment.id}
                                                        variant="outlined"
                                                        sx={{
                                                            p: 2,
                                                            display: 'flex',
                                                            justify: 'space-between',
                                                            alignItems: 'center',
                                                            gap: 2,
                                                            borderRadius: 2
                                                        }}
                                                    >
                                                        <Box>
                                                            <Typography sx={{ fontWeight: 700 }}>
                                                                {course.code}: {course.title}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {course.credits} credits · {enrollment.status}
                                                                {enrollment.grade ? ` · Grade: ${enrollment.grade}` : ''}
                                                            </Typography>
                                                        </Box>
                                                        <Button
                                                            variant="text"
                                                            endIcon={<InfoOutlinedIcon />}
                                                            onClick={() => navigate(`course/${course.id}`)}
                                                        >
                                                            Details
                                                        </Button>
                                                    </Paper>
                                                );
                                            })}
                                        </Stack>
                                    </AccordionDetails>
                                </Accordion>
                            );
                        })}
                    </Stack>
                )}
            </Container>
        </Box>
    );
}