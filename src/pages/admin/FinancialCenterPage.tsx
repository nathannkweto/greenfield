import React, { useState } from 'react';
import {
    Box, Container, Typography, Paper, Button, Grid, Tabs, Tab,
    List, ListItem, ListItemText, ListItemAvatar, Avatar, Chip, Divider,
    useTheme, useMediaQuery
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import RequestQuoteIcon from '@mui/icons-material/RequestQuote';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ReceiptIcon from '@mui/icons-material/Receipt';
import WarningIcon from '@mui/icons-material/Warning';
import AddCardIcon from '@mui/icons-material/AddCard';

import { FINANCIAL_SUMMARY, MOCK_TRANSACTIONS, MOCK_BALANCES } from '../../data/financialData';

export default function FinancialCenterPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [currentTab, setCurrentTab] = useState(0);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: FINANCIAL_SUMMARY.currency, maximumFractionDigits: 0 }).format(amount);
    };

    return (
        <Box sx={{ backgroundColor: 'background.default', minHeight: '70vh', width: '100%', overflowX: 'hidden', py: { xs: 2, md: 4 } }}>
            <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>

                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, minWidth: 0 }}>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="h4" sx={{ fontWeight: 800, wordBreak: 'break-word' }}>Financial Center</Typography>
                        <Typography variant="subtitle1" color="text.secondary">Monitor revenue, transactions, and student balances.</Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<AddCardIcon />}
                        disableElevation
                        sx={{ borderRadius: 2, whiteSpace: 'nowrap' }}
                    >
                        Record Payment
                    </Button>
                </Box>

                {/* Summary Metrics Cards */}
                <Grid container spacing={2}>
                    {/* FIXED GRID SIZING HERE */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, backgroundColor: 'primary.dark', color: 'white', display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}>
                                <AccountBalanceWalletIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 600 }}>Total Collected (YTD)</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 800 }}>{formatCurrency(FINANCIAL_SUMMARY.totalCollected)}</Typography>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* FIXED GRID SIZING HERE */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2, borderColor: 'error.light' }}>
                            <Avatar sx={{ backgroundColor: 'error.light', color: 'error.dark' }}>
                                <RequestQuoteIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Total Outstanding</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 800, color: 'error.main' }}>{formatCurrency(FINANCIAL_SUMMARY.totalOutstanding)}</Typography>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* FIXED GRID SIZING HERE */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ backgroundColor: 'info.light', color: 'info.dark' }}>
                                <TrendingUpIcon />
                            </Avatar>
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Active Scholarships</Typography>
                                <Typography variant="h5" sx={{ fontWeight: 800 }}>{formatCurrency(FINANCIAL_SUMMARY.activeScholarships)}</Typography>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Main Data Area */}
                <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
                    <Tabs
                        value={currentTab}
                        onChange={(_, v) => setCurrentTab(v)}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: 'background.paper' }}
                    >
                        <Tab label="Recent Transactions" />
                        <Tab label="Pending Balances" />
                    </Tabs>

                    {/* TRANSACTIONS TAB */}
                    {currentTab === 0 && (
                        <List disablePadding>
                            {MOCK_TRANSACTIONS.map((txn, idx) => (
                                <React.Fragment key={txn.id}>
                                    <ListItem sx={{ py: 2, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: 2 }}>
                                        <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                                            <ListItemAvatar>
                                                <Avatar sx={{ backgroundColor: txn.status === 'Completed' ? 'success.light' : 'error.light', color: txn.status === 'Completed' ? 'success.dark' : 'error.dark' }}>
                                                    <ReceiptIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={<Typography sx={{ fontWeight: 600 }}>{txn.studentName}</Typography>}
                                                secondary={`${txn.studentId} • ${txn.date} • ${txn.method}`}
                                            />
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: isMobile ? '100%' : 'auto', justifyContent: isMobile ? 'flex-end' : 'flex-end' }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                                                {formatCurrency(txn.amount)}
                                            </Typography>
                                            <Chip
                                                label={txn.status}
                                                size="small"
                                                color={txn.status === 'Completed' ? 'success' : 'error'}
                                                variant="outlined"
                                            />
                                        </Box>
                                    </ListItem>
                                    {idx < MOCK_TRANSACTIONS.length - 1 && <Divider component="li" />}
                                </React.Fragment>
                            ))}
                        </List>
                    )}

                    {/* PENDING BALANCES TAB */}
                    {currentTab === 1 && (
                        <List disablePadding>
                            {MOCK_BALANCES.map((balance, idx) => (
                                <React.Fragment key={balance.studentId}>
                                    <ListItem sx={{ py: 2, flexDirection: isMobile ? 'column' : 'row', alignItems: isMobile ? 'flex-start' : 'center', gap: 2 }}>
                                        <Box sx={{ display: 'flex', width: '100%', alignItems: 'center' }}>
                                            <ListItemAvatar>
                                                <Avatar sx={{ backgroundColor: 'warning.light', color: 'warning.dark' }}>
                                                    <WarningIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={<Typography sx={{ fontWeight: 600 }}>{balance.studentName}</Typography>}
                                                secondary={`${balance.studentId} • ${balance.program}`}
                                            />
                                        </Box>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: isMobile ? 'flex-end' : 'flex-end', width: isMobile ? '100%' : 'auto', gap: 0.5 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: 'error.main', whiteSpace: 'nowrap' }}>
                                                {formatCurrency(balance.amountDue)}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Due: {balance.dueDate}
                                            </Typography>
                                        </Box>
                                    </ListItem>
                                    {idx < MOCK_BALANCES.length - 1 && <Divider component="li" />}
                                </React.Fragment>
                            ))}
                        </List>
                    )}
                </Paper>
            </Container>
        </Box>
    );
}