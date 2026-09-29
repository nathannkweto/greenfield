import { Paper, Box, Stack, Avatar, Typography, Chip } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import type { Student } from '../types';
import { getGreeting, getInitials, formatDate } from '../helpers';

interface WelcomeHeaderProps {
    student: Student;
}

export function WelcomeHeader({ student }: WelcomeHeaderProps) {
    const fullName = [student.firstName, student.middleNames, student.lastName].filter(Boolean).join(' ');
    const todayFormatted = formatDate(new Date().toISOString(), {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <Paper
            variant="outlined"
            sx={{
                p: { xs: 2.5, md: 3.5 },
                borderRadius: 4,
                backgroundColor: 'background.paper',
                borderColor: 'divider',
            }}
        >
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2.5}
                sx={{
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    justifyContent: 'space-between',
                }}
            >
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                    <Avatar
                        sx={{
                            width: 64,
                            height: 64,
                            backgroundColor: 'primary.main',
                            fontWeight: 800,
                            fontSize: '1.5rem',
                        }}
                    >
                        {getInitials(student.firstName, student.lastName)}
                    </Avatar>
                    <Box>
                        <Typography variant="body2" color="text.secondary" fontWeight={600}>
                            {getGreeting()},
                        </Typography>
                        <Typography variant="h5" fontWeight={800} sx={{ lineHeight: 1.2 }}>
                            {fullName}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 0.5, alignItems: 'center' }}>
                            <Typography variant="caption" color="text.secondary" fontWeight={700}>
                                ID: {student.studentNumber || 'N/A'}
                            </Typography>
                            <Typography variant="caption" color="text.disabled">•</Typography>
                            <Typography variant="caption" color="primary.main" fontWeight={700}>
                                {student.program.title} ({student.program.code})
                            </Typography>
                        </Stack>
                    </Box>
                </Stack>

                <Chip
                    icon={<CalendarTodayIcon sx={{ fontSize: '1rem !important' }} />}
                    label={todayFormatted}
                    variant="outlined"
                    color="default"
                    sx={{ fontWeight: 600, py: 2, borderRadius: 3 }}
                />
            </Stack>
        </Paper>
    );
}