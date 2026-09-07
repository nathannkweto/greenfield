import { useQuery } from '@apollo/client/react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Stack,
    Card,
    CardActionArea,
    Chip,
    Skeleton,
    Alert,
    Avatar
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { GET_LECTURER_PORTAL } from './queries';

interface Curriculum {
    id: string;
    year: number;
    program: {
        id: string;
        code: string;
        title: string;
    };
    course: {
        id: string;
        code: string;
        title: string;
    };
    enrollments: Array<{ id: string }>;
}

interface Lecturer {
    id: string;
    firstName: string;
    lastName: string;
    curricula: Curriculum[];
}

interface LecturerPortalData {
    me: {
        id: string;
        lecturers: Lecturer[];
    } | null;
}

export default function LecturerDashboard() {
    const navigate = useNavigate();
    const { data, loading, error } = useQuery<LecturerPortalData>(GET_LECTURER_PORTAL);

    const primaryLecturer = data?.me?.lecturers?.[0];
    const lecturerName = primaryLecturer ? `${primaryLecturer.firstName} ${primaryLecturer.lastName}` : '';
    const curricula = data?.me?.lecturers?.flatMap((lecturer) => lecturer.curricula) ?? [];

    return (
        <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh', py: { xs: 3, md: 5 } }}>
            <Container maxWidth="lg">
                {/* Header */}
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, letterSpacing: '-0.02em', mb: 0.5 }}>
                            My Courses
                        </Typography>
                        {lecturerName && (
                            <Typography variant="body2" color="text.secondary">
                                Assigned classes for {lecturerName}
                            </Typography>
                        )}
                    </Box>

                    {!loading && !error && (
                        <Chip
                            icon={<SchoolIcon fontSize="small" />}
                            label={`${curricula.length} ${curricula.length === 1 ? 'Class' : 'Classes'}`}
                            variant="outlined"
                            sx={{ fontWeight: 600, borderRadius: 2 }}
                        />
                    )}
                </Box>

                {/* Loading State */}
                {loading && (
                    <Stack spacing={2}>
                        {[1, 2, 3].map((key) => (
                            <Skeleton key={key} variant="rounded" height={80} sx={{ borderRadius: 3 }} />
                        ))}
                    </Stack>
                )}

                {/* Error State */}
                {error && (
                    <Alert severity="error" variant="outlined" sx={{ borderRadius: 2 }}>
                        Unable to load courses: {error.message}
                    </Alert>
                )}

                {/* Empty State */}
                {!loading && !error && curricula.length === 0 && (
                    <Box sx={{ py: 8, textAlign: 'center', backgroundColor: 'action.hover', borderRadius: 3, border: '1px dashed', borderColor: 'divider' }}>
                        <SchoolIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 600 }}>
                            No active courses found
                        </Typography>
                    </Box>
                )}

                {/* Courses List */}
                {!loading && !error && curricula.length > 0 && (
                    <Stack spacing={2}>
                        {curricula.map((item) => (
                            <Card
                                key={item.id}
                                elevation={0}
                                sx={{
                                    border: '1px solid',
                                    borderColor: 'divider',
                                    borderRadius: 3,
                                    transition: 'all 0.15s ease-in-out',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        boxShadow: (theme) => `0 4px 20px 0 ${theme.palette.action.focus}`,
                                        transform: 'translateY(-1px)',
                                    },
                                }}
                            >
                                <CardActionArea
                                    onClick={() => navigate(`/lecturer/course/${item.id}`)}
                                    sx={{ p: 2.5 }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, minWidth: 0 }}>
                                            <Avatar
                                                sx={{
                                                    backgroundColor: 'action.hover',
                                                    color: 'primary.main',
                                                    fontWeight: 700,
                                                    fontSize: '0.85rem',
                                                    width: 48,
                                                    height: 48,
                                                    borderRadius: 2.5,
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                }}
                                            >
                                                {item.course.code.slice(0, 4)}
                                            </Avatar>
                                            <Box sx={{ minWidth: 0 }}>
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        fontWeight: 700,
                                                        lineHeight: 1.3,
                                                        mb: 0.5,
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap',
                                                    }}
                                                >
                                                    {item.course.code}: {item.course.title}
                                                </Typography>
                                                <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                                                    <Chip
                                                        label={`${item.program.code} • Year ${item.year}`}
                                                        size="small"
                                                        variant="filled"
                                                        sx={{ fontSize: '0.75rem', fontWeight: 600, height: 22 }}
                                                    />
                                                    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                                                        <PeopleAltOutlinedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                                                            {item.enrollments.length} Enrolled Student{item.enrollments.length === 1 ? '' : 's'}
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                            </Box>
                                        </Box>
                                        <ChevronRightIcon color="action" />
                                    </Box>
                                </CardActionArea>
                            </Card>
                        ))}
                    </Stack>
                )}
            </Container>
        </Box>
    );
}