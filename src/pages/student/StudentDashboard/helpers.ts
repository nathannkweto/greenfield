import type {StudentFee, FeeSummary, AcademicTerm, AcademicEvent} from './types';

/**
 * Calculates fee summary and outstanding balance in ZMW.
 */
export function calculateFeeSummary(studentFees: StudentFee[] = []): FeeSummary {
    let totalBilledZmw = 0;
    let totalPaidZmw = 0;

    studentFees.forEach((sf) => {
        totalBilledZmw += sf.amountZmw || 0;
        const paid = sf.fee_payments?.reduce((acc, p) => acc + (p.amount || 0), 0) || 0;
        totalPaidZmw += paid;
    });

    const outstandingZmw = Math.max(0, totalBilledZmw - totalPaidZmw);

    return {
        totalBilledZmw,
        totalPaidZmw,
        outstandingZmw,
    };
}

/**
 * Resolves active academic term based on current system date.
 */
export function getCurrentTerm(terms: AcademicTerm[] = []): AcademicTerm | null {
    if (!terms || terms.length === 0) return null;
    const now = new Date();

    const activeTerm = terms.find((t) => {
        const start = new Date(t.startDate);
        const end = new Date(t.endDate);
        return now >= start && now <= end;
    });

    if (activeTerm) return activeTerm;

    // Return the most recent term if no match
    return [...terms].sort(
        (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    )[0] || null;
}

/**
 * Filters upcoming academic events sorted chronologically.
 */
export function getUpcomingEvents(events: AcademicEvent[] = [], limit = 5): AcademicEvent[] {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return events
        .filter((e) => new Date(e.endDate || e.startDate) >= now)
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        .slice(0, limit);
}

/**
 * Date formatter helper.
 */
export function formatDate(dateString?: string, options?: Intl.DateTimeFormatOptions): string {
    if (!dateString) return 'N/A';
    const defaultOptions: Intl.DateTimeFormatOptions = {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('en-US', options || defaultOptions);
}

/**
 * Currency formatter for ZMW.
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-ZM', {
        style: 'currency',
        currency: 'ZMW',
        minimumFractionDigits: 2,
    }).format(amount);
}

/**
 * Initials generator.
 */
export function getInitials(firstName?: string, lastName?: string): string {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || 'ST';
}

/**
 * Time-based greeting generator.
 */
export function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
}