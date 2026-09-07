export interface BankDetail {
    bankName: string;
    accountName: string;
    accountNumber: string;
    currency: string;
    branch: string;
    swiftCode?: string;
}

export interface TermsSection {
    id: string;
    title: string;
    paragraphs: string[];
    bullets?: string[];
}

export interface InfoPageData {
    title: string;
    lastUpdated: string;
    effectiveDate: string;
    introduction: string;
    sections: TermsSection[];
}

export const COLLEGE_INFO = {
    name: "Greenfield College",
    tagline: "Passion for innovations.",
    logo: "/logo.jpg",
    address: "Plot 28459 Njanji Street, Chibombo, Zambia",
    phone: "+260 969 854 890 | +260 777 728 382",
    email: "greenfieldcollege02@gmail.com",
    socialMedia: {
        facebook: "https://www.facebook.com/share/1BiR7qd72G",
        twitter: "#",
        linkedin: "https://linkedin.com/company/greenfield-college-zambia"
    },
    officeHours: "Monday - Friday: 8:00 AM - 5:00 PM",
    bankDetails: [
        {
            bankName: "Zambia National Commercial Bank (Zanaco)",
            accountName: "Greenfield College",
            accountNumber: "5970973500135",
            currency: "Kwacha (ZMW)",
            branch: "Northmead Branch",
            swiftCode: "ZNCOZMLUXXX"
        }
    ] as BankDetail[]
};

export const APPLICANT_INFO_DATA: InfoPageData = {
    title: 'Applicant Information & Guidelines',
    lastUpdated: 'September 5, 2026',
    effectiveDate: 'September 1, 2026',
    introduction:
        'Welcome to Greenfield College. This guide outlines crucial information for all prospective and admitted students regarding admissions, document verification, payment policies, and institutional procedures.',
    sections: [
        {
            id: 'admissions-process',
            title: '1. Application & Admissions Guidelines',
            paragraphs: [
                'Applications submitted to Greenfield College are processed by the admissions committee upon receipt of all required supporting documentation.',
                'Please keep the following guidelines in mind throughout your application process:'
            ],
            bullets: [
                'All uploaded academic transcripts and identity documents must be clear, unaltered, and legible.',
                'Applications submitted without a valid bank deposit slip will remain on hold until payment verification is completed.',
                'In-person physical verification of original certificates will be conducted during final registration on campus.'
            ]
        },
        {
            id: 'fee-payment-policy',
            title: '2. Fee Payment & Banking Instructions',
            paragraphs: [
                'All institutional payments (application fees, tuition fees, and registration costs) must be deposited directly into official college bank accounts listed on this page.',
                'When making bank deposits or electronic transfers, adhere strictly to the following instructions:'
            ],
            bullets: [
                'Always write your full legal name and NRC/Passport number as the payment reference or transaction narration.',
                'Retain the physical bank deposit slip or digital transfer confirmation for upload and physical verification.',
                'Cash payments are strictly prohibited at administrative offices.'
            ]
        },
        {
            id: 'verification-authenticity',
            title: '3. Document Verification & Authenticity',
            paragraphs: [
                'Greenfield College enforces a zero-tolerance policy regarding fraudulent documentation or false declarations.',
                'Any applicant discovered to have submitted forged examination certificates, fraudulent bank deposit slips, or altered personal identity details will face immediate disqualification, revocation of admission, and potential legal referral.'
            ]
        },
        {
            id: 'communications-and-updates',
            title: '4. Electronic Communications',
            paragraphs: [
                'Official notices, offer letters, and status changes are communicated via your applicant dashboard and registered email address.',
                'Applicants are responsible for checking their dashboard and email inbox regularly to avoid missing key deadlines.'
            ]
        }
    ]
};