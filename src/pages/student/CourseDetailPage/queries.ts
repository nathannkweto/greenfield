import { gql } from '@apollo/client';

export const GET_COURSE_DETAILS = gql`
  query GetCourseDetails {
    me {
      id
      students {
        id
        enrollments {
          id
          curriculum {
            id
            course {
              id
              code
              title
              description
              credits
            }
            lecturer {
              id
              firstName
              lastName
              user {
                id
                email
              }
            }
            assessments {
              id
              title
              description
              type
              term
              weightPercentage
              maxScore
              assessmentResults {
                id
                score
              }
            }
          }
        }
      }
    }
  }
`;