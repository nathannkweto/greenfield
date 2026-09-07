import type { CodegenConfig } from '@graphql-codegen/cli';
import { loadEnv } from 'vite';

// Load environment variables dynamically in Node CLI execution context
const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');

/**
 * Resolves the GraphQL schema URL dynamically from environment variables.
 */
const getSchemaUrl = (): string => {
    const endpoint =
        env.VITE_GRAPHQL_ENDPOINT ||
        env.VITE_API_URL ||
        env.VITE_API_BASE_URL;

    if (endpoint) {
        const baseUrl = endpoint.replace(/\/$/, '');
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
            config: {
                useTypeImports: true, // Emits 'import type' for TS verbatimModuleSyntax compliance
            },
        },
    },
    ignoreNoDocuments: true, // Prevents errors before you write your first query
};

export default config;