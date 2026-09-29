export const EnrollmentStatus = {
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
    DROPPED: 'DROPPED',
} as const;

export type EnrollmentStatus = (typeof EnrollmentStatus)[keyof typeof EnrollmentStatus];

export const AssessmentType = {
    END_OF_TERM: 'END_OF_TERM',
    FINAL_EXAM: 'FINAL_EXAM',
} as const;

export type AssessmentType = (typeof AssessmentType)[keyof typeof AssessmentType];

export interface Course {
    id: string;
    code: string;
    title: string;
    credits: number;
}

export interface Curriculum {
    id: string;
    year: number;
    course: Course;
}

export interface Enrollment {
    id: string;
    status: EnrollmentStatus;
    grade?: string | null;
    points?: number | null;
    curriculum: Curriculum;
}

export interface Assessment {
    id: string;
    title: string;
    type: AssessmentType;
    weightPercentage: number;
    maxScore: number;
    term?: number | null;
    curriculum: Curriculum;
}

export interface AssessmentResult {
    id: string;
    score?: number | null;
    assessment: Assessment;
}

export interface AcademicProgress {
    id: string;
    current_year: number;
    credits_earned: number;
    cgpa: number;
}

export interface Program {
    id: string;
    code: string;
    title: string;
    level: string;
}

export interface StudentResultsData {
    id: string;
    studentNumber?: string | null;
    firstName: string;
    lastName: string;
    cgpa: number;
    creditsCompleted: number;
    program: Program;
    academicProgress?: AcademicProgress | null;
    enrollments: Enrollment[];
    assessmentResults: AssessmentResult[];
}

export interface GetStudentResultsResponse {
    me: {
        id: string;
        students: StudentResultsData[];
    } | null;
}

export interface ProcessedCourseResult {
    courseId: string;
    code: string;
    title: string;
    credits: number;
    status: EnrollmentStatus;
    grade: string;
    points: number;
    assessments: {
        id: string;
        title: string;
        type: AssessmentType;
        term?: number | null;
        weightPercentage: number;
        maxScore: number;
        scoreObtained?: number | null;
        percentageScore?: number | null;
    }[];
    calculatedWeightedScore?: number | null;
}

export interface YearlyResult {
    year: number;
    courses: ProcessedCourseResult[];
    creditsEarned: number;
    creditsAttempted: number;
    gpa: number;
    isCurrentYear: boolean;
}