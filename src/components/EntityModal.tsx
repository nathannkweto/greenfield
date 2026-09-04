import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress } from '@mui/material';

interface EntityModalProps {
    open: boolean;
    type: 'school' | 'program' | 'course' | 'lecturer' | null;
    mode: 'create' | 'edit';
    schoolPublicId?: string;
    initialData?: Record<string, any>;
    onClose: () => void;
    onSubmit: (formData: Record<string, any>) => Promise<void>;
}

export const EntityModal: React.FC<EntityModalProps> = ({ open, type, mode, schoolPublicId, initialData, onClose, onSubmit }) => {
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({ school_public_id: schoolPublicId || '' });
        }
    }, [initialData, schoolPublicId, open]);

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        await onSubmit(formData);
        setLoading(false);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ textTransform: 'capitalize' }}>{mode} {type}</DialogTitle>
            <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>

                {type === 'program' && (
                    <>
                        <TextField label="Program Code" fullWidth value={formData.code || ''} onChange={e => handleChange('code', e.target.value)} />
                        <TextField label="Title" fullWidth value={formData.title || ''} onChange={e => handleChange('title', e.target.value)} />
                        <TextField label="Qualification" fullWidth value={formData.qualification || ''} onChange={e => handleChange('qualification', e.target.value)} />
                        <TextField label="Duration (Years)" type="number" fullWidth value={formData.duration_years || ''} onChange={e => handleChange('duration_years', Number(e.target.value))} />
                        <TextField label="Short Description" fullWidth multiline rows={2} value={formData.short_description || ''} onChange={e => handleChange('short_description', e.target.value)} />
                        <TextField label="Long Description" fullWidth multiline rows={4} value={formData.long_description || ''} onChange={e => handleChange('long_description', e.target.value)} />
                    </>
                )}

                {type === 'course' && (
                    <>
                        <TextField label="Course Code" fullWidth value={formData.code || ''} onChange={e => handleChange('code', e.target.value)} />
                        <TextField label="Course Title" fullWidth value={formData.title || ''} onChange={e => handleChange('title', e.target.value)} />
                        <TextField label="Credits" type="number" fullWidth value={formData.credits || ''} onChange={e => handleChange('credits', Number(e.target.value))} />
                        <TextField label="Description" fullWidth multiline rows={3} value={formData.description || ''} onChange={e => handleChange('description', e.target.value)} />
                    </>
                )}

                {type === 'lecturer' && (
                    <>
                        <TextField label="Staff Number" fullWidth value={formData.staff_number || ''} onChange={e => handleChange('staff_number', e.target.value)} />
                        <TextField label="First Name" fullWidth value={formData.first_name || ''} onChange={e => handleChange('first_name', e.target.value)} />
                        <TextField label="Last Name" fullWidth value={formData.last_name || ''} onChange={e => handleChange('last_name', e.target.value)} />
                        <TextField label="Email" type="email" fullWidth value={formData.email || ''} onChange={e => handleChange('email', e.target.value)} />
                        <TextField label="Phone" fullWidth value={formData.phone || ''} onChange={e => handleChange('phone', e.target.value)} />
                        <TextField label="Date of Birth" type="date" InputLabelProps={{ shrink: true }} fullWidth value={formData.dob || ''} onChange={e => handleChange('dob', e.target.value)} />
                        <TextField label="Address" fullWidth multiline rows={2} value={formData.address || ''} onChange={e => handleChange('address', e.target.value)} />
                        <TextField label="Emergency Contact" fullWidth value={formData.emergency_contact || ''} onChange={e => handleChange('emergency_contact', e.target.value)} />
                    </>
                )}
            </DialogContent>
            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} disabled={loading}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};