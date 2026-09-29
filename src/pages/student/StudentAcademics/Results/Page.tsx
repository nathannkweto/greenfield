import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import {
    Box,
    Typography,
    CircularProgress,
    Alert,
    Tabs,
    Tab,
    Paper,
    Button,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import AssessmentIcon from '@mui/icons-material/Assessment';

import { GET_STUDENT_RESULTS } from './queries.ts';
import type {GetStudentResultsResponse} from './types.ts';
import { processStudentResults } from './helpers.ts';
import { ResultsSummaryCards } from './components/ResultsSummaryCards.tsx';
import { YearResultsTable } from './components/YearResultsTable.tsx';

export default function StudentResultsPage() {
    const { data, loading, error } = useQuery<GetStudentResultsResponse>(GET_STUDENT_RESULTS);
    const [selectedTab, setSelectedTab] = useState<number>(0);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ my: 3, borderRadius: 2 }}>
                Failed to fetch academic results. Error: {error.message}
            </Alert>
        );
    }

    const student = data?.me?.students?.[0];

    if (!student) {
        return (
            <Alert severity="warning" sx={{ my: 3, borderRadius: 2 }}>
                No active student record found under your account.
            </Alert>
        );
    }

    const yearlyResults = processStudentResults(student);

    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* Header Banner */}
            <Box
                sx={{
                    mb: 3,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 2,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <AssessmentIcon color="primary" sx={{ fontSize: 36 }} />
                    <Box>
                        <Typography variant="h4" fontWeight={900}>
                            Academic Results
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Official record of enrolled courses, grades, and continuous assessments
                        </Typography>
                    </Box>
                </Box>

                <Button
                    variant="outlined"
                    startIcon={<PrintIcon />}
                    onClick={() => window.print()}
                    sx={{ borderRadius: 2, fontWeight: 700 }}
                >
                    Print Transcript
                </Button>
            </Box>

            {/* KPI Header Cards */}
            <ResultsSummaryCards student={student} />

            {/* Filter Tabs by Year */}
            <Paper variant="outlined" sx={{ borderRadius: 3, mb: 3 }}>
                <Tabs
                    value={selectedTab}
                    onChange={(_, newValue) => setSelectedTab(newValue)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab label="All Years" sx={{ fontWeight: 700 }} />
                    {yearlyResults.map((yr) => (
                        <Tab
                            key={yr.year}
                            label={`Year ${yr.year}${yr.isCurrentYear ? ' (Current)' : ''}`}
                            sx={{ fontWeight: 700 }}
                        />
                    ))}
                </Tabs>
            </Paper>

            {/* Results Tables per Academic Year */}
            {selectedTab === 0 ? (
                yearlyResults.map((yr) => (
                    <YearResultsTable key={yr.year} yearlyResult={yr} />
                ))
            ) : (
                <YearResultsTable yearlyResult={yearlyResults[selectedTab - 1]} />
            )}
        </Box>
    );
}