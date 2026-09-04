import React, { useState, useEffect } from 'react';
import { TextField, Stack, Alert, MenuItem } from '@mui/material';
import { BaseModal } from '../../../../components/BaseModal.tsx';
import { getPrograms } from '../../../../api/generated';

const LEVEL_OPTIONS = [
    'Certificate',
    'Diploma',
    'Degree',
    'Post-graduate Diploma',
] as const;

const DURATION_UNIT_OPTIONS = ['weeks', 'months', 'years'] as const;

type AcademicLevel = (typeof LEVEL_OPTIONS)[number];
type DurationUnit = (typeof DURATION_UNIT_OPTIONS)[number];

interface ProgramModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    schoolId: string;
}

export function ProgramModal({ open, onClose, onSuccess, schoolId }: ProgramModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        code: '',
        title: '',
        level: 'Degree' as AcademicLevel,
        duration_value: '4',
        duration_unit: 'years' as DurationUnit,
        short_description: '',
        long_description: '',
    });

    useEffect(() => {
        if (!open) {
            setFormData({
                code: '',
                title: '',
                level: 'Degree',
                duration_value: '4',
                duration_unit: 'years',
                short_description: '',
                long_description: '',
            });
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
            await getPrograms().postProgramsCreate({
                school_public_id: schoolId,
                code: formData.code.trim(),
                title: formData.title.trim(),
                level: formData.level,
                duration_value: Number(formData.duration_value),
                duration_unit: formData.duration_unit,
                short_description: formData.short_description.trim() || undefined,
                long_description: formData.long_description.trim() || undefined,
            });
            onSuccess();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create program.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid =
        formData.code.trim() !== '' &&
        formData.title.trim() !== '' &&
        formData.level &&
        Number(formData.duration_value) > 0 &&
        formData.duration_unit;

    return (
        <BaseModal
            open={open}
            onClose={onClose}
            title="Add New Program"
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            disabled={!isFormValid}
        >
            {error && <Alert severity="error">{error}</Alert>}

            <Stack direction="row" spacing={2}>
                <TextField
                    label="Program Code"
                    required
                    value={formData.code}
                    onChange={handleChange('code')}
                    placeholder="e.g. BSCS"
                    sx={{ flex: 1 }}
                />
                <TextField
                    label="Duration"
                    type="number"
                    required
                    value={formData.duration_value}
                    onChange={handleChange('duration_value')}
                    slotProps={{ htmlInput: { min: 1 } }}
                    sx={{ width: 120 }}
                />
                <TextField
                    select
                    label="Unit"
                    required
                    value={formData.duration_unit}
                    onChange={handleChange('duration_unit')}
                    sx={{ width: 140 }}
                >
                    {DURATION_UNIT_OPTIONS.map((unit) => (
                        <MenuItem key={unit} value={unit}>
                            {unit}
                        </MenuItem>
                    ))}
                </TextField>
            </Stack>

            <TextField
                label="Title"
                fullWidth
                required
                value={formData.title}
                onChange={handleChange('title')}
                placeholder="e.g. B.Sc. Computer Science"
            />

            <TextField
                select
                label="Academic Level"
                fullWidth
                required
                value={formData.level}
                onChange={handleChange('level')}
            >
                {LEVEL_OPTIONS.map((level) => (
                    <MenuItem key={level} value={level}>
                        {level}
                    </MenuItem>
                ))}
            </TextField>

            <TextField
                label="Short Description"
                fullWidth
                value={formData.short_description}
                onChange={handleChange('short_description')}
            />

            <TextField
                label="Long Description"
                fullWidth
                multiline
                rows={3}
                value={formData.long_description}
                onChange={handleChange('long_description')}
            />
        </BaseModal>
    );
}