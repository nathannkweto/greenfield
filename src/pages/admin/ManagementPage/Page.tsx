import { useQuery } from '@apollo/client/react';
import { Box, Container, CircularProgress, Alert } from '@mui/material';
import { GET_MANAGEMENT } from './queries';
import { ManagementSections } from './components/ManagementSections';

export interface School {
    id: string;
    name: string;
    description?: string | null;
    dean?: { firstName: string; lastName: string } | null;
}

interface ManagementQueryData {
    schools: { edges: Array<{ node: School }> };
}

export default function ManagementPage() {
    const { data, loading, error, refetch } = useQuery<ManagementQueryData>(GET_MANAGEMENT);

    const schools = data?.schools?.edges?.map(({ node }) => node) ?? [];

    return (
        <Box sx={{ backgroundColor: 'background.default', minHeight: '70vh', py: { xs: 2, md: 4 } }}>
            <Container maxWidth="xl">
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                        <CircularProgress />
                    </Box>
                )}

                {error && <Alert severity="error">{error.message}</Alert>}

                {!loading && !error && (
                    <ManagementSections
                        schools={schools}
                        onChanged={() => refetch()}
                    />
                )}
            </Container>
        </Box>
    );
}