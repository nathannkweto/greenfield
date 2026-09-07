import { gql } from '@apollo/client';

export const GET_SCHOOLS_WITH_PROGRAMS = gql`
  query GetSchoolsWithPrograms($first: Int = 10, $after: String) {
    schools(first: $first, after: $after) {
      edges {
        node {
          id
          name
          description
          programs {
            id
            code
            title
            level
            durationValue
            durationUnit
            shortDescription
            longDescription
            requirements {
              id
              description
              sortOrder
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
