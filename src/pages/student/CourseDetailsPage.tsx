import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Container, Typography, Paper, Tabs, Tab, Button,
    List, ListItem, ListItemIcon, ListItemText, Divider,
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, LinearProgress, useMediaQuery, useTheme, Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import EventNoteIcon from '@mui/icons-material/EventNote';
import DescriptionIcon from '@mui/icons-material/Description';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DownloadIcon from '@mui/icons-material/Download';

import { COURSE_DETAILS_MAP } from '../../data/academicsData';

function CustomTabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ py: { xs: 2, md: 3 }, width: '100%' }}>{children}</Box>}
        </div>
    );
}

export default function CourseDetails() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [tabValue, setTabValue] = useState(0);

    const course = courseId ? COURSE_DETAILS_MAP[courseId] : null;

    if (!course) {
        return (
            <Container sx={{ py: 8, textAlign: 'center' }}>
                <Typography variant="h5">Course not found.</Typography>
                <Button sx={{ mt: 2 }} onClick={() => navigate(-1)}>Go Back</Button>
            </Container>
        );
    }

    return (
        <Box sx={{ backgroundColor: 'background.default', minHeight: '70vh', width: '100%', overflowX: 'hidden', py: { xs: 2, md: 4 } }}>
            <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 3 } }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/student/academics')}
                    sx={{ mb: 2, textTransform: 'none', color: 'text.secondary' }}
                >
                    Back to Academics
                </Button>

                <Paper variant="outlined" sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, mb: 3, overflowWrap: 'anywhere', width: '100%', boxSizing: 'border-box' }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, fontSize: { xs: '1.5rem', md: '2.125rem' } }}>
                        {course.code}: {course.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {course.credits} Credits • Instructor: {course.instructor.name}
                    </Typography>
                </Paper>

                <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
                    <Tabs
                        value={tabValue}
                        onChange={(_e, val) => setTabValue(val)}
                        variant="scrollable"
                        scrollButtons={false}
                        sx={{
                            borderBottom: 1, borderColor: 'divider', width: '100%',
                            '& .MuiTab-root': { flex: isMobile ? 1 : 'none', minWidth: 'auto', fontSize: { xs: '0.75rem', md: '1rem' }, px: { xs: 1, md: 3 } }
                        }}
                    >
                        <Tab label={isMobile ? "Info" : "Overview"} icon={<InfoOutlinedIcon />} iconPosition={isMobile ? "top" : "start"} />
                        <Tab label={isMobile ? "Logs" : "Sessions"} icon={<EventNoteIcon />} iconPosition={isMobile ? "top" : "start"} />
                        <Tab label={isMobile ? "Docs" : "Materials"} icon={<DescriptionIcon />} iconPosition={isMobile ? "top" : "start"} />
                        <Tab label={isMobile ? "Grades" : "Assessments"} icon={<AssessmentIcon />} iconPosition={isMobile ? "top" : "start"} />
                    </Tabs>

                    <Box sx={{ px: { xs: 2, md: 4 }, width: '100%', boxSizing: 'border-box' }}>
                        <CustomTabPanel value={tabValue} index={0}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Description</Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, overflowWrap: 'anywhere' }}>{course.description}</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>Instructor</Typography>
                            <Typography variant="body2">{course.instructor.email}</Typography>
                        </CustomTabPanel>

                        <CustomTabPanel value={tabValue} index={1}>
                            <List disablePadding>
                                {course.sessions.map((s, index) => (
                                    <React.Fragment key={s.id}>
                                        <ListItem sx={{ px: 0, alignItems: 'flex-start' }}>
                                            <ListItemIcon sx={{ minWidth: 40, mt: 0.5 }}><EventNoteIcon color="primary" /></ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="body1" sx={{ fontWeight: 600, overflowWrap: 'anywhere' }}>
                                                        {s.topic}
                                                    </Typography>
                                                }
                                                secondary={`${s.date} • ${s.type}`}
                                            />
                                        </ListItem>
                                        {index < course.sessions.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </CustomTabPanel>

                        <CustomTabPanel value={tabValue} index={2}>
                            <Stack spacing={1.5}>
                                {course.materials.map((m) => (
                                    <Box key={m.id} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2, gap: 1 }}>
                                        <Box sx={{ minWidth: 0 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 600, overflowWrap: 'anywhere' }}>{m.title}</Typography>
                                            <Typography variant="caption" color="text.secondary">{m.type} • {m.size}</Typography>
                                        </Box>
                                        <Button size="small" variant="contained" disableElevation startIcon={<DownloadIcon />} sx={{ alignSelf: { xs: 'flex-end', sm: 'auto' }, flexShrink: 0 }}>Get</Button>
                                    </Box>
                                ))}
                            </Stack>
                        </CustomTabPanel>

                        <CustomTabPanel value={tabValue} index={3}>
                            {isMobile ? (
                                <Stack spacing={1.5}>
                                    {course.assessments.map((a) => (
                                        <Paper key={a.id} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700, pr: 1, overflowWrap: 'anywhere', minWidth: 0 }}>{a.name}</Typography>
                                                <Typography variant="caption" sx={{ whiteSpace: 'nowrap', backgroundColor: 'action.hover', px: 1, py: 0.5, borderRadius: 1, flexShrink: 0 }}>W: {a.weight}</Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>Score:</Typography>
                                                <Typography variant="body2">{a.score !== null ? `${a.score} / ${a.maxScore}` : 'Pending'}</Typography>
                                            </Box>
                                            {a.score !== null && <LinearProgress variant="determinate" value={(a.score / a.maxScore) * 100} sx={{ height: 6, borderRadius: 3 }} />}
                                        </Paper>
                                    ))}
                                </Stack>
                            ) : (
                                <TableContainer sx={{ overflowX: 'auto', width: '100%' }}>
                                    <Table>
                                        <TableHead><TableRow><TableCell>Assessment</TableCell><TableCell>Weight</TableCell><TableCell>Score</TableCell><TableCell>Progress</TableCell></TableRow></TableHead>
                                        <TableBody>
                                            {course.assessments.map((a) => (
                                                <TableRow key={a.id}>
                                                    <TableCell sx={{ overflowWrap: 'anywhere', minWidth: 200 }}>{a.name}</TableCell>
                                                    <TableCell>{a.weight}</TableCell>
                                                    <TableCell>{a.score ?? '-'}</TableCell>
                                                    <TableCell sx={{ minWidth: 150 }}><LinearProgress variant="determinate" value={a.score ? (a.score / a.maxScore) * 100 : 0} /></TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </CustomTabPanel>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}