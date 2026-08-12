export interface CourseYear {
    year: number;
    terms: Record<string, string[]>;
}

export interface Program {
    id: string;
    title: string;
    schoolId: string;
    duration: string;
    shortDescription: string;
    longDescription: string;
    qualification: string;
    requirements: string[];
    curriculum: CourseYear[];
}

export const PROGRAMS: Program[] = [
    // ================= SCHOOL OF AGRICULTURE =================
    {
        id: 'bsc-agric',
        title: 'B.Sc. in Agricultural Science',
        schoolId: 'agric',
        duration: '4 Years',
        shortDescription: 'Learn sustainable farming techniques, soil science, and modern crop production.',
        longDescription: 'The B.Sc. in Agricultural Science equips students with the scientific knowledge and practical skills required to address global food security challenges, focusing on sustainable agriculture and animal husbandry.',
        qualification: 'Bachelor of Science in Agricultural Science',
        requirements: ['Grade 12 Certificate with credit in Biology, Chemistry, and Math.', 'Pass in university entrance exam.'],
        curriculum: [
            {
                year: 1,
                terms: {
                    'Term 1': ['Intro to Agriculture', 'General Biology'],
                    'Term 2': ['Soil Science Basics', 'Agricultural Chemistry'],
                    'Term 3': ['Farm Practices', 'Mathematics for Ag Science']
                }
            },
            {
                year: 2,
                terms: {
                    'Term 1': ['Crop Production', 'Genetics & Breeding'],
                    'Term 2': ['Animal Husbandry', 'Agricultural Economics'],
                    'Term 3': ['Pest & Disease Management', 'Rural Sociology']
                }
            },
        ]
    },
    {
        id: 'dip-agribus',
        title: 'Diploma in Agribusiness Management',
        schoolId: 'agric',
        duration: '2 Years',
        shortDescription: 'Master the business side of farming, including supply chains and farm economics.',
        longDescription: 'This program bridges the gap between agriculture and business, preparing students to manage farms, agricultural supply chains, and agribusiness enterprises profitably and sustainably.',
        qualification: 'Diploma in Agribusiness Management',
        requirements: ['Grade 12 Certificate with credit in Math and English.', 'Interest in entrepreneurship and farming.'],
        curriculum: [
            {
                year: 1,
                terms: {
                    'Term 1': ['Intro to Agribusiness', 'Microeconomics'],
                    'Term 2': ['Farm Management', 'Financial Accounting'],
                    'Term 3': ['Agricultural Marketing', 'Business Law']
                }
            },
            {
                year: 2,
                terms: {
                    'Term 1': ['Supply Chain Management', 'Agricultural Finance'],
                    'Term 2': ['Risk Management in Ag', 'International Trade'],
                    'Term 3': ['Capstone Project', 'Industry Internship']
                }
            },
        ]
    },

    // ================= SCHOOL OF BUSINESS =================
    {
        id: 'bba-bus',
        title: 'Bachelor of Business Administration',
        schoolId: 'bus',
        duration: '4 Years',
        shortDescription: 'Develop strategic leadership, marketing, and organizational management skills.',
        longDescription: 'The BBA program is designed to develop visionary business leaders. It covers foundational and advanced topics in management, marketing, HR, and business strategy to prepare graduates for a global economy.',
        qualification: 'Bachelor of Business Administration (BBA)',
        requirements: ['Grade 12 Certificate with credit in Math and English.'],
        curriculum: [
            {
                year: 1,
                terms: {
                    'Term 1': ['Principles of Management', 'Microeconomics'],
                    'Term 2': ['Business Communication', 'Macroeconomics'],
                    'Term 3': ['Financial Accounting', 'Business Mathematics']
                }
            },
            {
                year: 2,
                terms: {
                    'Term 1': ['Marketing Management', 'Organizational Behavior'],
                    'Term 2': ['Human Resource Management', 'Business Law'],
                    'Term 3': ['Operations Management', 'Business Ethics']
                }
            },
        ]
    },
    {
        id: 'bsc-acc-fin',
        title: 'B.Sc. in Accounting and Finance',
        schoolId: 'bus',
        duration: '4 Years',
        shortDescription: 'Gain expertise in corporate finance, auditing, taxation, and financial reporting.',
        longDescription: 'This degree provides a rigorous foundation in quantitative financial analysis, corporate accounting, and modern financial markets, preparing students for professional accounting certifications.',
        qualification: 'Bachelor of Science in Accounting and Finance',
        requirements: ['Grade 12 Certificate with strong credits in Math and Accounting/Commerce.'],
        curriculum: [
            {
                year: 1,
                terms: {
                    'Term 1': ['Intro to Accounting', 'Microeconomics'],
                    'Term 2': ['Cost Accounting', 'Macroeconomics'],
                    'Term 3': ['Quantitative Methods', 'IT for Business']
                }
            },
            {
                year: 2,
                terms: {
                    'Term 1': ['Corporate Finance', 'Fundamentals of Auditing'],
                    'Term 2': ['Taxation Principles', 'Financial Reporting I'],
                    'Term 3': ['Investment Analysis', 'Professional Ethics']
                }
            },
        ]
    },

    // ================= SCHOOL OF EDUCATION =================
    {
        id: 'bed-ece',
        title: 'B.Ed. in Early Childhood Education',
        schoolId: 'edu',
        duration: '4 Years',
        shortDescription: 'Learn pedagogical strategies to shape the minds of young learners effectively.',
        longDescription: 'This program focuses on the cognitive, social, and physical development of children from birth to age 8. It equips future educators with play-based learning techniques and foundational instructional skills.',
        qualification: 'Bachelor of Education in Early Childhood',
        requirements: ['Grade 12 Certificate with credit in English and any Science subject.', 'Background check clearance.'],
        curriculum: [
            {
                year: 1,
                terms: {
                    'Term 1': ['Child Development', 'Educational Psychology'],
                    'Term 2': ['Play-based Learning', 'Sociology of Education'],
                    'Term 3': ['Health, Safety & Nutrition', 'Arts & Crafts for Kids']
                }
            },
            {
                year: 2,
                terms: {
                    'Term 1': ['Language Development', 'Intro to Special Needs'],
                    'Term 2': ['Early Math Concepts', 'Classroom Management'],
                    'Term 3': ['Teaching Practicum I', 'Early Literacy']
                }
            },
        ]
    },
    {
        id: 'bed-sec',
        title: 'B.Ed. in Secondary Education',
        schoolId: 'edu',
        duration: '4 Years',
        shortDescription: 'Prepare to teach high school subjects with advanced curriculum development skills.',
        longDescription: 'Designed for future high school teachers, this program combines advanced subject-matter expertise with modern pedagogical theory, educational technology, and classroom management strategies.',
        qualification: 'Bachelor of Education in Secondary Education',
        requirements: ['Grade 12 Certificate with strong credits in two teaching subjects.'],
        curriculum: [
            {
                year: 1,
                terms: {
                    'Term 1': ['Foundations of Education', 'Subject Major I'],
                    'Term 2': ['Educational Psychology', 'Subject Minor I'],
                    'Term 3': ['Educational Technology', 'Curriculum Development']
                }
            },
            {
                year: 2,
                terms: {
                    'Term 1': ['Teaching Methodologies', 'Subject Major II'],
                    'Term 2': ['Assessment & Evaluation', 'Subject Minor II'],
                    'Term 3': ['Teaching Practicum I', 'Educational Leadership']
                }
            },
        ]
    }
];