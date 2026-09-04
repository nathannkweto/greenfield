import { gql } from '@apollo/client';

export const MANAGEMENT_SCHOOL_FRAGMENT = gql`
  fragment ManagementSchoolFields on School {
    id
    name
    description
    dean {
      id
      email
    }
  }
`;

export const GET_MANAGEMENT = gql`
  query GetManagement($first: Int = 100) {
    schools(first: $first) {
      edges {
        node {
          ...ManagementSchoolFields
        }
      }
    }
  }
  ${MANAGEMENT_SCHOOL_FRAGMENT}
`;