import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useLazyQuery } from '@apollo/client/react';
import { AXIOS_INSTANCE } from '../../../api/axios-instance';
import {
    Container,
    Box,
    Typography,
    Paper,
    Stack,
    Button,
    IconButton,
    Tooltip,
    useTheme,
    useMediaQuery,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    ListSubheader,
    Chip
} from '@mui/material';
import Grid from '@mui/material/Grid';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import { GET_PROGRAM_DETAILS, GET_ALL_COURSES, GET_ALL_LECTURERS } from './queries';

interface School {
    id: string;
    name: string;
}

interface CourseOption {
    id: string;
    code?: string;
    title: string;
    credits?: number;
    school?: School;
}

interface LecturerOption {
    id: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    school?: School;
}

interface CurriculumItem {
    id: string;
    year: number;
    course?: CourseOption;
    lecturer?: LecturerOption;
}

interface Requirement {
    id: string;
    description: string;
    sortOrder?: number;
}

export type ProgramLevel = 'Certificate' | 'Diploma' | 'Degree' | 'Post_graduate_Diploma';
export type DurationUnit = 'weeks' | 'months' | 'years';

interface Program {
    id: string;
    code?: string;
    title: string;
    level?: ProgramLevel;
    durationValue?: number;
    durationUnit?: DurationUnit;
    shortDescription?: string;
    longDescription?: string;
    requirements?: Requirement[];
    curricula?: CurriculumItem[];
    school?: School;
}

interface FormattedYear {
    year: number;
    items: CurriculumItem[];
}

function formatDuration(value?: number, unit?: DurationUnit): string {
    if (!value || !unit) return 'N/A';
    const singularUnit = unit.toLowerCase().replace(/s$/, '');
    const formattedUnit = value === 1 ? singularUnit : `${singularUnit}s`;
    return `${value} ${formattedUnit.charAt(0).toUpperCase() + formattedUnit.slice(1)}`;
}

function formatLevel(level?: ProgramLevel): string {
    if (!level) return 'N/A';
    if (level === 'Post_graduate_Diploma') return 'Post-graduate Diploma';
    return level;
}

function formatLecturerName(lecturer?: LecturerOption): string {
    if (!lecturer) return '';
    const parts = [lecturer.firstName, lecturer.middleName, lecturer.lastName].filter(Boolean);
    return parts.join(' ');
}

function formatCurriculumData(
    durationValue?: number,
    durationUnit?: DurationUnit,
    curricula?: CurriculumItem[]
): FormattedYear[] {
    let totalYears = 1;

    if (durationValue && durationUnit?.toLowerCase() === 'years') {
        totalYears = durationValue;
    } else if (curricula && curricula.length > 0) {
        totalYears = Math.max(...curricula.map((c) => c.year), 1);
    }

    const yearsMap = new Map<number, CurriculumItem[]>();

    for (let y = 1; y <= totalYears; y++) {
        yearsMap.set(y, []);
    }

    curricula?.forEach((item) => {
        const yearKey = item.year;
        if (!yearsMap.has(yearKey)) {
            yearsMap.set(yearKey, []);
        }
        yearsMap.get(yearKey)!.push(item);
    });

    return Array.from(yearsMap.entries())
        .sort(([yearA], [yearB]) => yearA - yearB)
        .map(([year, items]) => ({ year, items }));
}

function MetricCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    return (
        <Box
            sx={{
                display: 'flex',
                gap: 1.5,
                alignItems: 'center',
                p: isMobile ? 1.5 : 0,
                backgroundColor: isMobile ? 'action.hover' : 'transparent',
                borderRadius: 2,
            }}
        >
            {icon}
            <Box>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}
                >
                    {label}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {value}
                </Typography>
            </Box>
        </Box>
    );
}

export default function ProgramDetailsPage() {
    const { programId } = useParams<{ programId: string }>();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Modal & Form States
    const [openReqModal, setOpenReqModal] = useState(false);
    const [newReqText, setNewReqText] = useState('');
    const [submittingReq, setSubmittingReq] = useState(false);

    const [openCourseModal, setOpenCourseModal] = useState(false);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<CourseOption | null>(null);
    const [selectedLecturer, setSelectedLecturer] = useState<LecturerOption | null>(null);
    const [submittingCourse, setSubmittingCourse] = useState(false);

    // GraphQL Read Queries
    const { loading, error, data, refetch } = useQuery<{ program: Program }, { id: string }>(
        GET_PROGRAM_DETAILS,
        {
            variables: { id: programId! },
            skip: !programId,
        }
    );

    const [fetchAllCourses, { data: allCoursesData, loading: loadingCourses }] = useLazyQuery<{
        courses: {
            edges: Array<{
                node: CourseOption;
            }>;
        };
    }>(GET_ALL_COURSES);

    const [fetchAllLecturers, { data: allLecturersData, loading: loadingLecturers }] = useLazyQuery<{
        lecturers: {
            edges: Array<{
                node: LecturerOption;
            }>;
        };
    }>(GET_ALL_LECTURERS);

    const program = data?.program;

    const availableCourses = (allCoursesData?.courses?.edges || [])
        .map((edge) => edge.node)
        .sort((a, b) => {
            const schoolA = a.school?.name || 'Uncategorized';
            const schoolB = b.school?.name || 'Uncategorized';
            return schoolA.localeCompare(schoolB);
        });

    const availableLecturers = (allLecturersData?.lecturers?.edges || [])
        .map((edge) => edge.node)
        .sort((a, b) => {
            const schoolA = a.school?.name || 'Uncategorized';
            const schoolB = b.school?.name || 'Uncategorized';
            return schoolA.localeCompare(schoolB);
        });

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !program) {
        return (
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Alert severity="error">Program details not found.</Alert>
            </Container>
        );
    }

    const formattedCurriculum = formatCurriculumData(
        program.durationValue,
        program.durationUnit,
        program.curricula
    );

    // Mutation Handlers
    const handleAddRequirement = async () => {
        if (!newReqText.trim() || !programId) return;
        setSubmittingReq(true);
        try {
            await AXIOS_INSTANCE.post(`/programs/${programId}/requirements`, {
                description: newReqText,
            });
            setNewReqText('');
            setOpenReqModal(false);
            await refetch();
        } catch (err) {
            console.error('Failed to add requirement:', err);
        } finally {
            setSubmittingReq(false);
        }
    };

    const handleOpenCourseModal = async (year: number) => {
        setSelectedYear(year);
        setSelectedCourse(null);
        setSelectedLecturer(null);
        setOpenCourseModal(true);
        await Promise.all([fetchAllCourses(), fetchAllLecturers()]);
    };

    const handleAddCourse = async () => {
        if (!selectedCourse || selectedYear === null || !programId) return;
        setSubmittingCourse(true);
        try {
            await AXIOS_INSTANCE.post(`/programs/${programId}/curriculum`, {
                program_public_id: programId,
                course_public_id: selectedCourse.id,
                lecturer_public_id: selectedLecturer?.id || null,
                year: selectedYear,
            });
            setOpenCourseModal(false);
            setSelectedCourse(null);
            setSelectedLecturer(null);
            await refetch();
        } catch (err) {
            console.error('Failed to add course to curriculum:', err);
        } finally {
            setSubmittingCourse(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
            {/* Header Navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ color: 'text.secondary', textTransform: 'none' }}
                >
                    Back
                </Button>
                <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => { /* Placeholder edit handler */ }}
                    sx={{ borderRadius: 2 }}
                >
                    Edit Program
                </Button>
            </Box>

            {/* SECTION 1: Program Overview */}
            <Paper
                variant="outlined"
                sx={{
                    p: { xs: 3, md: 4 },
                    borderRadius: { xs: 3, md: 4 },
                    borderColor: 'divider',
                    mb: { xs: 4, md: 5 }
                }}
            >
                <Box sx={{ mb: 3 }}>
                    <Typography
                        variant={isMobile ? 'h5' : 'h4'}
                        sx={{ fontWeight: 800, lineHeight: 1.3 }}
                    >
                        {program.code ? `${program.code}: ` : ''}{program.title}
                    </Typography>
                </Box>

                <Grid container spacing={isMobile ? 2 : 3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <MetricCard
                            icon={<AccessTimeIcon color="primary" />}
                            label="Duration"
                            value={formatDuration(program.durationValue, program.durationUnit)}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <MetricCard
                            icon={<WorkspacePremiumIcon color="primary" />}
                            label="Qualification / Level"
                            value={formatLevel(program.level)}
                        />
                    </Grid>

                    {/* REQUIREMENTS LIST */}
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: { xs: 1, md: 2 } }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                                Admission Requirements
                            </Typography>
                            <Tooltip title="Add Requirement">
                                <IconButton size="small" color="primary" onClick={() => setOpenReqModal(true)}>
                                    <AddIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Box>

                        {program.requirements && program.requirements.length > 0 ? (
                            <Box component="ul" sx={{ pl: 2.5, mt: 1, mb: 0, color: 'text.secondary', typography: 'body2', lineHeight: 1.7 }}>
                                {program.requirements.map((req) => (
                                    <li key={req.id} style={{ marginBottom: '4px' }}>
                                        {req.description}
                                    </li>
                                ))}
                            </Box>
                        ) : (
                            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: 1 }}>
                                No admission requirements added yet. Click '+' above to add one.
                            </Typography>
                        )}
                    </Grid>
                </Grid>
            </Paper>

            {/* SECTION 2: Description */}
            {(program.longDescription || program.shortDescription) && (
                <Box sx={{ mb: { xs: 4, md: 5 } }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Program Description</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, fontSize: { xs: '0.95rem', md: '1rem' } }}>
                        {program.longDescription || program.shortDescription}
                    </Typography>
                </Box>
            )}

            {/* SECTION 3: Curriculum Breakdown */}
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Curriculum Breakdown</Typography>
            <Stack spacing={2.5}>
                {formattedCurriculum.map((yearData) => (
                    <Paper key={yearData.year} variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 3, borderColor: 'divider' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'primary.main' }}>
                                Year {yearData.year}
                            </Typography>
                            <Button
                                size="small"
                                startIcon={<AddIcon />}
                                variant="text"
                                onClick={() => handleOpenCourseModal(yearData.year)}
                            >
                                Add Course
                            </Button>
                        </Box>

                        <Grid container spacing={2}>
                            {yearData.items.length > 0 ? (
                                yearData.items.map((item) => (
                                    <Grid key={item.id} size={{ xs: 12, sm: 6, md: 4 }}>
                                        <Box
                                            sx={{
                                                p: 2,
                                                backgroundColor: 'action.hover',
                                                borderRadius: 2,
                                                border: 1,
                                                borderColor: 'divider',
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justify: 'space-between'
                                            }}
                                        >
                                            <Box>
                                                {item.course?.code && (
                                                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main', display: 'block', mb: 0.5 }}>
                                                        {item.course.code}
                                                    </Typography>
                                                )}
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                                    {item.course?.title || 'Untitled Course'}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ mt: 1.5 }}>
                                                {item.lecturer && (
                                                    <Chip
                                                        icon={<PersonIcon fontSize="small" />}
                                                        label={formatLecturerName(item.lecturer)}
                                                        size="small"
                                                        variant="outlined"
                                                        color="primary"
                                                        sx={{ mb: 1, maxWidth: '100%' }}
                                                    />
                                                )}
                                                {item.course?.credits !== undefined && (
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                        {item.course.credits} Credits
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Box>
                                    </Grid>
                                ))
                            ) : (
                                <Grid size={{ xs: 12 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                        No courses configured for Year {yearData.year}.
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Paper>
                ))}
            </Stack>

            {/* Modal: Add Requirement */}
            <Dialog open={openReqModal} onClose={() => setOpenReqModal(false)} fullWidth maxWidth="sm">
                <DialogTitle>Add Admission Requirement</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Requirement Description"
                        fullWidth
                        multiline
                        rows={3}
                        value={newReqText}
                        onChange={(e) => setNewReqText(e.target.value)}
                        placeholder='e.g., "5 O-Level Credits including Mathematics and English"'
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setOpenReqModal(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleAddRequirement}
                        disabled={!newReqText.trim() || submittingReq}
                    >
                        {submittingReq ? <CircularProgress size={24} /> : 'Save Requirement'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Modal: Add Course to Curriculum */}
            <Dialog open={openCourseModal} onClose={() => setOpenCourseModal(false)} fullWidth maxWidth="sm">
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
                    <Button onClick={() => setOpenCourseModal(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleAddCourse}
                        disabled={!selectedCourse || submittingCourse}
                    >
                        {submittingCourse ? <CircularProgress size={24} /> : 'Attach Course'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}