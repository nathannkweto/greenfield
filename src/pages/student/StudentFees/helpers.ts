import type {StudentFee, LedgerTransaction, FinancialSummary} from './types';

/**
 * Calculates financial totals and payment completion percentage.
 */
export function calculateFinancialSummary(studentFees: StudentFee[] = []): FinancialSummary {
    let totalBilledZmw = 0;
    let totalPaidZmw = 0;

    studentFees.forEach((sf) => {
        totalBilledZmw += sf.amountZmw || 0;
        const paid = sf.fee_payments?.reduce((acc, p) => acc + (p.amount || 0), 0) || 0;
        totalPaidZmw += paid;
    });

    const outstandingZmw = Math.max(0, totalBilledZmw - totalPaidZmw);
    const paymentPercentage =
        totalBilledZmw > 0 ? Math.min(100, Math.round((totalPaidZmw / totalBilledZmw) * 100)) : 100;

    return {
        totalBilledZmw,
        totalPaidZmw,
        outstandingZmw,
        paymentPercentage,
    };
}

/**
 * Normalizes billed fees and payments into a unified chronological ledger (Latest First).
 */
export function buildChronologicalLedger(studentFees: StudentFee[] = []): LedgerTransaction[] {
    const transactions: LedgerTransaction[] = [];

    studentFees.forEach((fee) => {
        const totalPaidForFee = fee.fee_payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
        let feeStatus: 'PAID' | 'PARTIAL' | 'UNPAID' = 'UNPAID';
        if (totalPaidForFee >= fee.amountZmw) {
            feeStatus = 'PAID';
        } else if (totalPaidForFee > 0) {
            feeStatus = 'PARTIAL';
        }

        // Add Charge / Billed Fee entry
        transactions.push({
            id: `charge-${fee.id}`,
            type: 'CHARGE',
            title: fee.fee.title,
            subtitle: fee.fee.frequency ? `Billing Frequency: ${fee.fee.frequency}` : 'Tuition & Fees',
            amount: fee.amountZmw,
            date: fee.createdAt,
            status: feeStatus,
            feeId: fee.id,
            rawFee: fee,
        });

        // Add individual payment records for this fee via payment.transaction
        fee.fee_payments?.forEach((payment) => {
            const tx = payment.transaction;
            transactions.push({
                id: `payment-${payment.id}`,
                type: 'PAYMENT',
                title: `Payment Received — ${fee.fee.title}`,
                subtitle: tx?.paymentMethod ? `Via ${tx.paymentMethod}` : 'Online Payment',
                amount: payment.amount,
                date: payment.createdAt || tx?.createdAt,
                reference: tx?.referenceNumber,
                receiptNumber: tx?.manualReceiptNumber || tx?.gatewayReference,
                paymentMethod: tx?.paymentMethod,
                feeId: fee.id,
                rawFee: fee,
                rawPayment: payment,
            });
        });
    });

    // Sort strictly descending (Latest Date First)
    return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Currency Formatter.
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-ZM', {
        style: 'currency',
        currency: 'ZMW',
        minimumFractionDigits: 2,
    }).format(amount);
}

/**
 * Date and Time Formatter.
 */
export function formatDateTime(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}