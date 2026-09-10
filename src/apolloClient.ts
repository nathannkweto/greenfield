import {
    ApolloClient,
    ApolloLink,
    HttpLink,
    InMemoryCache,
} from '@apollo/client';
import { SetContextLink } from '@apollo/client/link/context';
import { ErrorLink } from '@apollo/client/link/error';
import { CombinedGraphQLErrors, ServerError } from '@apollo/client/errors';
import { relayStylePagination } from '@apollo/client/utilities';
import { getRootUrl } from './api/axios-instance';

/**
 * Extracts and decodes cookie values by name.
 */
function getCookie(name: string): string | null {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        const rawValue = parts.pop()?.split(';').shift();
        return rawValue ? decodeURIComponent(rawValue) : null;
    }
    return null;
}

// 1. HTTP Link with credentials enabled for Sanctum session cookies
const httpLink = new HttpLink({
    uri: `${getRootUrl()}/graphql`,
    credentials: 'include',
});

// 2. Auth Link to dynamically pass the CSRF token header on every request
const authLink = new SetContextLink((prevContext) => {
    const xsrfToken = getCookie('XSRF-TOKEN');

    return {
        headers: {
            ...prevContext.headers,
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': xsrfToken || '',
        },
    };
});

// Helper function to safely navigate user to login
const redirectToLogin = () => {
    if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.assign('/login');
    }
};

// 3. Modern ErrorLink instance handling the unified `error` object
const errorLink = new ErrorLink(({ error }) => {
    if (!error) return;

    // Check for GraphQL-level Errors (Unauthenticated / Session expired)
    if (CombinedGraphQLErrors.is(error)) {
        for (const err of error.errors) {
            const category = err.extensions?.category;
            if (category === 'authentication' || err.message === 'Unauthenticated.') {
                redirectToLogin();
                return;
            }
        }
    }

    // Check for HTTP Server Errors (401 Unauthorized or 419 Page Expired/CSRF)
    if (ServerError.is(error)) {
        if (error.statusCode === 401 || error.statusCode === 419) {
            redirectToLogin();
            return;
        }
    }

    // Fallback status code check on generic network errors
    const statusCode = 'statusCode' in error
        ? (error as { statusCode?: number }).statusCode
        : null;

    if (statusCode === 401 || statusCode === 419) {
        redirectToLogin();
    }
});

// 4. Cache Configuration with Relay Pagination
const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                // Keying by 'status' separates cached results by student status
                students: relayStylePagination(['status']),
                transactions: relayStylePagination(),
                invoices: relayStylePagination(),
                schools: relayStylePagination(),
                programs: relayStylePagination(),
                courses: relayStylePagination(),
            },
        },
    },
});

// 5. Instantiated Client instance
export const client = new ApolloClient({
    link: ApolloLink.from([errorLink, authLink, httpLink]),
    cache,
});