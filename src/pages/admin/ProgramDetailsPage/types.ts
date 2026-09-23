export interface School {
    id: string;
    name: string;
}

export interface CourseOption {
    id: string;
    code?: string;
    title: string;
    credits?: number;
    school?: School;
}

export interface LecturerOption {
    id: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    school?: School;
}

export interface CurriculumItem {
    id: string;
    year: number;
    course?: CourseOption;
    lecturer?: LecturerOption;
}

export interface Requirement {
    id: string;
    description: string;
    sortOrder?: number;
}

export type ProgramLevel = 'Certificate' | 'Diploma' | 'Degree' | 'Post_graduate_Diploma';
export type DurationUnit = 'weeks' | 'months' | 'years';

export interface Program {
    id: string;
    code?: string;
    title: string;
    level?: ProgramLevel;
    durationValue?: number;
    durationUnit?: DurationUnit;
    shortDescription?: string;
    longDescription?: string;
    requirements?: Requirement[];
    curricula?: CurriculumItem[];
    school?: School;
}

export interface FormattedYear {
    year: number;
    items: CurriculumItem[];
}

export interface StudentRegisterItem {
    first_name: string;
    middle_names?: string;
    last_name: string;
    email: string;
    phone: string;
    dob?: string;
    address?: string;
    emergency_contact?: string;

    sex: 'male' | 'female';
    marital_status: 'single' | 'married' | 'widow' | 'divorced';
    nationality?: string;
    nrc_number?: string;
    passport_number?: string;

    application_number?: string;
    admission_number?: string;
    student_number?: string;

    intake: 'January' | 'May' | 'September';
    study_mode: 'full_time' | 'part_time' | 'distance_learning' | 'online';

    registration_date: string;

    current_year?: number;
    credits_earned?: number;
    cgpa?: number;
}

export interface BatchStudentRegisterResponse {
    status: string;
    message: string;
    data: {
        total_processed: number;
        successful_count: number;
        failed_count: number;
        errors?: Array<{
            row: number;
            email?: string;
            message: string;
        }>;
    };
}