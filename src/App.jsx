import { useState, useEffect } from 'react'
import { Navigate, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined'
import DashboardIcon from '@mui/icons-material/Dashboard'
import HelpOutlinedIcon from '@mui/icons-material/HelpOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import MenuIcon from '@mui/icons-material/Menu'
import PersonIcon from '@mui/icons-material/Person'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
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

const navItems = [
  { label: 'Beranda', to: '/', icon: <DashboardIcon /> },
  { label: 'Tambah Transaksi', to: '/add', icon: <AddCircleOutlinedIcon /> },
  { label: 'Transaksi', to: '/transactions', icon: <ReceiptLongIcon /> },
  { label: 'Profil', to: '/profile', icon: <PersonIcon /> },
]

const supportItems = [
  { label: 'Pusat Bantuan', href: '#help', icon: <HelpOutlinedIcon /> },
  { label: 'Keluar', href: '#logout', icon: <LogoutIcon /> },
]

const transactionCategories = [
  'Gaji',
  'Uang Saku',
  'Bonus',
  'Freelance',
  'Makanan',
  'Transportasi',
  'Belanja',
  'Pendidikan',
  'Kesehatan',
  'Hiburan',
  'Tagihan',
  'Tabungan',
  'Hadiah',
  'Lainnya',
]

const initialAdvancedFilters = {
  category: 'all',
  startDate: '',
  endDate: '',
  minAmount: '',
  maxAmount: '',
}

function readStorage(key, fallbackValue) {
  try {
    const storedValue = localStorage.getItem(key)

    if (storedValue === null) {
      return fallbackValue
    }

    return JSON.parse(storedValue)
  } catch (error) {
    console.error(`Gagal membaca data lokal untuk key "${key}":`, error)
    return fallbackValue
  }
}

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [transactions, setTransactions] = useState(() =>
    readStorage(STORAGE_KEY.transactions, dummyTransactions)
  )
  const [filterType, setFilterType] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false)
  const [advancedFilters, setAdvancedFilters] = useState(initialAdvancedFilters)
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
      const matchesCategory =
        advancedFilters.category === 'all' ||
        transaction.category === advancedFilters.category
      const matchesStartDate =
        !advancedFilters.startDate || transaction.date >= advancedFilters.startDate
      const matchesEndDate =
        !advancedFilters.endDate || transaction.date <= advancedFilters.endDate
      const matchesMinAmount =
        advancedFilters.minAmount === '' ||
        transaction.amount >= Number(advancedFilters.minAmount)
      const matchesMaxAmount =
        advancedFilters.maxAmount === '' ||
        transaction.amount <= Number(advancedFilters.maxAmount)

      return (
        matchesType &&
        matchesSearch &&
        matchesCategory &&
        matchesStartDate &&
        matchesEndDate &&
        matchesMinAmount &&
        matchesMaxAmount
      )
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

  function handleAdvancedFilterChange(event) {
    const { name, value } = event.target

    setAdvancedFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }))
  }

  function resetAdvancedFilters() {
    setAdvancedFilters(initialAdvancedFilters)
    setFilterType('all')
    setSearchQuery('')
  }

  function toggleAdvancedFilters() {
    if (location.pathname !== '/transactions') {
      navigate('/transactions')
    }

    setAdvancedFiltersOpen((isOpen) => !isOpen)
  }

  const pageContent = {
    '/': {
      title: 'Beranda',
      description: 'Lihat saldo, pemasukan, pengeluaran, dan progres tabunganmu.',
    },
    '/add': {
      title: 'Tambah Transaksi',
      description: 'Catat pemasukan atau pengeluaran baru.',
    },
    '/transactions': {
      title: 'Transaksi',
      description: 'Kelola pemasukan dan pengeluaran harianmu.',
    },
    '/profile': {
      title: 'Pengaturan Profil',
      description: 'Perbarui foto profil dan nama tampilanmu.',
    },
  }
  const currentPage = pageContent[location.pathname] ?? pageContent['/']

  const toggleDrawer = (newOpen) => () => {
    setDrawerOpen(newOpen)
  }

  const drawerList = (
    <Box
      className="mobile-drawer"
      role="presentation"
      onClick={toggleDrawer(false)}
      sx={{ width: 280 }}
    >
      <div className="mobile-drawer-brand">
        <div className="brand-lockup brand-lockup-drawer">
          <img src="/logo.svg" alt="" />
          <h2>Save Up</h2>
        </div>
        <span>Pencatat keuangan</span>
      </div>

      <List>
        {navItems.map((item) => (
          <ListItem key={item.to} disablePadding>
            <ListItemButton
              component={NavLink}
              to={item.to}
              sx={{
                mx: 1,
                borderRadius: 2,
                color: 'var(--muted)',
                '&.active': {
                  backgroundColor: 'var(--secondary-soft)',
                  color: 'var(--secondary-text)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 42, color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <List>
        {supportItems.map((item) => (
          <ListItem key={item.href} disablePadding>
            <ListItemButton
              component="a"
              href={item.href}
              sx={{
                mx: 1,
                borderRadius: 2,
                color: 'var(--muted)',
              }}
            >
              <ListItemIcon sx={{ minWidth: 42, color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <img src="/logo.svg" alt="Logo Save Up" />
          <h1>Save Up</h1>
        </div>

        <nav className="sidebar-nav" aria-label="Navigasi utama">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to}>
              <span className="nav-icon" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-profile">
          <div className="avatar">
            {profile.photo ? (
              <img src={profile.photo} alt={profile.userName || 'Profil'} />
            ) : (
              profile.userName.slice(0, 1)
            )}
          </div>
          <div>
            <strong>{profile.userName || 'Pengguna'}</strong>
            <span>Paket Premium</span>
          </div>
        </div>

        <div className="sidebar-links">
          {supportItems.map((item) => (
            <a key={item.href} href={item.href}>
              <span className="nav-icon" aria-hidden="true">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </div>
      </aside>

      <main className="app" id="transactions">
        <header className="app-header">
          <Button
            className="drawer-open-button"
            variant="outlined"
            startIcon={<MenuIcon />}
            onClick={toggleDrawer(true)}
          >
            Menu
          </Button>

          <div>
            <h1>{currentPage.title}</h1>
            <p>{currentPage.description}</p>
          </div>

          <div className="header-actions">
            <button
              type="button"
              className={`secondary-action ${advancedFiltersOpen ? 'is-active' : ''}`}
              onClick={toggleAdvancedFilters}
            >
              Filter Lanjutan
            </button>
            <button
              type="button"
              className="primary-action"
              onClick={() => navigate('/add')}
            >
              Tambah Cepat
            </button>
          </div>
        </header>

        <Drawer open={drawerOpen} onClose={toggleDrawer(false)}>
          {drawerList}
        </Drawer>

        {advancedFiltersOpen && location.pathname === '/transactions' && (
          <section className="advanced-filter-panel" aria-label="Filter lanjutan">
            <div className="advanced-filter-heading">
              <div>
                <h2>Filter Lanjutan</h2>
                <p>Saring transaksi berdasarkan kategori, tanggal, dan nominal.</p>
              </div>
              <button
                type="button"
                className="filter-reset-button"
                onClick={resetAdvancedFilters}
              >
                Reset Filter
              </button>
            </div>

            <div className="advanced-filter-grid">
              <label>
                Kategori
                <select
                  name="category"
                  value={advancedFilters.category}
                  onChange={handleAdvancedFilterChange}
                >
                  <option value="all">Semua kategori</option>
                  {transactionCategories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </label>

              <label>
                Tanggal mulai
                <input
                  type="date"
                  name="startDate"
                  value={advancedFilters.startDate}
                  onChange={handleAdvancedFilterChange}
                />
              </label>

              <label>
                Tanggal sampai
                <input
                  type="date"
                  name="endDate"
                  value={advancedFilters.endDate}
                  onChange={handleAdvancedFilterChange}
                />
              </label>

              <label>
                Nominal minimum
                <input
                  type="number"
                  min="0"
                  name="minAmount"
                  value={advancedFilters.minAmount}
                  onChange={handleAdvancedFilterChange}
                  placeholder="Rp 0"
                />
              </label>

              <label>
                Nominal maksimum
                <input
                  type="number"
                  min="0"
                  name="maxAmount"
                  value={advancedFilters.maxAmount}
                  onChange={handleAdvancedFilterChange}
                  placeholder="Tanpa batas"
                />
              </label>
            </div>
          </section>
        )}

        <Routes>
          <Route
            path="/"
            element={
              <section className="page-stack">
                <div className="summary-grid">
                  <SummaryCard
                    label="Saldo"
                    value={formatCurrency(summary.balance)}
                    description="Total saat ini"
                    type="balance"
                  />
                  <SummaryCard
                    label="Pemasukan"
                    value={formatCurrency(summary.income)}
                    description="Uang masuk"
                    type="income"
                  />
                  <SummaryCard
                    label="Pengeluaran"
                    value={formatCurrency(summary.expense)}
                    description="Uang keluar"
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
                      <h2>Sumber Dana</h2>
                      <button type="button">Lihat Semua</button>
                    </div>

                    <div className="wallet-card active">
                      <div>
                        <strong>Rekening Utama</strong>
                        <span>Aktif - **** 8821</span>
                      </div>
                      <b>{formatCurrency(summary.balance)}</b>
                    </div>

                    <div className="wallet-card">
                      <div>
                        <strong>Target Tabungan</strong>
                        <span>{Math.round(savingProgress)}% tercapai</span>
                      </div>
                      <b>{formatCurrency(savingGoal.current)}</b>
                    </div>
                  </section>
                </div>

                <section className="main-panel">
                  <div className="transaction-section-heading">Transaksi Terbaru</div>
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
              <section className="page-wide">
                <section className="transaction-form-card add-form-card">
                  <h2>Input Cepat</h2>
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
                    <span>Cari</span>
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      placeholder="Cari transaksi berdasarkan nama, kategori, atau jumlah..."
                    />
                  </label>

                  <div className="filter-tabs">
                    <button
                      type="button"
                      className={filterType === 'all' ? 'active' : ''}
                      onClick={() => setFilterType('all')}
                    >
                      Semua
                    </button>

                    <button
                      type="button"
                      className={filterType === 'expense' ? 'active' : ''}
                      onClick={() => setFilterType('expense')}
                    >
                      Pengeluaran
                    </button>

                    <button
                      type="button"
                      className={filterType === 'income' ? 'active' : ''}
                      onClick={() => setFilterType('income')}
                    >
                      Pemasukan
                    </button>
                  </div>
                </div>

                <div className="transaction-section-heading">Hari Ini</div>
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
