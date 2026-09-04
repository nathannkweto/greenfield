import { gql } from '@apollo/client';

const STUDENT_LIST_FRAGMENT = gql`
  fragment StudentListFields on Student {
    id
    firstName
    lastName
    email
    phone
    applicationNumber
    admissionNumber
    studentNumber
    status
    applicationDate
    admissionDate
    rejectionDate
    graduationDate
    cgpa
    creditsCompleted
    program {
      id
      code
      title
      level
      durationValue
      durationUnit
      school {
        id
        name
      }
    }
  }
`;

export const GET_STUDENTS_LIST = gql`
  query GetStudentsList($status: StudentStatus, $programId: ID) {
    students(status: $status, programId: $programId, first: 100) {
      edges {
        node {
          ...StudentListFields
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
  ${STUDENT_LIST_FRAGMENT}
`;

export const GET_SCHOOLS_AND_PROGRAMS = gql`
  query GetSchoolsAndPrograms {
    schools(first: 100) {
      edges {
        node {
          id
          name
        }
      }
    }
    programs(first: 100) {
      edges {
        node {
          id
          title
          school {
            id
            name
          }
        }
      }
    }
  }
`;