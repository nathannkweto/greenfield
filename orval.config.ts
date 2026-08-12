import { defineConfig } from 'orval';

export default defineConfig({
    collegeApi: {
        input: {
            target: './spec.yaml', // Path to your OpenAPI YAML file
        },
        output: {
            mode: 'tags-split', // Groups API methods into separate files by OpenAPI tags
            workspace: 'src/api/generated',
            target: './endpoints.ts',
            schemas: './model',
            client: 'axios', // Set to 'react-query', 'vue-query', or 'swr' if using query hooks
            override: {
                mutator: {
                    path: '../axios-instance.ts',
                    name: 'customInstance',
                },
            },
        },
    },
});