import { Paper, Box, Typography, Tooltip, IconButton, useTheme, useMediaQuery } from '@mui/material';
import Grid from '@mui/material/Grid';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import AddIcon from '@mui/icons-material/Add';
import MetricCard from './MetricCard';
import type {Program} from '../types';
import { formatDuration, formatLevel } from '../helpers';

interface ProgramOverviewProps {
    program: Program;
    onOpenReqModal: () => void;
}

export default function ProgramOverview({ program, onOpenReqModal }: ProgramOverviewProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Paper
            variant="outlined"
            sx={{
                p: { xs: 3, md: 4 },
                borderRadius: { xs: 3, md: 4 },
                borderColor: 'divider',
                mb: { xs: 4, md: 5 },
            }}
        >
            <Box sx={{ mb: 3 }}>
                <Typography
                    variant={isMobile ? 'h5' : 'h4'}
                    sx={{ fontWeight: 800, lineHeight: 1.3 }}
                >
                    {program.code ? `${program.code}: ` : ''}{program.title}
                </Typography>
            </Box>

            <Grid container spacing={isMobile ? 2 : 3}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <MetricCard
                        icon={<AccessTimeIcon color="primary" />}
                        label="Duration"
                        value={formatDuration(program.durationValue, program.durationUnit)}
                    />
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                    <MetricCard
                        icon={<WorkspacePremiumIcon color="primary" />}
                        label="Qualification / Level"
                        value={formatLevel(program.level)}
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: { xs: 1, md: 2 } }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                            Admission Requirements
                        </Typography>
                        <Tooltip title="Add Requirement">
                            <IconButton size="small" color="primary" onClick={onOpenReqModal}>
                                <AddIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    {program.requirements && program.requirements.length > 0 ? (
                        <Box component="ul" sx={{ pl: 2.5, mt: 1, mb: 0, color: 'text.secondary', typography: 'body2', lineHeight: 1.7 }}>
                            {program.requirements.map((req) => (
                                <li key={req.id} style={{ marginBottom: '4px' }}>
                                    {req.description}
                                </li>
                            ))}
                        </Box>
                    ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', mt: 1 }}>
                            No admission requirements added yet. Click '+' above to add one.
                        </Typography>
                    )}
                </Grid>
            </Grid>
        </Paper>
    );
}