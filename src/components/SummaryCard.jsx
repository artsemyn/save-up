function SummaryCard({ label, value, description, type }) {
    return (
        <article className={`summary-card ${type}`}>
            <span>{label}</span>
            <strong>{value}</strong>
            <p>{description}</p>
        </article>
    )
}

export default SummaryCard