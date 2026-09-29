import {
    type StudentResultsData,
    type YearlyResult,
    type ProcessedCourseResult,
    EnrollmentStatus,
} from './types.ts';

/**
 * Maps letter grades or point scale to status colors
 */
export function getGradeBadgeColor(grade?: string | null): 'success' | 'info' | 'warning' | 'error' | 'default' {
    if (!grade) return 'default';
    const g = grade.toUpperCase();

    if (['A+', 'A', 'A-', 'DISTINCTION', 'EXCELLENT'].some(v => g.includes(v))) return 'success';
    if (['B+', 'B', 'B-', 'MERIT', 'GOOD', 'CREDIT'].some(v => g.includes(v))) return 'info';
    if (['C+', 'C', 'C-', 'PASS', 'SATISFACTORY'].some(v => g.includes(v))) return 'warning';
    if (['D', 'F', 'FAIL'].some(v => g.includes(v))) return 'error';

    return 'default';
}

export function getEnrollmentStatusColor(status: EnrollmentStatus): 'success' | 'primary' | 'error' {
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
 * Organizes enrollments and assessment results by academic year
 */
export function processStudentResults(student: StudentResultsData): YearlyResult[] {
    const currentYear = student.academicProgress?.current_year ?? 1;
    const yearMap = new Map<number, ProcessedCourseResult[]>();

    // Group enrollments by curriculum year
    student.enrollments.forEach((enrollment) => {
        const year = enrollment.curriculum.year;
        const course = enrollment.curriculum.course;

        // Filter relevant assessments for this course
        const courseAssessments = student.assessmentResults
            .filter(
                (ar) =>
                    ar.assessment.curriculum.course.id === course.id &&
                    ar.assessment.curriculum.year === year
            )
            .map((ar) => {
                const scoreObtained = ar.score;
                const maxScore = ar.assessment.maxScore;
                const percentageScore =
                    scoreObtained != null && maxScore > 0
                        ? (scoreObtained / maxScore) * 100
                        : null;

                return {
                    id: ar.assessment.id,
                    title: ar.assessment.title,
                    type: ar.assessment.type,
                    term: ar.assessment.term,
                    weightPercentage: ar.assessment.weightPercentage,
                    maxScore,
                    scoreObtained,
                    percentageScore,
                };
            });

        // Compute cumulative weighted score from continuous assessments if available
        let calculatedWeightedScore: number | null = null;
        let totalWeight = 0;
        courseAssessments.forEach((a) => {
            if (a.percentageScore != null) {
                calculatedWeightedScore = (calculatedWeightedScore ?? 0) + (a.percentageScore * (a.weightPercentage / 100));
                totalWeight += a.weightPercentage;
            }
        });

        const processedCourse: ProcessedCourseResult = {
            courseId: course.id,
            code: course.code,
            title: course.title,
            credits: course.credits,
            status: enrollment.status,
            grade: enrollment.grade ?? (enrollment.status === 'IN_PROGRESS' ? 'Pending' : 'N/A'),
            points: enrollment.points ?? 0,
            assessments: courseAssessments,
            calculatedWeightedScore: totalWeight > 0 ? calculatedWeightedScore : null,
        };

        if (!yearMap.has(year)) {
            yearMap.set(year, []);
        }
        yearMap.get(year)!.push(processedCourse);
    });

    // Ensure all years up to current_year exist even if enrollments are empty
    for (let y = 1; y <= currentYear; y++) {
        if (!yearMap.has(y)) {
            yearMap.set(y, []);
        }
    }

    // Calculate GPA & credits per year
    const yearlyResults: YearlyResult[] = Array.from(yearMap.entries())
        .map(([year, courses]) => {
            let totalPoints = 0;
            let creditsEarned = 0;
            let creditsAttempted = 0;

            courses.forEach((c) => {
                creditsAttempted += c.credits;
                if (c.status === 'COMPLETED') {
                    creditsEarned += c.credits;
                    totalPoints += c.points * c.credits;
                }
            });

            const gpa = creditsEarned > 0 ? Number((totalPoints / creditsEarned).toFixed(2)) : 0;

            return {
                year,
                courses,
                creditsEarned,
                creditsAttempted,
                gpa,
                isCurrentYear: year === currentYear,
            };
        })
        .sort((a, b) => b.year - a.year); // Latest academic year first

    return yearlyResults;
}