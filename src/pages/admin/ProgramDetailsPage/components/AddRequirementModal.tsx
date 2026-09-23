import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    CircularProgress,
} from '@mui/material';

interface AddRequirementModalProps {
    open: boolean;
    onClose: () => void;
    newReqText: string;
    setNewReqText: (value: string) => void;
    submitting: boolean;
    onSubmit: () => void;
}

export default function AddRequirementModal({
                                                open,
                                                onClose,
                                                newReqText,
                                                setNewReqText,
                                                submitting,
                                                onSubmit,
                                            }: AddRequirementModalProps) {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Add Admission Requirement</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Requirement Description"
                    fullWidth
                    multiline
                    rows={3}
                    value={newReqText}
                    onChange={(e) => setNewReqText(e.target.value)}
                    placeholder='e.g., "5 O-Level Credits including Mathematics and English"'
                />
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={onSubmit}
                    disabled={!newReqText.trim() || submitting}
                >
                    {submitting ? <CircularProgress size={24} /> : 'Save Requirement'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}