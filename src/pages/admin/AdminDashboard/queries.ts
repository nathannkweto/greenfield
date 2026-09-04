import { gql } from '@apollo/client';

export const GET_ADMIN_DASHBOARD = gql`
  query GetAdminDashboardData($first: Int = 100) {
    registeredStudents: students(status: REGISTERED, first: $first) {
      edges { node { id } }
    }
    pendingApplications: students(status: PENDING, first: $first) {
      edges { node { id } }
    }
    schools(first: $first) {
      edges { node { id } }
    }
    programs(first: $first) {
      edges { node { id } }
    }
  }
`;