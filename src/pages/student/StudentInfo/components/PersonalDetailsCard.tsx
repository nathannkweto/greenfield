import { Paper, Typography, Grid, Divider } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';

import type { Student } from '../types';
import { formatDate } from '../helpers';

interface PersonalDetailsCardProps {
    student: Student;
}

export function PersonalDetailsCard({ student }: PersonalDetailsCardProps) {
    return (
        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3.5, borderColor: 'divider' }}>
            <Typography variant="h6" fontWeight={800} sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon color="primary" /> Personal & Demographic Information
            </Typography>

            <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Gender
                    </Typography>
                    <Typography variant="body1" fontWeight={700}>
                        {student.sex}
                    </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Date of Birth
                    </Typography>
                    <Typography variant="body1" fontWeight={700}>
                        {formatDate(student.dob)}
                    </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Marital Status
                    </Typography>
                    <Typography variant="body1" fontWeight={700}>
                        {student.maritalStatus || 'N/A'}
                    </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Nationality
                    </Typography>
                    <Typography variant="body1" fontWeight={700}>
                        {student.nationality}
                    </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        National Registration (NRC)
                    </Typography>
                    <Typography variant="body1" fontWeight={700} sx={{ fontFamily: 'monospace' }}>
                        {student.nrcNumber || 'N/A'}
                    </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Passport Number
                    </Typography>
                    <Typography variant="body1" fontWeight={700} sx={{ fontFamily: 'monospace' }}>
                        {student.passportNumber || 'N/A'}
                    </Typography>
                </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" fontWeight={800} sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ContactPhoneIcon color="primary" /> Contact Details
            </Typography>

            <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Email Address
                    </Typography>
                    <Typography variant="body1" fontWeight={700}>
                        {student.email}
                    </Typography>
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Phone Number
                    </Typography>
                    <Typography variant="body1" fontWeight={700}>
                        {student.phone}
                    </Typography>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                        Residential / Postal Address
                    </Typography>
                    <Typography variant="body1" fontWeight={700}>
                        {student.address || 'N/A'}
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    );
}
