import { gql } from '@apollo/client';
export const ANNOUNCEMENT_FRAGMENT = gql`
 fragment AnnouncementFields on Announcement { id title content type targetLevel targetId targetName author authorUser { id } attachment { id
          originalName
          mimeType
          size
          url
          collection
          createdAt } createdAt updatedAt }
`;
export const GET_ANNOUNCEMENTS_LIST = gql`
 query GetAnnouncementsList($type: AnnouncementType, $targetLevel: TargetLevel, $first: Int!) { announcements(type: $type, targetLevel: $targetLevel, first: $first) { edges { node { ...AnnouncementFields } } pageInfo { hasNextPage endCursor } } }
 ${ANNOUNCEMENT_FRAGMENT}
`;
export const GET_ANNOUNCEMENT_TARGET_OPTIONS = gql`
 query GetAnnouncementTargetOptions { schools(first: 100) { edges { node { id name } } } programs(first: 100) { edges { node { id title school { id name } } } } }
`;
