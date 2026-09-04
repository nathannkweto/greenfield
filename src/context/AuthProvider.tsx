import { type ReactNode, useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_ME } from '../graphql/queries/auth';
import { AuthContext, type AuthUser } from './AuthContext';

const SESSION_ROLES_KEY = 'greenfield.sessionRoles';

const readSessionRoles = (): string[] => {
    if (typeof window === 'undefined') return [];

    try {
        const value = JSON.parse(window.sessionStorage.getItem(SESSION_ROLES_KEY) ?? '[]');
        return Array.isArray(value) && value.every((role) => typeof role === 'string') ? value : [];
    } catch {
        return [];
    }
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [sessionRoles, setSessionRoles] = useState<string[]>(readSessionRoles);

    const { data, loading, refetch } = useQuery<{ me: AuthUser }>(GET_ME, {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
    });

    const user = data?.me ? { ...data.me, roles: sessionRoles } : null;
    const isAuthenticated = !!user;

    const refetchUser = async (roles?: string[]): Promise<AuthUser | null> => {
        try {
            if (roles?.length) {
                setSessionRoles(roles);
                window.sessionStorage.setItem(SESSION_ROLES_KEY, JSON.stringify(roles));
            }

            const result = await refetch();
            return result.data?.me
                ? { ...result.data.me, roles: roles?.length ? roles : sessionRoles }
                : null;
        } catch {
            return null;
        }
    };

    const clearSessionRoles = () => {
        setSessionRoles([]);
        window.sessionStorage.removeItem(SESSION_ROLES_KEY);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, refetchUser, clearSessionRoles }}>
            {children}
        </AuthContext.Provider>
    );
}