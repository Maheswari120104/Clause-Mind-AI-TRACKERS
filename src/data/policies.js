/** Mock internal Policy Handbook — aligned to RBI / SEBI / IRDAI / DPDP themes */

export const policyHandbook = {
  title: 'Clause Mind Financial Services — Policy Handbook',
  version: '2025.3',
  lastUpdated: '2025-09-15',
  policies: [
    {
      id: 'POL-ISP',
      name: 'Information Security Policy',
      owner: 'CISO Office',
      sections: [
        {
          id: 'ISP-4.1',
          title: 'Access Control',
          text: 'Access to information systems shall be granted on a need-to-know basis. Privileged access reviews shall be conducted periodically by system owners.',
        },
        {
          id: 'ISP-5.1',
          title: 'Cryptography',
          text: 'Sensitive customer and transaction data shall be protected using industry-standard encryption mechanisms for data at rest and in transit.',
        },
        {
          id: 'ISP-6.2',
          title: 'Logging & Monitoring',
          text: 'Security events shall be logged and retained for a minimum of 180 days and reviewed by the Security Operations team.',
        },
      ],
    },
    {
      id: 'POL-ACP',
      name: 'Access Control Policy',
      owner: 'IT Security Team',
      sections: [
        {
          id: 'ACP-3.2',
          title: 'Privilege Reviews',
          text: 'Access privilege reviews shall be conducted periodically for all production systems holding customer data.',
        },
        {
          id: 'ACP-4.1',
          title: 'Joiner-Mover-Leaver',
          text: 'User access shall be provisioned and revoked through the approved IAM workflow within 24 hours of HR status change.',
        },
      ],
    },
    {
      id: 'POL-DRP',
      name: 'Data Retention Policy',
      owner: 'Data Governance',
      sections: [
        {
          id: 'DRP-2.1',
          title: 'Retention Periods',
          text: 'Customer KYC records shall be retained for eight years after account closure unless a longer period is required by applicable law.',
        },
        {
          id: 'DRP-3.4',
          title: 'Secure Disposal',
          text: 'Personal data past retention shall be securely deleted or anonymised and disposal evidence retained for audit.',
        },
      ],
    },
    {
      id: 'POL-PRV',
      name: 'Privacy Policy',
      owner: 'Data Protection Officer',
      sections: [
        {
          id: 'PRV-2.1',
          title: 'Purpose Limitation',
          text: 'Personal data shall be processed only for purposes disclosed to the data principal at the time of collection, consistent with DPDP Act 2023 principles.',
        },
        {
          id: 'PRV-4.2',
          title: 'Cross-border Transfer',
          text: 'Cross-border transfer of personal data is permitted only to jurisdictions and processors approved by the DPO and Legal.',
        },
      ],
    },
    {
      id: 'POL-VND',
      name: 'Vendor Risk Management Policy',
      owner: 'Risk Management Team',
      sections: [
        {
          id: 'VND-2.3',
          title: 'Vendor Due Diligence',
          text: 'Critical vendors processing customer data shall undergo security due diligence prior to onboarding. Periodic reassessment is encouraged.',
        },
      ],
    },
  ],
}

export const controlRegister = [
  {
    id: 'CTRL-101',
    name: 'Quarterly access privilege review',
    policyId: 'POL-ACP',
    owner: 'IT Security Team',
    frequency: 'Quarterly',
    status: 'Active',
  },
  {
    id: 'CTRL-102',
    name: 'Database encryption at rest (AES-256)',
    policyId: 'POL-ISP',
    owner: 'Infrastructure Team',
    frequency: 'Continuous',
    status: 'Active',
  },
  {
    id: 'CTRL-103',
    name: 'Vendor security assessment at onboarding',
    policyId: 'POL-VND',
    owner: 'Risk Management Team',
    frequency: 'Onboarding',
    status: 'Active',
  },
  {
    id: 'CTRL-104',
    name: 'TLS 1.2+ for data in transit',
    policyId: 'POL-ISP',
    owner: 'Infrastructure Team',
    frequency: 'Continuous',
    status: 'Active',
  },
  {
    id: 'CTRL-105',
    name: 'KYC record retention (8 years)',
    policyId: 'POL-DRP',
    owner: 'Data Governance',
    frequency: 'Continuous',
    status: 'Active',
  },
  {
    id: 'CTRL-106',
    name: 'Security log retention (180 days)',
    policyId: 'POL-ISP',
    owner: 'Security Operations',
    frequency: 'Continuous',
    status: 'Active',
  },
]
