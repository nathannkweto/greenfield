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
    Divider,
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { GET_ACCOUNTING_DATA } from './queries';

interface UserNode {
    id: string;
    email: string;
    admins?: Array<{
        id: string;
        firstName: string;
        lastName: string;
    }>;
}

interface TransactionNode {
    id: string;
    amount: number;
    referenceNumber: string;
    gatewayReference?: string;
    paymentMethod: string;
    manualReceiptNumber?: string;
    createdAt: string;
    debitAccount: { id: string; accountNumber: string };
    creditAccount: { id: string; accountNumber: string };
    cashier?: UserNode;
}

interface ReceiptBookNode {
    id: string;
    bookNumber: string;
    startNumber: number;
    endNumber: number;
    currentNumber?: number;
    status: 'ACTIVE' | 'COMPLETED' | 'LOST' | 'CANCELLED';
    assignedTo?: UserNode;
    createdAt: string;
}

interface AccountNode {
    id: string;
    accountNumber: string;
    createdAt: string;
}

interface AccountingData {
    transactions?: { edges?: Array<{ node: TransactionNode }> };
    receiptBooks?: { edges?: Array<{ node: ReceiptBookNode }> };
    accounts?: { edges?: Array<{ node: AccountNode }> };
}

const getUserDisplayName = (user?: UserNode | null): string => {
    if (!user) return 'System / Auto';
    const adminProfile = user.admins?.[0];
    if (adminProfile?.firstName) {
        return `${adminProfile.firstName} ${adminProfile.lastName}`;
    }
    return user.email;
};

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

const getStatusChipColor = (status: string) => {
    switch (status) {
        case 'ACTIVE':
            return 'success';
        case 'COMPLETED':
            return 'info';
        case 'LOST':
        case 'CANCELLED':
            return 'error';
        default:
            return 'default';
    }
};

export default function AccountingPage() {
    const [activeTab, setActiveTab] = useState(0);
    const { data, loading, error } = useQuery<AccountingData>(GET_ACCOUNTING_DATA, {
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
                Failed to load accounting data: {error.message}
            </Alert>
        );
    }

    // Extract connection nodes
    const rawTransactions = data?.transactions?.edges?.map((e) => e.node) || [];
    const receiptBooks = data?.receiptBooks?.edges?.map((e) => e.node) || [];
    const accounts = data?.accounts?.edges?.map((e) => e.node) || [];

    // Sort transactions latest first
    const transactions = [...rawTransactions].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return (
        <Box sx={{ width: '100%', flexGrow: 1 }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                    College Accounting & Ledgers
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Track revenue and expenditure transactions, issue receipt books, and manage double-entry accounts.
                </Typography>
            </Box>

            {/* TABS NAVIGATION */}
            <Paper sx={{ mb: 3 }}>
                <Tabs
                    value={activeTab}
                    onChange={(_, newValue) => setActiveTab(newValue)}
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab icon={<ReceiptIcon />} iconPosition="start" label="All Transactions" />
                    <Tab icon={<BookmarksIcon />} iconPosition="start" label="Receipt Books" />
                    <Tab icon={<AccountBalanceIcon />} iconPosition="start" label="Accounts" />
                </Tabs>
            </Paper>

            {/* TAB 1: ALL TRANSACTIONS */}
            {activeTab === 0 && (
                <TableContainer component={Paper} elevation={1}>
                    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ReceiptIcon color="primary" />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            General Ledger Transactions
                        </Typography>
                    </Box>
                    <Divider />
                    <Table aria-label="transactions table">
                        <TableHead sx={{ bgcolor: 'action.hover' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Date & Ref</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Debit Account</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Credit Account</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Payment Method</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Cashier / Issuer</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>Amount</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 700 }}>Type</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transactions.length > 0 ? (
                                transactions.map((tx) => {
                                    const isIncome =
                                        tx.debitAccount?.accountNumber.startsWith('1') ||
                                        tx.creditAccount?.accountNumber.startsWith('4');

                                    return (
                                        <TableRow key={tx.id} hover>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {formatDate(tx.createdAt)}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Ref: {tx.referenceNumber}
                                                    {tx.manualReceiptNumber ? ` | Receipt #${tx.manualReceiptNumber}` : ''}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={tx.debitAccount?.accountNumber || 'N/A'} size="small" variant="outlined" />
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={tx.creditAccount?.accountNumber || 'N/A'} size="small" variant="outlined" />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={tx.paymentMethod.replace(/_/g, ' ')}
                                                    size="small"
                                                    color="primary"
                                                    variant="filled"
                                                    sx={{ textTransform: 'capitalize', fontSize: '0.72rem' }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 500 }}>
                                                {getUserDisplayName(tx.cashier)}
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 600 }}>
                                                {formatCurrency(tx.amount)}
                                            </TableCell>
                                            <TableCell align="center">
                                                {isIncome ? (
                                                    <Chip
                                                        icon={<ArrowUpwardIcon />}
                                                        label="Income"
                                                        size="small"
                                                        sx={{
                                                            bgcolor: 'success.soft',
                                                            color: 'success.main',
                                                            fontWeight: 700,
                                                            border: '1px solid',
                                                            borderColor: 'success.main',
                                                        }}
                                                    />
                                                ) : (
                                                    <Chip
                                                        icon={<ArrowDownwardIcon />}
                                                        label="Expense"
                                                        size="small"
                                                        sx={{
                                                            bgcolor: 'error.soft',
                                                            color: 'error.main',
                                                            fontWeight: 700,
                                                            border: '1px solid',
                                                            borderColor: 'error.main',
                                                        }}
                                                    />
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            No accounting transactions recorded.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* TAB 2: RECEIPT BOOKS */}
            {activeTab === 1 && (
                <TableContainer component={Paper} elevation={1}>
                    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BookmarksIcon color="primary" />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Physical Receipt Books Management
                        </Typography>
                    </Box>
                    <Divider />
                    <Table aria-label="receipt books table">
                        <TableHead sx={{ bgcolor: 'action.hover' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Book Number</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Number Range</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Current Leaf</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Assigned Cashier</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Date Issued</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 700 }}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {receiptBooks.length > 0 ? (
                                receiptBooks.map((book) => (
                                    <TableRow key={book.id} hover>
                                        <TableCell sx={{ fontWeight: 600 }}>{book.bookNumber}</TableCell>
                                        <TableCell>{`${book.startNumber} – ${book.endNumber}`}</TableCell>
                                        <TableCell>{book.currentNumber ?? book.startNumber}</TableCell>
                                        <TableCell sx={{ fontWeight: 500 }}>
                                            {book.assignedTo ? getUserDisplayName(book.assignedTo) : 'Unassigned'}
                                        </TableCell>
                                        <TableCell>{formatDate(book.createdAt)}</TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={book.status}
                                                size="small"
                                                color={getStatusChipColor(book.status)}
                                                sx={{ fontWeight: 600 }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            No physical receipt books registered.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* TAB 3: ACCOUNTS */}
            {activeTab === 2 && (
                <TableContainer component={Paper} elevation={1}>
                    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccountBalanceIcon color="primary" />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Ledger Accounts Directory
                        </Typography>
                    </Box>
                    <Divider />
                    <Table aria-label="accounts table">
                        <TableHead sx={{ bgcolor: 'action.hover' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Account Number</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Date Created</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {accounts.length > 0 ? (
                                accounts.map((account) => (
                                    <TableRow key={account.id} hover>
                                        <TableCell>
                                            <Chip label={account.accountNumber} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                                        </TableCell>
                                        <TableCell>{formatDate(account.createdAt)}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={2} align="center" sx={{ py: 3 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            No general accounts found.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
}