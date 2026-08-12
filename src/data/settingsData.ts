// ============================================================================
// TYPES
// ============================================================================
export interface UserProfile {
    firstName: string;
    lastName: string;
    preferredName: string;
    studentId: string;
    email: string;
    phone: string;
    pronouns: string;
    bio: string;
    avatarUrl: string;
}

export interface NotificationPrefs {
    emailGrades: boolean;
    smsGrades: boolean;
    emailAnnouncements: boolean;
    smsAlerts: boolean;
    emailBilling: boolean;
}

export interface SecurityPrefs {
    twoFactorEnabled: boolean;
    directoryVisibility: boolean;
}

// ============================================================================
// MOCK DATA
// ============================================================================
export const MOCK_PROFILE: UserProfile = {
    firstName: 'Alex',
    lastName: 'Morgan',
    preferredName: 'Alex',
    studentId: 'STU-99281',
    email: 'alex.morgan@college.edu',
    phone: '+1 (555) 019-2834',
    pronouns: 'They/Them',
    bio: 'Computer Science major. Passionate about AI and accessible design.',
    avatarUrl: '' // Leave empty to show initials fallback
};

export const MOCK_NOTIFICATIONS: NotificationPrefs = {
    emailGrades: true,
    smsGrades: false,
    emailAnnouncements: true,
    smsAlerts: true,
    emailBilling: true,
};

export const MOCK_SECURITY: SecurityPrefs = {
    twoFactorEnabled: false,
    directoryVisibility: true,
};