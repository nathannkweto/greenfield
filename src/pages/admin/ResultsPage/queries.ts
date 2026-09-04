import { gql } from '@apollo/client';

export const GET_RESULTS_PAGE = gql`
  query GetResultsPage($first: Int = 100) {
    courses(first: $first) {
      edges {
        node {
          id
          code
          title
          curricula {
            id
            year
            assessments {
              id
              title
              type
              term
              maxScore
              weightPercentage
              dueDate
            }
          }
        }
      }
    }
  }
`;