import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Box,
    Typography,
    Checkbox,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Alert,
    AlertTitle,
    InputAdornment,
    Divider,
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

type PaymentMethod = 'cash' | 'bank_transfer' | 'mobile_money' | 'card';

interface PaymentItem {
    id: string;
    amount: number;
}

interface Fee {
    id: string;
    title: string;
}

interface StudentFeeSummary {
    id: string;
    amountZmw: number;
    fee?: Fee;
    fee_payments?: PaymentItem[];
    payments?: PaymentItem[];
}

interface Student {
    id: string;
    studentNumber?: string | null;
    firstName: string;
    lastName: string;
    studentFees?: StudentFeeSummary[];
}

interface RecordPaymentModalProps {
    open: boolean;
    onClose: () => void;
    students: Student[];
    onSuccess: (msg: string) => void;
    onError: (msg: string) => void;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZM', {
        style: 'currency',
        currency: 'ZMW',
        minimumFractionDigits: 2,
    }).format(amount);
};

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
                                                                          open,
                                                                          onClose,
                                                                          students = [],
                                                                          onSuccess,
                                                                          onError,
                                                                      }) => {
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
    const [amountTendered, setAmountTendered] = useState<string>('');
    const [referenceNumber, setReferenceNumber] = useState('');
    const [gatewayReference, setGatewayReference] = useState('');
    const [manualReceiptNumber, setManualReceiptNumber] = useState('');

    // Mapping of student_fee_id -> allocated amount
    const [allocations, setAllocations] = useState<Record<string, number>>({});

    const selectedStudent = students.find((s) => s.id === selectedStudentId);

    const handleStudentChange = (studentId: string) => {
        setSelectedStudentId(studentId);
        setAllocations({});
        setAmountTendered('');
    };

    // Toggle fee allocation checkbox
    const handleToggleFee = (feeId: string, maxBalance: number) => {
        setAllocations((prev) => {
            const copy = { ...prev };
            if (copy[feeId] !== undefined) {
                delete copy[feeId];
            } else {
                copy[feeId] = maxBalance; // Default to full remaining balance
            }
            return copy;
        });
    };

    // Update custom allocation value for a fee
    const handleAllocationAmountChange = (feeId: string, val: string) => {
        const numVal = parseFloat(val) || 0;
        setAllocations((prev) => ({
            ...prev,
            [feeId]: numVal,
        }));
    };

    // Calculations
    const totalAllocated = Object.values(allocations).reduce((sum, val) => sum + val, 0);
    const totalReceived = parseFloat(amountTendered) || 0;
    const overpaymentAmount = Math.max(0, totalReceived - totalAllocated);

    const handleSubmit = () => {
        if (!selectedStudentId) {
            onError('Please select a student.');
            return;
        }

        if (totalReceived <= 0) {
            onError('Please enter a valid payment amount.');
            return;
        }

        if (paymentMethod === 'cash' && !manualReceiptNumber) {
            onError('Manual Receipt Number is required for cash payments.');
            return;
        }

        // Output payload structure for future backend API integration
        const payload = {
            student_id: selectedStudentId,
            payment_method: paymentMethod,
            amount: totalReceived,
            reference_number: referenceNumber || `TXN-${Date.now()}`,
            gateway_reference: gatewayReference || null,
            manual_receipt_number: manualReceiptNumber || null,
            fee_allocations: Object.entries(allocations).map(([student_fee_id, amount]) => ({
                student_fee_id,
                amount,
            })),
            overpayment_credit: overpaymentAmount,
        };

        console.log('Record Payment Payload:', payload);
        onSuccess(`Payment of ${formatCurrency(totalReceived)} recorded successfully!`);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ReceiptLongIcon color="primary" />
                Record Student Fee Payment
            </DialogTitle>
            <DialogContent dividers>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                        gap: 2.5,
                        pt: 1,
                    }}
                >
                    {/* STUDENT SELECTION */}
                    <Box>
                        <TextField
                            select
                            label="Select Student"
                            fullWidth
                            required
                            value={selectedStudentId}
                            onChange={(e) => handleStudentChange(e.target.value)}
                        >
                            {students.map((s) => (
                                <MenuItem key={s.id} value={s.id}>
                                    {s.studentNumber ? `[${s.studentNumber}] ` : ''}
                                    {s.firstName} {s.lastName}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    {/* PAYMENT METHOD */}
                    <Box>
                        <TextField
                            select
                            label="Payment Method"
                            fullWidth
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                        >
                            <MenuItem value="cash">Cash</MenuItem>
                            <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                            <MenuItem value="mobile_money">Mobile Money</MenuItem>
                            <MenuItem value="card">Debit/Credit Card</MenuItem>
                        </TextField>
                    </Box>

                    {/* TOTAL AMOUNT RECEIVED */}
                    <Box>
                        <TextField
                            label="Total Amount Received / Tendered"
                            type="number"
                            fullWidth
                            required
                            placeholder="0.00"
                            value={amountTendered}
                            onChange={(e) => setAmountTendered(e.target.value)}
                            slotProps={{
                                input: {
                                    startAdornment: <InputAdornment position="start">ZMW</InputAdornment>,
                                },
                            }}
                        />
                    </Box>

                    {/* RECEIPT / REFERENCE NUMBER */}
                    <Box>
                        {paymentMethod === 'cash' ? (
                            <TextField
                                label="Manual Receipt Number (from Book)"
                                fullWidth
                                required
                                placeholder="e.g. 1005"
                                value={manualReceiptNumber}
                                onChange={(e) => setManualReceiptNumber(e.target.value)}
                                helperText="Pre-filled from active physical receipt book leaf"
                            />
                        ) : (
                            <TextField
                                label="Bank / Gateway Reference Number"
                                fullWidth
                                required
                                placeholder="e.g. REF-8839201"
                                value={referenceNumber}
                                onChange={(e) => setReferenceNumber(e.target.value)}
                            />
                        )}
                    </Box>

                    {/* GATEWAY REFERENCE FOR NON-CASH */}
                    {paymentMethod !== 'cash' && (
                        <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
                            <TextField
                                label="Gateway / Mobile Money Transaction ID (Optional)"
                                fullWidth
                                placeholder="e.g. MP2026092401"
                                value={gatewayReference}
                                onChange={(e) => setGatewayReference(e.target.value)}
                            />
                        </Box>
                    )}

                    {/* STUDENT UNPAID FEES TABLE */}
                    <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
                        <Divider sx={{ my: 1 }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                            Fee Allocation List
                        </Typography>

                        {selectedStudent ? (
                            <Paper variant="outlined">
                                <Table size="small">
                                    <TableHead sx={{ backgroundColor: 'action.hover' }}>
                                        <TableRow>
                                            <TableCell padding="checkbox" />
                                            <TableCell sx={{ fontWeight: 700 }}>Fee Title</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 700 }}>Total Fee</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 700 }}>Remaining Balance</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 700, width: 170 }}>
                                                Amount Paying
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {selectedStudent.studentFees && selectedStudent.studentFees.length > 0 ? (
                                            selectedStudent.studentFees.map((sf) => {
                                                const feeTotal = sf.amountZmw || 0;
                                                const paymentList = sf.fee_payments || sf.payments || [];
                                                const paidSum = paymentList.reduce((acc, p) => acc + p.amount, 0);
                                                const remaining = Math.max(0, feeTotal - paidSum);

                                                const isSelected = allocations[sf.id] !== undefined;

                                                return (
                                                    <TableRow key={sf.id} hover selected={isSelected}>
                                                        <TableCell padding="checkbox">
                                                            <Checkbox
                                                                checked={isSelected}
                                                                disabled={remaining === 0}
                                                                onChange={() => handleToggleFee(sf.id, remaining)}
                                                            />
                                                        </TableCell>
                                                        <TableCell sx={{ fontWeight: 600 }}>
                                                            {sf.fee?.title || 'Program Fee'}
                                                        </TableCell>
                                                        <TableCell align="right">{formatCurrency(feeTotal)}</TableCell>
                                                        <TableCell align="right" sx={{ color: remaining > 0 ? 'error.main' : 'text.secondary' }}>
                                                            {formatCurrency(remaining)}
                                                        </TableCell>
                                                        <TableCell align="right">
                                                            <TextField
                                                                size="small"
                                                                type="number"
                                                                disabled={!isSelected}
                                                                value={allocations[sf.id] ?? ''}
                                                                onChange={(e) => handleAllocationAmountChange(sf.id, e.target.value)}
                                                                slotProps={{
                                                                    input: {
                                                                        startAdornment: (
                                                                            <InputAdornment position="start" sx={{ fontSize: '0.75rem' }}>
                                                                                ZMW
                                                                            </InputAdornment>
                                                                        ),
                                                                    },
                                                                }}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center" sx={{ py: 2 }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                        No active fee charges assigned to this student.
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </Paper>
                        ) : (
                            <Alert severity="info">Please select a student above to view assigned fees.</Alert>
                        )}
                    </Box>

                    {/* OVERPAYMENT & SUMMARY CARD */}
                    {totalReceived > 0 && (
                        <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
                            <Box sx={{ p: 2, backgroundColor: 'background.default', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">Total Allocated to Selected Fees:</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatCurrency(totalAllocated)}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary">Total Payment Received:</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'success.main' }}>
                                        {formatCurrency(totalReceived)}
                                    </Typography>
                                </Box>

                                {overpaymentAmount > 0 && (
                                    <Alert severity="success" icon={<AccountBalanceWalletIcon />} sx={{ mt: 1.5 }}>
                                        <AlertTitle sx={{ fontWeight: 700 }}>Overpayment Detected ({formatCurrency(overpaymentAmount)})</AlertTitle>
                                        An excess of <strong>{formatCurrency(overpaymentAmount)}</strong> will be credited to the student's <strong>Advance Deposit Account</strong> for future term fees.
                                    </Alert>
                                )}
                            </Box>
                        </Box>
                    )}
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Post Payment & Issue Receipt
                </Button>
            </DialogActions>
        </Dialog>
    );
};