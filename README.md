# Clause Mind AI — Regulatory Change & Compliance Copilot

Agentic demo for monitoring regulatory updates (RBI, SEBI, IRDAI, DPDP), extracting obligations, mapping them to an internal policy handbook and control register, flagging gaps, drafting actions, and routing findings to a compliance officer with a full audit trail.

## Run

```bash
npm install
npm run dev
```

## Demo flow

1. **Ingest** — select 3–5 sample circular PDFs → Extract  
2. **Obligations** — clause, owner, deadline, confidence  
3. **Policies** — mock handbook + control register  
4. **Gap Analysis** — Covered / Partial / Missing + severity  
5. **Actions** — remediation tasks & suggested policy text  
6. **Officer Review** — Approve / Edit / Reject  
7. **Audit Trail** — immutable event history  

## Demo data

| Asset | Path |
|-------|------|
| Policy handbook | `public/Policy_Handbook.md` |
| Control register | `public/Control_Register.csv` |
| Circulars & extractions | `src/data/circulars.js` |
| Gap mappings | `src/data/mappings.js` |

## Branch

Feature work for this upgrade lives on `dev-maheswari-upgrade`.
