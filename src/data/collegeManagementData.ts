export interface Program {
    id: string;
    name: string;
    status: string;
}

export interface Course {
    id: string;
    code: string;
    name: string;
    credits: number;
}

export interface Lecturer {
    id: string;
    name: string;
    role: string;
}

export interface School {
    id: string;
    name: string;
    dean: string;
    programs: Program[];
    courses: Course[];
    lecturers: Lecturer[];
}

export const COLLEGE_MANAGEMENT_DATA: School[] = [
    {
        id: 'sch_1',
        name: 'School of Computer Science',
        dean: 'Dr. Alan Turing',
        programs: [
            { id: 'p1', name: 'BSc Software Engineering', status: 'Active' },
            { id: 'p2', name: 'MSc Artificial Intelligence', status: 'Active' }
        ],
        courses: [
            { id: 'c1', code: 'CS101', name: 'Intro to Programming', credits: 3 },
            { id: 'c2', code: 'CS305', name: 'Data Structures', credits: 4 }
        ],
        lecturers: [
            { id: 'l1', name: 'Grace Hopper', role: 'Senior Lecturer' },
            { id: 'l2', name: 'Ada Lovelace', role: 'Professor' }
        ]
    },
    {
        id: 'sch_2',
        name: 'School of Business',
        dean: 'Dr. John Maynard',
        programs: [
            { id: 'p3', name: 'BBA Business Administration', status: 'Active' }
        ],
        courses: [
            { id: 'c3', code: 'BUS201', name: 'Macroeconomics', credits: 3 }
        ],
        lecturers: [
            { id: 'l3', name: 'Adam Smith', role: 'Lecturer' }
        ]
    }
];