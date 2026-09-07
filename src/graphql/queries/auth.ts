// src/graphql/queries/auth.ts
import { gql } from '@apollo/client';

export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      phone
      applicants {
        id
        firstName
        middleNames
        lastName
        email
        phone
      }
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
    }
  }
`;