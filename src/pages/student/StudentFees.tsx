import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Paper,
    Tabs,
    Tab,
    Button,
    Stack,
    Chip,
    useMediaQuery,
    useTheme,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ReceiptIcon from '@mui/icons-material/Receipt';
import HistoryIcon from '@mui/icons-material/History';
import PaymentIcon from '@mui/icons-material/Payment';

// Import the external data
import { FEES_DATA } from '../../data/feesData';

function CustomTabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ py: { xs: 2, md: 3 }, width: '100%', boxSizing: 'border-box' }}>{children}</Box>}
        </div>
    );
}

export default function StudentFees() {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [tabValue, setTabValue] = useState(0);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);

    const handlePaymentClick = () => setPaymentModalOpen(true);
    const handleCloseModal = () => setPaymentModalOpen(false);

    return (
        <Box sx={{ backgroundColor: 'background.default', minHeight: '70vh', width: '100%', overflowX: 'hidden', py: { xs: 2, md: 4 } }}>
            <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 3 } }}>

                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/student')}
                    sx={{ mb: 2, textTransform: 'none', color: 'text.secondary' }}
                >
                    Dashboard
                </Button>

                {/* Hero Card: Total Balance */}
                <Paper
                    variant="outlined"
                    sx={{
                        p: { xs: 3, md: 4 },
                        borderRadius: 4,
                        mb: 3,
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        width: '100%',
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: 2
                    }}
                >
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="subtitle1" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 600 }}>
                            Total Balance Due
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 800, overflowWrap: 'anywhere' }}>
                            {FEES_DATA.totalDue.toLocaleString()} <Typography component="span" variant="h5" sx={{ opacity: 0.8 }}>{FEES_DATA.currency}</Typography>
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        color="inherit"
                        size={isMobile ? "medium" : "large"}
                        startIcon={<PaymentIcon />}
                        onClick={handlePaymentClick}
                        sx={{
                            color: 'primary.main',
                            fontWeight: 700,
                            borderRadius: 2,
                            alignSelf: { xs: 'stretch', sm: 'auto' },
                            flexShrink: 0
                        }}
                    >
                        Pay Now
                    </Button>
                </Paper>

                <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
                    <Tabs
                        value={tabValue}
                        onChange={(_e, val) => setTabValue(val)}
                        variant="fullWidth"
                        sx={{
                            borderBottom: 1, borderColor: 'divider', width: '100%',
                            '& .MuiTab-root': { minWidth: 'auto', fontSize: { xs: '0.85rem', md: '1rem' }, py: 2 }
                        }}
                    >
                        <Tab label="Pending Fees" icon={<ReceiptIcon />} iconPosition={isMobile ? "top" : "start"} />
                        <Tab label="Payment History" icon={<HistoryIcon />} iconPosition={isMobile ? "top" : "start"} />
                    </Tabs>

                    <Box sx={{ px: { xs: 2, md: 4 }, width: '100%', boxSizing: 'border-box' }}>

                        <CustomTabPanel value={tabValue} index={0}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Breakdown</Typography>
                            <Stack spacing={2}>
                                {FEES_DATA.pendingFees.map((fee) => (
                                    <Box
                                        key={fee.id}
                                        sx={{
                                            p: 2,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            borderRadius: 2,
                                            display: 'flex',
                                            flexDirection: { xs: 'column', sm: 'row' },
                                            justifyContent: 'space-between',
                                            alignItems: { xs: 'flex-start', sm: 'center' },
                                            gap: 1.5
                                        }}
                                    >
                                        <Box sx={{ minWidth: 0, display: 'flex', gap: 2, alignItems: 'center' }}>
                                            <Box sx={{ display: { xs: 'none', sm: 'flex' }, p: 1, backgroundColor: 'action.hover', borderRadius: 2 }}>
                                                <AccountBalanceWalletIcon color="primary" />
                                            </Box>
                                            <Box sx={{ minWidth: 0 }}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600, overflowWrap: 'anywhere' }}>
                                                    {fee.title}
                                                </Typography>
                                                <Stack direction="row" spacing={1} sx={{ mt: 0.5, alignItems: 'center' }}>
                                                    <Chip label={fee.type} size="small" variant="outlined" />
                                                    <Typography variant="caption" color="error.main" sx={{ fontWeight: 600 }}>
                                                        Due: {fee.dueDate}
                                                    </Typography>
                                                </Stack>
                                            </Box>
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 700, flexShrink: 0, alignSelf: { xs: 'flex-end', sm: 'center' } }}>
                                            {fee.amount.toLocaleString()} {FEES_DATA.currency}
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </CustomTabPanel>

                        <CustomTabPanel value={tabValue} index={1}>
                            <Stack spacing={2}>
                                {FEES_DATA.history.map((record) => (
                                    <Box
                                        key={record.id}
                                        sx={{
                                            p: 2,
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            borderRadius: 2,
                                            display: 'flex',
                                            flexDirection: { xs: 'column', sm: 'row' },
                                            justifyContent: 'space-between',
                                            alignItems: { xs: 'flex-start', sm: 'center' },
                                            gap: 1.5,
                                            backgroundColor: 'action.hover'
                                        }}
                                    >
                                        <Box sx={{ minWidth: 0 }}>
                                            <Stack direction="row" spacing={1} sx={{ mb: 0.5, alignItems: 'center' }}>
                                                <Chip label={record.status} size="small" color="success" />
                                                <Typography variant="caption" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>
                                                    Receipt: {record.receipt}
                                                </Typography>
                                            </Stack>
                                            <Typography variant="body2" sx={{ fontWeight: 600, overflowWrap: 'anywhere' }}>
                                                Paid via {record.method} on {record.date}
                                            </Typography>
                                        </Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, flexShrink: 0, alignSelf: { xs: 'flex-end', sm: 'center' }, color: 'success.main' }}>
                                            - {record.amount.toLocaleString()} {FEES_DATA.currency}
                                        </Typography>
                                    </Box>
                                ))}
                            </Stack>
                        </CustomTabPanel>

                    </Box>
                </Paper>
            </Container>

            <Dialog
                open={paymentModalOpen}
                onClose={handleCloseModal}
                slotProps={{ paper: { sx: { borderRadius: 3, width: '100%', maxWidth: '400px', m: 2 } } }}
            >
                <DialogTitle sx={{ fontWeight: 800 }}>Confirm Payment</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        You are about to process a payment for your outstanding balance.
                    </DialogContentText>
                    <Box sx={{ p: 2, backgroundColor: 'action.hover', borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography sx={{ fontWeight: 600 }}>Amount:</Typography>
                        <Typography sx={{ fontWeight: 800 }}>{FEES_DATA.totalDue.toLocaleString()} {FEES_DATA.currency}</Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: { xs: 2, md: 3 }, pt: 0 }}>
                    <Button onClick={handleCloseModal} color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>Cancel</Button>
                    <Button onClick={handleCloseModal} variant="contained" disableElevation sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}>
                        Proceed to Gateway
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}