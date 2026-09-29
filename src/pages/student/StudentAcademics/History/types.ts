export type StudentStatus =
    | 'APPLIED'
    | 'ADMITTED'
    | 'ENROLLED'
    | 'REJECTED'
    | 'SUSPENDED'
    | 'GRADUATED';

export type EnrollmentStatus = 'IN_PROGRESS' | 'COMPLETED' | 'DROPPED';

export interface Course {
    id: string;
    code: string;
    title: string;
    description?: string | null;
    credits: number;
}

export interface Curriculum {
    id: string;
    year: number; // e.g. Year 1, Year 2 of Study
    course: Course;
}

export interface Enrollment {
    id: string;
    status: EnrollmentStatus;
    grade?: string | null;
    points?: number | null;
    createdAt: string;
    curriculum: Curriculum;
}

export interface Program {
    id: string;
    code: string;
    title: string;
    level: string;
}

export interface StudentHistoryData {
    id: string;
    studentNumber?: string | null;
    firstName: string;
    lastName: string;
    status: StudentStatus;
    applicationDate: string;
    admissionDate?: string | null;
    createdAt: string;
    cgpa: number;
    creditsCompleted: number;
    program: Program;
    enrollments: Enrollment[];
}

export interface GetAcademicHistoryResponse {
    me: {
        id: string;
        students: StudentHistoryData[];
    } | null;
}

export interface YearlyAcademicRecord {
    calendarYear: number;
    yearsInCollege: number; // e.g., 1st Year at College, 2nd Year...
    studyYears: number[]; // Study levels taken that year e.g. [1, 2]
    enrollments: Enrollment[];
    totalCredits: number;
    completedCoursesCount: number;
    inProgressCoursesCount: number;
}