export interface TermsSection {
    id: string;
    title: string;
    paragraphs: string[];
    bullets?: string[];
}

export interface TermsOfServiceData {
    title: string;
    lastUpdated: string;
    effectiveDate: string;
    introduction: string;
    sections: TermsSection[];
}

export const TERMS_OF_SERVICE_DATA: TermsOfServiceData = {
    title: 'Terms of Service',
    lastUpdated: 'August 1, 2026',
    effectiveDate: 'August 1, 2026',
    introduction:
        'Welcome to our official institutional website and online portal. By accessing or using our website, applicant portal, student portal, or associated services, you agree to comply with and be bound by the following Terms of Service. Please read these terms carefully before proceeding.',
    sections: [
        {
            id: 'acceptance-of-terms',
            title: '1. Acceptance of Terms',
            paragraphs: [
                'By accessing, browsing, or creating an account on this portal, you acknowledge that you have read, understood, and agreed to these Terms of Service, as well as all applicable institutional policies, academic regulations, and guidelines.',
                'If you do not agree to these terms, you must immediately discontinue your use of our digital platforms and services.'
            ]
        },
        {
            id: 'eligibility-account-registration',
            title: '2. Account Registration and Security',
            paragraphs: [
                'Certain features of our portal—including application submission, course enrollment, grade access, and fee management—require you to register for an account.',
                'When creating an account, you agree to:'
            ],
            bullets: [
                'Provide accurate, current, and complete personal and academic information.',
                'Maintain and promptly update your profile information to keep it true and complete.',
                'Maintain the confidentiality of your login credentials, including passwords and authentication tokens.',
                'Notify the Information Technology department immediately of any unauthorized account access or security breaches.'
            ]
        },
        {
            id: 'application-submission-document-authenticity',
            title: '3. Application Submission and Document Authenticity',
            paragraphs: [
                'Applicants submitting documents through the online portal (such as identification cards, passports, examination certificates, and academic transcripts) certify that all uploaded files are genuine, unaltered, and legally belonging to the applicant.',
                'Providing fraudulent information, forged documentation, or false identity records will result in immediate disqualification of your application, revocation of any conditional or full admission offer, and possible legal referral.'
            ]
        },
        {
            id: 'acceptable-use-conduct',
            title: '4. Acceptable Use and Portal Conduct',
            paragraphs: [
                'You agree to use our website and portals solely for lawful academic, administrative, and educational purposes. You are strictly prohibited from:'
            ],
            bullets: [
                'Attempting to gain unauthorized access to administrative databases, other users’ accounts, or server infrastructure.',
                'Uploading or transmitting viruses, malware, or malicious code designed to disrupt platform integrity.',
                'Using automated tools, scrapers, or bots to harvest data or user information from the portal.',
                'Engaging in harassment, offensive communication, or academic dishonesty via institutional forums, messaging, or submission channels.'
            ]
        },
        {
            id: 'intellectual-property',
            title: '5. Intellectual Property Rights',
            paragraphs: [
                'All content on this platform—including website design, logos, trademarks, text, graphics, course syllabi, lecture materials, software code, and downloadable forms—is the property of the institution or its licensors and is protected by applicable intellectual property laws.',
                'Users are granted a limited, non-exclusive, non-transferable license to access and view content strictly for personal, non-commercial educational use.'
            ]
        },
        {
            id: 'institutional-communications',
            title: '6. Electronic Communications',
            paragraphs: [
                'By registering an account or applying for admission, you consent to receive official communications electronically via your registered email address or direct portal notifications.',
                'Notices sent electronically satisfy all legal requirements that such communications be provided in written form. Students and applicants are responsible for regularly checking their registered email and portal inbox.'
            ]
        },
        {
            id: 'service-availability-updates',
            title: '7. Service Availability and Maintenance',
            paragraphs: [
                'While we strive to ensure continuous service availability, digital portals may occasionally be unavailable due to scheduled maintenance, upgrades, or unexpected system outages.',
                'The institution reserves the right to modify, suspend, or discontinue any aspect of the portal or website at any time without prior notice.'
            ]
        },
        {
            id: 'limitation-of-liability',
            title: '8. Limitation of Liability and Disclaimers',
            paragraphs: [
                'The portal and its content are provided on an "as is" and "as available" basis without warranties of any kind, whether express or implied.',
                'To the fullest extent permitted by law, the institution shall not be liable for any direct, indirect, incidental, or consequential damages resulting from portal downtime, loss of data, unauthorized access to user transmissions, or reliance on information published on the website.'
            ]
        },
        {
            id: 'termination-of-access',
            title: '9. Account Suspension and Termination',
            paragraphs: [
                'The institution reserves the right to suspend or terminate account access at its sole discretion, without prior notice, in the event of policy violations, academic misconduct, non-payment of required fees, or security risks.'
            ]
        },
        {
            id: 'governing-law',
            title: '10. Governing Law and Jurisdiction',
            paragraphs: [
                'These Terms of Service shall be governed by and construed in accordance with the national and local laws applicable to the institution’s primary operational location, without regard to conflict of law principles.'
            ]
        },
        {
            id: 'amendments',
            title: '11. Changes to Terms of Service',
            paragraphs: [
                'We reserve the right to update or modify these Terms of Service at any time. Updated terms will take effect immediately upon publication on this page, indicated by the updated "Last Updated" date.',
                'Your continued use of the platform after updates are published constitutes your acceptance of the revised terms.'
            ]
        },
        {
            id: 'contact-information',
            title: '12. Contact Information',
            paragraphs: [
                'If you have questions, concerns, or inquiries regarding these Terms of Service or portal administrative policies, please reach out to our legal and administrative team:'
            ]
        }
    ]
};