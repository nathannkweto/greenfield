import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    TextField,
    MenuItem,
    Box,
    Divider,
    Alert,
} from '@mui/material';

import type { StudentFee } from '../types';
import { formatCurrency } from '../helpers';

interface PayFeeModalProps {
    open: boolean;
    studentFees: StudentFee[];
    selectedFeeId?: string;
    onClose: () => void;
    onSubmitPayment: (feeId: string, amount: number, method: string) => Promise<void>;
}

export function PayFeeModal({ open, studentFees, selectedFeeId, onClose, onSubmitPayment }: PayFeeModalProps) {
    const [feeId, setFeeId] = useState<string>(selectedFeeId || studentFees[0]?.id || '');
    const [amount, setAmount] = useState<string>('');
    const [method, setMethod] = useState<string>('AIRTEL_MONEY');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const activeFee = studentFees.find((f) => f.id === (feeId || selectedFeeId));
    const paid = activeFee?.fee_payments?.reduce((s, p) => s + p.amount, 0) || 0;
    const balance = activeFee ? Math.max(0, activeFee.amountZmw - paid) : 0;

    const handleSubmit = async () => {
        const numericAmount = parseFloat(amount);
        if (!feeId) {
            setErrorMsg('Please select a fee bill to pay.');
            return;
        }
        if (isNaN(numericAmount) || numericAmount <= 0) {
            setErrorMsg('Please enter a valid payment amount.');
            return;
        }
        if (numericAmount > balance) {
            setErrorMsg(`Payment amount cannot exceed the balance of ${formatCurrency(balance)}.`);
            return;
        }

        try {
            setIsSubmitting(true);
            setErrorMsg(null);
            await onSubmitPayment(feeId, numericAmount, method);
            onClose();
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Payment processing failed. Please try again.';
            setErrorMsg(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth slotProps={{ paper: { sx: { borderRadius: 3.5 } } }}>
            <DialogTitle sx={{ fontWeight: 800 }}>Make Fee Payment</DialogTitle>
            <Divider />
            <DialogContent sx={{ py: 2.5 }}>
                {errorMsg && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {errorMsg}
                    </Alert>
                )}

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <TextField
                        select
                        label="Select Fee Item"
                        value={feeId || selectedFeeId || ''}
                        onChange={(e) => setFeeId(e.target.value)}
                        fullWidth
                    >
                        {studentFees.map((sf) => {
                            const sfPaid = sf.fee_payments?.reduce((s, p) => s + p.amount, 0) || 0;
                            const sfBal = Math.max(0, sf.amountZmw - sfPaid);
                            return (
                                <MenuItem key={sf.id} value={sf.id} disabled={sfBal <= 0}>
                                    {sf.fee.title} — Bal: {formatCurrency(sfBal)}
                                </MenuItem>
                            );
                        })}
                    </TextField>

                    {activeFee && (
                        <Box sx={{ p: 2, backgroundColor: 'action.hover', borderRadius: 2 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                Total Billed: <strong>{formatCurrency(activeFee.amountZmw)}</strong>
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                Remaining Balance: <strong>{formatCurrency(balance)}</strong>
                            </Typography>
                        </Box>
                    )}

                    <TextField
                        label="Amount to Pay (ZMW)"
                        type="number"
                        fullWidth
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder={`Max ${balance}`}
                    />

                    <TextField
                        select
                        label="Payment Gateway / Method"
                        value={method}
                        onChange={(e) => setMethod(e.target.value)}
                        fullWidth
                    >
                        <MenuItem value="AIRTEL_MONEY">Airtel Money</MenuItem>
                        <MenuItem value="MTN_MONEY">MTN Mobile Money</MenuItem>
                        <MenuItem value="ZAMTEL_KWACHA">Zamtel Kwacha</MenuItem>
                        <MenuItem value="CARD">Debit / Credit Card (Visa/Mastercard)</MenuItem>
                    </TextField>
                </Box>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="inherit" disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    sx={{ fontWeight: 700, borderRadius: 2 }}
                >
                    {isSubmitting ? 'Processing...' : 'Confirm Payment'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
