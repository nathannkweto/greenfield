// components/dashboard/NotificationsCard.tsx
import React from 'react';
import { Paper, Box, Typography, Button, Stack, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export interface NotificationItem {
    id: string;
    title: string;
    time: string;
    iconText?: string;
    iconBgColor?: string;
}

interface NotificationsCardProps {
    notifications?: NotificationItem[];
    onViewAllClick?: () => void;
}

const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
    {
        id: '1',
        title: 'Financial Summary updated',
        time: 'Just now',
        iconText: '$',
        iconBgColor: 'success.light',
    },
    {
        id: '2',
        title: 'New Student Application Received',
        time: '10m ago',
        iconText: 'N',
        iconBgColor: 'primary.light',
    },
];

export const NotificationsCard: React.FC<NotificationsCardProps> = ({
                                                                        notifications = DEFAULT_NOTIFICATIONS,
                                                                        onViewAllClick,
                                                                    }) => {
    const navigate = useNavigate();

    const handleViewAll = () => {
        if (onViewAllClick) {
            onViewAllClick();
        } else {
            navigate('/admin/finance');
        }
    };

    return (
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
                    Notifications
                </Typography>
                <Button size="small" onClick={handleViewAll}>
                    View Center
                </Button>
            </Box>

            <Stack spacing={1}>
                {notifications.map((item) => (
                    <Box
                        key={item.id}
                        onClick={() => navigate(`/admin/notifications/${item.id}`)}
                        sx={{
                            display: 'flex',
                            gap: 2,
                            alignItems: 'flex-start',
                            p: 1.5,
                            borderRadius: 2,
                            cursor: 'pointer',
                            transition: 'background-color 0.2s',
                            '&:hover': {
                                backgroundColor: 'action.hover',
                            },
                        }}
                    >
                        <Avatar sx={{ width: 36, height: 36, backgroundColor: item.iconBgColor || 'primary.light' }}>
                            {item.iconText || '!'}
                        </Avatar>
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 700, overflowWrap: 'anywhere' }}>
                                {item.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {item.time}
                            </Typography>
                        </Box>
                    </Box>
                ))}
            </Stack>
        </Paper>
    );
};