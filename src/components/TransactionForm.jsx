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
    { value: 'Gaji', label: 'Gaji' },
    { value: 'Uang Saku', label: 'Uang Saku' },
    { value: 'Bonus', label: 'Bonus' },
    { value: 'Freelance', label: 'Freelance' },
    { value: 'Makanan', label: 'Makanan' },
    { value: 'Transportasi', label: 'Transportasi' },
    { value: 'Belanja', label: 'Belanja' },
    { value: 'Pendidikan', label: 'Pendidikan' },
    { value: 'Kesehatan', label: 'Kesehatan' },
    { value: 'Hiburan', label: 'Hiburan' },
    { value: 'Tagihan', label: 'Tagihan' },
    { value: 'Tabungan', label: 'Tabungan' },
    { value: 'Hadiah', label: 'Hadiah' },
    { value: 'Lainnya', label: 'Lainnya' },
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
                    Deskripsi
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Contoh: Belanja mingguan"
                    />
                </label>

                <label>
                    Jumlah
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
                    Jenis Transaksi
                    <div className="type-toggle">
                        <button
                            type="button"
                            className={formData.type === 'income' ? 'active' : ''}
                            onClick={() => handleTypeChange('income')}
                        >
                            Pemasukan
                        </button>

                        <button
                            type="button"
                            className={formData.type === 'expense' ? 'active' : ''}
                            onClick={() => handleTypeChange('expense')}
                        >
                            Pengeluaran
                        </button>
                    </div>
                </div>

                <label>
                    Kategori
                    <input
                        list="category-options"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="Cari kategori"
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
                    Tanggal
                    <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                    />
                </label>
            </div>

            {errors && <p className="form-error">{errors}</p>}

            <button type="submit">Simpan Transaksi</button>
        </form>
    )
}

export default TransactionForm
