import { Card, CardContent, Box, Typography, Tooltip } from '@mui/material';
import type { AcademicYear, AcademicTerm } from '../types';
import { formatDateRange, getTermStatus } from '../helpers';

interface MacroGanttCardProps {
    year: AcademicYear;
    terms: AcademicTerm[];
}

export function MacroGanttCard({ year, terms }: MacroGanttCardProps) {
    const yearStart = new Date(year.startDate).getTime();
    const yearEnd = new Date(year.endDate).getTime();
    const totalDuration = yearEnd - yearStart || 1;

    return (
        <Card variant="outlined" sx={{ borderRadius: 3, mb: 4, overflow: 'visible' }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                        <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
                            Macro Year-at-a-Glance
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            Academic Year {year.year} Scope Timeline
                        </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                        {formatDateRange(year.startDate, year.endDate)}
                    </Typography>
                </Box>

                <Box
                    sx={{
                        position: 'relative',
                        height: 52,
                        bgcolor: 'action.hover',
                        borderRadius: 2,
                        p: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    {terms.map((term) => {
                        const termStart = new Date(term.startDate).getTime();
                        const termEnd = new Date(term.endDate).getTime();

                        let leftPercent = ((termStart - yearStart) / totalDuration) * 100;
                        let widthPercent = ((termEnd - termStart) / totalDuration) * 100;

                        leftPercent = Math.max(0, Math.min(100, leftPercent));
                        widthPercent = Math.max(2, Math.min(100 - leftPercent, widthPercent));

                        const status = getTermStatus(term.startDate, term.endDate);
                        const bgGradient =
                            status === 'Active'
                                ? 'linear-gradient(90deg, #2e7d32, #4caf50)'
                                : status === 'Upcoming'
                                    ? 'linear-gradient(90deg, #0288d1, #29b6f6)'
                                    : 'linear-gradient(90deg, #757575, #bdbdbd)';

                        return (
                            <Tooltip
                                key={term.id}
                                title={`${term.term} Term: ${formatDateRange(term.startDate, term.endDate)} (${status})`}
                            >
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        left: `${leftPercent}%`,
                                        width: `${widthPercent}%`,
                                        height: 'calc(100% - 8px)',
                                        background: bgGradient,
                                        borderRadius: 1.5,
                                        color: '#fff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        px: 1,
                                        boxShadow: 1,
                                        cursor: 'pointer',
                                        transition: 'transform 0.2s',
                                        '&:hover': { transform: 'scaleY(1.08)', zIndex: 2 },
                                    }}
                                >
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontWeight: 800,
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            fontSize: '0.75rem',
                                        }}
                                    >
                                        {term.term} Term
                                    </Typography>
                                </Box>
                            </Tooltip>
                        );
                    })}
                </Box>
            </CardContent>
        </Card>
    );
}