import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { Box, Container, CircularProgress, Tabs, Tab, Button, Typography, Paper, Alert } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { PageHeader } from '../../../components/PageHeader';
import { ClickableEntityList } from '../../../components/ClickableEntityList';
import { GET_SCHOOL_DETAILS } from './queries';

import { ProgramModal } from './components/ProgramModal';
import { CourseModal } from './components/CourseModal';
import { LecturerModal } from './components/LecturerModal';

// ----------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------

export interface ProgramNode {
    id: string;
    code: string;
    title: string;
    level: string;
    durationValue: number;
    durationUnit: string;
    shortDescription?: string | null;
}

export interface CourseNode {
    id: string;
    code: string;
    title: string;
    description?: string | null;
    credits: number;
}

export interface LecturerNode {
    id: string;
    firstName: string;
    middleName?: string | null;
    lastName: string;
    user?: {
        id: string;
        email: string;
    } | null;
}

export interface SchoolDetailsData {
    school: {
        id: string;
        name: string;
        description?: string | null;
        dean?: {
            id: string;
            email: string;
        } | null;
        programs: ProgramNode[];
        courses: CourseNode[];
        lecturers: LecturerNode[];
        createdAt: string;
        updatedAt: string;
    };
}

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

export default function SchoolDetailsPage() {
    const { schoolId = '' } = useParams<{ schoolId: string }>();
    const [currentTab, setCurrentTab] = useState(0);

    // Modal open states
    const [openProgramModal, setOpenProgramModal] = useState(false);
    const [openCourseModal, setOpenCourseModal] = useState(false);
    const [openLecturerModal, setOpenLecturerModal] = useState(false);

    const { data, loading, error, refetch } = useQuery<SchoolDetailsData>(GET_SCHOOL_DETAILS, {
        variables: { id: schoolId },
        skip: !schoolId,
        fetchPolicy: 'cache-and-network',
    });

    const school = data?.school;

    if (loading) {
        return (
            <Box sx={{ p: 6, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !school) {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Alert severity="error">
                    {error ? `Failed to load school details: ${error.message}` : 'School record not found.'}
                </Alert>
            </Container>
        );
    }

    const programItems = school.programs.map((p) => ({
        id: p.id,
        primary: `${p.code} - ${p.title}`,
        secondary: `${p.level} • ${p.durationValue} ${p.durationUnit}`,
        targetUrl: `/admin/management/programs/${p.id}`,
    }));

    const courseItems = school.courses.map((c) => ({
        id: c.id,
        primary: `${c.code} - ${c.title}`,
        secondary: `${c.credits} Credits`,
        targetUrl: `/admin/management/courses/${c.id}`,
    }));

    const lecturerItems = school.lecturers.map((l) => ({
        id: l.id,
        primary: [l.firstName, l.middleName, l.lastName].filter(Boolean).join(' '),
        secondary: l.user?.email || 'No user account linked',
        targetUrl: `/admin/management/lecturers/${l.id}`,
    }));

    return (
        <Box sx={{ backgroundColor: 'background.default', minHeight: '70vh', py: 4 }}>
            <Container maxWidth="xl">
                <PageHeader
                    title={school.name}
                    subtitle={school.description || 'School details and academic structures'}
                    backUrl="/admin/management"
                    backLabel="Back to Schools"
                />

                {/* Dean Overview Banner */}
                {school.dean && (
                    <Paper variant="outlined" sx={{ p: 2, mb: 3, borderRadius: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', textTransform: 'uppercase' }}>
                            Dean of School
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {school.dean.email}
                        </Typography>
                    </Paper>
                )}

                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                    <Tabs value={currentTab} onChange={(_, val) => setCurrentTab(val)}>
                        <Tab label={`Programs (${school.programs.length})`} />
                        <Tab label={`Courses (${school.courses.length})`} />
                        <Tab label={`Lecturers (${school.lecturers.length})`} />
                    </Tabs>
                </Box>

                {/* Tab 0: Programs */}
                <Box hidden={currentTab !== 0}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" fontWeight={700}>Academic Programs</Typography>
                        <Button startIcon={<AddIcon />} variant="contained" onClick={() => setOpenProgramModal(true)}>
                            Add Program
                        </Button>
                    </Box>
                    <ClickableEntityList items={programItems} />
                </Box>

                {/* Tab 1: Courses */}
                <Box hidden={currentTab !== 1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" fontWeight={700}>School Courses</Typography>
                        <Button startIcon={<AddIcon />} variant="contained" onClick={() => setOpenCourseModal(true)}>
                            Add Course
                        </Button>
                    </Box>
                    <ClickableEntityList items={courseItems} />
                </Box>

                {/* Tab 2: Lecturers */}
                <Box hidden={currentTab !== 2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" fontWeight={700}>Lecturers & Staff</Typography>
                        <Button startIcon={<AddIcon />} variant="contained" onClick={() => setOpenLecturerModal(true)}>
                            Add Lecturer
                        </Button>
                    </Box>
                    <ClickableEntityList items={lecturerItems} />
                </Box>

                {/* Creation Modals */}
                <ProgramModal
                    open={openProgramModal}
                    schoolId={schoolId}
                    onClose={() => setOpenProgramModal(false)}
                    onSuccess={refetch}
                />
                <CourseModal
                    open={openCourseModal}
                    schoolId={schoolId}
                    onClose={() => setOpenCourseModal(false)}
                    onSuccess={refetch}
                />
                <LecturerModal
                    open={openLecturerModal}
                    schoolId={schoolId}
                    onClose={() => setOpenLecturerModal(false)}
                    onSuccess={refetch}
                />
            </Container>
        </Box>
    );
}