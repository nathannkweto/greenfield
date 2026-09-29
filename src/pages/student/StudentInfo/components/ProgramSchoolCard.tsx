import { Paper, Typography, Grid, Chip } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

import type { Program } from '../types';
import { formatProgramLevel } from '../helpers';

interface ProgramSchoolCardProps {
    program: Program;
}

export function ProgramSchoolCard({ program }: ProgramSchoolCardProps) {
    return (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3.5, borderColor: 'divider' }}>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AccountBalanceIcon color="primary" /> Program & Faculty Overview
            </Typography>

            <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        School
                    </Typography>
                    <Typography variant="body1" fontWeight={700}>
                        {program.school.name}
                    </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Program Title
                    </Typography>
                    <Typography variant="body1" fontWeight={700}>
                        {program.title}
                    </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Program Code
                    </Typography>
                    <Typography variant="body1" fontWeight={700} sx={{ fontFamily: 'monospace' }}>
                        {program.code}
                    </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Program Level
                    </Typography>
                    <Chip label={formatProgramLevel(program.level)} size="small" variant="outlined" sx={{ fontWeight: 700, mt: 0.5 }} />
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Duration
                    </Typography>
                    <Typography variant="body1" fontWeight={700}>
                        {program.durationValue} {program.durationUnit}
                    </Typography>
                </Grid>

                {program.shortDescription && (
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                            Description
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            {program.shortDescription}
                        </Typography>
                    </Grid>
                )}
            </Grid>
        </Paper>
    );
}
