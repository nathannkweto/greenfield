import type {
    DurationUnit,
    ProgramLevel,
    LecturerOption,
    CurriculumItem,
    FormattedYear,
    StudentRegisterItem
} from './types';

export function formatDuration(value?: number, unit?: DurationUnit): string {
    if (!value || !unit) return 'N/A';
    const singularUnit = unit.toLowerCase().replace(/s$/, '');
    const formattedUnit = value === 1 ? singularUnit : `${singularUnit}s`;
    return `${value} ${formattedUnit.charAt(0).toUpperCase() + formattedUnit.slice(1)}`;
}

export function formatLevel(level?: ProgramLevel): string {
    if (!level) return 'N/A';
    if (level === 'Post_graduate_Diploma') return 'Post-graduate Diploma';
    return level;
}

export function formatLecturerName(lecturer?: LecturerOption): string {
    if (!lecturer) return '';
    const parts = [lecturer.firstName, lecturer.middleName, lecturer.lastName].filter(Boolean);
    return parts.join(' ');
}

export function formatCurriculumData(
    durationValue?: number,
    durationUnit?: DurationUnit,
    curricula?: CurriculumItem[]
): FormattedYear[] {
    let totalYears = 1;

    if (durationValue && durationUnit?.toLowerCase() === 'years') {
        totalYears = durationValue;
    } else if (curricula && curricula.length > 0) {
        totalYears = Math.max(...curricula.map((c) => c.year), 1);
    }

    const yearsMap = new Map<number, CurriculumItem[]>();

    for (let y = 1; y <= totalYears; y++) {
        yearsMap.set(y, []);
    }

    curricula?.forEach((item) => {
        const yearKey = item.year;
        if (!yearsMap.has(yearKey)) {
            yearsMap.set(yearKey, []);
        }
        yearsMap.get(yearKey)!.push(item);
    });

    return Array.from(yearsMap.entries())
        .sort(([yearA], [yearB]) => yearA - yearB)
        .map(([year, items]) => ({ year, items }));
}

export const createEmptyStudentRow = (): StudentRegisterItem => ({
    first_name: '',
    middle_names: '',
    last_name: '',
    email: '',
    phone: '',
    dob: '',
    address: '',
    emergency_contact: '',
    sex: 'male',
    marital_status: 'single',
    nationality: 'Zambian',
    nrc_number: '',
    passport_number: '',
    application_number: '',
    admission_number: '',
    student_number: '',
    intake: 'January',
    study_mode: 'full_time',
    registration_date: new Date().toISOString().split('T')[0],
    current_year: 1,
    credits_earned: 0,
    cgpa: 0.0,
});