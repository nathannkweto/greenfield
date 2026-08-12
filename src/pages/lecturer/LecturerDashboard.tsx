import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Container, Typography, Paper, Tabs, Tab, Button, Stack,
    CardActionArea, useMediaQuery, useTheme, TextField, Switch, FormControlLabel
} from '@mui/material';
import ClassIcon from '@mui/icons-material/Class';
import SettingsIcon from '@mui/icons-material/Settings';

import { LECTURER_DATA } from '../../data/lecturerData';

function CustomTabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ py: { xs: 2, md: 3 }, width: '100%', boxSizing: 'border-box' }}>{children}</Box>}
        </div>
    );
}

export default function LecturerDashboard() {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [tabValue, setTabValue] = useState(0);

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '70vh', width: '100%', overflowX: 'hidden', py: { xs: 2, md: 4 } }}>
            <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 3 } }}>

                <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, mb: 3, bgcolor: 'primary.dark', color: 'white', width: '100%', boxSizing: 'border-box' }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, overflowWrap: 'anywhere' }}>Welcome, Dr. Smith</Typography>
                    <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>Lecturer Portal</Typography>
                </Paper>

                <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
                    <Tabs
                        value={tabValue}
                        onChange={(_e, val) => setTabValue(val)}
                        variant="fullWidth"
                        sx={{ borderBottom: 1, borderColor: 'divider', width: '100%' }}
                    >
                        <Tab label="My Courses" icon={<ClassIcon />} iconPosition={isMobile ? "top" : "start"} sx={{ py: 2 }} />
                        <Tab label="Settings" icon={<SettingsIcon />} iconPosition={isMobile ? "top" : "start"} sx={{ py: 2 }} />
                    </Tabs>

                    <Box sx={{ px: { xs: 2, md: 4 }, width: '100%', boxSizing: 'border-box' }}>

                        {/* TAB 1: COURSES */}
                        <CustomTabPanel value={tabValue} index={0}>
                            <Stack spacing={2}>
                                {LECTURER_DATA.courses.map(course => (
                                    <Paper key={course.id} variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                                        <CardActionArea onClick={() => navigate(`/lecturer/course/${course.id}`)} sx={{ p: 2, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
                                            <Box sx={{ minWidth: 0 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 700, overflowWrap: 'anywhere' }}>{course.code}: {course.title}</Typography>
                                                <Typography variant="body2" color="text.secondary">{course.students.length} Enrolled Students</Typography>
                                            </Box>
                                            <Button variant="contained" disableElevation sx={{ flexShrink: 0, pointerEvents: 'none' }}>Manage</Button>
                                        </CardActionArea>
                                    </Paper>
                                ))}
                            </Stack>
                        </CustomTabPanel>

                        {/* TAB 2: SETTINGS */}
                        <CustomTabPanel value={tabValue} index={1}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Profile Settings</Typography>
                            <Stack spacing={3} sx={{ maxWidth: 600 }}>
                                <TextField label="Full Name" defaultValue="Dr. Smith" fullWidth variant="outlined" />
                                <TextField label="Contact Email" defaultValue="smith@university.edu" fullWidth variant="outlined" />
                                <TextField label="Office Hours" defaultValue="Mon/Wed 2:00 PM - 4:00 PM" fullWidth variant="outlined" multiline rows={2} />
                                <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700 }}>Notifications</Typography>
                                    <FormControlLabel control={<Switch defaultChecked />} label="Email me when assignments are submitted" />
                                </Box>
                                <Button variant="contained" size="large" sx={{ alignSelf: 'flex-start' }}>Save Changes</Button>
                            </Stack>
                        </CustomTabPanel>

                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}