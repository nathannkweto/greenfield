import { Box, Container, Grid, Typography, Link, IconButton, Divider, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { COLLEGE_INFO } from '../data/collegeInfo';

export default function Footer() {
    // Explicit dark theme color palette (renders dark regardless of global mode)
    const darkBg = '#0f172a'; // Deep slate background
    const borderDark = '#1e293b'; // Subtle divider line
    const headingColor = '#f8fafc'; // Crisp white headings
    const textMuted = '#94a3b8'; // Soft gray body/link text
    const textHover = '#38bdf8'; // Accent color for link hover

    const quickLinks = [
        { label: 'Home', path: '/' },
        { label: 'Academic Programs', path: '/programs' },
        { label: 'Apply for Admission', path: '/apply' },
        { label: 'Contact Us', path: '/contact' },
        { label: 'Portal Sign In', path: '/login' },
    ];

    const academicLinks = [
        { label: 'School of Nursing & Health Sciences', path: '/programs' },
        { label: 'Business & Management Studies', path: '/programs' },
        { label: 'Information Technology', path: '/programs' },
        { label: 'Admissions Requirements', path: '/apply' },
        { label: 'Academic Calendar', path: '/contact' },
    ];

    const socialLinks = [
        { icon: <FacebookIcon fontSize="small" />, label: 'Facebook', href: COLLEGE_INFO.socialMedia.facebook },
        { icon: <XIcon fontSize="small" />, label: 'X', href: COLLEGE_INFO.socialMedia.twitter },
        { icon: <LinkedInIcon fontSize="small" />, label: 'LinkedIn', href: COLLEGE_INFO.socialMedia.linkedin },
    ];

    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: darkBg,
                color: textMuted,
                borderTop: `1px solid ${borderDark}`,
                mt: 'auto',
                pt: { xs: 6, md: 8 },
                pb: 4,
            }}
        >
            <Container maxWidth="xl">
                <Grid container spacing={{ xs: 4, md: 5 }}>

                    {/* COLUMN 1: BRAND & ABOUT */}
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Box
                                component="img"
                                src={COLLEGE_INFO.logo}
                                alt={`${COLLEGE_INFO.name} logo`}
                                sx={{ height: 36, width: 'auto', mr: 1.5 }}
                            />
                            <Typography variant="h6" sx={{ fontWeight: 800, color: headingColor, letterSpacing: 0.5 }}>
                                {COLLEGE_INFO.name}
                            </Typography>
                        </Box>

                        <Typography variant="body2" sx={{ mb: 2.5, lineHeight: 1.7, color: textMuted }}>
                            {COLLEGE_INFO.tagline}
                        </Typography>

                        {/* Social Media Links */}
                        <Stack direction="row" spacing={1}>
                            {socialLinks.map((social) => (
                                <IconButton
                                    key={social.label}
                                    component="a"
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    sx={{
                                        color: textMuted,
                                        border: `1px solid ${borderDark}`,
                                        borderRadius: 2,
                                        p: 1,
                                        '&:hover': {
                                            color: headingColor,
                                            backgroundColor: borderDark,
                                        },
                                    }}
                                >
                                    {social.icon}
                                </IconButton>
                            ))}
                        </Stack>
                    </Grid>

                    {/* COLUMN 2: QUICK LINKS */}
                    <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: headingColor, mb: 2 }}>
                            Navigation
                        </Typography>
                        <Stack spacing={1.2}>
                            {quickLinks.map((item) => (
                                <Link
                                    key={item.label}
                                    component={RouterLink}
                                    to={item.path}
                                    sx={{
                                        color: textMuted,
                                        fontSize: '0.875rem',
                                        textDecoration: 'none',
                                        transition: 'color 0.2s',
                                        '&:hover': { color: textHover },
                                    }}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </Stack>
                    </Grid>

                    {/* COLUMN 3: ACADEMICS */}
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: headingColor, mb: 2 }}>
                            Academics & Admissions
                        </Typography>
                        <Stack spacing={1.2}>
                            {academicLinks.map((item) => (
                                <Link
                                    key={item.label}
                                    component={RouterLink}
                                    to={item.path}
                                    sx={{
                                        color: textMuted,
                                        fontSize: '0.875rem',
                                        textDecoration: 'none',
                                        transition: 'color 0.2s',
                                        '&:hover': { color: textHover },
                                    }}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </Stack>
                    </Grid>

                    {/* COLUMN 4: CONTACT INFO */}
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: headingColor, mb: 2 }}>
                            Contact & Location
                        </Typography>
                        <Stack spacing={1.5} sx={{ fontSize: '0.875rem' }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                <LocationOnIcon fontSize="small" sx={{ color: textHover, mt: 0.3 }} />
                                <Typography variant="body2" sx={{ color: textMuted }}>
                                    {COLLEGE_INFO.address}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <PhoneIcon fontSize="small" sx={{ color: textHover }} />
                                <Typography variant="body2" sx={{ color: textMuted }}>
                                    {COLLEGE_INFO.phone}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <EmailIcon fontSize="small" sx={{ color: textHover }} />
                                <Typography variant="body2" sx={{ color: textMuted }}>
                                    {COLLEGE_INFO.email}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <AccessTimeIcon fontSize="small" sx={{ color: textHover }} />
                                <Typography variant="body2" sx={{ color: textMuted }}>
                                    {COLLEGE_INFO.officeHours}
                                </Typography>
                            </Box>
                        </Stack>
                    </Grid>

                </Grid>

                {/* DIVIDER */}
                <Divider sx={{ my: 4, borderColor: borderDark }} />

                {/* BOTTOM LEGAL / COPYRIGHT ROW */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    <Typography variant="body2" align="center" sx={{ fontSize: '0.8125rem' }}>
                        © {new Date().getFullYear()} {COLLEGE_INFO.name}. All rights reserved.
                    </Typography>

                    {/* DEVELOPER CREDIT */}
                    <Typography variant="body2" align="center" sx={{ fontSize: '0.8125rem', color: textMuted }}>
                        Developed by Kapini Technologies{' '}
                        <Link
                            href="https://me.nkweto.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            sx={{
                                color: textHover,
                                fontWeight: 600,
                                textDecoration: 'none',
                                '&:hover': {
                                    textDecoration: 'underline',
                                },
                            }}
                        >
                            dev team
                        </Link>
                    </Typography>

                    <Stack direction="row" spacing={3}>
                        <Link
                            component={RouterLink}
                            to="/terms"
                            sx={{
                                color: textMuted,
                                fontSize: '0.8125rem',
                                textDecoration: 'none',
                                '&:hover': { color: headingColor },
                            }}
                        >
                            Terms of Service
                        </Link>
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
}