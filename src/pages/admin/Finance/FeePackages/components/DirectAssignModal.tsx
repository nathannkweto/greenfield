import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    InputAdornment,
    Paper,
    IconButton,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Autocomplete,
    Alert,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CloseIcon from '@mui/icons-material/Close';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlined';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import SearchIcon from '@mui/icons-material/Search';
import { useLazyQuery } from '@apollo/client/react';

import { getFinance } from '../../../../../api/generated';
import type { Fee } from '../types';
import { formatCurrency } from '../helpers';
import { GET_STUDENT_BY_NUMBER } from '../queries';

export interface StudentOption {
    id: string;
    studentNumber: string;
    firstName: string;
    lastName: string;
}

interface GetStudentByNumberData {
    student?: StudentOption | null;
}

interface GetStudentByNumberVars {
    studentNumber: string;
}

export interface QueuedStudent {
    id: string;
    studentNumber: string;
    fullName: string;
}

interface DirectAssignModalProps {
    open: boolean;
    onClose: () => void;
    fees: Fee[];
    onSuccess: (msg: string, students: QueuedStudent[]) => void;
    onError: (msg: string) => void;
}

export const DirectAssignModal: React.FC<DirectAssignModalProps> = ({
                                                                        open,
                                                                        onClose,
                                                                        fees,
                                                                        onSuccess,
                                                                        onError,
                                                                    }) => {
    // 1. Fee Selection State
    const [selectedFee, setSelectedFee] = useState<Fee | null>(null);
    const [overrideZmw, setOverrideZmw] = useState<string>('');
    const [overrideUsd, setOverrideUsd] = useState<string>('');

    // 2. Student Lookup & Queue State
    const [studentSearchInput, setStudentSearchInput] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    const [queuedStudents, setQueuedStudents] = useState<QueuedStudent[]>([]);
    const [inputError, setInputError] = useState<string | null>(null);

    // 3. Submission State
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Apollo Student Lookup Query (Matches GET_STUDENT_BY_NUMBER)
    const [fetchStudent, { data: studentData, loading: isSearchingStudent, error: searchError }] =
        useLazyQuery<GetStudentByNumberData, GetStudentByNumberVars>(GET_STUDENT_BY_NUMBER, {
            fetchPolicy: 'network-only',
        });

    const foundStudent = studentData?.student;

    // Trigger Search by Student Number
    const handleExecuteSearch = () => {
        const studentNumber = studentSearchInput.trim();
        if (!studentNumber) {
            setInputError('Please enter a student number to search.');
            return;
        }

        setInputError(null);
        setHasSearched(true);
        void fetchStudent({ variables: { studentNumber } });
    };

    // Add Found Student to Queue
    const handleAddStudentToQueue = (student: StudentOption) => {
        const fullName = `${student.firstName} ${student.lastName}`.trim();

        if (queuedStudents.some((s) => s.studentNumber === student.studentNumber)) {
            setInputError(`Student "${fullName} (${student.studentNumber})" is already in the queue.`);
            return;
        }

        setQueuedStudents((prev) => [
            ...prev,
            {
                id: student.id,
                studentNumber: student.studentNumber,
                fullName,
            },
        ]);

        // Reset search input after adding
        setStudentSearchInput('');
        setHasSearched(false);
        setInputError(null);
    };

    const handleRemoveStudent = (studentNumber: string) => {
        setQueuedStudents((prev) => prev.filter((s) => s.studentNumber !== studentNumber));
    };

    // Reset Form State on Close
    const handleReset = () => {
        setSelectedFee(null);
        setOverrideZmw('');
        setOverrideUsd('');
        setStudentSearchInput('');
        setHasSearched(false);
        setQueuedStudents([]);
        setInputError(null);
        setIsSubmitting(false);
    };

    const handleClose = () => {
        handleReset();
        onClose();
    };

    // Active Effective Rates with Safe Parsing
    const parsedOverrideZmw = parseFloat(overrideZmw);
    const effectiveZmw = !isNaN(parsedOverrideZmw) && overrideZmw.trim() !== ''
        ? parsedOverrideZmw
        : selectedFee?.amountZmw || 0;

    const totalBatchZmw = effectiveZmw * queuedStudents.length;

    // Submit Batch
    const handleBatchAssign = async () => {
        if (!selectedFee) {
            onError('Please select a fee template first.');
            return;
        }

        if (queuedStudents.length === 0) {
            onError('Please add at least one student to charge.');
            return;
        }

        setIsSubmitting(true);

        try {
            const financeApi = getFinance() as Record<string, any>;
            const feeIdNum = Number(selectedFee.id); // Strict integer Fee ID

            const parsedZmw = parseFloat(overrideZmw);
            const parsedUsd = parseFloat(overrideUsd);
            const overrideAmountZmw = !isNaN(parsedZmw) && overrideZmw.trim() !== '' ? parsedZmw : null;
            const overrideAmountUsd = !isNaN(parsedUsd) && overrideUsd.trim() !== '' ? parsedUsd : null;

            if (
                typeof financeApi.postFeesFeeIdAssignStudents === 'function' ||
                typeof financeApi.postFeesIdAssignStudents === 'function'
            ) {
                const assignFn = financeApi.postFeesFeeIdAssignStudents || financeApi.postFeesIdAssignStudents;
                await assignFn.call(financeApi, feeIdNum, {
                    student_public_ids: queuedStudents.map((s) => s.id),
                    override_amount_zmw: overrideAmountZmw,
                    override_amount_usd: overrideAmountUsd,
                });
            } else {
                const promises = queuedStudents.map((student) =>
                    financeApi.postStudentsPublicIdFeesAssign(student.studentNumber, {
                        fee_id: feeIdNum,
                        override_amount_zmw: overrideAmountZmw,
                        override_amount_usd: overrideAmountUsd,
                    })
                );
                await Promise.all(promises);
            }

            onSuccess(
                `Successfully posted fee "${selectedFee.title}" to ${queuedStudents.length} student account(s)!`,
                queuedStudents
            );
            handleClose();
        } catch (err: unknown) {
            const errorObj = err as { response?: { data?: { message?: string } } };
            onError(errorObj?.response?.data?.message || 'Failed to charge selected students.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonAddIcon color="primary" />
                    <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
                        Charge Student Accounts
                    </Typography>
                </Box>
                <IconButton size="small" onClick={handleClose} disabled={isSubmitting}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 0.5 }}>

                    {/* STEP 1: SELECT FEE TEMPLATE */}
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            1. Select Fee Template
                        </Typography>
                        <Autocomplete
                            options={fees}
                            getOptionLabel={(fee) => `${fee.title} (${formatCurrency(fee.amountZmw, 'ZMW')})`}
                            value={selectedFee}
                            onChange={(_, newValue) => {
                                setSelectedFee(newValue);
                                setOverrideZmw('');
                                setOverrideUsd('');
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Search & Select Fee Template"
                                    required
                                    placeholder="e.g. Graduation Fee, Late Registration..."
                                />
                            )}
                            renderOption={(props, option) => (
                                <Box
                                    component="li"
                                    {...props}
                                    key={option.id}
                                    sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
                                >
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {option.title}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Frequency: {option.frequency || 'Termly'}
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                        {formatCurrency(option.amountZmw, 'ZMW')}
                                    </Typography>
                                </Box>
                            )}
                        />

                        {/* FEE SUMMARY & OVERRIDE PANEL */}
                        {selectedFee && (
                            <Paper variant="outlined" sx={{ mt: 2, p: 2, backgroundColor: 'action.hover', borderRadius: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                    <ReceiptLongIcon color="primary" fontSize="small" />
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                        Base Rate: {formatCurrency(selectedFee.amountZmw, 'ZMW')}
                                        {selectedFee.amountUsd ? ` / $${selectedFee.amountUsd}` : ''}
                                    </Typography>
                                </Box>

                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
                                    Optionally adjust the price override for this specific charging session:
                                </Typography>

                                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                                    <TextField
                                        label="Override ZMW Amount"
                                        type="number"
                                        size="small"
                                        placeholder={selectedFee.amountZmw.toString()}
                                        value={overrideZmw}
                                        onChange={(e) => setOverrideZmw(e.target.value)}
                                        slotProps={{
                                            input: {
                                                startAdornment: <InputAdornment position="start">ZMW</InputAdornment>,
                                            },
                                        }}
                                    />
                                    <TextField
                                        label="Override USD Amount"
                                        type="number"
                                        size="small"
                                        placeholder={selectedFee.amountUsd ? selectedFee.amountUsd.toString() : 'Optional'}
                                        value={overrideUsd}
                                        onChange={(e) => setOverrideUsd(e.target.value)}
                                        slotProps={{
                                            input: {
                                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                            },
                                        }}
                                    />
                                </Box>
                            </Paper>
                        )}
                    </Box>

                    {/* STEP 2: SEARCH AND CONFIRM STUDENT */}
                    <Box>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, mb: 1, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            2. Target Student(s)
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'flex-start' }}>
                            <TextField
                                fullWidth
                                label="Enter Student Number"
                                placeholder="e.g. 2026-CS-001"
                                value={studentSearchInput}
                                onChange={(e) => {
                                    setStudentSearchInput(e.target.value);
                                    if (inputError) setInputError(null);
                                    if (hasSearched) setHasSearched(false);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleExecuteSearch();
                                    }
                                }}
                                error={Boolean(inputError)}
                                helperText={inputError}
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon color="action" fontSize="small" />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleExecuteSearch}
                                disabled={isSearchingStudent || !studentSearchInput.trim()}
                                startIcon={isSearchingStudent ? <CircularProgress size={18} color="inherit" /> : <SearchIcon />}
                                sx={{ height: 56, minWidth: 120, whiteSpace: 'nowrap' }}
                            >
                                Search
                            </Button>
                        </Box>

                        {/* GRAPHQL QUERY ERROR BANNER */}
                        {searchError && (
                            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                                Query error: {searchError.message}
                            </Alert>
                        )}

                        {/* SEARCH RESULT PREVIEW PANEL */}
                        {isSearchingStudent && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                <CircularProgress size={28} />
                            </Box>
                        )}

                        {!isSearchingStudent && !searchError && hasSearched && (
                            <Box sx={{ mb: 2 }}>
                                {foundStudent ? (
                                    <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'action.hover', borderRadius: 2 }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 1 }}>
                                            Found Student Result:
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                p: 1.5,
                                                backgroundColor: 'background.paper',
                                                borderRadius: 1,
                                                border: '1px solid',
                                                borderColor: 'divider',
                                            }}
                                        >
                                            <Box>
                                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                    {foundStudent.firstName} {foundStudent.lastName}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Student ID: {foundStudent.studentNumber}
                                                </Typography>
                                            </Box>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                color="primary"
                                                startIcon={<AddCircleOutlineIcon />}
                                                onClick={() => handleAddStudentToQueue(foundStudent)}
                                            >
                                                Add Student
                                            </Button>
                                        </Box>
                                    </Paper>
                                ) : (
                                    <Alert severity="warning" sx={{ borderRadius: 2 }}>
                                        No student found with student number "{studentSearchInput}". Please check the ID and try again.
                                    </Alert>
                                )}
                            </Box>
                        )}

                        {/* QUEUED STUDENTS TABLE */}
                        {queuedStudents.length > 0 ? (
                            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2, maxHeight: 220 }}>
                                <Table size="small" stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Student Name</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Student ID / Reg No</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Fee Amount</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 700 }}>Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {queuedStudents.map((student, idx) => (
                                            <TableRow key={student.id} hover>
                                                <TableCell>{idx + 1}</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>{student.fullName}</TableCell>
                                                <TableCell sx={{ color: 'text.secondary' }}>{student.studentNumber}</TableCell>
                                                <TableCell>{formatCurrency(effectiveZmw, 'ZMW')}</TableCell>
                                                <TableCell align="right">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleRemoveStudent(student.studentNumber)}
                                                    >
                                                        <DeleteOutlineIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Paper variant="outlined" sx={{ p: 3, textAlign: 'center', backgroundColor: 'action.hover', borderStyle: 'dashed', borderRadius: 2 }}>
                                <GroupAddIcon color="action" sx={{ fontSize: 32, mb: 0.5 }} />
                                <Typography variant="body2" color="text.secondary">
                                    No students queued yet. Enter a student number above and click Search to verify and add them to this batch.
                                </Typography>
                            </Paper>
                        )}
                    </Box>

                    {/* BATCH SUMMARY BANNER */}
                    {selectedFee && queuedStudents.length > 0 && (
                        <Alert severity="info" icon={<ReceiptLongIcon />} sx={{ borderRadius: 2 }}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                Ready to charge {queuedStudents.length} student(s) a total of{' '}
                                <strong>{formatCurrency(totalBatchZmw, 'ZMW')}</strong>.
                            </Typography>
                        </Alert>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
                <Button onClick={handleReset} color="inherit" disabled={isSubmitting}>
                    Reset Form
                </Button>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button onClick={handleClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleBatchAssign}
                        disabled={isSubmitting || !selectedFee || queuedStudents.length === 0}
                        startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <PersonAddIcon />}
                    >
                        {isSubmitting
                            ? 'Posting Charges...'
                            : `Post Charge (${queuedStudents.length})`}
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};