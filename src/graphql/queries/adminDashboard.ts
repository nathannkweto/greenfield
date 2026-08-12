import { graphql } from '../../gql';

export const GET_ADMIN_DASHBOARD = graphql(`
    query GetAdminDashboard {
        financialSummary {
            totalCollected
            totalOutstanding
            activeScholarships
            currency
        }
        students(first: 10, status: PENDING) {
            edges {
                node {
                    public_id
                }
            }
            pageInfo {
                total
                hasNextPage
            }
        }
        allStudents: students(first: 10) {
            edges {
                node {
                    public_id
                }
            }
            pageInfo {
                total
                hasNextPage
            }
        }
        courses(first: 10) {
            edges {
                node {
                    public_id
                }
            }
            pageInfo {
                total
                hasNextPage
            }
        }
    }
`);