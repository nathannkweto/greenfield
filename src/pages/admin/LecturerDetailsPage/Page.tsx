import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import {
    Box,
    Container,
    CircularProgress,
    Typography,
    Paper,
    Grid,
    Divider,
    Avatar,
    Chip,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import UpdateIcon from '@mui/icons-material/Update';

import { PageHeader } from '../../../components/PageHeader';
import { LecturerModal } from '../SchoolDetailsPage/components/LecturerModal';
import { GET_LECTURER_DETAILS } from './queries';

interface User {
    id: string;
    email: string;
}

interface School {
    id: string;
    name: string;
}

interface Course {
    id: string;
    code: string;
    title: string;
    credits?: number | null;
}

interface Program {
    id: string;
    name: string;
    code?: string | null;
}

interface Curriculum {
    id: string;
    year: number;
    program?: Program | null;
    course?: Course | null;
}

interface Lecturer {
    id: string;
    firstName: string;
    middleName?: string | null;
    lastName: string;
    dob?: string | null;
    address?: string | null;
    emergencyContact?: string | null;
    createdAt?: string | null;
    updatedAt?: string | null;
    school?: School | null;
    user?: User | null;
    curricula?: Curriculum[] | null;
}

interface GetLecturerDetailsData {
    lecturer?: Lecturer | null;
    lecturers?: {
        edges: Array<{
            node: Lecturer;
        }>;
    } | null;
}

interface GetLecturerDetailsVars {
    id?: string;
}

const LecturerModalComponent = LecturerModal as React.ComponentType<{
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    lecturer?: Lecturer | null;
}>;

export default function LecturerDetailsPage() {
    const { lecturerId } = useParams<{ lecturerId: string }>();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const { data, loading, error, refetch } = useQuery<
        GetLecturerDetailsData,
        GetLecturerDetailsVars
    >(GET_LECTURER_DETAILS, {
        variables: { id: lecturerId },
        skip: !lecturerId,
    });

    const lecturer =
        data?.lecturer ||
        data?.lecturers?.edges?.find(({ node }) => node.id === lecturerId)?.node;

    if (loading) {
        return (
            <Container sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error || !lecturer) {
        return (
            <Container sx={{ py: 6 }}>
                <Alert severity="error">
                    Failed to load lecturer profile. {error?.message}
                </Alert>
            </Container>
        );
    }

    const fullName =
        [lecturer.firstName, lecturer.middleName, lecturer.lastName]
            .filter(Boolean)
            .join(' ') || 'Faculty Member';

    const curricula = lecturer.curricula || [];

    return (
        <Box sx={{ backgroundColor: 'background.default', minHeight: '80vh', py: 4 }}>
            <Container maxWidth="xl">
                <PageHeader
                    title={fullName}
                    subtitle={lecturer.school?.name || 'Faculty Member'}
                    backUrl={-1 as unknown as string}
                    backLabel="Back"
                    actionLabel="Edit Details"
                    actionIcon={<EditIcon />}
                    onAction={() => setIsEditModalOpen(true)}
                />

                <Grid container spacing={3}>
                    {/* Profile Sidebar */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper
                            variant="outlined"
                            sx={{
                                p: 3,
                                borderRadius: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                textAlign: 'center',
                                mb: 3,
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 104,
                                    height: 104,
                                    mb: 2,
                                    backgroundColor: 'primary.main',
                                    fontSize: '2.25rem',
                                    fontWeight: 600,
                                    boxShadow: 2,
                                }}
                            >
                                {lecturer.firstName?.charAt(0)}
                                {lecturer.lastName?.charAt(0)}
                            </Avatar>

                            <Typography variant="h6" fontWeight={700}>
                                {fullName}
                            </Typography>

                            <Stack direction="row" spacing={1} sx={{ mt: 1, mb: 2 }}>
                                <Chip
                                    icon={<SchoolIcon fontSize="small" />}
                                    label={lecturer.school?.name || 'Unassigned Faculty'}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                />
                            </Stack>

                            <Divider flexItem sx={{ my: 2 }} />

                            {/* Personal Info List */}
                            <Box sx={{ width: '100%', textAlign: 'left' }}>
                                <Stack spacing={2}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                        <EmailIcon fontSize="small" color="action" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                Email Address
                                            </Typography>
                                            <Typography variant="body2" fontWeight={500}>
                                                {lecturer.user?.email || 'N/A'}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {lecturer.dob && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <CalendarTodayIcon fontSize="small" color="action" />
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                    Date of Birth
                                                </Typography>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {new Date(lecturer.dob).toLocaleDateString()}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )}

                                    {lecturer.address && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <LocationOnIcon fontSize="small" color="action" />
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                    Address
                                                </Typography>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {lecturer.address}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )}

                                    {lecturer.emergencyContact && (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                            <ContactPhoneIcon fontSize="small" color="action" />
                                            <Box>
                                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                    Emergency Contact
                                                </Typography>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {lecturer.emergencyContact}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )}
                                </Stack>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Main Details & Curricula */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Stack spacing={3}>
                            {/* Profile Record */}
                            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                    Faculty Record
                                </Typography>
                                <Divider sx={{ mb: 3 }} />

                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                            Faculty / School
                                        </Typography>
                                        <Typography variant="body1" fontWeight={500}>
                                            {lecturer.school?.name || 'Unassigned'}
                                        </Typography>
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                            System User ID
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                            {lecturer.user?.id || 'N/A'}
                                        </Typography>
                                    </Grid>

                                    {lecturer.createdAt && (
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                Record Created
                                            </Typography>
                                            <Typography variant="body2">
                                                {new Date(lecturer.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </Grid>
                                    )}

                                    {lecturer.updatedAt && (
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                Last Updated
                                            </Typography>
                                            <Typography variant="body2">
                                                {new Date(lecturer.updatedAt).toLocaleDateString()}
                                            </Typography>
                                        </Grid>
                                    )}
                                </Grid>
                            </Paper>

                            {/* Assigned Curricula */}
                            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                    <MenuBookIcon color="primary" />
                                    <Typography variant="h6" fontWeight={600}>
                                        Assigned Curricula
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    Academic curriculum assignments managed by this lecturer.
                                </Typography>
                                <Divider sx={{ mb: 2 }} />

                                {curricula.length === 0 ? (
                                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                                        No curricula currently assigned to this lecturer.
                                    </Typography>
                                ) : (
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 600 }}>Course Code</TableCell>
                                                    <TableCell sx={{ fontWeight: 600 }}>Course Title</TableCell>
                                                    <TableCell sx={{ fontWeight: 600 }}>Program</TableCell>
                                                    <TableCell sx={{ fontWeight: 600 }}>Academic Year</TableCell>
                                                    <TableCell sx={{ fontWeight: 600 }} align="right">
                                                        Credits
                                                    </TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {curricula.map((item) => (
                                                    <TableRow key={item.id} hover>
                                                        <TableCell>
                                                            <Typography variant="body2" fontWeight={600}>
                                                                {item.course?.code || 'N/A'}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>{item.course?.title || 'N/A'}</TableCell>
                                                        <TableCell>
                                                            {item.program?.name ? (
                                                                <Chip
                                                                    label={item.program.code ? `${item.program.code} - ${item.program.name}` : item.program.name}
                                                                    size="small"
                                                                    variant="outlined"
                                                                />
                                                            ) : (
                                                                'N/A'
                                                            )}
                                                        </TableCell>
                                                        <TableCell>{item.year}</TableCell>
                                                        <TableCell align="right">
                                                            {item.course?.credits ?? '-'}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </Paper>
                        </Stack>
                    </Grid>
                </Grid>
            </Container>

            <LecturerModalComponent
                open={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={() => {
                    void refetch();
                }}
                lecturer={lecturer}
            />
        </Box>
    );
}