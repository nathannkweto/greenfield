import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import {
    Container,
    Box,
    Typography,
    Button,
    Tabs,
    Tab,
    CircularProgress,
    Alert,
    Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SchoolIcon from '@mui/icons-material/School';

import { GET_RECONCILIATION_DATA } from './queries';
import type { Program, Student, StudentCourseGrade, StudyMode, Intake } from './types';
import { groupStudentsByCohort } from './helpers';
import FinancialReconciliationTab from './components/FinancialReconciliationTab';
import AcademicReconciliationTab from './components/AcademicReconciliationTab';

interface RawStudentNode {
    id: string;
    status?: string;
    studentNumber: string;
    firstName: string;
    middleNames?: string;
    lastName: string;
    email: string;
    studyMode: StudyMode;
    intake: Intake;
    admissionDate?: string;
    academicProgress?: {
        current_year: number;
    };
    studentFees?: Array<{
        amountZmw?: number;
        payments?: Array<{ amount?: number }>;
    }>;
    enrollments?: Array<{
        grade?: string;
        points?: number;
        status?: string;
        curriculum?: {
            year: number;
            course?: {
                id: string;
                code?: string;
                title: string;
            };
        };
    }>;
}

interface ReconciliationQueryResponse {
    program: Program & {
        students?: RawStudentNode[];
    };
}

export default function StudentReconciliationPage() {
    const { programId } = useParams<{ programId: string }>();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState<number>(0);

    const { loading, error, data } = useQuery<ReconciliationQueryResponse>(
        GET_RECONCILIATION_DATA,
        {
            variables: {
                programId: programId!,
            },
            skip: !programId,
        }
    );

    const program = data?.program;

    // Transform raw student list into normalized Student domain model
    const normalizedStudents = useMemo<Student[]>(() => {
        const rawStudents = data?.program?.students || [];

        const registeredStudents = rawStudents.filter((student) => {
            const s = student.status?.toUpperCase();
            return s === 'REGISTERED' || student.status === 'Registered';
        });

        return registeredStudents.map((student) => {
            // Calculate fee balance: Total Fees - Total Paid
            const totalFees = student.studentFees?.reduce((sum, f) => sum + (f.amountZmw || 0), 0) || 0;
            const totalPaid = student.studentFees?.reduce((sum, f) => {
                const feePayments = f.payments?.reduce((pSum, p) => pSum + (p.amount || 0), 0) || 0;
                return sum + feePayments;
            }, 0) || 0;

            // Extract grades from enrollments
            const grades: StudentCourseGrade[] = student.enrollments?.map((e) => ({
                courseId: e.curriculum?.course?.id || '',
                courseCode: e.curriculum?.course?.code,
                courseTitle: e.curriculum?.course?.title || '',
                year: e.curriculum?.year || 1,
                mark: e.points ?? '',
                maxMark: 100,
            })) || [];

            return {
                id: student.id,
                studentNumber: student.studentNumber || 'N/A',
                firstName: student.firstName,
                middleNames: student.middleNames,
                lastName: student.lastName,
                email: student.email,
                studyMode: student.studyMode,
                intake: student.intake,
                admissionDate: student.admissionDate,
                currentYear: student.academicProgress?.current_year || 1,
                feeBalance: totalFees - totalPaid,
                grades,
            };
        });
    }, [data]);

    // Group students by cohort (Admission Year + Intake)
    const cohortGroups = useMemo(() => groupStudentsByCohort(normalizedStudents), [normalizedStudents]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !program) {
        console.error("Apollo GraphQL Error Object:", error);

        return (
            <Container maxWidth="lg" sx={{ py: 6 }}>
                <Alert severity="error">
                    {error?.message ? (
                        <>
                            <strong>GraphQL Error:</strong> {error.message}
                        </>
                    ) : (
                        "Program record not found (Server returned null for this program ID)."
                    )}
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
            {/* Header Navigation */}
            <Box sx={{ mb: 3 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    sx={{ color: 'text.secondary', textTransform: 'none', mb: 1 }}
                >
                    Back to Program
                </Button>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                    Student Reconciliation
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                    {program.code ? `${program.code} - ` : ''}{program.title}
                </Typography>
            </Box>

            {/* Reconciliation Tabs */}
            <Paper variant="outlined" sx={{ borderRadius: 3, mb: 4 }}>
                <Tabs
                    value={activeTab}
                    onChange={(_, newValue: number) => setActiveTab(newValue)}
                    sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
                >
                    <Tab
                        icon={<AccountBalanceWalletIcon />}
                        iconPosition="start"
                        label="Financial Reconciliation"
                    />
                    <Tab
                        icon={<SchoolIcon />}
                        iconPosition="start"
                        label="Academic Reconciliation"
                    />
                </Tabs>
            </Paper>

            {/* Tab Views */}
            {activeTab === 0 && (
                <FinancialReconciliationTab cohortGroups={cohortGroups} programId={programId!} />
            )}

            {activeTab === 1 && (
                <AcademicReconciliationTab
                    cohortGroups={cohortGroups}
                    programId={programId!}
                    programCurriculum={program.curricula || []}
                />
            )}
        </Container>
    );
}