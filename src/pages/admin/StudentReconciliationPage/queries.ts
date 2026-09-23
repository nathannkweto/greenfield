// queries.ts
import {gql} from "@apollo/client";

export const GET_RECONCILIATION_DATA = gql`
    query GetReconciliationData($programId: ID!) {
        program(id: $programId) {
            id
            code
            title
            curricula {
                id
                year
                course {
                    id
                    code
                    title
                    credits
                }
            }
            students {
                id
                status          # <--- Request student status
                studentNumber
                firstName
                middleNames
                lastName
                email
                studyMode
                intake
                admissionDate
                cgpa
                creditsCompleted
                academicProgress {
                    current_year
                    credits_earned
                    cgpa
                }
                studentFees {
                    id
                    amountZmw
                    amountUsd
                    fee_payments {
                        id
                        amount
                    }
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
                        maxScore
                        weightPercentage
                        curriculum {
                            id
                            course {
                                id
                                code
                                title
                            }
                        }
                    }
                }
            }
        }
    }
`;