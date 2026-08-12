import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { relayStylePagination } from '@apollo/client/utilities';

// 1. Point this to your Laravel application's GraphQL endpoint
const httpLink = createHttpLink({
    uri: 'http://localhost:8000/graphql',
});

// 2. Attach the Authorization header
const authLink = setContext((_, { headers }) => {
    // Retrieve the token from local storage (or your state manager)
    const token = localStorage.getItem('auth_token');

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
            // If using Sanctum with stateful cookies instead of Bearer tokens,
            // you would pass 'X-XSRF-TOKEN' here and set credentials to 'include'
        }
    }
});

// 3. Configure the Cache for Relay Pagination
const cache = new InMemoryCache({
    typePolicies: {
        Query: {
            fields: {
                // Tell Apollo that these queries use Relay connections
                // This allows infinite scrolling to automatically merge old and new data
                students: relayStylePagination(),
                transactions: relayStylePagination(),
                invoices: relayStylePagination(),
                schools: relayStylePagination(),
                programs: relayStylePagination(),
                courses: relayStylePagination(),
            },
        },
    },
});

// 4. Initialize the Client
export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: cache,
});