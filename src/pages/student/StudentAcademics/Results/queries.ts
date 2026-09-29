import { gql } from '@apollo/client';

export const GET_STUDENT_RESULTS = gql`
  query GetStudentResults {
    me {
      id
      students {
        id
        studentNumber
        firstName
        lastName
        cgpa
        creditsCompleted
        program {
          id
          code
          title
          level
        }
        academicProgress {
          id
          current_year
          credits_earned
          cgpa
        }
        enrollments {
          id
          status
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
        assessmentResults {
          id
          score
          assessment {
            id
            title
            type
            weightPercentage
            maxScore
            term
            curriculum {
              id
              year
              course {
                id
                code
              }
            }
          }
        }
      }
    }
  }
`;