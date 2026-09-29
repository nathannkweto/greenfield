import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    School as SchoolIcon,
    Business as BusinessIcon,
    Description as DescriptionIcon, QuestionMark, AdminPanelSettings,
    Payments, AccountBalance, Receipt, FactCheck, HistoryEdu
} from '@mui/icons-material';
import { type SvgIconComponent } from '@mui/icons-material';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

export interface NavItem {
    name: string;
    path: string;
    icon: SvgIconComponent;
    children?: NavItem[];
}

export const adminNavItems: NavItem[] = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: DashboardIcon },
    { name: 'Calendar', path: '/admin/calendar', icon: CalendarTodayIcon },
    { name: 'Management', path: '/admin/management', icon: BusinessIcon },
    { name: 'Students', path: '/admin/students', icon: PeopleIcon },
     {
        name: 'Finance',
        path: '/admin/finance',
        icon: Payments,
        children: [
            { name: 'Overview', path: '/admin/finance', icon: DashboardIcon },
            { name: 'Fee Packages', path: '/admin/finance/fees', icon: Receipt },
            // { name: 'Fee Payments', path: '/admin/finance/payments', icon: ReceiptLong },
            { name: 'Accounting', path: '/admin/finance/accounting', icon: AccountBalance },
        ],
    },
    { name: 'Administrators', path: '/admin/administrators', icon: AdminPanelSettings },
];

export const lecturerNavItems: NavItem[] = [
    { name: 'Dashboard', path: '/lecturer/dashboard', icon: DashboardIcon },
];

export const studentNavItems: NavItem[] = [
    { name: 'Dashboard', path: '/student/dashboard', icon: DashboardIcon },
    {
        name: 'Academics',
        path: '/student/academics',
        icon: SchoolIcon,
        children: [
            { name: 'Progress', path: '/student/academics', icon: TrendingUpIcon },
            { name: 'Results', path: '/student/academics/results', icon: FactCheck },
            { name: 'History', path: '/student/academics/history', icon: HistoryEdu },
        ],
    },
    { name: 'Fees', path: '/student/fees', icon: AccountBalanceWalletIcon },
    { name: 'My Info', path: '/student/info', icon: QuestionMark },
];

export const applicantNavItems: NavItem[] = [
    { name: 'Dashboard', path: '/applicant/dashboard', icon: DashboardIcon },
    { name: 'My Application', path: '/applicant/application', icon: DescriptionIcon },
    { name: 'Info', path: '/applicant/info', icon: QuestionMark },
];