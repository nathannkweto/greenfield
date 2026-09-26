export const formatCurrency = (amount: number, currency: 'ZMW' | 'USD'): string => {
    return new Intl.NumberFormat('en-ZM', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
    }).format(amount);
};

export const formatFrequency = (freq: string): string => {
    return freq ? freq.replace(/_/g, ' ') : '';
};