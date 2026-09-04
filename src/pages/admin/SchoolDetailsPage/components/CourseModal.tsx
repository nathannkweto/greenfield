import React, { useState, useEffect } from 'react';
import { TextField, Alert } from '@mui/material';
import { BaseModal } from '../../../../components/BaseModal.tsx';
import { getCourses } from '../../../../api/generated';

interface CourseModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    schoolId: string;
}

export function CourseModal({ open, onClose, onSuccess, schoolId }: CourseModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        code: '',
        title: '',
        credits: '3',
        description: '',
    });

    useEffect(() => {
        if (!open) {
            setFormData({ code: '', title: '', credits: '3', description: '' });
            setError(null);
        }
    }, [open]);

    const handleChange = (field: keyof typeof formData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);
        try {
            await getCourses().postCoursesCreate({
                school_public_id: schoolId,
                code: formData.code.trim(),
                title: formData.title.trim(),
                credits: Number(formData.credits),
                description: formData.description.trim(),
            });
            onSuccess();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create course.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = formData.code.trim() && formData.title.trim() && formData.credits && formData.description.trim();

    return (
        <BaseModal
            open={open}
            onClose={onClose}
            title="Add New Course"
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            disabled={!isFormValid}
        >
            {error && <Alert severity="error">{error}</Alert>}
            <TextField label="Course Code" fullWidth required value={formData.code} onChange={handleChange('code')} placeholder="e.g. CS101" />
            <TextField label="Course Title" fullWidth required value={formData.title} onChange={handleChange('title')} placeholder="e.g. Intro to Computer Science" />
            <TextField label="Credits" type="number" fullWidth required value={formData.credits} onChange={handleChange('credits')} />
            <TextField label="Description" fullWidth required multiline rows={3} value={formData.description} onChange={handleChange('description')} />
        </BaseModal>
    );
}