import React from 'react';
import {
    Container,
    Box,
    Typography,
    Button,
    Paper,
    useMediaQuery,
    useTheme,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Divider,
    Stack,
    Avatar,
    alpha
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { COLLEGE_INFO } from '../../data/collegeInfo';
import { MARKETING_DATA } from '../../data/marketingData';
import { Link as RouterLink } from 'react-router-dom';

// ============================================================================
// 1. DESKTOP VIEW
// ============================================================================
function DesktopView() {
    const theme = useTheme();
    const isLight = theme.palette.mode === 'light';

    return (
        <Box sx={{ py: 4, backgroundColor: 'background.default' }}>
            {/* ================= HERO SECTION ================= */}
            <Container maxWidth="lg" sx={{ mb: 8, pt: { xs: 2, md: 6 } }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.05fr 0.95fr' }, gap: 4, alignItems: 'center' }}>
                    <Box>
                        {/* Dynamic Primary Background Tag */}
                        <Box sx={{
                            display: 'inline-block',
                            px: 1.5,
                            py: 0.75,
                            borderRadius: '999px',
                            backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            color: 'primary.main',
                            fontSize: '0.88rem',
                            fontWeight: 600,
                            mb: 2
                        }}>
                            {MARKETING_DATA.hero.tag}
                        </Box>
                        <Typography variant="h2" component="h2" sx={{ fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.04em', fontSize: 'clamp(2.2rem, 4vw, 4.2rem)', mb: 2, color: 'text.primary' }}>
                            {MARKETING_DATA.hero.title}
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.05rem', maxWidth: '56ch', mb: 4 }}>
                            {COLLEGE_INFO.name} {MARKETING_DATA.hero.desc}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <Button component={RouterLink} to="/apply" variant="contained" color="primary" sx={{ px: 3, py: 1.2, borderRadius: 2 }}>Apply Now</Button>
                            <Button href="#about" variant="outlined" color="inherit" sx={{ px: 3, py: 1.2, borderRadius: 2, borderColor: 'divider' }}>Learn More</Button>
                        </Box>
                    </Box>
                    <Box sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid', borderColor: 'divider', backgroundColor: 'background.paper' }}>
                        <Box component="img" src="/hero.jpg" alt={`${COLLEGE_INFO.name} campus`} sx={{ width: '100%', display: 'block', aspectRatio: '4 / 3', objectFit: 'cover' }} />
                    </Box>
                </Box>
            </Container>

            {/* ================= ABOUT SECTION ================= */}
            <Box component="section" id="about" sx={{ py: 6 }}>
                <Container maxWidth="lg">
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{MARKETING_DATA.about.tag}</Typography>
                        <Typography variant="h4" component="h3" sx={{ fontWeight: 700, mt: 0.5, color: 'text.primary' }}>{MARKETING_DATA.about.title}</Typography>
                    </Box>
                    <Paper variant="outlined" sx={{ p: 4, borderRadius: 3, borderColor: 'divider', backgroundColor: 'background.paper' }}>
                        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.02rem', mb: 2 }}>
                            {COLLEGE_INFO.name} {MARKETING_DATA.about.p1}
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.02rem' }}>{MARKETING_DATA.about.p2}</Typography>
                    </Paper>
                </Container>
            </Box>

            {/* ================= PROGRAMS SECTION ================= */}
            <Box component="section" id="programs" sx={{ py: 6 }}>
                <Container maxWidth="lg">
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{MARKETING_DATA.programs.tag}</Typography>
                        <Typography variant="h4" component="h3" sx={{ fontWeight: 700, mt: 0.5, color: 'text.primary' }}>{MARKETING_DATA.programs.title}</Typography>
                    </Box>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2.5 }}>
                        {MARKETING_DATA.programs.list.map((item) => (
                            <Paper key={item.title} variant="outlined" sx={{ p: 3, borderRadius: 3, borderColor: 'divider', backgroundColor: 'background.paper' }}>
                                <Typography variant="h6" component="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>{item.title}</Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{item.desc}</Typography>
                            </Paper>
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* ================= CTA SECTION ================= */}
            <Box component="section" id="apply" sx={{ py: 6 }}>
                <Container maxWidth="lg">
                    <Paper
                        variant="outlined"
                        sx={{
                            p: 4,
                            borderRadius: 4,
                            borderColor: 'divider',
                            // Shifts to clean, elegant dark-surface tones when in dark mode
                            background: isLight
                                ? 'linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)'
                                : 'linear-gradient(135deg, #1e1e1e 0%, #151515 100%)',
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            justifyContent: 'space-between',
                            alignItems: { xs: 'flex-start', md: 'center' },
                            gap: 3
                        }}
                    >
                        <Box>
                            <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>{MARKETING_DATA.cta.tag}</Typography>
                            <Typography variant="h4" component="h3" sx={{ fontWeight: 700, mt: 0.5, mb: 1, color: 'text.primary' }}>{MARKETING_DATA.cta.title} {COLLEGE_INFO.name.split(' ')[0]}?</Typography>
                            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: '58ch' }}>{MARKETING_DATA.cta.desc}</Typography>
                        </Box>
                        <Button component={RouterLink} to="/apply" variant="contained" color="primary" sx={{ px: 3, py: 1.5, borderRadius: 2, whiteSpace: 'nowrap', width: { xs: '100%', md: 'auto' } }}>Apply for Admission</Button>
                    </Paper>
                </Container>
            </Box>

            {/* ================= CONTACT SECTION ================= */}
            <Box component="section" id="contact" sx={{ py: 6, mb: 4 }}>
                <Container maxWidth="lg">
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2.5 }}>
                        {[
                            { title: 'Visit us', desc: COLLEGE_INFO.address },
                            { title: 'Email us', desc: COLLEGE_INFO.email },
                            { title: 'Call us', desc: COLLEGE_INFO.phone },
                        ].map((info) => (
                            <Paper key={info.title} variant="outlined" sx={{ p: 3, borderRadius: 3, borderColor: 'divider', backgroundColor: 'background.paper' }}>
                                <Typography variant="subtitle1" component="h4" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>{info.title}</Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{info.desc}</Typography>
                            </Paper>
                        ))}
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}

// ============================================================================
// 2. MOBILE VIEW
// ============================================================================
function MobileView() {
    const theme = useTheme();

    return (
        <Box sx={{
            pb: 8,
            backgroundColor: 'background.default', // Fixed: Adheres cleanly to the dark token
        }}>
            {/* ================= IMMERSIVE HERO ================= */}
            <Box sx={{ position: 'relative', height: '55vh', minHeight: '400px', width: '100%', mb: 4 }}>
                <Box
                    component="img"
                    src="/hero.jpg"
                    alt={`${COLLEGE_INFO.name} campus`}
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {/* Immersive overlay stays consistent across light/dark to guarantee text contrast */}
                <Box sx={{
                    position: 'absolute',
                    bottom: 0, left: 0, right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 100%)',
                    px: 2.5,
                    pb: 4,
                    pt: 12
                }}>
                    <Typography variant="overline" sx={{ color: 'common.white', opacity: 0.9, fontWeight: 800, letterSpacing: 1 }}>
                        {MARKETING_DATA.hero.tag}
                    </Typography>
                    <Typography variant="h4" component="h1" sx={{ color: 'common.white', fontWeight: 800, mb: 1, lineHeight: 1.15 }}>
                        {MARKETING_DATA.hero.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'grey.300', mb: 3, lineHeight: 1.6 }}>
                        {COLLEGE_INFO.name} {MARKETING_DATA.hero.desc}
                    </Typography>
                    <Stack direction="row" spacing={2}>
                        <Button component={RouterLink} to="/apply" variant="contained" color="primary" sx={{ flex: 1, borderRadius: 3, py: 1.5, fontWeight: 700 }} disableElevation>
                            Apply
                        </Button>
                        <Button href="#about" variant="contained" sx={{ flex: 1, borderRadius: 3, py: 1.5, fontWeight: 700, backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', backdropFilter: 'blur(10px)' }} disableElevation>
                            Learn
                        </Button>
                    </Stack>
                </Box>
            </Box>

            {/* ================= APP CONTENT STACK ================= */}
            <Box sx={{ px: 2, display: 'flex', flexDirection: 'column', gap: 5 }}>

                {/* About Section */}
                <Box component="section" id="about">
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5, color: 'text.primary' }}>
                        {MARKETING_DATA.about.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6, mb: 1.5 }}>
                        {COLLEGE_INFO.name} {MARKETING_DATA.about.p1}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                        {MARKETING_DATA.about.p2}
                    </Typography>
                </Box>

                {/* Programs - Native iOS/Android List */}
                <Box component="section" id="programs">
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: 'text.primary' }}>
                        {MARKETING_DATA.programs.title}
                    </Typography>
                    <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden', backgroundColor: 'background.paper' }}>
                        <List disablePadding>
                            {MARKETING_DATA.programs.list.map((item, index) => (
                                <React.Fragment key={item.title}>
                                    <ListItem disablePadding>
                                        <ListItemButton
                                            component={RouterLink}
                                            to="/programs"
                                            sx={{ py: 2, px: 2 }}
                                        >
                                            <ListItemText
                                                primary={
                                                    <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: 'text.primary' }}>
                                                        {item.title}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Typography noWrap sx={{ fontSize: '0.8rem', mt: 0.5, color: 'text.secondary' }}>
                                                        {item.desc}
                                                    </Typography>
                                                }
                                            />
                                            <ChevronRightIcon sx={{ color: 'text.disabled' }} />
                                        </ListItemButton>
                                    </ListItem>
                                    {index < MARKETING_DATA.programs.list.length - 1 && <Divider component="li" />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Box>

                {/* Contact - Flat Icon Menu */}
                <Box component="section" id="contact" sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: 'text.primary' }}>
                        Get in Touch
                    </Typography>
                    <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', overflow: 'hidden', backgroundColor: 'background.paper' }}>
                        <List disablePadding>
                            {[
                                { title: 'Visit Campus', desc: COLLEGE_INFO.address, icon: <LocationOnIcon fontSize="small" color="primary" /> },
                                { title: 'Email Admissions', desc: COLLEGE_INFO.email, icon: <EmailIcon fontSize="small" color="primary" /> },
                                { title: 'Call Us', desc: COLLEGE_INFO.phone, icon: <PhoneIcon fontSize="small" color="primary" /> },
                            ].map((info, index) => (
                                <React.Fragment key={info.title}>
                                    <ListItem disablePadding>
                                        <ListItemButton sx={{ py: 2, px: 2 }}>
                                            <ListItemIcon sx={{ minWidth: 40 }}>
                                                {/* Dynamic color alpha wrapper matching your theme primary */}
                                                <Avatar sx={{ width: 32, height: 32, backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
                                                    {info.icon}
                                                </Avatar>
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: 'text.primary' }}>
                                                        {info.title}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary' }}>
                                                        {info.desc}
                                                    </Typography>
                                                }
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                    {index < 2 && <Divider component="li" />}
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Box>

            </Box>
        </Box>
    );
}

// ============================================================================
// 3. MAIN COMPONENT
// ============================================================================
export default function LandingPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return isMobile ? <MobileView /> : <DesktopView />;
}