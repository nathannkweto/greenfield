import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Box,
    Typography,
    Paper,
    Stepper,
    Step,
    StepLabel,
    Alert,
    AlertTitle,
    Chip,
    CircularProgress,
} from '@mui/material';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';

import { getFinance } from '../../../../../api/generated';
import type { Fee, School } from '../types';
import { formatCurrency } from '../helpers';

interface BulkAssignModalProps {
    open: boolean;
    onClose: () => void;
    fees: Fee[];
    schools?: School[];
    onSuccess: (msg: string) => void;
    onError: (msg: string) => void;
}

const steps = ['Audience Criteria', 'Select Charges', 'Audit & Preview', 'Queue Billing'];

export const BulkAssignModal: React.FC<BulkAssignModalProps> = ({
                                                                    open,
                                                                    onClose,
                                                                    fees = [],
                                                                    schools = [],
                                                                    onSuccess,
                                                                    onError,
                                                                }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [selectedFeeId, setSelectedFeeId] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Dynamic Filter State
    const [filters, setFilters] = useState({
        program_public_id: '',
        intake: '',
        registration_year: '',
        study_mode: '',
        status: 'Registered',
    });

    const allPrograms = (schools ?? []).flatMap((s) => s?.programs ?? []);
    const selectedFee = fees.find((f) => String(f.id) === String(selectedFeeId));

    // Reset state on close
    const handleResetAndClose = () => {
        setActiveStep(0);
        setSelectedFeeId('');
        onClose();
    };

    const handleNext = () => {
        if (activeStep === 1 && !selectedFeeId) {
            onError('Please select a fee template to charge.');
            return;
        }
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => setActiveStep((prev) => prev - 1);

    const handleExecuteAssignment = async () => {
        if (!selectedFeeId) {
            onError('Please select a fee template.');
            return;
        }

        setIsSubmitting(true);
        try {
            const financeApi = getFinance() as Record<string, any>;
            const feeIdNum = Number(selectedFeeId); // Strict integer Fee ID

            const payload = {
                program_public_id: filters.program_public_id || undefined,
                intake: filters.intake || undefined,
                registration_year: filters.registration_year ? parseInt(filters.registration_year, 10) : undefined,
                study_mode: filters.study_mode || undefined,
                status: filters.status || undefined,
            };

            const assignFn = financeApi.postFeesFeeIdAssignBulk || financeApi.postFeesIdAssignBulk;
            const res = await assignFn.call(financeApi, feeIdNum, payload);

            onSuccess(res?.message || 'Mass billing assignment job queued successfully!');
            handleResetAndClose();
        } catch (err: unknown) {
            const errorObj = err as { response?: { data?: { message?: string } } };
            onError(errorObj?.response?.data?.message || 'Bulk fee assignment failed.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleResetAndClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                <GroupAddIcon color="primary" />
                Mass Fee Charging Engine
            </DialogTitle>
            <DialogContent dividers>
                <Stepper activeStep={activeStep} sx={{ mb: 3, pt: 1 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {/* STEP 1: AUDIENCE CRITERIA */}
                {activeStep === 0 && (
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, pt: 1 }}>
                        <Box sx={{ gridColumn: { xs: 'span 1', sm: 'span 2' } }}>
                            <TextField
                                select
                                label="Academic Program Filter"
                                fullWidth
                                value={filters.program_public_id}
                                onChange={(e) => setFilters({ ...filters, program_public_id: e.target.value })}
                            >
                                <MenuItem value="">All Academic Programs</MenuItem>
                                {allPrograms.map((p) => (
                                    <MenuItem key={p.id} value={p.id}>
                                        {p.code} — {p.title}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>

                        <TextField
                            select
                            label="Intake Cohort"
                            fullWidth
                            value={filters.intake}
                            onChange={(e) => setFilters({ ...filters, intake: e.target.value })}
                        >
                            <MenuItem value="">All Intakes</MenuItem>
                            <MenuItem value="January">January</MenuItem>
                            <MenuItem value="May">May</MenuItem>
                            <MenuItem value="September">September</MenuItem>
                        </TextField>

                        <TextField
                            label="Admission Year"
                            type="number"
                            fullWidth
                            placeholder="e.g. 2026"
                            value={filters.registration_year}
                            onChange={(e) => setFilters({ ...filters, registration_year: e.target.value })}
                        />

                        <TextField
                            select
                            label="Study Mode Filter"
                            fullWidth
                            value={filters.study_mode}
                            onChange={(e) => setFilters({ ...filters, study_mode: e.target.value })}
                        >
                            <MenuItem value="">All Study Modes</MenuItem>
                            <MenuItem value="full_time">Full-Time</MenuItem>
                            <MenuItem value="part_time">Part-Time</MenuItem>
                            <MenuItem value="distance">Distance</MenuItem>
                            <MenuItem value="online">Online</MenuItem>
                        </TextField>

                        <TextField
                            select
                            label="Student Enrollment Status"
                            fullWidth
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        >
                            <MenuItem value="">All Statuses</MenuItem>
                            <MenuItem value="Registered">Registered</MenuItem>
                            <MenuItem value="Admitted">Admitted</MenuItem>
                            <MenuItem value="Pending">Pending</MenuItem>
                        </TextField>
                    </Box>
                )}

                {/* STEP 2: SELECT FEE OR PACKAGE */}
                {activeStep === 1 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
                        <TextField
                            select
                            label="Select Master Fee Template to Charge"
                            fullWidth
                            required
                            value={selectedFeeId}
                            onChange={(e) => setSelectedFeeId(e.target.value)}
                        >
                            {fees.map((fee) => (
                                <MenuItem key={fee.id} value={fee.id}>
                                    {fee.title} — {formatCurrency(fee.amountZmw, 'ZMW')} ({fee.frequency})
                                </MenuItem>
                            ))}
                        </TextField>

                        {selectedFee && (
                            <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'action.hover' }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                                    Selected Fee Details
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Title: <strong>{selectedFee.title}</strong>
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Billed Amount: <strong>{formatCurrency(selectedFee.amountZmw, 'ZMW')}</strong>
                                    {selectedFee.amountUsd && ` / ${formatCurrency(selectedFee.amountUsd, 'USD')}`}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Frequency Rule: <Chip label={selectedFee.frequency} size="small" sx={{ ml: 0.5 }} />
                                </Typography>
                            </Paper>
                        )}
                    </Box>
                )}

                {/* STEP 3: DRY-RUN AUDIT & PREVIEW */}
                {activeStep === 2 && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
                        <Alert severity="info" icon={<AssessmentIcon />}>
                            <AlertTitle sx={{ fontWeight: 700 }}>Dry-Run Billing Audit Summary</AlertTitle>
                            Review the target audience and fee rates before triggering ledger creation.
                        </Alert>

                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                            <Paper variant="outlined" sx={{ p: 2 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                    TARGET SCOPE
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                    Filtered Cohort Batch
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Program: {filters.program_public_id ? 'Selected' : 'All Programs'} | Status: {filters.status || 'All'}
                                </Typography>
                            </Paper>

                            <Paper variant="outlined" sx={{ p: 2 }}>
                                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                    CHARGING TEMPLATE
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: 'success.main' }}>
                                    {selectedFee ? formatCurrency(selectedFee.amountZmw, 'ZMW') : '—'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {selectedFee?.title} ({selectedFee?.frequency})
                                </Typography>
                            </Paper>
                        </Box>
                    </Box>
                )}

                {/* STEP 4: EXECUTE ASYNC JOB */}
                {activeStep === 3 && (
                    <Box sx={{ textAlign: 'center', py: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <CheckCircleOutlineIcon color="success" sx={{ fontSize: 54, mb: 1.5 }} />
                        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                            Ready to Post Student Charges
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 460, textAlign: 'center', mb: 2 }}>
                            Clicking confirmation will queue an asynchronous background job to post <strong>{selectedFee?.title}</strong> to all matching student accounts.
                        </Typography>
                    </Box>
                )}
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
                <Button onClick={handleResetAndClose} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {activeStep > 0 && activeStep < 3 && (
                        <Button onClick={handleBack} disabled={isSubmitting}>
                            Back
                        </Button>
                    )}
                    {activeStep < 3 ? (
                        <Button variant="contained" onClick={handleNext}>
                            Next Step
                        </Button>
                    ) : (
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleExecuteAssignment}
                            disabled={isSubmitting}
                            startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : null}
                        >
                            {isSubmitting ? 'Posting Charges...' : 'Confirm & Post Charges'}
                        </Button>
                    )}
                </Box>
            </DialogActions>
        </Dialog>
    );
};