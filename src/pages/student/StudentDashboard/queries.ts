import { gql } from '@apollo/client';

export const GET_STUDENT_PORTAL = gql`
  query GetStudentPortal {
    me {
      id
      email
      students {
        id
        studentNumber
        admissionNumber
        applicationNumber
        firstName
        middleNames
        lastName
        email
        phone
        dob
        address
        emergencyContact
        sex
        maritalStatus
        nationality
        nrcNumber
        passportNumber
        intake
        studyMode
        status
        applicationDate
        admissionDate
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
            }
          }
        }
      }
    }
  }
`;