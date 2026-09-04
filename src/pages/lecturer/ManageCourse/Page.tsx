import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Alert,
    Box,
    Button,
    Chip,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Paper,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';

import { getCurricula } from '../../../api/generated';
import { GET_CURRICULUM_PORTAL } from './queries';

interface AssessmentResult {
    id: string;
    score: number | null;
    student: {
        id: string;
    };
}

interface Assessment {
    id: string;
    title: string;
    description: string | null;
    type: string;
    term: number | null;
    maxScore: number;
    weightPercentage: number;
    dueDate: string | null;
    assessmentResults: AssessmentResult[];
}

interface Student {
    id: string;
    firstName: string;
    lastName: string;
}

interface Enrollment {
    id: string;
    student: Student;
}

interface Program {
    id: string;
    code: string;
    title: string;
    level: string;
}

interface Course {
    id: string;
    code: string;
    title: string;
    description: string | null;
    credits: number;
}

interface CurriculumData {
    curriculum: {
        id: string;
        year: number;
        program: Program;
        course: Course;
        assessments: Assessment[];
        enrollments: Enrollment[];
    } | null;
}

export default function LecturerCourseDetail() {
    const { courseId: curriculumId } = useParams<{ courseId: string }>();
    const navigate = useNavigate();

    const { data, loading, error, refetch } = useQuery<CurriculumData>(GET_CURRICULUM_PORTAL, {
        variables: { id: curriculumId },
        skip: !curriculumId,
    });

    const curriculum = data?.curriculum;
    const course = curriculum?.course;
    const program = curriculum?.program;

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

    const [assessmentForm, setAssessmentForm] = useState({
        title: '',
        description: '',
        type: 'End of Term',
        term: '1',
        weight: '',
        maxScore: '100.00',
        dueDate: ''
    });

    const [scores, setScores] = useState<Record<string, string>>({});

    const handleCreateAssessment = async () => {
        if (!curriculum) return;
        setSaving(true);
        setMessage(null);

        try {
            const api = getCurricula();
            await api.postCurriculaPublicIdAssessmentsCreate(curriculum.id, {
                title: assessmentForm.title,
                description: assessmentForm.description || null,
                type: assessmentForm.type,
                term: assessmentForm.term ? Number(assessmentForm.term) : null,
                weight_percentage: Number(assessmentForm.weight),
                max_score: Number(assessmentForm.maxScore),
                due_date: assessmentForm.dueDate ? new Date(assessmentForm.dueDate).toISOString() : null
            });

            await refetch();
            setIsCreateOpen(false);
            setAssessmentForm({
                title: '',
                description: '',
                type: 'End of Term',
                term: '1',
                weight: '',
                maxScore: '100.00',
                dueDate: ''
            });
            setMessage({ text: 'Assessment created successfully.', type: 'success' });
        } catch (requestError) {
            setMessage({
                text: requestError instanceof Error ? requestError.message : 'Unable to create assessment.',
                type: 'error'
            });
        } finally {
            setSaving(false);
        }
    };

    const handleSaveGrades = async (assessmentId: string) => {
        if (!curriculum) return;
        setSaving(true);
        setMessage(null);

        try {
            const payloadItems = curriculum.enrollments
                .filter(({ student }) => scores[student.id] !== undefined && scores[student.id] !== '')
                .map(({ student }) => ({
                    student_public_id: student.id,
                    score: Number(scores[student.id])
                }));

            await getCurricula().postCurriculaAssessmentsPublicIdGrades(assessmentId, {
                items: payloadItems
            });

            await refetch();
            setMessage({ text: 'Grades saved successfully.', type: 'success' });
        } catch (requestError) {
            setMessage({
                text: requestError instanceof Error ? requestError.message : 'Unable to save grades.',
                type: 'error'
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Container sx={{ py: 8 }}>Loading course details…</Container>;
    if (error || !curriculum || !course || !program) {
        return (
            <Container sx={{ py: 8 }}>
                <Alert severity="error">{error?.message ?? 'Curriculum configuration not found.'}</Alert>
            </Container>
        );
    }

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '80vh', py: 4 }}>
            <Container maxWidth="xl" sx={{ display: 'grid', gap: 3 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/lecturer/dashboard')}
                    sx={{ justifySelf: 'start' }}
                >
                    Back to Dashboard
                </Button>

                <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                    <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                        <Chip label={program.title} color="primary" variant="outlined" size="small" />
                        <Chip label={`Level: ${program.level}`} size="small" />
                        <Chip label={`Year ${curriculum.year}`} size="small" />
                        <Chip label={`${course.credits} Credits`} size="small" />
                    </Stack>
                    <Typography variant="h4" fontWeight={800}>
                        {course.code}: {course.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                        {course.description ?? 'No description provided for this course.'}
                    </Typography>
                </Paper>

                {message && <Alert severity={message.type}>{message.text}</Alert>}

                <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h6" fontWeight={700}>
                            Assessments & Grading
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setIsCreateOpen(true)}
                        >
                            Create Assessment
                        </Button>
                    </Box>

                    {curriculum.assessments.length === 0 ? (
                        <Typography color="text.secondary">No assessments created yet.</Typography>
                    ) : (
                        <Stack spacing={3}>
                            {curriculum.assessments.map((item) => (
                                <Paper key={item.id} variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
                                    <Box sx={{ mb: 2 }}>
                                        <Typography variant="subtitle1" fontWeight={700}>
                                            {item.title} ({item.type})
                                        </Typography>
                                        {item.description && (
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                                {item.description}
                                            </Typography>
                                        )}
                                        <Typography variant="body2" color="text.secondary">
                                            Weight: {item.weightPercentage}% | Max Score: {item.maxScore}
                                            {item.term ? ` | Term: ${item.term}` : ''}
                                            {item.dueDate ? ` | Due: ${new Date(item.dueDate).toLocaleDateString()}` : ''}
                                        </Typography>
                                    </Box>

                                    <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600 }}>
                                        Student Grade Roster
                                    </Typography>

                                    <Stack spacing={1.5} sx={{ mb: 2 }}>
                                        {curriculum.enrollments.map(({ student }) => {
                                            const existingResult = item.assessmentResults.find(
                                                (res) => res.student.id === student.id
                                            );

                                            return (
                                                <Box
                                                    key={student.id}
                                                    sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                                                >
                                                    <Typography sx={{ flex: 1, fontWeight: 500 }}>
                                                        {student.firstName} {student.lastName}
                                                    </Typography>
                                                    <TextField
                                                        size="small"
                                                        type="number"
                                                        label="Score"
                                                        defaultValue={existingResult?.score ?? ''}
                                                        onChange={(e) =>
                                                            setScores((prev) => ({
                                                                ...prev,
                                                                [student.id]: e.target.value
                                                            }))
                                                        }
                                                        sx={{ width: 120 }}
                                                    />
                                                </Box>
                                            );
                                        })}
                                    </Stack>

                                    <Button
                                        variant="outlined"
                                        startIcon={<SaveIcon />}
                                        onClick={() => handleSaveGrades(item.id)}
                                        disabled={saving}
                                    >
                                        Save Grades
                                    </Button>
                                </Paper>
                            ))}
                        </Stack>
                    )}
                </Paper>

                {/* Assessment Modal */}
                <Dialog
                    open={isCreateOpen}
                    onClose={() => !saving && setIsCreateOpen(false)}
                    fullWidth
                    maxWidth="sm"
                >
                    <DialogTitle>Create Assessment</DialogTitle>
                    <DialogContent sx={{ display: 'grid', gap: 2, pt: 2 }}>
                        <TextField
                            label="Title"
                            value={assessmentForm.title}
                            onChange={(e) => setAssessmentForm({ ...assessmentForm, title: e.target.value })}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Description"
                            value={assessmentForm.description}
                            onChange={(e) => setAssessmentForm({ ...assessmentForm, description: e.target.value })}
                            multiline
                            rows={2}
                            fullWidth
                        />
                        <TextField
                            select
                            label="Type"
                            value={assessmentForm.type}
                            onChange={(e) => setAssessmentForm({ ...assessmentForm, type: e.target.value })}
                            fullWidth
                        >
                            <MenuItem value="End of Term">End of Term</MenuItem>
                            <MenuItem value="Final Exam">Final Exam</MenuItem>
                        </TextField>
                        <TextField
                            label="Term"
                            type="number"
                            value={assessmentForm.term}
                            onChange={(e) => setAssessmentForm({ ...assessmentForm, term: e.target.value })}
                            helperText="Term number (e.g., 1, 2, or 3)"
                            fullWidth
                        />
                        <TextField
                            label="Weight Percentage (%)"
                            type="number"
                            value={assessmentForm.weight}
                            onChange={(e) => setAssessmentForm({ ...assessmentForm, weight: e.target.value })}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Maximum Score"
                            type="number"
                            value={assessmentForm.maxScore}
                            onChange={(e) => setAssessmentForm({ ...assessmentForm, maxScore: e.target.value })}
                            fullWidth
                        />
                        <TextField
                            label="Due Date"
                            type="datetime-local"
                            value={assessmentForm.dueDate}
                            onChange={(e) => setAssessmentForm({ ...assessmentForm, dueDate: e.target.value })}
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setIsCreateOpen(false)} disabled={saving}>
                            Cancel
                        </Button>
                        <Button variant="contained" onClick={handleCreateAssessment} disabled={saving}>
                            {saving ? 'Creating…' : 'Create'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
}