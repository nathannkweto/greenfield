import React, { useState, useMemo } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
    IconButton,
    CircularProgress,
    Chip,
    Autocomplete,
    Alert,
    Checkbox,
    Paper,
    Divider,
} from '@mui/material';
import LinkIcon from '@mui/icons-material/Link';
import CloseIcon from '@mui/icons-material/Close';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import SelectAllIcon from '@mui/icons-material/SelectAll';
import ClearAllIcon from '@mui/icons-material/ClearAll';

import { getFinance } from '../../../../../api/generated';
import type { Fee, School, Program } from '../types';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export interface ExtendedProgram extends Program {
    schoolName: string;
}

interface AttachToProgramModalProps {
    open: boolean;
    onClose: () => void;
    universalFees: Fee[];
    schools: School[];
    onSuccess: (msg: string) => void;
    onError: (msg: string) => void;
}

export const AttachToProgramModal: React.FC<AttachToProgramModalProps> = ({
                                                                              open,
                                                                              onClose,
                                                                              universalFees,
                                                                              schools,
                                                                              onSuccess,
                                                                              onError,
                                                                          }) => {
    const [selectedFee, setSelectedFee] = useState<Fee | null>(null);
    const [selectedPrograms, setSelectedPrograms] = useState<ExtendedProgram[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Flatten and enrich programs with school names for grouping
    const allPrograms: ExtendedProgram[] = useMemo(() => {
        return schools.flatMap((school) =>
            (school.programs || []).map((p) => ({
                ...p,
                schoolName: school.name || 'General Academic',
            }))
        );
    }, [schools]);

    const handleSelectAll = () => setSelectedPrograms(allPrograms);
    const handleClearAll = () => setSelectedPrograms([]);

    const handleReset = () => {
        setSelectedFee(null);
        setSelectedPrograms([]);
        setIsSubmitting(false);
    };

    const handleClose = () => {
        handleReset();
        onClose();
    };

    const handleAttach = async () => {
        if (!selectedFee) {
            onError('Please select a fee template.');
            return;
        }

        if (selectedPrograms.length === 0) {
            onError('Please select at least one program to attach this fee to.');
            return;
        }

        setIsSubmitting(true);
        try {
            const financeApi = getFinance() as Record<string, any>;
            const feeIdNum = Number(selectedFee.id); // Strict integer Fee ID
            const programPublicIds = selectedPrograms.map((p) => p.id); // UUIDs

            if (typeof financeApi.postFeesFeeIdAttachPrograms === 'function') {
                await financeApi.postFeesFeeIdAttachPrograms(feeIdNum, {
                    program_public_ids: programPublicIds,
                });
            } else if (typeof financeApi.postFeesIdAttachPrograms === 'function') {
                await financeApi.postFeesIdAttachPrograms(feeIdNum, {
                    program_public_ids: programPublicIds,
                });
            } else {
                const promises = selectedPrograms.map((program) =>
                    financeApi.postFeesIdAttachProgram(feeIdNum, {
                        program_public_id: program.id,
                    })
                );
                await Promise.all(promises);
            }

            onSuccess(
                `Successfully linked fee "${selectedFee.title}" to ${selectedPrograms.length} academic program(s)!`
            );
            handleClose();
        } catch (err: unknown) {
            const errorObj = err as { response?: { data?: { message?: string } } };
            onError(errorObj?.response?.data?.message || 'Failed to attach fee to selected programs.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinkIcon color="primary" />
                    <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
                        Attach Universal Fee to Programs
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
                            options={universalFees}
                            getOptionLabel={(fee) => `${fee.title} (${fee.frequency || 'Termly'})`}
                            value={selectedFee}
                            onChange={(_, newValue) => setSelectedFee(newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Search & Select Fee Template"
                                    required
                                    placeholder="e.g. Technology Fee, Registration Fee..."
                                />
                            )}
                            renderOption={(props, option) => (
                                <Box component="li" {...props} key={option.id} sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {option.title}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Frequency: {option.frequency || 'Termly'}
                                        </Typography>
                                    </Box>
                                    {option.amountZmw && (
                                        <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                            ZMW {option.amountZmw}
                                        </Typography>
                                    )}
                                </Box>
                            )}
                        />
                    </Box>

                    {/* STEP 2: SELECT TARGET PROGRAMS */}
                    <Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                            <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                2. Select Target Programs ({selectedPrograms.length} / {allPrograms.length})
                            </Typography>

                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    startIcon={<SelectAllIcon />}
                                    onClick={handleSelectAll}
                                    disabled={selectedPrograms.length === allPrograms.length}
                                >
                                    Select All ({allPrograms.length})
                                </Button>
                                {selectedPrograms.length > 0 && (
                                    <Button
                                        size="small"
                                        color="error"
                                        startIcon={<ClearAllIcon />}
                                        onClick={handleClearAll}
                                    >
                                        Clear
                                    </Button>
                                )}
                            </Box>
                        </Box>

                        <Autocomplete
                            multiple
                            disableCloseOnSelect
                            limitTags={3}
                            options={allPrograms}
                            value={selectedPrograms}
                            onChange={(_, newValue) => setSelectedPrograms(newValue)}
                            groupBy={(option) => option.schoolName}
                            getOptionLabel={(option) => `${option.code} - ${option.title}`}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            renderOption={(props, option, { selected }) => (
                                <li {...props} key={option.id}>
                                    <Checkbox
                                        icon={icon}
                                        checkedIcon={checkedIcon}
                                        style={{ marginRight: 8 }}
                                        checked={selected}
                                    />
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                            {option.code}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {option.title}
                                        </Typography>
                                    </Box>
                                </li>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Search Programs by Code or Name"
                                    placeholder={selectedPrograms.length === 0 ? "Type or select programs..." : ""}
                                />
                            )}
                        />

                        {/* SELECTION SUMMARY BADGE BOX */}
                        {selectedPrograms.length > 0 && (
                            <Paper variant="outlined" sx={{ mt: 2, p: 2, backgroundColor: 'action.hover', borderRadius: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                                        Target Programs Queue ({selectedPrograms.length}):
                                    </Typography>
                                    <Typography variant="caption" color="primary.main" sx={{ fontWeight: 700 }}>
                                        {selectedPrograms.length === allPrograms.length
                                            ? 'ALL INSTITUTION PROGRAMS SELECTED'
                                            : `${selectedPrograms.length} Selected`}
                                    </Typography>
                                </Box>
                                <Divider sx={{ mb: 1.5 }} />
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, maxHeight: 120, overflowY: 'auto' }}>
                                    {selectedPrograms.map((p) => (
                                        <Chip
                                            key={p.id}
                                            label={`${p.code}: ${p.title}`}
                                            size="small"
                                            onDelete={() =>
                                                setSelectedPrograms((prev) => prev.filter((item) => item.id !== p.id))
                                            }
                                        />
                                    ))}
                                </Box>
                            </Paper>
                        )}
                    </Box>

                    {/* CONFIRMATION SUMMARY */}
                    {selectedFee && selectedPrograms.length > 0 && (
                        <Alert severity="info" icon={<LinkIcon />} sx={{ borderRadius: 2 }}>
                            Ready to attach fee <strong>{selectedFee.title}</strong> to{' '}
                            <strong>{selectedPrograms.length}</strong> academic program(s).
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
                        onClick={handleAttach}
                        disabled={isSubmitting || !selectedFee || selectedPrograms.length === 0}
                        startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : <LinkIcon />}
                    >
                        {isSubmitting
                            ? 'Linking Fees...'
                            : `Link Fee (${selectedPrograms.length} Programs)`}
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};