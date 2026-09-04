// components/dashboard/StatCard.tsx
import React from 'react';
import { Paper, Box, Typography, Skeleton } from '@mui/material';

export interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
    loading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, loading }) => (
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