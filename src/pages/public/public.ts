import { gql } from '@apollo/client';

export const GET_PROGRAMS_PAGE_DATA = gql`
  query GetProgramsPageData($first: Int = 100) {
    schools(first: $first) {
      edges {
        node {
          id
          name
          description
        }
      }
    }
    programs(first: $first) {
      edges {
        node {
          id
          title
          shortDescription
          school {
            id
            name
          }
        }
      }
    }
  }
`;

export const GET_PROGRAM_DETAILS = gql`
  query GetProgramDetails($id: ID!) {
    program(id: $id) {
      id
      code
      title
      level
      durationValue
      durationUnit
      shortDescription
      longDescription
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
      }
      school {
        id
        name
      }
    }
  }
`;

export const GET_PROGRAM_OPTIONS = gql`
  query GetProgramOptions($first: Int = 100) {
    programs(first: $first) {
      edges {
        node {
          id
          title
        }
      }
    }
  }
`;