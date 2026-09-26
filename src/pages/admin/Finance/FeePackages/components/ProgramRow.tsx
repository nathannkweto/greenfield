import React, { useState } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Collapse,
    IconButton,
    Chip,
    Button,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AddIcon from '@mui/icons-material/Add';

import type { Program, Account } from '../types';
import { formatCurrency, formatFrequency } from '../helpers';

interface ProgramRowProps {
    program: Program;
    accounts: Account[];
    loadingAccounts?: boolean;
    onOpenCreateModalForProgram: (programId: string) => void;
    onError: (msg: string) => void;
}

export const ProgramRow: React.FC<ProgramRowProps> = ({
                                                          program,
                                                          onOpenCreateModalForProgram,
                                                      }) => {
    const [open, setOpen] = useState(false);
    const feesCount = program.fees ? program.fees.length : 0;

    return (
        <>
            <TableRow
                sx={{
                    '& > *': { borderBottom: open ? 'unset' : undefined },
                    bgcolor: open ? 'action.selected' : 'inherit',
                    transition: 'background-color 0.2s',
                }}
            >
                <TableCell width={48}>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {program.code}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography variant="body2">{program.title}</Typography>
                </TableCell>
                <TableCell>
                    <Chip label={program.level.replace(/_/g, ' ')} size="small" variant="outlined" color="primary" />
                </TableCell>
                <TableCell align="right">
                    <Chip
                        label={`${feesCount} Attached Fee${feesCount === 1 ? '' : 's'}`}
                        size="small"
                        color={feesCount > 0 ? 'info' : 'default'}
                    />
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box
                            sx={{
                                margin: 2,
                                ml: 4,
                                p: 2.5,
                                bgcolor: 'background.paper',
                                borderRadius: 1.5,
                                borderLeft: '4px solid',
                                borderColor: 'primary.main',
                                boxShadow: 1,
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: 'uppercase', color: 'text.secondary' }}>
                                    Program Specific Charges — {program.title}
                                </Typography>
                                <Button
                                    size="small"
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => onOpenCreateModalForProgram(program.id)}
                                >
                                    Add Charge to Program
                                </Button>
                            </Box>

                            <Table size="small" aria-label={`fees table for ${program.title}`}>
                                <TableHead sx={{ bgcolor: 'action.hover' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 700 }}>Fee Title</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>Frequency</TableCell>
                                        <TableCell sx={{ fontWeight: 700 }}>GL Revenue Account</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 700 }}>Amount (ZMW)</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 700 }}>Amount (USD)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {program.fees && program.fees.length > 0 ? (
                                        program.fees.map((fee) => (
                                            <TableRow key={fee.id} hover>
                                                <TableCell sx={{ fontWeight: 500 }}>{fee.title}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={formatFrequency(fee.frequency)}
                                                        size="small"
                                                        variant="filled"
                                                        sx={{ fontSize: '0.72rem' }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {fee.account ? `${fee.account.accountNumber} - ${fee.account.name}` : '—'}
                                                </TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 600, color: 'success.main' }}>
                                                    {formatCurrency(fee.amountZmw, 'ZMW')}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {fee.amountUsd ? formatCurrency(fee.amountUsd, 'USD') : '—'}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    No specific fees attached to this program yet.
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};