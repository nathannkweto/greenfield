import { useState } from 'react';
import type { AxiosError } from 'axios';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    TextField,
    MenuItem,
    Typography,
    CircularProgress,
    Alert,
} from '@mui/material';
import type { AcademicYear } from '../types';
import { formatDateRange } from '../helpers';
import { getTerms } from '../../../../api/generated';
import { AcademicTermRequestTerm, type ErrorResponse } from '../../../../api/generated';

interface AddTermModalProps {
    open: boolean;
    onClose: () => void;
    academicYear: AcademicYear;
    onSuccess?: () => void;
}

export function AddTermModal({ open, onClose, academicYear, onSuccess }: AddTermModalProps) {
    const [termName, setTermName] = useState<AcademicTermRequestTerm>(AcademicTermRequestTerm.September);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { postAcademicYearsIdTermsCreate } = getTerms();

    const handleSave = async () => {
        if (!academicYear.id) return;

        const numericYearId = Number(academicYear.id);

        setLoading(true);
        setError(null);

        try {
            await postAcademicYearsIdTermsCreate(numericYearId, {
                academic_year_id: numericYearId,
                term: termName,
                start_date: startDate,
                end_date: endDate,
            });
            onSuccess?.();
            onClose();
        } catch (err: unknown) {
            const axiosErr = err as AxiosError<ErrorResponse>;
            setError(axiosErr.response?.data?.message || 'Failed to create term session.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontWeight: 800 }}>Add Academic Term</DialogTitle>
            <DialogContent dividers>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                    {error && <Alert severity="error">{error}</Alert>}
                    <TextField
                        select
                        label="Term Session Name"
                        fullWidth
                        value={termName}
                        onChange={(e) => setTermName(e.target.value as AcademicTermRequestTerm)}
                        disabled={loading}
                    >
                        <MenuItem value={AcademicTermRequestTerm.January}>January Term</MenuItem>
                        <MenuItem value={AcademicTermRequestTerm.May}>May Term</MenuItem>
                        <MenuItem value={AcademicTermRequestTerm.September}>September Term</MenuItem>
                    </TextField>

                    <TextField
                        label="Term Start Date"
                        type="date"
                        fullWidth
                        slotProps={{
                            inputLabel: { shrink: true },
                            htmlInput: { min: academicYear.startDate, max: academicYear.endDate },
                        }}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        disabled={loading}
                    />

                    <TextField
                        label="Term End Date"
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

                    <Typography variant="caption" color="text.secondary">
                        ⚠️ Date range must sit inside Academic Year bounds ({formatDateRange(academicYear.startDate, academicYear.endDate)}).
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={loading || !startDate || !endDate}
                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
                >
                    {loading ? 'Saving...' : 'Save Term'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}