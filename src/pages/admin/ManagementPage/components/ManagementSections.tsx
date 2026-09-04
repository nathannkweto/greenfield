import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SchoolIcon from '@mui/icons-material/SchoolOutlined';

import { getSchools } from '../../../../api/generated';
import { useMe } from '../../../../hooks/useMe.ts';
import type { School } from '../Page';

interface ManagementSectionsProps {
    schools: School[];
    onChanged: () => Promise<unknown>;
}

export function ManagementSections({ schools, onChanged }: ManagementSectionsProps) {
    const navigate = useNavigate();
    const { user } = useMe();

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [schoolModalOpen, setSchoolModalOpen] = useState(false);
    const [schoolForm, setSchoolForm] = useState({ name: '', description: '' });

    const createSchool = async () => {
        if (!schoolForm.name.trim()) {
            setError('School name is required.');
            return;
        }

        setSaving(true);
        setError(null);
        try {
            await getSchools().postSchoolsCreate({
                name: schoolForm.name.trim(),
                description: schoolForm.description.trim() || undefined,
                dean_user_public_id: user?.id ?? null,
            });
            await onChanged();
            setSchoolModalOpen(false);
            setSchoolForm({ name: '', description: '' });
        } catch (reason) {
            setError(reason instanceof Error ? reason.message : 'Unable to create the school.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Box sx={{ width: '100%', mx: 'auto' }}>
            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {/* Action Header */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                    px: 1,
                }}
            >
                <Box>
                    <Typography variant="h5" fontWeight={700} color="text.primary">
                        Schools
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {schools.length} {schools.length === 1 ? 'school' : 'schools'} registered
                    </Typography>
                </Box>
                <Button
                    startIcon={<AddIcon />}
                    variant="contained"
                    disableElevation
                    onClick={() => setSchoolModalOpen(true)}
                    sx={{ borderRadius: 2, textTransform: 'none', px: 2.5, py: 1 }}
                >
                    Add School
                </Button>
            </Box>

            {/* Modern Schools List */}
            <Paper
                elevation={0}
                sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 3,
                    overflow: 'hidden',
                    backgroundColor: 'background.paper',
                }}
            >
                <List disablePadding>
                    {schools.length > 0 ? (
                        schools.map((school, index) => (
                            <Box key={school.id}>
                                <ListItem disablePadding>
                                    <ListItemButton
                                        onClick={() => navigate(`/admin/management/schools/${school.id}`)}
                                        sx={{
                                            py: 2,
                                            px: 3,
                                            transition: 'background-color 0.2s ease',
                                            '&:hover': {
                                                backgroundColor: 'action.hover',
                                            },
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar
                                                sx={{
                                                    bgcolor: 'primary.50',
                                                    color: 'primary.main',
                                                    width: 44,
                                                    height: 44,
                                                }}
                                            >
                                                <SchoolIcon fontSize="small" />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                                                    {school.name}
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography variant="body2" color="text.secondary" noWrap sx={{ mt: 0.5 }}>
                                                    {school.dean
                                                        ? `Dean: ${school.dean.firstName} ${school.dean.lastName}`
                                                        : 'No dean assigned'}
                                                    {school.description ? ` · ${school.description}` : ''}
                                                </Typography>
                                            }
                                        />
                                        <ChevronRightIcon color="action" />
                                    </ListItemButton>
                                </ListItem>
                                {index < schools.length - 1 && <Divider component="li" />}
                            </Box>
                        ))
                    ) : (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <Typography color="text.secondary" variant="body1">
                                No schools found. Click "Add School" to create one.
                            </Typography>
                        </Box>
                    )}
                </List>
            </Paper>

            {/* Modal: Create School */}
            <Dialog
                open={schoolModalOpen}
                onClose={() => {
                    if (!saving) setSchoolModalOpen(false);
                }}
                fullWidth
                maxWidth="sm"
                slotProps={{
                    paper: {
                        sx: { borderRadius: 3 },
                    },
                }}
            >
                <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>Create New School</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                    <TextField
                        autoFocus
                        label="School Name"
                        required
                        fullWidth
                        value={schoolForm.name}
                        onChange={(e) => setSchoolForm({ ...schoolForm, name: e.target.value })}
                    />
                    <TextField
                        label="Description"
                        multiline
                        rows={3}
                        fullWidth
                        value={schoolForm.description}
                        onChange={(e) => setSchoolForm({ ...schoolForm, description: e.target.value })}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2.5, pt: 1 }}>
                    <Button
                        disabled={saving}
                        onClick={() => setSchoolModalOpen(false)}
                        sx={{ textTransform: 'none' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        disableElevation
                        disabled={saving}
                        onClick={createSchool}
                        sx={{ borderRadius: 2, textTransform: 'none', px: 3 }}
                    >
                        {saving ? 'Creating…' : 'Create School'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}