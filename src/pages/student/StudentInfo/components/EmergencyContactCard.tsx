import { Paper, Typography, Box } from '@mui/material';
import ContactEmergencyIcon from '@mui/icons-material/ContactEmergency';

interface EmergencyContactCardProps {
    emergencyContact?: string;
}

export function EmergencyContactCard({ emergencyContact }: EmergencyContactCardProps) {
    return (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3.5, borderColor: 'divider' }}>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ContactEmergencyIcon color="error" /> Emergency Contact
            </Typography>

            <Box
                sx={{
                    p: 2,
                    backgroundColor: 'rgba(211, 47, 47, 0.03)',
                    borderRadius: 2.5,
                    border: '1px solid',
                    borderColor: 'error.light',
                }}
            >
                <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'block' }}>
                    Next of Kin / Emergency Contact
                </Typography>
                <Typography variant="body1" fontWeight={800} color="text.primary" sx={{ mt: 0.5 }}>
                    {emergencyContact || 'No emergency contact provided on record.'}
                </Typography>
            </Box>
        </Paper>
    );
}
