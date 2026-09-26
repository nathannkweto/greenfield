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
            account {
              id
              accountNumber
              name
              type
            }
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
              account {
                id
                accountNumber
                name
                type
              }
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
          account {
            id
            accountNumber
            name
            type
          }
          feeable {
            __typename
          }
        }
      }
    }
  }
`;

export const GET_REVENUE_ACCOUNTS = gql`
  query GetRevenueAccounts {
    accounts(type: "revenue", first: 100) {
      edges {
        node {
          id
          accountNumber
          name
          type
        }
      }
    }
  }
`;

export const GET_STUDENT_BY_NUMBER = gql`
  query GetStudentByNumber($studentNumber: String!) {
    student(studentNumber: $studentNumber) {
      id # Returns public_id
      studentNumber
      firstName
      lastName
    }
  }
`;