import type { CodegenConfig } from '@graphql-codegen/cli';

// Declare process.env for Node CLI execution without requiring @types/node
declare const process: {
    env: Record<string, string | undefined>;
};

/**
 * Resolves the GraphQL schema URL dynamically from environment variables.
 */
const getSchemaUrl = (): string => {
    if (process.env.VITE_GRAPHQL_ENDPOINT) {
        return process.env.VITE_GRAPHQL_ENDPOINT;
    }

    if (process.env.VITE_API_BASE_URL) {
        const baseUrl = process.env.VITE_API_BASE_URL.replace(/\/$/, '');
        return baseUrl.endsWith('/graphql') ? baseUrl : `${baseUrl}/graphql`;
    }

    return 'http://localhost:8000/graphql';
};

const config: CodegenConfig = {
    schema: getSchemaUrl(),

    // Scan all React component/page files for GraphQL queries and mutations
    documents: ['src/**/*.{ts,tsx}'],

    generates: {
        // Output directory for generated types and typed gql function
        './src/gql/': {
            preset: 'client-preset',
            presetConfig: {
                gqlTagName: 'graphql', // Name of the typed tag function
            },
        },
    },
    ignoreNoDocuments: true, // Prevents errors before you write your first query
};

export default config;