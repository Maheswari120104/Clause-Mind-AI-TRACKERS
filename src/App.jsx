import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { sampleCirculars, extractedByCircular } from './data/circulars'
import { policyHandbook, controlRegister } from './data/policies'
import { mappingCatalog } from './data/mappings'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '▦' },
  { id: 'documents', label: 'Documents', icon: '▤' },
  { id: 'review', label: 'Review Queue', icon: '☑' },
  { id: 'policies', label: 'Company Policy', icon: '▣' },
  { id: 'assistant', label: 'Policy Assistant', icon: '◈' },
  { id: 'monitor', label: 'Regulator Monitor', icon: '◉' },
  { id: 'audit', label: 'Audit Trail', icon: '◷' },
]

const VIEW_ROUTES = {
  dashboard: '/dashboard',
  documents: '/documents',
  review: '/review-queue',
  policies: '/company-policy',
  assistant: '/policy-assistant',
  monitor: '/regulator-monitor',
  audit: '/audit-trail',
}

const ROUTE_VIEWS = Object.fromEntries(
  Object.entries(VIEW_ROUTES).map(([view, route]) => [route, view]),
)

const INITIAL_OBLIGATIONS = Object.values(extractedByCircular)
  .flat()
  .map((item) => ({ ...item, reviewStatus: 'Pending' }))

const UPLOAD_MOCKS = {
  RBI: [
    {
      clause: '9.2',
      requirement: 'Notify customers of high-risk digital transactions within 10 minutes',
      summary: 'Customers must receive a fraud-risk alert within ten minutes of a high-risk transaction.',
      owner: 'Fraud Risk Team',
      deadline: 'Within 10 minutes',
      policyId: 'POL-ISP',
      policyName: 'Information Security Policy',
      policySection: 'ISP-6.2',
      severity: 'High',
      gap: 'Current monitoring records security events but has no ten-minute customer notification SLA.',
      action: 'Add automated customer alerts for high-risk transactions',
      wording: 'Customers shall be notified within ten minutes when a transaction is classified as high risk by the fraud monitoring system.',
    },
    {
      clause: '12.4',
      requirement: 'Test restoration of critical banking data every six months',
      summary: 'Critical banking data restoration must be tested twice each year.',
      owner: 'Business Continuity Team',
      deadline: 'Every six months',
      policyId: 'POL-DRP',
      policyName: 'Data Retention Policy',
      policySection: 'DRP-3.4',
      severity: 'Medium',
      gap: 'The current policy covers secure disposal but does not define restoration testing.',
      action: 'Create a semi-annual data restoration test',
      wording: 'Restoration of critical banking data shall be tested at least once every six months and evidence shall be retained.',
    },
  ],
  SEBI: [
    {
      clause: '5.6',
      requirement: 'Resolve investor complaints within 21 calendar days',
      summary: 'Investor complaints require tracked resolution within twenty-one calendar days.',
      owner: 'Investor Services Team',
      deadline: 'Within 21 days',
      policyId: 'POL-DRP',
      policyName: 'Data Retention Policy',
      policySection: 'DRP-2.1',
      severity: 'High',
      gap: 'No company policy defines a resolution deadline for investor complaints.',
      action: 'Implement a 21-day investor grievance SLA',
      wording: 'Investor complaints shall be acknowledged, tracked, and resolved within twenty-one calendar days.',
    },
    {
      clause: '8.3',
      requirement: 'Retain algorithmic trading decision logs for five years',
      summary: 'Decision and parameter logs for algorithmic trades must remain available for five years.',
      owner: 'Trading Technology',
      deadline: 'Continuous',
      policyId: 'POL-DRP',
      policyName: 'Data Retention Policy',
      policySection: 'DRP-2.1',
      severity: 'Critical',
      gap: 'The retention schedule does not include algorithmic trading decision logs.',
      action: 'Add five-year retention for algorithmic trading logs',
      wording: 'Algorithmic trading decisions, parameters, and override logs shall be retained for a minimum of five years.',
    },
  ],
  IRDAI: [
    {
      clause: '7.2',
      requirement: 'Encrypt policyholder claims documents in transit',
      summary: 'Claims documents must use approved encryption whenever transferred.',
      owner: 'Claims Technology',
      deadline: 'Immediate',
      policyId: 'POL-ISP',
      policyName: 'Information Security Policy',
      policySection: 'ISP-5.1',
      severity: 'High',
      gap: 'Encryption is stated generally but claims-document transfer is not explicitly covered.',
      action: 'Enforce encrypted claims-document transfers',
      wording: 'All policyholder claims documents shall be encrypted in transit using approved cryptographic protocols.',
    },
    {
      clause: '10.1',
      requirement: 'Conduct an annual cyber incident simulation for claims systems',
      summary: 'Claims teams and technology owners must complete one cyber simulation each year.',
      owner: 'CISO Office',
      deadline: 'Annually',
      policyId: 'POL-ISP',
      policyName: 'Information Security Policy',
      policySection: 'ISP-6.2',
      severity: 'Medium',
      gap: 'No annual incident simulation is defined for claims systems.',
      action: 'Schedule an annual claims-system cyber exercise',
      wording: 'A cyber incident simulation covering claims systems shall be conducted annually with findings tracked to closure.',
    },
  ],
  DPDP: [
    {
      clause: '6.3',
      requirement: 'Provide a simple mechanism to withdraw consent',
      summary: 'Data principals must be able to withdraw consent as easily as they gave it.',
      owner: 'Data Protection Officer',
      deadline: 'Immediate',
      policyId: 'POL-PRV',
      policyName: 'Privacy Policy',
      policySection: 'PRV-2.1',
      severity: 'High',
      gap: 'Purpose limitation exists, but no consent-withdrawal mechanism is defined.',
      action: 'Add self-service consent withdrawal',
      wording: 'Data principals shall be provided a simple mechanism to withdraw consent as easily as consent was provided.',
    },
  ],
}

function nowStamp() {
  return new Date().toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function circularById(id) {
  return sampleCirculars.find((item) => item.id === id)
}

function circularForFinding(finding) {
  return finding.circular || circularById(finding.circularId)
}

function regulatorForFinding(finding) {
  return circularForFinding(finding)?.regulator
}

function sourceClause(obligation) {
  return circularForFinding(obligation)?.clauses.find(
    (clause) => clause.id === obligation.sourceClause,
  )
}

function policySection(mapping) {
  if (!mapping) return null
  const policy = policyHandbook.policies.find((item) => item.id === mapping.policyId)
  const section = policy?.sections.find((item) => item.id === mapping.policySection)
  return { policy, section }
}

function Badge({ children, tone }) {
  return <span className={`badge ${tone || ''}`}>{children}</span>
}

function FindingDetail({
  finding,
  editMode,
  editDraft,
  setEditDraft,
  onEdit,
  onDecision,
}) {
  if (!finding) {
    return <div className="empty-state">Select a finding to review.</div>
  }

  const circular = circularForFinding(finding)
  const clause = sourceClause(finding)
  const mapping = finding.map
  const companyPolicy = policySection(mapping)
  const status = finding.reviewStatus
  const proposedWording =
    finding.policyText || mapping?.suggestedPolicyUpdate

  return (
    <div className="finding-workspace">
      <header className="finding-heading">
        <div>
          <div className="eyebrow">{circular?.regulator} · {circular?.published}</div>
          <h1>{finding.obligation}</h1>
          <p>{circular?.title}</p>
        </div>
        <Badge tone={status.toLowerCase()}>{status}</Badge>
      </header>

      <div className="comparison-grid">
        <section className="compare-card evidence-card">
          <div className="compare-title">
            <span className="compare-icon blue">⚖</span>
            <h2>Regulatory evidence</h2>
          </div>
          <InfoLabel label="Regulator">{circular?.regulator}</InfoLabel>
          <InfoLabel label="Circular">{circular?.title}</InfoLabel>
          <InfoLabel label="Clause">Clause {finding.sourceClause}</InfoLabel>
          <div className="field-label">Exact requirement</div>
          <blockquote className="quote">{clause?.text}</blockquote>
          <div className="verified">✓ Citation verified</div>
        </section>

        <section className="compare-card coverage-card">
          <div className="compare-title">
            <span className="compare-icon orange">▣</span>
            <h2>Company policy coverage</h2>
          </div>
          <div className="field-label">Coverage assessment</div>
          <Badge tone={mapping?.coverage?.toLowerCase()}>{mapping?.coverage}</Badge>
          <InfoLabel label="Matched policy">
            {companyPolicy?.policy?.name || 'No policy matched'}
          </InfoLabel>
          <InfoLabel label="Policy section">
            {mapping?.policySection || 'Not available'}
          </InfoLabel>
          <div className="field-label">Current policy wording</div>
          <div className="policy-quote">
            {companyPolicy?.section?.text || 'No matching company policy wording was found.'}
          </div>
          <div className="field-label">Existing control</div>
          <div className="control-chip">
            {mapping?.controlId
              ? `${mapping.controlId} · ${mapping.controlName}`
              : 'No matching control'}
          </div>
        </section>

        <section className="compare-card ai-card">
          <div className="compare-title">
            <span className="compare-icon red">✦</span>
            <h2>AI finding & action</h2>
          </div>
          <div className="field-label">Plain-language obligation</div>
          <p className="plain-text">{finding.plainSummary}</p>
          <div className="field-label">Identified gap</div>
          <div className="gap-box">{mapping?.gapReason || 'No compliance gap identified.'}</div>
          <div className="split-meta">
            <div>
              <div className="field-label">Severity</div>
              <Badge tone={(mapping?.severity || 'covered').toLowerCase()}>
                {mapping?.severity || 'No gap'}
              </Badge>
            </div>
            <div>
              <div className="field-label">Confidence</div>
              <span className="confidence">{finding.confidence}%</span>
            </div>
          </div>
          <div className="field-label">Suggested action</div>
          <p className="plain-text">
            {mapping?.action?.title || 'Retain the existing control and monitor for changes.'}
          </p>
          {(proposedWording || editMode) && (
            <>
              <div className="field-label">Proposed policy wording</div>
              {editMode ? (
                <textarea
                  className="policy-edit-box"
                  value={editDraft}
                  onChange={(event) => setEditDraft(event.target.value)}
                  aria-label="Edit proposed company policy wording"
                />
              ) : (
                <div className="proposal">{proposedWording}</div>
              )}
            </>
          )}
          <div className="owner-line">
            <span><b>Owner</b><br />{mapping?.action?.owner || finding.owner}</span>
            <span><b>Target</b><br />{mapping?.action ? `${mapping.action.dueDays} days` : 'Monitor'}</span>
          </div>
        </section>
      </div>

      <footer className="review-bar">
        <span className="review-note">
          {status === 'Pending' ? 'Compliance officer decision required' : `Decision: ${status}`}
        </span>
        {status === 'Pending' && (
          <div className="review-actions">
            <button className="btn reject" type="button" onClick={() => onDecision('Rejected')}>
              Reject
            </button>
            <button className="btn edit" type="button" onClick={onEdit}>
              {editMode ? 'Save & approve' : 'Edit'}
            </button>
            <button className="btn approve" type="button" onClick={() => onDecision('Approved')}>
              Approve
            </button>
          </div>
        )}
      </footer>
    </div>
  )
}

function InfoLabel({ label, children }) {
  return (
    <div className="info-field">
      <div className="field-label">{label}</div>
      <div>{children}</div>
    </div>
  )
}

function LoginPage({ onLogin }) {
  return (
    <div className="login-page">
      <section className="login-visual">
        <img
          src="/login-compliance.svg"
          alt="Compliance professionals reviewing business information"
        />
        <div className="login-visual-overlay" />
        <div className="login-visual-content">
          <div className="login-logo">C</div>
          <div className="login-kicker">ClauseMind AI</div>
          <h1>Regulatory clarity.<br />Confident compliance.</h1>
          <p>
            Compare regulatory obligations with company policies, identify gaps,
            and keep every decision audit-ready.
          </p>
          <div className="login-trust">
            <span>RBI</span><span>SEBI</span><span>IRDAI</span><span>DPDP</span>
          </div>
        </div>
      </section>

      <section className="login-panel">
        <div className="login-form-wrap">
          <div className="login-mobile-brand">ClauseMind AI</div>
          <span className="login-eyebrow">Compliance workspace</span>
          <h2>Welcome back</h2>
          <p className="login-intro">
            Enter any details to explore the demo. No authentication is required.
          </p>
          <form onSubmit={onLogin}>
            <label htmlFor="login-email">Work email</label>
            <input
              id="login-email"
              name="email"
              type="email"
              defaultValue="maverick@clausemind.ai"
              required
            />
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              name="password"
              type="password"
              defaultValue="compliance"
              required
            />
            <button type="submit">Sign in</button>
          </form>

          <div className="about-app">
            <div className="about-copy">
              <span>About this app</span>
              <h3>One view from regulation to remediation</h3>
              <p>
                ClauseMind extracts obligations, compares company controls, drafts
                policy updates, and routes findings for human approval.
              </p>
            </div>
            <div className="about-images">
              <img
                src="/about-team.svg"
                alt="Team collaborating around a table"
              />
              <img
                src="/about-analytics.svg"
                alt="Compliance analytics dashboard"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

const SUGGESTED_POLICY_QUESTIONS = [
  'Can I store customer Aadhaar data in Google Sheets?',
  'How often must privileged access be reviewed?',
  'How long should KYC records be retained?',
  'Can a vendor process customer personal data?',
  'What should I do after a personal-data breach?',
]

function answerPolicyQuestion(question, approvedUpdates) {
  const text = question.trim()
  const greetingPattern =
    /^(hi|hii+|hello|hey|good\s*(morning|afternoon|evening)|namaste)\b[!. ]*$/i

  if (greetingPattern.test(text)) {
    return {
      text: 'Hello! I am the ClauseMind Policy Assistant. Ask me about customer data, access reviews, retention, vendors, consent, or data breaches.',
      source: 'Greeting response · Regex matched',
    }
  }

  if (/\b(aadhaar|pan|customer data|personal data).*(google sheets|spreadsheet|tool)\b/i.test(text)) {
    return {
      text: 'No. Customer identifiers such as Aadhaar or PAN must not be stored in an unapproved spreadsheet or tool. Use an approved system with access controls and encryption.',
      source: 'POL-ISP §4.1 Access Control · POL-ISP §5.1 Cryptography',
    }
  }
  if (/\b(access|privilege|permission).*(review|check|audit|often|frequency)\b/i.test(text)) {
    const approved = approvedUpdates.find((item) => item.sectionId === 'ACP-3.2')
    return {
      text: approved
        ? `The approved policy requires: ${approved.updated}`
        : 'Privileged access must be reviewed periodically. The current control register defines a quarterly review.',
      source: approved ? 'Approved update · POL-ACP §ACP-3.2' : 'POL-ACP §ACP-3.2 · CTRL-101',
    }
  }
  if (/\b(kyc|record|data).*(retain|retention|keep|long)\b/i.test(text)) {
    return {
      text: 'Customer KYC records must be retained for eight years after account closure unless applicable law requires a longer period.',
      source: 'POL-DRP §DRP-2.1 · CTRL-105',
    }
  }
  if (/\b(vendor|third party|processor).*(customer|personal|data|process)\b/i.test(text)) {
    return {
      text: 'A vendor may process customer data only after approved security due diligence, contractual privacy controls, and DPO/Risk approval. Critical vendors require periodic reassessment.',
      source: 'POL-VND §VND-2.3',
    }
  }
  if (/\b(breach|incident|leak|exposure)\b/i.test(text)) {
    const approved = approvedUpdates.find((item) => item.sectionId === 'PRV-2.1')
    return {
      text: approved
        ? `Follow the approved requirement: ${approved.updated}`
        : 'Immediately notify the Security Operations team and Data Protection Officer, preserve evidence, and begin the regulatory notification assessment.',
      source: approved ? 'Approved update · POL-PRV §PRV-2.1' : 'POL-PRV §PRV-2.1 · POL-ISP §ISP-6.2',
    }
  }
  if (/\b(consent|purpose limitation|withdraw)\b/i.test(text)) {
    return {
      text: 'Personal data may be used only for the disclosed purpose. Consent evidence must be verifiable, and withdrawal must be as easy as giving consent.',
      source: 'POL-PRV §PRV-2.1',
    }
  }

  return {
    text: 'I could not find a sufficiently specific answer in the approved policy handbook. Please raise this question with the Compliance Officer rather than relying on an assumption.',
    source: 'No approved policy match',
  }
}

function PolicyAssistant({ approvedUpdates }) {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'bot',
      text: 'Hello! Ask a policy question or choose one of the suggested questions below.',
      source: 'Grounded only in approved company policies',
    },
  ])
  const [question, setQuestion] = useState('')

  const ask = (value) => {
    const prompt = value.trim()
    if (!prompt) return
    const answer = answerPolicyQuestion(prompt, approvedUpdates)
    setMessages((current) => [
      ...current,
      { id: `u-${Date.now()}`, role: 'user', text: prompt },
      { id: `b-${Date.now()}`, role: 'bot', ...answer },
    ])
    setQuestion('')
  }

  return (
    <div className="assistant-layout">
      <section className="assistant-chat panel">
        <div className="assistant-head">
          <div className="bot-avatar">CM</div>
          <div>
            <h2>Employee Policy Assistant</h2>
            <p><span /> Grounded in approved policies</p>
          </div>
          <Badge tone="neutral">Regex greeting enabled</Badge>
        </div>
        <div className="chat-messages">
          {messages.map((message) => (
            <div className={`chat-message ${message.role}`} key={message.id}>
              <div>{message.text}</div>
              {message.source && <small>Source: {message.source}</small>}
            </div>
          ))}
        </div>
        <form
          className="chat-input"
          onSubmit={(event) => {
            event.preventDefault()
            ask(question)
          }}
        >
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask about an approved policy..."
            aria-label="Policy question"
          />
          <button type="submit">Send</button>
        </form>
      </section>
      <aside className="suggested-questions panel">
        <div className="panel-head"><h2>Suggested questions</h2></div>
        <div>
          {SUGGESTED_POLICY_QUESTIONS.map((item) => (
            <button type="button" key={item} onClick={() => ask(item)}>
              <span>?</span>{item}
            </button>
          ))}
        </div>
        <p>Answers are restricted to the approved handbook and approved policy updates.</p>
      </aside>
    </div>
  )
}

function RegulatorMonitor() {
  const [enabled, setEnabled] = useState(true)
  const [checking, setChecking] = useState(false)
  const [lastChecked, setLastChecked] = useState(nowStamp())
  const [updates, setUpdates] = useState([])
  const sources = [
    { regulator: 'RBI', url: 'rbi.org.in', frequency: 'Every 6 hours' },
    { regulator: 'SEBI', url: 'sebi.gov.in', frequency: 'Every 6 hours' },
    { regulator: 'IRDAI', url: 'irdai.gov.in', frequency: 'Every 12 hours' },
    { regulator: 'DPDP', url: 'meity.gov.in', frequency: 'Daily' },
  ]

  useEffect(() => {
    if (!enabled) return undefined
    const timer = window.setInterval(() => setLastChecked(nowStamp()), 30000)
    return () => window.clearInterval(timer)
  }, [enabled])

  const checkNow = () => {
    setChecking(true)
    window.setTimeout(() => {
      setLastChecked(nowStamp())
      setUpdates((current) => [
        {
          id: Date.now(),
          regulator: 'RBI',
          title: 'Digital Payment Security Controls — amendment detected',
          time: nowStamp(),
        },
        ...current,
      ])
      setChecking(false)
    }, 1100)
  }

  return (
    <div className="monitor-layout">
      <section className="panel">
        <div className="monitor-summary">
          <div><span className={`monitor-pulse ${enabled ? '' : 'off'}`} /><div><h2>Automatic monitoring</h2><p>Last checked {lastChecked}</p></div></div>
          <div className="monitor-controls">
            <label className="switch"><input type="checkbox" checked={enabled} onChange={(event) => setEnabled(event.target.checked)} /><span /></label>
            <button type="button" onClick={checkNow} disabled={checking}>{checking ? 'Checking...' : 'Check now'}</button>
          </div>
        </div>
        <div className="source-list">
          {sources.map((source) => (
            <article key={source.regulator}>
              <Badge tone={source.regulator.toLowerCase()}>{source.regulator}</Badge>
              <div><b>{source.url}</b><small>{source.frequency}</small></div>
              <span className={enabled ? 'source-live' : 'source-paused'}>{enabled ? 'Monitoring' : 'Paused'}</span>
            </article>
          ))}
        </div>
      </section>
      <section className="panel">
        <div className="panel-head"><h2>Detected circulars</h2><Badge tone="pending">{updates.length} new</Badge></div>
        {updates.length ? (
          <div className="monitor-updates">
            {updates.map((update) => (
              <article key={update.id}>
                <Badge tone={update.regulator.toLowerCase()}>{update.regulator}</Badge>
                <div><b>{update.title}</b><small>{update.time}</small></div>
                <button type="button">Review</button>
              </article>
            ))}
          </div>
        ) : <div className="empty-state">No new circulars. Select “Check now” to run the demo monitor.</div>}
      </section>
    </div>
  )
}

export default function App() {
  const [loggedIn, setLoggedIn] = useState(
    () =>
      window.sessionStorage.getItem('clausemind-demo-session') === 'active' &&
      Boolean(ROUTE_VIEWS[window.location.pathname]),
  )
  const [view, setView] = useState(
    () => ROUTE_VIEWS[window.location.pathname] || 'dashboard',
  )
  const [selectedId, setSelectedId] = useState('obl-4')
  const [reviews, setReviews] = useState({})
  const [editMode, setEditMode] = useState(false)
  const [editDraft, setEditDraft] = useState('')
  const [activeRegulator, setActiveRegulator] = useState('All')
  const [visibleUpdate, setVisibleUpdate] = useState(null)
  const [viewedDocument, setViewedDocument] = useState(null)
  const [policyView, setPolicyView] = useState('handbook')
  const [findingMenuOpen, setFindingMenuOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const [lastUpload, setLastUpload] = useState(null)
  const [uploadedDocuments, setUploadedDocuments] = useState([])
  const [uploadedObligations, setUploadedObligations] = useState([])
  const [activeUploadId, setActiveUploadId] = useState(null)
  const toastTimer = useRef(null)

  useEffect(() => {
    const enforceRoute = () => {
      const session =
        window.sessionStorage.getItem('clausemind-demo-session') === 'active'
      const path = window.location.pathname
      if (path === '/' || path === '/login') {
        setLoggedIn(false)
        return
      }
      const routeView = ROUTE_VIEWS[path]
      if (!session || !routeView) {
        window.history.replaceState(null, '', '/login')
        setLoggedIn(false)
        return
      }
      setLoggedIn(true)
      setView(routeView)
    }

    enforceRoute()
    window.addEventListener('popstate', enforceRoute)
    return () => window.removeEventListener('popstate', enforceRoute)
  }, [])

  useEffect(() => {
    if (!loggedIn) return
    const route = VIEW_ROUTES[view] || '/dashboard'
    if (window.location.pathname !== route) {
      window.history.replaceState(null, '', route)
    }
  }, [loggedIn, view])
  const [auditLog, setAuditLog] = useState([
    {
      id: 'initial',
      time: nowStamp(),
      event: 'Regulatory comparison completed',
      detail: `${INITIAL_OBLIGATIONS.length} obligations compared with the company policy handbook.`,
    },
  ])

  const findings = useMemo(
    () =>
      [...INITIAL_OBLIGATIONS, ...uploadedObligations].map((obligation) => ({
        ...obligation,
        map: obligation.map || mappingCatalog[obligation.id],
        reviewStatus: reviews[obligation.id]?.status || obligation.reviewStatus,
        policyText: reviews[obligation.id]?.policyText || null,
      })),
    [reviews, uploadedObligations],
  )

  const scopedFindings =
    activeUploadId
      ? findings.filter((item) => item.uploadId === activeUploadId)
      : activeRegulator === 'All'
      ? findings
      : findings.filter(
          (item) => regulatorForFinding(item) === activeRegulator,
        )
  const pending = scopedFindings.filter((item) => item.reviewStatus === 'Pending')
  const gaps = scopedFindings.filter((item) => item.map?.coverage !== 'Covered')
  const selected = findings.find((item) => item.id === selectedId) || findings[0]
  const selectedPending =
    pending.find((item) => item.id === selectedId) || pending[0]

  const selectFinding = (id, targetView = 'review') => {
    setSelectedId(id)
    setEditMode(false)
    setView(targetView)
  }

  const applyRegulator = (regulator) => {
    setActiveUploadId(null)
    setActiveRegulator(regulator)
    const candidates =
      regulator === 'All'
        ? findings
        : findings.filter(
            (item) => regulatorForFinding(item) === regulator,
          )
    const next = candidates.find((item) => item.reviewStatus === 'Pending') || candidates[0]
    if (next) setSelectedId(next.id)
  }

  const showToast = (message, tone = 'success') => {
    window.clearTimeout(toastTimer.current)
    setToast({ message, tone })
    toastTimer.current = window.setTimeout(() => setToast(null), 3200)
  }

  const login = (event) => {
    event.preventDefault()
    window.sessionStorage.setItem('clausemind-demo-session', 'active')
    window.history.pushState(null, '', '/dashboard')
    setView('dashboard')
    setLoggedIn(true)
  }

  const logout = () => {
    window.sessionStorage.removeItem('clausemind-demo-session')
    window.location.assign('/login')
  }

  const decide = (status) => {
    const companyPolicy = policySection(selected.map)
    const policyText = editMode
      ? editDraft.trim() ||
        selected.map?.suggestedPolicyUpdate ||
        companyPolicy?.section?.text ||
        ''
      : reviews[selected.id]?.policyText || null
    const finalStatus = editMode && status === 'Approved' ? 'Edited' : status
    setReviews((current) => ({
      ...current,
      [selected.id]: { status: finalStatus, policyText },
    }))
    setAuditLog((current) => [
      {
        id: `${Date.now()}`,
        time: nowStamp(),
        event: `Finding ${finalStatus.toLowerCase()}`,
        detail: `${selected.obligation} — ${finalStatus} by Compliance Officer.`,
      },
      ...current,
    ])
    if (finalStatus === 'Rejected') {
      showToast('Finding rejected.', 'error')
    } else if (finalStatus === 'Edited') {
      showToast('Company policy wording saved and finding approved.')
    } else {
      showToast('Finding approved and company policy updated.')
    }
    if (view === 'review') {
      const nextPending = pending.find((item) => item.id !== selected.id)
      if (nextPending) setSelectedId(nextPending.id)
    }
    setEditMode(false)
  }

  const startEdit = () => {
    if (editMode) {
      decide('Approved')
      return
    }
    const companyPolicy = policySection(selected.map)
    setEditDraft(
      selected.policyText ||
        selected.map?.suggestedPolicyUpdate ||
        companyPolicy?.section?.text ||
        '',
    )
    setEditMode(true)
    showToast('Edit mode enabled. Update the company policy wording.', 'info')
  }

  const downloadDocument = async (circular) => {
    const { jsPDF } = await import('jspdf')
    const pdf = new jsPDF({ unit: 'mm', format: 'a4' })
    const margin = 18
    const pageWidth = pdf.internal.pageSize.getWidth() - margin * 2
    const clean = (text) =>
      text
        .replace(/[–—]/g, '-')
        .replace(/[“”]/g, '"')
        .replace(/[‘’]/g, "'")
    let y = 22

    const write = (text, size = 11, bold = false, gap = 6) => {
      pdf.setFont('helvetica', bold ? 'bold' : 'normal')
      pdf.setFontSize(size)
      const lines = pdf.splitTextToSize(clean(text), pageWidth)
      const lineHeight = size * 0.42
      if (y + lines.length * lineHeight > 280) {
        pdf.addPage()
        y = 22
      }
      pdf.text(lines, margin, y)
      y += lines.length * lineHeight + gap
    }

    pdf.setTextColor(32, 54, 76)
    write(circular.regulator, 11, true, 8)
    write(circular.title, 20, true, 7)
    pdf.setTextColor(105, 118, 132)
    write(`Published ${circular.published} | ${circular.pages} pages`, 9, false, 14)
    pdf.setTextColor(32, 54, 76)
    write('Summary', 14, true, 5)
    write(circular.summary, 10, false, 12)
    write('Regulatory requirements', 14, true, 6)
    circular.clauses.forEach((clause) => {
      write(`Clause ${clause.id}`, 11, true, 3)
      write(clause.text, 10, false, 8)
    })
    pdf.save(circular.filename)
  }

  const uploadRegulatoryDocument = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    let fileText = ''
    try {
      fileText = await file.text()
    } catch {
      fileText = ''
    }
    const signature = `${file.name} ${fileText.slice(0, 12000)}`.toUpperCase()
    const regulator = signature.includes('IRDAI') ||
      signature.includes('INSURANCE REGULATORY')
      ? 'IRDAI'
      : signature.includes('SEBI') ||
          signature.includes('SECURITIES AND EXCHANGE BOARD')
        ? 'SEBI'
        : signature.includes('RBI') ||
            signature.includes('RESERVE BANK OF INDIA')
          ? 'RBI'
          : signature.includes('DPDP') ||
              signature.includes('DIGITAL PERSONAL DATA PROTECTION')
            ? 'DPDP'
            : null

    event.target.value = ''
    if (!regulator) {
      showToast(
        'Regulator not detected. Include RBI, SEBI, IRDAI, or DPDP in the PDF file name.',
        'error',
      )
      return
    }

    const sequence =
      uploadedDocuments.filter((document) => document.regulator === regulator).length + 1
    const templates = UPLOAD_MOCKS[regulator]
    const mock = templates[(sequence - 1) % templates.length]
    const uploadId = `upload-${Date.now()}`
    const circularId = `${uploadId}-document`
    const obligationId = `${uploadId}-finding`
    const uploadedCircular = {
      id: circularId,
      uploadId,
      uploaded: true,
      regulator,
      title: `${regulator} Uploaded Regulatory Update ${sequence}`,
      filename: file.name,
      published: new Date().toISOString().slice(0, 10),
      pages: Math.max(1, Math.ceil(file.size / 45000)),
      summary: mock.summary,
      clauses: [
        {
          id: mock.clause,
          text: mock.requirement,
        },
      ],
    }
    const uploadedObligation = {
      id: obligationId,
      uploadId,
      circular: uploadedCircular,
      circularId,
      obligation: mock.requirement,
      owner: mock.owner,
      deadline: mock.deadline,
      sourceClause: mock.clause,
      confidence: Math.min(99, 91 + (sequence % 7)),
      plainSummary: mock.summary,
      reviewStatus: 'Pending',
      map: {
        policyId: mock.policyId,
        policyName: mock.policyName,
        policySection: mock.policySection,
        controlId: null,
        controlName: null,
        coverage: 'Missing',
        severity: mock.severity,
        gapReason: mock.gap,
        suggestedPolicyUpdate: mock.wording,
        action: {
          title: mock.action,
          owner: mock.owner,
          dueDays: 30,
          reason: `Required under ${regulator} uploaded document Clause ${mock.clause}`,
        },
      },
    }
    setUploadedDocuments((current) => [uploadedCircular, ...current])
    setUploadedObligations((current) => [...current, uploadedObligation])
    setLastUpload({
      id: uploadId,
      name: file.name,
      regulator,
      findings: 1,
      uploadedAt: nowStamp(),
    })
    setActiveUploadId(uploadId)
    setActiveRegulator(regulator)
    setSelectedId(obligationId)
    setView('dashboard')
    setAuditLog((current) => [
      {
        id: `upload-${Date.now()}`,
        time: nowStamp(),
        event: `${regulator} document uploaded`,
        detail: `${file.name} generated a new ${regulator} mock finding for policy comparison.`,
      },
      ...current,
    ])
    showToast(`${regulator} document uploaded. Mock findings loaded.`)
  }

  const stats = [
    { label: 'Regulatory obligations', value: scopedFindings.length, tone: 'blue' },
    { label: 'Policy gaps', value: gaps.length, tone: 'orange' },
    { label: 'Critical gaps', value: gaps.filter((item) => item.map?.severity === 'Critical').length, tone: 'red' },
    { label: 'Pending review', value: pending.length, tone: 'purple' },
  ]

  const policyUpdates = findings
    .filter(
      (item) =>
        ['Approved', 'Edited'].includes(item.reviewStatus) &&
        item.map?.policyId &&
        item.map?.policySection,
    )
    .map((item) => {
      const current = policySection(item.map)
      return {
        id: item.id,
        policyId: item.map.policyId,
        sectionId: item.map.policySection,
        previous: current?.section?.text || 'No previous policy wording.',
        updated:
          item.policyText ||
          item.map.suggestedPolicyUpdate ||
          item.plainSummary,
        obligation: item.obligation,
      }
    })

  if (!loggedIn) return <LoginPage onLogin={login} />

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">C</div>
          <div>
            <div className="brand-name">ClauseMind</div>
            <div className="brand-sub">Compliance Copilot</div>
          </div>
        </div>
        <nav className="nav" aria-label="Main navigation">
          {NAV.map((item) => (
            <button
              className={`nav-item ${view === item.id ? 'active' : ''}`}
              key={item.id}
              type="button"
              onClick={() => {
                setView(item.id)
                setEditMode(false)
                if (item.id === 'review' && pending.length) setSelectedId(pending[0].id)
              }}
            >
              <span>{item.icon}</span>
              {item.label}
              {item.id === 'review' && pending.length > 0 && (
                <span className="nav-count">{pending.length}</span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      <div className="content-column">
        <header className="top-navbar">
          <div className="top-navbar-title">AI Regulatory Change & Compliance Copilot</div>
          <div className="top-profile">
            <div className="avatar">M</div>
            <div><b>Maverick</b><span>Compliance Officer</span></div>
            <button className="logout-button" type="button" onClick={logout}>
              Logout
            </button>
          </div>
        </header>
        <main className="main-content">
        {view === 'dashboard' && (
          <>
            <PageHeader title="Compliance dashboard" subtitle="Regulatory requirements compared with company policies." />
            {lastUpload && (
              <div className="upload-result">
                <span className="upload-result-icon">✓</span>
                <div>
                  <b>{lastUpload.regulator} analysis loaded</b>
                  <p>
                    {lastUpload.name} · {lastUpload.findings} mock findings ·{' '}
                    {lastUpload.uploadedAt}
                  </p>
                </div>
              </div>
            )}
            <RegulatorFilters
              findings={findings}
              active={activeRegulator}
              onChange={applyRegulator}
            />
            <div className="stats">
              {stats.map((stat) => (
                <article className={`stat-card ${stat.tone}`} key={stat.label}>
                  <span>{stat.label}</span><strong>{stat.value}</strong>
                </article>
              ))}
            </div>
            <section className="panel">
              <div className="panel-head">
                <h2>{activeRegulator === 'All' ? 'All priority findings' : `${activeRegulator} findings`}</h2>
                <button
                  type="button"
                  onClick={() => {
                    if (pending.length) setSelectedId(pending[0].id)
                    setView('review')
                  }}
                >
                  Open review queue
                </button>
              </div>
              <FindingTable findings={scopedFindings} onSelect={selectFinding} />
            </section>
          </>
        )}

        {view === 'documents' && (
          <>
            <PageHeader title="Regulatory documents" subtitle="Preloaded circulars used for the policy comparison." />
            <section className="upload-panel">
              <div className="upload-copy">
                <span className="upload-symbol">↑</span>
                <div>
                  <h2>Upload regulatory PDF</h2>
                  <p>
                    Upload an RBI, SEBI, IRDAI, or DPDP document to load its mock
                    findings on the dashboard.
                  </p>
                </div>
              </div>
              <label className="upload-button" htmlFor="regulatory-upload">
                Upload PDF
              </label>
              <input
                id="regulatory-upload"
                className="upload-input"
                type="file"
                accept=".pdf,application/pdf"
                onChange={uploadRegulatoryDocument}
              />
            </section>
            <div className="document-grid">
              {[...uploadedDocuments, ...sampleCirculars].map((circular) => (
                <article className="document-card" key={circular.id}>
                  <div className="document-top">
                    <div className="document-badges">
                      <Badge tone={circular.regulator.toLowerCase()}>{circular.regulator}</Badge>
                      {circular.uploaded && <Badge tone="uploaded">Uploaded</Badge>}
                    </div>
                    <span>{circular.pages} pages</span>
                  </div>
                  <h3>{circular.title}</h3>
                  <p>{circular.summary}</p>
                  <div className="document-meta">{circular.filename} · {circular.published}</div>
                  <button
                    className="view-document"
                    type="button"
                    onClick={() => setViewedDocument(circular)}
                  >
                    View document
                  </button>
                </article>
              ))}
            </div>
          </>
        )}

        {view === 'review' && (
          <>
            <PageHeader
              title="Review queue"
              subtitle={`${pending.length} ${activeRegulator === 'All' ? '' : `${activeRegulator} `}findings require a compliance decision.`}
            />
            {pending.length ? (
              <>
                <div className="queue-toolbar">
                  <div className="queue-filter">
                    <label htmlFor="queue-finding">Select finding</label>
                    {findingMenuOpen && (
                      <button
                        className="finding-menu-backdrop"
                        type="button"
                        aria-label="Close finding menu"
                        onClick={() => setFindingMenuOpen(false)}
                      />
                    )}
                    <div className={`finding-select ${findingMenuOpen ? 'open' : ''}`}>
                      <button
                        id="queue-finding"
                        className="finding-select-trigger"
                        type="button"
                        aria-haspopup="listbox"
                        aria-expanded={findingMenuOpen}
                        onClick={() => setFindingMenuOpen((open) => !open)}
                      >
                        <span>
                          <small>
                            {regulatorForFinding(selectedPending)} · Clause{' '}
                            {selectedPending.sourceClause}
                          </small>
                          <b>{selectedPending.obligation}</b>
                        </span>
                        <span className="select-chevron">⌄</span>
                      </button>
                      {findingMenuOpen && (
                        <div className="finding-options" role="listbox">
                          {pending.map((item, index) => (
                            <button
                              type="button"
                              role="option"
                              aria-selected={item.id === selectedPending.id}
                              className={item.id === selectedPending.id ? 'selected' : ''}
                              key={item.id}
                              onClick={() => {
                                selectFinding(item.id, 'review')
                                setFindingMenuOpen(false)
                              }}
                            >
                              <span className={`option-number ${(item.map?.severity || 'covered').toLowerCase()}`}>
                                {index + 1}
                              </span>
                              <span>
                                <b>{item.obligation}</b>
                                <small>
                                  {regulatorForFinding(item)} · Clause{' '}
                                  {item.sourceClause} · {item.map?.severity || 'No gap'}
                                </small>
                              </span>
                              {item.id === selectedPending.id && <span className="option-check">✓</span>}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <span>{pending.length} remaining</span>
                  </div>
                </div>
                <FindingDetail
                  finding={selectedPending}
                  editMode={editMode}
                  editDraft={editDraft}
                  setEditDraft={setEditDraft}
                  onEdit={startEdit}
                  onDecision={decide}
                />
              </>
            ) : <div className="empty-state panel">All findings have been reviewed.</div>}
          </>
        )}

        {view === 'policies' && (
          <>
            <PageHeader title="Company policy" subtitle={`Policy handbook ${policyHandbook.version} and active control register.`} />
            <div className="policy-toggle" role="group" aria-label="Company policy view">
              <button
                type="button"
                className={policyView === 'handbook' ? 'active' : ''}
                onClick={() => setPolicyView('handbook')}
              >
                Policy handbook
              </button>
              <button
                type="button"
                className={policyView === 'controls' ? 'active' : ''}
                onClick={() => setPolicyView('controls')}
              >
                Control register
              </button>
            </div>
            {policyView === 'handbook' ? (
              <section className="panel policy-list">
                <div className="panel-head"><h2>Policy handbook</h2><a href="/Policy_Handbook.md" target="_blank" rel="noreferrer">Open handbook</a></div>
                {policyHandbook.policies.map((policy) => {
                  const updates = policyUpdates.filter(
                    (update) => update.policyId === policy.id,
                  )
                  return (
                    <article className="policy-item" key={policy.id}>
                      <div className="policy-title-row">
                        <Badge tone="neutral">{policy.id}</Badge>
                        <h3>{policy.name}</h3>
                        {updates.length > 0 && (
                          <Badge tone="updated">Updated</Badge>
                        )}
                      </div>
                      <span>{policy.owner}</span>
                      {policy.sections.map((section) => {
                        const update = updates.find(
                          (item) => item.sectionId === section.id,
                        )
                        return (
                          <div className="policy-section" key={section.id}>
                            <p>
                              <b>{section.id}</b>{' '}
                              {update ? update.updated : section.text}
                            </p>
                            {update && (
                              <>
                                <button
                                  className="view-update"
                                  type="button"
                                  onClick={() =>
                                    setVisibleUpdate(
                                      visibleUpdate === update.id ? null : update.id,
                                    )
                                  }
                                >
                                  {visibleUpdate === update.id
                                    ? 'Hide update'
                                    : 'View update'}
                                </button>
                                {visibleUpdate === update.id && (
                                  <div className="policy-diff">
                                    <div className="diff-old">
                                      <span>Previous wording</span>
                                      <p>{update.previous}</p>
                                    </div>
                                    <div className="diff-new">
                                      <span>Updated wording</span>
                                      <p>{update.updated}</p>
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        )
                      })}
                    </article>
                  )
                })}
              </section>
            ) : (
              <section className="panel">
                <div className="panel-head"><h2>Control register</h2><a href="/Control_Register.csv" target="_blank" rel="noreferrer">Download CSV</a></div>
                <table><thead><tr><th>Control</th><th>Owner</th><th>Status</th></tr></thead>
                  <tbody>{controlRegister.map((control) => <tr key={control.id}><td><b>{control.id}</b><br />{control.name}</td><td>{control.owner}</td><td><Badge tone="covered">{control.status}</Badge></td></tr>)}</tbody>
                </table>
              </section>
            )}
          </>
        )}

        {view === 'assistant' && (
          <>
            <PageHeader
              title="Employee Policy Assistant"
              subtitle="Policy Q&A grounded only in approved company policies."
            />
            <PolicyAssistant approvedUpdates={policyUpdates} />
          </>
        )}

        {view === 'monitor' && (
          <>
            <PageHeader
              title="Regulator website monitor"
              subtitle="Automatically watch regulator sources for newly published circulars."
            />
            <RegulatorMonitor />
          </>
        )}

        {view === 'audit' && (
          <>
            <PageHeader title="Audit trail" subtitle="Recorded AI comparisons and officer decisions." />
            <section className="panel audit-list">
              {auditLog.map((event) => (
                <article key={event.id}><span className="audit-dot" /><div><time>{event.time}</time><h3>{event.event}</h3><p>{event.detail}</p></div></article>
              ))}
            </section>
          </>
        )}
        </main>
      </div>

      {viewedDocument && (
        <div className="document-modal-backdrop" role="presentation">
          <section
            className="document-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="document-preview-title"
          >
            <header className="document-modal-head">
              <div>
                <Badge tone={viewedDocument.regulator.toLowerCase()}>
                  {viewedDocument.regulator}
                </Badge>
                <h2 id="document-preview-title">{viewedDocument.title}</h2>
                <p>{viewedDocument.filename} · {viewedDocument.published}</p>
              </div>
              <div className="document-modal-actions">
                <button
                  className="btn edit"
                  type="button"
                  onClick={() => downloadDocument(viewedDocument)}
                >
                  Download
                </button>
                <button
                  className="btn reject"
                  type="button"
                  onClick={() => setViewedDocument(null)}
                >
                  Cancel
                </button>
              </div>
            </header>
            <div className="document-reader">
              <div className="document-cover">
                <span>{viewedDocument.regulator}</span>
                <h1>{viewedDocument.title}</h1>
                <p>Regulatory circular · {viewedDocument.published}</p>
              </div>
              <section>
                <h3>Summary</h3>
                <p>{viewedDocument.summary}</p>
              </section>
              <section>
                <h3>Regulatory requirements</h3>
                {viewedDocument.clauses.map((clause) => (
                  <article className="document-clause" key={clause.id}>
                    <b>Clause {clause.id}</b>
                    <p>{clause.text}</p>
                  </article>
                ))}
              </section>
              <section>
                <h3>Document information</h3>
                <p>
                  Regulator: {viewedDocument.regulator}<br />
                  Published: {viewedDocument.published}<br />
                  Source file: {viewedDocument.filename}<br />
                  Length: {viewedDocument.pages} pages
                </p>
              </section>
            </div>
          </section>
        </div>
      )}
      {toast && (
        <div className={`toast ${toast.tone}`} role="status" aria-live="polite">
          <span className="toast-icon">
            {toast.tone === 'error' ? '!' : toast.tone === 'info' ? '✎' : '✓'}
          </span>
          <span>{toast.message}</span>
          <button type="button" aria-label="Dismiss notification" onClick={() => setToast(null)}>
            ×
          </button>
        </div>
      )}
    </div>
  )
}

function PageHeader({ title, subtitle }) {
  return <header className="page-header"><div><h1>{title}</h1><p>{subtitle}</p></div></header>
}

function RegulatorFilters({ findings, active, onChange }) {
  return (
    <div className="regulator-filters" aria-label="Filter by regulator">
      {['All', 'RBI', 'SEBI', 'IRDAI', 'DPDP'].map((regulator) => {
        const count =
          regulator === 'All'
            ? findings.length
            : findings.filter(
                (item) => regulatorForFinding(item) === regulator,
              ).length
        return (
          <button
            type="button"
            key={regulator}
            className={active === regulator ? 'active' : ''}
            onClick={() => onChange(regulator)}
          >
            {regulator === 'All' ? 'All regulators' : regulator}
            <span>{count}</span>
          </button>
        )
      })}
    </div>
  )
}

function FindingTable({ findings, onSelect }) {
  return (
    <div className="table-scroll">
      <table>
        <thead><tr><th>Finding</th><th>Regulator</th><th>Coverage</th><th>Severity</th><th>Status</th></tr></thead>
        <tbody>
          {findings.map((item) => (
            <tr key={item.id} onClick={() => onSelect(item.id)}>
              <td><b>{item.obligation}</b><small>{item.owner}</small></td>
              <td>{regulatorForFinding(item)}</td>
              <td><Badge tone={item.map?.coverage.toLowerCase()}>{item.map?.coverage}</Badge></td>
              <td><Badge tone={(item.map?.severity || 'covered').toLowerCase()}>{item.map?.severity || 'No gap'}</Badge></td>
              <td><Badge tone={item.reviewStatus.toLowerCase()}>{item.reviewStatus}</Badge></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

