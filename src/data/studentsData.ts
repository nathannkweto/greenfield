export type StudentStatus = 'Registered' | 'Admitted' | 'Pending' | 'Rejected' | 'Graduated' | 'Suspended';

export interface CourseResult {
    code: string;
    name: string;
    grade: string;
    credits: number;
}

export interface Student {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: StudentStatus;
    school: string;
    program: string;
    applicationDate: string;

    // Detailed Info
    personalDetails: {
        dob: string;
        address: string;
        emergencyContact: string;
    };
    financialDetails?: {
        totalBilled: number;
        totalPaid: number;
        balance: number;
        currency: string;
    };
    academicDetails: {
        creditsCompleted: number;
        creditsRequired: number;
        gpa: number;
        currentCourses: { code: string; name: string; credits: number }[];
        previousResults: { semester: string; results: CourseResult[] }[];
    };
}

export const MOCK_STUDENTS: Student[] = [
    {
        id: 'STU-2026-001',
        firstName: 'Elena',
        lastName: 'Rostova',
        email: 'elena.r@student.edu',
        phone: '+1 555-0101',
        status: 'Registered',
        school: 'School of Computer Science',
        program: 'BSc Software Engineering',
        applicationDate: '2025-11-15',
        personalDetails: { dob: '2003-04-12', address: '123 Tech Lane, Silicon Valley', emergencyContact: '+1 555-0199' },
        financialDetails: { totalBilled: 15000, totalPaid: 10000, balance: 5000, currency: 'ZMW' },
        academicDetails: {
            creditsCompleted: 45, creditsRequired: 120, gpa: 3.8,
            currentCourses: [{ code: 'CS305', name: 'Data Structures', credits: 4 }],
            previousResults: [{ semester: 'Fall 2025', results: [{ code: 'CS101', name: 'Intro to Programming', grade: 'A', credits: 3 }] }]
        }
    },
    {
        id: 'STU-2026-042',
        firstName: 'Marcus',
        lastName: 'Chen',
        email: 'm.chen@personal.com',
        phone: '+1 555-0202',
        status: 'Admitted',
        school: 'School of Business',
        program: 'BBA Business Administration',
        applicationDate: '2026-02-10',
        personalDetails: { dob: '2004-08-22', address: '45 Market St, NY', emergencyContact: '+1 555-0299' },
        academicDetails: {
            creditsCompleted: 0, creditsRequired: 120, gpa: 0,
            currentCourses: [], previousResults: []
        }
    },
    {
        id: 'APP-2026-089',
        firstName: 'Sarah',
        lastName: 'Jenkins',
        email: 'sarah.j@email.com',
        phone: '+1 555-0303',
        status: 'Pending',
        school: 'School of Computer Science',
        program: 'MSc Artificial Intelligence',
        applicationDate: '2026-05-01',
        personalDetails: { dob: '2000-11-05', address: '78 AI Blvd, Boston', emergencyContact: '+1 555-0399' },
        academicDetails: { creditsCompleted: 0, creditsRequired: 36, gpa: 0, currentCourses: [], previousResults: [] }
    }
];