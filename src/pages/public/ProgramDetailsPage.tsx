import {
    Container,
    Box,
    Typography,
    Paper,
    Stack,
    Button,
    useTheme,
    useMediaQuery
} from '@mui/material';
import Grid from '@mui/material/Grid';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { PROGRAMS } from '../../data/programs';
import { Navigate, useParams, Link as RouterLink } from 'react-router-dom';

export default function ProgramDetailsPage() {
    const { programId } = useParams();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const program = PROGRAMS.find((p) => p.id === programId);

    // If ID doesn't exist, redirect back to programs list
    if (!program) return <Navigate to="/programs" />;

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>

            {/* ================= SECTION 1: Program Overview ================= */}
            <Paper
                variant="outlined"
                sx={{
                    p: { xs: 3, md: 4 },
                    borderRadius: { xs: 3, md: 4 },
                    borderColor: '#e5e7eb',
                    mb: { xs: 4, md: 5 }
                }}
            >
                {/* Title and Top Action Layout */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', md: 'center' },
                    gap: 2.5,
                    mb: 3
                }}>
                    <Typography
                        variant={isMobile ? "h5" : "h4"}
                        sx={{ fontWeight: 800, lineHeight: 1.3, flexGrow: 1 }}
                    >
                        {program.title}
                    </Typography>

                    <Button
                        component={RouterLink}
                        to={`/apply?program=${program.id}`}
                        variant="contained"
                        color="primary"
                        size={isMobile ? "medium" : "large"}
                        disableElevation
                        fullWidth={isMobile}
                        sx={{
                            borderRadius: 2.5,
                            fontWeight: 700,
                            whiteSpace: 'nowrap',
                            px: 4,
                            py: isMobile ? 1.2 : 1.5
                        }}
                    >
                        Apply Now
                    </Button>
                </Box>

                {/* Info Grid metrics */}
                <Grid container spacing={isMobile ? 2 : 3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', p: isMobile ? 1.5 : 0, bgcolor: isMobile ? '#f8fafc' : 'transparent', borderRadius: 2 }}>
                            <AccessTimeIcon color="primary" />
                            <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>Duration</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 700 }}>{program.duration}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', p: isMobile ? 1.5 : 0, bgcolor: isMobile ? '#f8fafc' : 'transparent', borderRadius: 2 }}>
                            <WorkspacePremiumIcon color="primary" />
                            <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>Qualification</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 700 }}>{program.qualification}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800, mt: { xs: 1, md: 2 }, color: 'text.primary' }}>
                            Admission Requirements:
                        </Typography>
                        <Box component="ul" sx={{ pl: 2.5, mt: 1, mb: 0, color: 'text.secondary', typography: 'body2', lineHeight: 1.7 }}>
                            {program.requirements.map((req, i) => (
                                <li key={i} style={{ marginBottom: '4px' }}>{req}</li>
                            ))}
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* ================= SECTION 2: Description ================= */}
            <Box sx={{ mb: { xs: 4, md: 5 } }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Program Description</Typography>
                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, fontSize: { xs: '0.95rem', md: '1rem' } }}>
                    {program.longDescription}
                </Typography>
            </Box>

            {/* ================= SECTION 3: Curriculum ================= */}
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Curriculum Breakdown</Typography>
            <Stack spacing={2.5}>
                {program.curriculum.map((yearData) => (
                    <Paper key={yearData.year} variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 3, borderColor: '#e5e7eb' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2, color: 'primary.main' }}>
                            Year {yearData.year}
                        </Typography>
                        <Grid container spacing={isMobile ? 2 : 3}>
                            {Object.entries(yearData.terms).map(([term, courses]) => (
                                <Grid key={term} size={{ xs: 12, sm: 6 }}>
                                    <Typography variant="subtitle2" sx={{ color: 'text.primary', mb: 1, fontWeight: 700, fontSize: '0.85rem' }}>
                                        {term}
                                    </Typography>
                                    <Stack spacing={1}>
                                        {courses.map((course) => (
                                            <Box key={course} sx={{ p: 1.5, bgcolor: '#f8fafc', borderRadius: 2, border: '1px solid #f1f5f9' }}>
                                                <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.secondary' }}>{course}</Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                ))}
            </Stack>
        </Container>
    );
}