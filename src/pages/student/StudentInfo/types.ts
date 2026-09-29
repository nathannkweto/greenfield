export const StudentStatus = {
    APPLICANT: 'APPLICANT',
    ACCEPTED: 'ACCEPTED',
    REJECTED: 'REJECTED',
    REGISTERED: 'REGISTERED',
    ENROLLED: 'ENROLLED',
    GRADUATED: 'GRADUATED',
    SUSPENDED: 'SUSPENDED',
    WITHDRAWN: 'WITHDRAWN',
} as const;

export type StudentStatus = (typeof StudentStatus)[keyof typeof StudentStatus];

export const ProgramLevel = {
    Certificate: 'Certificate',
    Diploma: 'Diploma',
    Degree: 'Degree',
    Post_graduate_Diploma: 'Post_graduate_Diploma',
} as const;

export type ProgramLevel = (typeof ProgramLevel)[keyof typeof ProgramLevel];

export const DurationUnit = {
    weeks: 'weeks',
    months: 'months',
    years: 'years',
} as const;

export type DurationUnit = (typeof DurationUnit)[keyof typeof DurationUnit];

export interface AcademicProgress {
    id: string;
    current_year: number;
    credits_earned: number;
    cgpa: number;
    created_at: string;
    updated_at: string;
}

export interface School {
    id: string;
    name: string;
    description?: string;
}

export interface Program {
    id: string;
    code: string;
    title: string;
    level: ProgramLevel;
    durationValue: number;
    durationUnit: DurationUnit;
    shortDescription?: string;
    school: School;
}

export interface Student {
    id: string;
    applicationNumber: string;
    admissionNumber?: string;
    studentNumber?: string;
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
    status: StudentStatus;
    applicationDate: string;
    admissionDate?: string;
    graduationDate?: string;
    academicProgress?: AcademicProgress;
    program: Program;
}

export interface GetStudentInfoResponse {
    me: {
        id: string;
        email: string;
        students: Student[];
    } | null;
}
