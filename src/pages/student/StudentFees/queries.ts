import { gql } from '@apollo/client';

export const GET_STUDENT_FEES_DATA = gql`
  query GetStudentFeesData {
    me {
      id
      email
      students {
        id
        studentNumber
        firstName
        lastName
        program {
          id
          title
          code
        }
        studentFees {
          id
          amountZmw
          amountUsd
          createdAt
          fee {
            id
            title
            frequency
          }
          fee_payments {
            id
            amount
            createdAt
            transaction {
              id
              referenceNumber
              gatewayReference
              paymentMethod
              manualReceiptNumber
              createdAt
            }
          }
        }
      }
    }
  }
`;
