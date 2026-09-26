export interface Account {
    id: string;
    accountNumber: string;
    name: string;
    type: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense' | string;
}

export interface Fee {
    id: string;
    title: string;
    amountZmw: number;
    amountUsd?: number | null;
    frequency: string;
    account?: Account | null;
    feeable?: { __typename: string; id?: string } | null;
}

export interface Program {
    id: string;
    code: string;
    title: string;
    level: string;
    fees: Fee[];
}

export interface School {
    id: string;
    name: string;
    description?: string | null;
    fees: Fee[];
    programs: Program[];
}

export interface GetFeeTemplatesData {
    schools?: {
        edges?: Array<{ node: School }>;
    };
    fees?: {
        edges?: Array<{ node: Fee }>;
    };
}

export interface GetAccountsData {
    accounts?: {
        edges?: Array<{ node: Account }>;
    };
}

export interface ToastState {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
}