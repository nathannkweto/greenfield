import type { AcademicYear, AcademicTerm } from './types';

export function formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

export function formatDateRange(startDate?: string, endDate?: string): string {
    return `${formatDate(startDate)} — ${formatDate(endDate)}`;
}

/**
 * Calculates the 2nd Saturday before term start date (the system transition execution date)
 */
export function getTransitionTriggerDate(startDateString: string): string {
    const date = new Date(startDateString);
    if (isNaN(date.getTime())) return 'N/A';

    const dayOfWeek = date.getDay(); // 0 = Sun, 6 = Sat
    const daysToFirstSaturday = dayOfWeek === 6 ? 7 : (dayOfWeek + 1);

    date.setDate(date.getDate() - daysToFirstSaturday - 7);
    return formatDate(date.toISOString());
}

export function getTermStatus(startDate: string, endDate: string): 'Active' | 'Upcoming' | 'Completed' {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now > end) return 'Completed';
    if (now >= start && now <= end) return 'Active';
    return 'Upcoming';
}

export function sortAcademicYears(years: AcademicYear[]): AcademicYear[] {
    return [...years].sort((a, b) => b.year - a.year);
}

/**
 * Detects which term an event falls into based on start date
 */
export function detectTermForDate(dateStr: string, terms: AcademicTerm[] = []): string {
    if (!dateStr) return 'Unassigned';
    const target = new Date(dateStr).getTime();

    for (const term of terms) {
        const start = new Date(term.startDate).getTime();
        const end = new Date(term.endDate).getTime();
        if (target >= start && target <= end) {
            return `${term.term} Term`;
        }
    }
    return 'Outside Formal Terms';
}