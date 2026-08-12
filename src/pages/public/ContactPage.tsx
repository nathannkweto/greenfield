import React, { useState } from 'react';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Stack,
    useTheme,
    useMediaQuery
} from '@mui/material';
import Grid from '@mui/material/Grid';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SendIcon from '@mui/icons-material/Send';
import { COLLEGE_INFO } from '../../data/collegeInfo';

export default function ContactPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Form Submitted:', formData);
        alert(`Thank you for contacting ${COLLEGE_INFO.name}! We will get back to you shortly.`);
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
            {/* ================= HEADER SECTION ================= */}
            <Box sx={{ mb: { xs: 4, md: 6 }, textAlign: isMobile ? 'left' : 'center', px: { xs: 1, sm: 0 } }}>
                <Typography
                    variant={isMobile ? "h4" : "h3"}
                    component="h1"
                    sx={{ fontWeight: 800, color: 'text.primary', letterSpacing: '-0.03em', mb: 1.5, lineHeight: 1.2 }}
                >
                    Contact Admissions & Support
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: '60ch', mx: isMobile ? 0 : 'auto', lineHeight: 1.6 }}>
                    Have questions about programs, enrollment, or campus life? Reach out to our team, or visit our administration offices.
                </Typography>
            </Box>

            {/* ================= MAIN LAYOUT GRID ================= */}
            <Grid container spacing={4}>
                {/* LEFT COLUMN: Contact Form */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <Paper
                        variant="outlined"
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            p: { xs: 3, md: 4 },
                            borderRadius: { xs: 3, md: 4 },
                            borderColor: '#e5e7eb',
                            backgroundColor: 'background.paper'
                        }}
                    >
                        <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', mb: 3 }}>
                            Send us a Message
                        </Typography>

                        <Grid container spacing={2.5}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Full Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    variant="outlined"
                                    slotProps={{ inputLabel: { shrink: true } }}
                                    placeholder="John Banda"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    variant="outlined"
                                    slotProps={{ inputLabel: { shrink: true } }}
                                    placeholder="johnbanda@example.com"
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    variant="outlined"
                                    slotProps={{ inputLabel: { shrink: true } }}
                                    placeholder="Inquiry regarding admissions"
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Message"
                                    name="message"
                                    multiline
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    variant="outlined"
                                    slotProps={{ inputLabel: { shrink: true } }}
                                    placeholder="Type your detailed query here..."
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disableElevation
                                    endIcon={<SendIcon />}
                                    fullWidth={isMobile}
                                    sx={{
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: 2.5,
                                        fontWeight: 700,
                                        textTransform: 'none'
                                    }}
                                >
                                    Submit Inquiry
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* RIGHT COLUMN: Contact Info & Map */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <Stack spacing={3}>
                        {/* Contact Details Card */}
                        <Paper
                            variant="outlined"
                            sx={{
                                p: { xs: 3, md: 4 },
                                borderRadius: { xs: 3, md: 4 },
                                borderColor: '#e5e7eb',
                                backgroundColor: 'background.paper'
                            }}
                        >
                            <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', mb: 3 }}>
                                Campus Information
                            </Typography>

                            <Stack spacing={3}>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                    <LocationOnIcon sx={{ color: 'primary.main', mt: 0.3 }} />
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Our Address</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, lineHeight: 1.5 }}>{COLLEGE_INFO.address}</Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                    <EmailIcon sx={{ color: 'primary.main', mt: 0.3 }} />
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Email Enquiries</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{COLLEGE_INFO.email}</Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                                    <PhoneIcon sx={{ color: 'primary.main', mt: 0.3 }} />
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Call Center</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{COLLEGE_INFO.phone}</Typography>
                                    </Box>
                                </Box>
                            </Stack>
                        </Paper>

                        {/* Map Container Element */}
                        <Paper
                            variant="outlined"
                            sx={{
                                height: { xs: 180, sm: 220 },
                                borderRadius: { xs: 3, md: 4 },
                                borderColor: '#e5e7eb',
                                backgroundColor: '#f8fafc',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden'
                            }}
                        >
                            <Typography variant="body2" color="text.disabled" sx={{ fontWeight: 600 }}>
                                [ Interactive Map Coming Soon ]
                            </Typography>
                        </Paper>
                    </Stack>
                </Grid>
            </Grid>
        </Container>
    );
}