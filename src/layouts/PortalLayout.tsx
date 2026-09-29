import { useContext, useState, type MouseEvent } from 'react';
import { client as apolloClient } from '../apolloClient';
import { Outlet, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
    AppBar, Toolbar, Typography, Box, Drawer, List, ListItem,
    ListItemButton, ListItemIcon, ListItemText, BottomNavigation,
    BottomNavigationAction, Paper, useMediaQuery, useTheme, Button, IconButton,
    CircularProgress, Collapse, Menu, MenuItem
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
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

function SidebarNavItem({ item, currentPath }: { item: NavItem; currentPath: string }) {
    const hasChildren = Boolean(item.children && item.children.length > 0);
    const isSelected = currentPath === item.path;
    const isChildSelected = item.children?.some(
        (child) => currentPath === child.path || (child.path !== '/' && currentPath.startsWith(child.path))
    );

    const [open, setOpen] = useState(isSelected || Boolean(isChildSelected));
    const [prevPath, setPrevPath] = useState(currentPath);

    // Sync open state when path changes during render (prevents set-state-in-effect warning)
    if (prevPath !== currentPath) {
        setPrevPath(currentPath);
        if (isChildSelected && !open) {
            setOpen(true);
        }
    }

    if (hasChildren) {
        return (
            <>
                <ListItem disablePadding sx={{ mb: 0.5, px: 2 }}>
                    <ListItemButton
                        onClick={() => setOpen(!open)}
                        sx={{ borderRadius: 1 }}
                    >
                        <ListItemIcon sx={{ minWidth: 40, color: isChildSelected || isSelected ? 'primary.main' : 'inherit' }}>
                            <item.icon />
                        </ListItemIcon>
                        <ListItemText
                            disableTypography
                            primary={
                                <Typography
                                    sx={{
                                        fontWeight: isChildSelected || isSelected ? 600 : 400,
                                        color: isChildSelected || isSelected ? 'primary.main' : 'inherit'
                                    }}
                                >
                                    {item.name}
                                </Typography>
                            }
                        />
                        {open ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                </ListItem>

                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ pl: 2 }}>
                        {item.children?.map((child) => (
                            <SidebarNavItem key={child.name} item={child} currentPath={currentPath} />
                        ))}
                    </List>
                </Collapse>
            </>
        );
    }

    return (
        <ListItem disablePadding sx={{ mb: 0.5, px: 2 }}>
            <ListItemButton
                component={RouterLink}
                to={item.path}
                selected={isSelected}
                sx={{ borderRadius: 1 }}
            >
                <ListItemIcon sx={{ minWidth: 40, color: isSelected ? 'primary.main' : 'inherit' }}>
                    <item.icon />
                </ListItemIcon>
                <ListItemText
                    disableTypography
                    primary={
                        <Typography
                            sx={{
                                fontWeight: isSelected ? 600 : 400,
                                color: isSelected ? 'primary.main' : 'inherit'
                            }}
                        >
                            {item.name}
                        </Typography>
                    }
                />
            </ListItemButton>
        </ListItem>
    );
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

    // Mobile nested menu state
    const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);
    const [selectedParentItem, setSelectedParentItem] = useState<NavItem | null>(null);

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

    // Calculate active top-level nav item path for mobile bottom navigation highlight
    const activeTopLevel = navItems.find((item) => {
        if (location.pathname === item.path) return true;
        return item.children?.some(
            (child) => location.pathname === child.path || (child.path !== '/' && location.pathname.startsWith(child.path))
        );
    });
    const activeValue = activeTopLevel ? activeTopLevel.path : location.pathname;

    const handleBottomNavClick = (event: MouseEvent<HTMLButtonElement>, item: NavItem) => {
        if (item.children && item.children.length > 0) {
            setMobileMenuAnchor(event.currentTarget);
            setSelectedParentItem(item);
        } else {
            navigate(item.path);
        }
    };

    const handleMobileMenuClose = () => {
        setMobileMenuAnchor(null);
        setSelectedParentItem(null);
    };

    const handleChildNavClick = (path: string) => {
        handleMobileMenuClose();
        navigate(path);
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
                        {COLLEGE_INFO.name}
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
                                <SidebarNavItem key={item.name} item={item} currentPath={location.pathname} />
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
                        pb: { xs: 9, md: 3 },
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
                        value={activeValue}
                    >
                        {navItems.map((item) => (
                            <BottomNavigationAction
                                key={item.name}
                                label={item.name}
                                value={item.path}
                                icon={<item.icon />}
                                onClick={(e) => handleBottomNavClick(e, item)}
                            />
                        ))}
                    </BottomNavigation>

                    {/* POPUP SUB-MENU FOR NESTED ITEMS ON MOBILE */}
                    <Menu
                        anchorEl={mobileMenuAnchor}
                        open={Boolean(mobileMenuAnchor)}
                        onClose={handleMobileMenuClose}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        transformOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center',
                        }}
                    >
                        {selectedParentItem?.children?.map((child) => {
                            const isChildActive = location.pathname === child.path;
                            return (
                                <MenuItem
                                    key={child.name}
                                    selected={isChildActive}
                                    onClick={() => handleChildNavClick(child.path)}
                                    sx={{ gap: 1.5, minWidth: 160 }}
                                >
                                    <ListItemIcon sx={{ minWidth: 'auto', color: isChildActive ? 'primary.main' : 'inherit' }}>
                                        <child.icon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText
                                        disableTypography
                                        primary={
                                            <Typography variant="body2" fontWeight={isChildActive ? 600 : 400}>
                                                {child.name}
                                            </Typography>
                                        }
                                    />
                                </MenuItem>
                            );
                        })}
                    </Menu>
                </Paper>
            )}
        </Box>
    );
}