import React, { useState, useEffect } from 'react';
import { TextField } from '@mui/material';
import { BaseModal } from '../BaseModal';
import { saveManagementEntity } from '../../api/services';

interface SchoolModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    school?: any;
}

export function SchoolModal({ open, onClose, onSuccess, school }: SchoolModalProps) {
    const isEditing = Boolean(school);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({ name: '', description: '' });

    useEffect(() => {
        if (school && open) {
            setFormData({ name: school.name || '', description: school.description || '' });
        } else if (!open) {
            setFormData({ name: '', description: '' });
        }
    }, [school, open]);

    const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const targetId = school?.public_id || school?.id;
            await saveManagementEntity('school', isEditing ? 'edit' : 'create', formData, targetId);
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to save school:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = formData.name.trim().length > 0;

    return (
        <BaseModal
            open={open}
            onClose={onClose}
            title={isEditing ? 'Edit School' : 'Add New School'}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            disabled={!isFormValid}
        >
            <TextField label="School Name" fullWidth required value={formData.name} onChange={handleChange('name')} />
            <TextField label="Description" fullWidth multiline rows={3} value={formData.description} onChange={handleChange('description')} />
        </BaseModal>
    );
}