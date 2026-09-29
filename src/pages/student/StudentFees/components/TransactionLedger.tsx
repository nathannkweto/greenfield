import { Paper, Box, Typography, Stack, Chip, Divider } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import type { LedgerTransaction } from '../types';
import { formatCurrency, formatDateTime } from '../helpers';

interface TransactionLedgerProps {
    transactions: LedgerTransaction[];
    onSelectPayment: (transaction: LedgerTransaction) => void;
}

export function TransactionLedger({ transactions }: TransactionLedgerProps) {
    if (transactions.length === 0) {
        return (
            <Paper variant="outlined" sx={{ p: 5, textAlign: 'center', borderRadius: 3, borderColor: 'divider' }}>
                <Typography color="text.secondary" fontWeight={600}>
                    No records found.
                </Typography>
            </Paper>
        );
    }

    return (
        /* Dedicated Scrollable Ledger Container */
        <Paper
            variant="outlined"
            sx={{
                borderRadius: 3.5,
                borderColor: 'divider',
                maxHeight: '620px',
                overflowY: 'auto',
                position: 'relative',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
            }}
        >
            <Stack divider={<Divider flexItem />}>
                {transactions.map((tx) => {
                    const isPayment = tx.type === 'PAYMENT';

                    return (
                        <Box
                            key={tx.id}
                            sx={{
                                p: { xs: 2, sm: 2.5 },
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: { xs: 'flex-start', sm: 'center' },
                                justifyContent: 'space-between',
                                gap: 2,
                                transition: 'background-color 0.15s ease',
                                '&:hover': {
                                    backgroundColor: 'action.hover',
                                },
                            }}
                        >
                            {/* LEFT: Icon & Details */}
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flexGrow: 1 }}>
                                <Box
                                    sx={{
                                        p: 1.25,
                                        borderRadius: 2.5,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: isPayment ? 'rgba(46, 125, 50, 0.1)' : 'rgba(25, 118, 210, 0.1)',
                                        color: isPayment ? 'success.main' : 'primary.main',
                                    }}
                                >
                                    {isPayment ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                                </Box>

                                <Box sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                        <Typography variant="subtitle2" fontWeight={800} color="text.primary">
                                            {tx.title}
                                        </Typography>

                                        {/* Status Chip for Fee Charges */}
                                        {!isPayment && tx.status && (
                                            <Chip
                                                label={tx.status}
                                                size="small"
                                                color={tx.status === 'PAID' ? 'success' : tx.status === 'PARTIAL' ? 'warning' : 'error'}
                                                variant="filled"
                                                sx={{ fontWeight: 800, height: 20, fontSize: '0.68rem' }}
                                            />
                                        )}
                                    </Box>

                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.25 }}>
                                        {tx.subtitle} • {formatDateTime(tx.date)}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* RIGHT: Amount & Action */}
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: { xs: 'flex-start', sm: 'flex-end' },
                                    flexDirection: 'column',
                                    width: { xs: '100%', sm: 'auto' },
                                    pt: { xs: 1, sm: 0 },
                                    borderTop: { xs: '1px dashed', sm: 'none' },
                                    borderColor: 'divider',
                                }}
                            >
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={900}
                                    color={isPayment ? 'success.main' : 'text.primary'}
                                >
                                    {isPayment ? `- ${formatCurrency(tx.amount)}` : formatCurrency(tx.amount)}
                                </Typography>
                            </Box>
                        </Box>
                    );
                })}
            </Stack>
        </Paper>
    );
}
