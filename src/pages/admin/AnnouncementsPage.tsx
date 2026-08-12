import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Container, Typography, Paper, Button, Tabs, Tab,
    Stack, Chip, Avatar, IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CampaignIcon from '@mui/icons-material/Campaign';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AssignmentIcon from '@mui/icons-material/Assignment';
import WarningIcon from '@mui/icons-material/Warning';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { MOCK_ANNOUNCEMENTS, type AnnouncementType } from '../../data/announcementsData';

export default function AnnouncementsPage() {
    const navigate = useNavigate();
    const [currentTab, setCurrentTab] = useState(0);

    const getIconForType = (type: AnnouncementType) => {
        switch (type) {
            case 'Timetable': return <EventNoteIcon fontSize="small" color="primary" />;
            case 'Assignment': return <AssignmentIcon fontSize="small" color="secondary" />;
            case 'Alert': return <WarningIcon fontSize="small" color="error" />;
            default: return <CampaignIcon fontSize="small" color="info" />;
        }
    };

    const filteredAnnouncements = useMemo(() => {
        if (currentTab === 0) return MOCK_ANNOUNCEMENTS;
        const types: AnnouncementType[] = ['General', 'Timetable', 'Assignment', 'Alert'];
        return MOCK_ANNOUNCEMENTS.filter(a => a.type === types[currentTab]);
    }, [currentTab]);

    return (
        <Box sx={{ backgroundColor: 'background.default', minHeight: '70vh', width: '100%', overflowX: 'hidden', py: { xs: 2, md: 4 } }}>
            <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>

                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, minWidth: 0 }}>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="h4" sx={{ fontWeight: 800, wordBreak: 'break-word' }}>Communication Center</Typography>
                        <Typography variant="subtitle1" color="text.secondary">Manage announcements, timetables, and alerts.</Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        disableElevation
                        sx={{ borderRadius: 2, whiteSpace: 'nowrap', flexShrink: 0 }}
                        onClick={() => navigate('/admin/announcements/create')}
                    >
                        New Post
                    </Button>
                </Box>

                {/* Filter Tabs */}
                <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    <Tabs
                        value={currentTab}
                        onChange={(_, v) => setCurrentTab(v)}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{ borderBottom: 1, borderColor: 'divider' }}
                    >
                        <Tab label="All Posts" />
                        <Tab label="General" />
                        <Tab label="Timetables" />
                        <Tab label="Assignments" />
                        <Tab label="Alerts" />
                    </Tabs>
                </Paper>

                {/* Feed */}
                <Stack spacing={2} sx={{ minWidth: 0 }}>
                    {filteredAnnouncements.map((post) => (
                        <Paper key={post.id} variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0, boxSizing: 'border-box' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, minWidth: 0 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
                                    <Avatar sx={{ backgroundColor: 'action.hover' }}>{getIconForType(post.type)}</Avatar>
                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography variant="subtitle2" color="text.secondary">{post.author} • {post.datePosted}</Typography>
                                        <Typography variant="h6" sx={{ fontWeight: 700, wordBreak: 'break-word', lineHeight: 1.2 }}>{post.title}</Typography>
                                    </Box>
                                </Box>
                                <IconButton size="small" sx={{ flexShrink: 0 }}><MoreVertIcon /></IconButton>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                <Chip size="small" label={post.targetName} color="primary" variant="outlined" />
                                <Chip size="small" label={post.type} />
                            </Box>

                            <Typography variant="body1" sx={{ wordBreak: 'break-word', opacity: 0.9 }}>
                                {post.content}
                            </Typography>

                            {post.attachment && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2, backgroundColor: 'action.hover', width: 'fit-content', maxWidth: '100%', boxSizing: 'border-box' }}>
                                    {post.attachment.fileType === 'pdf' ? <PictureAsPdfIcon color="error" /> : <ImageIcon color="primary" />}
                                    <Box sx={{ minWidth: 0, flex: 1 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.attachment.fileName}</Typography>
                                        <Typography variant="caption" color="text.secondary">{post.attachment.fileSize}</Typography>
                                    </Box>
                                    <Button size="small" variant="contained" disableElevation sx={{ flexShrink: 0 }}>View</Button>
                                </Box>
                            )}
                        </Paper>
                    ))}
                </Stack>

            </Container>
        </Box>
    );
}