import { Paper, Box, Avatar, Typography, Chip, Stack, Divider } from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import SchoolIcon from '@mui/icons-material/School';
import EventIcon from '@mui/icons-material/Event';

import type { Student } from '../types';
import { getFullName, getInitials, getStatusColor, formatProgramLevel } from '../helpers';

interface StudentHeaderCardProps {
    student: Student;
}

export function StudentHeaderCard({ student }: StudentHeaderCardProps) {
    const primaryId = student.studentNumber || student.admissionNumber || student.applicationNumber;

    return (
        <Paper
            variant="outlined"
            sx={{
                p: { xs: 2.5, sm: 3.5 },
                borderRadius: 4,
                borderColor: 'divider',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 3,
                }}
            >
                <Avatar
                    sx={{
                        width: { xs: 72, sm: 90 },
                        height: { xs: 72, sm: 90 },
                        backgroundColor: 'primary.main',
                        color: 'primary.contrastText',
                        fontSize: { xs: '1.75rem', sm: '2.25rem' },
                        fontWeight: 800,
                        boxShadow: '0 4px 14px rgba(25, 118, 210, 0.25)',
                    }}
                >
                    {getInitials(student.firstName, student.lastName)}
                </Avatar>

                <Box sx={{ flexGrow: 1 }}>
                    <Stack
                        direction="row"
                        spacing={1.5}
                        sx={{ mb: 0.75, alignItems: 'center', flexWrap: 'wrap' }}
                    >
                        <Typography variant="h4" fontWeight={900} color="text.primary">
                            {getFullName(student)}
                        </Typography>
                        <Chip
                            label={student.status}
                            color={getStatusColor(student.status)}
                            size="small"
                            sx={{ fontWeight: 800, textTransform: 'uppercase', height: 24 }}
                        />
                    </Stack>

                    <Typography variant="subtitle1" fontWeight={700} color="text.secondary" sx={{ mb: 1.5 }}>
                        {student.program.title} ({student.program.code})
                    </Typography>

                    <Stack
                        direction="row"
                        spacing={2.5}
                        divider={<Divider orientation="vertical" flexItem />}
                        sx={{ flexWrap: 'wrap' }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <BadgeIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                                ID: <strong>{primaryId}</strong>
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                            <SchoolIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                                Level: <strong>{formatProgramLevel(student.program.level)}</strong>
                            </Typography>
                        </Box>

                        {student.intake && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                                <EventIcon fontSize="small" color="action" />
                                <Typography variant="body2" color="text.secondary">
                                    Intake: <strong>{student.intake}</strong> {student.studyMode ? `(${student.studyMode})` : ''}
                                </Typography>
                            </Box>
                        )}
                    </Stack>
                </Box>
            </Box>
        </Paper>
    );
}
