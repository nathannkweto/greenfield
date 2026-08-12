import { useState, useContext } from 'react';
import type { MouseEvent } from 'react';
import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container,
    IconButton,
    Menu,
    MenuItem,
    Divider,
    useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { COLLEGE_INFO } from '../data/collegeInfo';
import { ColorModeContext } from '../context/ColorModeContext';
import Footer from '../components/Footer';

export default function PublicLayout() {
    const location = useLocation();
    const theme = useTheme();
    const { toggleColorMode } = useContext(ColorModeContext);

    const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

    const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const isActive = (path: string) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    const navItems = [
        { label: 'Home', path: '/' },
        { label: 'Programs', path: '/programs' },
        { label: 'Apply', path: '/apply' },
        { label: 'Contact', path: '/contact' },
    ];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'background.default' }}>
            <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>

                        {/* ================= LOGO & TITLE ================= */}
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Box
                                component="img"
                                src={COLLEGE_INFO.logo}
                                alt={`${COLLEGE_INFO.name} logo`}
                                sx={{
                                    height: { xs: 32, md: 36 },
                                    width: 'auto',
                                    mr: 1.5,
                                    display: 'flex'
                                }}
                            />
                            <Typography
                                variant="h6"
                                component={RouterLink}
                                to="/"
                                sx={{
                                    mr: { xs: 1, md: 4 },
                                    fontWeight: 800,
                                    color: 'text.primary',
                                    textDecoration: 'none',
                                    fontSize: { xs: '1.1rem', md: '1.25rem' }
                                }}
                            >
                                {COLLEGE_INFO.name}
                            </Typography>
                        </Box>

                        <Box sx={{ flexGrow: 1 }} />

                        {/* ================= DESKTOP NAVIGATION ================= */}
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, mr: 1, alignItems: 'center' }}>
                            {navItems.map((item) => (
                                <Button
                                    key={item.label}
                                    component={RouterLink}
                                    to={item.path}
                                    sx={{
                                        color: isActive(item.path) ? 'primary.main' : 'text.secondary',
                                        fontWeight: isActive(item.path) ? 700 : 500,
                                        textTransform: 'none',
                                        '&:hover': {
                                            color: 'primary.main',
                                            backgroundColor: 'transparent'
                                        }
                                    }}
                                >
                                    {item.label}
                                </Button>
                            ))}

                            {/* Portal Sign In - Desktop Only */}
                            <Button
                                component={RouterLink}
                                to="/login"
                                variant="contained"
                                color="primary"
                                disableElevation
                                sx={{
                                    ml: 2,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    px: 3,
                                    py: 1,
                                    fontSize: '1rem',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                Portal Sign In
                            </Button>
                        </Box>

                        {/* ================= THEME TOGGLE ================= */}
                        <IconButton onClick={toggleColorMode} color="inherit" sx={{ mr: { xs: 0.5, md: 0 } }}>
                            {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                        </IconButton>

                        {/* ================= MOBILE NAVIGATION ================= */}
                        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="navigation menu"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                                sx={{ pr: 0 }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                keepMounted
                                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                open={Boolean(anchorElNav)}
                                onClose={handleCloseNavMenu}
                                sx={{ display: { xs: 'block', md: 'none' } }}
                            >
                                {navItems.map((item) => (
                                    <MenuItem
                                        key={item.label}
                                        component={RouterLink}
                                        to={item.path}
                                        onClick={handleCloseNavMenu}
                                        sx={{
                                            color: isActive(item.path) ? 'primary.main' : 'text.primary',
                                            fontWeight: isActive(item.path) ? 700 : 500,
                                            minWidth: '200px'
                                        }}
                                    >
                                        <Typography align="center" sx={{ width: '100%' }}>{item.label}</Typography>
                                    </MenuItem>
                                ))}

                                <Divider sx={{ my: 1, borderColor: 'divider' }} />

                                <MenuItem
                                    component={RouterLink}
                                    to="/login"
                                    onClick={handleCloseNavMenu}
                                    sx={{
                                        color: 'primary.main',
                                        fontWeight: 800,
                                        backgroundColor: 'action.hover',
                                        '&:hover': {
                                            backgroundColor: 'action.selected',
                                        }
                                    }}
                                >
                                    <Typography align="center" sx={{ width: '100%' }}>Portal Sign In</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* MAIN CONTENT AREA */}
            <Box component="main" sx={{ flexGrow: 1 }}>
                <Outlet />
            </Box>

            {/* PROFESSIONAL DARK FOOTER */}
            <Footer />
        </Box>
    );
}