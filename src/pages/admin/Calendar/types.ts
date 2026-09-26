export type TermName = 'January' | 'May' | 'September' | string;

export interface AcademicTerm {
    id: string;
    academicYearId: string;
    term: TermName;
    startDate: string;
    endDate: string;
}

export interface AcademicEvent {
    id: string;
    academicYearId: string;
    title: string;
    startDate: string;
    endDate: string;
}

export interface AcademicYear {
    id: string;
    year: number;
    startDate: string;
    endDate: string;
    terms?: AcademicTerm[];
    events?: AcademicEvent[];
    academic_terms?: AcademicTerm[];
    academic_events?: AcademicEvent[];
}