export interface DashboardStats {
    totalStudents: number;
    totalLecturers: number;
    activeCourses: number;
    pendingApplications: number;
}

export interface RecentActivity {
    id: string;
    type: 'alert' | 'application' | 'finance' | 'system';
    message: string;
    time: string;
    isUnread: boolean;
}

export interface AdminDashboardProfile {
    adminName: string;
    stats: DashboardStats;
    recentActivities: RecentActivity[];
    financials: {
        collectedFees: number;
        outstandingFees: number;
        currency: string;
    };
}

export const ADMIN_DASHBOARD_DATA: AdminDashboardProfile = {
    adminName: 'Principal Administrator',
    stats: {
        totalStudents: 1245,
        totalLecturers: 84,
        activeCourses: 112,
        pendingApplications: 28
    },
    financials: {
        collectedFees: 4500000,
        outstandingFees: 320000,
        currency: 'ZMW'
    },
    recentActivities: [
        { id: 'a1', type: 'application', message: 'New student application received: John Doe', time: '10 mins ago', isUnread: true },
        { id: 'a2', type: 'finance', message: 'Large fee payment cleared (RC-99281)', time: '1 hour ago', isUnread: true },
        { id: 'a3', type: 'alert', message: 'Lecturer Dr. Smith reported a system issue', time: '2 hours ago', isUnread: false },
        { id: 'a4', type: 'system', message: 'Automated database backup completed successfully', time: '5 hours ago', isUnread: false },
    ]
};