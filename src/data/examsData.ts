// ============================================================================
// TYPES
// ============================================================================
export interface ExamScheduleItem {
    id: string;
    courseCode: string;
    courseTitle: string;
    date: string;
    time: string;
    duration: string;
    venue: string;
    type: 'Midterm' | 'Final' | 'Practical';
    status: 'Upcoming' | 'Completed';
}

export interface ExamResultCourse {
    courseCode: string;
    courseTitle: string;
    credits: number;
    grade: string;
    points: number;
}

export interface ExamResultTerm {
    termId: string;
    termName: string;
    termGPA: number;
    totalCredits: number;
    courses: ExamResultCourse[];
}

export interface StudentAcademicSummary {
    cgpa: number;
    totalCreditsEarned: number;
    degreeClassification: string;
}

// ============================================================================
// MOCK DATA
// ============================================================================

export const UPCOMING_EXAMS: ExamScheduleItem[] = [
    { id: 'ex1', courseCode: 'CSC301', courseTitle: 'Data Structures & Algorithms', date: 'Dec 12, 2026', time: '09:00 AM', duration: '3 Hours', venue: 'Main Hall A', type: 'Final', status: 'Upcoming' },
    { id: 'ex2', courseCode: 'MAT210', courseTitle: 'Linear Algebra', date: 'Dec 14, 2026', time: '02:00 PM', duration: '2 Hours', venue: 'Science Block, Room 101', type: 'Final', status: 'Upcoming' },
    { id: 'ex3', courseCode: 'ENG105', courseTitle: 'Technical Writing', date: 'Dec 16, 2026', time: '10:00 AM', duration: '2.5 Hours', venue: 'Library Annex', type: 'Final', status: 'Upcoming' },
];

export const ACADEMIC_SUMMARY: StudentAcademicSummary = {
    cgpa: 3.84,
    totalCreditsEarned: 45,
    degreeClassification: 'First Class Honors (Provisional)'
};

export const PAST_RESULTS: ExamResultTerm[] = [
    {
        termId: 'sp26',
        termName: 'Spring 2026',
        termGPA: 3.90,
        totalCredits: 14,
        courses: [
            { courseCode: 'CSC205', courseTitle: 'Database Systems', credits: 4, grade: 'A', points: 4.0 },
            { courseCode: 'ENG201', courseTitle: 'Professional Communication', credits: 3, grade: 'A', points: 4.0 },
            { courseCode: 'PHY102', courseTitle: 'General Physics II', credits: 4, grade: 'A-', points: 3.7 },
            { courseCode: 'HUM110', courseTitle: 'Introduction to Ethics', credits: 3, grade: 'A', points: 4.0 },
        ]
    },
    {
        termId: 'fa25',
        termName: 'Fall 2025',
        termGPA: 3.78,
        totalCredits: 15,
        courses: [
            { courseCode: 'CSC201', courseTitle: 'Advanced Programming', credits: 4, grade: 'A', points: 4.0 },
            { courseCode: 'MAT205', courseTitle: 'Discrete Mathematics', credits: 3, grade: 'B+', points: 3.3 },
            { courseCode: 'STA201', courseTitle: 'Statistics & Probability', credits: 4, grade: 'A-', points: 3.7 },
            { courseCode: 'ECO101', courseTitle: 'Microeconomics', credits: 4, grade: 'A', points: 4.0 },
        ]
    }
];