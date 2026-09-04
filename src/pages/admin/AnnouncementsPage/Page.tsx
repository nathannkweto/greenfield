import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import {
    Box, Container, Typography, Paper, Tabs, Tab, TextField, MenuItem,
    List, ListItemButton, ListItemAvatar, Avatar, ListItemText, Chip, Button,
    useTheme, useMediaQuery, Divider, CircularProgress, Alert
} from '@mui/material';
import CampaignIcon from '@mui/icons-material/Campaign';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import {
    GET_ANNOUNCEMENTS_LIST,
    GET_ANNOUNCEMENT_TARGET_OPTIONS
} from './queries';

// ----------------------------------------------------------------------
// TypeScript Interfaces
// ----------------------------------------------------------------------

export type AnnouncementTypeEnum = 'GENERAL' | 'TIMETABLE' | 'ASSIGNMENT' | 'ALERT';
export type TargetLevelEnum = 'COLLEGE' | 'SCHOOL' | 'PROGRAM';

export interface SchoolNode {
    id: string;
    name: string;
}

export interface AnnouncementNode {
    id: string;
    title: string;
    content: string;
    type: AnnouncementTypeEnum;
    targetLevel: TargetLevelEnum;
    targetId?: string | null;
    targetName: string;
    author: string;
    authorUser?: {
        id: string;
        firstName: string;
        lastName: string;
    } | null;
    createdAt: string;
    updatedAt: string;
}

interface GetTargetOptionsData {
    schools: {
        edges: Array<{ node: SchoolNode }>;
    };
}

interface GetAnnouncementsListData {
    announcements: {
        edges: Array<{ node: AnnouncementNode }>;
    };
}

interface GetAnnouncementsListVariables {
    type?: AnnouncementTypeEnum;
    targetLevel?: TargetLevelEnum;
    first: number;
}

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

export default function AnnouncementsPage() {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [currentTab, setCurrentTab] = useState(0);
    const [filterType, setFilterType] = useState<string>('ALL');
    const [filterLevel, setFilterLevel] = useState<string>('ALL');
    const [filterTargetId, setFilterTargetId] = useState<string>('ALL');

    // 1. Fetch Target Options
    const { data: targetOptionsData } = useQuery<GetTargetOptionsData>(GET_ANNOUNCEMENT_TARGET_OPTIONS);

    const schoolsList = useMemo<SchoolNode[]>(() => {
        if (!targetOptionsData?.schools?.edges) return [];
        return targetOptionsData.schools.edges.map((edge) => edge.node);
    }, [targetOptionsData]);

    // 2. Fetch Announcements
    const { data: announcementsData, loading, error } = useQuery<GetAnnouncementsListData, GetAnnouncementsListVariables>(
        GET_ANNOUNCEMENTS_LIST,
        {
            variables: {
                type: filterType !== 'ALL' ? (filterType as AnnouncementTypeEnum) : undefined,
                targetLevel: filterLevel !== 'ALL' ? (filterLevel as TargetLevelEnum) : undefined,
                first: 100,
            },
            fetchPolicy: 'cache-and-network',
        }
    );

    // Flatten Edges
    const rawAnnouncements = useMemo<AnnouncementNode[]>(() => {
        if (!announcementsData?.announcements?.edges) return [];
        return announcementsData.announcements.edges.map((edge) => edge.node);
    }, [announcementsData]);

    // Local Filtering
    const processedAnnouncements = useMemo(() => {
        let result = [...rawAnnouncements];

        if (filterTargetId !== 'ALL') {
            result = result.filter((a) => a.targetId === filterTargetId);
        }

        return result;
    }, [rawAnnouncements, filterTargetId]);

    const getTypeChipColor = (type: AnnouncementTypeEnum) => {
        switch (type) {
            case 'ALERT': return 'error';
            case 'TIMETABLE': return 'info';
            case 'ASSIGNMENT': return 'secondary';
            case 'GENERAL': return 'warning';
            default: return 'default';
        }
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return 'N/A';
        return new Date(dateStr).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <Box sx={{ backgroundColor: 'background.default', minHeight: '70vh', width: '100%', overflowX: 'hidden', py: { xs: 2, md: 4 } }}>
            <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>

                {/* Header Action */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                        Announcements
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/admin/announcements/create')}
                        sx={{ borderRadius: 2 }}
                    >
                        Create Announcement
                    </Button>
                </Box>

                {/* Filter Controls */}
                <Paper variant="outlined" sx={{ borderRadius: 2 }}>
                    <Tabs
                        value={currentTab}
                        onChange={(_, v) => setCurrentTab(v)}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{ borderBottom: 1, borderColor: 'divider' }}
                    >
                        <Tab label="All Announcements" />
                    </Tabs>

                    <Box sx={{ p: 2, display: 'flex', flexWrap: 'wrap', gap: 2, backgroundColor: 'background.paper' }}>
                        {/* Type Filter */}
                        <TextField
                            select
                            label="Type"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            size="small"
                            sx={{ minWidth: 160, flex: { xs: '1 1 100%', sm: '0 0 auto' } }}
                        >
                            <MenuItem value="ALL">All Types</MenuItem>
                            <MenuItem value="GENERAL">General</MenuItem>
                            <MenuItem value="TIMETABLE">Timetable</MenuItem>
                            <MenuItem value="ASSIGNMENT">Assignment</MenuItem>
                            <MenuItem value="ALERT">Alert</MenuItem>
                        </TextField>

                        {/* Target Level Filter */}
                        <TextField
                            select
                            label="Target Level"
                            value={filterLevel}
                            onChange={(e) => setFilterLevel(e.target.value)}
                            size="small"
                            sx={{ minWidth: 160, flex: { xs: '1 1 100%', sm: '0 0 auto' } }}
                        >
                            <MenuItem value="ALL">All Levels</MenuItem>
                            <MenuItem value="COLLEGE">College level</MenuItem>
                            <MenuItem value="SCHOOL">School Level</MenuItem>
                            <MenuItem value="PROGRAM">Program Level</MenuItem>
                        </TextField>

                        {/* Target Entity Filter */}
                        <TextField
                            select
                            label="School Target"
                            value={filterTargetId}
                            onChange={(e) => setFilterTargetId(e.target.value)}
                            size="small"
                            sx={{ minWidth: 200, ml: { sm: 'auto' }, flex: { xs: '1 1 100%', sm: '0 0 auto' } }}
                        >
                            <MenuItem value="ALL">All Targets</MenuItem>
                            {schoolsList.map((school) => (
                                <MenuItem key={school.id} value={school.id}>
                                    {school.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                </Paper>

                {/* Announcement List */}
                <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
                    {loading ? (
                        <Box sx={{ p: 6, display: 'flex', justifyContent: 'center' }}>
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Box sx={{ p: 3 }}>
                            <Alert severity="error">Failed to load announcements: {error.message}</Alert>
                        </Box>
                    ) : (
                        <List disablePadding>
                            {processedAnnouncements.length === 0 ? (
                                <Box sx={{ p: 4, textAlign: 'center' }}>
                                    <Typography color="text.secondary">No announcements found.</Typography>
                                </Box>
                            ) : (
                                processedAnnouncements.map((announcement, idx) => (
                                    <React.Fragment key={announcement.id}>
                                        <ListItemButton
                                            onClick={() => navigate(`/admin/announcements/${announcement.id}/edit`)}
                                            sx={{ py: 2, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: 2 }}
                                        >
                                            <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                                                <ListItemAvatar>
                                                    <Avatar sx={{ backgroundColor: 'secondary.light', color: 'secondary.dark' }}>
                                                        <CampaignIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Typography sx={{ fontWeight: 600, fontSize: '1rem' }}>
                                                            {announcement.title}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Box component="span" sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 0.5 }}>
                                                            <Typography variant="body2" component="span" color="text.secondary">
                                                                Target: {announcement.targetLevel} ({announcement.targetName})
                                                            </Typography>
                                                            <Typography variant="caption" component="span" color="text.disabled">
                                                                By {announcement.authorUser ? `${announcement.authorUser.firstName} ${announcement.authorUser.lastName}` : announcement.author} • {formatDate(announcement.createdAt)}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                />
                                            </Box>

                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'flex-end' : 'flex-start' }}>
                                                <Chip
                                                    label={announcement.type}
                                                    color={getTypeChipColor(announcement.type)}
                                                    size="small"
                                                />
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<EditIcon />}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/admin/announcements/${announcement.id}/edit`);
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                            </Box>
                                        </ListItemButton>
                                        {idx < processedAnnouncements.length - 1 && <Divider component="li" />}
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
