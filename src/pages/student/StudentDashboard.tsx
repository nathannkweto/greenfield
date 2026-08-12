import React from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Grid,
    Avatar,
    Stack,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Button,
    Chip
} from '@mui/material';

// Icons
import EventIcon from '@mui/icons-material/Event';
import CampaignIcon from '@mui/icons-material/Campaign';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import { STUDENT_INFO, STATS, SCHEDULE, ANNOUNCEMENTS } from '../../data/studentData';

export default function StudentDashboard() {
    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '70vh', py: 4 }}>
            <Container maxWidth="xl">

                {/* PAGE HEADER */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5 }}>
                        Student Dashboard
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Welcome back, {STUDENT_INFO.firstName}. Here is your academic overview.
                    </Typography>
                </Box>

                <Grid container spacing={4}>

                    {/* ================= SECTION 1: STUDENT PROFILE ================= */}
                    <Grid size={{ xs: 12 }}>
                        <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, borderColor: 'divider', bgcolor: 'background.paper' }}>
                            <Stack
                                direction={{ xs: 'column', md: 'row' }}
                                spacing={3}
                                sx={{ alignItems: { xs: 'flex-start', md: 'center' } }}
                            >
                                <Avatar
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        bgcolor: 'primary.main',
                                        fontSize: '2rem',
                                        fontWeight: 700
                                    }}
                                >
                                    {STUDENT_INFO.initials}
                                </Avatar>

                                <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                                        {STUDENT_INFO.firstName} {STUDENT_INFO.lastName}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, fontWeight: 500 }}>
                                        Student ID: {STUDENT_INFO.id}
                                    </Typography>

                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 3 }}>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: 'text.disabled', textTransform: 'uppercase', fontWeight: 700 }}>Program</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{STUDENT_INFO.program}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: 'text.disabled', textTransform: 'uppercase', fontWeight: 700 }}>Year of Study</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{STUDENT_INFO.year}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: 'text.disabled', textTransform: 'uppercase', fontWeight: 700 }}>Current Term</Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{STUDENT_INFO.term}</Typography>
                                        </Box>
                                    </Stack>
                                </Box>

                                <Button variant="outlined" sx={{ borderRadius: 2, textTransform: 'none' }}>
                                    View Full Profile
                                </Button>
                            </Stack>
                        </Paper>
                    </Grid>

                    {/* ================= SECTION 2: QUICK STATS ================= */}
                    <Grid size={{ xs: 12 }}>
                        <Grid container spacing={3}>
                            {STATS.map((stat, index) => (
                                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Avatar sx={{ bgcolor: stat.bgColor, color: stat.color, width: 48, height: 48 }}>
                                            {stat.icon}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                                {stat.title}
                                            </Typography>
                                            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
                                                {stat.value}
                                            </Typography>
                                        </Box>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>

                    {/* ================= MAIN CONTENT SPLIT ================= */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Paper variant="outlined" sx={{ borderRadius: 4, borderColor: 'divider', overflow: 'hidden', height: '100%' }}>
                            <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <EventIcon color="primary" /> Today's Schedule
                                </Typography>
                                <Button size="small" sx={{ textTransform: 'none', fontWeight: 600 }}>View Calendar</Button>
                            </Box>
                            <List disablePadding>
                                {SCHEDULE.map((item, index) => (
                                    <React.Fragment key={index}>
                                        <ListItem sx={{ py: 2.5, px: 3 }}>
                                            <ListItemIcon sx={{ minWidth: 100 }}>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                                                    {item.time}
                                                </Typography>
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={<Typography sx={{ fontWeight: 600, color: 'text.primary' }}>{item.course}</Typography>}
                                                secondary={<Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>{item.room}</Typography>}
                                            />
                                        </ListItem>
                                        {index < SCHEDULE.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack spacing={3} sx={{ height: '100%' }}>

                            <Paper variant="outlined" sx={{ borderRadius: 4, borderColor: 'divider', flex: 1 }}>
                                <Box sx={{ p: 2.5, borderBottom: 1, borderColor: 'divider' }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CampaignIcon color="warning" /> Announcements
                                    </Typography>
                                </Box>
                                <List disablePadding>
                                    {ANNOUNCEMENTS.map((announcement, index) => (
                                        <React.Fragment key={index}>
                                            <ListItem sx={{ py: 2, px: 2.5, flexDirection: 'column', alignItems: 'flex-start' }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 0.5 }}>
                                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                                        {announcement.date}
                                                    </Typography>
                                                    {announcement.urgent && (
                                                        <Chip label="Action Required" size="small" color="error" sx={{ height: 20, fontSize: '0.7rem', fontWeight: 600 }} />
                                                    )}
                                                </Box>
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                                    {announcement.title}
                                                </Typography>
                                            </ListItem>
                                            {index < ANNOUNCEMENTS.length - 1 && <Divider />}
                                        </React.Fragment>
                                    ))}
                                </List>
                            </Paper>

                            <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 4, borderColor: 'divider' }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Quick Links</Typography>
                                <Stack spacing={1}>
                                    {['Access LMS (Moodle)', 'Library Portal', 'Request Transcript'].map((link) => (
                                        <Button
                                            key={link}
                                            variant="text"
                                            endIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
                                            sx={{
                                                justifyContent: 'space-between',
                                                color: 'text.secondary',
                                                fontWeight: 500,
                                                '&:hover': { color: 'primary.main', bgcolor: 'action.hover' }
                                            }}
                                        >
                                            {link}
                                        </Button>
                                    ))}
                                </Stack>
                            </Paper>

                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}