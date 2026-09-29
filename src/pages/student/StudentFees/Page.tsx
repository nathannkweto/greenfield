import { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { Container, Box, Typography, CircularProgress, Alert, Paper, Stack } from '@mui/material';

import { GET_STUDENT_FEES_DATA } from './queries';
import type {GetStudentFeesResponse, LedgerTransaction} from './types';
import { calculateFinancialSummary, buildChronologicalLedger } from './helpers';

import { FeeSummaryCards } from './components/FeeSummaryCards';
import { LedgerFilters } from './components/LedgerFilters';
import { TransactionLedger } from './components/TransactionLedger';
import { PaymentReceiptModal } from './components/PaymentReceiptModal';

export default function StudentFeesPage() {
    const [activeTab, setActiveTab] = useState<'ALL' | 'CHARGES' | 'PAYMENTS'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedReceiptTx, setSelectedReceiptTx] = useState<LedgerTransaction | null>(null);

    const { data, loading, error } = useQuery<GetStudentFeesResponse>(GET_STUDENT_FEES_DATA);

    const student = data?.me?.students?.[0];
    const studentFees = student?.studentFees || [];

    const summary = useMemo(() => calculateFinancialSummary(studentFees), [studentFees]);
    const allLedgerItems = useMemo(() => buildChronologicalLedger(studentFees), [studentFees]);

    // Filter & Search Logic
    const filteredTransactions = useMemo(() => {
        return allLedgerItems.filter((tx) => {
            // Type Filter
            if (activeTab === 'CHARGES' && tx.type !== 'CHARGE') return false;
            if (activeTab === 'PAYMENTS' && tx.type !== 'PAYMENT') return false;

            // Text Search Filter
            if (searchQuery.trim() !== '') {
                const query = searchQuery.toLowerCase();
                const matchTitle = tx.title.toLowerCase().includes(query);
                const matchSub = tx.subtitle?.toLowerCase().includes(query);
                const matchRef = tx.reference?.toLowerCase().includes(query);
                return matchTitle || matchSub || matchRef;
            }

            return true;
        });
    }, [allLedgerItems, activeTab, searchQuery]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !student) {
        return (
            <Container maxWidth="xl" sx={{ py: 6 }}>
                <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderColor: 'error.main' }}>
                    <Alert severity="error">
                        {error ? `Failed to load financial data: ${error.message}` : 'No active student record found.'}
                    </Alert>
                </Paper>
            </Container>
        );
    }

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '85vh', py: { xs: 3, md: 5 } }}>
            <Container maxWidth="xl">
                <Stack spacing={3.5}>

                    {/* PAGE HEADER */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                        <Box>
                            <Typography variant="h4" fontWeight={900}>
                                Student Statement & Fees
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Track billed tuition, administrative charges, and payment histories.
                            </Typography>
                        </Box>

                        {/* {summary.outstandingZmw > 0 && (
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddCardIcon />}
                                onClick={() => handleOpenPayModal()}
                                disableElevation
                                sx={{ borderRadius: 2.5, fontWeight: 700, px: 3, py: 1.25, textTransform: 'none' }}
                            >
                                Make Payment
                            </Button>
                        )} */}
                    </Box>

                    {/* FINANCIAL SUMMARY METRICS */}
                    <FeeSummaryCards summary={summary} />

                    {/* CHRONOLOGICAL STATEMENT / LEDGER SECTION */}
                    <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 4, borderColor: 'divider' }}>
                        <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}>
                            Transaction History
                        </Typography>

                        <LedgerFilters
                            currentTab={activeTab}
                            onTabChange={setActiveTab}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                        />

                        <Box sx={{ mt: 2.5 }}>
                            <TransactionLedger
                                transactions={filteredTransactions}
                                onSelectPayment={(tx) => setSelectedReceiptTx(tx)}
                            />
                        </Box>
                    </Paper>

                </Stack>
            </Container>

            {/* RECEIPT MODAL */}
            {selectedReceiptTx && (
                <PaymentReceiptModal
                    open={Boolean(selectedReceiptTx)}
                    transaction={selectedReceiptTx}
                    student={student}
                    onClose={() => setSelectedReceiptTx(null)}
                />
            )}
        </Box>
    );
}