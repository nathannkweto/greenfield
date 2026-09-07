import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import {
    Box, Container, Typography, Paper, Button, TextField, MenuItem,
    Stack, IconButton, Divider, Alert, CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';

import { GET_ANNOUNCEMENTS_LIST, GET_ANNOUNCEMENT_TARGET_OPTIONS } from './queries';
import { getAnnouncements } from '../../../api/generated';
import type { GetAnnouncementsListQuery, GetAnnouncementsListQueryVariables } from '../../../gql/graphql';

// Types
export type TargetLevelUI = 'College' | 'School' | 'Program';
export type AnnouncementTypeUI = 'General' | 'Timetable' | 'Assignment' | 'Alert';

interface TargetOptionsData {
    schools: {
        edges: Array<{ node: { id: string; name: string } }>;
    };
    programs: {
        edges: Array<{ node: { id: string; title: string; school?: { name: string } } }>;
    };
}

interface AnnouncementNode {
    id: string;
    title: string;
    content: string;
    type: string;
    targetLevel: string;
    targetId?: string | null;
}

export default function CreateAnnouncementPage() {
    const navigate = useNavigate();
    const { announcementId } = useParams<{ announcementId: string }>();
    const isEditing = Boolean(announcementId);

    // Form State
    const [title, setTitle] = useState('');
    const [type, setType] = useState<AnnouncementTypeUI>('General');
    const [targetLevel, setTargetLevel] = useState<TargetLevelUI>('College');
    const [targetId, setTargetId] = useState('');
    const [content, setContent] = useState('');
    const [file, setFile] = useState<File | null>(null);

    // API UI Feedback State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // 1. Fetch Dynamic Target Options from GraphQL
    const { data: targetData, loading: loadingTargets } = useQuery<TargetOptionsData>(GET_ANNOUNCEMENT_TARGET_OPTIONS);
    const { data: existingData, loading: loadingExisting } = useQuery<GetAnnouncementsListQuery, GetAnnouncementsListQueryVariables>(GET_ANNOUNCEMENTS_LIST, {
        variables: { first: 100 },
        skip: !isEditing,
    });

    const schools = useMemo(() => targetData?.schools?.edges?.map(e => e.node) || [], [targetData]);
    const programs = useMemo(() => targetData?.programs?.edges?.map(e => e.node) || [], [targetData]);

    useEffect(() => {
        const rawNode = existingData?.announcements.edges.find((edge) => {
            const node = edge.node as unknown as AnnouncementNode;
            return node.id === announcementId;
        })?.node;

        if (!rawNode) return;
        const existing = rawNode as unknown as AnnouncementNode;

        queueMicrotask(() => {
            setTitle(existing.title);
            setContent(existing.content);
            setType(existing.type as AnnouncementTypeUI);
            setTargetLevel(existing.targetLevel as TargetLevelUI);
            setTargetId(existing.targetId ?? '');
        });
    }, [announcementId, existingData]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
    };

    // 2. Map UI Values to API Payload Enums
    const mapTypeToApi = (uiType: AnnouncementTypeUI): string => {
        switch (uiType) {
            case 'General': return 'General';
            case 'Timetable': return 'Timetable';
            case 'Assignment': return 'Assignment';
            case 'Alert': return 'Alert';
            default: return 'General';
        }
    };

    const mapLevelToApi = (uiLevel: TargetLevelUI): string => {
        switch (uiLevel) {
            case 'College': return 'College';
            case 'School': return 'School';
            case 'Program': return 'Program';
            default: return 'College';
        }
    };

    // 3. Submit Handler
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMsg(null);

        // Basic Validations
        if (!title.trim()) return setErrorMsg('Please enter a post title.');
        if (!content.trim()) return setErrorMsg('Please enter message content.');
        if ((targetLevel === 'School' || targetLevel === 'Program') && !targetId) {
            return setErrorMsg(`Please select a specific ${targetLevel.toLowerCase()}.`);
        }

        setIsSubmitting(true);

        try {
            // Derive target_name for display requirement
            let targetName = 'Entire College';
            if (targetLevel === 'School') {
                targetName = schools.find(s => s.id === targetId)?.name || 'Specific School';
            } else if (targetLevel === 'Program') {
                targetName = programs.find(p => p.id === targetId)?.title || 'Specific Program';
            }

            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('type', mapTypeToApi(type));
            formData.append('target_level', mapLevelToApi(targetLevel));
            formData.append('target_name', targetName);
            formData.append('author', 'Academic Office');

            if (targetId) {
                formData.append('target_public_id', targetId);
            }

            if (file) {
                formData.append('attachment', file);
            }

            // Send via Orval client
            const api = getAnnouncements();
            if (announcementId) {
                await api.postAnnouncementsPublicIdEdit(announcementId, formData as unknown as Parameters<typeof api.postAnnouncementsPublicIdEdit>[1]);
            } else {
                await api.postAnnouncementsCreate(formData as unknown as Parameters<typeof api.postAnnouncementsCreate>[0]);
            }

            navigate('/admin/announcements');
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string; message?: string } }; message?: string };
            setErrorMsg(error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to create announcement.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box sx={{ backgroundColor: 'background.default', minHeight: '70vh', width: '100%', overflowX: 'hidden', py: { xs: 2, md: 4 } }}>
            <Container maxWidth="md" sx={{ px: { xs: 1.5, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>

                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ alignSelf: 'flex-start', color: 'text.secondary' }}>
                    Back to Feed
                </Button>

                <Paper
                    component="form"
                    onSubmit={handleSubmit}
                    variant="outlined"
                    sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3, display: 'flex', flexDirection: 'column', gap: 3, boxSizing: 'border-box' }}
                >
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>{isEditing ? 'Edit announcement' : 'Create New Post'}</Typography>

                    {loadingExisting && <Alert severity="info">Loading announcement…</Alert>}

                    {errorMsg && (
                        <Alert severity="error" onClose={() => setErrorMsg(null)}>
                            {errorMsg}
                        </Alert>
                    )}

                    <TextField
                        fullWidth label="Post Title" variant="outlined"
                        value={title} onChange={e => setTitle(e.target.value)}
                        placeholder="e.g., Final Exam Timetable"
                        required
                        disabled={isSubmitting}
                    />

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <TextField
                            select fullWidth label="Post Type"
                            value={type} onChange={e => setType(e.target.value as AnnouncementTypeUI)}
                            disabled={isSubmitting}
                        >
                            <MenuItem value="General">General Announcement</MenuItem>
                            <MenuItem value="Timetable">Timetable</MenuItem>
                            <MenuItem value="Assignment">Class Assignment</MenuItem>
                            <MenuItem value="Alert">Urgent Alert</MenuItem>
                        </TextField>

                        <TextField
                            select fullWidth label="Audience Level"
                            value={targetLevel}
                            disabled={isSubmitting}
                            onChange={e => {
                                setTargetLevel(e.target.value as TargetLevelUI);
                                setTargetId('');
                            }}
                        >
                            <MenuItem value="College">Entire College</MenuItem>
                            <MenuItem value="School">Specific School</MenuItem>
                            <MenuItem value="Program">Specific Program</MenuItem>
                        </TextField>
                    </Stack>

                    {/* Cascading Target Selection */}
                    {targetLevel === 'School' && (
                        <TextField
                            select fullWidth label="Select School"
                            value={targetId}
                            onChange={e => setTargetId(e.target.value)}
                            disabled={isSubmitting || loadingTargets}
                            required
                        >
                            {loadingTargets ? (
                                <MenuItem disabled>Loading schools...</MenuItem>
                            ) : (
                                schools.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)
                            )}
                        </TextField>
                    )}

                    {targetLevel === 'Program' && (
                        <TextField
                            select fullWidth label="Select Program"
                            value={targetId}
                            onChange={e => setTargetId(e.target.value)}
                            disabled={isSubmitting || loadingTargets}
                            required
                        >
                            {loadingTargets ? (
                                <MenuItem disabled>Loading programs...</MenuItem>
                            ) : (
                                programs.map(p => (
                                    <MenuItem key={p.id} value={p.id}>
                                        {p.title} {p.school ? `(${p.school.name})` : ''}
                                    </MenuItem>
                                ))
                            )}
                        </TextField>
                    )}

                    <Divider />

                    <TextField
                        fullWidth label="Message Content" variant="outlined"
                        multiline rows={6}
                        value={content} onChange={e => setContent(e.target.value)}
                        placeholder="Write your announcement here..."
                        required
                        disabled={isSubmitting}
                    />

                    {/* Attachment Section */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Attachment (Optional)</Typography>
                        {file ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2, backgroundColor: 'action.hover' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                                    <AttachFileIcon color="action" />
                                    <Typography variant="body2" sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {file.name}
                                    </Typography>
                                </Box>
                                <IconButton size="small" color="error" onClick={handleRemoveFile} disabled={isSubmitting}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        ) : (
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<AttachFileIcon />}
                                disabled={isSubmitting}
                                sx={{ alignSelf: 'flex-start', borderRadius: 2 }}
                            >
                                Upload File (PDF, Image)
                                <input type="file" hidden onChange={handleFileUpload} />
                            </Button>
                        )}
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                        <Button onClick={() => navigate(-1)} color="inherit" sx={{ fontWeight: 600 }} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disableElevation
                            size="large"
                            disabled={isSubmitting}
                            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                            sx={{ fontWeight: 700, borderRadius: 2 }}
                        >
                            {isSubmitting ? 'Publishing...' : 'Publish Post'}
                        </Button>
                    </Box>

                </Paper>
            </Container>
        </Box>
    );
}