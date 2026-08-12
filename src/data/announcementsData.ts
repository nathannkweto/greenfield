export type TargetLevel = 'College' | 'School' | 'Program';
export type AnnouncementType = 'General' | 'Timetable' | 'Assignment' | 'Alert';

export interface Attachment {
    fileName: string;
    fileType: 'pdf' | 'image' | 'doc';
    fileSize: string;
}

export interface Announcement {
    id: string;
    title: string;
    content: string;
    type: AnnouncementType;
    targetLevel: TargetLevel;
    targetName: string; // e.g., "All College", "School of Computer Science"
    author: string;
    datePosted: string;
    attachment?: Attachment;
}

// Mock Data for the feed
export const MOCK_ANNOUNCEMENTS: Announcement[] = [
    {
        id: 'ann_1',
        title: 'Fall 2026 Examination Timetable',
        content: 'The final examination timetable for the Fall 2026 semester has been released. Please find the attached PDF for your respective venues and timings.',
        type: 'Timetable',
        targetLevel: 'College',
        targetName: 'Entire College',
        author: 'Registrar Office',
        datePosted: '2026-06-15 09:00',
        attachment: { fileName: 'Fall2026_Exams.pdf', fileType: 'pdf', fileSize: '2.4 MB' }
    },
    {
        id: 'ann_2',
        title: 'AI Lab Server Maintenance',
        content: 'The primary GPU servers will be down for scheduled maintenance this weekend. Plan your model training accordingly.',
        type: 'Alert',
        targetLevel: 'Program',
        targetName: 'MSc Artificial Intelligence',
        author: 'IT Services',
        datePosted: '2026-06-18 14:30'
    },
    {
        id: 'ann_3',
        title: 'Guest Lecture: Future of Fintech',
        content: 'Join us in the main auditorium for a guest lecture by industry leaders on the evolving landscape of Financial Technology.',
        type: 'General',
        targetLevel: 'School',
        targetName: 'School of Business',
        author: 'Dean John Maynard',
        datePosted: '2026-06-19 10:00',
        attachment: { fileName: 'fintech_poster.jpg', fileType: 'image', fileSize: '1.1 MB' }
    }
];

// Mock Data for the creation dropdowns
export const TARGET_OPTIONS = {
    schools: [
        { id: 'sch_1', name: 'School of Computer Science' },
        { id: 'sch_2', name: 'School of Business' },
        { id: 'sch_3', name: 'School of Engineering' }
    ],
    programs: [
        { id: 'p1', name: 'BSc Software Engineering', schoolId: 'sch_1' },
        { id: 'p2', name: 'MSc Artificial Intelligence', schoolId: 'sch_1' },
        { id: 'p3', name: 'BBA Business Administration', schoolId: 'sch_2' }
    ]
};