import { Box, Paper, Grid, Typography, Chip } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import GradeIcon from '@mui/icons-material/Grade';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import type { StudentResultsData } from '../types.ts';

interface ResultsSummaryCardsProps {
    student: StudentResultsData;
}

export function ResultsSummaryCards({ student }: ResultsSummaryCardsProps) {
    const currentYear = student.academicProgress?.current_year ?? 1;
    const displayCgpa = (student.academicProgress?.cgpa ?? student.cgpa ?? 0).toFixed(2);
    const totalEarnedCredits = student.academicProgress?.credits_earned ?? student.creditsCompleted ?? 0;

    return (
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
            {/* Cumulative GPA */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper
                    variant="outlined"
                    sx={{
                        p: 2.5,
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: 2,
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText',
                            display: 'flex',
                        }}
                    >
                        <GradeIcon fontSize="medium" />
                    </Box>
                    <Box>
                        <Typography variant="body2" color="text.secondary" fontWeight={600}>
                            Cumulative GPA
                        </Typography>

                        <Typography variant="h4" fontWeight={800} color="primary.main">
                            {displayCgpa}
                        </Typography>
                    </Box>
                </Paper>
            </Grid>

            {/* Earned Credits */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper
                    variant="outlined"
                    sx={{
                        p: 2.5,
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: 2,
                            backgroundColor: 'success.main',
                            color: 'success.contrastText',
                            display: 'flex',
                        }}
                    >
                        <FactCheckIcon fontSize="medium" />
                    </Box>
                    <Box>
                        <Typography variant="body2" color="text.secondary" fontWeight={600}>
                            Total Earned Credits
                        </Typography>
                        <Typography variant="h4" fontWeight={800} color="success.main">
                            {totalEarnedCredits}
                        </Typography>
                    </Box>
                </Paper>
            </Grid>

            {/* Current Academic Year */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper
                    variant="outlined"
                    sx={{
                        p: 2.5,
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: 2,
                            backgroundColor: 'warning.main',
                            color: 'warning.contrastText',
                            display: 'flex',
                        }}
                    >
                        <EventRepeatIcon fontSize="medium" />
                    </Box>
                    <Box>
                        <Typography variant="body2" color="text.secondary" fontWeight={600}>
                            Academic Standing
                        </Typography>
                        <Typography variant="h5" fontWeight={800} color="warning.dark">
                            Year {currentYear}
                        </Typography>
                    </Box>
                </Paper>
            </Grid>

            {/* Program Details */}
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Paper
                    variant="outlined"
                    sx={{
                        p: 2.5,
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <Box
                        sx={{
                            p: 1.5,
                            borderRadius: 2,
                            backgroundColor: 'action.selected',
                            color: 'text.primary',
                            display: 'flex',
                        }}
                    >
                        <SchoolIcon fontSize="medium" />
                    </Box>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="body2" color="text.secondary" fontWeight={600} noWrap>
                            Program
                        </Typography>
                        <Typography variant="subtitle2" fontWeight={800} noWrap>
                            {student.program.code}
                        </Typography>
                        <Chip
                            label={student.program.level}
                            size="small"
                            variant="outlined"
                            sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700 }}
                        />
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
}
