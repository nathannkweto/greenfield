import { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import {
    Box, Container, Typography, Paper, Button, Avatar, Chip, Grid,
    LinearProgress, CircularProgress, Alert, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, Tooltip
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';

import { GET_STUDENT_DETAILS } from './queries';
import { getStudents } from '../../../api/generated';

// ----------------------------------------------------------------------
// TypeScript Interfaces
// ----------------------------------------------------------------------

export type StudentStatusEnum = 'REGISTERED' | 'ADMITTED' | 'PENDING' | 'REJECTED' | 'GRADUATED' | 'SUSPENDED';

export interface FileNode {
    id: string;
    originalName: string;
    mimeType: string;
    size: number;
    url?: string | null;
    collection?: string | null;
    createdAt: string;
}

export interface EnrollmentNode {
    id: string;
    status: string;
    grade?: string | null;
    points?: number | null;
    completionDate?: string | null;
    dropDate?: string | null;
    curriculum: {
        id: string;
        year: number;
        course: {
            id: string;
            code: string;
            title: string;
            credits: number;
        };
    };
}

export interface StudentDetailNode {
    id: string;
    applicationNumber: string;
    admissionNumber?: string | null;
    studentNumber?: string | null;
    firstName: string;
    middleNames?: string | null;
    lastName: string;
    email: string;
    phone: string;
    dob?: string | null;
    address?: string | null;
    emergencyContact?: string | null;
    sex: string;
    maritalStatus?: string | null;
    nationality: string;
    nrcNumber?: string | null;
    passportNumber?: string | null;
    intake?: string | null;
    studyMode?: string | null;
    status: StudentStatusEnum;
    cgpa: number;
    creditsCompleted: number;
    applicationDate: string;
    admissionDate?: string | null;
    rejectionDate?: string | null;
    graduationDate?: string | null;
    program: {
        id: string;
        code: string;
        title: string;
        level: string;
        durationValue: number;
        durationUnit: string;
        school: {
            id: string;
            name: string;
        };
    };
    enrollments?: EnrollmentNode[];
    files?: FileNode[];
}

interface GetStudentDetailsData {
    student: StudentDetailNode | null;
}

interface GetStudentDetailsVariables {
    id: string;
}

// Helper to format file sizes nicely
function formatFileSize(bytes: number): string {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

export default function StudentDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    // Reject Modal State
    const [rejectOpen, setRejectOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    const { data, loading, error, refetch } = useQuery<GetStudentDetailsData, GetStudentDetailsVariables>(
        GET_STUDENT_DETAILS,
        {
            variables: { id: id! },
            skip: !id,
            fetchPolicy: 'cache-and-network',
        }
    );

    const student = data?.student;

    const handleDownload = async (fileUrl: string, fileName: string) => {
        try {
            // Ensure absolute URL if relative path is returned
            const fullUrl = fileUrl.startsWith('http')
                ? fileUrl
                : `${import.meta.env.VITE_API_BASE_URL || ''}${fileUrl}`;

            const response = await fetch(fullUrl);

            if (!response.ok) {
                throw new Error(`Download failed with status ${response.status}`);
            }

            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(blobUrl);
        } catch (downloadErr) {
            console.error('Download error:', downloadErr);
            setMessage(downloadErr instanceof Error ? downloadErr.message : 'Failed to download file.');
        }
    };

    const admit = async () => {
        if (!student) return;
        setIsSaving(true);
        setMessage(null);
        try {
            await getStudents().postStudentsPublicIdAdmit(student.id);
            setMessage('Applicant admitted successfully.');
            await refetch();
        } catch (requestError) {
            setMessage(requestError instanceof Error ? requestError.message : 'Unable to admit applicant.');
        } finally {
            setIsSaving(false);
        }
    };

    const register = async () => {
        if (!student) return;
        setIsSaving(true);
        setMessage(null);
        try {
            await getStudents().postStudentsPublicIdRegister(student.id);
            setMessage('Student registered successfully.');
            await refetch();
        } catch (requestError) {
            setMessage(requestError instanceof Error ? requestError.message : 'Unable to register student.');
        } finally {
            setIsSaving(false);
        }
    };

    const reject = async () => {
        if (!student || !rejectReason.trim()) return;
        setIsSaving(true);
        setMessage(null);
        try {
            await getStudents().postStudentsPublicIdReject(student.id, { reason: rejectReason.trim() });
            setMessage('Application rejected.');
            setRejectOpen(false);
            setRejectReason('');
            await refetch();
        } catch (requestError) {
            setMessage(requestError instanceof Error ? requestError.message : 'Unable to reject student.');
        } finally {
            setIsSaving(false);
        }
    };

    const formatStatus = (status: string) => {
        if (!status) return 'N/A';
        return status.charAt(0) + status.slice(1).toLowerCase();
    };

    const { currentCourses, academicHistory } = useMemo(() => {
        if (!student?.enrollments) return { currentCourses: [], academicHistory: [] };

        const current: EnrollmentNode[] = [];
        const historyMap = new Map<string, { yearLabel: string; results: Array<{ code: string; name: string; grade: string; credits: number }> }>();

        student.enrollments.forEach((enrollment) => {
            if (['In Progress', 'IN_PROGRESS', 'Active', 'ACTIVE'].includes(enrollment.status)) {
                current.push(enrollment);
            } else {
                const yearLabel = `Year ${enrollment.curriculum.year}`;
                if (!historyMap.has(yearLabel)) {
                    historyMap.set(yearLabel, { yearLabel, results: [] });
                }
                historyMap.get(yearLabel)!.results.push({
                    code: enrollment.curriculum.course.code,
                    name: enrollment.curriculum.course.title,
                    grade: enrollment.grade || 'N/A',
                    credits: enrollment.curriculum.course.credits,
                });
            }
        });

        return {
            currentCourses: current,
            academicHistory: Array.from(historyMap.values()),
        };
    }, [student]);

    if (loading) {
        return (
            <Box sx={{ p: 6, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !student) {
        return (
            <Container sx={{ py: 6, textAlign: 'center' }}>
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error ? `Failed to load student details: ${error.message}` : 'Student record not found.'}
                </Alert>
                <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
                    Back to List
                </Button>
            </Container>
        );
    }

    const creditsRequired = 120;
    const progressPercent = Math.min(100, (student.creditsCompleted / creditsRequired) * 100);

    const showAdmit = student.status === 'PENDING';
    const showRegister = student.status === 'ADMITTED';
    const showReject = student.status === 'PENDING' || student.status === 'ADMITTED';

    const fullName = [student.lastName + '', student.firstName, student.middleNames].filter(Boolean).join(' ');

    return (
        <Box sx={{ backgroundColor: 'background.default', minHeight: '70vh', width: '100%', py: { xs: 2, md: 4 } }}>
            <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ alignSelf: 'flex-start' }}>
                    Back to List
                </Button>

                {message && (
                    <Alert
                        severity={message.includes('successfully') || message.includes('rejected.') ? 'success' : 'error'}
                        onClose={() => setMessage(null)}
                    >
                        {message}
                    </Alert>
                )}

                {/* Header Profile Card */}
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 3 }}>
                    <Avatar sx={{ width: 80, height: 80, backgroundColor: 'primary.main' }}>
                        <PersonIcon sx={{ fontSize: 40 }} />
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 200 }}>
                        <Typography variant="h4" sx={{ fontWeight: 800 }}>
                            {fullName}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            {student.program.title} ({student.program.code}) — {student.program.school.name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                            {student.intake && <Chip label={`Intake: ${student.intake}`} size="small" variant="outlined" />}
                            {student.studyMode && <Chip label={`Mode: ${student.studyMode}`} size="small" variant="outlined" />}
                            <Chip label={`${student.program.durationValue} ${student.program.durationUnit}`} size="small" variant="outlined" />
                        </Box>
                    </Box>
                    <Chip
                        label={formatStatus(student.status)}
                        color={
                            student.status === 'REGISTERED' ? 'success' :
                                student.status === 'ADMITTED' ? 'info' :
                                    student.status === 'PENDING' ? 'warning' :
                                        student.status === 'REJECTED' ? 'error' : 'default'
                        }
                        sx={{ fontWeight: 600 }}
                    />
                </Paper>

                {/* Identification Numbers Panel */}
                <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>
                                APPLICATION NUMBER
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                {student.applicationNumber || 'N/A'}
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>
                                ADMISSION NUMBER
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                {student.admissionNumber || 'N/A'}
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block' }}>
                                STUDENT NUMBER
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                {student.studentNumber || 'N/A'}
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Action Bar */}
                {(showAdmit || showRegister || showReject) && (
                    <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                        {showAdmit && (
                            <Button variant="contained" color="primary" onClick={admit} disabled={isSaving}>
                                {isSaving ? 'Admitting…' : 'Admit Applicant'}
                            </Button>
                        )}
                        {showRegister && (
                            <Button variant="contained" color="success" onClick={register} disabled={isSaving}>
                                {isSaving ? 'Registering…' : 'Register Student'}
                            </Button>
                        )}
                        {showReject && (
                            <Button variant="outlined" color="error" onClick={() => setRejectOpen(true)} disabled={isSaving}>
                                Reject Applicant
                            </Button>
                        )}
                    </Paper>
                )}

                <Grid container spacing={3}>
                    {/* Left Column: Demographics, Identity, Documents & Financial */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {/* Personal Details */}
                            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Personal Details</Typography>

                                <Typography variant="body2" color="text.secondary">Email</Typography>
                                <Typography variant="body1" sx={{ mb: 1.5 }}>{student.email}</Typography>

                                <Typography variant="body2" color="text.secondary">Phone</Typography>
                                <Typography variant="body1" sx={{ mb: 1.5 }}>{student.phone || 'N/A'}</Typography>

                                <Typography variant="body2" color="text.secondary">Date of Birth</Typography>
                                <Typography variant="body1" sx={{ mb: 1.5 }}>{student.dob || 'N/A'}</Typography>

                                <Typography variant="body2" color="text.secondary">Address</Typography>
                                <Typography variant="body1" sx={{ mb: 1.5 }}>{student.address || 'N/A'}</Typography>

                                <Typography variant="body2" color="text.secondary">Emergency Contact</Typography>
                                <Typography variant="body1">{student.emergencyContact || 'N/A'}</Typography>
                            </Paper>

                            {/* Identity Details */}
                            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Identity Details</Typography>

                                <Typography variant="body2" color="text.secondary">Sex</Typography>
                                <Typography variant="body1" sx={{ mb: 1.5 }}>{student.sex}</Typography>

                                <Typography variant="body2" color="text.secondary">Marital Status</Typography>
                                <Typography variant="body1" sx={{ mb: 1.5 }}>{student.maritalStatus || 'N/A'}</Typography>

                                <Typography variant="body2" color="text.secondary">Nationality</Typography>
                                <Typography variant="body1" sx={{ mb: 1.5 }}>{student.nationality}</Typography>

                                <Typography variant="body2" color="text.secondary">NRC Number</Typography>
                                <Typography variant="body1" sx={{ mb: 1.5 }}>{student.nrcNumber || 'N/A'}</Typography>

                                <Typography variant="body2" color="text.secondary">Passport Number</Typography>
                                <Typography variant="body1">{student.passportNumber || 'N/A'}</Typography>
                            </Paper>

                            {/* Documents & Attached Files */}
                            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Documents & Files</Typography>

                                {!student.files || student.files.length === 0 ? (
                                    <Typography variant="body2" color="text.secondary">No files attached.</Typography>
                                ) : (
                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                        {student.files.map((file) => (
                                            <Box
                                                key={file.id}
                                                sx={{
                                                    p: 1.5,
                                                    border: '1px solid',
                                                    borderColor: 'divider',
                                                    borderRadius: 2,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    gap: 1,
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, overflow: 'hidden' }}>
                                                    <InsertDriveFileIcon color="action" />
                                                    <Box sx={{ minWidth: 0 }}>
                                                        <Typography variant="body2" sx={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {file.originalName}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                            {formatFileSize(file.size)} {file.collection ? `• ${file.collection}` : ''}
                                                        </Typography>
                                                    </Box>
                                                </Box>

                                                {file.url && (
                                                    <Tooltip title="Download File">
                                                        <IconButton
                                                            size="small"
                                                            color="primary"
                                                            onClick={() => handleDownload(file.url!, file.originalName)}
                                                        >
                                                            <DownloadIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </Box>
                                        ))}
                                    </Box>
                                )}
                            </Paper>

                            {/* Financial Details */}
                            <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                                <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>Fees Overview</Typography>
                                <Typography variant="body2" color="text.secondary">(not available)</Typography>
                            </Paper>
                        </Box>
                    </Grid>

                    {/* Right Column: Academic Details */}
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Academic Details</Typography>

                            {/* Progress */}
                            <Box sx={{ mb: 4 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>Degree Progress</Typography>
                                    <Typography variant="body2">{student.creditsCompleted} / {creditsRequired} Credits</Typography>
                                </Box>
                                <LinearProgress variant="determinate" value={progressPercent} sx={{ height: 8, borderRadius: 4 }} />
                                <Typography variant="subtitle2" sx={{ mt: 1, textAlign: 'right' }}>
                                    Cumulative GPA: {student.cgpa ? student.cgpa.toFixed(2) : '0.00'}
                                </Typography>
                            </Box>

                            {/* Current Courses */}
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Currently Enrolled</Typography>
                            {currentCourses.length === 0 ? (
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>No active enrollments.</Typography>
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 4 }}>
                                    {currentCourses.map((enrollment) => {
                                        const course = enrollment.curriculum.course;
                                        return (
                                            <Box key={enrollment.id} sx={{ p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 2, display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {course.code} - {course.title} (Year {enrollment.curriculum.year})
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">{course.credits} Credits</Typography>
                                            </Box>
                                        );
                                    })}
                                </Box>
                            )}

                            {/* Academic History */}
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>Academic History</Typography>
                            {academicHistory.length === 0 ? (
                                <Typography variant="body2" color="text.secondary">No previous academic history.</Typography>
                            ) : (
                                academicHistory.map((semesterGroup) => (
                                    <Box key={semesterGroup.yearLabel} sx={{ mb: 3 }}>
                                        <Typography variant="subtitle2" color="primary" sx={{ mb: 1 }}>{semesterGroup.yearLabel}</Typography>
                                        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
                                            {semesterGroup.results.map((res, i) => (
                                                <Box key={res.code} sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5, borderBottom: i < semesterGroup.results.length - 1 ? '1px solid' : 'none', borderColor: 'divider' }}>
                                                    <Typography variant="body2">{res.code} - {res.name}</Typography>
                                                    <Typography variant="body2" sx={{ fontWeight: 700 }}>Grade: {res.grade}</Typography>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>
                                ))
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Container>

            {/* Rejection Reason Dialog */}
            <Dialog open={rejectOpen} onClose={() => !isSaving && setRejectOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle>Reject Application</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Reason for rejection"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        fullWidth
                        required
                        multiline
                        rows={3}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRejectOpen(false)} disabled={isSaving}>Cancel</Button>
                    <Button onClick={reject} color="error" variant="contained" disabled={isSaving || !rejectReason.trim()}>
                        {isSaving ? 'Rejecting…' : 'Confirm Rejection'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}