import { Box, Typography } from '@mui/material';
import CohortFinancialTable from './CohortFinancialTable';
import { type CohortGroup } from '../types';

interface FinancialReconciliationTabProps {
    cohortGroups: CohortGroup[];
    programId: string;
}

export default function FinancialReconciliationTab({ cohortGroups, programId }: FinancialReconciliationTabProps) {
    if (cohortGroups.length === 0) {
        return (
            <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography color="text.secondary">No students registered in this program yet.</Typography>
            </Box>
        );
    }

    return (
        <Box>
            {cohortGroups.map((cohort) => (
                <CohortFinancialTable key={cohort.cohortKey} cohort={cohort} programId={programId} />
            ))}
        </Box>
    );
}