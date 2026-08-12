import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Container, Typography, Paper, Tabs, Tab, TextField, MenuItem,
    List, ListItemButton, ListItemAvatar, Avatar, ListItemText, Chip, Button,
    useTheme, useMediaQuery, Divider
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CancelIcon from '@mui/icons-material/Cancel';

import { MOCK_STUDENTS, type StudentStatus } from '../../data/studentsData';

export default function StudentsPage() {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [currentTab, setCurrentTab] = useState(0);
    const [filterSchool, setFilterSchool] = useState('All');
    const [filterProgram, setFilterProgram] = useState('All');
    const [sortBy, setSortBy] = useState<'name' | 'id'>('name');

    // Extract unique schools and programs for filters
    const uniqueSchools = ['All', ...Array.from(new Set(MOCK_STUDENTS.map(s => s.school)))];
    const uniquePrograms = ['All', ...Array.from(new Set(MOCK_STUDENTS.map(s => s.program)))];

    // Determine target statuses based on active tab
    const getTargetStatuses = (): StudentStatus[] => {
        if (currentTab === 0) return ['Registered', 'Suspended', 'Graduated'];
        if (currentTab === 1) return ['Admitted'];
        return ['Pending', 'Rejected']; // Applications tab
    };

    // Filter and Sort Logic
    const processedStudents = useMemo(() => {
        let result = MOCK_STUDENTS.filter(s => getTargetStatuses().includes(s.status));

        if (filterSchool !== 'All') {
            result = result.filter(s => s.school === filterSchool);
        }
        if (filterProgram !== 'All') {
            result = result.filter(s => s.program === filterProgram);
        }

        result.sort((a, b) => {
            if (sortBy === 'name') {
                const nameA = `${a.lastName} ${a.firstName}`.toLowerCase();
                const nameB = `${b.lastName} ${b.firstName}`.toLowerCase();
                return nameA.localeCompare(nameB);
            }
            return a.id.localeCompare(b.id);
        });

        return result;
    }, [currentTab, filterSchool, filterProgram, sortBy]);

    const handleCancelAdmission = (e: React.MouseEvent, id: string) => {
        e.stopPropagation(); // Prevent row click
        // Trigger your API call or modal here
        alert(`Cancel admission for ${id}`);
    };

    return (
        <Box sx={{ backgroundColor: 'background.default', minHeight: '70vh', width: '100%', overflowX: 'hidden', py: { xs: 2, md: 4 } }}>
            <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>

                <Typography variant="h4" sx={{ fontWeight: 800 }}>Students & Admissions</Typography>

                {/* Tabs */}
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

                    {/* Filters & Sorting */}
                    <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 2, backgroundColor: 'background.paper' }}>
                        <TextField
                            select label="School" value={filterSchool}
                            onChange={(e) => setFilterSchool(e.target.value)}
                            size="small" sx={{ minWidth: 200, flex: { xs: '1 1 100%', sm: '0 0 auto' } }}
                        >
                            {uniqueSchools.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                        </TextField>

                        <TextField
                            select label="Program" value={filterProgram}
                            onChange={(e) => setFilterProgram(e.target.value)}
                            size="small" sx={{ minWidth: 200, flex: { xs: '1 1 100%', sm: '0 0 auto' } }}
                        >
                            {uniquePrograms.map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                        </TextField>

                        <TextField
                            select label="Sort By" value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'name' | 'id')}
                            size="small" sx={{ minWidth: 150, ml: { sm: 'auto' }, flex: { xs: '1 1 100%', sm: '0 0 auto' } }}
                        >
                            <MenuItem value="name">Alphabetical</MenuItem>
                            <MenuItem value="id">ID Number</MenuItem>
                        </TextField>
                    </Box>
                </Paper>

                {/* Student List */}
                <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    <List disablePadding>
                        {processedStudents.length === 0 ? (
                            <Box sx={{ p: 4, textAlign: 'center' }}><Typography color="text.secondary">No students found.</Typography></Box>
                        ) : (
                            processedStudents.map((student, idx) => (
                                <React.Fragment key={student.id}>
                                    {/* SWITCHED FROM ListItem TO ListItemButton */}
                                    <ListItemButton
                                        onClick={() => navigate(`/admin/students/${student.id}`)}
                                        sx={{ py: 2, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: 2 }}
                                    >
                                        <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                                            <ListItemAvatar>
                                                <Avatar sx={{ backgroundColor: 'primary.light', color: 'primary.dark' }}><PersonIcon /></Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={<Typography sx={{ fontWeight: 600 }}>{student.lastName}, {student.firstName}</Typography>}
                                                secondary={
                                                    <Box component="span" sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5 }}>
                                                        <Typography variant="body2" component="span">{student.id} | {student.program}</Typography>
                                                        {isMobile && <Chip size="small" label={student.status} sx={{ alignSelf: 'flex-start', mt: 0.5 }} />}
                                                    </Box>
                                                }
                                            />
                                        </Box>

                                        {/* Actions & Badges */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'flex-end' : 'flex-start' }}>
                                            {!isMobile && <Chip label={student.status} size="small" />}

                                            {currentTab === 1 && (
                                                <Button
                                                    variant="outlined" color="error" size="small"
                                                    startIcon={<CancelIcon />}
                                                    onClick={(e) => handleCancelAdmission(e, student.id)}
                                                >
                                                    Cancel
                                                </Button>
                                            )}
                                        </Box>
                                    </ListItemButton>
                                    {idx < processedStudents.length - 1 && <Divider component="li" />}
                                </React.Fragment>
                            ))
                        )}
                    </List>
                </Paper>
            </Container>
        </Box>
    );
}