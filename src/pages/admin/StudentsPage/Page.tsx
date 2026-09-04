import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import {
    Box, Container, Typography, Paper, Tabs, Tab, TextField, MenuItem,
    List, ListItemButton, ListItemAvatar, Avatar, ListItemText, Chip, Button,
    useTheme, useMediaQuery, Divider, CircularProgress, Alert
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CancelIcon from '@mui/icons-material/Cancel';

import { GET_STUDENTS_LIST, GET_SCHOOLS_AND_PROGRAMS } from './queries';
import { getStudents } from '../../../api/generated';

// ----------------------------------------------------------------------
// TypeScript Interfaces
// ----------------------------------------------------------------------

export type StudentStatusEnum = 'REGISTERED' | 'ADMITTED' | 'PENDING' | 'REJECTED' | 'GRADUATED' | 'SUSPENDED';

export interface SchoolNode {
    id: string;
    name: string;
}

export interface ProgramNode {
    id: string;
    title: string;
    school: {
        id: string;
        name: string;
    };
}

export interface StudentNode {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    applicationNumber: string;
    admissionNumber?: string | null;
    studentNumber?: string | null;
    status: StudentStatusEnum;
    applicationDate: string;
    admissionDate?: string;
    cgpa: number;
    creditsCompleted: number;
    program: ProgramNode;
}

interface GetSchoolsAndProgramsData {
    schools: {
        edges: Array<{ node: SchoolNode }>;
    };
    programs: {
        edges: Array<{ node: ProgramNode }>;
    };
}

interface GetStudentsListData {
    students: {
        edges: Array<{ node: StudentNode }>;
    };
}

interface GetStudentsListVariables {
    status?: StudentStatusEnum;
    programId?: string;
}

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

export default function StudentsPage() {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [currentTab, setCurrentTab] = useState(0);
    const [filterSchoolId, setFilterSchoolId] = useState('All');
    const [filterProgramId, setFilterProgramId] = useState('All');
    const [sortBy, setSortBy] = useState<'name' | 'id'>('name');
    const [actionError, setActionError] = useState<string | null>(null);
    const [isRejecting, setIsRejecting] = useState<string | null>(null);

    // 1. Fetch Schools & Programs for Dropdown Filters
    const { data: filterData } = useQuery<GetSchoolsAndProgramsData>(GET_SCHOOLS_AND_PROGRAMS);

    const schoolsList = useMemo<SchoolNode[]>(() => {
        if (!filterData?.schools?.edges) return [];
        return filterData.schools.edges.map((edge) => edge.node);
    }, [filterData]);

    const programsList = useMemo<ProgramNode[]>(() => {
        if (!filterData?.programs?.edges) return [];
        const allPrograms = filterData.programs.edges.map((edge) => edge.node);
        if (filterSchoolId === 'All') return allPrograms;
        return allPrograms.filter((p) => p.school.id === filterSchoolId);
    }, [filterData, filterSchoolId]);

    // 2. Fetch Students List
    const { data: studentsData, loading, error, refetch } = useQuery<GetStudentsListData, GetStudentsListVariables>(
        GET_STUDENTS_LIST,
        {
            variables: {
                programId: filterProgramId !== 'All' ? filterProgramId : undefined,
            },
            fetchPolicy: 'cache-and-network',
        }
    );

    // Map Relay edges to flat array
    const rawStudents = useMemo<StudentNode[]>(() => {
        if (!studentsData?.students?.edges) return [];
        return studentsData.students.edges.map((edge) => edge.node);
    }, [studentsData]);

    // Compute target statuses based on current tab
    const targetStatuses = useMemo<StudentStatusEnum[]>(() => {
        if (currentTab === 0) return ['REGISTERED', 'SUSPENDED', 'GRADUATED'];
        if (currentTab === 1) return ['ADMITTED'];
        return ['PENDING', 'REJECTED'];
    }, [currentTab]);

    // Helper function to resolve reference number according to selected tab
    const getDisplayNumber = (student: StudentNode, tab: number): string => {
        if (tab === 0) return student.studentNumber ?? 'N/A';
        if (tab === 1) return student.admissionNumber ?? 'N/A';
        return student.applicationNumber ?? 'N/A';
    };

    // Filter and Sort Logic
    const processedStudents = useMemo(() => {
        let result = rawStudents.filter((s) => targetStatuses.includes(s.status));

        // Filter by School ID
        if (filterSchoolId !== 'All') {
            result = result.filter((s) => s.program.school.id === filterSchoolId);
        }

        // Sort
        result.sort((a, b) => {
            if (sortBy === 'name') {
                const nameA = `${a.lastName} ${a.firstName}`.toLowerCase();
                const nameB = `${b.lastName} ${b.firstName}`.toLowerCase();
                return nameA.localeCompare(nameB);
            }
            const numA = getDisplayNumber(a, currentTab);
            const numB = getDisplayNumber(b, currentTab);
            return numA.localeCompare(numB);
        });

        return result;
    }, [rawStudents, targetStatuses, filterSchoolId, sortBy, currentTab]);

    const handleCancelAdmission = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        setActionError(null);
        setIsRejecting(id);
        try {
            await getStudents().postStudentsPublicIdReject(id, { reason: 'Admission cancelled by an administrator.' });
            await refetch();
        } catch (requestError) {
            setActionError(requestError instanceof Error ? requestError.message : 'Unable to cancel this admission.');
        } finally {
            setIsRejecting(null);
        }
    };

    // Status Label Formatting
    const formatStatus = (status: StudentStatusEnum): string => {
        return status.charAt(0) + status.slice(1).toLowerCase();
    };

    return (
        <Box sx={{ backgroundColor: 'background.default', minHeight: '70vh', width: '100%', overflowX: 'hidden', py: { xs: 2, md: 4 } }}>
            <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>

                <Typography variant="h4" sx={{ fontWeight: 800 }}>Students & Admissions</Typography>
                {actionError && <Alert severity="error" onClose={() => setActionError(null)}>{actionError}</Alert>}

                {/* Tabs & Filters */}
                <Paper variant="outlined" sx={{ borderRadius: 2 }}>
                    <Tabs
                        value={currentTab}
                        onChange={(_, v) => setCurrentTab(v)}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{ borderBottom: 1, borderColor: 'divider' }}
                    >
                        <Tab label="Registered Students" />
                        <Tab label="Admissions" />
                        <Tab label="Applications" />
                    </Tabs>

                    <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 2, backgroundColor: 'background.paper' }}>
                        {/* School Filter */}
                        <TextField
                            select
                            label="School"
                            value={filterSchoolId}
                            onChange={(e) => {
                                setFilterSchoolId(e.target.value);
                                setFilterProgramId('All');
                            }}
                            size="small"
                            sx={{ minWidth: 200, flex: { xs: '1 1 100%', sm: '0 0 auto' } }}
                        >
                            <MenuItem value="All">All Schools</MenuItem>
                            {schoolsList.map((school) => (
                                <MenuItem key={school.id} value={school.id}>{school.name}</MenuItem>
                            ))}
                        </TextField>

                        {/* Program Filter */}
                        <TextField
                            select
                            label="Program"
                            value={filterProgramId}
                            onChange={(e) => setFilterProgramId(e.target.value)}
                            size="small"
                            sx={{ minWidth: 200, flex: { xs: '1 1 100%', sm: '0 0 auto' } }}
                        >
                            <MenuItem value="All">All Programs</MenuItem>
                            {programsList.map((program) => (
                                <MenuItem key={program.id} value={program.id}>{program.title}</MenuItem>
                            ))}
                        </TextField>

                        {/* Sort Dropdown */}
                        <TextField
                            select
                            label="Sort By"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'name' | 'id')}
                            size="small"
                            sx={{ minWidth: 150, ml: { sm: 'auto' }, flex: { xs: '1 1 100%', sm: '0 0 auto' } }}
                        >
                            <MenuItem value="name">Alphabetical</MenuItem>
                            <MenuItem value="id">Reference Number</MenuItem>
                        </TextField>
                    </Box>
                </Paper>

                {/* Student List */}
                <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    {loading ? (
                        <Box sx={{ p: 6, display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Box sx={{ p: 3 }}>
                            <Alert severity="error">Failed to load students: {error.message}</Alert>
                        </Box>
                    ) : (
                        <List disablePadding>
                            {processedStudents.length === 0 ? (
                                <Box sx={{ p: 4, textAlign: 'center' }}>
                                    <Typography color="text.secondary">No students found.</Typography>
                                </Box>
                            ) : (
                                processedStudents.map((student, idx) => (
                                    <React.Fragment key={student.id}>
                                        <ListItemButton
                                            onClick={() => navigate(`/admin/students/${student.id}`)}
                                            sx={{ py: 2, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: 2 }}
                                        >
                                            <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                                                <ListItemAvatar>
                                                    <Avatar sx={{ backgroundColor: 'primary.light', color: 'primary.dark' }}>
                                                        <PersonIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Typography sx={{ fontWeight: 600 }}>
                                                            {student.lastName}, {student.firstName}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Box component="span" sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5 }}>
                                                            <Typography variant="body2" component="span">
                                                                {getDisplayNumber(student, currentTab)} | {student.program.title}
                                                            </Typography>
                                                            {isMobile && (
                                                                <Chip size="small" label={formatStatus(student.status)} sx={{ alignSelf: 'flex-start', mt: 0.5 }} />
                                                            )}
                                                        </Box>
                                                    }
                                                />
                                            </Box>

                                            {/* Actions & Badges */}
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'flex-end' : 'flex-start' }}>
                                                {!isMobile && <Chip label={formatStatus(student.status)} size="small" />}

                                                {currentTab === 1 && (
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        startIcon={<CancelIcon />}
                                                        onClick={(e) => handleCancelAdmission(e, student.id)}
                                                        disabled={isRejecting === student.id}
                                                    >
                                                        {isRejecting === student.id ? 'Cancelling…' : 'Cancel'}
                                                    </Button>
                                                )}
                                            </Box>
                                        </ListItemButton>
                                        {idx < processedStudents.length - 1 && <Divider component="li" />}
                                    </React.Fragment>
                                ))
                            )}
                        </List>
                    )}
                </Paper>
            </Container>
        </Box>
    );
}