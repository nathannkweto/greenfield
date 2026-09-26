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
    Button,
    Snackbar,
    Stack,
} from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentsIcon from '@mui/icons-material/Payments';
import SchoolIcon from '@mui/icons-material/School';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LinkIcon from '@mui/icons-material/Link';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import { GET_FEE_TEMPLATES, GET_REVENUE_ACCOUNTS } from './queries';
import type { Fee, School, Account, GetFeeTemplatesData, GetAccountsData, ToastState } from './types';
import { formatCurrency, formatFrequency } from './helpers';
import { ProgramRow } from './components/ProgramRow';
import { CreateFeeModal } from './components/CreateFeeModal';
import { BulkAssignModal } from './components/BulkAssignModal';
import { DirectAssignModal } from './components/DirectAssignModal';
import { AttachToProgramModal } from './components/AttachToProgramModal';

export default function FeeTemplatesPage() {
    const [activeTab, setActiveTab] = useState(0);

    const { data, loading, error, refetch } = useQuery<GetFeeTemplatesData>(GET_FEE_TEMPLATES);
    const { data: accountsData, loading: loadingAccounts } = useQuery<GetAccountsData>(GET_REVENUE_ACCOUNTS);

    const accounts: Account[] = accountsData?.accounts?.edges?.map((e) => e.node) || [];
    const allFees: Fee[] = data?.fees?.edges?.map((e) => e.node) || [];
    const universalFees = allFees.filter((f) => !f.feeable);
    const schools: School[] = data?.schools?.edges?.map((e) => e.node) || [];

    // Modal Control State
    const [isCreateFeeOpen, setIsCreateFeeOpen] = useState(false);
    const [targetProgramIdForModal, setTargetProgramIdForModal] = useState<string | null>(null);

    const [isBulkAssignOpen, setIsBulkAssignOpen] = useState(false);
    const [isDirectAssignOpen, setIsDirectAssignOpen] = useState(false);
    const [isAttachOpen, setIsAttachOpen] = useState(false);

    const [toast, setToast] = useState<ToastState>({
        open: false,
        message: '',
        severity: 'success',
    });

    const handleSuccess = (message: string) => {
        setToast({ open: true, message, severity: 'success' });
        refetch();
    };

    const handleError = (message: string) => {
        setToast({ open: true, message, severity: 'error' });
    };

    const handleOpenCreateUniversal = () => {
        setTargetProgramIdForModal(null);
        setIsCreateFeeOpen(true);
    };

    const handleOpenCreateForProgram = (programId: string) => {
        setTargetProgramIdForModal(programId);
        setIsCreateFeeOpen(true);
    };

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
                Failed to load fee structures: {error.message}
            </Alert>
        );
    }

    return (
        <Box sx={{ width: '100%', flexGrow: 1 }}>
            {/* TOP HEADER */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                        Fee Packages & Master Templates
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Configure billing items, program templates, and trigger mass student fee assignments.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={1.5}>
                    <Button
                        variant="contained"
                        startIcon={<AddCircleIcon />}
                        onClick={handleOpenCreateUniversal}
                    >
                        Create Fee Template
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<LinkIcon />}
                        onClick={() => setIsAttachOpen(true)}
                    >
                        Link Fee to Program
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<PersonAddIcon />}
                        onClick={() => setIsDirectAssignOpen(true)}
                    >
                        Charge Student
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<GroupAddIcon />}
                        onClick={() => setIsBulkAssignOpen(true)}
                    >
                        Mass Billing
                    </Button>
                </Stack>
            </Box>

            {/* TAB CONTROLS */}
            <Paper sx={{ mb: 3 }}>
                <Tabs
                    value={activeTab}
                    onChange={(_, newValue) => setActiveTab(newValue)}
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab icon={<PaymentsIcon />} iconPosition="start" label="Universal Fees" />
                    <Tab icon={<SchoolIcon />} iconPosition="start" label="Program Specific Fees" />
                </Tabs>
            </Paper>

            {/* TAB 0: UNIVERSAL FEES */}
            {activeTab === 0 && (
                <TableContainer component={Paper} elevation={1}>
                    <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PaymentsIcon color="primary" />
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                Universal Fee Master Catalogue
                            </Typography>
                        </Box>
                        <Button
                            variant="text"
                            startIcon={<AddCircleIcon />}
                            onClick={handleOpenCreateUniversal}
                        >
                            Add Universal Fee
                        </Button>
                    </Box>
                    <Divider />
                    <Table aria-label="universal fees table">
                        <TableHead sx={{ bgcolor: 'action.hover' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Fee Title</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Frequency</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>GL Revenue Account</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>Amount (ZMW)</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>Amount (USD)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {universalFees.length > 0 ? (
                                universalFees.map((fee) => (
                                    <TableRow key={fee.id} hover>
                                        <TableCell sx={{ fontWeight: 600 }}>{fee.title}</TableCell>
                                        <TableCell>
                                            <Chip label={formatFrequency(fee.frequency)} size="small" variant="outlined" />
                                        </TableCell>
                                        <TableCell>
                                            {fee.account ? `${fee.account.accountNumber} - ${fee.account.name}` : '—'}
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 600, color: 'success.main' }}>
                                            {formatCurrency(fee.amountZmw, 'ZMW')}
                                        </TableCell>
                                        <TableCell align="right">
                                            {fee.amountUsd ? formatCurrency(fee.amountUsd, 'USD') : '—'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            No universal fees configured. Click "Add Universal Fee" above to create one.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* TAB 1: PROGRAM SPECIFIC FEES */}
            {activeTab === 1 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {schools.length > 0 ? (
                        schools.map((school) => (
                            <Card key={school.id} variant="outlined" sx={{ borderRadius: 2 }}>
                                <CardHeader
                                    avatar={<AccountBalanceIcon color="primary" />}
                                    title={<Typography variant="h6">{school.name}</Typography>}
                                    subheader={school.description || `${school.programs.length} Academic Programs`}
                                    sx={{ bgcolor: 'action.hover', pb: 1.5 }}
                                />
                                <Divider />
                                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                                    <TableContainer>
                                        <Table aria-label={`programs table for ${school.name}`}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell width={48} />
                                                    <TableCell sx={{ fontWeight: 700 }}>Program Code</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>Program Title</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>Level</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 700 }}>Attached Fees</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {school.programs.length > 0 ? (
                                                    school.programs.map((program) => (
                                                        <ProgramRow
                                                            key={program.id}
                                                            program={program}
                                                            accounts={accounts}
                                                            loadingAccounts={loadingAccounts}
                                                            onOpenCreateModalForProgram={handleOpenCreateForProgram}
                                                            onError={handleError}
                                                        />
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={5} align="center" sx={{ py: 2 }}>
                                                            <Typography variant="body2" color="text.secondary">
                                                                No programs registered under this school department.
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <Typography color="text.secondary">No school faculties or program fee templates found.</Typography>
                        </Paper>
                    )}
                </Box>
            )}

            {/* CREATION MODAL */}
            <CreateFeeModal
                open={isCreateFeeOpen}
                onClose={() => setIsCreateFeeOpen(false)}
                accounts={accounts}
                schools={schools}
                loadingAccounts={loadingAccounts}
                initialProgramId={targetProgramIdForModal}
                onSuccess={handleSuccess}
                onError={handleError}
            />

            {/* OTHER MODALS */}
            <BulkAssignModal
                open={isBulkAssignOpen}
                onClose={() => setIsBulkAssignOpen(false)}
                fees={allFees}
                schools={schools}
                onSuccess={handleSuccess}
                onError={handleError}
            />

            <DirectAssignModal
                open={isDirectAssignOpen}
                onClose={() => setIsDirectAssignOpen(false)}
                fees={allFees}
                onSuccess={handleSuccess}
                onError={handleError}
            />

            <AttachToProgramModal
                open={isAttachOpen}
                onClose={() => setIsAttachOpen(false)}
                universalFees={universalFees}
                schools={schools}
                onSuccess={handleSuccess}
                onError={handleError}
            />

            <Snackbar
                open={toast.open}
                autoHideDuration={5000}
                onClose={() => setToast({ ...toast, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity={toast.severity} onClose={() => setToast({ ...toast, open: false })}>
                    {toast.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}