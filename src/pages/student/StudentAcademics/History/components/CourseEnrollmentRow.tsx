import { TableRow, TableCell, Typography, Chip } from '@mui/material';
import type {Enrollment} from '../types';
import { getStatusBadgeColor } from '../helpers';

interface CourseEnrollmentRowProps {
    enrollment: Enrollment;
}

export function CourseEnrollmentRow({ enrollment }: CourseEnrollmentRowProps) {
    const course = enrollment.curriculum.course;
    const enrollmentDate = new Date(enrollment.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });

    return (
        <TableRow hover>
            <TableCell sx={{ fontWeight: 700 }}>{course.code}</TableCell>
            <TableCell>
                <Typography variant="body2" fontWeight={600}>
                    {course.title}
                </Typography>
                {course.description && (
                    <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 300, display: 'block' }}>
                        {course.description}
                    </Typography>
                )}
            </TableCell>
            <TableCell align="center">
                <Chip
                    label={`Year ${enrollment.curriculum.year}`}
                    size="small"
                    variant="outlined"
                    sx={{ fontWeight: 700 }}
                />
            </TableCell>
            <TableCell align="center">
                <Typography variant="body2" fontWeight={700}>
                    {course.credits}
                </Typography>
            </TableCell>
            <TableCell align="center">
                <Typography variant="body2" color="text.secondary">
                    {enrollmentDate}
                </Typography>
            </TableCell>
            <TableCell align="center">
                <Chip
                    label={enrollment.status.replace('_', ' ')}
                    color={getStatusBadgeColor(enrollment.status)}
                    size="small"
                    sx={{ fontWeight: 700, textTransform: 'capitalize' }}
                />
            </TableCell>
            <TableCell align="right">
                {enrollment.grade ? (
                    <Typography variant="body2" fontWeight={800} color="primary.main">
                        {enrollment.grade}
                    </Typography>
                ) : (
                    <Typography variant="body2" color="text.secondary">
                        —
                    </Typography>
                )}
            </TableCell>
        </TableRow>
    );
}