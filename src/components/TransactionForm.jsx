import { useState } from 'react'
import { formatNumberInput, parseNumberInput } from '../utils/currency'

const InitialFormData = {
    title: '',
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().slice(0, 10),
}

const categories = [
    { value: 'salary', label: 'Gaji' },
    { value: 'allowance', label: 'Uang Saku' },
    { value: 'bonus', label: 'Bonus' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'food', label: 'Makanan' },
    { value: 'transportation', label: 'Transportasi' },
    { value: 'shopping', label: 'Belanja' },
    { value: 'education', label: 'Pendidikan' },
    { value: 'health', label: 'Kesehatan' },
    { value: 'entertainment', label: 'Hiburan' },
    { value: 'bills', label: 'Tagihan' },
    { value: 'saving', label: 'Tabungan' },
    { value: 'gift', label: 'Hadiah' },
    { value: 'other', label: 'Lainnya' },
]

function TransactionForm({ onAddTransaction}) {
    const [formData, setFormData] = useState(InitialFormData)
    const [errors, setErrors] = useState('')

    function handleChange(event) {
        const { name, value } = event.target

        setFormData((currentData) => ({
            ...currentData,
            [name]: name === 'amount' ? parseNumberInput(value) : value,
        }))
    }

    function handleTypeChange(type) {
        setFormData((currentData) => ({
            ...currentData,
            type,
        }))
    }

    function handleSubmit(event) {
        event.preventDefault()

        if (formData.title.trim() === '') {
            setErrors('Nama transaksi harus diisi')
            return
        }

        if (formData.amount === '' || Number(formData.amount) <= 0) {
            setErrors('Jumlah transaksi harus diisi')
            return
        }

        if (formData.category.trim() === '') {
            setErrors('Kategori transaksi harus diisi')
            return
        }

        if (formData.date === '') {
            setErrors('Tanggal transaksi harus diisi')
            return
        }

        onAddTransaction({
            ...formData,
            amount: Number(formData.amount),
        })

        setFormData(InitialFormData)
        setErrors('')
    }

    return (
        <form className="transaction-form" onSubmit={handleSubmit}>
            <div className="form-grid">
                <label>
                    Description
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Weekly Groceries"
                    />
                </label>

                <label>
                    Amount
                    <input
                        type="text"
                        inputMode="numeric"
                        name="amount"
                        value={formData.amount ? formatNumberInput(formData.amount) : ''}
                        onChange={handleChange}
                        placeholder="0"
                    />
                </label>

                <div className="type-field">
                    Money Type
                    <div className="type-toggle">
                        <button
                            type="button"
                            className={formData.type === 'income' ? 'active' : ''}
                            onClick={() => handleTypeChange('income')}
                        >
                            Income
                        </button>

                        <button
                            type="button"
                            className={formData.type === 'expense' ? 'active' : ''}
                            onClick={() => handleTypeChange('expense')}
                        >
                            Expense
                        </button>
                    </div>
                </div>

                <label>
                    Category
                    <input
                        list="category-options"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="Search category"
                    />
                    <datalist id="category-options">
                        {categories.map((category) => (
                            <option key={category.value} value={category.value}>
                                {category.label}
                            </option>
                        ))}
                    </datalist>
                </label>

                <label>
                    Date
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                    />
                </label>
            </div>

            {errors && <p className="form-error">{errors}</p>}

            <button type="submit">Record Transaction</button>
        </form>
    )
}

export default TransactionForm
