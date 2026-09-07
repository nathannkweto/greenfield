import { useContext, useState } from 'react';
import { client as apolloClient } from '../apolloClient';
import { Outlet, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
    AppBar, Toolbar, Typography, Box, Drawer, List, ListItem,
    ListItemButton, ListItemIcon, ListItemText, BottomNavigation,
    BottomNavigationAction, Paper, useMediaQuery, useTheme, Button, IconButton,
    CircularProgress
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import type { NavItem } from '../config/navItems';

import { COLLEGE_INFO } from '../data/collegeInfo';
import { ColorModeContext } from '../context/ColorModeContext';
import { getAuth } from '../api/generated';
import { NotificationBell } from '../components/NotificationBell';
import { useAuth } from '../context/AuthContext';

const DRAWER_WIDTH = 240;

interface PortalLayoutProps {
    navItems: NavItem[];
}

const { getSanctumCsrfCookie, postAuthLogout } = getAuth();

export default function PortalLayout({ navItems }: PortalLayoutProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const location = useLocation();
    const navigate = useNavigate();
    const { clearSessionRoles } = useAuth();

    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const { toggleColorMode } = useContext(ColorModeContext);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await getSanctumCsrfCookie();
            await postAuthLogout();
        } catch (error) {
            console.error('Logout request failed:', error);
        } finally {
            clearSessionRoles();
            await apolloClient.resetStore();
            setIsLoggingOut(false);
            navigate('/login', { replace: true, state: {} });
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                height: '100vh',
                width: '100vw',
                overflow: 'hidden',
                backgroundColor: 'background.default',
            }}
        >
            {/* FIXED TOP APP BAR */}
            <AppBar
                position="fixed"
                color="inherit"
                elevation={1}
                sx={{
                    zIndex: theme.zIndex.drawer + 1,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    width: '100%',
                }}
            >
                <Toolbar>
                    <Box
                        component="img"
                        src={COLLEGE_INFO.logo}
                        alt={`${COLLEGE_INFO.name} logo`}
                        sx={{
                            height: { xs: 28, md: 32 },
                            width: 'auto',
                            mr: 1.5,
                            display: 'flex'
                        }}
                    />

                    <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
                        {COLLEGE_INFO.name} Portal
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <NotificationBell />

                        <IconButton onClick={toggleColorMode} color="inherit">
                            {theme.palette.mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
                        </IconButton>

                        {!isMobile ? (
                            <Button
                                color="error"
                                startIcon={isLoggingOut ? <CircularProgress size={18} color="inherit" /> : <LogoutIcon />}
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                            >
                                Logout
                            </Button>
                        ) : (
                            <IconButton color="error" onClick={handleLogout} disabled={isLoggingOut}>
                                {isLoggingOut ? <CircularProgress size={20} color="inherit" /> : <LogoutIcon />}
                            </IconButton>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            {/* DESKTOP SIDEBAR */}
            {!isMobile && (
                <Drawer
                    variant="permanent"
                    sx={{
                        width: DRAWER_WIDTH,
                        flexShrink: 0,
                        [`& .MuiDrawer-paper`]: {
                            width: DRAWER_WIDTH,
                            boxSizing: 'border-box',
                            backgroundColor: 'background.paper'
                        },
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

            {/* MAIN SCROLLABLE CONTAINER */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    height: '100vh',
                    overflowY: 'auto',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    width: isMobile ? '100%' : `calc(100% - ${DRAWER_WIDTH}px)`,
                }}
            >
                <Toolbar />

                {/* Inner Content Area with Breakpoint-Based Padding */}
                <Box
                    sx={{
                        flexGrow: 1,
                        p: { xs: 2, sm: 3 },
                        pb: { xs: 9, md: 3 }, // Fixed bottom padding for mobile navigation
                        boxSizing: 'border-box',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Outlet />
                </Box>
            </Box>

            {/* MOBILE BOTTOM NAVIGATION */}
            {isMobile && (
                <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1000 }} elevation={3}>
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