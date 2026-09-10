import { gql } from '@apollo/client';

export const GET_FEE_PAYMENTS = gql`
  query GetFeePayments($first: Int = 100) {
    feePayments(first: $first) {
      edges {
        node {
          id
          amount
          createdAt
          transaction {
            id
            referenceNumber
            paymentMethod
          }
          studentFee {
            id
            amountZmw
            fee {
              id
              title
            }
            student {
              id
              studentNumber
              firstName
              lastName
            }
            payments {
              id
              amount
            }
          }
        }
      }
    }
    programs(first: $first) {
      edges {
        node {
          id
          code
          title
          level
          students(status: REGISTERED) {
            id
            studentNumber
            firstName
            lastName
            studentFees {
              id
              amountZmw
              payments {
                id
                amount
              }
            }
          }
        }
      }
    }
  }
`;