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
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Stack,
    Tooltip,
} from '@mui/material';
import ReceiptIcon from '@mui/icons-material/Receipt';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import EditIcon from '@mui/icons-material/Edit';

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

interface AccountSummary {
    id: string;
    accountNumber: string;
    name: string;
    type: string;
}

interface TransactionNode {
    id: string;
    amount: number;
    referenceNumber: string;
    gatewayReference?: string;
    paymentMethod: string;
    manualReceiptNumber?: string;
    createdAt: string;
    debitAccount: AccountSummary;
    creditAccount: AccountSummary;
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
    name: string;
    type: string;
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

const getAccountTypeChipColor = (type: string) => {
    switch (type?.toLowerCase()) {
        case 'asset':
            return 'primary';
        case 'liability':
            return 'warning';
        case 'equity':
            return 'secondary';
        case 'revenue':
            return 'success';
        case 'expense':
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

    // Receipt Book Creation State
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createForm, setCreateForm] = useState({
        bookNumber: '',
        startNumber: '',
        endNumber: '',
        currentNumber: '',
        assignedToUserId: '',
    });

    // Receipt Book Edit Status State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState<ReceiptBookNode | null>(null);
    const [editStatus, setEditStatus] = useState<ReceiptBookNode['status']>('ACTIVE');

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

    const rawTransactions = data?.transactions?.edges?.map((e) => e.node) || [];
    const receiptBooks = data?.receiptBooks?.edges?.map((e) => e.node) || [];
    const accounts = data?.accounts?.edges?.map((e) => e.node) || [];

    const transactions = [...rawTransactions].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const handleOpenEditModal = (book: ReceiptBookNode) => {
        setSelectedBook(book);
        setEditStatus(book.status);
        setIsEditModalOpen(true);
    };

    const handleCreateSubmit = () => {
        // API omitted for now as requested
        console.log('Create Receipt Book payload:', {
            book_number: createForm.bookNumber,
            start_number: Number(createForm.startNumber),
            end_number: Number(createForm.endNumber),
            current_number: createForm.currentNumber ? Number(createForm.currentNumber) : null,
            assigned_to_user_id: createForm.assignedToUserId,
            status: 'ACTIVE',
        });

        setIsCreateModalOpen(false);
        setCreateForm({
            bookNumber: '',
            startNumber: '',
            endNumber: '',
            currentNumber: '',
            assignedToUserId: '',
        });
    };

    const handleEditSubmit = () => {
        // API omitted for now as requested
        console.log('Edit Receipt Book status payload:', {
            id: selectedBook?.id,
            status: editStatus,
        });

        setIsEditModalOpen(false);
        setSelectedBook(null);
    };

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
                    <Tab icon={<AccountBalanceIcon />} iconPosition="start" label="Accounts Directory" />
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
                        <TableHead sx={{ backgroundColor: 'action.hover' }}>
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
                                        tx.debitAccount?.accountNumber?.startsWith('1') ||
                                        tx.creditAccount?.accountNumber?.startsWith('4');

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
                                                {tx.debitAccount?.name && (
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                        {tx.debitAccount.name}
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Chip label={tx.creditAccount?.accountNumber || 'N/A'} size="small" variant="outlined" />
                                                {tx.creditAccount?.name && (
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                        {tx.creditAccount.name}
                                                    </Typography>
                                                )}
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
                                                            backgroundColor: 'success.soft',
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
                                                            backgroundColor: 'error.soft',
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
                    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <BookmarksIcon color="primary" />
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Physical Receipt Books Management
                            </Typography>
                        </Box>
                        {/* <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setIsCreateModalOpen(true)}
                        >
                            Issue Receipt Book
                        </Button> */}
                    </Box>
                    <Divider />
                    <Table aria-label="receipt books table">
                        <TableHead sx={{ backgroundColor: 'action.hover' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Book Number</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Number Range</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Current Leaf</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Assigned Cashier</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Date Issued</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 700 }}>Status</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
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
                                        <TableCell align="center">
                                            <Tooltip title="Update Status">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => handleOpenEditModal(book)}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
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

            {/* TAB 3: ACCOUNTS DIRECTORY */}
            {activeTab === 2 && (
                <TableContainer component={Paper} elevation={1}>
                    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccountBalanceIcon color="primary" />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Chart of Accounts Directory
                        </Typography>
                    </Box>
                    <Divider />
                    <Table aria-label="accounts table">
                        <TableHead sx={{ backgroundColor: 'action.hover' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Account Number</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Account Name</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Account Type</TableCell>
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
                                        <TableCell sx={{ fontWeight: 600 }}>
                                            {account.name}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={account.type}
                                                size="small"
                                                color={getAccountTypeChipColor(account.type)}
                                                sx={{ textTransform: 'uppercase', fontWeight: 700, fontSize: '0.7rem' }}
                                            />
                                        </TableCell>
                                        <TableCell>{formatDate(account.createdAt)}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
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

            {/* CREATE RECEIPT BOOK MODAL */}
            <Dialog open={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>Issue New Receipt Book</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2.5} sx={{ mt: 0.5 }}>
                        <TextField
                            label="Book Number"
                            fullWidth
                            required
                            placeholder="e.g. RB-2026-001"
                            value={createForm.bookNumber}
                            onChange={(e) => setCreateForm({ ...createForm, bookNumber: e.target.value })}
                        />
                        <Stack direction="row" spacing={2}>
                            <TextField
                                label="Start Number"
                                type="number"
                                fullWidth
                                required
                                placeholder="e.g. 1001"
                                value={createForm.startNumber}
                                onChange={(e) => setCreateForm({ ...createForm, startNumber: e.target.value })}
                            />
                            <TextField
                                label="End Number"
                                type="number"
                                fullWidth
                                required
                                placeholder="e.g. 1050"
                                value={createForm.endNumber}
                                onChange={(e) => setCreateForm({ ...createForm, endNumber: e.target.value })}
                            />
                        </Stack>
                        <TextField
                            label="Current Leaf Number (Optional)"
                            type="number"
                            fullWidth
                            helperText="Defaults to Start Number if left blank"
                            placeholder="e.g. 1001"
                            value={createForm.currentNumber}
                            onChange={(e) => setCreateForm({ ...createForm, currentNumber: e.target.value })}
                        />
                        <TextField
                            label="Assigned User ID"
                            fullWidth
                            required
                            placeholder="Enter Assigned User ID"
                            value={createForm.assignedToUserId}
                            onChange={(e) => setCreateForm({ ...createForm, assignedToUserId: e.target.value })}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsCreateModalOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreateSubmit}>
                        Issue Receipt Book
                    </Button>
                </DialogActions>
            </Dialog>

            {/* EDIT RECEIPT BOOK STATUS MODAL */}
            <Dialog open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>Update Receipt Book Status</DialogTitle>
                <DialogContent dividers>
                    {selectedBook && (
                        <Stack spacing={2} sx={{ mt: 0.5 }}>
                            <Typography variant="body2" color="text.secondary">
                                Modifying status for Book <strong>{selectedBook.bookNumber}</strong>
                            </Typography>
                            <TextField
                                select
                                label="Status"
                                fullWidth
                                value={editStatus}
                                onChange={(e) => setEditStatus(e.target.value as ReceiptBookNode['status'])}
                            >
                                <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                                <MenuItem value="COMPLETED">COMPLETED</MenuItem>
                                <MenuItem value="LOST">LOST</MenuItem>
                                <MenuItem value="CANCELLED">CANCELLED</MenuItem>
                            </TextField>
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                    <Button variant="contained" color="primary" onClick={handleEditSubmit}>
                        Save Status
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}