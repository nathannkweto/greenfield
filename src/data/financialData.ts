export type PaymentMethod = 'Credit Card' | 'Bank Transfer' | 'Cash' | 'Scholarship';
export type PaymentStatus = 'Completed' | 'Pending' | 'Failed';

export interface Transaction {
    id: string;
    studentId: string;
    studentName: string;
    amount: number;
    currency: string;
    date: string;
    method: PaymentMethod;
    status: PaymentStatus;
    reference: string;
}

export interface OutstandingBalance {
    studentId: string;
    studentName: string;
    program: string;
    amountDue: number;
    dueDate: string;
    currency: string;
}

// High-level summary metrics
export const FINANCIAL_SUMMARY = {
    totalCollected: 1250000,
    totalOutstanding: 345000,
    activeScholarships: 85000,
    currency: 'ZMW'
};

// Mock Recent Transactions
export const MOCK_TRANSACTIONS: Transaction[] = [
    {
        id: 'TXN-001', studentId: 'STU-2026-001', studentName: 'Elena Rostova',
        amount: 5000, currency: 'ZMW', date: '2026-06-19',
        method: 'Bank Transfer', status: 'Completed', reference: 'REF-88392'
    },
    {
        id: 'TXN-002', studentId: 'STU-2026-088', studentName: 'James Holden',
        amount: 2500, currency: 'ZMW', date: '2026-06-18',
        method: 'Credit Card', status: 'Completed', reference: 'CC-99201'
    },
    {
        id: 'TXN-003', studentId: 'STU-2026-042', studentName: 'Marcus Chen',
        amount: 1500, currency: 'ZMW', date: '2026-06-18',
        method: 'Credit Card', status: 'Failed', reference: 'CC-99205'
    }
];

// Mock Outstanding Balances
export const MOCK_BALANCES: OutstandingBalance[] = [
    {
        studentId: 'STU-2026-105', studentName: 'Amos Burton', program: 'BSc Mechanical Engineering',
        amountDue: 4500, dueDate: '2026-07-01', currency: 'ZMW'
    },
    {
        studentId: 'STU-2026-001', studentName: 'Elena Rostova', program: 'BSc Software Engineering',
        amountDue: 5000, dueDate: '2026-08-15', currency: 'ZMW'
    }
];