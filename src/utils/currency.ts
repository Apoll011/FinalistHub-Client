export const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-PT', {
        style: 'currency',
        currency: 'CVE'
    }).format(amount);
};
