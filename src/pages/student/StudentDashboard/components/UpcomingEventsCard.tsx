import { Paper, Box, Typography, Stack, Divider } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import type { AcademicEvent } from '../types';
import { formatDate } from '../helpers';

interface UpcomingEventsCardProps {
    events: AcademicEvent[];
}

export function UpcomingEventsCard({ events }: UpcomingEventsCardProps) {
    return (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 4, height: '100%', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2.5 }}>
                <EventIcon color="primary" />
                <Typography variant="h6" fontWeight={800}>
                    Upcoming Events
                </Typography>
            </Box>

            {events.length === 0 ? (
                <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                    No upcoming academic events scheduled.
                </Typography>
            ) : (
                <Stack spacing={2} divider={<Divider flexItem />}>
                    {events.map((event) => (
                        <Box key={event.id} sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 1,
                                    minWidth: 54,
                                    textAlign: 'center',
                                    backgroundColor: 'action.hover',
                                    borderRadius: 2,
                                    border: 1,
                                    borderColor: 'divider',
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    color="primary.main"
                                    fontWeight={800}
                                    sx={{ display: 'block' }}
                                >
                                    {new Date(event.startDate).toLocaleString('en-US', { month: 'short' }).toUpperCase()}
                                </Typography>
                                <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1 }}>
                                    {new Date(event.startDate).getDate()}
                                </Typography>
                            </Paper>

                            <Box sx={{ flexGrow: 1 }}>
                                <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                                    {event.title}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ display: 'block', mt: 0.25 }}
                                >
                                    {formatDate(event.startDate)}
                                    {event.endDate && event.endDate !== event.startDate ? ` - ${formatDate(event.endDate)}` : ''}
                                </Typography>
                            </Box>
                        </Box>
                    ))}
                </Stack>
            )}
        </Paper>
    );
}
