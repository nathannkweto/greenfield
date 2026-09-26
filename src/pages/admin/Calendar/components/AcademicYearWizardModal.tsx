import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    TextField,
    CircularProgress,
    Alert,
} from '@mui/material';
import { getTerms } from '../../../../api/generated';

interface AcademicYearWizardModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function AcademicYearWizardModal({ open, onClose, onSuccess }: AcademicYearWizardModalProps) {
    const [year, setYear] = useState('2027');
    const [startDate, setStartDate] = useState('2027-01-05');
    const [endDate, setEndDate] = useState('2027-12-20');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { postAcademicYearsCreate } = getTerms();

    const handleSave = async () => {
        setLoading(true);
        setError(null);

        try {
            await postAcademicYearsCreate({
                year: parseInt(year, 10),
                start_date: startDate,
                end_date: endDate,
            });
            onSuccess?.();
            onClose();
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Failed to create academic year.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontWeight: 800 }}>Create Academic Year</DialogTitle>
            <DialogContent dividers>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                    {error && <Alert severity="error">{error}</Alert>}
                    <TextField
                        label="Target Calendar Year"
                        type="number"
                        fullWidth
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                        disabled={loading}
                    />
                    <TextField
                        label="Academic Year Starts"
                        type="date"
                        fullWidth
                        slotProps={{ inputLabel: { shrink: true } }}
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        disabled={loading}
                    />
                    <TextField
                        label="Academic Year Ends"
                        type="date"
                        fullWidth
                        slotProps={{ inputLabel: { shrink: true } }}
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        disabled={loading}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    disabled={loading || !year || !startDate || !endDate}
                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
                >
                    {loading ? 'Creating...' : 'Create Academic Year'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}