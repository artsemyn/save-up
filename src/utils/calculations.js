export function getTotalByType(transactions, type) {
    return transactions
        .filter((transaction) => transaction.type ===type)
        .reduce((total, transaction) => total + Number(transaction.amount), 0)
}

export function getSummary(transactions) {
    const income = getTotalByType(transactions, 'income')
    const expense = getTotalByType(transactions, 'expense')

    return { 
        income, 
        expense, 
        balance: income-expense,
    }
}