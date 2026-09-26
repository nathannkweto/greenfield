import { gql } from "@apollo/client";

export const GET_ACADEMIC_CALENDAR = gql`
    query GetAcademicCalendar {
        academicYears {
            id
            year
            startDate
            endDate
            academic_terms {
                id
                academicYearId
                term
                startDate
                endDate
            }
            academic_events {
                id
                academicYearId
                title
                startDate
                endDate
            }
        }
    }
`;