import { useState } from 'react';
import {
    Container,
    Typography,
    Paper,
    Box,
    Grid,
    Button,
    Divider,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Card,
    CardContent,
    Alert,
    Snackbar,
    Stack,
    Tabs,
    Tab,
    Chip,
    Skeleton,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import {
    Download as DownloadIcon,
    ContentCopy as CopyIcon,
    AccountBalance as BankIcon,
    Info as InfoIcon,
    Check as CheckIcon,
    ArrowRight as ArrowIcon,
    AccountBalanceWallet as PaymentIcon,
    School as SchoolIcon,
    MenuBook as ProgramIcon,
    ExpandMore as ExpandMoreIcon,
    Timer as TimerIcon
} from '@mui/icons-material';
import { useQuery } from '@apollo/client/react';
import { jsPDF } from 'jspdf';
import { COLLEGE_INFO, APPLICANT_INFO_DATA, type BankDetail } from '../../../data/collegeInfo';
import { GET_SCHOOLS_WITH_PROGRAMS } from './queries';

// TypeScript interfaces for GraphQL response
interface Requirement {
    id: string;
    description: string;
    sortOrder: number;
}

interface Program {
    id: string;
    code: string;
    title: string;
    level: string;
    durationValue: number;
    durationUnit: string;
    shortDescription?: string;
    longDescription?: string;
    requirements: Requirement[];
}

interface SchoolNode {
    id: string;
    name: string;
    description?: string;
    programs: Program[];
}

interface SchoolEdge {
    node: SchoolNode;
}

interface GetSchoolsData {
    schools: {
        edges: SchoolEdge[];
    };
}

export default function InfoPage() {
    const [pageTab, setPageTab] = useState<number>(0); // 0 = Guidelines & Fees (Page 1), 1 = Programs & Schools (Page 2)
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<string>('');

    // GraphQL Query for Page 2
    const { data, loading, error } = useQuery<GetSchoolsData>(GET_SCHOOLS_WITH_PROGRAMS, {
        skip: pageTab !== 1 // Only fetch when on Page 2
    });

    // Formatted text for clipboard
    const getFormattedBankText = (bank: BankDetail) => {
        return [
            `=========================================`,
            `  ${COLLEGE_INFO.name.toUpperCase()} - BANK DETAILS`,
            `=========================================`,
            `Bank Name      : ${bank.bankName}`,
            `Account Name   : ${bank.accountName}`,
            `Account Number : ${bank.accountNumber}`,
            `Currency       : ${bank.currency}`,
            `Branch         : ${bank.branch}`,
            `SWIFT Code     : ${bank.swiftCode || 'N/A'}`,
            `-----------------------------------------`,
            `Payment Ref    : [Your Full Name / NRC Number]`,
            `=========================================`
        ].join('\n');
    };

    // PDF Generator
    const handleDownloadBankDetails = (bank: BankDetail) => {
        const doc = new jsPDF();
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text(COLLEGE_INFO.name.toUpperCase(), 20, 20);

        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('OFFICIAL BANKING & DEPOSIT INFORMATION', 20, 28);
        doc.setLineWidth(0.5);
        doc.line(20, 32, 190, 32);

        let y = 44;
        const details: [string, string][] = [
            ['Bank Name:', bank.bankName],
            ['Account Name:', bank.accountName],
            ['Account Number:', bank.accountNumber],
            ['Currency:', bank.currency],
            ['Branch:', bank.branch],
            ['SWIFT Code:', bank.swiftCode || 'N/A'],
            ['Payment Reference:', 'Your Full Name / NRC Number'],
        ];

        details.forEach(([label, value]) => {
            doc.setFont('helvetica', 'bold');
            doc.setFontSize(10);
            doc.text(label, 20, y);
            doc.setFont('helvetica', 'normal');
            doc.text(value, 70, y);
            y += 8;
        });

        doc.line(20, y + 4, 190, y + 4);
        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text('Notice: Always use your full registered name or official identification as the payment reference.', 20, y + 14);

        doc.save(`${COLLEGE_INFO.name.replace(/\s+/g, '_')}_Bank_Details.pdf`);
    };

    const handleCopyBankDetails = async (bank: BankDetail) => {
        const textContent = getFormattedBankText(bank);
        try {
            await navigator.clipboard.writeText(textContent);
            setSnackbarOpen(true);
        } catch (err) {
            console.error('Failed to copy bank details:', err);
        }
    };

    const scrollToSection = (id: string) => {
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const schoolsList = data?.schools?.edges.map((edge) => edge.node) || [];

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Page Header */}
            <Box sx={{ mb: 3, textAlign: 'center' }}>
                <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                    {APPLICANT_INFO_DATA.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Essential guidelines, fee payment details, institutional policies, and available academic programs.
                </Typography>

                {/* Page Navigation Tabs */}
                <Box sx={{ display: 'flex', justifyContent: 'center', borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={pageTab} onChange={(_, val: number) => setPageTab(val)} indicatorColor="primary">
                        <Tab label="Guidelines & Fee Payment" id="tab-0" />
                        <Tab label="Academic Programs & Schools" id="tab-1" />
                    </Tabs>
                </Box>
            </Box>

            <Grid container spacing={4}>
                {/* Main Content Area */}
                <Grid size={{ xs: 12, md: 8.5 }}>
                    {pageTab === 0 && (
                        /* ==================== PAGE 1 CONTENT ==================== */
                        <Stack spacing={3}>
                            {APPLICANT_INFO_DATA.sections.map((section) => {
                                const isDepositSection =
                                    section.id.includes('deposit') ||
                                    section.id.includes('fee') ||
                                    section.id.includes('payment') ||
                                    section.title.toLowerCase().includes('deposit') ||
                                    section.title.toLowerCase().includes('fee') ||
                                    section.title.toLowerCase().includes('payment');

                                return (
                                    <Paper key={section.id} id={section.id} variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>
                                            {section.title}
                                        </Typography>

                                        {section.paragraphs.map((p, idx) => (
                                            <Typography key={idx} variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, mb: 2 }}>
                                                {p}
                                            </Typography>
                                        ))}

                                        {section.bullets && (
                                            <List dense disablePadding sx={{ mt: 1 }}>
                                                {section.bullets.map((bullet, idx) => (
                                                    <ListItem key={idx} disableGutters sx={{ alignItems: 'flex-start', py: 0.5 }}>
                                                        <ListItemIcon sx={{ minWidth: 28, mt: 0.5 }}>
                                                            <CheckIcon color="success" fontSize="small" />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={bullet}
                                                            slotProps={{ primary: { variant: 'body2', color: 'text.secondary', sx: { lineHeight: 1.6 } } }}
                                                        />
                                                    </ListItem>
                                                ))}
                                            </List>
                                        )}

                                        {isDepositSection && (
                                            <Alert
                                                severity="info"
                                                icon={<PaymentIcon />}
                                                sx={{ mt: 3, borderRadius: 2 }}
                                                action={
                                                    <Button color="primary" size="small" variant="contained" disableElevation onClick={() => scrollToSection('bank-details')}>
                                                        View Details
                                                    </Button>
                                                }
                                            >
                                                Ready to pay fees or make a deposit? View official institution bank details below.
                                            </Alert>
                                        )}
                                    </Paper>
                                );
                            })}

                            <Divider sx={{ my: 1 }} />

                            {/* BANK DETAILS SECTION AT BOTTOM */}
                            <Box id="bank-details" sx={{ pt: 1 }}>
                                <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <BankIcon color="primary" /> Official Bank Details
                                </Typography>

                                {COLLEGE_INFO.bankDetails.map((bank, index) => (
                                    <Card key={index} variant="outlined" sx={{ borderRadius: 3, borderColor: 'primary.main', borderWidth: 2, mb: 2 }}>
                                        <CardContent sx={{ p: 3 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                                                <Box>
                                                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                                        {bank.bankName}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Account Name: <strong>{bank.accountName}</strong>
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', gap: 1 }}>
                                                    <Button size="small" variant="outlined" startIcon={<CopyIcon />} onClick={() => void handleCopyBankDetails(bank)}>
                                                        Copy Details
                                                    </Button>
                                                    <Button size="small" variant="contained" startIcon={<DownloadIcon />} onClick={() => handleDownloadBankDetails(bank)}>
                                                        Download PDF
                                                    </Button>
                                                </Box>
                                            </Box>

                                            <Divider sx={{ my: 2 }} />

                                            <Grid container spacing={2}>
                                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Account Number</Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>{bank.accountNumber}</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Currency</Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 700 }}>{bank.currency}</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>Branch</Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 600 }}>{bank.branch}</Typography>
                                                </Grid>
                                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>SWIFT Code</Typography>
                                                    <Typography variant="body1" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>{bank.swiftCode || 'N/A'}</Typography>
                                                </Grid>
                                            </Grid>

                                            <Alert severity="info" icon={<InfoIcon />} sx={{ mt: 2 }}>
                                                Always use your <strong>Full Name</strong> or <strong>NRC Number</strong> as the deposit reference.
                                            </Alert>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>
                        </Stack>
                    )}

                    {pageTab === 1 && (
                        /* ==================== PAGE 2 CONTENT (DYNAMIC GRAPHQL) ==================== */
                        <Stack spacing={3}>
                            {loading && (
                                <Box>
                                    <Skeleton variant="rounded" height={100} sx={{ mb: 2 }} />
                                    <Skeleton variant="rounded" height={200} sx={{ mb: 2 }} />
                                    <Skeleton variant="rounded" height={200} />
                                </Box>
                            )}

                            {error && (
                                <Alert severity="error">
                                    Unable to load programs and schools at this time. Please try again later.
                                </Alert>
                            )}

                            {!loading && !error && schoolsList.map((school) => (
                                <Paper key={school.id} id={`school-${school.id}`} variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                                        <SchoolIcon /> {school.name}
                                    </Typography>

                                    {school.description && (
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                            {school.description}
                                        </Typography>
                                    )}

                                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, textTransform: 'uppercase', color: 'text.secondary' }}>
                                        Offered Programs ({school.programs.length})
                                    </Typography>

                                    <Stack spacing={2}>
                                        {school.programs.map((program) => (
                                            <Accordion key={program.id} id={`program-${program.id}`} variant="outlined" sx={{ borderRadius: '8px !important' }}>
                                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', width: '100%' }}>
                                                        <ProgramIcon color="action" fontSize="small" />
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                                            {program.title}
                                                        </Typography>
                                                        <Chip label={program.code} size="small" variant="outlined" />
                                                        <Chip label={program.level} size="small" color="primary" />
                                                        <Box sx={{ ml: 'auto', mr: 2, display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                                                            <TimerIcon fontSize="small" />
                                                            <Typography variant="caption">
                                                                {program.durationValue} {program.durationUnit}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </AccordionSummary>
                                                <AccordionDetails sx={{ pt: 0 }}>
                                                    <Divider sx={{ mb: 2 }} />
                                                    {program.shortDescription && (
                                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                                            {program.shortDescription}
                                                        </Typography>
                                                    )}

                                                    {program.requirements.length > 0 && (
                                                        <Box>
                                                            <Typography variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', color: 'text.secondary' }}>
                                                                Admission Requirements
                                                            </Typography>
                                                            <List dense disablePadding sx={{ mt: 0.5 }}>
                                                                {program.requirements.map((req) => (
                                                                    <ListItem key={req.id} disableGutters sx={{ py: 0.25 }}>
                                                                        <ListItemIcon sx={{ minWidth: 24 }}>
                                                                            <CheckIcon color="success" sx={{ fontSize: 16 }} />
                                                                        </ListItemIcon>
                                                                        <ListItemText primary={req.description} slotProps={{ primary: { variant: 'body2' } }} />
                                                                    </ListItem>
                                                                ))}
                                                            </List>
                                                        </Box>
                                                    )}
                                                </AccordionDetails>
                                            </Accordion>
                                        ))}
                                    </Stack>
                                </Paper>
                            ))}
                        </Stack>
                    )}
                </Grid>

                {/* Right Fixed Sidebar Navigation */}
                <Grid size={{ xs: 12, md: 3.5 }}>
                    <Paper
                        variant="outlined"
                        sx={{
                            p: 2,
                            borderRadius: 3,
                            position: 'sticky',
                            top: 24,
                            maxHeight: 'calc(100vh - 48px)',
                            overflowY: 'auto'
                        }}
                    >
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1, px: 1, textTransform: 'uppercase', color: 'text.secondary' }}>
                            Quick Navigation
                        </Typography>

                        <List dense disablePadding>
                            {pageTab === 0 ? (
                                /* Navigation for Page 1 */
                                <>
                                    {APPLICANT_INFO_DATA.sections.map((section) => (
                                        <ListItem key={section.id} disablePadding sx={{ mb: 0.5 }}>
                                            <ListItemButton onClick={() => scrollToSection(section.id)} selected={activeSection === section.id} sx={{ borderRadius: 1.5 }}>
                                                <ListItemIcon sx={{ minWidth: 28 }}>
                                                    <ArrowIcon fontSize="small" />
                                                </ListItemIcon>
                                                <ListItemText primary={section.title} slotProps={{ primary: { variant: 'body2' } }} />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                    <Divider sx={{ my: 1 }} />
                                    <ListItem disablePadding>
                                        <ListItemButton onClick={() => scrollToSection('bank-details')} selected={activeSection === 'bank-details'} sx={{ borderRadius: 1.5 }}>
                                            <ListItemIcon sx={{ minWidth: 28 }}>
                                                <BankIcon fontSize="small" color="primary" />
                                            </ListItemIcon>
                                            <ListItemText primary="Bank Details" slotProps={{ primary: { variant: 'body2', sx: { fontWeight: 700, color: 'primary.main' } } }} />
                                        </ListItemButton>
                                    </ListItem>
                                </>
                            ) : (
                                /* Navigation for Page 2 */
                                <>
                                    {schoolsList.map((school) => (
                                        <ListItem key={school.id} disablePadding sx={{ mb: 0.5 }}>
                                            <ListItemButton onClick={() => scrollToSection(`school-${school.id}`)} selected={activeSection === `school-${school.id}`} sx={{ borderRadius: 1.5 }}>
                                                <ListItemIcon sx={{ minWidth: 28 }}>
                                                    <SchoolIcon fontSize="small" color="primary" />
                                                </ListItemIcon>
                                                <ListItemText primary={school.name} slotProps={{ primary: { variant: 'body2', sx: { fontWeight: 600 } } }} />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </>
                            )}
                        </List>
                    </Paper>
                </Grid>
            </Grid>

            {/* Notification */}
            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)} message="Bank details copied to clipboard" />
        </Container>
    );
}