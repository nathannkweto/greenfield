import { useState } from 'react';
import {
    Paper,
    Box,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    TextField,
    Button,
    InputAdornment,
    CircularProgress,
    Snackbar,
    Alert,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { getStudents } from '../../../../api/generated';
import type { StudentFinancialBalanceItem } from '../../../../api/generated';
import type { CohortGroup } from '../types';
import { formatStudentName, formatStudyMode } from '../helpers';

interface CohortFinancialTableProps {
    cohort: CohortGroup;
    programId: string;
}

export default function CohortFinancialTable({ cohort, programId }: CohortFinancialTableProps) {
    const [balances, setBalances] = useState<Record<string, number | ''>>(() => {
        const initial: Record<string, number | ''> = {};
        cohort.students.forEach((s) => {
            initial[s.id] = s.feeBalance ?? 0;
        });
        return initial;
    });

    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
        open: false,
        message: '',
        severity: 'success',
    });

    const handleBalanceChange = (studentId: string, val: string) => {
        const numVal = val === '' ? '' : parseFloat(val);
        setBalances((prev) => ({
            ...prev,
            [studentId]: numVal,
        }));
    };

    const handleSaveBatch = async () => {
        setSubmitting(true);
        try {
            const payload: StudentFinancialBalanceItem[] = cohort.students.map((student) => ({
                student_id: student.id,
                fee_balance: balances[student.id] === '' ? 0 : Number(balances[student.id]),
            }));

            await getStudents().postProgramsPublicIdFinancialReconciliation(programId, {
                cohort_key: cohort.cohortKey,
                balances: payload,
            });

            setToast({
                open: true,
                message: `Successfully updated financial balances for ${cohort.cohortKey} intake!`,
                severity: 'success',
            });
        } catch (err) {
            console.error('Failed to save financial batch:', err);
            setToast({
                open: true,
                message: `Failed to save balances for ${cohort.cohortKey} intake.`,
                severity: 'error',
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: 'primary.main' }}>
                    {cohort.cohortKey} Intake ({cohort.students.length} Students)
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <SaveIcon />}
                    onClick={handleSaveBatch}
                    disabled={submitting}
                >
                    {submitting ? 'Saving...' : `Save ${cohort.cohortKey} Balances`}
                </Button>
            </Box>

            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Student ID</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Student Name</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Study Mode</TableCell>
                            <TableCell sx={{ fontWeight: 700, width: 220 }}>Outstanding Fee Balance</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cohort.students.map((student) => (
                            <TableRow key={student.id} hover>
                                <TableCell sx={{ fontWeight: 600 }}>{student.studentNumber}</TableCell>
                                <TableCell>{formatStudentName(student)}</TableCell>
                                <TableCell>{formatStudyMode(student.studyMode)}</TableCell>
                                <TableCell>
                                    <TextField
                                        size="small"
                                        type="number"
                                        value={balances[student.id] ?? ''}
                                        onChange={(e) => handleBalanceChange(student.id, e.target.value)}
                                        placeholder="0.00"
                                        slotProps={{
                                            input: {
                                                startAdornment: <InputAdornment position="start">ZMW</InputAdornment>,
                                            },
                                            htmlInput: { min: 0, step: '0.01' },
                                        }}
                                        fullWidth
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Snackbar
                open={toast.open}
                autoHideDuration={4000}
                onClose={() => setToast((prev) => ({ ...prev, open: false }))}
            >
                <Alert severity={toast.severity}>{toast.message}</Alert>
            </Snackbar>
        </Paper>
    );
}