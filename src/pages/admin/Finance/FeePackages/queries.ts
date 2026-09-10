import { gql } from '@apollo/client';

export const GET_FEE_TEMPLATES = gql`
  query GetFeeTemplates {
    schools(first: 100) {
      edges {
        node {
          id
          name
          description
          fees {
            id
            title
            amountZmw
            amountUsd
            frequency
          }
          programs {
            id
            code
            title
            level
            fees {
              id
              title
              amountZmw
              amountUsd
              frequency
            }
          }
        }
      }
    }
    fees(first: 100) {
      edges {
        node {
          id
          title
          amountZmw
          amountUsd
          frequency
          feeable {
            __typename
          }
        }
      }
    }
  }
`;