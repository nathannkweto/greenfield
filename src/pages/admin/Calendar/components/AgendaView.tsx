import { useMemo } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Chip,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Alert,
    Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import type { AcademicTerm, AcademicEvent } from '../types';
import { formatDateRange, getTermStatus, getTransitionTriggerDate } from '../helpers';

interface AgendaViewProps {
    terms: AcademicTerm[];
    events: AcademicEvent[];
    onAddEventClick: (dateStr: string) => void;
}

export function AgendaView({ terms, events, onAddEventClick }: AgendaViewProps) {
    const termEventsMap = useMemo(() => {
        const map = new Map<string, AcademicEvent[]>();
        terms.forEach((t) => map.set(t.id, []));
        const unassigned: AcademicEvent[] = [];

        events.forEach((ev) => {
            const evStart = new Date(ev.startDate).getTime();
            let matched = false;
            for (const term of terms) {
                const tStart = new Date(term.startDate).getTime();
                const tEnd = new Date(term.endDate).getTime();
                if (evStart >= tStart && evStart <= tEnd) {
                    map.get(term.id)?.push(ev);
                    matched = true;
                    break;
                }
            }
            if (!matched) unassigned.push(ev);
        });

        return { map, unassigned };
    }, [terms, events]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {terms.map((term) => {
                const status = getTermStatus(term.startDate, term.endDate);
                const triggerDate = getTransitionTriggerDate(term.startDate);
                const termEvs = termEventsMap.map.get(term.id) || [];

                return (
                    <Accordion key={term.id} defaultExpanded variant="outlined" sx={{ borderRadius: '12px !important' }}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', pr: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                    <DateRangeIcon color="primary" />
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                        {term.term} Term
                                    </Typography>
                                    <Chip
                                        label={status}
                                        size="small"
                                        color={status === 'Active' ? 'success' : status === 'Upcoming' ? 'primary' : 'default'}
                                    />
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                                    {formatDateRange(term.startDate, term.endDate)}
                                </Typography>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{ pt: 0 }}>
                            <Divider sx={{ mb: 2 }} />

                            <Alert severity="info" icon={<InfoOutlinedIcon fontSize="small" />} sx={{ mb: 2 }}>
                                <strong>System Progression Trigger:</strong> {triggerDate} (2nd Saturday prior to term start)
                            </Alert>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                                    SCHEDULED EVENTS ({termEvs.length})
                                </Typography>
                                <Button
                                    size="small"
                                    startIcon={<AddIcon />}
                                    onClick={() => onAddEventClick(term.startDate)}
                                >
                                    Add Event to Term
                                </Button>
                            </Box>

                            {termEvs.length > 0 ? (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {termEvs.map((ev) => (
                                        <Paper
                                            key={ev.id}
                                            variant="outlined"
                                            sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: 'action.hover' }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <EventIcon fontSize="small" color="action" />
                                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                    {ev.title}
                                                </Typography>
                                            </Box>
                                            <Chip
                                                label={formatDateRange(ev.startDate, ev.endDate)}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </Paper>
                                    ))}
                                </Box>
                            ) : (
                                <Typography variant="body2" color="text.secondary" sx={{ py: 1, fontStyle: 'italic' }}>
                                    No key milestones added for this term yet.
                                </Typography>
                            )}
                        </AccordionDetails>
                    </Accordion>
                );
            })}

            {termEventsMap.unassigned.length > 0 && (
                <Accordion variant="outlined" sx={{ borderRadius: '12px !important' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                            Year-Wide / Vacation Events ({termEventsMap.unassigned.length})
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ pt: 0 }}>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {termEventsMap.unassigned.map((ev) => (
                                <Paper key={ev.id} variant="outlined" sx={{ p: 1.5, display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                        {ev.title}
                                    </Typography>
                                    <Chip label={formatDateRange(ev.startDate, ev.endDate)} size="small" />
                                </Paper>
                            ))}
                        </Box>
                    </AccordionDetails>
                </Accordion>
            )}
        </Box>
    );
}