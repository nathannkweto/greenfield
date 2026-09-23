import { useState, useEffect, useMemo } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Box,
    Button,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TextField,
    Chip,
    Divider,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import type { Student, CurriculumItem, StudentCourseGrade } from '../types';
import { formatStudentName } from '../helpers';

interface StudentAcademicDetailsModalProps {
    open: boolean;
    onClose: () => void;
    student: Student | null;
    programCurriculum: CurriculumItem[];
    onSaveStudentGrades: (studentId: string, updatedGrades: StudentCourseGrade[]) => void;
}

export default function StudentAcademicDetailsModal({
                                                        open,
                                                        onClose,
                                                        student,
                                                        programCurriculum,
                                                        onSaveStudentGrades,
                                                    }: StudentAcademicDetailsModalProps) {
    const [gradeMap, setGradeMap] = useState<Record<string, { mark: number | ''; maxMark: number }>>({});

    // Filter program curriculum courses up to the student's current year
    const relevantCurriculum = useMemo(() => {
        if (!student) return [];
        const studentYear = student.currentYear || 1;
        return programCurriculum.filter((item) => item.year <= studentYear);
    }, [student, programCurriculum]);

    useEffect(() => {
        if (student) {
            const initialMap: Record<string, { mark: number | ''; maxMark: number }> = {};

            relevantCurriculum.forEach((item) => {
                if (!item.course) return;

                const existing = student.grades?.find((g) => g.courseId === item.course?.id);
                initialMap[item.course.id] = {
                    mark: existing?.mark ?? '',
                    maxMark: existing?.maxMark ?? 100,
                };
            });

            setGradeMap(initialMap);
        }
    }, [student, relevantCurriculum]);

    if (!student) return null;

    const handleMarkChange = (courseId: string, value: string) => {
        const numVal = value === '' ? '' : Math.max(0, parseFloat(value));
        setGradeMap((prev) => ({
            ...prev,
            [courseId]: {
                ...prev[courseId],
                mark: numVal,
            },
        }));
    };

    const handleMaxMarkChange = (courseId: string, value: string) => {
        const numVal = value === '' ? 100 : Math.max(1, parseFloat(value));
        setGradeMap((prev) => ({
            ...prev,
            [courseId]: {
                ...prev[courseId],
                maxMark: numVal,
            },
        }));
    };

    const handleSave = () => {
        const updatedGrades: StudentCourseGrade[] = relevantCurriculum
            .filter((item) => item.course)
            .map((item) => {
                const course = item.course!;
                const entry = gradeMap[course.id] || { mark: '', maxMark: 100 };
                return {
                    courseId: course.id,
                    courseCode: course.code,
                    courseTitle: course.title,
                    year: item.year,
                    mark: entry.mark,
                    maxMark: entry.maxMark,
                };
            });

        onSaveStudentGrades(student.id, updatedGrades);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle sx={{ pb: 1 }}>
                <Typography variant="h6" component="span" sx={{ fontWeight: 800 }}>
                    Academic Progress: {formatStudentName(student)}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                    <Chip label={`ID: ${student.studentNumber}`} size="small" color="primary" variant="outlined" />
                    <Chip label={`Current Progress: Year ${student.currentYear}`} size="small" color="secondary" />
                    <Chip label={`${student.intake} Intake`} size="small" />
                </Box>
            </DialogTitle>

            <Divider />

            <DialogContent>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                    Courses Provision & Exam Results (Up to Year {student.currentYear})
                </Typography>

                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Year</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Course Code</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Course Title</TableCell>
                            <TableCell sx={{ fontWeight: 700, width: 140 }}>Mark Obtained</TableCell>
                            <TableCell sx={{ fontWeight: 700, width: 140 }}>Max Mark</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {relevantCurriculum.length > 0 ? (
                            relevantCurriculum.map((item) => {
                                const course = item.course;
                                if (!course) return null;
                                const entry = gradeMap[course.id] || { mark: '', maxMark: 100 };

                                return (
                                    <TableRow key={course.id} hover>
                                        <TableCell>Year {item.year}</TableCell>
                                        <TableCell sx={{ fontWeight: 600, color: 'primary.main' }}>
                                            {course.code || 'N/A'}
                                        </TableCell>
                                        <TableCell>{course.title}</TableCell>
                                        <TableCell>
                                            <TextField
                                                size="small"
                                                type="number"
                                                value={entry.mark}
                                                onChange={(e) => handleMarkChange(course.id, e.target.value)}
                                                placeholder="e.g. 75"
                                                slotProps={{ htmlInput: { min: 0, max: entry.maxMark } }}
                                                fullWidth
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <TextField
                                                size="small"
                                                type="number"
                                                value={entry.maxMark}
                                                onChange={(e) => handleMaxMarkChange(course.id, e.target.value)}
                                                placeholder="100"
                                                slotProps={{ htmlInput: { min: 1 } }}
                                                fullWidth
                                            />
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 3, fontStyle: 'italic' }}>
                                    No courses configured for the student's current level.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
                    Apply Changes
                </Button>
            </DialogActions>
        </Dialog>
    );
}