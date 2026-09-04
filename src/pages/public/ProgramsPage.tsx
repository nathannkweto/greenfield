import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Button,
    Paper,
    Chip,
    useTheme,
    useMediaQuery,
    Dialog,
    DialogTitle,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    IconButton,
    CircularProgress,
    Alert
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { useQuery } from '@apollo/client/react';
import { GET_PROGRAMS_PAGE_DATA } from './public.ts';

interface School {
    id: string;
    name: string;
    description?: string;
}

interface Program {
    id: string;
    title: string;
    shortDescription: string;
    schoolId?: string;
    school?: School;
}

// Relay Connection GraphQL Types
interface Connection<T> {
    edges?: Array<{
        node: T;
    }>;
    data?: T[];
}

interface GetProgramsPageDataResponse {
    schools?: School[] | Connection<School>;
    programs?: Program[] | Connection<Program>;
}

export default function ProgramsPage() {
    const [selectedSchoolId, setSelectedSchoolId] = useState<string>('All');
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    // Fetch GraphQL Data
    const { loading, error, data } = useQuery<GetProgramsPageDataResponse>(GET_PROGRAMS_PAGE_DATA);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Alert severity="error">Failed to load programs. Please try again later.</Alert>
            </Container>
        );
    }

    // Safely unwrap Relay connections (edges -> node), flat arrays, or standard pagination
    const schools: School[] = Array.isArray(data?.schools)
        ? data.schools
        : 'edges' in (data?.schools || {})
            ? data?.schools?.edges?.map((edge) => edge.node) || []
            : data?.schools?.data || [];

    const programs: Program[] = Array.isArray(data?.programs)
        ? data.programs
        : 'edges' in (data?.programs || {})
            ? data?.programs?.edges?.map((edge) => edge.node) || []
            : data?.programs?.data || [];

    const selectedSchool = schools.find((s) => s.id === selectedSchoolId);
    const pageDescription = selectedSchool?.description
        || "Explore our wide range of industry-relevant programs across all our specialized schools.";

    const filteredPrograms = selectedSchoolId === 'All'
        ? programs
        : programs.filter((p) => (p.schoolId || p.school?.id) === selectedSchoolId);

    const handleSelectMobile = (id: string) => {
        setSelectedSchoolId(id);
        setIsFilterOpen(false);
    };

    return (
        <Container maxWidth="lg" sx={{ py: isMobile ? 4 : 6, pt: isMobile ? { xs: '80px', sm: '88px' } : undefined }}>
            {/* HEADER AREA */}
            <Box sx={{ mb: isMobile ? 3 : 5, textAlign: isMobile ? 'left' : 'center', px: isMobile ? 2 : 0 }}>
                <Typography variant={isMobile ? "h4" : "h3"} component="h1" sx={{ fontWeight: 800, mb: 1.5 }}>
                    {selectedSchool ? selectedSchool.name : 'Academic Programs'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: '60ch', mx: isMobile ? 0 : 'auto', lineHeight: 1.6 }}>
                    {pageDescription}
                </Typography>
            </Box>

            {/* DESKTOP FILTER TABS */}
            {!isMobile && (
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, mb: 6, flexWrap: 'wrap' }}>
                    <Button
                        variant={selectedSchoolId === 'All' ? 'contained' : 'outlined'}
                        onClick={() => setSelectedSchoolId('All')}
                    >
                        All
                    </Button>
                    {schools.map((school) => (
                        <Button
                            key={school.id}
                            variant={selectedSchoolId === school.id ? 'contained' : 'outlined'}
                            onClick={() => setSelectedSchoolId(school.id)}
                        >
                            {school.name}
                        </Button>
                    ))}
                </Box>
            )}

            {/* MOBILE FILTER TRIGGER */}
            {isMobile && (
                <Box sx={{ px: 2, mb: 4 }}>
                    <Button
                        variant="outlined"
                        color="inherit"
                        fullWidth
                        startIcon={<FilterListIcon />}
                        onClick={() => setIsFilterOpen(true)}
                        sx={{
                            justifyContent: 'space-between',
                            py: 1.5,
                            px: 2,
                            borderRadius: '12px',
                            borderColor: '#e2e8f0',
                            textTransform: 'none',
                            fontWeight: 600
                        }}
                    >
                        Filter: {selectedSchool ? selectedSchool.name : 'All Programs'}
                    </Button>

                    <Dialog open={isFilterOpen} onClose={() => setIsFilterOpen(false)} fullWidth maxWidth="xs">
                        {/* component="div" stops DialogTitle from rendering an <h2>, fixing the hydration error */}
                        <DialogTitle component="div" sx={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>Select School</Typography>
                            <IconButton onClick={() => setIsFilterOpen(false)} aria-label="close">
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>
                        <List sx={{ p: 1 }}>
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => handleSelectMobile('All')} selected={selectedSchoolId === 'All'} sx={{ borderRadius: 1 }}>
                                    <ListItemText
                                        primary={
                                            <Typography sx={{ fontWeight: selectedSchoolId === 'All' ? 700 : 500 }}>
                                                All Programs
                                            </Typography>
                                        }
                                    />
                                </ListItemButton>
                            </ListItem>
                            {schools.map((school) => (
                                <ListItem key={school.id} disablePadding>
                                    <ListItemButton onClick={() => handleSelectMobile(school.id)} selected={selectedSchoolId === school.id} sx={{ borderRadius: 1 }}>
                                        <ListItemText
                                            primary={
                                                <Typography sx={{ fontWeight: selectedSchoolId === school.id ? 700 : 500 }}>
                                                    {school.name}
                                                </Typography>
                                            }
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Dialog>
                </Box>
            )}

            {/* PROGRAMS CONTAINER */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
                gap: 3,
                px: isMobile ? 2 : 0
            }}>
                {filteredPrograms.map((program) => {
                    const school = schools.find((s) => s.id === program.schoolId) || program.school;
                    return (
                        <Paper
                            key={program.id}
                            variant="outlined"
                            sx={{
                                p: 3,
                                borderRadius: isMobile ? 3 : 4,
                                borderColor: '#e5e7eb',
                                display: 'flex',
                                flexDirection: 'column',
                                backgroundColor: 'background.paper'
                            }}
                        >
                            <Box sx={{ mb: 2 }}>
                                {school?.name && (
                                    <Chip
                                        label={school.name}
                                        size="small"
                                        sx={{
                                            mb: 1.5,
                                            backgroundColor: 'rgba(46, 125, 50, 0.08)',
                                            color: 'primary.main',
                                            fontWeight: 600,
                                            maxWidth: '100%'
                                        }}
                                    />
                                )}
                                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1, fontSize: '1.15rem', lineHeight: 1.3 }}>
                                    {program.title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.5 }}>
                                    {program.shortDescription}
                                </Typography>
                            </Box>

                            <Box sx={{ mt: 'auto' }}>
                                <Button
                                    component={RouterLink}
                                    to={`/programs/${program.id}`}
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<SchoolIcon />}
                                    sx={{ borderRadius: 2.5, py: 1, textTransform: 'none', fontWeight: 600 }}
                                >
                                    Learn More
                                </Button>
                            </Box>
                        </Paper>
                    );
                })}
            </Box>
        </Container>
    );
}