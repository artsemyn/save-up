export function formatCurrency(value, currency = 'IDR') {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency,
    }).format(Number(value) || 0)
}