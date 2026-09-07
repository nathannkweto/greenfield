export interface StudentRoleSource {
    status?: string;
    [key: string]: unknown;
}

export interface UserRoleSource {
    roles?: string[];
    admins?: unknown[];
    lecturers?: unknown[];
    students?: StudentRoleSource[] | unknown[];
    applicants?: unknown[];
}

export const getUserRoles = (userObj: UserRoleSource | null | undefined): string[] => {
    if (!userObj) return [];

    if (Array.isArray(userObj.roles) && userObj.roles.length > 0) {
        return userObj.roles;
    }

    const derivedRoles: string[] = [];
    if (userObj.admins?.length) derivedRoles.push('admin');
    if (userObj.lecturers?.length) derivedRoles.push('lecturer');
    if (userObj.students?.length) derivedRoles.push('student');
    if (userObj.applicants?.length) derivedRoles.push('applicant');

    return derivedRoles;
};

export const getStudentStatus = (userObj: UserRoleSource | null | undefined): string | undefined => {
    const student = userObj?.students?.[0] as StudentRoleSource | undefined;

    if (student && typeof student.status === 'string') {
        return student.status.toLowerCase();
    }

    return undefined;
};

export const getRoleBasedPath = (
    userOrRoles: UserRoleSource | string[] | null | undefined
): string => {
    if (!userOrRoles) return '/login';

    const isRolesArray = Array.isArray(userOrRoles) && userOrRoles.every((r) => typeof r === 'string');
    const userObj = !isRolesArray ? (userOrRoles as UserRoleSource) : null;
    const roles = isRolesArray ? (userOrRoles as string[]) : getUserRoles(userObj);

    if (roles.includes('admin')) return '/admin/dashboard';
    if (roles.includes('lecturer')) return '/lecturer/dashboard';

    if (roles.includes('student')) {
        const status = getStudentStatus(userObj);
        if (status === 'registered' || status === 'suspended') {
            return '/student/dashboard';
        }
        // Fallback to applicant portal if status is pending, admitted, or rejected
        if (roles.includes('applicant')) {
            return '/applicant/dashboard';
        }
    }

    if (roles.includes('applicant')) {
        return '/applicant/info';
    }

    return '/login';
};

export const isPathAllowedForRoles = (
    path: string,
    userOrRoles: UserRoleSource | string[] | null | undefined
): boolean => {
    if (!path || path === '/login') return false;

    const isRolesArray = Array.isArray(userOrRoles) && userOrRoles.every((r) => typeof r === 'string');
    const userObj = !isRolesArray ? (userOrRoles as UserRoleSource) : null;
    const roles = isRolesArray ? (userOrRoles as string[]) : getUserRoles(userObj);

    if (path.startsWith('/admin')) return roles.includes('admin');
    if (path.startsWith('/lecturer')) return roles.includes('lecturer');

    if (path.startsWith('/applicant')) {
        return roles.includes('applicant');
    }

    if (path.startsWith('/student')) {
        if (!roles.includes('student')) return false;
        const status = getStudentStatus(userObj);
        return status === 'registered' || status === 'suspended';
    }

    return false;
};