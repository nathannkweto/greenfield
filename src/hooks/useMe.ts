// src/hooks/useMe.ts
import { useQuery } from '@apollo/client/react';
import { GET_ME } from '../graphql/queries/auth';

export interface User {
    id: string;
    firstName: string;
    email: string;
}

export function useMe() {
    const { data, loading, error, refetch } = useQuery<{ me: User }>(GET_ME, {
        fetchPolicy: 'cache-first', // Use cached profile immediately if available
        errorPolicy: 'all',
    });

    return {
        user: data?.me || null,
        isAuthenticated: !!data?.me,
        loading,
        error,
        refetchUser: refetch,
    };
}