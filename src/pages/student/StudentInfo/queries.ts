import { gql } from '@apollo/client';

export const GET_STUDENT_INFO = gql`
  query GetStudentInfo {
    me {
      id
      email
      students {
        id
        applicationNumber
        admissionNumber
        studentNumber
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
        academicProgress {
          id
          current_year
          credits_earned
          cgpa
          created_at
          updated_at
        }
        program {
          id
          code
          title
          level
          durationValue
          durationUnit
          shortDescription
          school {
            id
            name
            description
          }
        }
      }
    }
  }
`;