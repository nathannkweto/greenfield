import { useState, useEffect } from 'react';
import { Paper, Box, Typography, Chip, LinearProgress } from '@mui/material';
import DateRangeIcon from '@mui/icons-material/DateRange';
import type { AcademicTerm } from '../types';
import { formatDate } from '../helpers';

interface TermStatusCardProps {
    currentTerm: AcademicTerm | null;
}

export function TermStatusCard({ currentTerm }: TermStatusCardProps) {
    // Capture initial timestamp during mount via lazy initializer
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        // Defer update to next animation frame to avoid synchronous setState inside effect
        const frameId = requestAnimationFrame(() => {
            setNow(Date.now());
        });
        return () => cancelAnimationFrame(frameId);
    }, [currentTerm]);

    if (!currentTerm) {
        return (
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>
                    Academic Session
                </Typography>
                <Typography variant="body2" color="text.disabled" sx={{ mt: 1 }}>
                    No active term recorded.
                </Typography>
            </Paper>
        );
    }

    const start = new Date(currentTerm.startDate).getTime();
    const end = new Date(currentTerm.endDate).getTime();
    const total = end - start;
    const elapsed = total > 0 ? Math.max(0, Math.min(now - start, total)) : 0;
    const progressPercent = total > 0 ? Math.round((elapsed / total) * 100) : 0;

    return (
        <Paper
            variant="outlined"
            sx={{
                p: 3,
                borderRadius: 3,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderColor: 'divider',
            }}
        >
            <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={700}
                        sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}
                    >
                        Current Term
                    </Typography>
                    <Chip
                        label={`Year ${currentTerm.academicYear.year}`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: 700 }}
                    />
                </Box>

                <Typography variant="h6" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DateRangeIcon color="primary" fontSize="small" />
                    {currentTerm.term}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {formatDate(currentTerm.startDate)} — {formatDate(currentTerm.endDate)}
                </Typography>
            </Box>

            <Box sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        Term Progress
                    </Typography>
                    <Typography variant="caption" color="primary.main" fontWeight={700}>
                        {progressPercent}%
                    </Typography>
                </Box>
                <LinearProgress variant="determinate" value={progressPercent} sx={{ height: 6, borderRadius: 3 }} />
            </Box>
        </Paper>
    );
}
