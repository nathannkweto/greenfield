import { gql } from '@apollo/client';

export const GET_LECTURER_PORTAL = gql`
  query GetLecturerPortal {
    me {
      id
      lecturers {
        id
        firstName
        lastName
        curricula {
          id
          year
          program {
            id
            code
            title
          }
          course {
            id
            code
            title
          }
          enrollments {
            id
          }
        }
      }
    }
  }
`;