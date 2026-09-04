import { gql } from '@apollo/client';

export const GET_PROGRAM_DETAILS = gql`
  query GetProgramDetail($id: ID!) {
    program(id: $id) {
      id
      code
      title
      level
      durationValue
      durationUnit
      shortDescription
      longDescription
      createdAt
      updatedAt
      requirements {
        id
        description
        sortOrder
      }
      curricula {
        id
        year
        course {
          id
          title
          code
          credits
          school {
            id
            name
          }
        }
        lecturer {
          id
          firstName
          middleName
          lastName
          school {
            id
            name
          }
        }
      }
      school {
        id
        name
      }
    }
  }
`;

export const GET_ALL_COURSES = gql`
  query GetAllCourses($first: Int = 1000) {
    courses(first: $first) {
      edges {
        node {
          id
          code
          title
          credits
          school {
            id
            name
          }
        }
      }
    }
  }
`;

export const GET_ALL_LECTURERS = gql`
  query GetAllLecturers($first: Int = 1000) {
    lecturers(first: $first) {
      edges {
        node {
          id
          firstName
          middleName
          lastName
          school {
            id
            name
          }
        }
      }
    }
  }
`;