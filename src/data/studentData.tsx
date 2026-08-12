import SchoolIcon from '@mui/icons-material/School';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import TimelineIcon from '@mui/icons-material/Timeline';

export const STUDENT_INFO = {
    firstName: 'Alex',
    lastName: 'Chen',
    id: 'STD-2409-8831',
    program: 'B.Sc. Computer Science',
    year: 'Year 3',
    term: 'Fall 2026',
    initials: 'AC'
};

export const STATS = [
    { title: 'Registered Courses', value: '5', icon: <MenuBookIcon />, color: '#1976d2', bgColor: 'rgba(25, 118, 210, 0.1)' },
    { title: 'Outstanding Fees', value: 'K450.00', icon: <AccountBalanceWalletIcon />, color: '#d32f2f', bgColor: 'rgba(211, 47, 47, 0.1)' },
    { title: 'Current CGPA', value: '3.84', icon: <TimelineIcon />, color: '#2e7d32', bgColor: 'rgba(46, 125, 50, 0.1)' },
    { title: 'Academic Status', value: 'Good', icon: <SchoolIcon />, color: '#9c27b0', bgColor: 'rgba(156, 39, 176, 0.1)' }
];

export const SCHEDULE = [
    { time: '09:00 AM', course: 'CSC301: Data Structures', room: 'Building A, Room 402' },
    { time: '11:30 AM', course: 'MAT210: Linear Algebra', room: 'Science Center, Hall B' },
    { time: '02:00 PM', course: 'ENG105: Technical Writing', room: 'Library Annex, Room 11' }
];

export const ANNOUNCEMENTS = [
    { title: 'Spring 2027 Registration', date: 'Oct 15, 2026', urgent: true },
    { title: 'Library Hours Extension', date: 'Oct 12, 2026', urgent: false },
];