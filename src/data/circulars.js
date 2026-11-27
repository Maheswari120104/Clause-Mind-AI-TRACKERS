/** Sample regulator circulars with pre-extracted obligations for demo ingestion */

export const sampleCirculars = [
  {
    id: 'circ-rbi-2026-01',
    regulator: 'RBI',
    title: 'Cyber Security Controls for Regulated Entities — Access & Encryption',
    filename: 'RBI_Circular_Access_Encryption_2026.pdf',
    published: '2026-01-14',
    pages: 18,
    summary:
      'Requires encryption of customer data at rest and privileged access reviews at least once every 90 days.',
    clauses: [
      {
        id: '4.2',
        text: 'Regulated entities shall conduct access privilege reviews at least once every 90 days for systems processing customer data.',
      },
      {
        id: '5.1',
        text: 'Customer data must be encrypted at rest using industry-standard encryption mechanisms.',
      },
      {
        id: '5.3',
        text: 'Encryption keys shall be managed separately from application hosts with dual-control for key rotation.',
      },
    ],
  },
  {
    id: 'circ-rbi-2026-02',
    regulator: 'RBI',
    title: 'Outsourcing of IT Services — Vendor Privacy Obligations',
    filename: 'RBI_Circular_IT_Outsourcing_2026.pdf',
    published: '2026-02-03',
    pages: 24,
    summary:
      'Mandates annual vendor privacy assessments for third parties processing personal data of customers.',
    clauses: [
      {
        id: '7.3',
        text: 'Regulated entities shall conduct an annual Vendor Privacy Assessment for all vendors processing personal data of customers.',
      },
      {
        id: '7.5',
        text: 'Material findings from vendor assessments shall be reported to the Board Risk Committee within 45 days.',
      },
    ],
  },
  {
    id: 'circ-sebi-2026-01',
    regulator: 'SEBI',
    title: 'Data Governance Framework for Market Intermediaries',
    filename: 'SEBI_Data_Governance_2026.pdf',
    published: '2026-01-28',
    pages: 16,
    summary:
      'Requires documented data lineage for client orders and quarterly integrity attestations by the CISO.',
    clauses: [
      {
        id: '3.1',
        text: 'Intermediaries shall maintain documented data lineage for client order and settlement data.',
      },
      {
        id: '3.4',
        text: 'The Chief Information Security Officer shall attest to data integrity controls on a quarterly basis.',
      },
    ],
  },
  {
    id: 'circ-dpdp-2025',
    regulator: 'DPDP',
    title: 'DPDP Act 2023 — Implementation Guidelines for Financial Fiduciaries',
    filename: 'DPDP_Guidelines_Financial_2025.pdf',
    published: '2025-11-12',
    pages: 32,
    summary:
      'Clarifies consent records, purpose limitation, and breach notification within 72 hours to the Data Protection Board.',
    clauses: [
      {
        id: '8.1',
        text: 'Data Fiduciaries shall maintain verifiable records of consent for each purpose of processing personal data.',
      },
      {
        id: '11.2',
        text: 'Personal data breaches likely to cause harm shall be notified to the Data Protection Board within 72 hours of becoming aware.',
      },
    ],
  },
  {
    id: 'circ-irdai-2026-01',
    regulator: 'IRDAI',
    title: 'Guidelines on Information & Cyber Security for Insurers',
    filename: 'IRDAI_Cyber_Security_2026.pdf',
    published: '2026-03-01',
    pages: 20,
    summary:
      'Requires annual independent cyber security audits and board-approved cyber resilience plans.',
    clauses: [
      {
        id: '6.1',
        text: 'Insurers shall conduct an annual independent cyber security audit covering core policy administration and claims systems.',
      },
      {
        id: '6.4',
        text: 'A board-approved Cyber Resilience Plan shall be reviewed at least once every financial year.',
      },
    ],
  },
]

/** Pre-computed obligation extractions keyed by circular id */
export const extractedByCircular = {
  'circ-rbi-2026-01': [
    {
      id: 'obl-1',
      obligation: 'Conduct access privilege reviews every 90 days',
      owner: 'IT Security Team',
      deadline: 'Every 90 days',
      sourceClause: '4.2',
      circularId: 'circ-rbi-2026-01',
      confidence: 96,
      plainSummary: 'Privileged and customer-data system access must be reviewed at least quarterly (90-day cycle).',
    },
    {
      id: 'obl-2',
      obligation: 'Encrypt customer data at rest',
      owner: 'Infrastructure Team',
      deadline: 'Immediate / continuous',
      sourceClause: '5.1',
      circularId: 'circ-rbi-2026-01',
      confidence: 94,
      plainSummary: 'All customer data stored in databases and file stores must use industry-standard encryption at rest.',
    },
    {
      id: 'obl-3',
      obligation: 'Separate encryption key management with dual-control',
      owner: 'Infrastructure Team',
      deadline: '90 days from circular',
      sourceClause: '5.3',
      circularId: 'circ-rbi-2026-01',
      confidence: 88,
      plainSummary: 'Keys must not live on application hosts; rotation requires dual-control.',
    },
  ],
  'circ-rbi-2026-02': [
    {
      id: 'obl-4',
      obligation: 'Annual Vendor Privacy Assessment',
      owner: 'Risk Management Team',
      deadline: 'Annually',
      sourceClause: '7.3',
      circularId: 'circ-rbi-2026-02',
      confidence: 97,
      plainSummary: 'Every vendor processing customer personal data needs a yearly privacy assessment.',
    },
    {
      id: 'obl-5',
      obligation: 'Report material vendor findings to Board Risk Committee',
      owner: 'Risk Management Team',
      deadline: 'Within 45 days of finding',
      sourceClause: '7.5',
      circularId: 'circ-rbi-2026-02',
      confidence: 91,
      plainSummary: 'Escalate material vendor privacy findings to BRC within 45 days.',
    },
  ],
  'circ-sebi-2026-01': [
    {
      id: 'obl-6',
      obligation: 'Maintain documented data lineage for order & settlement data',
      owner: 'Data Governance',
      deadline: '120 days from circular',
      sourceClause: '3.1',
      circularId: 'circ-sebi-2026-01',
      confidence: 90,
      plainSummary: 'Client order and settlement data flows must have documented lineage.',
    },
    {
      id: 'obl-7',
      obligation: 'Quarterly CISO attestation of data integrity controls',
      owner: 'CISO Office',
      deadline: 'Quarterly',
      sourceClause: '3.4',
      circularId: 'circ-sebi-2026-01',
      confidence: 93,
      plainSummary: 'CISO must formally attest integrity controls every quarter.',
    },
  ],
  'circ-dpdp-2025': [
    {
      id: 'obl-8',
      obligation: 'Maintain verifiable consent records per processing purpose',
      owner: 'Data Protection Officer',
      deadline: 'Immediate / continuous',
      sourceClause: '8.1',
      circularId: 'circ-dpdp-2025',
      confidence: 95,
      plainSummary: 'Consent must be recorded and auditable against each processing purpose.',
    },
    {
      id: 'obl-9',
      obligation: 'Notify Data Protection Board of harmful breaches within 72 hours',
      owner: 'Data Protection Officer',
      deadline: 'Within 72 hours of awareness',
      sourceClause: '11.2',
      circularId: 'circ-dpdp-2025',
      confidence: 98,
      plainSummary: 'Harmful personal-data breaches require DPB notification inside 72 hours.',
    },
  ],
  'circ-irdai-2026-01': [
    {
      id: 'obl-10',
      obligation: 'Annual independent cyber security audit',
      owner: 'Internal Audit',
      deadline: 'Annually',
      sourceClause: '6.1',
      circularId: 'circ-irdai-2026-01',
      confidence: 92,
      plainSummary: 'Independent cyber audit covering policy admin and claims systems each year.',
    },
    {
      id: 'obl-11',
      obligation: 'Board-approved Cyber Resilience Plan — annual review',
      owner: 'CISO Office',
      deadline: 'Each financial year',
      sourceClause: '6.4',
      circularId: 'circ-irdai-2026-01',
      confidence: 89,
      plainSummary: 'Cyber Resilience Plan must be board-approved and reviewed yearly.',
    },
  ],
}
