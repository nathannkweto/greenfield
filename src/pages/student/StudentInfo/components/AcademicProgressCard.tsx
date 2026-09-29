import { Paper, Box, Typography, Grid, LinearProgress, Chip } from '@mui/material';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import SchoolIcon from '@mui/icons-material/School';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

import type {AcademicProgress} from '../types';
import { getAcademicStanding } from '../helpers';

interface AcademicProgressCardProps {
    progress?: AcademicProgress;
}

export function AcademicProgressCard({ progress }: AcademicProgressCardProps) {
    if (!progress) {
        return (
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3.5, borderColor: 'divider' }}>
                <Typography variant="subtitle1" fontWeight={800} color="text.primary" sx={{ mb: 1 }}>
                    Academic Progress
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    No official academic progress recorded yet.
                </Typography>
            </Paper>
        );
    }

    const standing = getAcademicStanding(progress.cgpa);
    const maxCgpa = 4.0;
    const cgpaPercentage = Math.min(100, (progress.cgpa / maxCgpa) * 100);

    return (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3.5, borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Typography variant="h6" fontWeight={800} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AutoGraphIcon color="primary" /> Academic Performance Summary
                </Typography>
                <Chip
                    label={standing.label}
                    size="small"
                    sx={{ fontWeight: 800, bgcolor: 'rgba(25, 118, 210, 0.08)', color: standing.color }}
                />
            </Box>

            <Grid container spacing={3}>
                {/* CGPA METRIC */}
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                            Cumulative GPA (CGPA)
                        </Typography>
                        <Typography variant="h3" fontWeight={900} color="primary.main" sx={{ my: 0.5 }}>
                            {progress.cgpa.toFixed(2)}
                        </Typography>
                        <LinearProgress
                            variant="determinate"
                            value={cgpaPercentage}
                            color="primary"
                            sx={{ height: 6, borderRadius: 3, mt: 1 }}
                        />
                        <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: 'block' }}>
                            Scale: 0.00 - 4.00
                        </Typography>
                    </Box>
                </Grid>

                {/* YEAR OF STUDY */}
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <SchoolIcon color="action" fontSize="small" />
                            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                                Current Year
                            </Typography>
                        </Box>
                        <Typography variant="h4" fontWeight={900} color="text.primary">
                            Year {progress.current_year}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            Active academic progression stage.
                        </Typography>
                    </Box>
                </Grid>

                {/* CREDITS EARNED */}
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <WorkspacePremiumIcon color="action" fontSize="small" />
                            <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase' }}>
                                Credits Earned
                            </Typography>
                        </Box>
                        <Typography variant="h4" fontWeight={900} color="text.primary">
                            {progress.credits_earned} <Typography component="span" variant="body2" color="text.secondary">Units</Typography>
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            Total completed course weight.
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
}