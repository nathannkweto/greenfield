import { gql } from '@apollo/client';

export const GET_CURRICULUM_PORTAL = gql`
  query GetCurriculumPortal($id: ID!) {
    curriculum(id: $id) {
      id
      year
      program {
        id
        code
        title
        level
      }
      course {
        id
        code
        title
        description
        credits
      }
      assessments {
        id
        title
        description
        type
        term
        weightPercentage
        maxScore
        dueDate
        assessmentResults {
          id
          score
          student {
            id
          }
        }
      }
      enrollments {
        id
        student {
          id
          firstName
          lastName
        }
      }
    }
  }
`;