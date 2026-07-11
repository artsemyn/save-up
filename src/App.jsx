import { useState, useEffect } from 'react'
import { Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import SummaryCard from './components/SummaryCard'
import TransactionList from './components/TransactionList'
import TransactionForm from './components/TransactionForm'
import SavingGoal from './components/SavingGoal'
import ProfileSettings from './components/ProfileSettings'
import { dummyTransactions } from './data/dummyTransactions'
import { getSummary } from './utils/calculations'
import { formatCurrency } from './utils/currency'
import './App.css'

const STORAGE_KEY = {
  transactions: 'saveup_transactions',
  savingGoal: 'saveup_saving_goal',
  profile: 'saveup_profile',
}

function readStorage(key, fallbackValue) {
  try {
    const storedValue = localStorage.getItem(key)

    if (storedValue === null) {
      return fallbackValue
    }

    return JSON.parse(storedValue)
  } catch (error) {
    console.error(`Error reading from storage for key "${key}":`, error)
    return fallbackValue
  }
}

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState(() =>
    readStorage(STORAGE_KEY.transactions, dummyTransactions)
  )
  const [filterType, setFilterType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [savingGoal, setSavingGoal] = useState(() =>
    readStorage(STORAGE_KEY.savingGoal, {
      target: 1000000,
      current: 0,
    })
  )
  const [profile, setProfile] = useState(() =>
    readStorage(STORAGE_KEY.profile, {
      userName: 'Kal',
      photo: '',
    })
  )


  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY.transactions,
      JSON.stringify(transactions),
    )
  }, [transactions])

  useEffect(()=> {
    localStorage.setItem(
      STORAGE_KEY.savingGoal,
      JSON.stringify(savingGoal),
    )
  }, [savingGoal])
  
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY.profile,
      JSON.stringify(profile),
    )
  }, [profile])

  const summary = getSummary(transactions)
  const filteredTransactions =
    transactions.filter((transaction) => {
      const matchesType =
        filterType === 'all' ? true : transaction.type === filterType
      const searchableText = [
        transaction.title,
        transaction.category,
        transaction.amount,
        transaction.date,
      ]
        .join(' ')
        .toLowerCase()
      const matchesSearch = searchableText.includes(searchQuery.toLowerCase())

      return matchesType && matchesSearch
    })
  const savingProgress = 
    savingGoal.target > 0
      ? Math.min((savingGoal.current / savingGoal.target) * 100, 100)
      : 0

  function handleAddTransaction(newTransaction) {
    setTransactions((currentTransactions) => [{
      ...newTransaction,
      id: crypto.randomUUID(),
    },
      ...currentTransactions,
    ])
  }

  function handleDeleteTransaction(transactionId) {
    setTransactions((currentTransactions) =>
      currentTransactions.filter((transaction) => transaction.id !== transactionId)
    )
  }

  function handleGoalChange(nextGoal) {
    setSavingGoal(nextGoal)
  }

  function handleProfileChange(nextProfile) {
    setProfile(nextProfile)
  }

  const pageContent = {
    '/': {
      title: 'Dashboard',
      description: 'See your balance, income, expense, and saving progress.',
    },
    '/add': {
      title: 'Add Transaction',
      description: 'Record a new expense or income stream.',
    },
    '/transactions': {
      title: 'Transactions',
      description: 'Manage your daily expenses and income streams.',
    },
    '/profile': {
      title: 'Profile Settings',
      description: 'Update your profile photo and display name.',
    },
  }
  const currentPage = pageContent[location.pathname] ?? pageContent['/']

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>Save Up</h1>

        <nav className="sidebar-nav" aria-label="Main navigation">
          <NavLink to="/">
            Dashboard
          </NavLink>
          <NavLink to="/add">
            Add Transaction
          </NavLink>
          <NavLink to="/transactions">
            Transactions
          </NavLink>
          <NavLink to="/profile">
            Profile
          </NavLink>
        </nav>

        <div className="sidebar-profile">
          <div className="avatar">
            {profile.photo ? (
              <img src={profile.photo} alt={profile.userName || 'Profile'} />
            ) : (
              profile.userName.slice(0, 1)
            )}
          </div>
          <div>
            <strong>{profile.userName || 'User'}</strong>
            <span>Premium Plan</span>
          </div>
        </div>

        <div className="sidebar-links">
          <a href="#help">Help Center</a>
          <a href="#logout">Log Out</a>
        </div>
      </aside>

      <main className="app" id="transactions">
        <header className="app-header">
          <div>
            <h1>{currentPage.title}</h1>
            <p>{currentPage.description}</p>
          </div>

          <div className="header-actions">
            <button type="button" className="secondary-action">
              Advanced Filters
            </button>
            <button
              type="button"
              className="primary-action"
              onClick={() => navigate('/add')}
            >
              Quick Add
            </button>
          </div>
        </header>

        <Routes>
          <Route
            path="/"
            element={
              <section className="page-stack">
                <div className="summary-grid">
                  <SummaryCard
                    label="Balance"
                    value={formatCurrency(summary.balance)}
                    description="Current total"
                    type="balance"
                  />
                  <SummaryCard
                    label="Income"
                    value={formatCurrency(summary.income)}
                    description="Money in"
                    type="income"
                  />
                  <SummaryCard
                    label="Expense"
                    value={formatCurrency(summary.expense)}
                    description="Money out"
                    type="expense"
                  />
                </div>

                <div className="dashboard-grid">
                  <SavingGoal
                    savingGoal={savingGoal}
                    savingProgress={savingProgress}
                    onGoalChange={handleGoalChange}
                  />

                  <section className="sources-card">
                    <div className="card-heading-row">
                      <h2>Sources</h2>
                      <button type="button">View All</button>
                    </div>

                    <div className="wallet-card active">
                      <div>
                        <strong>Main Checking</strong>
                        <span>Active - **** 8821</span>
                      </div>
                      <b>{formatCurrency(summary.balance)}</b>
                    </div>

                    <div className="wallet-card">
                      <div>
                        <strong>Saving Goal</strong>
                        <span>{Math.round(savingProgress)}% completed</span>
                      </div>
                      <b>{formatCurrency(savingGoal.current)}</b>
                    </div>
                  </section>
                </div>

                <section className="main-panel">
                  <div className="transaction-section-heading">Recent Transactions</div>
                  <TransactionList
                    transactions={transactions.slice(0, 3)}
                    onDeleteTransaction={handleDeleteTransaction}
                  />
                </section>
              </section>
            }
          />

          <Route
            path="/add"
            element={
              <section className="page-narrow">
                <section className="transaction-form-card">
                  <h2>Quick Entry</h2>
                  <TransactionForm onAddTransaction={handleAddTransaction} />
                </section>
              </section>
            }
          />

          <Route
            path="/transactions"
            element={
              <section className="main-panel">
                <div className="search-filter-card">
                  <label className="search-box">
                    <span>Search</span>
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Search transactions by merchant, category, or amount..."
                    />
                  </label>

                  <div className="filter-tabs">
                    <button
                      type="button"
                      className={filterType === 'all' ? 'active' : ''}
                      onClick={() => setFilterType('all')}
                    >
                      All
                    </button>

                    <button
                      type="button"
                      className={filterType === 'expense' ? 'active' : ''}
                      onClick={() => setFilterType('expense')}
                    >
                      Expenses
                    </button>

                    <button
                      type="button"
                      className={filterType === 'income' ? 'active' : ''}
                      onClick={() => setFilterType('income')}
                    >
                      Income
                    </button>
                  </div>
                </div>

                <div className="transaction-section-heading">Today</div>
                <TransactionList
                  transactions={filteredTransactions}
                  onDeleteTransaction={handleDeleteTransaction}
                />
              </section>
            }
          />

          <Route
            path="/profile"
            element={
              <section className="page-narrow">
                <ProfileSettings
                  profile={profile}
                  onProfileChange={handleProfileChange}
                />
              </section>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
