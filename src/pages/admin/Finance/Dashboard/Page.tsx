import React, { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    Alert,
    Skeleton,
    Stack,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

import { GET_FINANCE_DASHBOARD } from './queries';

interface TransactionNode {
    id: string;
    amount: number;
    referenceNumber: string;
    gatewayReference?: string | null;
    manualReceiptNumber?: string | null;
    paymentMethod: string;
    createdAt: string;
    debitAccount: { id: string; accountNumber: string };
    creditAccount: { id: string; accountNumber: string };
    cashier?: { id: string; firstName: string; lastName: string } | null;
}

interface FinanceDashboardData {
    schoolAccount: { edges: Array<{ node: { id: string; accountNumber: string } }> };
    transactions: { edges: Array<{ node: TransactionNode }> };
    studentFees: { edges: Array<{ node: { id: string; amountZmw: number } }> };
    feePayments: { edges: Array<{ node: { id: string; amount: number } }> };
}

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-ZM', { style: 'currency', currency: 'ZMW' }).format(amount);

export default function FinanceDashboard() {
    const { data, loading, error } = useQuery<FinanceDashboardData>(GET_FINANCE_DASHBOARD, {
        fetchPolicy: 'network-only',
    });

    const schoolAccountId = data?.schoolAccount?.edges[0]?.node?.id;

    // Calculate Fee Aggregations
    const projectedFees = useMemo(() => {
        return data?.studentFees?.edges?.reduce((acc, edge) => acc + (edge.node.amountZmw || 0), 0) ?? 0;
    }, [data?.studentFees]);

    const collectedFees = useMemo(() => {
        return data?.feePayments?.edges?.reduce((acc, edge) => acc + (edge.node.amount || 0), 0) ?? 0;
    }, [data?.feePayments]);

    const outstandingFees = Math.max(0, projectedFees - collectedFees);

    // Calculate School Account Income vs Expenses from Transactions
    const { totalIncome, totalExpenses } = useMemo(() => {
        let income = 0;
        let expenses = 0;

        data?.transactions?.edges?.forEach(({ node }) => {
            // If school account is credited -> Money came in (Income)
            if (schoolAccountId && node.creditAccount.id === schoolAccountId) {
                income += node.amount;
            }
            // If school account is debited -> Money went out (Expense)
            else if (schoolAccountId && node.debitAccount.id === schoolAccountId) {
                expenses += node.amount;
            }
        });

        return { totalIncome: income, totalExpenses: expenses };
    }, [data?.transactions, schoolAccountId]);

    const accountBalance = totalIncome - totalExpenses;

    return (
        <Box sx={{ backgroundColor: 'background.default', flexGrow: 1, py: { xs: 3, md: 4 } }}>
            <Container maxWidth="xl" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>

                {/* Header */}
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                        Financial Overview
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Monitor overall revenue projections, account ledgers, and transaction entries.
                    </Typography>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ borderRadius: 2 }}>
                        Failed to load financial records: {error.message}
                    </Alert>
                )}

                {/* Section 1: Fee Summaries */}
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                        Fees Summary
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <MetricCard
                                title="Projected Fees"
                                value={formatCurrency(projectedFees)}
                                subtitle="Total billed student fees"
                                icon={<RequestQuoteIcon color="primary" />}
                                loading={loading}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <MetricCard
                                title="Collected Fees"
                                value={formatCurrency(collectedFees)}
                                subtitle="Total received payments"
                                icon={<PriceCheckIcon color="success" />}
                                loading={loading}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <MetricCard
                                title="Outstanding Fees"
                                value={formatCurrency(outstandingFees)}
                                subtitle="Remaining unpaid balance"
                                icon={<PendingActionsIcon color="warning" />}
                                loading={loading}
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* Section 2: Account Summaries */}
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                        School Ledger
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <MetricCard
                                title="Account Balance"
                                value={formatCurrency(accountBalance)}
                                subtitle={`Ledger #${data?.schoolAccount?.edges[0]?.node?.accountNumber || 'N/A'}`}
                                icon={<AccountBalanceWalletIcon color="info" />}
                                loading={loading}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <MetricCard
                                title="Total Income"
                                value={formatCurrency(totalIncome)}
                                subtitle="Inflow transactions"
                                icon={<TrendingUpIcon color="success" />}
                                loading={loading}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <MetricCard
                                title="Total Expenses"
                                value={formatCurrency(totalExpenses)}
                                subtitle="Outflow transactions"
                                icon={<TrendingDownIcon color="error" />}
                                loading={loading}
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* Section 3: Recent Transactions Table */}
                <Box>
                    <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Recent Transactions
                        </Typography>
                    </Stack>

                    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                        <Table>
                            <TableHead sx={{ backgroundColor: 'action.hover' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 700 }}>Reference</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Method</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Manual Receipt</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Cashier</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 700 }}>Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton variant="text" width={100} /></TableCell>
                                            <TableCell><Skeleton variant="text" width={80} /></TableCell>
                                            <TableCell><Skeleton variant="text" width={80} /></TableCell>
                                            <TableCell><Skeleton variant="text" width={100} /></TableCell>
                                            <TableCell><Skeleton variant="text" width={120} /></TableCell>
                                            <TableCell align="right"><Skeleton variant="text" width={80} /></TableCell>
                                        </TableRow>
                                    ))
                                ) : data?.transactions?.edges?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                            <Typography color="text.secondary">No recent transactions recorded.</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    data?.transactions?.edges?.map(({ node }) => (
                                        <TableRow key={node.id} hover>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                    {node.referenceNumber}
                                                </Typography>
                                                {node.gatewayReference && (
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                        Ext: {node.gatewayReference}
                                                    </Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={node.paymentMethod.replace('_', ' ').toUpperCase()}
                                                    size="small"
                                                    variant="outlined"
                                                    sx={{ fontWeight: 600 }}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {node.manualReceiptNumber ? (
                                                    <Chip
                                                        icon={<ReceiptLongIcon fontSize="small" />}
                                                        label={node.manualReceiptNumber}
                                                        size="small"
                                                        color="primary"
                                                        variant="outlined"
                                                    />
                                                ) : (
                                                    '—'
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {node.cashier ? `${node.cashier.firstName} ${node.cashier.lastName}` : 'System / Auto'}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(node.createdAt).toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                    {formatCurrency(node.amount)}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>

            </Container>
        </Box>
    );
}

interface MetricCardProps {
    title: string;
    value: string;
    subtitle: string;
    icon: React.ReactNode;
    loading: boolean;
}

function MetricCard({ title, value, subtitle, icon, loading }: MetricCardProps) {
    return (
        <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={2} sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                            {title}
                        </Typography>
                        {loading ? (
                            <Skeleton variant="text" width={140} height={40} />
                        ) : (
                            <Typography variant="h5" sx={{ fontWeight: 800, my: 0.5 }}>
                                {value}
                            </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary">
                            {subtitle}
                        </Typography>
                    </Box>
                    <Box sx={{ p: 1.25, borderRadius: 2, backgroundColor: 'action.hover' }}>
                        {icon}
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}