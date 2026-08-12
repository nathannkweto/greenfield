export interface PendingFee {
    id: string;
    title: string;
    amount: number;
    dueDate: string;
    type: string;
}

export interface PaymentRecord {
    id: string;
    date: string;
    amount: number;
    method: string;
    status: string;
    receipt: string;
}

export interface FeesProfile {
    totalDue: number;
    currency: string;
    pendingFees: PendingFee[];
    history: PaymentRecord[];
}

export const FEES_DATA: FeesProfile = {
    totalDue: 4500.00,
    currency: 'ZMW',
    pendingFees: [
        { id: 'f1', title: 'Fall Semester Tuition', amount: 4000.00, dueDate: '2026-08-01', type: 'Tuition' },
        { id: 'f2', title: 'Library Late Fee', amount: 50.00, dueDate: '2026-06-30', type: 'Penalty' },
        { id: 'f3', title: 'Lab Equipment Fee', amount: 450.00, dueDate: '2026-08-01', type: 'Lab' }
    ],
    history: [
        { id: 'h1', date: '2026-01-15', amount: 4500.00, method: 'Credit Card', status: 'Paid', receipt: 'RC-99281' },
        { id: 'h2', date: '2025-08-10', amount: 4200.00, method: 'Bank Transfer', status: 'Paid', receipt: 'RC-88372' }
    ]
};