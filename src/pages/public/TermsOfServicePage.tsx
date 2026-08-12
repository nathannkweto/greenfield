import {
    Container,
    Typography,
    Box,
    Paper,
    Divider,
    Stack,
    List,
    ListItem,
    ListItemIcon,
    Button
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CircleIcon from '@mui/icons-material/Circle';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Link as RouterLink } from 'react-router-dom';
import { TERMS_OF_SERVICE_DATA } from '../../data/termsOfServiceData.ts';
import { COLLEGE_INFO } from '../../data/collegeInfo.ts';

export default function TermsOfServicePage() {
    return (
        <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
            {/* Top Navigation */}
            <Box sx={{ mb: 3 }}>
                <Button
                    component={RouterLink}
                    to="/"
                    startIcon={<ArrowBackIcon />}
                    sx={{ textTransform: 'none', color: 'text.secondary', fontWeight: 600 }}
                >
                    Back to Home
                </Button>
            </Box>

            {/* Document Container */}
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 3, sm: 5, md: 6 },
                    borderRadius: 3,
                    border: 1,
                    borderColor: 'divider',
                    backgroundColor: 'background.paper'
                }}
            >
                {/* Header Section */}
                <Box sx={{ mb: 4 }}>
                    <Typography
                        variant="h3"
                        component="h1"
                        sx={{ fontWeight: 800, color: 'text.primary', fontSize: { xs: '2rem', md: '2.5rem' }, mb: 1 }}
                    >
                        {TERMS_OF_SERVICE_DATA.title}
                    </Typography>

                    <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {COLLEGE_INFO.name} • Effective Date: {TERMS_OF_SERVICE_DATA.effectiveDate}
                    </Typography>

                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        Last Updated: {TERMS_OF_SERVICE_DATA.lastUpdated}
                    </Typography>
                </Box>

                <Divider sx={{ mb: 4, borderColor: 'divider' }} />

                {/* Introduction */}
                <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', mb: 4, fontSize: '1.05rem' }}>
                    {TERMS_OF_SERVICE_DATA.introduction}
                </Typography>

                {/* Dynamic Section Mapping */}
                <Stack spacing={4}>
                    {TERMS_OF_SERVICE_DATA.sections.map((section) => (
                        <Box key={section.id} id={section.id}>
                            <Typography
                                variant="h6"
                                component="h2"
                                sx={{ fontWeight: 700, color: 'text.primary', mb: 1.5, fontSize: '1.25rem' }}
                            >
                                {section.title}
                            </Typography>

                            <Stack spacing={1.5}>
                                {section.paragraphs.map((paragraph, index) => (
                                    <Typography
                                        key={index}
                                        variant="body1"
                                        sx={{ lineHeight: 1.75, color: 'text.secondary' }}
                                    >
                                        {paragraph}
                                    </Typography>
                                ))}

                                {/* Optional Bullet Points */}
                                {section.bullets && section.bullets.length > 0 && (
                                    <List disablePadding sx={{ mt: 1 }}>
                                        {section.bullets.map((bullet, index) => (
                                            <ListItem key={index} disableGutters sx={{ py: 0.5, alignItems: 'flex-start' }}>
                                                <ListItemIcon sx={{ minWidth: 24, mt: 1 }}>
                                                    <CircleIcon sx={{ fontSize: 6, color: 'primary.main' }} />
                                                </ListItemIcon>
                                                <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                                                    {bullet}
                                                </Typography>
                                            </ListItem>
                                        ))}
                                    </List>
                                )}

                                {/* Special Handling for Contact Section */}
                                {section.id === 'contact-information' && (
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 3,
                                            mt: 2,
                                            borderRadius: 2,
                                            backgroundColor: 'action.hover',
                                            borderColor: 'divider'
                                        }}
                                    >
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5, color: 'text.primary' }}>
                                            {COLLEGE_INFO.name} Administration
                                        </Typography>
                                        <Stack spacing={1}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <LocationOnIcon fontSize="small" color="primary" />
                                                <Typography variant="body2" color="text.secondary">
                                                    {COLLEGE_INFO.address}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <EmailIcon fontSize="small" color="primary" />
                                                <Typography variant="body2" color="text.secondary">
                                                    legal@{COLLEGE_INFO.name.toLowerCase().replace(/\s+/g, '')}.edu
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Paper>
                                )}
                            </Stack>
                        </Box>
                    ))}
                </Stack>
            </Paper>
        </Container>
    );
}