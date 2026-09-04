import { gql } from '@apollo/client';

export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      students {
        id
        status
      }
      admins {
        id
      }
      lecturers {
        id
      }
      applicants {
        id
      }
    }
  }
`;