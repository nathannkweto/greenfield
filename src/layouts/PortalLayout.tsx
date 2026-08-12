import { useContext } from 'react';
import { Outlet, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
    AppBar, Toolbar, Typography, Box, Drawer, List, ListItem,
    ListItemButton, ListItemIcon, ListItemText, BottomNavigation,
    BottomNavigationAction, Paper, useMediaQuery, useTheme, Button, IconButton
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import type { NavItem } from '../config/navItems';

// Import your college info data
import { COLLEGE_INFO } from '../data/collegeInfo';

// Import the context we just created in your root file
import { ColorModeContext } from '../context/ColorModeContext';

const DRAWER_WIDTH = 240;

interface PortalLayoutProps {
    navItems: NavItem[];
}

export default function PortalLayout({ navItems }: PortalLayoutProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const location = useLocation();
    const navigate = useNavigate();

    // Consume the context
    const { toggleColorMode } = useContext(ColorModeContext);

    const handleLogout = () => {
        navigate('/');
    };

    const TopBar = (
        <AppBar
            position="fixed"
            color="inherit"
            elevation={1}
            sx={{
                zIndex: theme.zIndex.drawer + 1,
                borderBottom: '1px solid',
                borderColor: 'divider',
                width: '100%',         // Enforce boundary
                maxWidth: '100vw',     // Enforce boundary
            }}>
            <Toolbar>
                {/* Replaced SchoolIcon with your dynamic college logo image */}
                <Box
                    component="img"
                    src={COLLEGE_INFO.logo}
                    alt={`${COLLEGE_INFO.name} logo`}
                    sx={{
                        height: { xs: 28, md: 32 }, // Fits cleanly inside standard toolbars
                        width: 'auto',
                        mr: 1.5,
                        display: 'flex'
                    }}
                />

                {/* Made the portal title partially dynamic using your data config */}
                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
                    {COLLEGE_INFO.name} Portal
                </Typography>

                {/* Theme Toggle & Logout Container */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton onClick={toggleColorMode} color="inherit">
                        {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                    </IconButton>

                    {!isMobile ? (
                        <Button color="error" startIcon={<LogoutIcon />} onClick={handleLogout}>
                            Logout
                        </Button>
                    ) : (
                        <IconButton color="error" onClick={handleLogout}>
                            <LogoutIcon />
                        </IconButton>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );

    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                backgroundColor: 'background.default',
                width: '100%',        // Strict width
                maxWidth: '100vw',    // Prevent body stretch
                overflowX: 'hidden'   // Kill rogue pixels
            }}
        >
            {TopBar}

            {/* DESKTOP SIDEBAR */}
            {!isMobile && (
                <Drawer
                    variant="permanent"
                    sx={{
                        width: DRAWER_WIDTH,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: { width: DRAWER_WIDTH, boxSizing: 'border-box', backgroundColor: 'background.paper' },
                    }}
                >
                    <Toolbar />
                    <Box sx={{ overflow: 'auto', mt: 2 }}>
                        <List>
                            {navItems.map((item) => (
                                <ListItem key={item.name} disablePadding sx={{ mb: 1, px: 2 }}>
                                    <ListItemButton
                                        component={RouterLink}
                                        to={item.path}
                                        selected={location.pathname === item.path}
                                        sx={{ borderRadius: 1 }}
                                    >
                                        <ListItemIcon sx={{ minWidth: 40, color: location.pathname === item.path ? 'primary.main' : 'inherit' }}>
                                            <item.icon />
                                        </ListItemIcon>
                                        <ListItemText
                                            disableTypography
                                            primary={
                                                <Typography
                                                    sx={{
                                                        fontWeight: location.pathname === item.path ? 600 : 400,
                                                        color: location.pathname === item.path ? 'primary.main' : 'inherit'
                                                    }}
                                                >
                                                    {item.name}
                                                </Typography>
                                            }
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Drawer>
            )}

            {/* MAIN CONTENT AREA */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 1.5, sm: 3 },
                    pb: isMobile ? 10 : 3,
                    minWidth: 0,
                    // FIX: Exactly 100% on mobile, exactly remaining space on desktop
                    width: isMobile ? '100%' : `calc(100% - ${DRAWER_WIDTH}px)`,
                    boxSizing: 'border-box',
                    overflowX: 'hidden'
                }}
            >
                <Toolbar />
                <Outlet />
                <Toolbar />
            </Box>

            {/* MOBILE BOTTOM NAVIGATION */}
            {isMobile && (
                <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} >
                    <BottomNavigation
                        showLabels={false}
                        value={location.pathname}
                        onChange={(_, newValue) => navigate(newValue)}
                    >
                        {navItems.map((item) => (
                            <BottomNavigationAction
                                key={item.name}
                                label={item.name}
                                value={item.path}
                                icon={<item.icon />}
                            />
                        ))}
                    </BottomNavigation>
                </Paper>
            )}
        </Box>
    );
}