// src/hooks/useMe.ts
import { useQuery } from '@apollo/client/react';
import { GET_ME } from '../graphql/queries/auth';
import type {AuthUser} from '../context/AuthContext';

export function useMe() {
    const { data, loading, error, refetch } = useQuery<{ me: AuthUser }>(GET_ME, {
        fetchPolicy: 'cache-first',
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