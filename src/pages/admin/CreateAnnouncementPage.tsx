import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Container, Typography, Paper, Button, TextField, MenuItem,
    Stack, IconButton, Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';

import { type TargetLevel, type AnnouncementType, TARGET_OPTIONS } from '../../data/announcementsData';

export default function CreateAnnouncementPage() {
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [type, setType] = useState<AnnouncementType>('General');
    const [targetLevel, setTargetLevel] = useState<TargetLevel>('College');
    const [targetId, setTargetId] = useState('');
    const [content, setContent] = useState('');
    const [fileName, setFileName] = useState<string | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFileName(e.target.files[0].name);
        }
    };

    return (
        <Box sx={{ backgroundColor: 'background.default', minHeight: '70vh', width: '100%', overflowX: 'hidden', py: { xs: 2, md: 4 } }}>
            <Container maxWidth="md" sx={{ px: { xs: 1.5, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>

                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ alignSelf: 'flex-start', color: 'text.secondary' }}>
                    Back to Feed
                </Button>

                <Paper variant="outlined" sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3, display: 'flex', flexDirection: 'column', gap: 3, boxSizing: 'border-box' }}>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>Create New Post</Typography>

                    <TextField
                        fullWidth label="Post Title" variant="outlined"
                        value={title} onChange={e => setTitle(e.target.value)}
                        placeholder="e.g., Final Exam Timetable"
                    />

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <TextField
                            select fullWidth label="Post Type"
                            value={type} onChange={e => setType(e.target.value as AnnouncementType)}
                        >
                            <MenuItem value="General">General Announcement</MenuItem>
                            <MenuItem value="Timetable">Timetable</MenuItem>
                            <MenuItem value="Assignment">Class Assignment</MenuItem>
                            <MenuItem value="Alert">Urgent Alert</MenuItem>
                        </TextField>

                        <TextField
                            select fullWidth label="Audience Level"
                            value={targetLevel}
                            onChange={e => {
                                setTargetLevel(e.target.value as TargetLevel);
                                setTargetId(''); // Reset specific selection when level changes
                            }}
                        >
                            <MenuItem value="College">Entire College</MenuItem>
                            <MenuItem value="School">Specific School</MenuItem>
                            <MenuItem value="Program">Specific Program</MenuItem>
                        </TextField>
                    </Stack>

                    {/* Cascading Target Selection based on level */}
                    {targetLevel === 'School' && (
                        <TextField select fullWidth label="Select School" value={targetId} onChange={e => setTargetId(e.target.value)}>
                            {TARGET_OPTIONS.schools.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
                        </TextField>
                    )}

                    {targetLevel === 'Program' && (
                        <TextField select fullWidth label="Select Program" value={targetId} onChange={e => setTargetId(e.target.value)}>
                            {TARGET_OPTIONS.programs.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                        </TextField>
                    )}

                    <Divider />

                    <TextField
                        fullWidth label="Message Content" variant="outlined"
                        multiline rows={6}
                        value={content} onChange={e => setContent(e.target.value)}
                        placeholder="Write your announcement here..."
                    />

                    {/* Attachment Section */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Attachment (Optional)</Typography>
                        {fileName ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2, backgroundColor: 'action.hover' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                                    <AttachFileIcon color="action" />
                                    <Typography variant="body2" sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fileName}</Typography>
                                </Box>
                                <IconButton size="small" color="error" onClick={() => setFileName(null)}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        ) : (
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<AttachFileIcon />}
                                sx={{ alignSelf: 'flex-start', borderRadius: 2 }}
                            >
                                Upload File (PDF, Image)
                                <input type="file" hidden onChange={handleFileUpload} />
                            </Button>
                        )}
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                        <Button onClick={() => navigate(-1)} color="inherit" sx={{ fontWeight: 600 }}>Cancel</Button>
                        <Button variant="contained" disableElevation size="large" sx={{ fontWeight: 700, borderRadius: 2 }}>Publish Post</Button>
                    </Box>

                </Paper>
            </Container>
        </Box>
    );
}