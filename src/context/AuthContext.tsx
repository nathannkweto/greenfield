// src/context/AuthContext.ts (or wherever your Auth types reside)
import { createContext, useContext } from 'react';

export interface ApplicantProfile {
    id: string;
    firstName?: string;
    middleNames?: string;
    lastName?: string;
    email?: string;
    phone?: string;
}

export interface StudentProfile {
    id?: string;
    status?: string;
    [key: string]: unknown;
}

export interface AuthUser {
    id: string;
    email: string;
    phone?: string;
    applicants?: ApplicantProfile[];
    students?: StudentProfile[];
    admins?: unknown[];
    lecturers?: unknown[];
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