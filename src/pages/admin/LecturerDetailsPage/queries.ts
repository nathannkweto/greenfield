import { gql } from '@apollo/client';

export const GET_LECTURER_DETAILS = gql`
  query GetLecturerDetails($id: ID!) {
    lecturer(id: $id) {
      id
      firstName
      middleName
      lastName
      dob
      address
      emergencyContact
      createdAt
      updatedAt
      school {
        id
        name
      }
      user {
        id
        email
      }
      curricula {
        id
        year
        program {
          id
          title
          code
        }
        course {
          id
          code
          title
          credits
        }
      }
    }
  }
`;