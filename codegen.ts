import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    schema: 'http://localhost:8000/graphql',

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