import { gql } from '@apollo/client';

export const GET_ACADEMIC_HISTORY = gql`
  query GetAcademicHistory {
    me {
      id
      students {
        id
        studentNumber
        firstName
        lastName
        status
        applicationDate
        admissionDate
        createdAt
        cgpa
        creditsCompleted
        program {
          id
          code
          title
          level
        }
        enrollments {
          id
          status
          grade
          points
          createdAt
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
      }
    }
  }
`;