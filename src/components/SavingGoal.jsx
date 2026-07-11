import { formatCurrency, formatNumberInput, parseNumberInput } from '../utils/currency'

function SavingGoal({ savingGoal, savingProgress, onGoalChange }) {
  function handleChange(event) {
    const { name, value } = event.target
    const numericValue = parseNumberInput(value)

    onGoalChange({
      ...savingGoal,
      [name]: numericValue === '' ? '' : Number(numericValue),
    })
  }

  return (
    <article className="saving-goal">
      <div className="saving-goal-header">
        <div>
          <h3>Target Tabungan</h3>
          <p>
            {formatCurrency(savingGoal.current)} dari{' '}
            {formatCurrency(savingGoal.target)}
          </p>
        </div>

        <strong>{Math.round(savingProgress)}%</strong>
      </div>

      <div className="progress-track" aria-label="Progress target tabungan">
        <div
          className="progress-fill"
          style={{ width: `${savingProgress}%` }}
        />
      </div>

      <div className="saving-inputs">
        <label>
          Target
          <input
            type="text"
            inputMode="numeric"
            name="target"
            value={savingGoal.target === '' ? '' : formatNumberInput(savingGoal.target)}
            onChange={handleChange}
            placeholder="0"
          />
        </label>

        <label>
          Terkumpul
          <input
            type="text"
            inputMode="numeric"
            name="current"
            value={savingGoal.current === '' ? '' : formatNumberInput(savingGoal.current)}
            onChange={handleChange}
            placeholder="0"
          />
        </label>
      </div>
    </article>
  )
}

export default SavingGoal
