import type { Student, CohortGroup } from './types';

export function formatStudentName(student: Pick<Student, 'firstName' | 'middleNames' | 'lastName'>): string {
    return [student.firstName, student.middleNames, student.lastName].filter(Boolean).join(' ');
}

export function formatStudyMode(mode: string): string {
    switch (mode) {
        case 'full_time':
            return 'Full Time';
        case 'part_time':
            return 'Part Time';
        case 'distance_learning':
            return 'Distance Learning';
        case 'online':
            return 'Online';
        default:
            return mode;
    }
}

/**
 * Groups students into cohorts based on their admission date year and intake.
 */
export function groupStudentsByCohort(students: Student[]): CohortGroup[] {
    const groupsMap = new Map<string, CohortGroup>();

    students.forEach((student) => {
        const regYear = student.admissionDate
            ? new Date(student.admissionDate).getFullYear()
            : new Date().getFullYear();

        const intake = student.intake || 'January';
        const cohortKey = `${regYear} ${intake}`;

        if (!groupsMap.has(cohortKey)) {
            groupsMap.set(cohortKey, {
                cohortKey,
                year: regYear,
                intake,
                students: [],
            });
        }

        groupsMap.get(cohortKey)!.students.push(student);
    });

    // Sort cohorts chronologically descending (newest first)
    return Array.from(groupsMap.values()).sort((a, b) => {
        if (b.year !== a.year) return b.year - a.year;
        const intakeOrder = { January: 1, May: 2, September: 3 };
        return (intakeOrder[b.intake] || 0) - (intakeOrder[a.intake] || 0);
    });
}