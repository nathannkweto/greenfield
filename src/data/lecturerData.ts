export interface LecturerStudent {
    id: string;
    name: string;
    email: string;
}

export interface LecturerMaterial {
    id: string;
    title: string;
    type: string;
    url: string;
}

export interface LecturerAssignment {
    id: string;
    title: string;
    dueDate: string;
    maxScore: number;
}

export interface StudentGrade {
    studentId: string;
    assignmentId: string;
    score: number | null; // null if not yet graded
}

export interface LecturerCourse {
    id: string;
    code: string;
    title: string;
    description: string;
    students: LecturerStudent[];
    materials: LecturerMaterial[];
    assignments: LecturerAssignment[];
    grades: StudentGrade[];
}

export const LECTURER_DATA: { courses: LecturerCourse[] } = {
    courses: [
        {
            id: 'c1',
            code: 'CS301',
            title: 'Data Structures & Algorithms',
            description: 'An advanced dive into algorithmic complexity and data structuring.',
            students: [
                { id: 's1', name: 'Alice Johnson', email: 'alice@student.edu' },
                { id: 's2', name: 'Bob Smith', email: 'bob@student.edu' }
            ],
            materials: [
                { id: 'm1', title: 'Syllabus', type: 'PDF', url: '#' }
            ],
            assignments: [
                { id: 'a1', title: 'Midterm Project', dueDate: '2026-10-15', maxScore: 100 }
            ],
            grades: [
                { studentId: 's1', assignmentId: 'a1', score: 95 },
                { studentId: 's2', assignmentId: 'a1', score: null } // Pending grade
            ]
        },
        {
            id: 'c2',
            code: 'SWE400',
            title: 'Software Engineering Ethics',
            description: 'Exploring the moral implications of modern software development.',
            students: [
                { id: 's1', name: 'Alice Johnson', email: 'alice@student.edu' }
            ],
            materials: [],
            assignments: [],
            grades: []
        }
    ]
};