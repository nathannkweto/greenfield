import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';

interface MetricCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
}

export default function MetricCard({ icon, label, value }: MetricCardProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box
            sx={{
                display: 'flex',
                gap: 1.5,
                alignItems: 'center',
                p: isMobile ? 1.5 : 0,
                backgroundColor: isMobile ? 'action.hover' : 'transparent',
                borderRadius: 2,
            }}
        >
            {icon}
            <Box>
                <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: 'block', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}
                >
                    {label}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                    {value}
                </Typography>
            </Box>
        </Box>
    );
}