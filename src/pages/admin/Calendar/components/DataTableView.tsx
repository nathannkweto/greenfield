import {
    Box,
    Typography,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Chip,
} from '@mui/material';
import type { AcademicTerm, AcademicEvent } from '../types';
import { formatDate, getTermStatus, getTransitionTriggerDate } from '../helpers';

interface DataTableViewProps {
    terms: AcademicTerm[];
    events: AcademicEvent[];
}

export function DataTableView({ terms, events }: DataTableViewProps) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
                <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        Academic Terms Schedule
                    </Typography>
                </Box>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Term</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Start Date</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>End Date</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Progression Trigger</TableCell>
                            <TableCell align="center" sx={{ fontWeight: 700 }}>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {terms.map((term) => {
                            const status = getTermStatus(term.startDate, term.endDate);
                            return (
                                <TableRow key={term.id} hover>
                                    <TableCell sx={{ fontWeight: 700 }}>{term.term} Term</TableCell>
                                    <TableCell>{formatDate(term.startDate)}</TableCell>
                                    <TableCell>{formatDate(term.endDate)}</TableCell>
                                    <TableCell>{getTransitionTriggerDate(term.startDate)}</TableCell>
                                    <TableCell align="center">
                                        <Chip label={status} size="small" color={status === 'Active' ? 'success' : 'default'} />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
                <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                        Academic Milestones & Events
                    </Typography>
                </Box>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Event Title</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Start Date</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>End Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {events.map((ev) => (
                            <TableRow key={ev.id} hover>
                                <TableCell sx={{ fontWeight: 700 }}>{ev.title}</TableCell>
                                <TableCell>{formatDate(ev.startDate)}</TableCell>
                                <TableCell>{formatDate(ev.endDate)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}