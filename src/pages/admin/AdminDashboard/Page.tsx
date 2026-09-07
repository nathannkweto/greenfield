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
                flexGrow: 1,
                width: '100%',
                py: { xs: 3, md: 4 },
            }}
        >
            <Container maxWidth="xl" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                {/* Header Section */}
                <Box sx={{ minWidth: 0 }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, wordBreak: 'break-word' }}>
                        Dashboard
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Welcome back, Administrator
                    </Typography>
                </Box>

                {/* Error Banner */}
                {error && (
                    <Alert severity="error" sx={{ borderRadius: 2 }}>
                        Failed to load dashboard data: {error.message}
                    </Alert>
                )}

                {/* Quick Actions */}
                <Box
                    sx={{
                        display: 'flex',
                        gap: 1.5,
                        overflowX: 'auto',
                        py: 0.5,
                        '&::-webkit-scrollbar': { height: 6 },
                        '&::-webkit-scrollbar-thumb': {
                            backgroundColor: 'divider',
                            borderRadius: 3,
                        },
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
                <DashboardStats
                    totalStudents={totalStudents}
                    totalPrograms={totalPrograms}
                    totalSchools={totalSchools}
                    pendingApps={pendingApps}
                    loading={loading}
                />
                <FinancialOverviewCard loading={loading} />

            </Container>
        </Box>
    );
}