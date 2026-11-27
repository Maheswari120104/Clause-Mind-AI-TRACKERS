import './App.css'

const summary = [
  { label: 'Total Obligations', value: 45 },
  { label: 'Reviewed', value: 38, tone: 'ok' },
  { label: 'Pending Review', value: 7, tone: 'warn' },
  { label: 'Open Gaps', value: 5, tone: 'warn' },
  { label: 'Overdue Actions', value: 2, tone: 'danger' },
]

const obligations = [
  { id: 1, name: 'Access Review', owner: 'Security', status: 'Approved' },
  { id: 2, name: 'Vendor Audit', owner: 'Risk Team', status: 'Pending' },
  { id: 3, name: 'Encryption at Rest', owner: 'Infra Team', status: 'Complete' },
  { id: 4, name: 'Data Retention Review', owner: 'Compliance', status: 'Approved' },
  { id: 5, name: 'Vendor Privacy Assessment', owner: 'Risk Team', status: 'Overdue' },
  { id: 6, name: 'Quarterly Privilege Review', owner: 'IT Security', status: 'Pending' },
]

function statusClass(status) {
  return status.toLowerCase()
}

export default function App() {
  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-name">Clause Mind AI</div>
          <div className="brand-tag">AI Compliance Copilot</div>
        </div>
        <nav className="nav-pills" aria-label="Sections">
          <span className="active">Dashboard</span>
          <span>Obligations</span>
          <span>Gaps</span>
          <span>Review</span>
          <span>Audit Trail</span>
        </nav>
      </header>

      <section className="hero-line">
        <h1>Compliance overview</h1>
        <p>
          Track regulatory obligations from RBI, SEBI, IRDAI, and DPDP —
          mapped to internal policies, gaps, and remediation actions.
        </p>
      </section>

      <section className="stats" aria-label="Summary metrics">
        {summary.map((item) => (
          <article key={item.label} className={`stat ${item.tone || ''}`}>
            <span className="stat-label">{item.label}</span>
            <span className="stat-value">{item.value}</span>
          </article>
        ))}
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Obligations</h2>
          <span>Mock data for demo scaffold</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Obligation</th>
                <th>Owner</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {obligations.map((row) => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td className="owner">{row.owner}</td>
                  <td>
                    <span className={`badge ${statusClass(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
