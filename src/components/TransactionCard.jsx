import { formatCurrency } from '../utils/currency'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'

function TransactionCard({ transaction, onDelete }) {
  const isIncome = transaction.type === 'income'
  const amountPrefix = isIncome ? '+' : '-'
  const TransactionTypeIcon = isIncome ? ArrowUpwardIcon : ArrowDownwardIcon

  return (
    <article className="transaction-card">
      <div className={`transaction-type-icon ${isIncome ? 'income-icon' : 'expense-icon'}`} aria-hidden="true">
        <TransactionTypeIcon />
      </div>
      <div>
        <h3>{transaction.title}</h3>
        <p>
          {transaction.category} - {transaction.date}
        </p>
      </div>

      <strong className={isIncome ? 'income-text' : 'expense-text'}>
        {amountPrefix}
        {formatCurrency(transaction.amount)}
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
