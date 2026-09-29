import { gql } from '@apollo/client';

export const GET_STUDENT_ACADEMICS = gql`
  query GetStudentAcademics {
    me {
      id
      students {
        id
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
            }
          }
        }
      }
    }
  }
`;