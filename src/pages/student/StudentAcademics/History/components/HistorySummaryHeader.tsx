import { Paper, Grid, Box, Typography, Chip } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import type {StudentHistoryData} from '../types';

interface HistorySummaryHeaderProps {
    student: StudentHistoryData;
    totalYearsSpent: number;
}

export function HistorySummaryHeader({ student, totalYearsSpent }: HistorySummaryHeaderProps) {
    const regDate = student.admissionDate || student.applicationDate || student.createdAt;
    const formattedRegDate = new Date(regDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <Grid container spacing={2.5} sx={{ mb: 3 }}>
            {/* Date of Registration Card */}
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
                        <CalendarMonthIcon fontSize="medium" />
                    </Box>
                    <Box>
                        <Typography variant="body2" color="text.secondary" fontWeight={600}>
                            Registered Date
                        </Typography>
                        <Typography variant="h6" fontWeight={800}>
                            {formattedRegDate}
                        </Typography>
                    </Box>
                </Paper>
            </Grid>

            {/* College Duration */}
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
                            backgroundColor: 'secondary.main',
                            color: 'secondary.contrastText',
                            display: 'flex',
                        }}
                    >
                        <HistoryEduIcon fontSize="medium" />
                    </Box>
                    <Box>
                        <Typography variant="body2" color="text.secondary" fontWeight={600}>
                            Time at College
                        </Typography>
                        <Typography variant="h6" fontWeight={800}>
                            {totalYearsSpent} {totalYearsSpent === 1 ? 'Year' : 'Years'}
                        </Typography>
                    </Box>
                </Paper>
            </Grid>

            {/* Program Info */}
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

            {/* Total Course Count */}
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
                        <MenuBookIcon fontSize="medium" />
                    </Box>
                    <Box>
                        <Typography variant="body2" color="text.secondary" fontWeight={600}>
                            Total Enrollments
                        </Typography>
                        <Typography variant="h6" fontWeight={800}>
                            {student.enrollments.length} Courses
                        </Typography>
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
}