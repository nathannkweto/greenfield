import {
    Container,
    Box,
    Typography,
    Paper,
    Stack,
    Button,
    useTheme,
    useMediaQuery,
    CircularProgress,
    Alert
} from '@mui/material';
import Grid from '@mui/material/Grid';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import { GET_PROGRAM_DETAILS } from './public.ts';

interface School {
    id: string;
    name: string;
}

interface Course {
    id: string;
    code?: string;
    title: string;
    credits?: number;
    school?: School;
}

interface CurriculumItem {
    id: string;
    year: number;
    course?: Course;
}

interface Requirement {
    id: string;
    description: string;
    sortOrder?: number;
}

interface Program {
    id: string;
    code?: string;
    title: string;
    level?: string;
    durationValue?: number;
    durationUnit?: string;
    shortDescription?: string;
    longDescription?: string;
    requirements?: Requirement[];
    curricula?: CurriculumItem[];
    school?: School;
}

interface GetProgramDetailsData {
    program?: Program;
}

interface GetProgramDetailsVars {
    id?: string;
}

interface FormattedYear {
    year: number;
    courses: Course[];
}

function formatDuration(value?: number, unit?: string): string {
    if (!value) return 'N/A';
    const formattedUnit = unit ? unit.toLowerCase() : 'year';
    return `${value} ${value === 1 ? formattedUnit : `${formattedUnit}s`}`;
}

function formatCurriculumData(curricula?: CurriculumItem[]): FormattedYear[] {
    if (!curricula || curricula.length === 0) return [];

    const yearsMap = new Map<number, Course[]>();

    curricula.forEach((item) => {
        if (!item.course) return;
        const yearKey = item.year;
        if (!yearsMap.has(yearKey)) {
            yearsMap.set(yearKey, []);
        }
        yearsMap.get(yearKey)!.push(item.course);
    });

    return Array.from(yearsMap.entries())
        .sort(([yearA], [yearB]) => yearA - yearB)
        .map(([year, courses]) => ({
            year,
            courses
        }));
}

export default function ProgramDetailsPage() {
    const { programId } = useParams<{ programId: string }>();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { loading, error, data } = useQuery<GetProgramDetailsData, GetProgramDetailsVars>(
        GET_PROGRAM_DETAILS,
        {
            variables: { id: programId },
            skip: !programId,
        }
    );

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !data?.program) {
        return (
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Alert severity="error">Program details not found.</Alert>
            </Container>
        );
    }

    const program = data.program;
    const formattedCurriculum = formatCurriculumData(program.curricula);
    const sortedRequirements = program.requirements
        ? [...program.requirements].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
        : [];

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>

            {/* SECTION 1: Program Overview */}
            <Paper
                variant="outlined"
                sx={{
                    p: { xs: 3, md: 4 },
                    borderRadius: { xs: 3, md: 4 },
                    borderColor: 'divider',
                    mb: { xs: 4, md: 5 }
                }}
            >
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', md: 'center' },
                    gap: 2.5,
                    mb: 3
                }}>
                    <Box>
                        {program.code && (
                            <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main', textTransform: 'uppercase', letterSpacing: 1 }}>
                                {program.code}
                            </Typography>
                        )}
                        <Typography
                            variant={isMobile ? "h5" : "h4"}
                            sx={{ fontWeight: 800, lineHeight: 1.3 }}
                        >
                            {program.title}
                        </Typography>
                    </Box>

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

                <Grid container spacing={isMobile ? 2 : 3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{
                            display: 'flex',
                            gap: 1.5,
                            alignItems: 'center',
                            p: isMobile ? 1.5 : 0,
                            backgroundColor: isMobile ? 'action.hover' : 'transparent',
                            borderRadius: 2
                        }}>
                            <AccessTimeIcon color="primary" />
                            <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>Duration</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 700 }}>{formatDuration(program.durationValue, program.durationUnit)}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Box sx={{
                            display: 'flex',
                            gap: 1.5,
                            alignItems: 'center',
                            p: isMobile ? 1.5 : 0,
                            backgroundColor: isMobile ? 'action.hover' : 'transparent',
                            borderRadius: 2
                        }}>
                            <WorkspacePremiumIcon color="primary" />
                            <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>Level / Qualification</Typography>
                                <Typography variant="body1" sx={{ fontWeight: 700 }}>{program.level || 'N/A'}</Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* REQUIREMENTS LIST */}
                    {sortedRequirements.length > 0 && (
                        <Grid size={{ xs: 12 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, mt: { xs: 1, md: 2 }, color: 'text.primary' }}>
                                Admission Requirements:
                            </Typography>
                            <Box component="ul" sx={{ pl: 2.5, mt: 1, mb: 0, color: 'text.secondary', typography: 'body2', lineHeight: 1.7 }}>
                                {sortedRequirements.map((req) => (
                                    <li key={req.id} style={{ marginBottom: '4px' }}>
                                        {req.description}
                                    </li>
                                ))}
                            </Box>
                        </Grid>
                    )}
                </Grid>
            </Paper>

            {/* SECTION 2: Description */}
            {(program.longDescription || program.shortDescription) && (
                <Box sx={{ mb: { xs: 4, md: 5 } }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Program Description</Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, fontSize: { xs: '0.95rem', md: '1rem' } }}>
                        {program.longDescription || program.shortDescription}
                    </Typography>
                </Box>
            )}

            {/* SECTION 3: Curriculum Breakdown */}
            {formattedCurriculum.length > 0 && (
                <>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Curriculum Breakdown</Typography>
                    <Stack spacing={2.5}>
                        {formattedCurriculum.map((yearData) => (
                            <Paper key={yearData.year} variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 3, borderColor: 'divider' }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2, color: 'primary.main' }}>
                                    Year {yearData.year}
                                </Typography>
                                <Grid container spacing={2}>
                                    {yearData.courses.map((course) => (
                                        <Grid key={course.id} size={{ xs: 12, sm: 6, md: 4 }}>
                                            <Box
                                                sx={{
                                                    p: 2,
                                                    backgroundColor: 'action.hover',
                                                    borderRadius: 2,
                                                    border: 1,
                                                    borderColor: 'divider',
                                                    height: '100%',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    justifyContent: 'space-between'
                                                }}
                                            >
                                                <Box>
                                                    {course.code && (
                                                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main', display: 'block', mb: 0.5 }}>
                                                            {course.code}
                                                        </Typography>
                                                    )}
                                                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                                        {course.title}
                                                    </Typography>
                                                </Box>
                                                {course.credits !== undefined && (
                                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                                        {course.credits} Credits
                                                    </Typography>
                                                )}
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Paper>
                        ))}
                    </Stack>
                </>
            )}
        </Container>
    );
}