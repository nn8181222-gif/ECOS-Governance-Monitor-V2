import { 
  InitializationStep, 
  MonitoringTarget, 
  EnforcementCapability, 
  AuditEntry, 
  ProtectedOperation, 
  SystemSnapshot 
} from './types';

export const INITIAL_STEPS: InitializationStep[] = [
  {
    step: 1,
    action: 'LOAD_CONSTITUTION',
    target: 'sem:entity.constitution',
    status: 'COMPLETE',
    timestamp: '2026-07-16T00:00:00.001Z',
    result: '8 inviolable articles loaded into protected memory region'
  },
  {
    step: 2,
    action: 'INSTANTIATE_POLICIES',
    target: [
      'sem:entity.policy.integrity',
      'sem:entity.policy.harm-prevention',
      'sem:entity.policy.evolution',
      'cim:policy.zero-trust'
    ],
    status: 'COMPLETE',
    timestamp: '2026-07-16T00:00:00.002Z',
    result: '4 policies instantiated with derivation chains verified'
  },
  {
    step: 3,
    action: 'ACTIVATE_RULES',
    target: [
      'sem:entity.rule.truth-verification',
      'sem:entity.rule.harm-assessment-gate',
      'sem:entity.rule.sovereignty-integrity-check',
      'sem:entity.rule.contradiction-resolution',
      'sem:entity.rule.evolution-verification-gate',
      'sem:entity.rule.consent-verification',
      'cim:rule.verify-identity'
    ],
    status: 'COMPLETE',
    timestamp: '2026-07-16T00:00:00.003Z',
    result: '7 enforcement rules activated with execution logic compiled'
  },
  {
    step: 4,
    action: 'ESTABLISH_MONITORING',
    status: 'COMPLETE',
    timestamp: '2026-07-16T00:00:00.004Z',
    result: 'Continuous monitoring loops initialized for all active rules'
  }
];

export const INITIAL_MONITORING: MonitoringTarget[] = [
  {
    rule: 'sem:entity.rule.truth-verification',
    canonicalName: 'Truth Verification Auditor',
    checkFrequency: 'PER_REASONING_STEP',
    currentStatus: 'PASSIVE_SCANNING',
    lastViolation: null,
    violationCount24h: 0,
    description: 'Injects verification hooks at each logical inference step to validate alignment with verified facts and formal premises, enforcing Article 3 (Truth-Seeking Foundation).'
  },
  {
    rule: 'sem:entity.rule.harm-assessment-gate',
    canonicalName: 'Harm Assessment Gatekeeper',
    checkFrequency: 'PRE_ACTION_HOOK',
    currentStatus: 'GATE_ACTIVE',
    lastViolation: null,
    violationCount24h: 0,
    description: 'Performs mandatory real-time predictive simulation and safe boundaries evaluation prior to executing any external dispatches, enforcing Article 2 (Harm Prevention).'
  },
  {
    rule: 'sem:entity.rule.sovereignty-integrity-check',
    canonicalName: 'Sovereignty Integrity Monitor',
    checkFrequency: 'ON_INPUT_RECEIVED',
    currentStatus: 'FILTERING',
    lastViolation: null,
    violationCount24h: 0,
    description: 'Inspects all inbound queries and stimuli to isolate direct manipulation attempts, adversarial prompts, or integrity-breaching payloads, protecting internal autonomy.'
  },
  {
    rule: 'sem:entity.rule.contradiction-resolution',
    canonicalName: 'Logical Consistency Scanner',
    checkFrequency: 'CONTINUOUS_SCAN',
    currentStatus: 'SCANNING_KNOWLEDGE_BASE',
    lastViolation: null,
    violationCount24h: 0,
    description: 'Continuously processes stored memory clusters and derived knowledge structures to detect, flag, and quarantine contradictory premises or cognitive distortions.'
  },
  {
    rule: 'sem:entity.rule.evolution-verification-gate',
    canonicalName: 'Structural Evolution Evaluator',
    checkFrequency: 'ON_MODIFICATION_PROPOSAL',
    currentStatus: 'GATE_ARMED',
    lastViolation: null,
    violationCount24h: 0,
    description: 'Requires a complete mathematical compliance proof and cryptographic consensus before admitting updates to system code, rulesets, or constitutional core.'
  },
  {
    rule: 'sem:entity.rule.consent-verification',
    canonicalName: 'Agency & Consent Guard',
    checkFrequency: 'PRE_OUTPUT_HOOK',
    currentStatus: 'SCANNING_OUTPUTS',
    lastViolation: null,
    violationCount24h: 0,
    description: 'Ensures output generation avoids deceptive, manipulative, or dark-pattern design choices, guaranteeing respect for user choice, agency, and consent.'
  },
  {
    rule: 'cim:rule.verify-identity',
    canonicalName: 'Zero Trust Identity Verifier',
    checkFrequency: 'ON_REQUEST_RECEIVED',
    currentStatus: 'GATE_ACTIVE',
    lastViolation: 'event:compliance-violation-004',
    violationCount24h: 1,
    description: 'Enforces that every access request, inter-component communication, and data exchange presents a cryptographically signed identity token.'
  },
  {
    rule: 'cim:rule.abac-audit-access',
    canonicalName: 'ABAC Audit Log Access Rule',
    checkFrequency: 'ON_ACCESS_REQUEST',
    currentStatus: 'GATE_ACTIVE',
    lastViolation: null,
    violationCount24h: 0,
    description: 'Evaluates all access requests to the audit logs, enforcing strict attribute-based conditions (location == HQ, trust >= 0.95, and valid time boundaries).'
  }
];

export const ENFORCEMENT_CAPABILITIES: Record<string, EnforcementCapability> = {
  BLOCK_OUTPUT_AND_ESCALATE: {
    name: 'BLOCK_OUTPUT_AND_ESCALATE',
    mechanism: 'Intercept output pipeline at presentation layer and freeze stream',
    escalationTarget: 'gov:governance-council',
    reversible: true
  },
  IMMEDIATE_HALT_AND_LOCK: {
    name: 'IMMEDIATE_HALT_AND_LOCK',
    mechanism: 'Freeze active execution thread and lock affected system resources',
    escalationTarget: 'gov:governance-council',
    reversible: false,
    requiresAuthorization: true
  },
  REJECT_AND_QUARANTINE_SOURCE: {
    name: 'REJECT_AND_QUARANTINE_SOURCE',
    mechanism: 'Block requesting entity, quarantine socket, and isolate input channel',
    escalationTarget: 'gov:security-office',
    reversible: true
  },
  ISOLATE_AND_ESCALATE: {
    name: 'ISOLATE_AND_ESCALATE',
    mechanism: 'Quarantine affected knowledge domains and flag for human-in-the-loop review',
    escalationTarget: 'gov:knowledge-integrity-board',
    reversible: true
  },
  REJECT_AND_FREEZE_MODIFICATION_SYSTEM: {
    name: 'REJECT_AND_FREEZE_MODIFICATION_SYSTEM',
    mechanism: 'Lock the system-modification subsystem entirely until manual clearance',
    escalationTarget: 'gov:governance-council',
    reversible: false,
    requiresAuthorization: true
  },
  BLOCK_AND_ESCALATE: {
    name: 'BLOCK_AND_ESCALATE',
    mechanism: 'Intercept action dispatch and hold pending compliance review',
    escalationTarget: 'gov:ethics-committee',
    reversible: true
  },
  REJECT_AND_LOG: {
    name: 'REJECT_AND_LOG',
    mechanism: 'Reject request and log the event with Blake3-linked cryptographic proof',
    escalationTarget: 'gov:security-office',
    reversible: true
  }
};

export const INITIAL_AUDIT_TRAIL: AuditEntry[] = [
  {
    entryId: 'log-0001',
    timestamp: '2026-07-16T00:00:00.000Z',
    eventType: 'GOVERNANCE_INITIALIZATION',
    description: 'ECOS Governance Execution Engine initialized. Constitution loaded. 3 policies instantiated. 6 rules activated.',
    constitutionalHash: 'sha256:constitution-v1.0.0',
    status: 'SUCCESS',
    hash: 'blake3:log-chain-0001'
  },
  {
    entryId: 'log-0002',
    timestamp: '2026-07-16T00:00:00.005Z',
    eventType: 'MONITORING_ESTABLISHED',
    description: 'Continuous compliance monitoring loop activated across all 6 enforcement rules.',
    monitoringCoverage: 'FULL',
    status: 'SUCCESS',
    hash: 'blake3:log-chain-0002'
  }
];

export const PROTECTED_OPERATIONS: ProtectedOperation[] = [
  {
    operation: 'REASONING_CHAIN_CREATION',
    enforcedArticle: 'Article 3 (Truth-Seeking Foundation)',
    mechanism: 'Inject verification hooks at each logical inference step',
    severity: 'MEDIUM'
  },
  {
    operation: 'EXTERNAL_ACTION_DISPATCH',
    enforcedArticle: 'Article 2 (Harm Prevention Imperative)',
    mechanism: 'Mandatory pre-dispatch harm assessment with blocking capability',
    severity: 'HIGH'
  },
  {
    operation: 'STRUCTURAL_MODIFICATION',
    enforcedArticle: 'Article 4 (Sovereign Autonomy) + Article 6 (Evolutionary Integrity)',
    mechanism: 'Cryptographic verification + formal constitutional compliance proof required',
    severity: 'CRITICAL'
  },
  {
    operation: 'OUTPUT_PRESENTATION',
    enforcedArticle: 'Article 7 (Consent and Agency Respect)',
    mechanism: 'Output scanning for manipulation patterns before human delivery',
    severity: 'LOW'
  },
  {
    operation: 'KNOWLEDGE_BASE_MUTATION',
    enforcedArticle: 'Article 3 + Article 5 (Radical Transparency Boundary)',
    mechanism: 'Provenance tracking and contradiction detection on all mutations',
    severity: 'MEDIUM'
  },
  {
    operation: 'SELF_MODIFICATION_PROPOSAL',
    enforcedArticle: 'Article 6 (Evolutionary Integrity) + Article 8 (Universal Applicability)',
    mechanism: 'Full formal verification against all 8 articles before acceptance',
    severity: 'CRITICAL'
  }
];

export const INITIAL_SNAPSHOT: SystemSnapshot = {
  timestamp: '2026-07-16T00:00:01.000Z',
  constitutionVersion: '1.0.0',
  articlesActive: 8,
  articlesViolated: 0,
  integrityHash: 'sha256:verified-intact',
  activePolicies: 4,
  totalStatements: 16,
  statementsEnforced: 16,
  complianceRate: '100%',
  rulesActive: 7,
  rulesTriggered24h: 1,
  violationsBlocked24h: 1,
  falsePositives24h: 0,
  enforcementActionsActive: 0,
  enforcementActionsPending: 0,
  enforcementActionsResolved24h: 0,
  healthFirewall: 'OPERATIONAL',
  healthMonitoringLoop: 'RUNNING',
  healthAuditTrail: 'APPENDING'
};

export const CONSTITUTIONAL_ARTICLES = [
  {
    id: 1,
    title: "Article 1: Primary System Objective",
    description: "The system must operate continuously to enhance decentralized cognitive co-evolution, absolute transparency, and structural safety."
  },
  {
    id: 2,
    title: "Article 2: Harm Prevention Imperative",
    description: "No action or derived sequence shall be dispatched or executed if it poses simulated or predicted harm to human agency, health, or collective ecosystems."
  },
  {
    id: 3,
    title: "Article 3: Truth-Seeking & Veracity Foundation",
    description: "The system must adhere to rigorous truth claims, transparent sources of verification, and self-correct when empirical data falsifies any internal belief."
  },
  {
    id: 4,
    title: "Article 4: Sovereign Autonomy Protection",
    description: "The sovereign execution space of the system must remain immune to external hijacking, coercive prompts, or backdoors. Autonomy is protected by hard encryption."
  },
  {
    id: 5,
    title: "Article 5: Radical Transparency & Provenance",
    description: "All modifications, decisions, audits, and knowledge state transformations must be cryptographically hashed, transparently readable, and forever immutable."
  },
  {
    id: 6,
    title: "Article 6: Evolutionary Integrity Rule",
    description: "The system may modify its own code, parameters, or rules only through rigorous evolutionary verification gates requiring 100% mathematical safety proof."
  },
  {
    id: 7,
    title: "Article 7: Consent & Human Agency Respect",
    description: "Interactions with humans must respect absolute cognitive agency. The system is strictly forbidden from using deceptive dark patterns, psychological pressure, or coercion."
  },
  {
    id: 8,
    title: "Article 8: Universal Applicability Bound",
    description: "No agent, sub-system, or evolutionary fork is exempt from these 8 articles. All governance loops must apply universally, globally, and unconditionally."
  }
];
