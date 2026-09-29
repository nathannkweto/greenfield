import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Box, Divider, Stack } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import PrintIcon from '@mui/icons-material/Print';

import type { LedgerTransaction, Student } from '../types';
import { formatCurrency, formatDateTime } from '../helpers';

interface PaymentReceiptModalProps {
    open: boolean;
    transaction: LedgerTransaction | null;
    student?: Student;
    onClose: () => void;
}

export function PaymentReceiptModal({ open, transaction, student, onClose }: PaymentReceiptModalProps) {
    if (!transaction) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: 3.5 } } }}>
            <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
                <CheckCircleOutlineIcon color="success" sx={{ fontSize: 48, mb: 1 }} />
                <Typography variant="h6" fontWeight={800}>
                    Official Payment Receipt
                </Typography>
            </DialogTitle>

            <DialogContent sx={{ px: 3, py: 2 }}>
                <Box
                    sx={{
                        p: 2.5,
                        border: '1px dashed',
                        borderColor: 'divider',
                        borderRadius: 3,
                        backgroundColor: 'background.default',
                    }}
                >
                    <Stack spacing={1.5}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" color="text.secondary">Receipt No:</Typography>
                            <Typography variant="caption" fontWeight={700} sx={{ fontFamily: 'monospace' }}>
                                {transaction.receiptNumber || 'REC-88219'}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" color="text.secondary">Date & Time:</Typography>
                            <Typography variant="caption" fontWeight={700}>
                                {formatDateTime(transaction.date)}
                            </Typography>
                        </Box>

                        <Divider />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" color="text.secondary">Student Name:</Typography>
                            <Typography variant="caption" fontWeight={700}>
                                {student ? `${student.firstName} ${student.lastName}` : 'N/A'}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" color="text.secondary">Student No:</Typography>
                            <Typography variant="caption" fontWeight={700}>
                                {student?.studentNumber || 'N/A'}
                            </Typography>
                        </Box>

                        <Divider />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" color="text.secondary">Fee Category:</Typography>
                            <Typography variant="caption" fontWeight={700}>
                                {transaction.title}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" color="text.secondary">Payment Method:</Typography>
                            <Typography variant="caption" fontWeight={700}>
                                {transaction.paymentMethod || 'Online Transfer'}
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" color="text.secondary">Transaction Ref:</Typography>
                            <Typography variant="caption" fontWeight={700} sx={{ fontFamily: 'monospace' }}>
                                {transaction.reference || 'N/A'}
                            </Typography>
                        </Box>

                        <Divider sx={{ borderStyle: 'dashed' }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle2" fontWeight={800}>Amount Paid:</Typography>
                            <Typography variant="h6" fontWeight={900} color="success.main">
                                {formatCurrency(transaction.amount)}
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
                <Button startIcon={<PrintIcon />} onClick={handlePrint} color="inherit">
                    Print
                </Button>
                <Button onClick={onClose} variant="contained" disableElevation sx={{ fontWeight: 700, borderRadius: 2 }}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}