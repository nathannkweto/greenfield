import { gql } from '@apollo/client';

export const GET_ADMIN_ACCOUNTS = gql`
  query GetAdminAccounts($first: Int = 100) {
    admins(first: $first) {
      edges {
        node {
          id
          firstName
          middleName
          lastName
          employeeNumber
          department
          position
          createdAt
          updatedAt
          user {
            id
            email
            phone
          }
        }
      }
    }
  }
`;