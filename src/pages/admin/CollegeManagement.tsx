import React, { useState } from 'react';
import {
    Box, Container, Typography, Paper, Button, IconButton,
    Accordion, AccordionSummary, AccordionDetails, Tabs, Tab,
    List, ListItem, ListItemText, ListItemSecondaryAction,
    Chip, Divider, useTheme, useMediaQuery
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BusinessIcon from '@mui/icons-material/Business';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PeopleIcon from '@mui/icons-material/People';

// Import the data and types
import { COLLEGE_MANAGEMENT_DATA } from '../../data/collegeManagementData';

// Helper component for Tabs
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`school-tabpanel-${index}`}
            aria-labelledby={`school-tab-${index}`}
            {...other}
            style={{ width: '100%' }}
        >
            {value === index && (
                <Box sx={{ pt: 2, minWidth: 0 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default function CollegeManagement() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const data = COLLEGE_MANAGEMENT_DATA;

    // Track which accordion is open
    const [expandedSchool, setExpandedSchool] = useState<string | false>(false);

    // Track which tab is active for *each* school (using school ID as the key)
    const [tabValues, setTabValues] = useState<Record<string, number>>({});

    const handleAccordionChange = (panelId: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpandedSchool(isExpanded ? panelId : false);
        // Initialize tab to 0 if opening for the first time
        if (isExpanded && tabValues[panelId] === undefined) {
            setTabValues(prev => ({ ...prev, [panelId]: 0 }));
        }
    };

    const handleTabChange = (schoolId: string) => (_event: React.SyntheticEvent, newValue: number) => {
        setTabValues(prev => ({ ...prev, [schoolId]: newValue }));
    };

    return (
        <Box sx={{ backgroundColor: 'background.default', minHeight: '70vh', width: '100%', overflowX: 'hidden', py: { xs: 2, md: 4 } }}>
            <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>

                {/* Header Section */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="h4" sx={{ fontWeight: 800, wordBreak: 'break-word' }}>College Management</Typography>
                        <Typography variant="subtitle1" color="text.secondary">Manage schools, programs, courses, and staff.</Typography>
                    </Box>
                    <Button variant="contained" startIcon={<AddIcon />} disableElevation sx={{ borderRadius: 2, whiteSpace: 'nowrap' }}>
                        Add School
                    </Button>
                </Box>

                {/* Schools List */}
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                    {data.map((school) => {
                        const currentTab = tabValues[school.id] || 0;

                        return (
                            <Accordion
                                key={school.id}
                                expanded={expandedSchool === school.id}
                                onChange={handleAccordionChange(school.id)}
                                variant="outlined"
                                sx={{
                                    borderRadius: '12px !important',
                                    '&:before': { display: 'none' },
                                    overflow: 'hidden'
                                }}
                            >
                                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ px: { xs: 2, md: 3 }, py: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', minWidth: 0, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
                                        <Box sx={{ p: 1, borderRadius: 2, backgroundColor: 'primary.light', color: 'primary.dark', display: 'flex' }}>
                                            <BusinessIcon />
                                        </Box>
                                        <Box sx={{ minWidth: 0, flex: 1 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 700, wordBreak: 'break-word', lineHeight: 1.2 }}>
                                                {school.name}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Dean: {school.dean}
                                            </Typography>
                                        </Box>
                                        {!isMobile && (
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Chip size="small" icon={<SchoolIcon fontSize="small"/>} label={`${school.programs.length} Programs`} variant="outlined" />
                                                <Chip size="small" icon={<MenuBookIcon fontSize="small"/>} label={`${school.courses.length} Courses`} variant="outlined" />
                                            </Box>
                                        )}
                                    </Box>
                                </AccordionSummary>

                                <Divider />

                                <AccordionDetails sx={{ p: { xs: 1.5, md: 3 }, backgroundColor: 'background.paper' }}>

                                    {/* Sub-navigation inside the School */}
                                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                        <Tabs
                                            value={currentTab}
                                            onChange={handleTabChange(school.id)}
                                            variant="scrollable"
                                            scrollButtons="auto"
                                        >
                                            <Tab icon={<SchoolIcon fontSize="small" />} iconPosition="start" label="Programs" sx={{ minHeight: 48 }} />
                                            <Tab icon={<MenuBookIcon fontSize="small" />} iconPosition="start" label="Courses" sx={{ minHeight: 48 }} />
                                            <Tab icon={<PeopleIcon fontSize="small" />} iconPosition="start" label="Lecturers" sx={{ minHeight: 48 }} />
                                        </Tabs>
                                    </Box>

                                    {/* PROGRAMS TAB */}
                                    <TabPanel value={currentTab} index={0}>
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                                            <Button size="small" startIcon={<AddIcon />} variant="outlined" sx={{ borderRadius: 2 }}>Add Program</Button>
                                        </Box>
                                        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                                            <List disablePadding>
                                                {school.programs.map((program, idx) => (
                                                    <React.Fragment key={program.id}>
                                                        <ListItem sx={{ pr: 12 }}>
                                                            <ListItemText
                                                                primary={<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{program.name}</Typography>}
                                                                secondary={program.status}
                                                            />
                                                            <ListItemSecondaryAction>
                                                                <IconButton size="small" color="primary"><EditIcon fontSize="small" /></IconButton>
                                                                <IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                                                            </ListItemSecondaryAction>
                                                        </ListItem>
                                                        {idx < school.programs.length - 1 && <Divider />}
                                                    </React.Fragment>
                                                ))}
                                            </List>
                                        </Paper>
                                    </TabPanel>

                                    {/* COURSES TAB */}
                                    <TabPanel value={currentTab} index={1}>
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                                            <Button size="small" startIcon={<AddIcon />} variant="outlined" sx={{ borderRadius: 2 }}>Add Course</Button>
                                        </Box>
                                        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                                            <List disablePadding>
                                                {school.courses.map((course, idx) => (
                                                    <React.Fragment key={course.id}>
                                                        <ListItem sx={{ pr: 12 }}>
                                                            <ListItemText
                                                                primary={<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{course.code} - {course.name}</Typography>}
                                                                secondary={`${course.credits} Credits`}
                                                            />
                                                            <ListItemSecondaryAction>
                                                                <IconButton size="small" color="primary"><EditIcon fontSize="small" /></IconButton>
                                                                <IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                                                            </ListItemSecondaryAction>
                                                        </ListItem>
                                                        {idx < school.courses.length - 1 && <Divider />}
                                                    </React.Fragment>
                                                ))}
                                            </List>
                                        </Paper>
                                    </TabPanel>

                                    {/* LECTURERS TAB */}
                                    <TabPanel value={currentTab} index={2}>
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                                            <Button size="small" startIcon={<AddIcon />} variant="outlined" sx={{ borderRadius: 2 }}>Add Lecturer</Button>
                                        </Box>
                                        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                                            <List disablePadding>
                                                {school.lecturers.map((lecturer, idx) => (
                                                    <React.Fragment key={lecturer.id}>
                                                        <ListItem sx={{ pr: 12 }}>
                                                            <ListItemText
                                                                primary={<Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{lecturer.name}</Typography>}
                                                                secondary={lecturer.role}
                                                            />
                                                            <ListItemSecondaryAction>
                                                                <IconButton size="small" color="primary"><EditIcon fontSize="small" /></IconButton>
                                                                <IconButton size="small" color="error"><DeleteIcon fontSize="small" /></IconButton>
                                                            </ListItemSecondaryAction>
                                                        </ListItem>
                                                        {idx < school.lecturers.length - 1 && <Divider />}
                                                    </React.Fragment>
                                                ))}
                                            </List>
                                        </Paper>
                                    </TabPanel>

                                </AccordionDetails>
                            </Accordion>
                        );
                    })}
                </Box>
            </Container>
        </Box>
    );
}