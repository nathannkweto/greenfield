import React, { useState, useEffect } from 'react';
import { TextField, Stack, Alert } from '@mui/material';
import { BaseModal } from '../../../../components/BaseModal.tsx';
import { getLecturers } from '../../../../api/generated';

interface LecturerModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    schoolId: string;
}

const INITIAL_FORM_DATA = {
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    phone: '',
    dob: '',
    address: '',
    emergency_contact: '',
};

export function LecturerModal({ open, onClose, onSuccess, schoolId }: LecturerModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);

    useEffect(() => {
        if (!open) {
            setFormData(INITIAL_FORM_DATA);
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
            await getLecturers().postLecturersCreate({
                school_public_id: schoolId,
                first_name: formData.first_name.trim(),
                middle_name: formData.middle_name.trim() || undefined,
                last_name: formData.last_name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim() || undefined,
                dob: formData.dob || undefined,
                address: formData.address.trim() || undefined,
                emergency_contact: formData.emergency_contact.trim() || undefined,
            });
            onSuccess();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create lecturer.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid =
        formData.first_name.trim() !== '' &&
        formData.last_name.trim() !== '' &&
        formData.email.trim() !== '';

    return (
        <BaseModal
            open={open}
            onClose={onClose}
            title="Add New Lecturer"
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            disabled={!isFormValid}
        >
            {error && <Alert severity="error">{error}</Alert>}

            <Stack direction="row" spacing={2}>
                <TextField
                    label="First Name"
                    required
                    fullWidth
                    value={formData.first_name}
                    onChange={handleChange('first_name')}
                />
                <TextField
                    label="Middle Name"
                    fullWidth
                    value={formData.middle_name}
                    onChange={handleChange('middle_name')}
                />
                <TextField
                    label="Last Name"
                    required
                    fullWidth
                    value={formData.last_name}
                    onChange={handleChange('last_name')}
                />
            </Stack>

            <Stack direction="row" spacing={2}>
                <TextField
                    label="Email"
                    type="email"
                    required
                    fullWidth
                    value={formData.email}
                    onChange={handleChange('email')}
                />
                <TextField
                    label="Phone"
                    fullWidth
                    value={formData.phone}
                    onChange={handleChange('phone')}
                />
            </Stack>

            <Stack direction="row" spacing={2}>
                <TextField
                    label="Date of Birth"
                    type="date"
                    fullWidth
                    value={formData.dob}
                    onChange={handleChange('dob')}
                    slotProps={{ inputLabel: { shrink: true } }}
                />
                <TextField
                    label="Emergency Contact"
                    fullWidth
                    value={formData.emergency_contact}
                    onChange={handleChange('emergency_contact')}
                />
            </Stack>

            <TextField
                label="Address"
                fullWidth
                value={formData.address}
                onChange={handleChange('address')}
            />
        </BaseModal>
    );
}