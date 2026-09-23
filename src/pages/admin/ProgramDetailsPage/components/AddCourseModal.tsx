import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    ListSubheader,
    Button,
    CircularProgress,
    Stack,
} from '@mui/material';
import type {CourseOption, LecturerOption} from '../types';
import { formatLecturerName } from '../helpers';

interface AddCourseModalProps {
    open: boolean;
    onClose: () => void;
    selectedYear: number | null;
    selectedCourse: CourseOption | null;
    setSelectedCourse: (course: CourseOption | null) => void;
    selectedLecturer: LecturerOption | null;
    setSelectedLecturer: (lecturer: LecturerOption | null) => void;
    availableCourses: CourseOption[];
    availableLecturers: LecturerOption[];
    loadingCourses: boolean;
    loadingLecturers: boolean;
    submitting: boolean;
    onSubmit: () => void;
}

export default function AddCourseModal({
                                           open,
                                           onClose,
                                           selectedYear,
                                           selectedCourse,
                                           setSelectedCourse,
                                           selectedLecturer,
                                           setSelectedLecturer,
                                           availableCourses,
                                           availableLecturers,
                                           loadingCourses,
                                           loadingLecturers,
                                           submitting,
                                           onSubmit,
                                       }: AddCourseModalProps) {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Add Course to Year {selectedYear}</DialogTitle>
            <DialogContent>
                <Stack spacing={2.5} sx={{ mt: 1 }}>
                    <TextField
                        select
                        label="Select Course"
                        required
                        fullWidth
                        value={selectedCourse?.id || ''}
                        onChange={(e) => {
                            const course = availableCourses.find((c) => c.id === e.target.value);
                            setSelectedCourse(course || null);
                        }}
                        disabled={loadingCourses}
                    >
                        {loadingCourses ? (
                            <MenuItem disabled value="">
                                Loading courses...
                            </MenuItem>
                        ) : availableCourses.length === 0 ? (
                            <MenuItem disabled value="">
                                No courses available
                            </MenuItem>
                        ) : (
                            availableCourses.reduce<React.ReactNode[]>((acc, course, index, array) => {
                                const currentSchool = course.school?.name || 'Uncategorized';
                                const prevSchool = index > 0 ? array[index - 1].school?.name || 'Uncategorized' : null;

                                if (currentSchool !== prevSchool) {
                                    acc.push(
                                        <ListSubheader key={`header-course-${currentSchool}`}>
                                            {currentSchool}
                                        </ListSubheader>
                                    );
                                }

                                acc.push(
                                    <MenuItem key={course.id} value={course.id}>
                                        {course.code ? `${course.code} - ${course.title}` : course.title}
                                    </MenuItem>
                                );

                                return acc;
                            }, [])
                        )}
                    </TextField>

                    <TextField
                        select
                        label="Assign Lecturer (Optional)"
                        fullWidth
                        value={selectedLecturer?.id || ''}
                        onChange={(e) => {
                            const lecturer = availableLecturers.find((l) => l.id === e.target.value);
                            setSelectedLecturer(lecturer || null);
                        }}
                        disabled={loadingLecturers}
                    >
                        <MenuItem value="">
                            <em>None (Unassigned)</em>
                        </MenuItem>
                        {loadingLecturers ? (
                            <MenuItem disabled value="">
                                Loading lecturers...
                            </MenuItem>
                        ) : availableLecturers.length === 0 ? (
                            <MenuItem disabled value="">
                                No lecturers available
                            </MenuItem>
                        ) : (
                            availableLecturers.reduce<React.ReactNode[]>((acc, lecturer, index, array) => {
                                const currentSchool = lecturer.school?.name || 'Uncategorized';
                                const prevSchool = index > 0 ? array[index - 1].school?.name || 'Uncategorized' : null;

                                if (currentSchool !== prevSchool) {
                                    acc.push(
                                        <ListSubheader key={`header-lecturer-${currentSchool}`}>
                                            {currentSchool}
                                        </ListSubheader>
                                    );
                                }

                                acc.push(
                                    <MenuItem key={lecturer.id} value={lecturer.id}>
                                        {formatLecturerName(lecturer)}
                                    </MenuItem>
                                );

                                return acc;
                            }, [])
                        )}
                    </TextField>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={onSubmit}
                    disabled={!selectedCourse || submitting}
                >
                    {submitting ? <CircularProgress size={24} /> : 'Attach Course'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}