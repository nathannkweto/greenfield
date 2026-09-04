import {
    getCourses,
    getLecturers,
    getPrograms,
    getSchools,
    type CourseRequest,
    type LecturerRequest,
    type ProgramRequest,
    type SchoolRequest,
} from '../generated';

export type ManagementEntity = 'school' | 'program' | 'course' | 'lecturer';

export interface ManagementFormValues {
    name?: string;
    description?: string;
    deanUserPublicId?: string;
    code?: string;
    title?: string;
    qualification?: string;
    durationMonths?: number;
    credits?: number;
    userPublicId?: string;
    staffNumber?: string;
    department?: string;
}

const required = (value: string | undefined, label: string) => {
    if (!value?.trim()) throw new Error(`${label} is required.`);
    return value.trim();
};

export async function saveManagementEntity(
    entity: ManagementEntity,
    mode: 'create' | 'edit',
    values: ManagementFormValues,
    entityId?: string,
    schoolId?: string,
) {
    if (mode === 'edit' && !entityId) throw new Error('The selected record has no identifier.');

    if (entity === 'school') {
        const payload: SchoolRequest = { name: required(values.name, 'School name'), description: values.description || undefined, dean_user_public_id: values.deanUserPublicId || null };
        const api = getSchools();
        return mode === 'create' ? api.postSchoolsCreate(payload) : api.postSchoolsPublicIdEdit(entityId!, payload);
    }
    if (entity === 'program') {
        const payload: ProgramRequest = { school_public_id: required(schoolId, 'School'), code: required(values.code, 'Program code'), title: required(values.title, 'Program title'), qualification: required(values.qualification, 'Qualification'), duration_months: Number(values.durationMonths) || 0 };
        const api = getPrograms();
        return mode === 'create' ? api.postProgramsCreate(payload) : api.postProgramsPublicIdEdit(entityId!, payload);
    }
    if (entity === 'course') {
        const payload: CourseRequest = { school_public_id: required(schoolId, 'School'), code: required(values.code, 'Course code'), title: required(values.title, 'Course title'), description: values.description || undefined, credits: Number(values.credits) || 0 };
        const api = getCourses();
        return mode === 'create' ? api.postCoursesCreate(payload) : api.postCoursesPublicIdEdit(entityId!, payload);
    }

    const payload: LecturerRequest = { user_public_id: required(values.userPublicId, 'Lecturer user ID'), staff_number: required(values.staffNumber, 'Staff number'), department: required(values.department, 'Department') };
    const api = getLecturers();
    return mode === 'create' ? api.postLecturersCreate(payload) : api.postLecturersPublicIdEdit(entityId!, payload);
}
