import { formatCurrency } from '../utils/currency'

function TransactionCard({ currency, transaction, onDelete }) {
  const isIncome = transaction.type === 'income'
  const amountPrefix = isIncome ? '+' : '-'

  return (
    <article className="transaction-card">
      <div>
        <h3>{transaction.title}</h3>
        <p>
          {transaction.category} - {transaction.date}
        </p>
      </div>

      <strong className={isIncome ? 'income-text' : 'expense-text'}>
        {amountPrefix}
        {formatCurrency(transaction.amount, currency)}
      </strong>

      <button
        type="button"
        className="delete-button"
        onClick={() => onDelete(transaction.id)}
      >
        Hapus
      </button>
    </article>
  )
}

export default TransactionCard
