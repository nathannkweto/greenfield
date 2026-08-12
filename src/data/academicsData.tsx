import React from 'react';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';

// ============================================================================
// TYPES
// ============================================================================
export interface CourseSession {
    id: number;
    date: string;
    topic: string;
    type: string;
}

export interface CourseMaterial {
    id: number;
    title: string;
    type: string;
    icon: React.ReactNode;
    size: string;
}

export interface CourseAssessment {
    id: number;
    name: string;
    weight: string;
    maxScore: number;
    score: number | null;
}

export interface CourseDetail {
    id: string;
    code: string;
    title: string;
    credits: number;
    instructor: { name: string; email: string; office: string };
    description: string;
    sessions: CourseSession[];
    materials: CourseMaterial[];
    assessments: CourseAssessment[];
}

// ============================================================================
// ACADEMICS OVERVIEW DATA
// ============================================================================
export const TERMS_DATA = [
    {
        id: 'term-1',
        title: 'Fall 2025 (Year 2, Semester 1)',
        isCurrent: false,
        courses: [
            { id: 'csc201', code: 'CSC201', title: 'Advanced Programming', credits: 4, status: 'Completed', grade: 'A' },
            { id: 'mat205', code: 'MAT205', title: 'Discrete Mathematics', credits: 3, status: 'Completed', grade: 'B+' },
        ]
    },
    {
        id: 'term-2',
        title: 'Spring 2026 (Year 2, Semester 2)',
        isCurrent: false,
        courses: [
            { id: 'csc205', code: 'CSC205', title: 'Database Systems', credits: 4, status: 'Completed', grade: 'A-' },
            { id: 'eng201', code: 'ENG201', title: 'Professional Communication', credits: 3, status: 'Completed', grade: 'A' },
        ]
    },
    {
        id: 'term-3',
        title: 'Fall 2026 (Year 3, Semester 1)',
        isCurrent: true,
        courses: [
            { id: 'csc301', code: 'CSC301', title: 'Data Structures & Algorithms', credits: 4, status: 'In Progress', grade: '-' },
            { id: 'mat210', code: 'MAT210', title: 'Linear Algebra', credits: 3, status: 'In Progress', grade: '-' },
            { id: 'eng105', code: 'ENG105', title: 'Technical Writing', credits: 3, status: 'In Progress', grade: '-' },
        ]
    }
];

// ============================================================================
// COURSE DETAILS DATA
// ============================================================================
export const COURSE_DETAILS_MAP: Record<string, CourseDetail> = {
    'csc301': {
        id: 'csc301',
        code: 'CSC301',
        title: 'Data Structures & Algorithms',
        credits: 4,
        instructor: { name: 'Dr. Sarah Jenkins', email: 's.jenkins@college.edu', office: 'Room 402, Tech Building' },
        description: 'An in-depth study of core data structures (trees, graphs, hash tables) and algorithm analysis. Students will learn to evaluate time and space complexity.',
        sessions: [
            { id: 1, date: 'Oct 10, 2026', topic: 'Introduction to Trees', type: 'Lecture' },
            { id: 2, date: 'Oct 12, 2026', topic: 'Binary Search Trees', type: 'Lecture' },
            { id: 3, date: 'Oct 15, 2026', topic: 'Tree Traversal Implementations', type: 'Lab' },
        ],
        materials: [
            { id: 1, title: 'Syllabus - Fall 2026', type: 'PDF', icon: <PictureAsPdfIcon color="error" />, size: '245 KB' },
            { id: 2, title: 'Lecture 04: Big-O Notation', type: 'Slides', icon: <DescriptionIcon color="primary" />, size: '1.2 MB' },
            { id: 3, title: 'Lab 2 Walkthrough', type: 'Video', icon: <VideoLibraryIcon color="secondary" />, size: '45 mins' },
        ],
        assessments: [
            { id: 1, name: 'Assignment 1', weight: '10%', maxScore: 100, score: 95 },
            { id: 2, name: 'Midterm Exam', weight: '30%', maxScore: 100, score: 88 },
            { id: 3, name: 'Final Project', weight: '40%', maxScore: 100, score: null },
        ]
    }
};