import { createContext, useContext } from 'react';

export interface StudentProfile {
    id?: string;
    status?: string;
    [key: string]: unknown;
}

export interface AuthUser {
    id: string;
    firstName: string;
    email: string;
    roles?: string[];
    admins?: unknown[];
    lecturers?: unknown[];
    students?: StudentProfile[];
    applicants?: unknown[];
}

export interface AuthContextType {
    user: AuthUser | null;
    isAuthenticated: boolean;
    loading: boolean;
    refetchUser: (roles?: string[]) => Promise<AuthUser | null>;
    clearSessionRoles: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}