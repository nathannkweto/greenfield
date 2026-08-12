import React from 'react';
import { useQuery } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Paper,
    Stack,
    Button,
    IconButton,
    useTheme,
    useMediaQuery,
    Divider,
    Avatar,
    Skeleton,
    Alert,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CampaignIcon from '@mui/icons-material/Campaign';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

import { GET_ADMIN_DASHBOARD } from '../../graphql/queries/adminDashboard';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
    loading?: boolean;
}

const StatCard = ({ title, value, icon, color, loading }: StatCardProps) => (
    <Paper
        variant="outlined"
        sx={{
            p: 2,
            borderRadius: 3,
            flex: '1 1 calc(50% - 16px)',
            minWidth: { xs: '140px', sm: '200px' },
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            boxSizing: 'border-box',
        }}
    >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ p: 1, borderRadius: 2, backgroundColor: `${color}15`, color: color, display: 'flex' }}>
                {icon}
            </Box>
        </Box>
        <Box sx={{ minWidth: 0 }}>
            {loading ? (
                <Skeleton variant="text" width={60} height={32} />
            ) : (
                <Typography variant="h5" sx={{ fontWeight: 800, overflowWrap: 'anywhere' }}>
                    {value}
                </Typography>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                {title}
            </Typography>
        </Box>
    </Paper>
);

export default function AdminDashboard() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    // Apollo Query
    const { data, loading, error } = useQuery(GET_ADMIN_DASHBOARD);

    const financials = data?.financialSummary;
    const totalStudents = data?.allStudents?.pageInfo?.total ?? 0;
    const pendingApps = data?.students?.pageInfo?.total ?? 0;
    const activeCourses = data?.courses?.pageInfo?.total ?? 0;

    return (
        <Box
            sx={{
                backgroundColor: 'background.default',
                minHeight: '70vh',
                width: '100%',
                overflowX: 'hidden',
                py: { xs: 2, md: 4 },
            }}
        >
            <Container maxWidth="xl" sx={{ px: { xs: 1.5, sm: 3 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Header Section */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Box sx={{ minWidth: 0 }}>
                        <Typography variant="h4" sx={{ fontWeight: 800, overflowWrap: 'anywhere' }}>
                            Dashboard
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            Welcome back, Administrator
                        </Typography>
                    </Box>
                    <IconButton sx={{ backgroundColor: 'action.hover' }}>
                        <NotificationsActiveIcon color="primary" />
                    </IconButton>
                </Box>

                {/* Global Query Error Notice */}
                {error && (
                    <Alert severity="error">
                        Failed to load dashboard metrics: {error.message}
                    </Alert>
                )}

                {/* Quick Actions */}
                <Box
                    sx={{
                        display: 'flex',
                        gap: 1.5,
                        overflowX: 'auto',
                        pb: 1,
                        '&::-webkit-scrollbar': { display: 'none' },
                        msOverflowStyle: 'none',
                        scrollbarWidth: 'none',
                    }}
                >
                    <Button
                        variant="contained"
                        disableElevation
                        startIcon={<PersonAddIcon />}
                        onClick={() => navigate('/admin/students')}
                        sx={{ borderRadius: 2, whiteSpace: 'nowrap', flexShrink: 0 }}
                    >
                        Add Student
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<CampaignIcon />}
                        onClick={() => navigate('/admin/announcements/create')}
                        sx={{ borderRadius: 2, whiteSpace: 'nowrap', flexShrink: 0 }}
                    >
                        Announcement
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<SchoolIcon />}
                        onClick={() => navigate('/admin/management')}
                        sx={{ borderRadius: 2, whiteSpace: 'nowrap', flexShrink: 0 }}
                    >
                        Manage Courses
                    </Button>
                </Box>

                {/* Main Content Split */}
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 3, width: '100%', boxSizing: 'border-box' }}>
                    {/* Left Column (Stats & Financials) */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, flex: '1 1 auto', minWidth: 0 }}>
                        {/* 2x2 Stat Cards */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, width: '100%', boxSizing: 'border-box' }}>
                            <StatCard
                                title="Total Students"
                                value={totalStudents}
                                icon={<PeopleIcon />}
                                color={theme.palette.primary.main}
                                loading={loading}
                            />
                            <StatCard
                                title="Lecturers"
                                value="24"
                                icon={<SchoolIcon />}
                                color={theme.palette.secondary.main}
                                loading={loading}
                            />
                            <StatCard
                                title="Active Courses"
                                value={activeCourses}
                                icon={<MenuBookIcon />}
                                color={theme.palette.success.main}
                                loading={loading}
                            />
                            <StatCard
                                title="Pending Apps"
                                value={pendingApps}
                                icon={<AssignmentLateIcon />}
                                color={theme.palette.warning.main}
                                loading={loading}
                            />
                        </Box>

                        {/* Financial Snapshot */}
                        <Paper
                            variant="outlined"
                            sx={{
                                p: { xs: 2, md: 3 },
                                borderRadius: 3,
                                backgroundColor: 'primary.dark',
                                color: 'white',
                                width: '100%',
                                boxSizing: 'border-box',
                            }}
                        >
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                <AccountBalanceWalletIcon />
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    Financial Overview
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 4 } }}>
                                <Box sx={{ minWidth: 0 }}>
                                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                        Collected Fees
                                    </Typography>
                                    {loading ? (
                                        <Skeleton variant="text" width={120} height={40} sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
                                    ) : (
                                        <Typography variant="h4" sx={{ fontWeight: 800, overflowWrap: 'anywhere' }}>
                                            {financials?.totalCollected?.toLocaleString() ?? 0}{' '}
                                            <Typography component="span" variant="subtitle1">
                                                {financials?.currency ?? 'ZMW'}
                                            </Typography>
                                        </Typography>
                                    )}
                                </Box>

                                <Divider
                                    orientation={isMobile ? 'horizontal' : 'vertical'}
                                    flexItem
                                    sx={{ borderColor: 'rgba(255,255,255,0.2)' }}
                                />

                                <Box sx={{ minWidth: 0 }}>
                                    <Typography variant="body2" sx={{ opacity: 0.8, color: '#ffb7b2' }}>
                                        Outstanding
                                    </Typography>
                                    {loading ? (
                                        <Skeleton variant="text" width={120} height={40} sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
                                    ) : (
                                        <Typography variant="h5" sx={{ fontWeight: 700, overflowWrap: 'anywhere', color: '#ffb7b2' }}>
                                            {financials?.totalOutstanding?.toLocaleString() ?? 0}{' '}
                                            <Typography component="span" variant="subtitle2">
                                                {financials?.currency ?? 'ZMW'}
                                            </Typography>
                                        </Typography>
                                    )}
                                </Box>
                            </Box>
                        </Paper>
                    </Box>

                    {/* Right Column (Activity Feed) */}
                    <Paper
                        variant="outlined"
                        sx={{
                            p: { xs: 2, md: 3 },
                            borderRadius: 3,
                            flex: { xs: 'none', lg: '0 0 400px' },
                            width: '100%',
                            boxSizing: 'border-box',
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                System Activity
                            </Typography>
                            <Button size="small" onClick={() => navigate('/admin/finance')}>
                                View Center
                            </Button>
                        </Box>

                        <Stack spacing={2}>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                <Avatar sx={{ width: 36, height: 36, backgroundColor: 'success.light' }}>$</Avatar>
                                <Box sx={{ minWidth: 0, flex: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 700, overflowWrap: 'anywhere' }}>
                                        Financial Summary updated
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Just now
                                    </Typography>
                                </Box>
                            </Box>
                        </Stack>
                    </Paper>
                </Box>
            </Container>
        </Box>
    );
}