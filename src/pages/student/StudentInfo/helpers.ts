import {type Student, StudentStatus, ProgramLevel } from './types';

/**
 * Formats full student name.
 */
export function getFullName(student: Student): string {
    const parts = [student.firstName, student.middleNames, student.lastName].filter(Boolean);
    return parts.join(' ');
}

/**
 * Generates initials for avatar fallback.
 */
export function getInitials(firstName: string, lastName: string): string {
    const f = firstName ? firstName.charAt(0).toUpperCase() : '';
    const l = lastName ? lastName.charAt(0).toUpperCase() : '';
    return `${f}${l}` || 'ST';
}

/**
 * Date formatter for dates or timestamps.
 */
export function formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
}

/**
 * Formats program level enum values for display.
 */
export function formatProgramLevel(level?: ProgramLevel | string): string {
    if (!level) return 'N/A';
    return level.replace(/_/g, ' ');
}

/**
 * Status Chip Color mapper.
 */
export function getStatusColor(status: StudentStatus): 'success' | 'info' | 'warning' | 'error' | 'default' {
    switch (status) {
        case StudentStatus.ENROLLED:
        case StudentStatus.REGISTERED:
            return 'success';
        case StudentStatus.ACCEPTED:
        case StudentStatus.APPLICANT:
            return 'info';
        case StudentStatus.GRADUATED:
            return 'default';
        case StudentStatus.SUSPENDED:
        case StudentStatus.WITHDRAWN:
            return 'warning';
        case StudentStatus.REJECTED:
            return 'error';
        default:
            return 'default';
    }
}

/**
 * Performance standing based on CGPA from AcademicProgress model.
 */
export function getAcademicStanding(cgpa: number = 0): { label: string; color: string } {
    if (cgpa >= 3.6) return { label: 'Distinction / High Honors', color: 'success.main' };
    if (cgpa >= 3.0) return { label: 'Merit / Good Standing', color: 'primary.main' };
    if (cgpa >= 2.0) return { label: 'Satisfactory Standing', color: 'info.main' };
    return { label: 'Academic Warning', color: 'error.main' };
}