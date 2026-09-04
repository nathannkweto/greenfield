import { gql } from '@apollo/client';

export const GET_STUDENT_DETAILS = gql`
  query GetStudentDetails($id: ID!) {
    student(id: $id) {
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
      cgpa
      creditsCompleted
      applicationDate
      admissionDate
      rejectionDate
      graduationDate
      createdAt
      updatedAt
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
      enrollments {
        id
        status
        completionDate
        dropDate
        grade
        points
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
`;