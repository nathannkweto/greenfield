import { useState } from 'react';
import {
    Paper,
    Box,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    Button,
    Chip,
    CircularProgress,
    Snackbar,
    Alert,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import { getStudents } from '../../../../api/generated';
import type { StudentAcademicRecordItem } from '../../../../api/generated';
import type { CohortGroup, Student, CurriculumItem, StudentCourseGrade } from '../types';
import { formatStudentName, formatStudyMode } from '../helpers';
import StudentAcademicDetailsModal from './StudentAcademicDetailsModal';

interface CohortAcademicTableProps {
    cohort: CohortGroup;
    programId: string;
    programCurriculum: CurriculumItem[];
}

export default function CohortAcademicTable({ cohort, programId, programCurriculum }: CohortAcademicTableProps) {
    const [academicData, setAcademicData] = useState<Record<string, StudentCourseGrade[]>>(() => {
        const initial: Record<string, StudentCourseGrade[]> = {};
        cohort.students.forEach((student) => {
            initial[student.id] = student.grades || [];
        });
        return initial;
    });

    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success',
    });

    const handleRowClick = (student: Student) => {
        setSelectedStudent(student);
        setModalOpen(true);
    };

    const handleSaveStudentGrades = (studentId: string, updatedGrades: StudentCourseGrade[]) => {
        setAcademicData((prev) => ({
            ...prev,
            [studentId]: updatedGrades,
        }));
    };

    const handleSaveBatch = async () => {
        setSubmitting(true);
        try {
            const payload: StudentAcademicRecordItem[] = cohort.students.map((student) => ({
                student_id: student.id,
                grades: (academicData[student.id] || []).map((grade) => ({
                    courseId: grade.courseId,
                    courseCode: grade.courseCode ?? null,
                    courseTitle: grade.courseTitle ?? null,
                    year: grade.year,
                    mark: typeof grade.mark === 'number' ? grade.mark : null,
                    maxMark: grade.maxMark ?? 100,
                })),
            }));

            await getStudents().postProgramsPublicIdAcademicReconciliation(programId, {
                cohort_key: cohort.cohortKey,
                academic_records: payload,
            });

            setToast({
                open: true,
                message: `Successfully saved academic records for ${cohort.cohortKey} intake!`,
                severity: 'success',
            });
        } catch (err) {
            console.error('Failed to save academic batch:', err);
            setToast({
                open: true,
                message: `Failed to save academic records for ${cohort.cohortKey} intake.`,
                severity: 'error',
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
                    {cohort.cohortKey} Intake ({cohort.students.length} Students)
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                    onClick={handleSaveBatch}
                    disabled={submitting}
                >
                    {submitting ? 'Saving...' : `Save ${cohort.cohortKey} Academic Records`}
                </Button>
            </Box>

            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Student ID</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Student Name</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Study Mode</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Current Level</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Recorded Courses</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700 }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cohort.students.map((student) => {
                            const recordedCount = (academicData[student.id] || []).filter((g) => g.mark !== '').length;

                            return (
                                <TableRow
                                    key={student.id}
                                    hover
                                    onClick={() => handleRowClick(student)}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    <TableCell sx={{ fontWeight: 600 }}>{student.studentNumber}</TableCell>
                                    <TableCell>{formatStudentName(student)}</TableCell>
                                    <TableCell>{formatStudyMode(student.studyMode)}</TableCell>
                                    <TableCell>
                                        <Chip label={`Year ${student.currentYear}`} size="small" variant="outlined" />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">
                                            {recordedCount} Course Result(s) Recorded
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button
                                            size="small"
                                            startIcon={<EditIcon />}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRowClick(student);
                                            }}
                                        >
                                            View / Edit Marks
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <StudentAcademicDetailsModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                student={selectedStudent}
                programCurriculum={programCurriculum}
                onSaveStudentGrades={handleSaveStudentGrades}
            />

            <Snackbar
                open={toast.open}
                autoHideDuration={4000}
                onClose={() => setToast((prev) => ({ ...prev, open: false }))}
            >
                <Alert severity={toast.severity}>{toast.message}</Alert>
            </Snackbar>
        </Paper>
    );
}