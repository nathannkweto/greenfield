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
    Chip,
    InputAdornment,
    Paper,
    Autocomplete,
    CircularProgress,
    IconButton,
    FormHelperText,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlined';
import PaymentsIcon from '@mui/icons-material/Payments';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import LanguageIcon from '@mui/icons-material/Language';
import SchoolIcon from '@mui/icons-material/School';

import { getFinance } from '../../../../../api/generated';
import type { Account, School } from '../types';

type FeeFrequency = 'termly' | 'monthly' | 'yearly' | 'one_time';

interface QuickPreset {
    label: string;
    title: string;
    frequency: FeeFrequency;
}

const QUICK_PRESETS: QuickPreset[] = [
    { label: 'Tuition', title: 'Tuition Fee', frequency: 'termly' },
    { label: 'Registration', title: 'Registration Fee', frequency: 'one_time' },
    { label: 'Exam', title: 'Examination Fee', frequency: 'termly' },
    { label: 'Medical', title: 'Medical Insurance Levy', frequency: 'yearly' },
    { label: 'Caution', title: 'Caution Refundable Deposit', frequency: 'one_time' },
];

interface CreateFeeModalProps {
    open: boolean;
    onClose: () => void;
    accounts: Account[];
    schools?: School[];
    loadingAccounts?: boolean;
    initialProgramId?: string | null;
    onSuccess: (msg: string) => void;
    onError: (msg: string) => void;
}

export const CreateFeeModal: React.FC<CreateFeeModalProps> = ({
                                                                  open,
                                                                  onClose,
                                                                  accounts,
                                                                  schools = [],
                                                                  loadingAccounts = false,
                                                                  initialProgramId = null,
                                                                  onSuccess,
                                                                  onError,
                                                              }) => {
    const [scope, setScope] = useState<'universal' | 'program'>('universal');
    const [title, setTitle] = useState('');
    const [frequency, setFrequency] = useState<FeeFrequency>('termly');
    const [selectedAccountId, setSelectedAccountId] = useState<string>('');
    const [selectedProgramId, setSelectedProgramId] = useState<string>('');
    const [amountZmw, setAmountZmw] = useState<string>('');
    const [amountUsd, setAmountUsd] = useState<string>('');
    const [submitting, setSubmitting] = useState(false);

    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const [prevInitialProgramId, setPrevInitialProgramId] = useState<string | null>(initialProgramId);
    const [prevOpen, setPrevOpen] = useState<boolean>(open);

    if (open !== prevOpen || initialProgramId !== prevInitialProgramId) {
        setPrevOpen(open);
        setPrevInitialProgramId(initialProgramId);
        if (initialProgramId) {
            setScope('program');
            setSelectedProgramId(initialProgramId);
        } else {
            setScope('universal');
            setSelectedProgramId('');
        }
    }

    const allPrograms = schools.flatMap((s) => s.programs || []);

    const applyPreset = (preset: QuickPreset) => {
        setTitle(preset.title);
        setFrequency(preset.frequency);
        setTouched((prev) => ({ ...prev, title: true }));
    };

    const handleReset = () => {
        setTitle('');
        setFrequency('termly');
        setSelectedAccountId('');
        setSelectedProgramId('');
        setAmountZmw('');
        setAmountUsd('');
        setTouched({});
        setSubmitting(false);
    };

    const handleClose = () => {
        handleReset();
        onClose();
    };

    const validate = () => {
        const errors: Record<string, string> = {};
        if (!title.trim()) errors.title = 'Fee title is required';
        if (!selectedAccountId) errors.accountId = 'GL Revenue Account selection is required';
        if (!amountZmw || parseFloat(amountZmw) < 0) errors.amountZmw = 'Valid ZMW amount is required';
        if (scope === 'program' && !selectedProgramId) errors.programId = 'Target academic program is required';
        return errors;
    };

    const errors = validate();

    const handleCreate = async () => {
        setTouched({
            title: true,
            accountId: true,
            amountZmw: true,
            programId: true,
        });

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            const firstError = Object.values(validationErrors)[0];
            onError(firstError);
            return;
        }

        setSubmitting(true);

        try {
            const financeApi = getFinance() as Record<string, any>;
            const payload = {
                title: title.trim(),
                amount_zmw: parseFloat(amountZmw),
                amount_usd: amountUsd ? parseFloat(amountUsd) : null,
                frequency,
                account_id: parseInt(selectedAccountId, 10), // Strict integer account_id
                program_public_id: scope === 'program' ? selectedProgramId : null, // UUID
                feeable_type: scope === 'program' ? 'Program' : null,
                feeable_public_id: scope === 'program' ? selectedProgramId : null, // UUID
            };

            const createFn = financeApi.postFeesCreate || financeApi.postFees;
            await createFn.call(financeApi, payload);

            onSuccess(`Fee template "${title}" created successfully!`);
            handleClose();
        } catch (err: unknown) {
            const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
            onError(errorObj?.response?.data?.message || errorObj?.message || 'Failed to create fee template.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AddCircleOutlineIcon color="primary" />
                    <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
                        Create Fee Template
                    </Typography>
                </Box>
                <IconButton size="small" onClick={handleClose} disabled={submitting}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 0.5 }}>
                    {/* QUICK PRESETS BAR */}
                    <Paper variant="outlined" sx={{ p: 1.5, backgroundColor: 'action.hover', borderStyle: 'dashed', borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 1 }}>
                            <AutoAwesomeIcon color="primary" fontSize="small" />
                            <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Quick Presets
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {QUICK_PRESETS.map((preset) => {
                                const isActive = title === preset.title;
                                return (
                                    <Chip
                                        key={preset.label}
                                        label={preset.label}
                                        size="small"
                                        clickable
                                        onClick={() => applyPreset(preset)}
                                        color={isActive ? 'primary' : 'default'}
                                        variant={isActive ? 'filled' : 'outlined'}
                                        sx={{ fontWeight: isActive ? 600 : 400 }}
                                    />
                                );
                            })}
                        </Box>
                    </Paper>

                    {/* SCOPE SELECTOR */}
                    <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 1 }}>
                            FEE APPLICABILITY SCOPE
                        </Typography>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5 }}>
                            <Paper
                                variant="outlined"
                                onClick={() => setScope('universal')}
                                sx={{
                                    p: 1.5,
                                    cursor: 'pointer',
                                    borderRadius: 2,
                                    borderColor: scope === 'universal' ? 'primary.main' : 'divider',
                                    borderWidth: scope === 'universal' ? 2 : 1,
                                    backgroundColor: scope === 'universal' ? 'action.selected' : 'background.paper',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    transition: 'all 0.2s',
                                }}
                            >
                                <LanguageIcon color={scope === 'universal' ? 'primary' : 'action'} />
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                        Universal Fee
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.2 }}>
                                        Applies across institution
                                    </Typography>
                                </Box>
                            </Paper>

                            <Paper
                                variant="outlined"
                                onClick={() => setScope('program')}
                                sx={{
                                    p: 1.5,
                                    cursor: 'pointer',
                                    borderRadius: 2,
                                    borderColor: scope === 'program' ? 'primary.main' : 'divider',
                                    borderWidth: scope === 'program' ? 2 : 1,
                                    backgroundColor: scope === 'program' ? 'action.selected' : 'background.paper',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1.5,
                                    transition: 'all 0.2s',
                                }}
                            >
                                <SchoolIcon color={scope === 'program' ? 'primary' : 'action'} />
                                <Box>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                        Program Specific
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', lineHeight: 1.2 }}>
                                        Targeted to one program
                                    </Typography>
                                </Box>
                            </Paper>
                        </Box>
                    </Box>

                    {/* PROGRAM SELECTOR (IF SCOPE === PROGRAM) */}
                    {scope === 'program' && (
                        <TextField
                            select
                            label="Target Academic Program"
                            fullWidth
                            required
                            value={selectedProgramId}
                            onChange={(e) => {
                                setSelectedProgramId(e.target.value);
                                setTouched((prev) => ({ ...prev, programId: true }));
                            }}
                            error={Boolean(touched.programId && errors.programId)}
                            helperText={touched.programId && errors.programId}
                        >
                            {allPrograms.map((p) => (
                                <MenuItem key={p.id} value={p.id}>
                                    {p.code} — {p.title}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}

                    {/* FEE TITLE & FREQUENCY */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '2fr 1fr' }, gap: 2 }}>
                        <TextField
                            label="Fee Title"
                            fullWidth
                            required
                            placeholder="e.g. Laboratory & Tech Fee"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                setTouched((prev) => ({ ...prev, title: true }));
                            }}
                            error={Boolean(touched.title && errors.title)}
                            helperText={touched.title && errors.title}
                        />

                        <TextField
                            select
                            label="Charging Frequency"
                            fullWidth
                            value={frequency}
                            onChange={(e) => setFrequency(e.target.value as FeeFrequency)}
                        >
                            <MenuItem value="termly">Termly</MenuItem>
                            <MenuItem value="monthly">Monthly</MenuItem>
                            <MenuItem value="yearly">Yearly</MenuItem>
                            <MenuItem value="one_time">One-Time</MenuItem>
                        </TextField>
                    </Box>

                    {/* GL REVENUE ACCOUNT AUTOCOMPLETE */}
                    <Box>
                        <Autocomplete
                            options={accounts}
                            loading={loadingAccounts}
                            getOptionLabel={(acc) => `${acc.accountNumber} - ${acc.name}`}
                            value={accounts.find((a) => String(a.id) === String(selectedAccountId)) || null}
                            onChange={(_, newValue) => {
                                setSelectedAccountId(newValue ? String(newValue.id) : '');
                                setTouched((prev) => ({ ...prev, accountId: true }));
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="GL Revenue Account Mapping"
                                    required
                                    placeholder="Search account code or title..."
                                    error={Boolean(touched.accountId && errors.accountId)}
                                />
                            )}
                            renderOption={(props, option) => (
                                <Box component="li" {...props} key={option.id} sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {option.accountNumber}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {option.name}
                                        </Typography>
                                    </Box>
                                    <Chip label={option.type || 'Revenue'} size="small" variant="outlined" color="primary" sx={{ fontSize: '0.68rem', textTransform: 'uppercase' }} />
                                </Box>
                            )}
                        />
                        {touched.accountId && errors.accountId ? (
                            <FormHelperText error>{errors.accountId}</FormHelperText>
                        ) : (
                            <FormHelperText color="text.secondary">
                                General Ledger revenue account for automated double-entry postings.
                            </FormHelperText>
                        )}
                    </Box>

                    {/* DUAL CURRENCY PRICING */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                        <TextField
                            label="Amount (ZMW)"
                            type="number"
                            required
                            fullWidth
                            placeholder="0.00"
                            value={amountZmw}
                            onChange={(e) => {
                                setAmountZmw(e.target.value);
                                setTouched((prev) => ({ ...prev, amountZmw: true }));
                            }}
                            error={Boolean(touched.amountZmw && errors.amountZmw)}
                            helperText={touched.amountZmw && errors.amountZmw}
                            slotProps={{
                                input: {
                                    startAdornment: <InputAdornment position="start">ZMW</InputAdornment>,
                                },
                            }}
                        />

                        <TextField
                            label="Amount (USD - Optional)"
                            type="number"
                            fullWidth
                            placeholder="0.00"
                            value={amountUsd}
                            onChange={(e) => setAmountUsd(e.target.value)}
                            slotProps={{
                                input: {
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                },
                            }}
                        />
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
                <Button onClick={handleReset} color="inherit" disabled={submitting}>
                    Reset Form
                </Button>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button onClick={handleClose} disabled={submitting}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreate}
                        disabled={submitting}
                        startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <PaymentsIcon />}
                    >
                        {submitting ? 'Creating Fee...' : 'Create Fee Template'}
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};