import { useParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Button, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function NotificationDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
                sx={{ mb: 3 }}
            >
                Back to Dashboard
            </Button>

            <Paper variant="outlined" sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 700 }}>
                    Notification ID: #{id}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mt: 1, mb: 2 }}>
                    Notification Details
                </Typography>

                <Typography variant="body1" color="text.secondary" paragraph>
                    You are viewing full details for event notification #{id}.
                </Typography>

                <Box sx={{ mt: 3, p: 2.5, backgroundColor: 'action.hover', borderRadius: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                        System Log Payload
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Timestamp: {new Date().toLocaleString()}
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
}