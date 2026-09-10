import { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import {
    Box,
    Typography,
    Paper,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Collapse,
    IconButton,
    Chip,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    CardHeader,
    Divider,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaymentsIcon from '@mui/icons-material/Payments';
import SchoolIcon from '@mui/icons-material/School';
import { GET_FEE_TEMPLATES } from './queries';

interface Fee {
    id: string;
    title: string;
    amountZmw: number;
    amountUsd?: number | null;
    frequency: string;
    feeable?: { __typename: string } | null;
}

interface Program {
    id: string;
    code: string;
    title: string;
    level: string;
    fees: Fee[];
}

interface School {
    id: string;
    name: string;
    description?: string | null;
    fees: Fee[];
    programs: Program[];
}

interface GetFeeTemplatesData {
    schools?: {
        edges?: Array<{
            node: School;
        }>;
    };
    fees?: {
        edges?: Array<{
            node: Fee;
        }>;
    };
}

const formatCurrency = (amount: number, currency: 'ZMW' | 'USD') => {
    return new Intl.NumberFormat('en-ZM', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
    }).format(amount);
};

const formatFrequency = (freq: string) => freq.replace(/_/g, ' ');

function ProgramRow({ program }: { program: Program }) {
    const [open, setOpen] = useState(false);
    const hasFees = program.fees && program.fees.length > 0;

    return (
        <>
            <TableRow
                sx={{
                    '& > *': { borderBottom: open ? 'unset' : undefined },
                    bgcolor: open ? 'action.selected' : 'inherit',
                    transition: 'background-color 0.2s',
                }}
            >
                <TableCell width={48}>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                        disabled={!hasFees}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {program.code}
                    </Typography>
                </TableCell>
                <TableCell>
                    <Typography variant="body2">{program.title}</Typography>
                </TableCell>
                <TableCell>
                    <Chip
                        label={program.level.replace(/_/g, ' ')}
                        size="small"
                        variant="outlined"
                        color="primary"
                    />
                </TableCell>
                <TableCell align="right">
                    <Chip
                        label={`${program.fees.length} Fee${program.fees.length === 1 ? '' : 's'}`}
                        size="small"
                        color={hasFees ? 'info' : 'default'}
                    />
                </TableCell>
            </TableRow>

            {/* NESTED SUB-ROW FOR PROGRAM FEES */}
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={5}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box
                            sx={{
                                margin: 2,
                                ml: 4,
                                p: 2,
                                bgcolor: 'background.paper',
                                borderRadius: 1,
                                borderLeft: '4px solid',
                                borderColor: 'primary.main',
                                boxShadow: 1,
                            }}
                        >
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', mb: 1, display: 'block' }}>
                                Assigned Program Fees ({program.title})
                            </Typography>

                            {hasFees ? (
                                <Table size="small" aria-label="program fees">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600 }}>Fee Title</TableCell>
                                            <TableCell sx={{ fontWeight: 600 }}>Frequency</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 600 }}>Amount (ZMW)</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 600 }}>Amount (USD)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {program.fees.map((fee) => (
                                            <TableRow key={fee.id} hover>
                                                <TableCell>{fee.title}</TableCell>
                                                <TableCell>
                                                    <Chip label={formatFrequency(fee.frequency)} size="small" variant="filled" sx={{ fontSize: '0.72rem' }} />
                                                </TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 600, color: 'success.main' }}>
                                                    {formatCurrency(fee.amountZmw, 'ZMW')}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {fee.amountUsd ? formatCurrency(fee.amountUsd, 'USD') : '—'}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    No specific fees attached to this program.
                                </Typography>
                            )}
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}

export default function FeeTemplatesPage() {
    const [activeTab, setActiveTab] = useState(0);
    const { data, loading, error } = useQuery<GetFeeTemplatesData>(GET_FEE_TEMPLATES);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ my: 2 }}>
                Failed to load fee structures: {error.message}
            </Alert>
        );
    }

    // Extract universal fees (fees where feeable is null)
    const universalFees: Fee[] =
        data?.fees?.edges
            ?.map((e: { node: Fee }) => e.node)
            .filter((fee: Fee) => !fee.feeable) || [];

    // Extract schools and programs structure
    const schools: School[] =
        data?.schools?.edges?.map((e: { node: School }) => e.node) || [];

    return (
        <Box sx={{ width: '100%', flexGrow: 1 }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                    Fee Packages & Templates
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Manage master fee configurations across programs and institution-wide tiers.
                </Typography>
            </Box>

            {/* TABS HEADER */}
            <Paper sx={{ mb: 3 }}>
                <Tabs
                    value={activeTab}
                    onChange={(_, newValue) => setActiveTab(newValue)}
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab icon={<PaymentsIcon />} iconPosition="start" label="Universal Fees" />
                    <Tab icon={<SchoolIcon />} iconPosition="start" label="Program Fees" />
                </Tabs>
            </Paper>

            {/* TAB 1: UNIVERSAL FEES */}
            {activeTab === 0 && (
                <TableContainer component={Paper} elevation={1}>
                    <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PaymentsIcon color="primary" />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            General & Universal Fees
                        </Typography>
                    </Box>
                    <Divider />
                    <Table aria-label="universal fees table">
                        <TableHead sx={{ bgcolor: 'action.hover' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Fee Title</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Frequency</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>Amount (ZMW)</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>Amount (USD)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {universalFees.length > 0 ? (
                                universalFees.map((fee) => (
                                    <TableRow key={fee.id} hover>
                                        <TableCell sx={{ fontWeight: 500 }}>{fee.title}</TableCell>
                                        <TableCell>
                                            <Chip label={formatFrequency(fee.frequency)} size="small" />
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 600, color: 'success.main' }}>
                                            {formatCurrency(fee.amountZmw, 'ZMW')}
                                        </TableCell>
                                        <TableCell align="right">
                                            {fee.amountUsd ? formatCurrency(fee.amountUsd, 'USD') : '—'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            No universal fees configured.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* TAB 2: PROGRAM FEES */}
            {activeTab === 1 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {schools.length > 0 ? (
                        schools.map((school) => (
                            <Card key={school.id} variant="outlined" sx={{ borderRadius: 2 }}>
                                <CardHeader
                                    avatar={<AccountBalanceIcon color="primary" />}
                                    title={<Typography variant="h6">{school.name}</Typography>}
                                    subheader={school.description || `${school.programs.length} Academic Programs`}
                                    sx={{ bgcolor: 'action.hover', pb: 1.5 }}
                                />
                                <Divider />
                                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                                    <TableContainer>
                                        <Table aria-label={`programs table for ${school.name}`}>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell width={48} />
                                                    <TableCell sx={{ fontWeight: 700 }}>Code</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>Program Title</TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>Level</TableCell>
                                                    <TableCell align="right" sx={{ fontWeight: 700 }}>Attached Fees</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {school.programs.length > 0 ? (
                                                    school.programs.map((program) => (
                                                        <ProgramRow key={program.id} program={program} />
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={5} align="center" sx={{ py: 2 }}>
                                                            <Typography variant="body2" color="text.secondary">
                                                                No programs available under this school.
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <Typography color="text.secondary">No schools or program fees found.</Typography>
                        </Paper>
                    )}
                </Box>
            )}
        </Box>
    );
}