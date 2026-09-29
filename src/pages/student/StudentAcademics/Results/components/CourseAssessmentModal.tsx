import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
    Divider,
    LinearProgress,
} from '@mui/material';
import type { ProcessedCourseResult } from '../types.ts';

interface CourseAssessmentModalProps {
    open: boolean;
    course: ProcessedCourseResult | null;
    onClose: () => void;
}

export function CourseAssessmentModal({ open, course, onClose }: CourseAssessmentModalProps) {
    if (!course) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            slotProps={{
                paper: {
                    sx: { borderRadius: 3 },
                },
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Typography variant="h6" fontWeight={800}>
                    {course.code}: {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Detailed Assessment Breakdown ({course.credits} Credits)
                </Typography>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ py: 2.5 }}>
                {course.assessments.length === 0 ? (
                    <Box sx={{ py: 3, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            No individual assessment recordings available for this course yet.
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700 }}>Assessment Title</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 700 }}>
                                        Weight
                                    </TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 700 }}>
                                        Score
                                    </TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                                        Percentage
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {course.assessments.map((a) => (
                                    <TableRow key={a.id}>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight={600}>
                                                {a.title}
                                            </Typography>
                                            {a.term && (
                                                <Typography variant="caption" color="text.secondary">
                                                    Term {a.term}
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip label={`${a.weightPercentage}%`} size="small" variant="outlined" />
                                        </TableCell>
                                        <TableCell align="center">
                                            {a.scoreObtained != null ? `${a.scoreObtained} / ${a.maxScore}` : '—'}
                                        </TableCell>
                                        <TableCell align="right">
                                            {a.percentageScore != null ? (
                                                <Typography variant="body2" fontWeight={700} color="primary.main">
                                                    {a.percentageScore.toFixed(1)}%
                                                </Typography>
                                            ) : (
                                                '—'
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {course.calculatedWeightedScore != null && (
                            <Box sx={{ mt: 3, p: 2, borderRadius: 2, backgroundColor: 'action.hover' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" fontWeight={700}>
                                        Cumulative Score Calculation
                                    </Typography>
                                    <Typography variant="body2" fontWeight={800} color="primary.main">
                                        {course.calculatedWeightedScore.toFixed(1)}%
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={Math.min(course.calculatedWeightedScore, 100)}
                                    sx={{ height: 8, borderRadius: 4 }}
                                />
                            </Box>
                        )}
                    </>
                )}
            </DialogContent>

            <DialogActions sx={{ p: 2, pt: 0 }}>
                <Button onClick={onClose} variant="contained" disableElevation sx={{ borderRadius: 2 }}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}