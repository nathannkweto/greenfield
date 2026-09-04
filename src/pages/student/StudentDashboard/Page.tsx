import { useQuery } from '@apollo/client/react';
import {
    Avatar,
    Box,
    Chip,
    CircularProgress,
    Container,
    Divider,
    Grid,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';

// Icons
import SchoolIcon from '@mui/icons-material/School';
import TimelineIcon from '@mui/icons-material/Timeline';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import PersonIcon from '@mui/icons-material/Person';
import BadgeIcon from '@mui/icons-material/Badge';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';

import { GET_STUDENT_PORTAL } from './queries';

export interface Curriculum {
    id: string;
    year: number;
    course: {
        id: string;
        code: string;
        title: string;
        credits: number;
    };
}

export interface Enrollment {
    id: string;
    status: string;
    grade?: string;
    curriculum: Curriculum;
}

export interface Program {
    id: string;
    code: string;
    title: string;
    level: string;
    durationValue: number;
    durationUnit: string;
}

export interface Student {
    id: string;
    studentNumber?: string;
    admissionNumber?: string;
    applicationNumber: string;
    firstName: string;
    middleNames?: string;
    lastName: string;
    email: string;
    phone: string;
    dob?: string;
    address?: string;
    emergencyContact?: string;
    sex: string;
    maritalStatus?: string;
    nationality: string;
    nrcNumber?: string;
    passportNumber?: string;
    intake?: string;
    studyMode?: string;
    status: string;
    applicationDate: string;
    admissionDate?: string;
    graduationDate?: string;
    cgpa: number;
    creditsCompleted: number;
    program: Program;
    enrollments: Enrollment[];
}

export interface StudentPortalData {
    me: {
        id: string;
        email: string;
        students: Student[];
    } | null;
}

function InfoRow({ label, value }: { label: string; value?: string | number | null }) {
    return (
        <Box sx={{ py: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.disabled', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                {label}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mt: 0.25 }}>
                {value ?? '—'}
            </Typography>
        </Box>
    );
}

export default function StudentDashboard() {
    const { data, loading, error } = useQuery<StudentPortalData>(GET_STUDENT_PORTAL);
    const student = data?.me?.students[0];

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !student) {
        return (
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderColor: 'error.main' }}>
                    <Typography color="error" variant="h6">
                        {error ? `Failed to load profile: ${error.message}` : 'No student record found.'}
                    </Typography>
                </Paper>
            </Container>
        );
    }

    const fullName = [student.firstName, student.middleNames, student.lastName].filter(Boolean).join(' ');
    const activeEnrollments = student.enrollments.filter((e) => e.status === 'ENROLLED');

    const stats = [
        { title: 'Current CGPA', value: student.cgpa.toFixed(2), icon: <TimelineIcon />, color: '#2e7d32', bgColor: 'rgba(46, 125, 50, 0.1)' },
        { title: 'Credits Completed', value: student.creditsCompleted, icon: <MilitaryTechIcon />, color: '#1976d2', bgColor: 'rgba(25, 118, 210, 0.1)' },
        { title: 'Active Courses', value: activeEnrollments.length, icon: <AutoStoriesIcon />, color: '#ed6c02', bgColor: 'rgba(237, 108, 2, 0.1)' },
        { title: 'Academic Status', value: student.status, icon: <SchoolIcon />, color: '#9c27b0', bgColor: 'rgba(156, 39, 176, 0.1)' },
    ];

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '80vh', py: 4 }}>
            <Container maxWidth="xl">

                {/* HEADER / HERO CARD */}
                <Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, mb: 4, bgcolor: 'background.paper' }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ alignItems: { xs: 'flex-start', md: 'center' } }}>
                        <Avatar
                            sx={{
                                width: 90,
                                height: 90,
                                bgcolor: 'primary.main',
                                fontSize: '2.2rem',
                                fontWeight: 700
                            }}
                        >
                            {`${student.firstName[0]}${student.lastName[0]}`}
                        </Avatar>

                        <Box sx={{ flexGrow: 1 }}>
                            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 0.5 }}>
                                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                                    {fullName}
                                </Typography>
                                <Chip label={student.status} color="primary" size="small" sx={{ fontWeight: 700 }} />
                            </Stack>

                            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500, mb: 1.5 }}>
                                {student.program.title} ({student.program.code})
                            </Typography>

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 4 }}>
                                <Box>
                                    <Typography variant="caption" sx={{ color: 'text.disabled', textTransform: 'uppercase', fontWeight: 700 }}>Student ID</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{student.studentNumber ?? 'N/A'}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" sx={{ color: 'text.disabled', textTransform: 'uppercase', fontWeight: 700 }}>Admission No.</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{student.admissionNumber ?? 'N/A'}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" sx={{ color: 'text.disabled', textTransform: 'uppercase', fontWeight: 700 }}>Study Mode</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{student.studyMode ?? 'N/A'}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" sx={{ color: 'text.disabled', textTransform: 'uppercase', fontWeight: 700 }}>Intake</Typography>
                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{student.intake ?? 'N/A'}</Typography>
                                </Box>
                            </Stack>
                        </Box>
                    </Stack>
                </Paper>

                {/* STATS OVERVIEW */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {stats.map((stat, index) => (
                        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: stat.bgColor, color: stat.color, width: 48, height: 48 }}>
                                    {stat.icon}
                                </Avatar>
                                <Box>
                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                        {stat.title}
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', lineHeight: 1.2 }}>
                                        {stat.value}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* DETAILED INFORMATION GRID */}
                <Grid container spacing={4}>

                    {/* PERSONAL INFORMATION */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper variant="outlined" sx={{ p: 3, borderRadius: 4, height: '100%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <PersonIcon color="primary" />
                                <Typography variant="h6" fontWeight={700}>Personal Details</Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <InfoRow label="Full Name" value={fullName} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <InfoRow label="Date of Birth" value={student.dob} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <InfoRow label="Gender / Sex" value={student.sex} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <InfoRow label="Marital Status" value={student.maritalStatus} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <InfoRow label="Nationality" value={student.nationality} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <InfoRow label="NRC Number" value={student.nrcNumber} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <InfoRow label="Passport Number" value={student.passportNumber} />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* CONTACT & REGISTRATION DETAILS */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper variant="outlined" sx={{ p: 3, borderRadius: 4, height: '100%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <ContactPhoneIcon color="primary" />
                                <Typography variant="h6" fontWeight={700}>Contact & Registration</Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <InfoRow label="Email Address" value={student.email} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <InfoRow label="Phone Number" value={student.phone} />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <InfoRow label="Residential Address" value={student.address} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <InfoRow label="Emergency Contact" value={student.emergencyContact} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <InfoRow label="Application No." value={student.applicationNumber} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <InfoRow label="Admission Date" value={student.admissionDate ? new Date(student.admissionDate).toLocaleDateString() : '—'} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <InfoRow label="Expected Graduation" value={student.graduationDate ? new Date(student.graduationDate).toLocaleDateString() : '—'} />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* PROGRAM DETAILS */}
                    <Grid size={{ xs: 12 }}>
                        <Paper variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <BadgeIcon color="primary" />
                                <Typography variant="h6" fontWeight={700}>Program Profile</Typography>
                            </Box>
                            <Divider sx={{ mb: 2 }} />

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <InfoRow label="Program Code" value={student.program.code} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <InfoRow label="Program Name" value={student.program.title} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <InfoRow label="Academic Level" value={student.program.level} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <InfoRow label="Program Duration" value={`${student.program.durationValue} ${student.program.durationUnit}`} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <InfoRow label="Study Mode" value={student.studyMode} />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 4 }}>
                                    <InfoRow label="Intake" value={student.intake} />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {/* ENROLLED COURSES TABLE */}
                    <Grid size={{ xs: 12 }}>
                        <Paper variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
                            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                                Registered Course History
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            {student.enrollments.length === 0 ? (
                                <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
                                    No registered courses found.
                                </Typography>
                            ) : (
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 700 }}>Course Code</TableCell>
                                                <TableCell sx={{ fontWeight: 700 }}>Course Title</TableCell>
                                                <TableCell sx={{ fontWeight: 700 }}>Academic Year</TableCell>
                                                <TableCell sx={{ fontWeight: 700 }}>Credits</TableCell>
                                                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                                <TableCell sx={{ fontWeight: 700 }}>Grade</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {student.enrollments.map((enrollment) => (
                                                <TableRow key={enrollment.id} hover>
                                                    <TableCell sx={{ fontWeight: 600 }}>
                                                        {enrollment.curriculum.course.code}
                                                    </TableCell>
                                                    <TableCell>{enrollment.curriculum.course.title}</TableCell>
                                                    <TableCell>Year {enrollment.curriculum.year}</TableCell>
                                                    <TableCell>{enrollment.curriculum.course.credits}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={enrollment.status}
                                                            size="small"
                                                            color={enrollment.status === 'ENROLLED' ? 'success' : 'default'}
                                                            variant="outlined"
                                                        />
                                                    </TableCell>
                                                    <TableCell sx={{ fontWeight: 700 }}>
                                                        {enrollment.grade ?? '—'}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Paper>
                    </Grid>

                </Grid>
            </Container>
        </Box>
    );
}