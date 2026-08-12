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
    IconButton
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { PROGRAMS } from '../../data/programs';
import { SCHOOLS } from '../../data/schools';

export default function ProgramsPage() {
    const [selectedSchoolId, setSelectedSchoolId] = useState('All');
    const [isFilterOpen, setIsFilterOpen] = useState(false); // Mobile filter state

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const selectedSchool = SCHOOLS.find(s => s.id === selectedSchoolId);
    const pageDescription = selectedSchool
        ? selectedSchool.description
        : "Explore our wide range of industry-relevant programs across all our specialized schools.";

    const filteredPrograms = selectedSchoolId === 'All'
        ? PROGRAMS
        : PROGRAMS.filter(p => p.schoolId === selectedSchoolId);

    // Helper to handle filter selection on mobile
    const handleSelectMobile = (id: string) => {
        setSelectedSchoolId(id);
        setIsFilterOpen(false);
    };

    return (
        <Container maxWidth="lg" sx={{ py: isMobile ? 4 : 6, pt: isMobile ? { xs: '80px', sm: '88px' } : undefined }}>

            {/* ================= HEADER AREA ================= */}
            <Box sx={{ mb: isMobile ? 3 : 5, textAlign: isMobile ? 'left' : 'center', px: isMobile ? 2 : 0 }}>
                <Typography variant={isMobile ? "h4" : "h3"} component="h1" sx={{ fontWeight: 800, mb: 1.5 }}>
                    {selectedSchool ? selectedSchool.name : 'Academic Programs'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', maxWidth: '60ch', mx: isMobile ? 0 : 'auto', lineHeight: 1.6 }}>
                    {pageDescription}
                </Typography>
            </Box>

            {/* ================= DESKTOP FILTER TABS ================= */}
            {!isMobile && (
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1.5, mb: 6, flexWrap: 'wrap' }}>
                    <Button
                        variant={selectedSchoolId === 'All' ? 'contained' : 'outlined'}
                        onClick={() => setSelectedSchoolId('All')}
                    >
                        All
                    </Button>
                    {SCHOOLS.map((school) => (
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
            {/* ================= MOBILE NATIVE FILTER TRIGGER ================= */}
            {isMobile && (
                <Box sx={{ px: 2, mb: 4 }}>
                    <Button
                        variant="outlined"
                        color="inherit"
                        fullWidth
                        startIcon={<FilterListIcon />}
                        onClick={() => setIsFilterOpen(true)}
                        style={{
                            justifyContent: 'space-between',
                            paddingTop: '12px',
                            paddingBottom: '12px',
                            paddingLeft: '16px',
                            paddingRight: '16px',
                            borderRadius: '12px',
                            borderColor: '#e2e8f0',
                            textTransform: 'none',
                            fontWeight: 600
                        }}
                    >
                        Filter: {selectedSchool ? selectedSchool.name : 'All Programs'}
                    </Button>

                    {/* App-style Drawer/Dialog Overlay compatible with both v4 and v5 */}
                    <Dialog
                        open={isFilterOpen}
                        onClose={() => setIsFilterOpen(false)}
                        fullWidth
                        maxWidth="xs"
                        style={{
                            // Places the dialog cleanly at the bottom of the screen like a mobile sheet
                            display: 'flex',
                            alignItems: 'flex-end'
                        }}
                    >
                        <DialogTitle style={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" style={{ fontWeight: 800 }}>Select School</Typography>
                            <IconButton onClick={() => setIsFilterOpen(false)}>
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>
                        <List style={{ padding: '8px' }}>
                            <ListItem disablePadding>
                                <ListItemButton onClick={() => handleSelectMobile('All')} selected={selectedSchoolId === 'All'} style={{ borderRadius: '8px' }}>
                                    <ListItemText
                                        primary="All Programs"
                                        style={{ fontWeight: selectedSchoolId === 'All' ? 700 : 500 }}
                                    />
                                </ListItemButton>
                            </ListItem>
                            {SCHOOLS.map((school) => (
                                <ListItem key={school.id} disablePadding>
                                    <ListItemButton onClick={() => handleSelectMobile(school.id)} selected={selectedSchoolId === school.id} style={{ borderRadius: '8px' }}>
                                        <ListItemText
                                            primary={school.name}
                                            style={{ fontWeight: selectedSchoolId === school.id ? 700 : 500 }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Dialog>
                </Box>
            )}

            {/* ================= PROGRAMS CONTAINER ================= */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
                gap: 3,
                px: isMobile ? 2 : 0
            }}>
                {filteredPrograms.map((program) => {
                    const school = SCHOOLS.find(s => s.id === program.schoolId);
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
                                bgcolor: 'background.paper'
                            }}
                        >
                            <Box sx={{ mb: 2 }}>
                                <Chip
                                    label={school?.name}
                                    size="small"
                                    sx={{ mb: 1.5, backgroundColor: 'rgba(46, 125, 50, 0.08)', color: 'primary.main', fontWeight: 600, maxWidth: '100%' }}
                                />
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