import { gql } from '@apollo/client';

export const GET_ACCOUNTING_DATA = gql`
  query GetAccountingData($first: Int = 100) {
    transactions(first: $first) {
      edges {
        node {
          id
          amount
          referenceNumber
          gatewayReference
          paymentMethod
          manualReceiptNumber
          createdAt
          debitAccount {
            id
            accountNumber
          }
          creditAccount {
            id
            accountNumber
          }
          cashier {
            id
            email
            admins {
              id
              firstName
              lastName
            }
          }
        }
      }
    }
    receiptBooks(first: $first) {
      edges {
        node {
          id
          bookNumber
          startNumber
          endNumber
          currentNumber
          status
          assignedTo {
            id
            email
            admins {
              id
              firstName
              lastName
            }
          }
          createdAt
        }
      }
    }
    accounts(first: $first) {
      edges {
        node {
          id
          accountNumber
          createdAt
        }
      }
    }
  }
`;