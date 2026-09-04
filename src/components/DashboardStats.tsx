import React from 'react';
import { Box, useTheme } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import { StatCard } from './StatCard';

interface DashboardStatsProps {
    totalStudents: number;
    totalPrograms: number;
    totalSchools: number;
    pendingApps: number;
    loading?: boolean;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
                                                                  totalStudents,
                                                                  totalPrograms,
                                                                  totalSchools,
                                                                  pendingApps,
                                                                  loading,
                                                              }) => {
    const theme = useTheme();

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, width: '100%', boxSizing: 'border-box' }}>
            <StatCard
                title="Students"
                value={totalStudents}
                icon={<PeopleIcon />}
                color={theme.palette.primary.main}
                loading={loading}
            />
            <StatCard
                title="Programs"
                value={totalPrograms}
                icon={<SchoolIcon />}
                color={theme.palette.secondary.main}
                loading={loading}
            />
            <StatCard
                title="Schools"
                value={totalSchools}
                icon={<MenuBookIcon />}
                color={theme.palette.success.main}
                loading={loading}
            />
            <StatCard
                title="Applications"
                value={pendingApps}
                icon={<AssignmentLateIcon />}
                color={theme.palette.warning.main}
                loading={loading}
            />
        </Box>
    );
};