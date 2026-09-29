import { useQuery } from '@apollo/client/react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';

import { GET_ACADEMIC_HISTORY } from './queries';
import type {GetAcademicHistoryResponse} from './types';
import { processAcademicHistory } from './helpers';
import { AcademicYearAccordion } from './components/AcademicYearAccordion';

export default function AcademicHistoryPage() {
    const { data, loading, error } = useQuery<GetAcademicHistoryResponse>(GET_ACADEMIC_HISTORY);

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
                Failed to fetch academic history records. Error: {error.message}
            </Alert>
        );
    }

    const student = data?.me?.students?.[0];

    if (!student) {
        return (
            <Alert severity="warning" sx={{ my: 3, borderRadius: 2 }}>
                No active student record found.
            </Alert>
        );
    }

    const yearlyRecords = processAcademicHistory(student);

    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* Title Header */}
            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <HistoryEduIcon color="primary" sx={{ fontSize: 36 }} />
                <Box>
                    <Typography variant="h4" fontWeight={900}>
                        Academic History
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Chronological log of years spent at the college and enrolled courses per academic period
                    </Typography>
                </Box>
            </Box>

            {/* Year-by-Year Collapsible Accordion List */}


                {yearlyRecords.map((record, index) => (
                    <AcademicYearAccordion
                        key={record.calendarYear}
                        record={record}
                        defaultExpanded={index === 0} // Expand current/latest year by default
                    />
                ))}
        </Box>
    );
}