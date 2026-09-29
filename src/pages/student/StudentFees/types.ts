export interface FeeItem {
    id: string;
    title: string;
    frequency?: string;
}

export interface TransactionRecord {
    id: string;
    referenceNumber: string;
    gatewayReference?: string;
    paymentMethod: string;
    manualReceiptNumber?: string;
    createdAt: string;
}

export interface FeePayment {
    id: string;
    amount: number;
    transaction: TransactionRecord;
    createdAt: string;
}

export interface StudentFee {
    id: string;
    amountZmw: number;
    amountUsd?: number;
    createdAt: string;
    fee: FeeItem;
    fee_payments: FeePayment[];
}

export interface Student {
    id: string;
    studentNumber?: string;
    firstName: string;
    lastName: string;
    program: {
        id: string;
        title: string;
        code: string;
    };
    studentFees: StudentFee[];
}

export interface GetStudentFeesResponse {
    me: {
        id: string;
        email: string;
        students: Student[];
    } | null;
}

export type TransactionType = 'CHARGE' | 'PAYMENT';

export interface LedgerTransaction {
    id: string;
    type: TransactionType;
    title: string;
    subtitle?: string;
    amount: number;
    date: string;
    reference?: string;
    receiptNumber?: string;
    feeId?: string;
    paymentMethod?: string;
    status?: 'PAID' | 'PARTIAL' | 'UNPAID';
    rawFee?: StudentFee;
    rawPayment?: FeePayment;
}

export interface FinancialSummary {
    totalBilledZmw: number;
    totalPaidZmw: number;
    outstandingZmw: number;
    paymentPercentage: number;
}