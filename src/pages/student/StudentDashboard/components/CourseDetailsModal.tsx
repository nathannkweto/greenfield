import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Box, Chip, Divider } from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import type { Course } from '../types';

interface CourseDetailsModalProps {
    open: boolean;
    course: Course | null;
    year?: number;
    onClose: () => void;
}

export function CourseDetailsModal({ open, course, year, onClose }: CourseDetailsModalProps) {
    if (!course) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            slotProps={{
                paper: {
                    sx: { borderRadius: 3 }
                }
            }}
        >
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AutoStoriesIcon color="primary" />
                    <Typography variant="h6" fontWeight={800}>
                        Course Details
                    </Typography>
                </Box>
                <Chip label={course.code} color="primary" sx={{ fontWeight: 700 }} />
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ py: 2.5 }}>
                <Typography variant="h5" fontWeight={800} sx={{ mb: 1.5 }}>
                    {course.title}
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    {year && <Chip label={`Year ${year}`} variant="outlined" size="small" />}
                    <Chip label={`${course.credits} Academic Credits`} variant="outlined" size="small" color="secondary" />
                </Box>

                <Typography variant="caption" color="text.disabled" fontWeight={700} sx={{ textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
                    Course Description
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {course.description || 'No detailed syllabus or description available for this course.'}
                </Typography>
            </DialogContent>

            <Divider />

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} variant="contained" disableElevation sx={{ borderRadius: 2, fontWeight: 700 }}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}
