import type {StudentHistoryData, YearlyAcademicRecord, EnrollmentStatus} from './types';

export function getStatusBadgeColor(status: EnrollmentStatus): 'success' | 'primary' | 'error' {
    switch (status) {
        case 'COMPLETED':
            return 'success';
        case 'IN_PROGRESS':
            return 'primary';
        case 'DROPPED':
            return 'error';
        default:
            return 'primary';
    }
}

/**
 * Organizes a student's history by calendar years spent at the college
 * based on their registration date and enrollment history.
 */
export function processAcademicHistory(student: StudentHistoryData): YearlyAcademicRecord[] {
    // Determine registration date (Admission date > Application date > Record creation)
    const regDateString = student.admissionDate || student.applicationDate || student.createdAt;
    const regDate = new Date(regDateString);
    const startCalendarYear = isNaN(regDate.getTime()) ? new Date().getFullYear() : regDate.getFullYear();
    const currentCalendarYear = new Date().getFullYear();

    // Map enrollments by calendar year
    const enrollmentsByYear = new Map<number, typeof student.enrollments>();

    student.enrollments.forEach((enrollment) => {
        const enrollmentDate = new Date(enrollment.createdAt);
        const year = isNaN(enrollmentDate.getTime()) ? startCalendarYear : enrollmentDate.getFullYear();

        if (!enrollmentsByYear.has(year)) {
            enrollmentsByYear.set(year, []);
        }
        enrollmentsByYear.get(year)!.push(enrollment);
    });

    const records: YearlyAcademicRecord[] = [];

    // Generate records for every calendar year spent at college
    for (let year = startCalendarYear; year <= currentCalendarYear; year++) {
        const yearEnrollments = enrollmentsByYear.get(year) || [];
        const yearsInCollege = year - startCalendarYear + 1;

        // Identify study year levels (e.g. Curriculum Year 1, Year 2) taken during this calendar year
        const studyYearsSet = new Set<number>();
        let totalCredits = 0;
        let completedCoursesCount = 0;
        let inProgressCoursesCount = 0;

        yearEnrollments.forEach((e) => {
            if (e.curriculum?.year) {
                studyYearsSet.add(e.curriculum.year);
            }
            totalCredits += e.curriculum?.course?.credits || 0;

            if (e.status === 'COMPLETED') completedCoursesCount++;
            if (e.status === 'IN_PROGRESS') inProgressCoursesCount++;
        });

        const studyYears = Array.from(studyYearsSet).sort((a, b) => a - b);

        records.push({
            calendarYear: year,
            yearsInCollege,
            studyYears,
            enrollments: yearEnrollments,
            totalCredits,
            completedCoursesCount,
            inProgressCoursesCount,
        });
    }

    // Return sorted latest year first
    return records.sort((a, b) => b.calendarYear - a.calendarYear);
}