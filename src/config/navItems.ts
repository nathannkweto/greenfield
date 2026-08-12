import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    School as SchoolIcon,
    Settings as SettingsIcon,
    Assignment as AssignmentIcon,
    AccountBalanceWallet as AccountBalanceWalletIcon,
    Campaign as CampaignIcon,
    Business as BusinessIcon,
    Payments as PaymentsIcon
} from '@mui/icons-material';
import { type SvgIconComponent } from '@mui/icons-material';

export interface NavItem {
    name: string;
    path: string;
    icon: SvgIconComponent;
}

export const adminNavItems: NavItem[] = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: DashboardIcon },
    { name: 'Students', path: '/admin/students', icon: PeopleIcon },
    { name: 'Communication', path: '/admin/announcements', icon: CampaignIcon },
    { name: 'Management', path: '/admin/management', icon: BusinessIcon },
    { name: 'Finance', path: '/admin/finance', icon: PaymentsIcon },
];

export const lecturerNavItems: NavItem[] = [
    { name: 'Dashboard', path: '/lecturer/dashboard', icon: DashboardIcon },
    { name: 'Settings', path: '/lecturer/settings', icon: SettingsIcon },
];

export const studentNavItems: NavItem[] = [
    { name: 'Dashboard', path: '/student/dashboard', icon: DashboardIcon },
    { name: 'Academics', path: '/student/academics', icon: SchoolIcon },
    { name: 'Exams', path: '/student/exams', icon: AssignmentIcon },
    { name: 'Fees', path: '/student/fees', icon: AccountBalanceWalletIcon },
    { name: 'Settings', path: '/student/settings', icon: SettingsIcon },
];