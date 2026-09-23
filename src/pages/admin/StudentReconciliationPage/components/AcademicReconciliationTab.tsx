import { Box, Typography } from '@mui/material';
import CohortAcademicTable from './CohortAcademicTable';
import type {CohortGroup, CurriculumItem} from '../types';

interface AcademicReconciliationTabProps {
    cohortGroups: CohortGroup[];
    programId: string;
    programCurriculum: CurriculumItem[];
}

export default function AcademicReconciliationTab({
                                                      cohortGroups,
                                                      programId,
                                                      programCurriculum,
                                                  }: AcademicReconciliationTabProps) {
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
                <CohortAcademicTable
                    key={cohort.cohortKey}
                    cohort={cohort}
                    programId={programId}
                    programCurriculum={programCurriculum}
                />
            ))}
        </Box>
    );
}