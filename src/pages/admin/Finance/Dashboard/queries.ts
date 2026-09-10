import { gql } from '@apollo/client';

export const GET_FINANCE_DASHBOARD = gql`
  query GetFinanceDashboardData($first: Int = 100) {
    # Main School/College Ledger Account
    schoolAccount: accounts(first: 1) {
      edges {
        node {
          id
          accountNumber
        }
      }
    }

    # Recent Double-Entry Transactions
    transactions(first: $first) {
      edges {
        node {
          id
          amount
          referenceNumber
          gatewayReference
          manualReceiptNumber
          paymentMethod
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
            admins {
              id
              firstName
              lastName
            }
          }
        }
      }
    }

    # Projected Fees (Total Student Fees)
    studentFees(first: $first) {
      edges {
        node {
          id
          amountZmw
        }
      }
    }

    # Collected Fees (Total Fee Payments)
    feePayments(first: $first) {
      edges {
        node {
          id
          amount
        }
      }
    }
  }
`;