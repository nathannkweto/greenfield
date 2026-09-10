import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import { gql } from '@apollo/client';
import {
    Badge,
    IconButton,
    Popover,
    List,
    ListItem,
    ListItemText,
    Typography,
    Box,
    Button,
    Divider,
    Snackbar,
    Alert,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { getEcho } from '../lib/echo';
import { useMe } from '../hooks/useMe';

const GET_NOTIFICATIONS = gql`
    query GetNotifications {
        unreadNotificationsCount
        notifications(first: 10) {
            data {
                id
                read_at
                created_at
                data {
                    title
                    body
                    action_url
                    type
                }
            }
        }
    }
`;

const MARK_AS_READ = gql`
    mutation MarkNotificationAsRead($id: ID!) {
        markNotificationAsRead(id: $id) {
            id
            read_at
        }
    }
`;

const MARK_ALL_AS_READ = gql`
    mutation MarkAllNotificationsAsRead {
        markAllNotificationsAsRead
    }
`;

export interface NotificationItem {
    id: string;
    read_at: string | null;
    created_at: string;
    data: {
        title: string;
        body: string;
        action_url?: string;
        type?: string;
    };
}

interface GetNotificationsData {
    unreadNotificationsCount: number;
    notifications: {
        data: NotificationItem[];
    };
}

export function NotificationBell() {
    const { user } = useMe();
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const [toast, setToast] = useState({ open: false, title: '', body: '' });

    const [localNotifications, setLocalNotifications] = useState<NotificationItem[]>([]);
    const [localUnreadCount, setLocalUnreadCount] = useState<number>(0);

    const { data, refetch } = useQuery<GetNotificationsData>(GET_NOTIFICATIONS, {
        skip: !user,
        fetchPolicy: 'cache-and-network',
    });

    useEffect(() => {
        if (data) {
            setLocalNotifications(data.notifications?.data ?? []);
            setLocalUnreadCount(data.unreadNotificationsCount ?? 0);
        }
    }, [data]);

    const [markAsRead] = useMutation(MARK_AS_READ);
    const [markAllAsRead] = useMutation(MARK_ALL_AS_READ);

    useEffect(() => {
        if (!user?.id) return;

        const echo = getEcho();
        const channelName = `App.Models.User.${user.id}`;
        const channel = echo.private(channelName);

        const handleIncomingNotification = (incoming: any) => {
            const title = incoming.data?.title || incoming.title || 'New Notification';
            const body = incoming.data?.body || incoming.body || '';
            const id = incoming.id || String(Date.now());

            setToast({ open: true, title, body });
            setLocalUnreadCount((prev) => prev + 1);

            const newNotificationItem: NotificationItem = {
                id,
                read_at: null,
                created_at: new Date().toISOString(),
                data: {
                    title,
                    body,
                    action_url: incoming.data?.action_url || incoming.action_url,
                    type: incoming.data?.type || incoming.type,
                },
            };

            setLocalNotifications((prev) => [newNotificationItem, ...prev]);
            void refetch();
        };

        channel.notification(handleIncomingNotification);
        channel.listen('.NotificationSent', handleIncomingNotification);

        return () => {
            // Unsubscribe from the specific channel without closing the active WebSocket connection
            echo.leave(channelName);
        };
    }, [user?.id]);

    const handleItemClick = async (item: NotificationItem) => {
        if (!item.read_at) {
            setLocalNotifications((prev) =>
                prev.map((n) => (n.id === item.id ? { ...n, read_at: new Date().toISOString() } : n))
            );
            setLocalUnreadCount((prev) => Math.max(0, prev - 1));

            await markAsRead({ variables: { id: item.id } });
            void refetch();
        }
        if (item.data.action_url) {
            window.location.href = item.data.action_url;
        }
    };

    const handleMarkAll = async () => {
        setLocalUnreadCount(0);
        setLocalNotifications((prev) =>
            prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
        );
        await markAllAsRead();
        void refetch();
    };

    const handleCloseToast = () => {
        setToast({ open: false, title: '', body: '' });
    };

    return (
        <>
            <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Badge badgeContent={localUnreadCount} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>

            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                slotProps={{ paper: { sx: { width: 360, maxHeight: 480 } } }}
            >
                <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight={700}>
                        Notifications
                    </Typography>
                    {localUnreadCount > 0 && (
                        <Button size="small" onClick={handleMarkAll}>
                            Mark all read
                        </Button>
                    )}
                </Box>
                <Divider />

                <List disablePadding sx={{ overflowY: 'auto', maxHeight: 380 }}>
                    {localNotifications.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                            No notifications yet.
                        </Typography>
                    ) : (
                        localNotifications.map((item) => (
                            <ListItem
                                key={item.id}
                                component="div"
                                onClick={() => void handleItemClick(item)}
                                sx={{
                                    cursor: 'pointer',
                                    backgroundColor: item.read_at ? 'transparent' : 'action.hover',
                                    '&:hover': { backgroundColor: 'action.selected' },
                                }}
                            >
                                <ListItemText
                                    primary={item.data.title}
                                    secondary={item.data.body}
                                    slotProps={{
                                        primary: { fontWeight: item.read_at ? 400 : 700, variant: 'body2' },
                                        secondary: { variant: 'caption' },
                                    }}
                                />
                            </ListItem>
                        ))
                    )}
                </List>
            </Popover>

            <Snackbar
                open={toast.open}
                autoHideDuration={5000}
                onClose={handleCloseToast}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert severity="info" onClose={handleCloseToast}>
                    <Typography variant="subtitle2" fontWeight={700}>
                        {toast.title}
                    </Typography>
                    <Typography variant="body2">{toast.body}</Typography>
                </Alert>
            </Snackbar>
        </>
    );
}