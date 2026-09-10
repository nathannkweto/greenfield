import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import {
    Box,
    Typography,
    Paper,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    CardHeader,
    Divider,
} from '@mui/material';
import PaymentsIcon from '@mui/icons-material/Payments';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SchoolIcon from '@mui/icons-material/School';
import { GET_FEE_PAYMENTS } from './queries';

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
    payments?: PaymentItem[];
}

interface Student {
    id: string;
    studentNumber?: string | null;
    firstName: string;
    lastName: string;
    studentFees?: StudentFeeSummary[];
}

interface StudentFee {
    id: string;
    amountZmw: number;
    fee?: Fee;
    student?: Student;
    payments?: PaymentItem[];
}

interface Transaction {
    id: string;
    referenceNumber: string;
    paymentMethod: string;
}

interface FeePaymentNode {
    id: string;
    amount: number;
    createdAt: string;
    transaction: Transaction;
    studentFee: StudentFee;
}

interface ProgramNode {
    id: string;
    code: string;
    title: string;
    level: string;
    students: Student[];
}

interface GetFeePaymentsData {
    feePayments?: {
        edges?: Array<{
            node: FeePaymentNode;
        }>;
    };
    programs?: {
        edges?: Array<{
            node: ProgramNode;
        }>;
    };
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZM', {
        style: 'currency',
        currency: 'ZMW',
        minimumFractionDigits: 2,
    }).format(amount);
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export default function FeePaymentsPage() {
    const [activeTab, setActiveTab] = useState(0);
    const { data, loading, error } = useQuery<GetFeePaymentsData>(GET_FEE_PAYMENTS, {
        variables: { first: 100 },
    });

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ my: 2 }}>
                Failed to load fee payments: {error.message}
            </Alert>
        );
    }

    // Extract fee payments from connection edges
    const rawPayments =
        data?.feePayments?.edges?.map((edge) => edge.node) || [];

    // Sort payments latest first
    const payments = [...rawPayments].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Extract programs from connection edges
    const programs =
        data?.programs?.edges?.map((edge) => edge.node) || [];

    return (
        <Box sx={{ width: '100%', flexGrow: 1 }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                    Fee Payments & Ledger
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    View recent transactions, payment history, and student balance totals by academic program.
                </Typography>
            </Box>

            {/* TABS HEADER */}
            <Paper sx={{ mb: 3 }}>
                <Tabs
                    value={activeTab}
                    onChange={(_, newValue) => setActiveTab(newValue)}
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab icon={<PaymentsIcon />} iconPosition="start" label="Payment History" />
                    <Tab
                        icon={<AccountBalanceWalletIcon />}
                        iconPosition="start"
                        label="Outstanding Balances by Program"
                    />
                </Tabs>
            </Paper>

            {/* TAB 1: ALL PAYMENTS (LATEST FIRST) */}
            {activeTab === 0 && (
                <TableContainer component={Paper} elevation={1}>
                    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PaymentsIcon color="primary" />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Recent Fee Payments
                        </Typography>
                    </Box>
                    <Divider />
                    <Table aria-label="fee payments table">
                        <TableHead sx={{ bgcolor: 'action.hover' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Date & Reference</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Student ID</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Student Name</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Fee Title</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Payment Method</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>Fee Amount</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>Paid Amount</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>Remaining Balance</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {payments.length > 0 ? (
                                payments.map((payment) => {
                                    const feeTotal = payment.studentFee?.amountZmw || 0;
                                    const totalPaidOnFee =
                                        payment.studentFee?.payments?.reduce(
                                            (sum, p) => sum + p.amount,
                                            0
                                        ) || 0;
                                    const remainingBalance = Math.max(0, feeTotal - totalPaidOnFee);

                                    return (
                                        <TableRow key={payment.id} hover>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {formatDate(payment.createdAt)}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Ref: {payment.transaction?.referenceNumber || '—'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={payment.studentFee?.student?.studentNumber || 'N/A'}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 500 }}>
                                                {payment.studentFee?.student
                                                    ? `${payment.studentFee.student.firstName} ${payment.studentFee.student.lastName}`
                                                    : 'Unknown'}
                                            </TableCell>
                                            <TableCell>{payment.studentFee?.fee?.title || '—'}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={payment.transaction?.paymentMethod?.replace(/_/g, ' ') || 'N/A'}
                                                    size="small"
                                                    color="primary"
                                                    variant="filled"
                                                    sx={{ textTransform: 'capitalize', fontSize: '0.72rem' }}
                                                />
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 500 }}>
                                                {formatCurrency(feeTotal)}
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 600, color: 'success.main' }}>
                                                {formatCurrency(payment.amount)}
                                            </TableCell>
                                            <TableCell
                                                align="right"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: remainingBalance > 0 ? 'error.main' : 'text.secondary',
                                                }}
                                            >
                                                {formatCurrency(remainingBalance)}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            No payment records found.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* TAB 2: OUTSTANDING BALANCES GROUPED BY PROGRAM */}
            {activeTab === 1 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {programs.length > 0 ? (
                        programs.map((program) => {
                            const studentBalances = (program.students || []).map((student) => {
                                const totalBilled =
                                    student.studentFees?.reduce(
                                        (sum, sf) => sum + sf.amountZmw,
                                        0
                                    ) || 0;

                                const totalPaid =
                                    student.studentFees?.reduce((sum, sf) => {
                                        const paymentsSum =
                                            sf.payments?.reduce((pSum, p) => pSum + p.amount, 0) || 0;
                                        return sum + paymentsSum;
                                    }, 0) || 0;

                                const outstanding = Math.max(0, totalBilled - totalPaid);

                                return {
                                    student,
                                    totalBilled,
                                    totalPaid,
                                    outstanding,
                                };
                            });

                            const programOutstandingTotal = studentBalances.reduce(
                                (sum, item) => sum + item.outstanding,
                                0
                            );

                            return (
                                <Card key={program.id} variant="outlined" sx={{ borderRadius: 2 }}>
                                    <CardHeader
                                        avatar={<SchoolIcon color="primary" />}
                                        title={
                                            <Box
                                                sx={{
                                                    display: 'flex',
                                                    justify: 'space-between',
                                                    alignItems: 'center',
                                                    flexWrap: 'wrap',
                                                    gap: 1,
                                                }}
                                            >
                                                <Typography variant="h6">
                                                    {program.code} — {program.title}
                                                </Typography>
                                                <Chip
                                                    label={`Total Program Outstanding: ${formatCurrency(programOutstandingTotal)}`}
                                                    color={programOutstandingTotal > 0 ? 'error' : 'success'}
                                                    sx={{ fontWeight: 600 }}
                                                />
                                            </Box>
                                        }
                                        subheader={`${program.students?.length || 0} Enrolled Students`}
                                        sx={{ bgcolor: 'action.hover', pb: 1.5 }}
                                    />
                                    <Divider />
                                    <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                                        <TableContainer>
                                            <Table aria-label={`balances for ${program.title}`}>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell sx={{ fontWeight: 700 }}>Student ID</TableCell>
                                                        <TableCell sx={{ fontWeight: 700 }}>Student Name</TableCell>
                                                        <TableCell align="right" sx={{ fontWeight: 700 }}>Total Billed</TableCell>
                                                        <TableCell align="right" sx={{ fontWeight: 700 }}>Total Paid</TableCell>
                                                        <TableCell align="right" sx={{ fontWeight: 700 }}>Outstanding Balance</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {studentBalances.length > 0 ? (
                                                        studentBalances.map(({ student, totalBilled, totalPaid, outstanding }) => (
                                                            <TableRow key={student.id} hover>
                                                                <TableCell>
                                                                    <Chip
                                                                        label={student.studentNumber || 'N/A'}
                                                                        size="small"
                                                                        variant="outlined"
                                                                    />
                                                                </TableCell>
                                                                <TableCell sx={{ fontWeight: 500 }}>
                                                                    {`${student.firstName} ${student.lastName}`}
                                                                </TableCell>
                                                                <TableCell align="right">
                                                                    {formatCurrency(totalBilled)}
                                                                </TableCell>
                                                                <TableCell align="right" sx={{ color: 'success.main', fontWeight: 500 }}>
                                                                    {formatCurrency(totalPaid)}
                                                                </TableCell>
                                                                <TableCell
                                                                    align="right"
                                                                    sx={{
                                                                        fontWeight: 700,
                                                                        color: outstanding > 0 ? 'error.main' : 'text.secondary',
                                                                    }}
                                                                >
                                                                    {formatCurrency(outstanding)}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell colSpan={5} align="center" sx={{ py: 2 }}>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    No students registered under this program.
                                                                </Typography>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    </CardContent>
                                </Card>
                            );
                        })
                    ) : (
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <Typography color="text.secondary">No academic programs found.</Typography>
                        </Paper>
                    )}
                </Box>
            )}
        </Box>
    );
}