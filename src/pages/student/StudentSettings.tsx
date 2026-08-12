import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Paper,
    Tabs,
    Tab,
    TextField,
    Button,
    Avatar,
    Divider,
    Stack,
    Switch,
    FormGroup,
    FormControlLabel,
    MenuItem,
    Select,
    FormControl
} from '@mui/material';
import Grid from '@mui/material/Grid';
import SaveIcon from '@mui/icons-material/Save';
import SecurityIcon from '@mui/icons-material/Security';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import PersonIcon from '@mui/icons-material/Person';

import type { UserProfile, NotificationPrefs, SecurityPrefs } from '../../data/settingsData';
import { MOCK_PROFILE, MOCK_NOTIFICATIONS, MOCK_SECURITY } from '../../data/settingsData';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ pt: { xs: 2, sm: 3 } }}>{children}</Box>}
        </div>
    );
}

export default function StudentSettings() {
    const [tabValue, setTabValue] = useState(0);

    const [profile, setProfile] = useState<UserProfile>(MOCK_PROFILE);
    const [notifications, setNotifications] = useState<NotificationPrefs>(MOCK_NOTIFICATIONS);
    const [security, setSecurity] = useState<SecurityPrefs>(MOCK_SECURITY);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleMobileSelectChange = (event: any) => {
        setTabValue(Number(event.target.value));
    };

    const handleProfileChange = (field: keyof UserProfile) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setProfile({ ...profile, [field]: event.target.value });
    };

    const handleToggleNotification = (field: keyof NotificationPrefs) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setNotifications({ ...notifications, [field]: event.target.checked });
    };

    const handleToggleSecurity = (field: keyof SecurityPrefs) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setSecurity({ ...security, [field]: event.target.checked });
    };

    const handleSave = () => {
        alert('Settings saved successfully!');
    };

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '70vh', py: { xs: 2, md: 4 } }}>
            <Container maxWidth="md">

                {/* Page Header */}
                <Box sx={{ mb: { xs: 3, md: 4 } }}>
                    <Typography
                        component="h1"
                        sx={{ fontSize: { xs: '1.5rem', md: '2rem' }, fontWeight: 800, color: 'text.primary', mb: 0.5 }}
                    >
                        Account Settings
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}>
                        Manage your profile, notifications, and security preferences.
                    </Typography>
                </Box>

                <Paper variant="outlined" sx={{ borderRadius: { xs: 2, md: 4 }, borderColor: 'divider', overflow: 'hidden' }}>

                    {/* Desktop Tabs View (Hidden on mobile) */}
                    <Box sx={{ display: { xs: 'none', sm: 'block' }, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                        <Tabs value={tabValue} onChange={handleTabChange} sx={{ px: 1 }}>
                            <Tab icon={<PersonIcon />} iconPosition="start" label="Profile" sx={{ minHeight: 64, textTransform: 'none', fontWeight: 600 }} />
                            <Tab icon={<NotificationsActiveIcon />} iconPosition="start" label="Preferences" sx={{ minHeight: 64, textTransform: 'none', fontWeight: 600 }} />
                            <Tab icon={<SecurityIcon />} iconPosition="start" label="Security" sx={{ minHeight: 64, textTransform: 'none', fontWeight: 600 }} />
                        </Tabs>
                    </Box>

                    {/* Mobile Dropdown View (Hidden on desktop) */}
                    <Box sx={{ display: { xs: 'block', sm: 'none' }, p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.default' }}>
                        <FormControl fullWidth size="small">
                            <Select
                                value={tabValue}
                                onChange={handleMobileSelectChange}
                                sx={{ bgcolor: 'background.paper', fontWeight: 600, borderRadius: 2 }}
                            >
                                <MenuItem value={0} sx={{ fontWeight: 500 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <PersonIcon fontSize="small" color="action" /> Profile
                                    </Box>
                                </MenuItem>
                                <MenuItem value={1} sx={{ fontWeight: 500 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <NotificationsActiveIcon fontSize="small" color="action" /> Preferences
                                    </Box>
                                </MenuItem>
                                <MenuItem value={2} sx={{ fontWeight: 500 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <SecurityIcon fontSize="small" color="action" /> Security
                                    </Box>
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <Box sx={{ p: { xs: 2, sm: 4 }, bgcolor: 'background.paper' }}>

                        {/* ================= TAB 0: PROFILE ================= */}
                        <CustomTabPanel value={tabValue} index={0}>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ alignItems: 'center', mb: 4 }}>
                                <Avatar
                                    src={profile.avatarUrl}
                                    sx={{ width: 88, height: 88, backgroundColor: 'primary.main', fontSize: '2.5rem', fontWeight: 700 }}
                                >
                                    {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
                                </Avatar>
                                <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                                    <Button variant="outlined" size="small" sx={{ mb: 1, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
                                        Change Photo
                                    </Button>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                        JPG or PNG, max 2MB.
                                    </Typography>
                                </Box>
                            </Stack>

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField fullWidth label="First Name" value={profile.firstName} onChange={handleProfileChange('firstName')} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField fullWidth label="Last Name" value={profile.lastName} onChange={handleProfileChange('lastName')} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField fullWidth label="Preferred Name" value={profile.preferredName} onChange={handleProfileChange('preferredName')} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField fullWidth select label="Pronouns" value={profile.pronouns} onChange={handleProfileChange('pronouns')}>
                                        {['He/Him', 'She/Her', 'They/Them', 'Other', 'Prefer not to say'].map((option) => (
                                            <MenuItem key={option} value={option}>{option}</MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField fullWidth label="Email Address" type="email" value={profile.email} disabled helperText="Contact IT to change institutional email." />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <TextField fullWidth label="Phone Number" value={profile.phone} onChange={handleProfileChange('phone')} />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <TextField fullWidth multiline rows={3} label="Bio / About Me" value={profile.bio} onChange={handleProfileChange('bio')} />
                                </Grid>
                            </Grid>
                        </CustomTabPanel>

                        {/* ================= TAB 1: PREFERENCES ================= */}
                        <CustomTabPanel value={tabValue} index={1}>
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Academic Alerts</Typography>
                                <FormGroup sx={{ gap: 1.5 }}>
                                    <FormControlLabel
                                        control={<Switch checked={notifications.emailGrades} onChange={handleToggleNotification('emailGrades')} />}
                                        label={<Typography sx={{ fontWeight: 500, fontSize: { xs: '0.9rem', sm: '1rem' } }}>Email me when new grades are posted</Typography>}
                                    />
                                    <FormControlLabel
                                        control={<Switch checked={notifications.smsGrades} onChange={handleToggleNotification('smsGrades')} />}
                                        label={<Typography sx={{ fontWeight: 500, fontSize: { xs: '0.9rem', sm: '1rem' } }}>Text me (SMS) when new grades are posted</Typography>}
                                    />
                                </FormGroup>
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Campus & Billing</Typography>
                                <FormGroup sx={{ gap: 1.5 }}>
                                    <FormControlLabel
                                        control={<Switch checked={notifications.emailAnnouncements} onChange={handleToggleNotification('emailAnnouncements')} />}
                                        label={<Typography sx={{ fontWeight: 500, fontSize: { xs: '0.9rem', sm: '1rem' } }}>Receive weekly campus announcements</Typography>}
                                    />
                                    <FormControlLabel
                                        control={<Switch checked={notifications.smsAlerts} onChange={handleToggleNotification('smsAlerts')} color="error" />}
                                        label={<Typography sx={{ fontWeight: 500, fontSize: { xs: '0.9rem', sm: '1rem' } }}>Receive urgent campus emergency texts</Typography>}
                                    />
                                    <FormControlLabel
                                        control={<Switch checked={notifications.emailBilling} onChange={handleToggleNotification('emailBilling')} />}
                                        label={<Typography sx={{ fontWeight: 500, fontSize: { xs: '0.9rem', sm: '1rem' } }}>Email me when tuition statements are available</Typography>}
                                    />
                                </FormGroup>
                            </Box>
                        </CustomTabPanel>

                        {/* ================= TAB 2: SECURITY ================= */}
                        <CustomTabPanel value={tabValue} index={2}>
                            <Box sx={{ mb: 4 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Password & Authentication</Typography>
                                <Button variant="outlined" sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, mb: 4, width: { xs: '100%', sm: 'auto' } }}>
                                    Change Password
                                </Button>

                                <FormGroup>
                                    <FormControlLabel
                                        control={<Switch checked={security.twoFactorEnabled} onChange={handleToggleSecurity('twoFactorEnabled')} color="primary" />}
                                        label={
                                            <Box sx={{ ml: 1 }}>
                                                <Typography sx={{ fontWeight: 600, fontSize: { xs: '0.95rem', sm: '1rem' } }}>Two-Factor Authentication (2FA)</Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Require an extra security code when logging in.</Typography>
                                            </Box>
                                        }
                                        sx={{ alignItems: 'flex-start', m: 0 }}
                                    />
                                </FormGroup>
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Privacy</Typography>
                                <FormGroup>
                                    <FormControlLabel
                                        control={<Switch checked={security.directoryVisibility} onChange={handleToggleSecurity('directoryVisibility')} />}
                                        label={
                                            <Box sx={{ ml: 1 }}>
                                                <Typography sx={{ fontWeight: 600, fontSize: { xs: '0.95rem', sm: '1rem' } }}>Student Directory Visibility</Typography>
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Allow other students and faculty to find your profile.</Typography>
                                            </Box>
                                        }
                                        sx={{ alignItems: 'flex-start', m: 0 }}
                                    />
                                </FormGroup>
                            </Box>
                        </CustomTabPanel>

                        {/* Global Action Area */}
                        <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<SaveIcon />}
                                onClick={handleSave}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    width: { xs: '100%', sm: 'auto' },
                                    py: { xs: 1.5, sm: 1 }
                                }}
                            >
                                Save Changes
                            </Button>
                        </Box>

                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}