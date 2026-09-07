import React from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, CircularProgress, IconButton, Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface BaseModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    onSubmit: () => void;
    isSubmitting?: boolean;
    submitLabel?: string;
    disabled?: boolean;
}

export function BaseModal({
                              open, onClose, title, children, onSubmit,
                              isSubmitting = false, submitLabel = 'Save', disabled = false
                          }: BaseModalProps) {
    return (
        <Dialog open={open} onClose={!isSubmitting ? onClose : undefined} fullWidth maxWidth="sm">
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                    {title}
                </Typography>
                <IconButton onClick={onClose} disabled={isSubmitting} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 3 }}>
                {children}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button onClick={onClose} disabled={isSubmitting} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={onSubmit}
                    variant="contained"
                    disabled={isSubmitting || disabled}
                    disableElevation
                    sx={{ minWidth: 100 }}
                >
                    {isSubmitting ? <CircularProgress size={24} color="inherit" /> : submitLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
}