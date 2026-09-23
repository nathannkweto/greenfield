import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useLazyQuery } from '@apollo/client/react';
import { isAxiosError } from 'axios';
import { AXIOS_INSTANCE } from '../../../api/axios-instance';
import {
    Container,
    Box,
    Typography,
    Stack,
    Button,
    CircularProgress,
    Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

import { GET_PROGRAM_DETAILS, GET_ALL_COURSES, GET_ALL_LECTURERS } from './queries';
import type {
    Program,
    CourseOption,
    LecturerOption,
    StudentRegisterItem,
    BatchStudentRegisterResponse,
} from './types';
import { formatCurriculumData, createEmptyStudentRow } from './helpers';

import ProgramOverview from './components/ProgramOverview';
import CurriculumSection from './components/CurriculumSection';
import AddRequirementModal from './components/AddRequirementModal';
import AddCourseModal from './components/AddCourseModal';
import RegisterStudentsModal from './components/RegisterStudentsModal';

export default function ProgramDetailsPage() {
    const { programId } = useParams<{ programId: string }>();
    const navigate = useNavigate();

    // Modal & Form States
    const [openReqModal, setOpenReqModal] = useState(false);
    const [newReqText, setNewReqText] = useState('');
    const [submittingReq, setSubmittingReq] = useState(false);

    const [openCourseModal, setOpenCourseModal] = useState(false);
    const [selectedYear, setSelectedYear] = useState<number | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<CourseOption | null>(null);
    const [selectedLecturer, setSelectedLecturer] = useState<LecturerOption | null>(null);
    const [submittingCourse, setSubmittingCourse] = useState(false);

    // Student Registration States
    const [openStudentModal, setOpenStudentModal] = useState(false);
    const [studentUploadTab, setStudentUploadTab] = useState<number>(0);
    const [studentRows, setStudentRows] = useState<StudentRegisterItem[]>([createEmptyStudentRow()]);
    const [csvFile, setCsvFile] = useState<File | null>(null);
    const [submittingStudents, setSubmittingStudents] = useState(false);
    const [uploadResult, setUploadResult] = useState<BatchStudentRegisterResponse['data'] | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);

    // GraphQL Queries
    const { loading, error, data, refetch } = useQuery<{ program: Program }, { id: string }>(
        GET_PROGRAM_DETAILS,
        {
            variables: { id: programId! },
            skip: !programId,
        }
    );

    const [fetchAllCourses, { data: allCoursesData, loading: loadingCourses }] = useLazyQuery<{
        courses: { edges: Array<{ node: CourseOption }> };
    }>(GET_ALL_COURSES);

    const [fetchAllLecturers, { data: allLecturersData, loading: loadingLecturers }] = useLazyQuery<{
        lecturers: { edges: Array<{ node: LecturerOption }> };
    }>(GET_ALL_LECTURERS);

    const program = data?.program;

    const availableCourses = (allCoursesData?.courses?.edges || [])
        .map((edge) => edge.node)
        .sort((a, b) => (a.school?.name || 'Uncategorized').localeCompare(b.school?.name || 'Uncategorized'));

    const availableLecturers = (allLecturersData?.lecturers?.edges || [])
        .map((edge) => edge.node)
        .sort((a, b) => (a.school?.name || 'Uncategorized').localeCompare(b.school?.name || 'Uncategorized'));

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

    // Handlers: Requirement
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
        } catch (err: unknown) {
            console.error('Failed to add requirement:', err);
        } finally {
            setSubmittingReq(false);
        }
    };

    // Handlers: Course Attachment
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
        } catch (err: unknown) {
            console.error('Failed to add course to curriculum:', err);
        } finally {
            setSubmittingCourse(false);
        }
    };

    // Handlers: Student Registration
    const handleOpenStudentModal = () => {
        setStudentRows([createEmptyStudentRow()]);
        setCsvFile(null);
        setUploadResult(null);
        setUploadError(null);
        setOpenStudentModal(true);
    };

    const handleAddStudentRow = () => {
        setStudentRows((prev) => [...prev, createEmptyStudentRow()]);
    };

    const handleRemoveStudentRow = (index: number) => {
        setStudentRows((prev) => prev.filter((_, i) => i !== index));
    };

    const handleStudentRowChange = <K extends keyof StudentRegisterItem>(
        index: number,
        field: K,
        value: StudentRegisterItem[K]
    ) => {
        setStudentRows((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const handleDownloadCsvTemplate = () => {
        const headers = [
            'first_name', 'middle_names', 'last_name', 'email', 'phone', 'dob',
            'address', 'emergency_contact', 'sex', 'marital_status', 'nationality',
            'nrc_number', 'passport_number', 'application_number', 'admission_number',
            'student_number', 'intake', 'study_mode', 'registration_date', 'current_year',
            'credits_earned', 'cgpa'
        ];

        const sampleRow = [
            'Jane', 'Mary', 'Smith', 'jane.smith@example.com', '+260971234567', '1998-05-12',
            '"123 Great East Road"', '+260978888888', 'female', 'single', 'Zambian',
            '123456/10/1', '', 'APP2026001', 'ADM2026001', 'STU2026001', 'January', 'full_time',
            '2026-01-10', '1', '0', '0.00'
        ];

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), sampleRow.join(',')].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'student_registration_template.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleSubmitBatchStudents = async () => {
        if (!programId || studentRows.length === 0) return;
        setSubmittingStudents(true);
        setUploadError(null);
        setUploadResult(null);

        try {
            const response = await AXIOS_INSTANCE.post<BatchStudentRegisterResponse>(
                `/programs/${programId}/students/batch`,
                { students: studentRows }
            );
            setUploadResult(response.data.data);
            if (response.data.data.successful_count > 0 && response.data.data.failed_count === 0) {
                setStudentRows([createEmptyStudentRow()]);
            }
        } catch (err: unknown) {
            console.error('Failed to register students batch:', err);
            const message = isAxiosError(err) && err.response?.data?.message
                ? (err.response.data.message as string)
                : 'An error occurred during batch student registration.';
            setUploadError(message);
        } finally {
            setSubmittingStudents(false);
        }
    };

    const handleSubmitCsvImport = async () => {
        if (!programId || !csvFile) return;
        setSubmittingStudents(true);
        setUploadError(null);
        setUploadResult(null);

        const formData = new FormData();
        formData.append('file', csvFile);

        try {
            const response = await AXIOS_INSTANCE.post<BatchStudentRegisterResponse>(
                `/programs/${programId}/students/import-csv`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            setUploadResult(response.data.data);
            if (response.data.data.successful_count > 0 && response.data.data.failed_count === 0) {
                setCsvFile(null);
            }
        } catch (err: unknown) {
            console.error('Failed to import CSV:', err);
            const message = isAxiosError(err) && err.response?.data?.message
                ? (err.response.data.message as string)
                : 'An error occurred while uploading the CSV file.';
            setUploadError(message);
        } finally {
            setSubmittingStudents(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
            {/* Header Navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ color: 'text.secondary', textTransform: 'none' }}
                >
                    Back
                </Button>
                <Stack direction="row" spacing={1.5}>
                    <Button
                        variant="contained"
                        startIcon={<GroupAddIcon />}
                        onClick={handleOpenStudentModal}
                        sx={{ borderRadius: 2 }}
                    >
                        Register Students
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<CompareArrowsIcon />}
                        onClick={() => navigate(`/admin/management/programs/${programId}/reconciliations`)}
                        sx={{ borderRadius: 2 }}
                    >
                        Reconciliations
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<EditIcon />}
                        onClick={() => { /* Placeholder edit handler */ }}
                        sx={{ borderRadius: 2 }}
                    >
                        Edit Program
                    </Button>
                </Stack>
            </Box>

            {/* Program Overview */}
            <ProgramOverview
                program={program}
                onOpenReqModal={() => setOpenReqModal(true)}
            />

            {/* Long & Short Description */}
            {(program.longDescription || program.shortDescription) && (
                <Box sx={{ mb: { xs: 4, md: 5 } }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Program Description</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, fontSize: { xs: '0.95rem', md: '1rem' } }}>
                        {program.longDescription || program.shortDescription}
                    </Typography>
                </Box>
            )}

            {/* Curriculum Breakdown */}
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Curriculum Breakdown</Typography>
            <CurriculumSection
                formattedCurriculum={formattedCurriculum}
                onOpenCourseModal={handleOpenCourseModal}
            />

            {/* Modals */}
            <AddRequirementModal
                open={openReqModal}
                onClose={() => setOpenReqModal(false)}
                newReqText={newReqText}
                setNewReqText={setNewReqText}
                submitting={submittingReq}
                onSubmit={handleAddRequirement}
            />

            <AddCourseModal
                open={openCourseModal}
                onClose={() => setOpenCourseModal(false)}
                selectedYear={selectedYear}
                selectedCourse={selectedCourse}
                setSelectedCourse={setSelectedCourse}
                selectedLecturer={selectedLecturer}
                setSelectedLecturer={setSelectedLecturer}
                availableCourses={availableCourses}
                availableLecturers={availableLecturers}
                loadingCourses={loadingCourses}
                loadingLecturers={loadingLecturers}
                submitting={submittingCourse}
                onSubmit={handleAddCourse}
            />

            <RegisterStudentsModal
                open={openStudentModal}
                onClose={() => setOpenStudentModal(false)}
                program={program}
                tab={studentUploadTab}
                setTab={setStudentUploadTab}
                studentRows={studentRows}
                csvFile={csvFile}
                setCsvFile={setCsvFile}
                submitting={submittingStudents}
                uploadResult={uploadResult}
                uploadError={uploadError}
                onAddRow={handleAddStudentRow}
                onRemoveRow={handleRemoveStudentRow}
                onRowChange={handleStudentRowChange}
                onDownloadTemplate={handleDownloadCsvTemplate}
                onSubmitBatch={handleSubmitBatchStudents}
                onSubmitCsv={handleSubmitCsvImport}
            />
        </Container>
    );
}