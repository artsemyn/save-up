export function formatCurrency(value) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(Number(value) || 0)
}

export function formatNumberInput(value) {
    const numericValue = String(value).replace(/\D/g, '')

    return new Intl.NumberFormat('id-ID').format(Number(numericValue) || 0)
}

export function parseNumberInput(value) {
    return String(value).replace(/\D/g, '')
}
