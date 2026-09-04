import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserRoles, getRoleBasedPath, getStudentStatus } from '../../utils/rbac';

interface RequireRoleProps {
    allowedRoles: string[];
    allowedStatuses?: string[];
}

export function RequireRole({ allowedRoles, allowedStatuses }: RequireRoleProps) {
    const { user } = useAuth();
    const userRoles = getUserRoles(user);
    const hasRole = allowedRoles.some((role) => userRoles.includes(role));

    const studentStatus = getStudentStatus(user);

    const hasValidStatus = allowedStatuses
        ? !!studentStatus && allowedStatuses.includes(studentStatus)
        : true;

    if (!hasRole || !hasValidStatus) {
        return <Navigate to={getRoleBasedPath(user)} replace />;
    }

    return <Outlet />;
}