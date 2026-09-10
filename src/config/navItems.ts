import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    School as SchoolIcon,
    Business as BusinessIcon,
    Description as DescriptionIcon, QuestionMark, AdminPanelSettings
} from '@mui/icons-material';
import { type SvgIconComponent } from '@mui/icons-material';

export interface NavItem {
    name: string;
    path: string;
    icon: SvgIconComponent;
    children?: NavItem[];
}

export const adminNavItems: NavItem[] = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: DashboardIcon },
    { name: 'Management', path: '/admin/management', icon: BusinessIcon },
    { name: 'Students', path: '/admin/students', icon: PeopleIcon },
    /* {
        name: 'Finance',
        path: '/admin/finance',
        icon: Payments,
        children: [
            { name: 'Overview', path: '/admin/finance', icon: DashboardIcon },
            { name: 'Fee Packages', path: '/admin/finance/fees', icon: Receipt },
            { name: 'Fee Payments', path: '/admin/finance/payments', icon: ReceiptLong },
            { name: 'Accounting', path: '/admin/finance/accounting', icon: AccountBalance },
        ],
    }, */
    { name: 'Administrators', path: '/admin/administrators', icon: AdminPanelSettings },
];

export const lecturerNavItems: NavItem[] = [
    { name: 'Dashboard', path: '/lecturer/dashboard', icon: DashboardIcon },
];

export const studentNavItems: NavItem[] = [
    { name: 'Dashboard', path: '/student/dashboard', icon: DashboardIcon },
    { name: 'Academics', path: '/student/academics', icon: SchoolIcon },
    // { name: 'Exams', path: '/student/exams', icon: AssignmentIcon },
    // { name: 'Fees', path: '/student/fees', icon: AccountBalanceWalletIcon },
    // { name: 'Settings', path: '/student/settings', icon: SettingsIcon },
];

export const applicantNavItems: NavItem[] = [
    { name: 'Dashboard', path: '/applicant/dashboard', icon: DashboardIcon },
    { name: 'My Application', path: '/applicant/application', icon: DescriptionIcon },
    { name: 'Info', path: '/applicant/info', icon: QuestionMark },
];