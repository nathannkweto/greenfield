import { gql } from '@apollo/client';

export const GET_STUDENT_DASHBOARD = gql`
  query GetStudentDashboard {
    me {
      id
      email
      students {
        id
        studentNumber
        admissionNumber
        firstName
        middleNames
        lastName
        status
        program {
          id
          code
          title
        }
        enrollments {
          id
          status
          grade
          curriculum {
            id
            year
            course {
              id
              code
              title
              credits
              description
            }
          }
        }
        studentFees {
          id
          amountZmw
          amountUsd
          fee {
            id
            title
          }
          fee_payments {
            id
            amount
          }
        }
      }
    }
    academicTerms {
      id
      term
      startDate
      endDate
      academicYear {
        id
        year
      }
    }
    academicEvents {
      id
      title
      startDate
      endDate
    }
  }
`;