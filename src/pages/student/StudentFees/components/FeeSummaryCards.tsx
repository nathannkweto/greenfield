import { Grid, Paper, Box, Typography, LinearProgress, Chip } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';

import type {FinancialSummary} from '../types';
import { formatCurrency } from '../helpers';

interface FeeSummaryCardsProps {
    summary: FinancialSummary;
}

export function FeeSummaryCards({ summary }: FeeSummaryCardsProps) {
    const isFullyPaid = summary.outstandingZmw <= 0;

    return (
        <Grid container spacing={2.5}>
            {/* OUTSTANDING BALANCE CARD */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper
                    variant="outlined"
                    sx={{
                        p: 3,
                        borderRadius: 3.5,
                        bgcolor: isFullyPaid ? 'rgba(46, 125, 50, 0.03)' : 'rgba(211, 47, 47, 0.03)',
                        borderColor: isFullyPaid ? 'success.light' : 'error.light',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}
                >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                            Outstanding Balance
                        </Typography>
                        <Chip
                            icon={isFullyPaid ? <CheckCircleIcon /> : <PendingActionsIcon />}
                            label={isFullyPaid ? 'Settled' : 'Action Required'}
                            color={isFullyPaid ? 'success' : 'error'}
                            size="small"
                            sx={{ fontWeight: 700 }}
                        />
                    </Box>
                    <Typography variant="h4" fontWeight={900} color={isFullyPaid ? 'success.main' : 'error.main'} sx={{ my: 0.5 }}>
                        {formatCurrency(summary.outstandingZmw)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        {isFullyPaid ? 'All current term fees cleared.' : 'Due prior to end of term.'}
                    </Typography>
                </Paper>
            </Grid>

            {/* TOTAL PAID CARD */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 3.5, height: '100%', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                            Total Paid
                        </Typography>
                        <AccountBalanceWalletIcon color="success" fontSize="small" />
                    </Box>
                    <Typography variant="h4" fontWeight={900} color="text.primary" sx={{ my: 0.5 }}>
                        {formatCurrency(summary.totalPaidZmw)}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>Payment Coverage</Typography>
                            <Typography variant="caption" color="success.main" fontWeight={700}>{summary.paymentPercentage}%</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={summary.paymentPercentage} color="success" sx={{ height: 6, borderRadius: 3 }} />
                    </Box>
                </Paper>
            </Grid>

            {/* TOTAL BILLED CARD */}
            <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 3.5, height: '100%', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                            Total Billed Fees
                        </Typography>
                        <ReceiptLongIcon color="action" fontSize="small" />
                    </Box>
                    <Typography variant="h4" fontWeight={900} color="text.primary" sx={{ my: 0.5 }}>
                        {formatCurrency(summary.totalBilledZmw)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        Accumulated invoice total for registered academic sessions.
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    );
}