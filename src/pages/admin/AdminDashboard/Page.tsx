import { useQuery } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Button,
    Alert,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CampaignIcon from '@mui/icons-material/Campaign';
import SchoolIcon from '@mui/icons-material/School';

import { GET_ADMIN_DASHBOARD } from './queries';
import { DashboardStats } from '../../../components/DashboardStats';
import { FinancialOverviewCard } from '../../../components/FinancialOverviewCard';

interface DashboardData {
    registeredStudents: { edges: Array<{ node: { id: string } }> };
    pendingApplications: { edges: Array<{ node: { id: string } }> };
    schools: { edges: Array<{ node: { id: string } }> };
    programs: { edges: Array<{ node: { id: string } }> };
}

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { data, loading, error } = useQuery<DashboardData>(GET_ADMIN_DASHBOARD);

    const totalStudents = data?.registeredStudents.edges.length ?? 0;
    const pendingApps = data?.pendingApplications.edges.length ?? 0;
    const totalSchools = data?.schools.edges.length ?? 0;
    const totalPrograms = data?.programs.edges.length ?? 0;

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
                </Box>

                {/* Error Banner */}
                {error && (
                    <Alert severity="error">
                        Failed to load: {error.message}
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
                        New Announcement
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<SchoolIcon />}
                        onClick={() => navigate('/admin/management')}
                        sx={{ borderRadius: 2, whiteSpace: 'nowrap', flexShrink: 0 }}
                    >
                        Manage Schools
                    </Button>
                </Box>

                {/* Main Content Layout */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
                    <DashboardStats
                        totalStudents={totalStudents}
                        totalPrograms={totalPrograms}
                        totalSchools={totalSchools}
                        pendingApps={pendingApps}
                        loading={loading}
                    />
                    <FinancialOverviewCard loading={loading} />
                </Box>
            </Container>
        </Box>
    );
}