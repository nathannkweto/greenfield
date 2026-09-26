import { useState, useMemo } from 'react';
import type { AxiosError } from 'axios';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    TextField,
    FormControlLabel,
    Checkbox,
    Chip,
    CircularProgress,
    Alert,
} from '@mui/material';
import type { AcademicYear, AcademicTerm } from '../types';
import { detectTermForDate } from '../helpers';
import { getTerms } from '../../../../api/generated';
import type { ErrorResponse } from '../../../../api/generated';

interface AddEventModalProps {
    open: boolean;
    onClose: () => void;
    academicYear: AcademicYear;
    terms: AcademicTerm[];
    initialDate?: string;
    onSuccess?: () => void;
}

export function AddEventModal({
                                  open,
                                  onClose,
                                  academicYear,
                                  terms,
                                  initialDate,
                                  onSuccess,
                              }: AddEventModalProps) {
    const [title, setTitle] = useState('');
    const [isSingleDay, setIsSingleDay] = useState(true);
    const [startDate, setStartDate] = useState(initialDate || '');
    const [endDate, setEndDate] = useState(initialDate || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { postAcademicYearsIdEventsCreate } = getTerms();

    const detectedTerm = useMemo(() => {
        return detectTermForDate(startDate, terms);
    }, [startDate, terms]);

    const handleSave = async () => {
        if (!academicYear.id) return;

        const numericYearId = Number(academicYear.id);

        setLoading(true);
        setError(null);

        try {
            await postAcademicYearsIdEventsCreate(numericYearId, {
                academic_year_id: numericYearId,
                title,
                start_date: startDate,
                end_date: isSingleDay ? startDate : endDate,
            });
            onSuccess?.();
            onClose();
        } catch (err: unknown) {
            const axiosErr = err as AxiosError<ErrorResponse>;
            setError(axiosErr.response?.data?.message || 'Failed to create academic event.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontWeight: 800 }}>Add Academic Event</DialogTitle>
            <DialogContent dividers>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                    {error && <Alert severity="error">{error}</Alert>}
                    <TextField
                        label="Event Title"
                        placeholder="e.g. Late Registration Deadline"
                        fullWidth
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={loading}
                    />

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isSingleDay}
                                onChange={(e) => {
                                    setIsSingleDay(e.target.checked);
                                    if (e.target.checked) setEndDate(startDate);
                                }}
                                disabled={loading}
                            />
                        }
                        label="Single Day Event"
                    />

                    <TextField
                        label={isSingleDay ? 'Event Date' : 'Start Date'}
                        type="date"
                        fullWidth
                        slotProps={{
                            inputLabel: { shrink: true },
                            htmlInput: { min: academicYear.startDate, max: academicYear.endDate },
                        }}
                        value={startDate}
                        onChange={(e) => {
                            setStartDate(e.target.value);
                            if (isSingleDay) setEndDate(e.target.value);
                        }}
                        disabled={loading}
                    />

                    {!isSingleDay && (
                        <TextField
                            label="End Date"
                            type="date"
                            fullWidth
                            slotProps={{
                                inputLabel: { shrink: true },
                                htmlInput: { min: startDate || academicYear.startDate, max: academicYear.endDate },
                            }}
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            disabled={loading}
                        />
                    )}

                    <Chip
                        label={`Context: ${detectedTerm}`}
                        color={detectedTerm.includes('Term') ? 'primary' : 'default'}
                        variant="outlined"
                        size="small"
                        sx={{ alignSelf: 'flex-start', mt: 1 }}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={loading || !title.trim() || !startDate || (!isSingleDay && !endDate)}
                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
                >
                    {loading ? 'Creating...' : 'Create Event'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}