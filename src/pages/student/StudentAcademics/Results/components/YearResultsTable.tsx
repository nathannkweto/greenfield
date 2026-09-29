import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Typography,
    Chip,
    IconButton,
    Tooltip,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import type {YearlyResult, ProcessedCourseResult} from '../types.ts';
import { getGradeBadgeColor, getEnrollmentStatusColor } from '../helpers.ts';
import { CourseAssessmentModal } from './CourseAssessmentModal.tsx';

interface YearResultsTableProps {
    yearlyResult: YearlyResult;
}

export function YearResultsTable({ yearlyResult }: YearResultsTableProps) {
    const [selectedCourse, setSelectedCourse] = useState<ProcessedCourseResult | null>(null);

    return (
        <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', mb: 3 }}>
            {/* Year Header Summary Bar */}
            <Box
                sx={{
                    p: 2,
                    px: 2.5,
                    bgcolor: 'action.hover',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 1.5,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Typography variant="h6" fontWeight={800}>
                        Year {yearlyResult.year} Results
                    </Typography>
                    {yearlyResult.isCurrentYear && (
                        <Chip label="Current Year" color="primary" size="small" sx={{ fontWeight: 700 }} />
                    )}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                        Earned Credits:{' '}
                        <Typography component="span" variant="body2" fontWeight={800} color="text.primary">
                            {yearlyResult.creditsEarned} / {yearlyResult.creditsAttempted}
                        </Typography>
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                        Year GPA:{' '}
                        <Typography component="span" variant="body2" fontWeight={800} color="primary.main">
                            {yearlyResult.gpa.toFixed(2)}
                        </Typography>
                    </Typography>
                </Box>
            </Box>

            {/* Courses Results Table */}
            <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 800 }}>Course Code</TableCell>
                            <TableCell sx={{ fontWeight: 800 }}>Course Title</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 800 }}>
                                Credits
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: 800 }}>
                                Status
                            </TableCell>
                            <TableCell align="center" sx={{ fontWeight: 800 }}>
                                Grade / Points
                            </TableCell>
                            <TableCell align="right" sx={{ fontWeight: 800 }}>
                                Assessments
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {yearlyResult.courses.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        No course enrollments recorded for Academic Year {yearlyResult.year}.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            yearlyResult.courses.map((course) => (
                                <TableRow key={course.courseId} hover>
                                    <TableCell sx={{ fontWeight: 700 }}>{course.code}</TableCell>
                                    <TableCell>{course.title}</TableCell>
                                    <TableCell align="center">
                                        <Typography variant="body2" fontWeight={700}>
                                            {course.credits}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={course.status.replace('_', ' ')}
                                            color={getEnrollmentStatusColor(course.status)}
                                            size="small"
                                            variant="outlined"
                                            sx={{ fontWeight: 700, textTransform: 'capitalize' }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={`${course.grade}${course.points > 0 ? ` (${course.points.toFixed(1)})` : ''}`}
                                            color={getGradeBadgeColor(course.grade)}
                                            size="small"
                                            sx={{ fontWeight: 800 }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="View assessment scores">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => setSelectedCourse(course)}
                                                disabled={course.assessments.length === 0}
                                            >
                                                <VisibilityIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Course Detail Modal */}
            <CourseAssessmentModal
                open={Boolean(selectedCourse)}
                course={selectedCourse}
                onClose={() => setSelectedCourse(null)}
            />
        </Paper>
    );
}