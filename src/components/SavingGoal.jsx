import { formatCurrency } from '../utils/currency'

function SavingGoal({ savingGoal, savingProgress, onGoalChange }) {
  function handleChange(event) {
    const { name, value } = event.target

    onGoalChange({
      ...savingGoal,
      [name]: Number(value),
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
            type="number"
            name="target"
            min="0"
            value={savingGoal.target}
            onChange={handleChange}
          />
        </label>

        <label>
          Terkumpul
          <input
            type="number"
            name="current"
            min="0"
            value={savingGoal.current}
            onChange={handleChange}
          />
        </label>
      </div>
    </article>
  )
}

export default SavingGoal
