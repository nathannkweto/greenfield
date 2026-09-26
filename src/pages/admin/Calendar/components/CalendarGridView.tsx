import React from 'react';
import { Paper, Box, Typography, IconButton, Chip } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import type { AcademicTerm, AcademicEvent } from '../types';

interface CalendarGridViewProps {
    currentGridMonth: Date;
    setCurrentGridMonth: React.Dispatch<React.SetStateAction<Date>>;
    terms: AcademicTerm[];
    events: AcademicEvent[];
    onSelectDate: (dateStr: string) => void;
}

export function CalendarGridView({
                                     currentGridMonth,
                                     setCurrentGridMonth,
                                     terms,
                                     events,
                                     onSelectDate,
                                 }: CalendarGridViewProps) {
    const year = currentGridMonth.getFullYear();
    const month = currentGridMonth.getMonth();

    const monthName = currentGridMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' });

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDayOfWeek = new Date(year, month, 1).getDay();

    const handlePrevMonth = () => setCurrentGridMonth(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentGridMonth(new Date(year, month + 1, 1));

    return (
        <Paper variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {monthName}
                </Typography>
                <Box>
                    <IconButton onClick={handlePrevMonth}>
                        <ChevronLeftIcon />
                    </IconButton>
                    <IconButton onClick={handleNextMonth}>
                        <ChevronRightIcon />
                    </IconButton>
                </Box>
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, mb: 1, textAlign: 'center' }}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                    <Typography key={d} variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                        {d}
                    </Typography>
                ))}
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
                {Array.from({ length: startDayOfWeek }).map((_, idx) => (
                    <Box key={`empty-${idx}`} sx={{ minHeight: 90, bgcolor: 'action.hover', opacity: 0.3, borderRadius: 1 }} />
                ))}

                {Array.from({ length: daysInMonth }).map((_, idx) => {
                    const dayNum = idx + 1;
                    const dateObj = new Date(year, month, dayNum);
                    const dateStr = dateObj.toISOString().split('T')[0];

                    const activeTerm = terms.find((t) => {
                        const s = new Date(t.startDate).getTime();
                        const e = new Date(t.endDate).getTime();
                        const curr = dateObj.getTime();
                        return curr >= s && curr <= e;
                    });

                    const dayEvents = events.filter((ev) => {
                        const s = new Date(ev.startDate).getTime();
                        const e = new Date(ev.endDate).getTime();
                        const curr = dateObj.getTime();
                        return curr >= s && curr <= e;
                    });

                    return (
                        <Paper
                            key={dayNum}
                            variant="outlined"
                            onClick={() => onSelectDate(dateStr)}
                            sx={{
                                minHeight: 95,
                                p: 1,
                                cursor: 'pointer',
                                borderRadius: 1.5,
                                bgcolor: activeTerm ? 'action.selected' : 'background.paper',
                                borderColor: activeTerm ? 'primary.light' : 'divider',
                                '&:hover': { borderColor: 'primary.main', boxShadow: 1 },
                                transition: 'all 0.15s',
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                <Typography variant="caption" sx={{ fontWeight: 800 }}>
                                    {dayNum}
                                </Typography>
                                {activeTerm && (
                                    <Chip label={activeTerm.term[0]} size="small" color="primary" sx={{ height: 16, fontSize: '0.625rem' }} />
                                )}
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, overflow: 'hidden' }}>
                                {dayEvents.slice(0, 2).map((ev) => (
                                    <Box
                                        key={ev.id}
                                        sx={{
                                            bgcolor: 'primary.main',
                                            color: '#fff',
                                            px: 0.5,
                                            py: 0.2,
                                            borderRadius: 0.5,
                                            fontSize: '0.65rem',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            fontWeight: 600,
                                        }}
                                    >
                                        {ev.title}
                                    </Box>
                                ))}
                                {dayEvents.length > 2 && (
                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.625rem' }}>
                                        +{dayEvents.length - 2} more
                                    </Typography>
                                )}
                            </Box>
                        </Paper>
                    );
                })}
            </Box>
        </Paper>
    );
}