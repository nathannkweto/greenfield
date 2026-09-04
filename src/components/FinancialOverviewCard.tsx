// components/dashboard/FinancialOverviewCard.tsx
import React from 'react';
import { Paper, Box, Typography, Divider, Skeleton, useTheme, useMediaQuery } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

interface FinancialOverviewCardProps {
    collectedFees?: string;
    outstandingFees?: string;
    loading?: boolean;
}

export const FinancialOverviewCard: React.FC<FinancialOverviewCardProps> = ({
                                                                                collectedFees = 'Not available',
                                                                                outstandingFees = 'Not available',
                                                                                loading = false,
                                                                            }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Paper
            variant="outlined"
            sx={{
                p: { xs: 2, md: 3 },
                borderRadius: 3,
                backgroundColor: 'primary.dark',
                color: 'white',
                width: '100%',
                boxSizing: 'border-box',
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <AccountBalanceWalletIcon />
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Financial Overview
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 4 } }}>
                <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                        Collected Fees
                    </Typography>
                    {loading ? (
                        <Skeleton variant="text" width={120} height={40} sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
                    ) : (
                        <Typography variant="h4" sx={{ fontWeight: 800, overflowWrap: 'anywhere' }}>
                            {collectedFees}
                        </Typography>
                    )}
                </Box>

                <Divider
                    orientation={isMobile ? 'horizontal' : 'vertical'}
                    flexItem
                    sx={{ borderColor: 'rgba(255,255,255,0.2)' }}
                />

                <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" sx={{ opacity: 0.8, color: '#ffb7b2' }}>
                        Outstanding
                    </Typography>
                    {loading ? (
                        <Skeleton variant="text" width={120} height={40} sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
                    ) : (
                        <Typography variant="h5" sx={{ fontWeight: 700, overflowWrap: 'anywhere', color: '#ffb7b2' }}>
                            {outstandingFees}
                        </Typography>
                    )}
                </Box>
            </Box>
        </Paper>
    );
};