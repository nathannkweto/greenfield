import { Paper, Box, Typography, Stack, Chip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import type { FeeSummary } from '../types';
import { formatCurrency } from '../helpers';

interface FeeBalanceCardProps {
    feeSummary: FeeSummary;
    onPayClick?: () => void;
}

export function FeeBalanceCard({ feeSummary }: FeeBalanceCardProps) {
    const isPaidInFull = feeSummary.outstandingZmw <= 0;

    return (
        <Paper
            variant="outlined"
            sx={{
                p: 3,
                borderRadius: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderColor: isPaidInFull ? 'success.light' : 'warning.light',
                backgroundColor: isPaidInFull ? 'rgba(46, 125, 50, 0.02)' : 'rgba(237, 108, 2, 0.02)',
            }}
        >
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={700}
                        sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
                    >
                        Fee Status
                    </Typography>
                    <Chip
                        icon={isPaidInFull ? <CheckCircleIcon /> : undefined}
                        label={isPaidInFull ? 'Paid in Full' : 'Outstanding Balance'}
                        size="small"
                        color={isPaidInFull ? 'success' : 'warning'}
                        sx={{ fontWeight: 700 }}
                    />
                </Box>

                <Typography
                    variant="h4"
                    fontWeight={900}
                    color={isPaidInFull ? 'success.main' : 'warning.dark'}
                    sx={{ my: 1 }}
                >
                    {formatCurrency(feeSummary.outstandingZmw)}
                </Typography>

                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                    <Box>
                        <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>
                            Total Billed
                        </Typography>
                        <Typography variant="body2" fontWeight={700}>
                            {formatCurrency(feeSummary.totalBilledZmw)}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>
                            Total Paid
                        </Typography>
                        <Typography variant="body2" fontWeight={700} color="success.main">
                            {formatCurrency(feeSummary.totalPaidZmw)}
                        </Typography>
                    </Box>
                </Stack>
            </Box>
        </Paper>
    );
}
