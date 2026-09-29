import { Paper, Box, Typography, Chip, Grid, CardActionArea } from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import type {Enrollment, Course} from '../types';

interface EnrolledCoursesCardProps {
    enrollments: Enrollment[];
    onCourseClick: (course: Course, year: number) => void;
}

export function EnrolledCoursesCard({ enrollments, onCourseClick }: EnrolledCoursesCardProps) {
    const activeEnrollments = enrollments.filter(
        (e) => e.status === 'IN_PROGRESS' || e.status === 'In Progress' || e.status === 'ENROLLED'
    );

    return (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 4, height: '100%', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AutoStoriesIcon color="primary" />
                    <Typography variant="h6" fontWeight={800}>
                        Enrolled Courses
                    </Typography>
                </Box>
                <Chip
                    label={`${activeEnrollments.length} Active`}
                    color="primary"
                    size="small"
                    sx={{ fontWeight: 700 }}
                />
            </Box>

            {activeEnrollments.length === 0 ? (
                <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                    No active course enrollments found for this term.
                </Typography>
            ) : (
                <Grid container spacing={2}>
                    {activeEnrollments.map((enrollment) => {
                        const course = enrollment.curriculum.course;
                        return (
                            <Grid size={{ xs: 12, sm: 6 }} key={enrollment.id}>
                                <Paper
                                    variant="outlined"
                                    sx={{
                                        borderRadius: 3,
                                        borderColor: 'divider',
                                        transition: 'all 0.2s ease-in-out',
                                        '&:hover': {
                                            borderColor: 'primary.main',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                                            transform: 'translateY(-2px)',
                                        },
                                    }}
                                >
                                    <CardActionArea
                                        onClick={() => onCourseClick(course, enrollment.curriculum.year)}
                                        sx={{ p: 2, borderRadius: 3 }}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                            <Chip
                                                label={course.code}
                                                size="small"
                                                color="primary"
                                                variant="outlined"
                                                sx={{ fontWeight: 800, borderRadius: 1.5 }}
                                            />
                                            <Chip
                                                label={`${course.credits} Credits`}
                                                size="small"
                                                sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                                            />
                                        </Box>

                                        <Typography
                                            variant="subtitle2"
                                            fontWeight={700}
                                            sx={{
                                                color: 'text.primary',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                minHeight: '2.6em',
                                                mb: 1,
                                            }}
                                        >
                                            {course.title}
                                        </Typography>

                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                                Year {enrollment.curriculum.year}
                                            </Typography>
                                            <ArrowForwardIosIcon sx={{ fontSize: '0.75rem', color: 'primary.main' }} />
                                        </Box>
                                    </CardActionArea>
                                </Paper>
                            </Grid>
                        );
                    })}
                </Grid>
            )}
        </Paper>
    );
}
