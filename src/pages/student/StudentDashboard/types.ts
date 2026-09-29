export interface Course {
    id: string;
    code: string;
    title: string;
    credits: number;
    description?: string;
}

export interface Curriculum {
    id: string;
    year: number;
    course: Course;
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
}

export interface FeePayment {
    id: string;
    amount: number;
}

export interface Fee {
    id: string;
    title: string;
}

export interface StudentFee {
    id: string;
    amountZmw: number;
    amountUsd?: number;
    fee: Fee;
    fee_payments: FeePayment[];
}

export interface Student {
    id: string;
    studentNumber?: string;
    admissionNumber?: string;
    firstName: string;
    middleNames?: string;
    lastName: string;
    status: string;
    program: Program;
    enrollments: Enrollment[];
    studentFees: StudentFee[];
}

export interface AcademicYear {
    id: string;
    year: number;
}

export interface AcademicTerm {
    id: string;
    term: string;
    startDate: string;
    endDate: string;
    academicYear: AcademicYear;
}

export interface AcademicEvent {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
}

export interface StudentDashboardData {
    me: {
        id: string;
        email: string;
        students: Student[];
    } | null;
    academicTerms: AcademicTerm[];
    academicEvents: AcademicEvent[];
}

export interface FeeSummary {
    totalBilledZmw: number;
    totalPaidZmw: number;
    outstandingZmw: number;
}