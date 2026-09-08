import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import {
    Box, Container, Typography, Paper, Tabs, Tab, TextField, MenuItem,
    Avatar, Chip, Button, CircularProgress, Alert, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow
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

const getStatusChipColor = (status: StudentStatusEnum): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    switch (status) {
        case 'REGISTERED': return 'success';
        case 'ADMITTED': return 'info';
        case 'PENDING': return 'warning';
        case 'REJECTED':
        case 'SUSPENDED': return 'error';
        case 'GRADUATED': return 'secondary';
        default: return 'default';
    }
};

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

export default function StudentsPage() {
    const navigate = useNavigate();

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

    const rawStudents = useMemo<StudentNode[]>(() => {
        if (!studentsData?.students?.edges) return [];
        return studentsData.students.edges.map((edge) => edge.node);
    }, [studentsData]);

    const targetStatuses = useMemo<StudentStatusEnum[]>(() => {
        if (currentTab === 0) return ['REGISTERED', 'SUSPENDED', 'GRADUATED'];
        if (currentTab === 1) return ['ADMITTED'];
        return ['PENDING', 'REJECTED'];
    }, [currentTab]);

    const refColumnLabel = useMemo(() => {
        if (currentTab === 0) return 'Student ID';
        if (currentTab === 1) return 'Admission No.';
        return 'Application No.';
    }, [currentTab]);

    const getDisplayNumber = (student: StudentNode, tab: number): string => {
        if (tab === 0) return student.studentNumber ?? 'N/A';
        if (tab === 1) return student.admissionNumber ?? 'N/A';
        return student.applicationNumber ?? 'N/A';
    };

    const processedStudents = useMemo(() => {
        let result = rawStudents.filter((s) => targetStatuses.includes(s.status));

        if (filterSchoolId !== 'All') {
            result = result.filter((s) => s.program.school.id === filterSchoolId);
        }

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

    const formatStatus = (status: StudentStatusEnum): string => {
        return status.charAt(0) + status.slice(1).toLowerCase();
    };

    return (
        <Box sx={{ backgroundColor: 'background.default', minHeight: '70vh', width: '100%', overflowX: 'hidden', py: { xs: 2, md: 4 } }}>
            <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>

                <Typography variant="h4" sx={{ fontWeight: 800 }}>Students & Admissions</Typography>
                {actionError && <Alert severity="error" onClose={() => setActionError(null)}>{actionError}</Alert>}

                {/* Single Master Card containing Tabs, Filters, and Table */}
                <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>

                    {/* Tabs Bar */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: 'background.paper' }}>
                        <Tabs
                            value={currentTab}
                            onChange={(_, v) => setCurrentTab(v)}
                            variant="scrollable"
                            scrollButtons="auto"
                        >
                            <Tab label="Registered Students" />
                            <Tab label="Admissions" />
                            <Tab label="Applications" />
                        </Tabs>
                    </Box>

                    {/* Responsive Filters Row */}
                    <Box
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: 'center',
                            gap: 2,
                            borderBottom: 1,
                            borderColor: 'divider',
                            backgroundColor: 'background.paper'
                        }}
                    >
                        <TextField
                            select
                            label="School"
                            value={filterSchoolId}
                            onChange={(e) => {
                                setFilterSchoolId(e.target.value);
                                setFilterProgramId('All');
                            }}
                            size="small"
                            sx={{ width: { xs: '100%', sm: 220 } }}
                        >
                            <MenuItem value="All">All Schools</MenuItem>
                            {schoolsList.map((school) => (
                                <MenuItem key={school.id} value={school.id}>{school.name}</MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Program"
                            value={filterProgramId}
                            onChange={(e) => setFilterProgramId(e.target.value)}
                            size="small"
                            sx={{ width: { xs: '100%', sm: 220 } }}
                        >
                            <MenuItem value="All">All Programs</MenuItem>
                            {programsList.map((program) => (
                                <MenuItem key={program.id} value={program.id}>{program.title}</MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select
                            label="Sort By"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'name' | 'id')}
                            size="small"
                            sx={{ width: { xs: '100%', sm: 180 }, ml: { sm: 'auto' } }}
                        >
                            <MenuItem value="name">Alphabetical</MenuItem>
                            <MenuItem value="id">Reference Number</MenuItem>
                        </TextField>
                    </Box>

                    {/* Table */}
                    {loading ? (
                        <Box sx={{ p: 6, display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Box sx={{ p: 3 }}>
                            <Alert severity="error">Failed to load students: {error.message}</Alert>
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead sx={{ backgroundColor: 'action.hover' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700 }}>Student Name</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>{refColumnLabel}</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Program & School</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                        {currentTab === 1 && <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {processedStudents.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={currentTab === 1 ? 5 : 4} align="center" sx={{ py: 6 }}>
                                                <Typography color="text.secondary">No students found.</Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        processedStudents.map((student) => (
                                            <TableRow
                                                key={student.id}
                                                hover
                                                onClick={() => navigate(`/admin/students/${student.id}`)}
                                                sx={{ cursor: 'pointer' }}
                                            >
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Avatar sx={{ width: 36, height: 36, backgroundColor: 'primary.light', color: 'primary.dark' }}>
                                                            <PersonIcon fontSize="small" />
                                                        </Avatar>
                                                        <Box>
                                                            <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                                                                {student.lastName} {student.firstName}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                                                {student.email}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>

                                                <TableCell sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
                                                    {getDisplayNumber(student, currentTab)}
                                                </TableCell>

                                                <TableCell>
                                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                        {student.program.title}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {student.program.school.name}
                                                    </Typography>
                                                </TableCell>

                                                <TableCell>
                                                    <Chip
                                                        label={formatStatus(student.status)}
                                                        size="small"
                                                        color={getStatusChipColor(student.status)}
                                                    />
                                                </TableCell>

                                                {currentTab === 1 && (
                                                    <TableCell align="right">
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
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>
            </Container>
        </Box>
    );
}