import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Container, Typography, Paper, Tabs, Tab, Button, Stack,
    TextField, useMediaQuery, useTheme, Divider, Avatar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';

import { LECTURER_DATA } from '../../data/lecturerData';

function CustomTabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ py: { xs: 2, md: 3 }, width: '100%', boxSizing: 'border-box' }}>{children}</Box>}
        </div>
    );
}

export default function ManageCourse() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [tabValue, setTabValue] = useState(0);

    const course = courseId ? LECTURER_DATA.courses.find(c => c.id === courseId) : null;
    const [description, setDescription] = useState(course?.description || '');

    if (!course) return <Container sx={{ py: 8 }}><Typography>Course not found.</Typography></Container>;

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '70vh', width: '100%', overflowX: 'hidden', py: { xs: 2, md: 4 } }}>
            <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 3 } }}>

                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/lecturer')} sx={{ mb: 2, textTransform: 'none', color: 'text.secondary' }}>
                    Back to Dashboard
                </Button>

                <Paper variant="outlined" sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, mb: 3, width: '100%', boxSizing: 'border-box' }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, overflowWrap: 'anywhere' }}>{course.code}: {course.title}</Typography>
                    <Typography variant="subtitle1" color="text.secondary">Course Management</Typography>
                </Paper>

                <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
                    <Tabs
                        value={tabValue}
                        onChange={(_e, val) => setTabValue(val)}
                        variant="scrollable"
                        scrollButtons={false}
                        sx={{ borderBottom: 1, borderColor: 'divider', '& .MuiTab-root': { flex: isMobile ? 1 : 'none', minWidth: 'auto', fontSize: { xs: '0.75rem', md: '1rem' }, px: { xs: 1, md: 3 } } }}
                    >
                        <Tab label={isMobile ? "Info" : "Description"} icon={<EditIcon />} iconPosition={isMobile ? "top" : "start"} />
                        <Tab label={isMobile ? "Docs" : "Materials"} icon={<UploadFileIcon />} iconPosition={isMobile ? "top" : "start"} />
                        <Tab label={isMobile ? "Tasks" : "Assignments"} icon={<AssignmentIcon />} iconPosition={isMobile ? "top" : "start"} />
                        <Tab label={isMobile ? "Grades" : "Students & Grades"} icon={<PeopleIcon />} iconPosition={isMobile ? "top" : "start"} />
                    </Tabs>

                    <Box sx={{ px: { xs: 2, md: 4 }, width: '100%', boxSizing: 'border-box' }}>

                        {/* TAB 1: EDIT DESCRIPTION */}
                        <CustomTabPanel value={tabValue} index={0}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Edit Course Description</Typography>
                            <TextField
                                fullWidth
                                multiline
                                rows={6}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                variant="outlined"
                                sx={{ mb: 2 }}
                            />
                            <Button variant="contained" disableElevation>Save Description</Button>
                        </CustomTabPanel>

                        {/* TAB 2: UPLOAD MATERIALS */}
                        <CustomTabPanel value={tabValue} index={1}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>Study Materials</Typography>
                                <Button variant="contained" size="small" startIcon={<UploadFileIcon />}>Add File</Button>
                            </Box>
                            <Stack spacing={1.5}>
                                {course.materials.length === 0 ? <Typography color="text.secondary">No materials uploaded yet.</Typography> : null}
                                {course.materials.map(m => (
                                    <Box key={m.id} sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography sx={{ fontWeight: 600, overflowWrap: 'anywhere' }}>{m.title} ({m.type})</Typography>
                                        <Button color="error" size="small">Remove</Button>
                                    </Box>
                                ))}
                            </Stack>
                        </CustomTabPanel>

                        {/* TAB 3: POST ASSIGNMENTS */}
                        <CustomTabPanel value={tabValue} index={2}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>Assignments</Typography>
                                <Button variant="contained" size="small" startIcon={<AssignmentIcon />}>Post New</Button>
                            </Box>
                            <Stack spacing={2}>
                                {course.assignments.length === 0 ? <Typography color="text.secondary">No assignments posted.</Typography> : null}
                                {course.assignments.map(a => (
                                    <Paper key={a.id} variant="outlined" sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover' }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, overflowWrap: 'anywhere' }}>{a.title}</Typography>
                                        <Typography variant="body2" color="text.secondary">Due: {a.dueDate} • Max Score: {a.maxScore}</Typography>
                                    </Paper>
                                ))}
                            </Stack>
                        </CustomTabPanel>

                        {/* TAB 4: STUDENTS & GRADING */}
                        <CustomTabPanel value={tabValue} index={3}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Enrolled Roster & Grading</Typography>
                            <Stack spacing={2}>
                                {course.students.map(student => (
                                    <Paper key={student.id} variant="outlined" sx={{ p: 2, borderRadius: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '0.875rem' }}>{student.name.charAt(0)}</Avatar>
                                            <Box sx={{ minWidth: 0 }}>
                                                <Typography sx={{ fontWeight: 700, overflowWrap: 'anywhere' }}>{student.name}</Typography>
                                                <Typography variant="caption" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>{student.email}</Typography>
                                            </Box>
                                        </Box>
                                        <Divider />
                                        <Stack spacing={1.5}>
                                            {course.assignments.map(assignment => {
                                                const grade = course.grades.find(g => g.studentId === student.id && g.assignmentId === assignment.id);
                                                return (
                                                    <Box key={assignment.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
                                                        <Typography variant="body2" sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>{assignment.title}</Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                                                            <TextField
                                                                size="small"
                                                                placeholder="-"
                                                                defaultValue={grade?.score ?? ''}
                                                                sx={{ width: 60, '& .MuiInputBase-input': { p: 0.5, textAlign: 'center' } }}
                                                            />
                                                            <Typography variant="caption">/ {assignment.maxScore}</Typography>
                                                        </Box>
                                                    </Box>
                                                );
                                            })}
                                        </Stack>
                                    </Paper>
                                ))}
                            </Stack>
                        </CustomTabPanel>

                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}