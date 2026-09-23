export type StudyMode = 'full_time' | 'part_time' | 'distance_learning' | 'online';
export type Intake = 'January' | 'May' | 'September';

export interface Course {
    id: string;
    code?: string;
    title: string;
    credits?: number;
}

export interface CurriculumItem {
    id: string;
    year: number;
    course?: Course;
}

export interface StudentCourseGrade {
    courseId: string;
    courseCode?: string;
    courseTitle: string;
    year: number;
    mark: number | '';
    maxMark: number;
}

export interface Student {
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
    currentYear: number;
    feeBalance?: number;
    grades?: StudentCourseGrade[];
}

export interface Program {
    id: string;
    code?: string;
    title: string;
    curricula?: CurriculumItem[];
}

export interface CohortGroup {
    cohortKey: string; // e.g., "2024 January"
    year: number;      // e.g., 2024
    intake: Intake;
    students: Student[];
}