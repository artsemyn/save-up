import TransactionCard from './TransactionCard'

function TransactionList({ transactions, onDeleteTransaction }) {
    if (transactions.length === 0) {
        return (
            <div className="empty-state">
                <h3>Tidak ada transaksi</h3>
                <p>Tambahkan transaksi baru untuk melihatnya di sini.</p>
            </div>
        )
    }

    return (
        <div className="transaction-list">
            {transactions.map((transaction) => (
                <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                    onDelete={onDeleteTransaction}
                />
            ))}
        </div>
    )
}

export default TransactionList
