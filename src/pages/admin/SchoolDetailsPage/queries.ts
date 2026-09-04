import { gql } from '@apollo/client';

export const GET_SCHOOL_DETAILS = gql`
  query GetSchoolDetails($id: ID!) {
    school(id: $id) {
      id
      name
      description
      dean {
        id
        email
      }
      programs {
        id
        code
        title
        level
        durationValue
        durationUnit
        shortDescription
      }
      courses {
        id
        code
        title
        description
        credits
      }
      lecturers {
        id
        firstName
        middleName
        lastName
        user {
          id
          email
        }
      }
      createdAt
      updatedAt
    }
  }
`;