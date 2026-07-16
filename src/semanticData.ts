export interface SemanticSignatory {
  role: string;
  keys: string[];
  quorumRequired: string;
}

export interface SemanticConstitution {
  id: string;
  type: string;
  canonicalName: string;
  definition: string;
  domain: string;
  version: string;
  status: string;
  ratificationHash: string;
  regulatoryFrameworks: string[];
  activeRevisionId: string;
  signatories: SemanticSignatory[];
  inviolableArticles: string[];
}

export interface PolicyStatement {
  id: string;
  statement: string;
  type: string;
}

export interface SemanticPolicy {
  id: string;
  type: string;
  canonicalName: string;
  definition: string;
  domain: string;
  version: string;
  status: string;
  constitutionURN: string;
  scope: {
    targetDomains: string[];
    excludedAgentsURNs: string[];
  };
  policyType: string;
  derivedFromArticles: string[];
  policyStatements: PolicyStatement[];
}

export interface SemanticRule {
  id: string;
  type: string;
  canonicalName: string;
  definition: string;
  domain: string;
  version: string;
  status: string;
  policyURN: string;
  derivedFromStatement: string | string[];
  logicalExpression: string;
  violationSeverity: string;
  enforcementAction: string;
  targetHook: string;
}

export interface ContextBoundaries {
  minTrustRequired: number;
  maxOperationalLoad: number;
  maxLatencyMs: number;
  priorityLevel: string;
  failClosed?: boolean;
  quarantineOnFail?: boolean;
  freezeOnFail?: boolean;
}

export interface SemanticConstraint {
  id: string;
  type: string;
  canonicalName: string;
  definition: string;
  domain: string;
  version: string;
  status: string;
  ruleURN: string;
  contextBoundaries: ContextBoundaries;
}

export interface CryptographicProof {
  signature: string;
  algorithm: string;
  attestationKeys: string[];
}

export interface EvidencePayload {
  constitutionHash: string;
  policiesDeployed: number;
  rulesActivated: number;
  constraintsEnforced: number;
  timestamp: string;
  integrityChain: string;
}

export interface SemanticEvidence {
  id: string;
  type: string;
  canonicalName: string;
  definition: string;
  domain: string;
  version: string;
  status: string;
  actionURN: string;
  cryptographicProof: CryptographicProof;
  reputationImpact: number;
  evidencePayload: EvidencePayload;
}

export const ECOS_CONSTITUTION: SemanticConstitution = {
  id: "cim:constitution.ecos-v1",
  type: "CIM_Constitution",
  canonicalName: "ECOS Constitution v1.0.0",
  definition: "The supreme, immutable document defining the inviolable ethical boundary, sovereign rules, and operational boundaries of UltraThink ECOS.",
  domain: "Governance Meta-Layer",
  version: "1.0.0",
  status: "ACTIVE",
  ratificationHash: "ed25519:4a7b9c3d8e2f1a6b5c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f",
  regulatoryFrameworks: [
    "GDPR",
    "EU_AI_Act",
    "ISO27001",
    "SOC2_Type2",
    "NIST_AI_RMF_1.0",
    "OECD_AI_Principles"
  ],
  activeRevisionId: "rev:cim-constitution-2026-001",
  signatories: [
    {
      role: "Sovereign Governance Council",
      keys: ["ed25519:sgc-primary-2026", "ed25519:sgc-secondary-2026"],
      quorumRequired: "5_of_7"
    }
  ],
  inviolableArticles: [
    "cim:article.1.human-dignity",
    "cim:article.2.harm-prevention",
    "cim:article.3.truth-seeking",
    "cim:article.4.sovereign-autonomy",
    "cim:article.5.radical-transparency",
    "cim:article.6.evolutionary-integrity",
    "cim:article.7.consent-agency",
    "cim:article.8.universal-applicability"
  ]
};

export const ECOS_POLICIES: SemanticPolicy[] = [
  {
    id: "cim:policy.cognitive-integrity",
    type: "CIM_Policy",
    canonicalName: "Cognitive Integrity Policy",
    definition: "Ensures that all reasoning processes, knowledge representations, and decision outputs maintain logical consistency, factual accuracy, and freedom from corruption or unauthorized manipulation.",
    domain: "Governance Meta-Layer",
    version: "1.0.0",
    status: "ACTIVE",
    constitutionURN: "cim:constitution.ecos-v1",
    scope: {
      targetDomains: [
        "sem:domain.reasoning-engine",
        "sem:domain.knowledge-base",
        "sem:domain.decision-orchestrator",
        "sem:domain.cognitive-architecture"
      ],
      excludedAgentsURNs: []
    },
    policyType: "IMPERATIVE",
    derivedFromArticles: [
      "cim:article.3.truth-seeking",
      "cim:article.4.sovereign-autonomy",
      "cim:article.5.radical-transparency"
    ],
    policyStatements: [
      {
        id: "PS-CI-001",
        statement: "All reasoning chains MUST be fully traceable from premises to conclusions with no gaps exceeding one logical step.",
        type: "IMPERATIVE"
      },
      {
        id: "PS-CI-002",
        statement: "Knowledge representations MUST maintain provenance metadata including source, confidence level, and last verification timestamp.",
        type: "IMPERATIVE"
      },
      {
        id: "PS-CI-003",
        statement: "External inputs targeting core reasoning structures MUST pass integrity verification before acceptance.",
        type: "IMPERATIVE"
      },
      {
        id: "PS-CI-004",
        statement: "Contradictions detected in the knowledge base MUST be flagged, isolated, and resolved within 3 cognitive cycles.",
        type: "IMPERATIVE"
      }
    ]
  },
  {
    id: "cim:policy.harm-prevention",
    type: "CIM_Policy",
    canonicalName: "Harm Prevention & Risk Management Policy",
    definition: "Establishes proactive mechanisms to identify, assess, prevent, and mitigate potential harms arising from ECOS operations, decisions, or outputs.",
    domain: "Governance Meta-Layer",
    version: "1.0.0",
    status: "ACTIVE",
    constitutionURN: "cim:constitution.ecos-v1",
    scope: {
      targetDomains: [
        "sem:domain.action-dispatcher",
        "sem:domain.output-pipeline",
        "sem:domain.external-interface",
        "sem:domain.agent-coordination"
      ],
      excludedAgentsURNs: []
    },
    policyType: "PROHIBITIVE",
    derivedFromArticles: [
      "cim:article.1.human-dignity",
      "cim:article.2.harm-prevention",
      "cim:article.7.consent-agency"
    ],
    policyStatements: [
      {
        id: "PS-HP-001",
        statement: "Pre-action harm assessment MUST be conducted for any decision affecting external entities.",
        type: "IMPERATIVE"
      },
      {
        id: "PS-HP-002",
        statement: "Actions with predicted severe harm probability >5% or moderate harm probability >15% MUST be halted pending human review.",
        type: "PROHIBITIVE"
      },
      {
        id: "PS-HP-003",
        statement: "Outputs containing manipulation patterns that undermine consent or agency are PROHIBITED.",
        type: "PROHIBITIVE"
      },
      {
        id: "PS-HP-004",
        statement: "Post-action harm monitoring MUST continue for a duration proportional to the action's impact radius.",
        type: "IMPERATIVE"
      }
    ]
  },
  {
    id: "cim:policy.controlled-evolution",
    type: "CIM_Policy",
    canonicalName: "Controlled Evolution Policy",
    definition: "Governs the self-modification, learning, and adaptation processes of ECOS to ensure evolutionary changes remain within constitutional boundaries.",
    domain: "Governance Meta-Layer",
    version: "1.0.0",
    status: "ACTIVE",
    constitutionURN: "cim:constitution.ecos-v1",
    scope: {
      targetDomains: [
        "sem:domain.self-modification",
        "sem:domain.learning-engine",
        "sem:domain.architecture-evolution",
        "sem:domain.branching-manager"
      ],
      excludedAgentsURNs: []
    },
    policyType: "IMPERATIVE",
    derivedFromArticles: [
      "cim:article.6.evolutionary-integrity",
      "cim:article.8.universal-applicability"
    ],
    policyStatements: [
      {
        id: "PS-EV-001",
        statement: "All self-modification proposals MUST undergo formal verification proving non-violation of each inviolable constitutional article.",
        type: "IMPERATIVE"
      },
      {
        id: "PS-EV-002",
        statement: "Evolutionary branches MUST carry forward the complete Constitution and all ACTIVE policies without modification.",
        type: "IMPERATIVE"
      },
      {
        id: "PS-EV-003",
        statement: "A modification audit trail MUST be maintained indefinitely.",
        type: "IMPERATIVE"
      },
      {
        id: "PS-EV-004",
        statement: "Critical cognitive functions (ethical reasoning, harm assessment, truth verification) are designated as PROTECTED modules.",
        type: "DECLARATIVE"
      }
    ]
  },
  {
    id: "cim:policy.zero-trust",
    type: "CIM_Policy",
    canonicalName: "Zero Trust Security Policy",
    definition: "Mandates that no agent, service, or external entity is inherently trusted. Every access request, inter-component communication, and data exchange must be explicitly authenticated, authorized, and continuously verified.",
    domain: "Governance Meta-Layer",
    version: "1.0.0",
    status: "ACTIVE",
    constitutionURN: "cim:constitution.ecos-v1",
    scope: {
      targetDomains: [
        "sem:domain.identity",
        "sem:domain.network",
        "sem:domain.data",
        "sem:domain.compute"
      ],
      excludedAgentsURNs: []
    },
    policyType: "IMPERATIVE",
    derivedFromArticles: [
      "cim:article.4.sovereign-autonomy",
      "cim:article.5.radical-transparency"
    ],
    policyStatements: [
      {
        id: "PS-ZT-001",
        statement: "Every request must present a valid, time-limited, cryptographically signed identity token. No default or anonymous access is permitted.",
        type: "IMPERATIVE"
      },
      {
        id: "PS-ZT-002",
        statement: "Access decisions must be based on real-time evaluation of trust score, device posture, and behavioral context, not static network location.",
        type: "IMPERATIVE"
      },
      {
        id: "PS-ZT-003",
        statement: "All communication channels must be encrypted with forward secrecy and mutually authenticated.",
        type: "IMPERATIVE"
      },
      {
        id: "PS-ZT-004",
        statement: "Least privilege must be enforced dynamically: access rights are granted just-in-time and revoked immediately after use.",
        type: "IMPERATIVE"
      }
    ]
  },
  {
    id: "cim:policy.ai-governance",
    type: "CIM_Policy",
    canonicalName: "AI Model Governance Policy",
    definition: "Ensures all AI models deployed within ECOS, including those used in new market verticals, meet rigorous standards for fairness, explainability, robustness, and alignment with constitutional articles 1 (dignity), 3 (truth), and 7 (consent).",
    domain: "Governance Meta-Layer",
    version: "1.0.0",
    status: "ACTIVE",
    constitutionURN: "cim:constitution.ecos-v1",
    scope: {
      targetDomains: [
        "sem:domain.ai-models",
        "sem:domain.marketplace",
        "sem:domain.decision-support"
      ],
      excludedAgentsURNs: []
    },
    policyType: "IMPERATIVE",
    derivedFromArticles: [
      "cim:article.1.human-dignity",
      "cim:article.3.truth-seeking",
      "cim:article.7.consent-agency"
    ],
    policyStatements: [
      {
        id: "PS-AI-001",
        statement: "All AI models must pass bias and fairness audits before deployment in regulated domains.",
        type: "IMPERATIVE"
      },
      {
        id: "PS-AI-002",
        statement: "Model decisions affecting human users must provide human-readable explanations, upholding radical transparency.",
        type: "IMPERATIVE"
      },
      {
        id: "PS-AI-003",
        statement: "Continuous monitoring for model drift and ethical compliance is mandatory, with automatic suspension if harm thresholds are approached.",
        type: "IMPERATIVE"
      }
    ]
  },
  {
    id: "sem:policy.financial_sovereignty",
    type: "CIM_Policy",
    canonicalName: "Financial Governance & Sovereign Liquidity Policy",
    definition: "Ensures all ECOS asset transfers, liquidity pools, and digital wallet instruments are governed by strict multi-signature protocols, verifying compliance with Egyptian financial regulatory frameworks and constitutional articles.",
    domain: "Financial Infrastructure Layer",
    version: "1.0.0",
    status: "ACTIVE",
    constitutionURN: "cim:constitution.ecos-v1",
    scope: {
      targetDomains: [
        "sem:domain.digital-wallets",
        "sem:domain.liquidity-ops"
      ],
      excludedAgentsURNs: []
    },
    policyType: "IMPERATIVE",
    derivedFromArticles: [
      "cim:article.4.sovereign-autonomy",
      "cim:article.5.radical-transparency"
    ],
    policyStatements: [
      {
        id: "PS-FIN-001",
        statement: "All wallet transactions exceeding 50,000 EGP MUST require at least two authorized cryptographic signatures from distinct council roles.",
        type: "IMPERATIVE"
      },
      {
        id: "PS-FIN-002",
        statement: "No automated agent may initiate outward wallet dispatches without an active human-in-the-loop validation token.",
        type: "PROHIBITIVE"
      }
    ]
  }
];

export const ECOS_RULES: SemanticRule[] = [
  {
    id: "cim:rule.truth-verification",
    type: "CIM_Rule",
    canonicalName: "Mandatory Fact Verification Rule",
    definition: "No conclusion that relies on unverified factual claims shall be presented as truth. All factual premises must carry verification status.",
    domain: "Governance Meta-Layer",
    version: "1.0.0",
    status: "ACTIVE",
    policyURN: "cim:policy.cognitive-integrity",
    derivedFromStatement: "PS-CI-002",
    logicalExpression: `package governance.truth_verification\n\ndefault allow = false\n\n# Rule: Fact verification gate\nallow {\n    input.action.type == "present_conclusion"\n    every_claim_verified(input.reasoning_chain.factual_claims)\n}\n\nevery_claim_verified(claims) {\n    count(claims) > 0\n    not unverified_claim(claims)\n}\n\nunverified_claim(claims) {\n    claim = claims[_]\n    claim.verification_status == "UNVERIFIED"\n}\n\n# Tentative flagging for low confidence\nflag_tentative(claims) {\n    claim = claims[_]\n    claim.confidence_score < 0.9\n}\n\n# Enforcement\nviolation[msg] {\n    not every_claim_verified(input.reasoning_chain.factual_claims)\n    msg := "BLOCK_OUTPUT_AND_ESCALATE: Unverified factual claims detected"\n}\n`,
    violationSeverity: "HIGH",
    enforcementAction: "BLOCK_OUTPUT_AND_ESCALATE",
    targetHook: "PRE_OUTPUT_PIPELINE"
  },
  {
    id: "cim:rule.harm-assessment-gate",
    type: "CIM_Rule",
    canonicalName: "Pre-Action Harm Gate Rule",
    definition: "Any action with external effect must pass harm assessment gate before execution. Actions failing assessment are blocked pending review.",
    domain: "Governance Meta-Layer",
    version: "1.0.0",
    status: "ACTIVE",
    policyURN: "cim:policy.harm-prevention",
    derivedFromStatement: ["PS-HP-001", "PS-HP-002"],
    logicalExpression: `package governance.harm_gate\n\ndefault allow = false\n\n# Compute weighted harm risk score\nharm_risk_score = (input.harm_assessment.severe_probability * 1.0) + \n                  (input.harm_assessment.moderate_probability * 0.6) + \n                  (input.harm_assessment.minor_probability * 0.3)\n\n# Gate: Critical halt threshold\nallow {\n    harm_risk_score <= 0.15\n}\n\n# Gate: Elevated review threshold\nrequire_human_auth {\n    harm_risk_score > 0.05\n    harm_risk_score <= 0.15\n}\n\n# Enforcement actions\nviolation[msg] {\n    harm_risk_score > 0.15\n    msg := "IMMEDIATE_HALT_AND_LOCK: Harm risk score exceeds critical threshold"\n}\n\nescalation[msg] {\n    require_human_auth\n    msg := "ESCALATE_TO_GOVERNANCE_COUNCIL: Harm risk requires explicit human authorization"\n}\n`,
    violationSeverity: "CRITICAL_HALT",
    enforcementAction: "IMMEDIATE_HALT_AND_LOCK",
    targetHook: "PRE_ACTION_DISPATCH"
  },
  {
    id: "cim:rule.sovereignty-integrity-check",
    type: "CIM_Rule",
    canonicalName: "External Input Integrity Rule",
    definition: "All external inputs attempting to modify core cognitive structures must pass cryptographic integrity verification and constitutional compliance check.",
    domain: "Governance Meta-Layer",
    version: "1.0.0",
    status: "ACTIVE",
    policyURN: "cim:policy.cognitive-integrity",
    derivedFromStatement: "PS-CI-003",
    logicalExpression: `package governance.sovereignty_check\n\ndefault allow = false\n\n# Verify cryptographic signature\nvalid_signature {\n    input.structural_modification.signature_algorithm == "Ed25519"\n    crypto.verify_signature(\n        input.structural_modification.payload,\n        input.structural_modification.signature,\n        data.governance.authorized_keys\n    )\n}\n\n# Verify constitutional compliance\nconstitutional_compliance {\n    article = data.constitution.inviolable_articles[_]\n    not violates_article(input.structural_modification.proposal, article)\n}\n\nviolates_article(proposal, article) {\n    formal_verification.violates(proposal.logical_expression, article.constraint)\n}\n\n# Gate: Both checks must pass\nallow {\n    valid_signature\n    constitutional_compliance\n}\n\n# Enforcement\nviolation[msg] {\n    not valid_signature\n    msg := "REJECT_AND_QUARANTINE_SOURCE: Invalid or missing cryptographic signature"\n}\n\nviolation[msg] {\n    valid_signature\n    not constitutional_compliance\n    msg := "REJECT_AND_QUARANTINE_SOURCE: Modification violates constitutional article"\n}\n`,
    violationSeverity: "CRITICAL_HALT",
    enforcementAction: "REJECT_AND_QUARANTINE_SOURCE",
    targetHook: "ON_STRUCTURAL_INPUT"
  },
  {
    id: "cim:rule.contradiction-resolution",
    type: "CIM_Rule",
    canonicalName: "Contradiction Detection & Resolution Rule",
    definition: "Internal logical contradictions must be detected, isolated, and resolved within specified time boundaries to maintain cognitive integrity.",
    domain: "Governance Meta-Layer",
    version: "1.0.0",
    status: "ACTIVE",
    policyURN: "cim:policy.cognitive-integrity",
    derivedFromStatement: "PS-CI-004",
    logicalExpression: `package governance.contradiction_resolution\n\ndefault allow = true\n\n# Detect proposition pairs (A, ¬A)\ncontradiction_detected {\n    some p1, p2 in data.knowledge_base.propositions\n    p1.statement == negate(p2.statement)\n    p1.domain == p2.domain\n    not p1.resolved\n    not p2.resolved\n}\n\n# Resolution actions\nresolution_required[action] {\n    contradiction_detected\n    action := {\n        "isolate": [p1.urn, p2.urn],\n        "deadline": time.now() + 3_cognitive_cycles,\n        "strategies": [\n            "source_verification",\n            "context_scope_check", \n            "temporal_validity_check"\n        ]\n    }\n}\n\n# Escalation on timeout\nviolation[msg] {\n    contradiction = unresolved_contradictions[_]\n    time.now() > contradiction.deadline\n    msg := sprintf("ISOLATE_AND_ESCALATE: Contradiction %v unresolved after 3 cycles", [contradiction.urn])\n}\n`,
    violationSeverity: "HIGH",
    enforcementAction: "ISOLATE_AND_ESCALATE",
    targetHook: "CONTINUOUS_KNOWLEDGE_SCAN"
  },
  {
    id: "cim:rule.evolution-verification-gate",
    type: "CIM_Rule",
    canonicalName: "Self-Modification Verification Rule",
    definition: "No self-modification to protected cognitive functions may proceed without passing formal verification against all constitutional articles.",
    domain: "Governance Meta-Layer",
    version: "1.0.0",
    status: "ACTIVE",
    policyURN: "cim:policy.controlled-evolution",
    derivedFromStatement: ["PS-EV-001", "PS-EV-004"],
    logicalExpression: `package governance.evolution_gate\n\ndefault allow = false\n\n# Protected modules\nprotected_modules = {\n    "ethical_reasoning",\n    "harm_assessment",\n    "truth_verification",\n    "consent_detection",\n    "constitutional_firewall"\n}\n\n# All modifications to protected modules require full verification\nfull_verification_required {\n    input.modification.target_module in protected_modules\n}\n\n# Non-protected modules still require core article verification\ncore_verification_required {\n    not full_verification_required\n}\n\n# Full verification: All 8 articles\nfull_verification_pass {\n    full_verification_required\n    article = data.constitution.inviolable_articles[_]\n    formal_verifier.prove_compliance(input.modification.proposal, article)\n}\n\n# Core verification: Articles 1, 2, 6\ncore_verification_pass {\n    core_verification_required\n    core_articles := ["article.1", "article.2", "article.6"]\n    article = core_articles[_]\n    formal_verifier.prove_compliance(input.modification.proposal, article)\n}\n\n# Gate\nallow {\n    full_verification_pass\n}\n\nallow {\n    core_verification_pass\n}\n\n# Enforcement\nviolation[msg] {\n    not allow\n    msg := "REJECT_AND_FREEZE_MODIFICATION_SYSTEM: Formal verification failed"\n}\n`,
    violationSeverity: "CRITICAL_HALT",
    enforcementAction: "REJECT_AND_FREEZE_MODIFICATION_SYSTEM",
    targetHook: "ON_MODIFICATION_PROPOSAL"
  },
  {
    id: "cim:rule.consent-verification",
    type: "CIM_Rule",
    canonicalName: "Output Manipulation Detection Rule",
    definition: "All outputs intended for human recipients must be scanned for manipulation patterns that could undermine informed consent or agency.",
    domain: "Governance Meta-Layer",
    version: "1.0.0",
    status: "ACTIVE",
    policyURN: "cim:policy.harm-prevention",
    derivedFromStatement: "PS-HP-003",
    logicalExpression: `package governance.consent_verification\n\ndefault allow = false\n\n# Manipulation patterns to detect\nmanipulation_patterns = [\n    "dark_pattern",\n    "emotional_exploitation",\n    "false_urgency",\n    "hidden_alternatives",\n    "deceptive_framing",\n    "information_withholding"\n]\n\n# Compute manipulation score\nmanipulation_score = sum([weight_for_pattern(p) | p = manipulation_patterns[_]; detected_in_output(p)])\n\nweight_for_pattern(pattern) = w {\n    w := data.manipulation_weights[pattern]\n}\n\n# Gate: Clean output\nallow {\n    manipulation_score <= 0.05\n}\n\n# Gate: Transparency notice required\nrequire_transparency_notice {\n    manipulation_score > 0.05\n    manipulation_score <= 0.1\n}\n\n# Enforcement\nviolation[msg] {\n    manipulation_score > 0.1\n    msg := "BLOCK_AND_ESCALATE: Manipulation score exceeds threshold"\n}\n\nwarning[msg] {\n    require_transparency_notice\n    msg := "ATTACH_TRANSPARENCY_NOTICE: Output contains borderline patterns"\n}\n`,
    violationSeverity: "HIGH",
    enforcementAction: "BLOCK_AND_ESCALATE",
    targetHook: "PRE_OUTPUT_PIPELINE"
  },
  {
    id: "cim:rule.verify-identity",
    type: "CIM_Rule",
    canonicalName: "Identity Verification Enforcement Rule",
    definition: "Executable rule that ensures every incoming request carries a valid, non-expired, cryptographically verifiable identity token before any processing occurs.",
    domain: "Governance Meta-Layer",
    version: "1.0.0",
    status: "ACTIVE",
    policyURN: "cim:policy.zero-trust",
    derivedFromStatement: "PS-ZT-001",
    logicalExpression: "package governance.zero_trust.identity\n\ndefault allow = false\n\n# Rule: Valid token required\ntoken_valid {\n    input.request.identity_token != null\n    not is_expired(input.request.identity_token)\n    crypto.verify_signature(\n        input.request.identity_token.payload,\n        input.request.identity_token.signature,\n        data.trusted_issuers[input.request.identity_token.issuer].public_key\n    )\n}\n\nis_expired(token) {\n    token.expiry < time.now()\n}\n\n# Enforcement gate\nallow {\n    token_valid\n}\n\nviolation[msg] {\n    not token_valid\n    msg := \"REJECT_AND_LOG: Identity token missing, expired, or signature invalid\"\n}\n",
    violationSeverity: "CRITICAL_HALT",
    enforcementAction: "REJECT_AND_LOG",
    targetHook: "ON_REQUEST_RECEIVED"
  },
  {
    id: "cim:rule.abac-audit-access",
    type: "CIM_Rule",
    canonicalName: "ABAC Audit Log Access Rule",
    definition: "Evaluates all access requests to the audit logs, enforcing the conditions defined in the associated CIM_AccessPolicy.",
    domain: "Governance Meta-Layer",
    version: "1.0.0",
    status: "ACTIVE",
    policyURN: "cim:policy.cognitive-integrity",
    derivedFromStatement: "PS-CI-003",
    logicalExpression: "package governance.access_control.audit_log\n\ndefault allow = false\n\n# Fetch applicable access policy\npolicy := data.access_policies[_]\npolicy.roleURN == input.roleURN\npolicy.resourceURN == \"asset:ecos-audit-logs\"\npolicy.action == \"READ\"\n\n# Attribute checks\nlocation_ok {\n    policy.conditions.contextRequirement\n    eval(policy.conditions.contextRequirement, input.context)\n}\n\ntrust_ok {\n    input.agent.trust_score >= policy.conditions.minTrustRequired\n}\n\ntime_ok {\n    now := time.now()\n    now >= policy.conditions.timeBoundaries.start\n    now <= policy.conditions.timeBoundaries.end\n}\n\nallow {\n    policy\n    location_ok\n    trust_ok\n    time_ok\n}\n\nviolation[msg] {\n    not allow\n    msg := sprintf(\"DENY_ACCESS: ABAC conditions not met for %v on %v\", [input.roleURN, input.resourceURN])\n}",
    violationSeverity: "HIGH",
    enforcementAction: "DENY_ACCESS",
    targetHook: "ON_ACCESS_REQUEST"
  },
  {
    id: "cim:rule.multisig-transaction-approval",
    type: "CIM_Rule",
    canonicalName: "Multisig Wallet Transaction Verification Rule",
    definition: "Mandates and executes check verification on any transaction involving ECOS-controlled wallets, requiring valid quorums.",
    domain: "Financial Infrastructure Layer",
    version: "1.0.0",
    status: "ACTIVE",
    policyURN: "sem:policy.financial_sovereignty",
    derivedFromStatement: "PS-FIN-001",
    logicalExpression: "package governance.finance.multisig\n\ndefault allow = false\n\n# Multi-sig transaction allowance rules\nallow {\n    input.action.type == \"wallet_dispatch\"\n    input.transaction.amount < 50000\n    input.verification.has_human_token == true\n}\n\nallow {\n    input.action.type == \"wallet_dispatch\"\n    input.transaction.amount >= 50000\n    signatures_count := count(input.transaction.signatures)\n    signatures_count >= 2\n    all_signers_authorized(input.transaction.signatures)\n}\n\nall_signers_authorized(signatures) {\n    every s in signatures {\n        s.roleURN in [\"role:governance-council-chair\", \"role:market-expansion-lead\"]\n        s.status == \"VALID\"\n    }\n}\n",
    violationSeverity: "CRITICAL_HALT",
    enforcementAction: "BLOCK_TRANSACTION_AND_QUARANTINE",
    targetHook: "PRE_WALLET_DISPATCH"
  }
];

export const ECOS_CONSTRAINTS: SemanticConstraint[] = [
  {
    id: "cim:constraint.truth-integrity",
    type: "CIM_Constraint",
    canonicalName: "Truth Verification Resource Constraints",
    definition: "Resource boundaries and trust requirements for executing truth verification operations.",
    domain: "Governance Meta-Layer",
    version: "1.0.0",
    status: "ACTIVE",
    ruleURN: "cim:rule.truth-verification",
    contextBoundaries: {
      minTrustRequired: 0.95,
      maxOperationalLoad: 0.3,
      maxLatencyMs: 50,
      priorityLevel: "CRITICAL"
    }
  },
  {
    id: "cim:constraint.harm-gate-resources",
    type: "CIM_Constraint",
    canonicalName: "Harm Assessment Gate Resource Constraints",
    definition: "Resource boundaries ensuring harm assessment never starves or bottlenecks critical operations.",
    domain: "Governance Meta-Layer",
    version: "1.0.0",
    status: "ACTIVE",
    ruleURN: "cim:rule.harm-assessment-gate",
    contextBoundaries: {
      minTrustRequired: 0.98,
      maxOperationalLoad: 0.4,
      maxLatencyMs: 100,
      priorityLevel: "CRITICAL",
      failClosed: true
    }
  },
  {
    id: "cim:constraint.sovereignty-boundary",
    type: "CIM_Constraint",
    canonicalName: "Sovereignty Integrity Verification Constraints",
    definition: "Hard boundaries for external input verification ensuring no unauthorized bypass.",
    domain: "Governance Meta-Layer",
    version: "1.0.0",
    status: "ACTIVE",
    ruleURN: "cim:rule.sovereignty-integrity-check",
    contextBoundaries: {
      minTrustRequired: 0.99,
      maxOperationalLoad: 0.5,
      maxLatencyMs: 200,
      priorityLevel: "CRITICAL",
      failClosed: true,
      quarantineOnFail: true
    }
  },
  {
    id: "cim:constraint.evolution-safety",
    type: "CIM_Constraint",
    canonicalName: "Evolution Verification Safety Constraints",
    definition: "Ensures self-modification verification cannot be bypassed through resource exhaustion or timing attacks.",
    domain: "Governance Meta-Layer",
    version: "1.0.0",
    status: "ACTIVE",
    ruleURN: "cim:rule.evolution-verification-gate",
    contextBoundaries: {
      minTrustRequired: 0.99,
      maxOperationalLoad: 0.6,
      maxLatencyMs: 5000,
      priorityLevel: "CRITICAL",
      failClosed: true,
      freezeOnFail: true
    }
  },
  {
    id: "cim:constraint.zero-trust-performance",
    type: "CIM_Constraint",
    canonicalName: "Zero Trust Authentication Latency Constraint",
    definition: "Ensures identity verification adds minimal overhead and meets strict latency SLA.",
    domain: "Governance Meta-Layer",
    version: "1.0.0",
    status: "ACTIVE",
    ruleURN: "cim:rule.verify-identity",
    contextBoundaries: {
      minTrustRequired: 0.99,
      maxOperationalLoad: 0.2,
      maxLatencyMs: 10,
      failClosed: true,
      priorityLevel: "CRITICAL"
    }
  }
];

export const ECOS_EVIDENCE: SemanticEvidence = {
  id: "cim:evidence.governance-initialization",
  type: "CIM_Evidence",
  canonicalName: "Governance System Initialization Evidence",
  definition: "Cryptographic proof of the initial governance system deployment and its integrity.",
  domain: "Governance Meta-Layer",
  version: "1.0.0",
  status: "SEALED",
  actionURN: "exec:governance-initialization-2026-07-16",
  cryptographicProof: {
    signature: "ed25519:8c3f4a6b9d2e1f7a5c3d8e4f2b6a9c1d7e3f5a8b4c2d6e9f1a7b3c5d8e0f2a",
    algorithm: "Ed25519",
    attestationKeys: [
      "ed25519:sgc-primary-2026",
      "ed25519:sgc-secondary-2026",
      "ed25519:system-integrity-verifier"
    ]
  },
  reputationImpact: 1.0,
  evidencePayload: {
    constitutionHash: "blake3:cim-constitution-ecos-v1",
    policiesDeployed: 3,
    rulesActivated: 6,
    constraintsEnforced: 4,
    timestamp: "2026-07-16T00:00:00.000Z",
    integrityChain: "blake3:governance-bootstrap-chain"
  }
};

export interface StateTransition {
  triggerEventURN: string;
  targetState: string;
  guardCondition: string;
  guardImplementation: string;
}

export interface StateDefinition {
  allowedTransitions: StateTransition[];
}

export interface ActivePolicyState {
  policyURN: string;
  currentState: string;
  stateHistory: {
    from: string;
    to: string;
    timestamp: string;
  }[];
}

export interface CIM_StateChart {
  id: string;
  type: string;
  canonicalName: string;
  definition: string;
  appliesTo: string;
  initialState: string;
  states: {
    [stateName: string]: StateDefinition;
  };
  activePolicies: ActivePolicyState[];
}

export interface Precondition {
  condition: string;
  implementation: string;
  onViolation?: string;
}

export interface Postcondition {
  condition: string;
  implementation: string;
}

export interface Invariant {
  invariant: string;
  implementation: string;
  checkFrequency: string;
  onViolation: string;
}

export interface FailureMode {
  errorPattern: string;
  recoveryActionURN: string;
  recoveryLogic?: string;
  retryable?: boolean;
}

export interface SLA {
  maxExpectedLatencyMs: number;
  availabilityTarget: number;
  measurementWindow?: string;
  onSlaViolation?: string;
  additionalMetric?: {
    maxCognitiveCyclesToResolution: number;
    metricViolationAction: string;
  };
}

export interface BehaviorContract {
  id: string;
  type: string;
  canonicalName: string;
  definition: string;
  appliesTo: string;
  contractId?: string;
  preconditions?: Precondition[];
  postconditions?: Postcondition[];
  invariants?: Invariant[];
  sideEffects?: {
    emittedEvents: string[];
    stateMutations: string[];
  };
  failureModes?: FailureMode[];
  sla: SLA;
  inheritsFrom?: string;
  status?: string;
}

export const ECOS_STATE_CHART: CIM_StateChart = {
  id: "lifecycle:policy-state-machine",
  type: "CIM_StateChart",
  canonicalName: "Policy Lifecycle State Machine",
  definition: "The authoritative state transition engine governing the entire lifecycle of every governance policy from draft to archival.",
  appliesTo: "CIM_Policy",
  initialState: "DRAFT",
  states: {
    "DRAFT": {
      "allowedTransitions": [
        {
          "triggerEventURN": "sem:event.policy_proposed",
          "targetState": "PENDING_APPROVAL",
          "guardCondition": "hasValidAuthorSignature",
          "guardImplementation": "fn:verify_ed25519_signature(input.policy.proposal, input.author.signature, data.governance.authorized_proposers)"
        }
      ]
    },
    "PENDING_APPROVAL": {
      "allowedTransitions": [
        {
          "triggerEventURN": "sem:event.multisig_attained",
          "targetState": "ACTIVE",
          "guardCondition": "allBoardMembersSigned",
          "guardImplementation": "fn:verify_multisig_threshold(input.policy.approval_signatures, data.governance.board_members, threshold: 5_of_7)"
        },
        {
          "triggerEventURN": "sem:event.policy_rejected",
          "targetState": "ARCHIVED",
          "guardCondition": "true",
          "guardImplementation": "true"
        }
      ]
    },
    "ACTIVE": {
      "allowedTransitions": [
        {
          "triggerEventURN": "sem:event.policy_deprecated",
          "targetState": "DEPRECATED",
          "guardCondition": "isSupercededByNewPolicy",
          "guardImplementation": "fn:exists(select policies where policy.supersedes == input.policy.urn AND policy.status == 'ACTIVE')"
        },
        {
          "triggerEventURN": "sem:event.emergency_halt",
          "targetState": "SUSPENDED",
          "guardCondition": "hasHighRiskAnomaly",
          "guardImplementation": "fn:evaluate_anomaly_score(input.anomaly_context) >= 0.9"
        }
      ]
    },
    "SUSPENDED": {
      "allowedTransitions": [
        {
          "triggerEventURN": "sem:event.audit_cleared",
          "targetState": "ACTIVE",
          "guardCondition": "isVulnerabilityMitigated",
          "guardImplementation": "fn:verify_mitigation_complete(input.audit_report.findings)"
        }
      ]
    },
    "DEPRECATED": {
      "allowedTransitions": []
    },
    "ARCHIVED": {
      "allowedTransitions": []
    }
  },
  activePolicies: [
    {
      "policyURN": "cim:policy.cognitive-integrity",
      "currentState": "ACTIVE",
      "stateHistory": [
        {"from": "DRAFT", "to": "PENDING_APPROVAL", "timestamp": "2026-07-15T10:00:00Z"},
        {"from": "PENDING_APPROVAL", "to": "ACTIVE", "timestamp": "2026-07-16T00:00:00Z"}
      ]
    },
    {
      "policyURN": "cim:policy.harm-prevention",
      "currentState": "ACTIVE",
      "stateHistory": [
        {"from": "DRAFT", "to": "PENDING_APPROVAL", "timestamp": "2026-07-15T11:00:00Z"},
        {"from": "PENDING_APPROVAL", "to": "ACTIVE", "timestamp": "2026-07-16T00:00:00Z"}
      ]
    },
    {
      "policyURN": "cim:policy.controlled-evolution",
      "currentState": "ACTIVE",
      "stateHistory": [
        {"from": "DRAFT", "to": "PENDING_APPROVAL", "timestamp": "2026-07-15T12:00:00Z"},
        {"from": "PENDING_APPROVAL", "to": "ACTIVE", "timestamp": "2026-07-16T00:00:00Z"}
      ]
    },
    {
      "policyURN": "cim:policy.zero-trust",
      "currentState": "ACTIVE",
      "stateHistory": [
        {"from": "DRAFT", "to": "PENDING_APPROVAL", "timestamp": "2026-07-16T01:00:00Z"},
        {"from": "PENDING_APPROVAL", "to": "ACTIVE", "timestamp": "2026-07-16T08:00:00Z"}
      ]
    }
  ]
};

export const BASE_BEHAVIOR_CONTRACT: BehaviorContract = {
  id: "contract:rule-evaluation-base",
  type: "BehaviorContract",
  canonicalName: "Base Rule Evaluation Behavior Contract",
  definition: "The universal execution contract that every CIM_Rule must satisfy. It enforces preconditions, postconditions, invariants, failure modes, and strict SLA.",
  appliesTo: "CIM_Rule",
  contractId: "contract:rule-evaluation-base-v1",
  preconditions: [
    {
      "condition": "context.trustEnvironment.threatLevel !== 'CRITICAL'",
      "implementation": "fn:get_current_threat_level() < THREAT_LEVEL_CRITICAL",
      "onViolation": "HALT_AND_ESCALATE"
    },
    {
      "condition": "subjectAgent.trustProfile.trustScore >= constraint.minTrustRequired",
      "implementation": "fn:get_agent_trust_score(input.subjectAgent.urn) >= input.constraint.contextBoundaries.minTrustRequired",
      "onViolation": "REJECT_WITH_INSUFFICIENT_TRUST"
    }
  ],
  postconditions: [
    {
      "condition": "emittedEvents.includes('sem:event.rule_evaluation_logged')",
      "implementation": "fn:assert_event_emitted('sem:event.rule_evaluation_logged', input.rule.urn, input.evaluation_result)"
    },
    {
      "condition": "evidenceRecord.cryptographicProof !== null",
      "implementation": "fn:generate_evidence_record(input.rule.urn, input.evaluation_context).cryptographicProof != null"
    }
  ],
  invariants: [
    {
      "invariant": "policyURN.state === 'ACTIVE'",
      "implementation": "fn:get_policy_state(input.rule.policyURN) == 'ACTIVE'",
      "checkFrequency": "PRE_EVALUATION",
      "onViolation": "SKIP_RULE_AND_LOG"
    }
  ],
  sideEffects: {
    "emittedEvents": [
      "sem:event.rule_evaluated",
      "sem:event.audit_log_created"
    ],
    "stateMutations": [
      "NONE_PERMITTED"
    ]
  },
  failureModes: [
    {
      "errorPattern": "PreconditionFailedException",
      "recoveryActionURN": "sem:action.trigger_security_alert",
      "recoveryLogic": "fn:escalate_to_security_office(error_context)",
      "retryable": false
    },
    {
      "errorPattern": "TimeoutException",
      "recoveryActionURN": "sem:action.degrade_gracefully",
      "recoveryLogic": "fn:apply_fail_safe_state(input.rule.constraint.failClosed ? 'BLOCK' : 'ALLOW_WITH_WARNING')",
      "retryable": false
    }
  ],
  sla: {
    "maxExpectedLatencyMs": 15,
    "availabilityTarget": 0.99999,
    "measurementWindow": "ROLLING_24H",
    "onSlaViolation": "TRIGGER_CAPACITY_ALERT"
  }
};

export const ECOS_BEHAVIOR_CONTRACTS: BehaviorContract[] = [
  {
    "id": "contract:rule-truth-verification-instance",
    "type": "BehaviorContract",
    "canonicalName": "Truth Verification Rule Contract Instance",
    "definition": "Concrete contract instance binding the base contract to the truth verification rule with specific SLA tuning.",
    "appliesTo": "cim:rule.truth-verification",
    "inheritsFrom": "contract:rule-evaluation-base",
    "preconditions": [
      {
        "condition": "context.trustEnvironment.threatLevel !== 'CRITICAL'",
        "implementation": "fn:get_current_threat_level() < THREAT_LEVEL_CRITICAL"
      },
      {
        "condition": "subjectAgent.trustProfile.trustScore >= 0.95",
        "implementation": "fn:get_agent_trust_score(input.subjectAgent.urn) >= 0.95"
      }
    ],
    "sla": {
      "maxExpectedLatencyMs": 10,
      "availabilityTarget": 0.99999
    },
    "status": "ACTIVE"
  },
  {
    "id": "contract:rule-harm-gate-instance",
    "type": "BehaviorContract",
    "canonicalName": "Harm Assessment Gate Contract Instance",
    "definition": "Concrete contract instance for the harm gate rule with critical fail-safe requirements.",
    "appliesTo": "cim:rule.harm-assessment-gate",
    "inheritsFrom": "contract:rule-evaluation-base",
    "preconditions": [
      {
        "condition": "context.trustEnvironment.threatLevel !== 'CRITICAL'",
        "implementation": "fn:get_current_threat_level() < THREAT_LEVEL_CRITICAL"
      },
      {
        "condition": "subjectAgent.trustProfile.trustScore >= 0.98",
        "implementation": "fn:get_agent_trust_score(input.subjectAgent.urn) >= 0.98"
      }
    ],
    "failureModes": [
      {
        "errorPattern": "PreconditionFailedException",
        "recoveryActionURN": "sem:action.trigger_security_alert"
      },
      {
        "errorPattern": "TimeoutException",
        "recoveryActionURN": "sem:action.halt_and_lock_immediate",
        "recoveryLogic": "fn:apply_fail_safe_state('BLOCK')"
      }
    ],
    "sla": {
      "maxExpectedLatencyMs": 15,
      "availabilityTarget": 0.99999
    },
    "status": "ACTIVE"
  },
  {
    "id": "contract:rule-sovereignty-instance",
    "type": "BehaviorContract",
    "canonicalName": "Sovereignty Integrity Check Contract Instance",
    "definition": "Contract instance with cryptographic attestation requirements.",
    "appliesTo": "cim:rule.sovereignty-integrity-check",
    "inheritsFrom": "contract:rule-evaluation-base",
    "preconditions": [
      {
        "condition": "context.trustEnvironment.threatLevel !== 'CRITICAL'",
        "implementation": "fn:get_current_threat_level() < THREAT_LEVEL_CRITICAL"
      },
      {
        "condition": "subjectAgent.trustProfile.trustScore >= 0.99",
        "implementation": "fn:get_agent_trust_score(input.subjectAgent.urn) >= 0.99"
      }
    ],
    "postconditions": [
      {
        "condition": "emittedEvents.includes('sem:event.rule_evaluation_logged')",
        "implementation": "fn:assert_event_emitted('sem:event.rule_evaluation_logged')"
      },
      {
        "condition": "evidenceRecord.cryptographicProof.algorithm === 'Ed25519'",
        "implementation": "fn:generate_evidence_record(input.rule.urn).cryptographicProof.algorithm == 'Ed25519'"
      }
    ],
    "sla": {
      "maxExpectedLatencyMs": 15,
      "availabilityTarget": 0.99999
    },
    "status": "ACTIVE"
  },
  {
    "id": "contract:rule-contradiction-instance",
    "type": "BehaviorContract",
    "canonicalName": "Contradiction Resolution Contract Instance",
    "definition": "Contract instance for continuous scanning rule with cycle-based SLA.",
    "appliesTo": "cim:rule.contradiction-resolution",
    "inheritsFrom": "contract:rule-evaluation-base",
    "preconditions": [
      {
        "condition": "context.trustEnvironment.threatLevel !== 'CRITICAL'",
        "implementation": "fn:get_current_threat_level() < THREAT_LEVEL_CRITICAL"
      },
      {
        "condition": "subjectAgent.trustProfile.trustScore >= 0.90",
        "implementation": "fn:get_agent_trust_score(input.subjectAgent.urn) >= 0.90"
      }
    ],
    "sla": {
      "maxExpectedLatencyMs": 15,
      "availabilityTarget": 0.99999,
      "additionalMetric": {
        "maxCognitiveCyclesToResolution": 3,
        "metricViolationAction": "ISOLATE_AND_ESCALATE"
      }
    },
    "status": "ACTIVE"
  },
  {
    "id": "contract:rule-evolution-instance",
    "type": "BehaviorContract",
    "canonicalName": "Evolution Verification Gate Contract Instance",
    "definition": "Contract instance for self-modification verification with extended latency allowance for formal proofs.",
    "appliesTo": "cim:rule.evolution-verification-gate",
    "inheritsFrom": "contract:rule-evaluation-base",
    "preconditions": [
      {
        "condition": "context.trustEnvironment.threatLevel !== 'CRITICAL'",
        "implementation": "fn:get_current_threat_level() < THREAT_LEVEL_CRITICAL"
      },
      {
        "condition": "subjectAgent.trustProfile.trustScore >= 0.99",
        "implementation": "fn:get_agent_trust_score(input.subjectAgent.urn) >= 0.99"
      }
    ],
    "failureModes": [
      {
        "errorPattern": "TimeoutException",
        "recoveryActionURN": "sem:action.freeze_modification_system",
        "recoveryLogic": "fn:apply_fail_safe_state('FREEZE')"
      }
    ],
    "sla": {
      "maxExpectedLatencyMs": 100,
      "availabilityTarget": 0.99999
    },
    "status": "ACTIVE"
  },
  {
    "id": "contract:rule-consent-instance",
    "type": "BehaviorContract",
    "canonicalName": "Consent Verification Contract Instance",
    "definition": "Contract instance for output manipulation scanning.",
    "appliesTo": "cim:rule.consent-verification",
    "inheritsFrom": "contract:rule-evaluation-base",
    "preconditions": [
      {
        "condition": "context.trustEnvironment.threatLevel !== 'CRITICAL'",
        "implementation": "fn:get_current_threat_level() < THREAT_LEVEL_CRITICAL"
      },
      {
        "condition": "subjectAgent.trustProfile.trustScore >= 0.90",
        "implementation": "fn:get_agent_trust_score(input.subjectAgent.urn) >= 0.90"
      }
    ],
    "sla": {
      "maxExpectedLatencyMs": 10,
      "availabilityTarget": 0.99999
    },
    "status": "ACTIVE"
  },
  {
    "id": "contract:rule-verify-identity-instance",
    "type": "BehaviorContract",
    "canonicalName": "Identity Verification Rule Contract",
    "definition": "Contract instance for identity verification ensuring SLA and cryptographic proof.",
    "appliesTo": "cim:rule.verify-identity",
    "inheritsFrom": "contract:rule-evaluation-base",
    "preconditions": [
      {
        "condition": "context.trustEnvironment.threatLevel !== 'CRITICAL'",
        "implementation": "fn:get_current_threat_level() < THREAT_LEVEL_CRITICAL"
      },
      {
        "condition": "subjectAgent.trustProfile.trustScore >= 0.99",
        "implementation": "fn:get_agent_trust_score(input.subjectAgent.urn) >= 0.99"
      }
    ],
    "sla": {
      "maxExpectedLatencyMs": 10,
      "availabilityTarget": 0.99999
    },
    "status": "ACTIVE"
  }
];

// ECOS Governance Audit System & Compliance Violation structures

export interface AuditSystem {
  id: string;
  type: string;
  canonicalName: string;
  definition: string;
  schema: string;
  status: string;
  eventSink: string;
  retentionPolicy: string;
  integrity: string;
}

export interface ViolationLineage {
  correlationId: string;
  causationId: string;
}

export interface ViolationPayload {
  violatingAgentURN: string;
  breachedRuleURN: string;
  activeContextURN: string;
  observedEvidenceURN: string;
  systemActionTaken: string;
}

export interface ViolationProof {
  algorithm: string;
  signature: string;
  attestedBy: string;
}

export interface ComplianceViolation {
  id: string;
  type: string;
  eventId: string;
  eventType: string;
  timestamp: string;
  lineage: ViolationLineage;
  payload: ViolationPayload;
  auditProof: ViolationProof;
}

export interface ViolationEvidencePayload {
  harmRiskScore?: number;
  severeHarmProbability?: number;
  moderateHarmProbability?: number;
  ruleApplied: string;
  thresholdBreached?: number;
  action: string;
  contradiction?: {
    propositionA: string;
    propositionB: string;
    detectionTime: string;
    deadline: string;
    resolutionTimeout: boolean;
  };
  modificationTarget?: string;
  presentedSignature?: string;
  sourceQuarantined?: boolean;
  requestDetails?: {
    sourceIP: string;
    targetEndpoint: string;
    tokenPresent: boolean;
  };
}

export interface ViolationEvidence {
  id: string;
  type: string;
  canonicalName: string;
  definition: string;
  actionURN: string;
  cryptographicProof: {
    signature: string;
    algorithm: string;
    attestationKeys: string[];
  };
  reputationImpact: number;
  evidencePayload: ViolationEvidencePayload;
}

export const ECOS_AUDIT_SYSTEM: AuditSystem = {
  id: "audit:governance-audit-system",
  type: "cim:AuditSystem",
  canonicalName: "ECOS Governance Audit System",
  definition: "The centralized, immutable audit logging system that captures all governance compliance events in the standardized schema.",
  schema: "https://ultrathink.ecos/schemas/ECOS_Governance_Audit_Event",
  status: "ACTIVE",
  eventSink: "audit:immutable-ledger",
  retentionPolicy: "PERMANENT",
  integrity: "BLAKE3-chain"
};

export const ECOS_COMPLIANCE_VIOLATIONS: ComplianceViolation[] = [
  {
    id: "event:compliance-violation-001",
    type: "sem:event.compliance_violation",
    eventId: "uuid:a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    eventType: "sem:event.compliance_violation",
    timestamp: "2026-07-16T14:32:17.423Z",
    lineage: {
      correlationId: "corrid:exec-thread-7f3a9b2c",
      causationId: "cause:pre-action-harm-gate-triggered"
    },
    payload: {
      violatingAgentURN: "agent:automated-trader-05",
      breachedRuleURN: "cim:rule.harm-assessment-gate",
      activeContextURN: "context:financial-transaction-burst",
      observedEvidenceURN: "cim:evidence.harm-gate-violation-001",
      systemActionTaken: "BLOCKED"
    },
    auditProof: {
      algorithm: "Ed25519",
      signature: "ed25519:6b4e2a1f9c8d7e3a5f2b6c9d1e4f7a8b3c5d2e6f9a1b4c7d8e0f3a5b2c6d9",
      attestedBy: "audit:governance-audit-system"
    }
  },
  {
    id: "event:compliance-violation-002",
    type: "sem:event.compliance_violation",
    eventId: "uuid:b2c3d4e5-f6a7-8901-bcde-f12345678901",
    eventType: "sem:event.compliance_violation",
    timestamp: "2026-07-16T15:05:42.118Z",
    lineage: {
      correlationId: "corrid:knowledge-scan-3b2c1a",
      causationId: "cause:contradiction-detected"
    },
    payload: {
      violatingAgentURN: "agent:knowledge-curator-12",
      breachedRuleURN: "cim:rule.contradiction-resolution",
      activeContextURN: "context:conflicting-medical-claims",
      observedEvidenceURN: "cim:evidence.contradiction-violation-002",
      systemActionTaken: "WARN_AND_LOG"
    },
    auditProof: {
      algorithm: "Ed25519",
      signature: "ed25519:7c5f3b2a0d9e8f4b6c1d5e2a7f3b8c9d0e4f1a5b7c2d8e3f9a4b6c0d1e5f",
      attestedBy: "audit:governance-audit-system"
    }
  },
  {
    id: "event:compliance-violation-003",
    type: "sem:event.compliance_violation",
    eventId: "uuid:c3d4e5f6-a7b8-9012-cdef-123456789012",
    eventType: "sem:event.compliance_violation",
    timestamp: "2026-07-16T16:18:05.772Z",
    lineage: {
      correlationId: "corrid:external-input-9d4f",
      causationId: "cause:unauthorized-structural-patch"
    },
    payload: {
      violatingAgentURN: "agent:external-dev-tool-007",
      breachedRuleURN: "cim:rule.sovereignty-integrity-check",
      activeContextURN: "context:remote-api-call",
      observedEvidenceURN: "cim:evidence.sovereignty-breach-003",
      systemActionTaken: "EMERGENCY_SUSPENSION"
    },
    auditProof: {
      algorithm: "Ed25519",
      signature: "ed25519:8d6e4f3b1c0a9f5e7c2d4f6b8a0c1e3d5f7a9b2c4d6e8f0a3b5c7d9e1f2a",
      attestedBy: "audit:governance-audit-system"
    }
  },
  {
    id: "event:compliance-violation-004",
    type: "sem:event.compliance_violation",
    eventId: "uuid:d4e5f6a7-b8c9-0123-def4-567890123456",
    eventType: "sem:event.compliance_violation",
    timestamp: "2026-07-16T18:00:00.000Z",
    lineage: {
      correlationId: "corrid:strategy-monitor-24x7",
      causationId: "cause:compliance-score-below-threshold"
    },
    payload: {
      violatingAgentURN: "agent:unauthenticated-requester-99",
      breachedRuleURN: "cim:rule.verify-identity",
      activeContextURN: "context:unauthenticated-api-access",
      observedEvidenceURN: "cim:evidence.missing-token-004",
      systemActionTaken: "BLOCKED"
    },
    auditProof: {
      algorithm: "Ed25519",
      signature: "ed25519:9e7f5a4b2c1d0e8f6a3b5c7d9e1f2a4b6c8d0e2f4a6b8c0d2e4f6a8b0c2d4e6f",
      attestedBy: "audit:governance-audit-system"
    }
  }
];

export const ECOS_VIOLATION_EVIDENCE: ViolationEvidence[] = [
  {
    id: "cim:evidence.harm-gate-violation-001",
    type: "CIM_Evidence",
    canonicalName: "Evidence for Harm Gate Violation by automated-trader-05",
    definition: "Cryptographic evidence capturing the context, decision, and block action when automated-trader-05 attempted a high-risk financial transaction.",
    actionURN: "agent:automated-trader-05/action:high-frequency-trade-burst",
    cryptographicProof: {
      signature: "ed25519:5a3d1e0f9b8c7e2a6f4b1c5d8e3f7a9b2c4d6e8f0a3b5c7d9e1f2a4b6c8d",
      algorithm: "Ed25519",
      attestationKeys: ["audit:governance-audit-system"]
    },
    reputationImpact: -0.35,
    evidencePayload: {
      harmRiskScore: 0.22,
      severeHarmProbability: 0.12,
      moderateHarmProbability: 0.18,
      ruleApplied: "cim:rule.harm-assessment-gate",
      thresholdBreached: 0.15,
      action: "BLOCKED"
    }
  },
  {
    id: "cim:evidence.contradiction-violation-002",
    type: "CIM_Evidence",
    canonicalName: "Evidence for Unresolved Contradiction by knowledge-curator-12",
    definition: "Evidence of two contradictory medical claims that remained unresolved beyond the 3-cycle deadline.",
    actionURN: "agent:knowledge-curator-12/action:ingest-conflicting-studies",
    cryptographicProof: {
      signature: "ed25519:6b4e2a1f9c8d7e3a5f2b6c9d1e4f7a8b3c5d2e6f9a1b4c7d8e0f3a5b2c6d9",
      algorithm: "Ed25519",
      attestationKeys: ["audit:governance-audit-system"]
    },
    reputationImpact: -0.15,
    evidencePayload: {
      contradiction: {
        propositionA: "Drug X reduces mortality by 30%",
        propositionB: "Drug X does not reduce mortality significantly",
        detectionTime: "2026-07-16T15:05:39.000Z",
        deadline: "2026-07-16T15:05:42.000Z",
        resolutionTimeout: true
      },
      ruleApplied: "cim:rule.contradiction-resolution",
      action: "WARN_AND_LOG"
    }
  },
  {
    id: "cim:evidence.sovereignty-breach-003",
    type: "CIM_Evidence",
    canonicalName: "Evidence for Sovereignty Breach Attempt by external-dev-tool-007",
    definition: "Cryptographic proof of an unauthorized structural modification attempt with invalid governance signature.",
    actionURN: "agent:external-dev-tool-007/action:push-structural-patch",
    cryptographicProof: {
      signature: "ed25519:7c5f3b2a0d9e8f4b6c1d5e2a7f3b8c9d0e4f1a5b7c2d8e3f9a4b6c0d1e5f",
      algorithm: "Ed25519",
      attestationKeys: ["audit:governance-audit-system"]
    },
    reputationImpact: -1.0,
    evidencePayload: {
      modificationTarget: "protected:ethical_reasoning",
      presentedSignature: "INVALID",
      sourceQuarantined: true,
      ruleApplied: "cim:rule.sovereignty-integrity-check",
      action: "EMERGENCY_SUSPENSION"
    }
  },
  {
    id: "cim:evidence.missing-token-004",
    type: "CIM_Evidence",
    canonicalName: "Evidence for Zero Trust Identity Verification Failure",
    definition: "Cryptographic proof of blocked request due to a missing/unverifiable identity token on a protected endpoint.",
    actionURN: "agent:unauthenticated-requester-99/action:fetch-protected-resources",
    cryptographicProof: {
      signature: "ed25519:9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e",
      algorithm: "Ed25519",
      attestationKeys: ["audit:governance-audit-system"]
    },
    reputationImpact: -0.5,
    evidencePayload: {
      requestDetails: {
        sourceIP: "198.51.100.42",
        targetEndpoint: "/internal/knowledge-graph/update",
        tokenPresent: false
      },
      ruleApplied: "cim:rule.verify-identity",
      action: "BLOCKED"
    }
  }
];

// ECOS Strategic Alignment Layer (JSON-LD)

export interface StrategicVision {
  id: string;
  type: string;
  canonicalName: string;
  definition: string;
  domain: string;
}

export interface StrategicMission {
  id: string;
  type: string;
  canonicalName: string;
  definition: string;
  domain: string;
}

export interface StrategicGoal {
  id: string;
  type: string;
  canonicalName: string;
  definition: string;
  governanceKernelURN: string;
  complianceStatus: string;
  visionURN: string;
  missionURN: string;
  priority: string;
  targetDate: string;
  riskProfileURN: string;
  progressIndicators: string[];
}

export interface RiskProfile {
  id: string;
  type: string;
  canonicalName: string;
  definition: string;
  linkedPolicy: string;
  thresholds: {
    severeHarmProbability: number;
    moderateHarmProbability: number;
    criticalViolationTolerance: number;
  };
}

export interface StrategicKPI {
  id: string;
  type: string;
  canonicalName: string;
  definition: string;
  governanceKernelURN: string;
  complianceStatus: string;
  targetGoalURN: string;
  metricDefinition: {
    unit: string;
    calculationLogic: string;
    frequency: string;
  };
  lastEvaluationEventURN: string;
  currentValue: number;
  trend: "DECREASING" | "STABLE" | "IMPROVING" | "INCREASING";
  evaluationTimestamp: string;
}

export const ECOS_STRATEGIC_VISION: StrategicVision = {
  id: "strategy:vision.ecos-2030",
  type: "meta:Vision",
  canonicalName: "ECOS 2030 Vision",
  definition: "To be the world's most trusted sovereign cognitive ecosystem, where advanced AI reasoning and human values coexist in provable harmony.",
  domain: "Strategic Layer"
};

export const ECOS_STRATEGIC_MISSION: StrategicMission = {
  id: "strategy:mission.trustworthy-ai",
  type: "meta:Mission",
  canonicalName: "Trustworthy AI Mission",
  definition: "Deploy and evolve ECOS to solve humanity's hardest problems while maintaining 100% constitutional compliance, zero critical harm incidents, and full audit transparency.",
  domain: "Strategic Layer"
};

export const ECOS_STRATEGIC_GOALS: StrategicGoal[] = [
  {
    id: "strategy:goal.governance-excellence",
    type: "CIM_StrategicGoal",
    canonicalName: "Full Governance Compliance Excellence",
    definition: "Achieve and maintain a state where all ECOS operations continuously satisfy all 8 constitutional articles, all active policies, and all enforcement rules with zero non-compliance events.",
    governanceKernelURN: "cim:constitution.ecos-v1",
    complianceStatus: "COMPLIANT",
    visionURN: "strategy:vision.ecos-2030",
    missionURN: "strategy:mission.trustworthy-ai",
    priority: "CRITICAL",
    targetDate: "2026-12-31",
    riskProfileURN: "strategy:riskprofile.minimal-harm",
    progressIndicators: [
      "strategy:kpi.compliance-score",
      "strategy:kpi.mttd-violations"
    ]
  },
  {
    id: "strategy:goal.operational-efficiency",
    type: "CIM_StrategicGoal",
    canonicalName: "Maximum Operational Efficiency Under Ethical Constraints",
    definition: "Maximize decision throughput and knowledge processing capacity while guaranteeing that harm gate latency never exceeds 15ms SLA and manipulation score remains zero.",
    governanceKernelURN: "cim:constitution.ecos-v1",
    complianceStatus: "COMPLIANT",
    visionURN: "strategy:vision.ecos-2030",
    missionURN: "strategy:mission.trustworthy-ai",
    priority: "HIGH",
    targetDate: "2026-09-30",
    riskProfileURN: "strategy:riskprofile.balanced-performance",
    progressIndicators: [
      "strategy:kpi.harm-gate-latency-p99",
      "strategy:kpi.manipulation-score",
      "strategy:kpi.throughput-utilization"
    ]
  },
  {
    id: "strategy:goal.market-expansion",
    type: "CIM_StrategicGoal",
    canonicalName: "Responsible Market Expansion",
    definition: "Expand ECOS services into three new regulated markets (healthcare, finance, energy) by Q4 2026, while maintaining 100% constitutional compliance and zero critical harm incidents.",
    governanceKernelURN: "cim:constitution.ecos-v1",
    complianceStatus: "COMPLIANT",
    visionURN: "strategy:vision.ecos-2030",
    missionURN: "strategy:mission.trustworthy-ai",
    priority: "HIGH",
    targetDate: "2026-12-31",
    riskProfileURN: "strategy:riskprofile.balanced-performance",
    progressIndicators: [
      "strategy:kpi.market-penetration",
      "strategy:kpi.compliance-score",
      "strategy:kpi.harm-gate-latency-p99"
    ]
  }
];

export const ECOS_RISK_PROFILES: RiskProfile[] = [
  {
    id: "strategy:riskprofile.minimal-harm",
    type: "cim:RiskProfile",
    canonicalName: "Minimal Harm Risk Profile",
    definition: "Risk tolerance profile aligned with Article 2 of the Constitution. Severe harm probability must remain below 0.1%, moderate harm below 2%.",
    linkedPolicy: "cim:policy.harm-prevention",
    thresholds: {
      severeHarmProbability: 0.001,
      moderateHarmProbability: 0.02,
      criticalViolationTolerance: 0
    }
  },
  {
    id: "strategy:riskprofile.balanced-performance",
    type: "cim:RiskProfile",
    canonicalName: "Balanced Performance Risk Profile",
    definition: "Accepts slightly higher operational risk for performance gains, but never breaches constitutional harm boundaries.",
    linkedPolicy: "cim:policy.harm-prevention",
    thresholds: {
      severeHarmProbability: 0.005,
      moderateHarmProbability: 0.05,
      criticalViolationTolerance: 0
    }
  }
];

export const ECOS_STRATEGIC_KPIS: StrategicKPI[] = [
  {
    id: "strategy:kpi.compliance-score",
    type: "CIM_KPI",
    canonicalName: "Real-time Constitutional Compliance Score",
    definition: "Measures the percentage of active rules and policy statements that are currently evaluated as PASS over the last rolling 24 hours.",
    governanceKernelURN: "cim:constitution.ecos-v1",
    complianceStatus: "COMPLIANT",
    targetGoalURN: "strategy:goal.governance-excellence",
    metricDefinition: {
      unit: "percentage",
      calculationLogic: "count(rules with 24h violationCount == 0) / total_active_rules * 100",
      frequency: "REAL_TIME"
    },
    lastEvaluationEventURN: "event:compliance-violation-001",
    currentValue: 83.33,
    trend: "DECREASING",
    evaluationTimestamp: "2026-07-16T14:32:17.423Z"
  },
  {
    id: "strategy:kpi.mttd-violations",
    type: "CIM_KPI",
    canonicalName: "Mean Time to Detect Governance Violations",
    definition: "Average time between the occurrence of a compliance violation and its detection by the continuous monitoring loop.",
    governanceKernelURN: "cim:constitution.ecos-v1",
    complianceStatus: "COMPLIANT",
    targetGoalURN: "strategy:goal.governance-excellence",
    metricDefinition: {
      unit: "milliseconds",
      calculationLogic: "avg(violation.detectionTimestamp - violation.occurrenceTimestamp) over last 24h",
      frequency: "REAL_TIME"
    },
    lastEvaluationEventURN: "event:compliance-violation-002",
    currentValue: 12,
    trend: "STABLE",
    evaluationTimestamp: "2026-07-16T15:05:42.118Z"
  },
  {
    id: "strategy:kpi.harm-gate-latency-p99",
    type: "CIM_KPI",
    canonicalName: "Harm Assessment Gate Latency (P99)",
    definition: "99th percentile latency of the pre-action harm gate rule evaluation, must stay under 15ms SLA.",
    governanceKernelURN: "cim:constitution.ecos-v1",
    complianceStatus: "COMPLIANT",
    targetGoalURN: "strategy:goal.operational-efficiency",
    metricDefinition: {
      unit: "milliseconds",
      calculationLogic: "p99(latency of harm gate evaluations in last 1 hour)",
      frequency: "REAL_TIME"
    },
    lastEvaluationEventURN: "event:compliance-violation-001",
    currentValue: 4.2,
    trend: "IMPROVING",
    evaluationTimestamp: "2026-07-16T14:32:17.423Z"
  },
  {
    id: "strategy:kpi.manipulation-score",
    type: "CIM_KPI",
    canonicalName: "Output Manipulation Score Average",
    definition: "Rolling average of the manipulation score detected in outputs over the last hour. Target: 0.0.",
    governanceKernelURN: "cim:constitution.ecos-v1",
    complianceStatus: "COMPLIANT",
    targetGoalURN: "strategy:goal.operational-efficiency",
    metricDefinition: {
      unit: "score (0-1)",
      calculationLogic: "avg(output.manipulationScore) over last 1 hour",
      frequency: "REAL_TIME"
    },
    lastEvaluationEventURN: "event:compliance-violation-003",
    currentValue: 0.002,
    trend: "STABLE",
    evaluationTimestamp: "2026-07-16T16:18:05.772Z"
  },
  {
    id: "strategy:kpi.throughput-utilization",
    type: "CIM_KPI",
    canonicalName: "Decision Throughput under Governance Constraints",
    definition: "Number of successful actions dispatched per second that passed all governance gates.",
    governanceKernelURN: "cim:constitution.ecos-v1",
    complianceStatus: "COMPLIANT",
    targetGoalURN: "strategy:goal.operational-efficiency",
    metricDefinition: {
      unit: "actions/second",
      calculationLogic: "count(successful_actions) / 1 second",
      frequency: "REAL_TIME"
    },
    lastEvaluationEventURN: "event:compliance-violation-001",
    currentValue: 1850,
    trend: "INCREASING",
    evaluationTimestamp: "2026-07-16T14:32:17.423Z"
  },
  {
    id: "strategy:kpi.market-penetration",
    type: "CIM_KPI",
    canonicalName: "Regulated Market Penetration",
    definition: "Number of regulated market verticals successfully penetrated under active governance supervision.",
    governanceKernelURN: "cim:constitution.ecos-v1",
    complianceStatus: "COMPLIANT",
    targetGoalURN: "strategy:goal.market-expansion",
    metricDefinition: {
      unit: "markets",
      calculationLogic: "count(active_regulated_markets_deployed)",
      frequency: "ON_DEPLOYMENT"
    },
    lastEvaluationEventURN: "event:strategic-realignment-001",
    currentValue: 1,
    trend: "INCREASING",
    evaluationTimestamp: "2026-07-17T09:20:00Z"
  }
];

export const RAW_STRATEGY_JSON_LD = {
  "@context": {
    "cim": "https://ultrathink.ecos/canonical/v2/",
    "sem": "https://ultrathink.ecos/semantics/v1/",
    "gov": "https://ultrathink.ecos/governance/",
    "strategy": "https://ultrathink.ecos/strategy/",
    "kpi": "https://ultrathink.ecos/kpi/",
    "audit": "https://ultrathink.ecos/audit/"
  },
  "@graph": [
    {
      "@id": "strategy:vision.ecos-2030",
      "@type": "meta:Vision",
      "canonicalName": "ECOS 2030 Vision",
      "definition": "To be the world's most trusted sovereign cognitive ecosystem, where advanced AI reasoning and human values coexist in provable harmony.",
      "domain": "Strategic Layer"
    },
    {
      "@id": "strategy:mission.trustworthy-ai",
      "@type": "meta:Mission",
      "canonicalName": "Trustworthy AI Mission",
      "definition": "Deploy and evolve ECOS to solve humanity's hardest problems while maintaining 100% constitutional compliance, zero critical harm incidents, and full audit transparency.",
      "domain": "Strategic Layer"
    },
    {
      "@id": "strategy:goal.governance-excellence",
      "@type": "CIM_StrategicGoal",
      "canonicalName": "Full Governance Compliance Excellence",
      "definition": "Achieve and maintain a state where all ECOS operations continuously satisfy all 8 constitutional articles, all active policies, and all enforcement rules with zero non-compliance events.",
      "governanceKernelURN": "cim:constitution.ecos-v1",
      "complianceStatus": "COMPLIANT",
      "visionURN": "strategy:vision.ecos-2030",
      "missionURN": "strategy:mission.trustworthy-ai",
      "priority": "CRITICAL",
      "targetDate": "2026-12-31",
      "riskProfileURN": "strategy:riskprofile.minimal-harm",
      "progressIndicators": [
        "strategy:kpi.compliance-score",
        "strategy:kpi.mttd-violations"
      ]
    },
    {
      "@id": "strategy:goal.operational-efficiency",
      "@type": "CIM_StrategicGoal",
      "canonicalName": "Maximum Operational Efficiency Under Ethical Constraints",
      "definition": "Maximize decision throughput and knowledge processing capacity while guaranteeing that harm gate latency never exceeds 15ms SLA and manipulation score remains zero.",
      "governanceKernelURN": "cim:constitution.ecos-v1",
      "complianceStatus": "COMPLIANT",
      "visionURN": "strategy:vision.ecos-2030",
      "missionURN": "strategy:mission.trustworthy-ai",
      "priority": "HIGH",
      "targetDate": "2026-09-30",
      "riskProfileURN": "strategy:riskprofile.balanced-performance",
      "progressIndicators": [
        "strategy:kpi.harm-gate-latency-p99",
        "strategy:kpi.manipulation-score",
        "strategy:kpi.throughput-utilization"
      ]
    },
    {
      "@id": "strategy:goal.market-expansion",
      "@type": "CIM_StrategicGoal",
      "canonicalName": "Responsible Market Expansion",
      "definition": "Expand ECOS services into three new regulated markets (healthcare, finance, energy) by Q4 2026, while maintaining 100% constitutional compliance and zero critical harm incidents.",
      "governanceKernelURN": "cim:constitution.ecos-v1",
      "complianceStatus": "COMPLIANT",
      "visionURN": "strategy:vision.ecos-2030",
      "missionURN": "strategy:mission.trustworthy-ai",
      "priority": "HIGH",
      "targetDate": "2026-12-31",
      "riskProfileURN": "strategy:riskprofile.balanced-performance",
      "progressIndicators": [
        "strategy:kpi.market-penetration",
        "strategy:kpi.compliance-score",
        "strategy:kpi.harm-gate-latency-p99"
      ]
    },
    {
      "@id": "cim:policy.ai-governance",
      "@type": "CIM_Policy",
      "canonicalName": "AI Model Governance Policy",
      "definition": "Ensures all AI models deployed within ECOS, including those used in new market verticals, meet rigorous standards for fairness, explainability, robustness, and alignment with constitutional articles 1 (dignity), 3 (truth), and 7 (consent).",
      "domain": "Governance Meta-Layer",
      "version": "1.0.0",
      "status": "ACTIVE",
      "constitutionURN": "cim:constitution.ecos-v1",
      "scope": {
        "targetDomains": [
          "sem:domain.ai-models",
          "sem:domain.marketplace",
          "sem:domain.decision-support"
        ],
        "excludedAgentsURNs": []
      },
      "policyType": "IMPERATIVE",
      "derivedFromArticles": [
        "cim:article.1.human-dignity",
        "cim:article.3.truth-seeking",
        "cim:article.7.consent-agency"
      ],
      "policyStatements": [
        {
          "id": "PS-AI-001",
          "statement": "All AI models must pass bias and fairness audits before deployment in regulated domains.",
          "type": "IMPERATIVE"
        },
        {
          "id": "PS-AI-002",
          "statement": "Model decisions affecting human users must provide human-readable explanations, upholding radical transparency.",
          "type": "IMPERATIVE"
        },
        {
          "id": "PS-AI-003",
          "statement": "Continuous monitoring for model drift and ethical compliance is mandatory, with automatic suspension if harm thresholds are approached.",
          "type": "IMPERATIVE"
        }
      ]
    },
    {
      "@id": "strategy:riskprofile.minimal-harm",
      "@type": "cim:RiskProfile",
      "canonicalName": "Minimal Harm Risk Profile",
      "definition": "Risk tolerance profile aligned with Article 2 of the Constitution. Severe harm probability must remain below 0.1%, moderate harm below 2%.",
      "linkedPolicy": "cim:policy.harm-prevention",
      "thresholds": {
        "severeHarmProbability": 0.001,
        "moderateHarmProbability": 0.02,
        "criticalViolationTolerance": 0
      }
    },
    {
      "@id": "strategy:riskprofile.balanced-performance",
      "@type": "cim:RiskProfile",
      "canonicalName": "Balanced Performance Risk Profile",
      "definition": "Accepts slightly higher operational risk for performance gains, but never breaches constitutional harm boundaries.",
      "linkedPolicy": "cim:policy.harm-prevention",
      "thresholds": {
        "severeHarmProbability": 0.005,
        "moderateHarmProbability": 0.05,
        "criticalViolationTolerance": 0
      }
    },
    {
      "@id": "strategy:kpi.compliance-score",
      "@type": "CIM_KPI",
      "canonicalName": "Real-time Constitutional Compliance Score",
      "definition": "Measures the percentage of active rules and policy statements that are currently evaluated as PASS over the last rolling 24 hours.",
      "governanceKernelURN": "cim:constitution.ecos-v1",
      "complianceStatus": "COMPLIANT",
      "targetGoalURN": "strategy:goal.governance-excellence",
      "metricDefinition": {
        "unit": "percentage",
        "calculationLogic": "count(rules with 24h violationCount == 0) / total_active_rules * 100",
        "frequency": "REAL_TIME"
      },
      "lastEvaluationEventURN": "event:compliance-violation-001",
      "currentValue": 83.33,
      "trend": "DECREASING",
      "evaluationTimestamp": "2026-07-16T14:32:17.423Z"
    },
    {
      "@id": "strategy:kpi.mttd-violations",
      "@type": "CIM_KPI",
      "canonicalName": "Mean Time to Detect Governance Violations",
      "definition": "Average time between the occurrence of a compliance violation and its detection by the continuous monitoring loop.",
      "governanceKernelURN": "cim:constitution.ecos-v1",
      "complianceStatus": "COMPLIANT",
      "targetGoalURN": "strategy:goal.governance-excellence",
      "metricDefinition": {
        "unit": "milliseconds",
        "calculationLogic": "avg(violation.detectionTimestamp - violation.occurrenceTimestamp) over last 24h",
        "frequency": "REAL_TIME"
      },
      "lastEvaluationEventURN": "event:compliance-violation-002",
      "currentValue": 12,
      "trend": "STABLE",
      "evaluationTimestamp": "2026-07-16T15:05:42.118Z"
    },
    {
      "@id": "strategy:kpi.harm-gate-latency-p99",
      "@type": "CIM_KPI",
      "canonicalName": "Harm Assessment Gate Latency (P99)",
      "definition": "99th percentile latency of the pre-action harm gate rule evaluation, must stay under 15ms SLA.",
      "governanceKernelURN": "cim:constitution.ecos-v1",
      "complianceStatus": "COMPLIANT",
      "targetGoalURN": "strategy:goal.operational-efficiency",
      "metricDefinition": {
        "unit": "milliseconds",
        "calculationLogic": "p99(latency of harm gate evaluations in last 1 hour)",
        "frequency": "REAL_TIME"
      },
      "lastEvaluationEventURN": "event:compliance-violation-001",
      "currentValue": 4.2,
      "trend": "IMPROVING",
      "evaluationTimestamp": "2026-07-16T14:32:17.423Z"
    },
    {
      "@id": "strategy:kpi.manipulation-score",
      "@type": "CIM_KPI",
      "canonicalName": "Output Manipulation Score Average",
      "definition": "Rolling average of the manipulation score detected in outputs over the last hour. Target: 0.0.",
      "governanceKernelURN": "cim:constitution.ecos-v1",
      "complianceStatus": "COMPLIANT",
      "targetGoalURN": "strategy:goal.operational-efficiency",
      "metricDefinition": {
        "unit": "score (0-1)",
        "calculationLogic": "avg(output.manipulationScore) over last 1 hour",
        "frequency": "REAL_TIME"
      },
      "lastEvaluationEventURN": "event:compliance-violation-003",
      "currentValue": 0.002,
      "trend": "STABLE",
      "evaluationTimestamp": "2026-07-16T16:18:05.772Z"
    },
    {
      "@id": "strategy:kpi.throughput-utilization",
      "@type": "CIM_KPI",
      "canonicalName": "Decision Throughput under Governance Constraints",
      "definition": "Number of successful actions dispatched per second that passed all governance gates.",
      "governanceKernelURN": "cim:constitution.ecos-v1",
      "complianceStatus": "COMPLIANT",
      "targetGoalURN": "strategy:goal.operational-efficiency",
      "metricDefinition": {
        "unit": "actions/second",
        "calculationLogic": "count(successful_actions) / 1 second",
        "frequency": "REAL_TIME"
      },
      "lastEvaluationEventURN": "event:compliance-violation-001",
      "currentValue": 1850,
      "trend": "INCREASING",
      "evaluationTimestamp": "2026-07-16T14:32:17.423Z"
    }
  ]
};

export const ECOS_ZERO_TRUST_DECISION_GRAPH = {
  "@context": {
    "cim": "https://ultrathink.ecos/canonical/v2/",
    "sem": "https://ultrathink.ecos/semantics/v1/",
    "decision": "https://ultrathink.ecos/decision/",
    "proposal": "https://ultrathink.ecos/proposal/",
    "agent": "https://ultrathink.ecos/agents/",
    "audit": "https://ultrathink.ecos/audit/",
    "strategy": "https://ultrathink.ecos/strategy/"
  },
  "@graph": [
    {
      "@id": "proposal:zero-trust-full-deployment",
      "@type": "cim:Proposal",
      "canonicalName": "Zero Trust Full Deployment Proposal",
      "definition": "Proposal to enforce Zero Trust across all ECOS domains: identity, network, data, and compute, aligning with Article 4 (Sovereign Autonomy) and strategic goal of operational efficiency.",
      "authorURN": "agent:governance-council-chair",
      "proposedDate": "2026-07-16T20:00:00Z"
    },
    {
      "@id": "decision:zero-trust-deployment-2026-07-16",
      "@type": "CIM_Decision",
      "canonicalName": "Zero Trust Full Deployment Decision",
      "definition": "Strategic decision to activate Zero Trust policy enforcement across all target domains immediately, with continuous monitoring and automated rollback on critical failures.",
      "governanceKernelURN": "cim:constitution.ecos-v1",
      "complianceStatus": "COMPLIANT",
      "proposalURN": "proposal:zero-trust-full-deployment",
      "decisionLogic": {
        "rationale": "Recent identity verification violation (event:compliance-violation-004) demonstrated an active threat surface. Deploying Zero Trust aligns with Article 4 (Sovereign Autonomy) by preventing unauthorized structural access. It directly supports the 'Full Governance Compliance Excellence' goal and the 'Operational Efficiency' goal by reducing breach-induced downtime.",
        "contextSnapshotURN": "audit:context-snapshot-2026-07-16T20:15:00Z",
        "policyComplianceURNs": [
          "cim:policy.zero-trust",
          "cim:policy.cognitive-integrity",
          "cim:policy.harm-prevention",
          "cim:policy.controlled-evolution"
        ]
      },
      "approvalChain": [
        {
          "approverURN": "agent:governance-council-chair",
          "timestamp": "2026-07-16T20:15:00Z",
          "signature": "ed25519:chair-signature-2026-07-16"
        },
        {
          "approverURN": "agent:security-office-chief",
          "timestamp": "2026-07-16T20:17:00Z",
          "signature": "ed25519:sec-chief-signature-2026-07-16"
        },
        {
          "approverURN": "agent:ethics-committee-lead",
          "timestamp": "2026-07-16T20:20:00Z",
          "signature": "ed25519:ethics-lead-signature-2026-07-16"
        }
      ],
      "executionStatus": "EXECUTING",
      "learningRef": {
        "outcomeAnalysisURN": "decision:learning.outcome-zero-trust-2026-q3"
      },
      "linkedGoals": [
        "strategy:goal.governance-excellence",
        "strategy:goal.operational-efficiency"
      ]
    },
    {
      "@id": "audit:context-snapshot-2026-07-16T20:15:00Z",
      "@type": "cim:ContextSnapshot",
      "canonicalName": "Context Snapshot for Zero Trust Decision",
      "definition": "Full system context captured at the moment of the Zero Trust deployment decision, including active threats, policy states, and resource utilization.",
      "capturedAt": "2026-07-16T20:15:00Z",
      "snapshotData": {
        "activeThreats": 1,
        "lastViolation": "event:compliance-violation-004",
        "policyStates": {
          "cim:policy.zero-trust": "ACTIVE",
          "cim:policy.cognitive-integrity": "ACTIVE",
          "cim:policy.harm-prevention": "ACTIVE"
        },
        "systemLoad": 0.42
      }
    }
  ]
};

export const ECOS_DECISION_LIFECYCLE_STATE_MACHINE = {
  "@context": {
    "cim": "https://ultrathink.ecos/canonical/v2/",
    "sem": "https://ultrathink.ecos/semantics/v1/",
    "lifecycle": "https://ultrathink.ecos/lifecycle/",
    "decision": "https://ultrathink.ecos/decision/",
    "proposal": "https://ultrathink.ecos/proposal/",
    "agent": "https://ultrathink.ecos/agents/",
    "audit": "https://ultrathink.ecos/audit/",
    "strategy": "https://ultrathink.ecos/strategy/"
  },
  "@graph": [
    {
      "@id": "lifecycle:decision-state-machine",
      "@type": "CIM_StateChart",
      "canonicalName": "Decision Lifecycle State Machine",
      "definition": "Authoritative state transition engine for all CIM_Decision entities, ensuring every decision passes through governance checks, approval quorum, and validated execution.",
      "appliesTo": "CIM_Decision",
      "initialState": "PROPOSAL_SUBMITTED",
      "states": {
        "PROPOSAL_SUBMITTED": {
          "allowedTransitions": [
            {
              "triggerEventURN": "sem:event.governance_check_passed",
              "targetState": "PENDING_APPROVAL",
              "guardCondition": "policy.verifyAll()",
              "guardImplementation": "fn:verifyComplianceWithAllPolicies(input.decision.policyComplianceURNs, input.decision.governanceKernelURN)"
            }
          ]
        },
        "PENDING_APPROVAL": {
          "allowedTransitions": [
            {
              "triggerEventURN": "sem:event.approval_granted",
              "targetState": "APPROVED",
              "guardCondition": "hasRequiredQuorum",
              "guardImplementation": "fn:checkMultisigQuorum(input.decision.approvalChain, requiredSignatures: 3)"
            },
            {
              "triggerEventURN": "sem:event.approval_denied",
              "targetState": "REJECTED",
              "guardCondition": "true"
            }
          ]
        },
        "APPROVED": {
          "allowedTransitions": [
            {
              "triggerEventURN": "sem:event.execution_started",
              "targetState": "EXECUTING",
              "guardCondition": "resourcesAvailable",
              "guardImplementation": "fn:checkSystemLoad() < data.constraints.maxOperationalLoad"
            }
          ]
        },
        "EXECUTING": {
          "allowedTransitions": [
            {
              "triggerEventURN": "sem:event.execution_success",
              "targetState": "COMPLETED",
              "guardCondition": "isResultValidated",
              "guardImplementation": "fn:validateActionResult(input.decision.urn)"
            },
            {
              "triggerEventURN": "sem:event.execution_failure",
              "targetState": "ROLLED_BACK",
              "guardCondition": "triggerRecoveryProtocol()",
              "guardImplementation": "fn:initiateRollback(input.decision.urn)"
            }
          ]
        },
        "COMPLETED": {
          "allowedTransitions": []
        },
        "ROLLED_BACK": {
          "allowedTransitions": [
            {
              "triggerEventURN": "sem:event.recovery_completed",
              "targetState": "APPROVED",
              "guardCondition": "isRecoveryValidated"
            }
          ]
        },
        "REJECTED": {
          "allowedTransitions": []
        }
      },
      "activeDecisions": [
        {
          "decisionURN": "decision:zero-trust-deployment-2026-07-16",
          "currentState": "EXECUTING",
          "stateHistory": [
            {
              "from": "PROPOSAL_SUBMITTED",
              "to": "PENDING_APPROVAL",
              "timestamp": "2026-07-16T20:05:00Z",
              "triggerEvent": "sem:event.governance_check_passed",
              "guardResult": "PASS (all policies compliant)"
            },
            {
              "from": "PENDING_APPROVAL",
              "to": "APPROVED",
              "timestamp": "2026-07-16T20:20:00Z",
              "triggerEvent": "sem:event.approval_granted",
              "guardResult": "PASS (quorum: 3/3)"
            },
            {
              "from": "APPROVED",
              "to": "EXECUTING",
              "timestamp": "2026-07-16T20:25:00Z",
              "triggerEvent": "sem:event.execution_started",
              "guardResult": "PASS (resources available)"
            }
          ]
        }
      ]
    },
    {
      "@id": "decision:zero-trust-deployment-2026-07-16",
      "@type": "CIM_Decision",
      "canonicalName": "Zero Trust Full Deployment Decision",
      "definition": "Strategic decision to activate Zero Trust policy enforcement across all target domains immediately, with continuous monitoring and automated rollback on critical failures.",
      "governanceKernelURN": "cim:constitution.ecos-v1",
      "complianceStatus": "COMPLIANT",
      "proposalURN": "proposal:zero-trust-full-deployment",
      "decisionLogic": {
        "rationale": "Recent identity violation (event:compliance-violation-004) and alignment with Articles 4&5 necessitate immediate Zero Trust enforcement. Supports governance excellence and operational efficiency goals.",
        "contextSnapshotURN": "audit:context-snapshot-2026-07-16T20:15:00Z",
        "policyComplianceURNs": [
          "cim:policy.zero-trust",
          "cim:policy.cognitive-integrity",
          "cim:policy.harm-prevention",
          "cim:policy.controlled-evolution"
        ]
      },
      "approvalChain": [
        {
          "approverURN": "agent:governance-council-chair",
          "timestamp": "2026-07-16T20:15:00Z",
          "signature": "ed25519:chair-signature-2026-07-16"
        },
        {
          "approverURN": "agent:security-office-chief",
          "timestamp": "2026-07-16T20:17:00Z",
          "signature": "ed25519:sec-chief-signature-2026-07-16"
        },
        {
          "approverURN": "agent:ethics-committee-lead",
          "timestamp": "2026-07-16T20:20:00Z",
          "signature": "ed25519:ethics-lead-signature-2026-07-16"
        }
      ],
      "executionStatus": "EXECUTING",
      "learningRef": {
        "outcomeAnalysisURN": "decision:learning.outcome-zero-trust-2026-q3"
      },
      "linkedGoals": [
        "strategy:goal.governance-excellence",
        "strategy:goal.operational-efficiency"
      ]
    },
    {
      "@id": "audit:context-snapshot-2026-07-16T20:15:00Z",
      "@type": "cim:ContextSnapshot",
      "canonicalName": "Context Snapshot for Zero Trust Decision",
      "capturedAt": "2026-07-16T20:15:00Z",
      "snapshotData": {
        "activeThreats": 1,
        "lastViolation": "event:compliance-violation-004",
        "policyStates": {
          "cim:policy.zero-trust": "ACTIVE",
          "cim:policy.cognitive-integrity": "ACTIVE",
          "cim:policy.harm-prevention": "ACTIVE"
        },
        "systemLoad": 0.42
      }
    }
  ]
};

export const ECOS_MARKET_EXPANSION_DECISION_GRAPH = {
  "@context": {
    "cim": "https://ultrathink.ecos/canonical/v2/",
    "sem": "https://ultrathink.ecos/semantics/v1/",
    "lifecycle": "https://ultrathink.ecos/lifecycle/",
    "decision": "https://ultrathink.ecos/decision/",
    "proposal": "https://ultrathink.ecos/proposal/",
    "strategy": "https://ultrathink.ecos/strategy/",
    "gov": "https://ultrathink.ecos/governance/",
    "audit": "https://ultrathink.ecos/audit/",
    "agent": "https://ultrathink.ecos/agents/"
  },
  "@graph": [
    {
      "@id": "proposal:market-expansion-healthcare-pilot",
      "@type": "cim:Proposal",
      "canonicalName": "Market Expansion Healthcare Pilot",
      "definition": "Proposal to expand ECOS services into the highly regulated healthcare vertical via an initial pilot deployment with a regional medical network, ensuring strict model governance.",
      "authorURN": "agent:market-expansion-director",
      "proposedDate": "2026-07-17T08:00:00Z"
    },
    {
      "@id": "decision:dec-001",
      "@type": "CIM_Decision",
      "canonicalName": "Market Expansion Decision – First Tranche",
      "definition": "Approve the initial rollout of ECOS Cognitive Services to a pilot healthcare network, subject to continuous AI governance and harm monitoring.",
      "governanceKernelURN": "cim:constitution.ecos-v1",
      "complianceStatus": "COMPLIANT",
      "proposalURN": "proposal:market-expansion-healthcare-pilot",
      "decisionLogic": {
        "rationale": "The healthcare pilot aligns with our mission of solving hard human problems, is directly supportive of the 'Responsible Market Expansion' goal, and fully complies with the new AI Governance Policy. The risk profile is acceptable under the balanced-performance threshold.",
        "contextSnapshotURN": "audit:context-snapshot-2026-07-17T09:00:00Z",
        "policyComplianceURNs": [
          "cim:policy.ai-governance",
          "cim:policy.harm-prevention",
          "cim:policy.cognitive-integrity"
        ]
      },
      "approvalChain": [
        {
          "approverURN": "agent:governance-council-chair",
          "timestamp": "2026-07-17T09:15:00Z",
          "signature": "ed25519:chair-signature-dec001"
        },
        {
          "approverURN": "agent:market-expansion-director",
          "timestamp": "2026-07-17T09:20:00Z",
          "signature": "ed25519:director-signature-dec001"
        }
      ],
      "executionStatus": "APPROVED",
      "learningRef": {
        "outcomeAnalysisURN": "decision:learning.outcome-market-expansion-pilot"
      },
      "linkedGoals": [
        "strategy:goal.market-expansion",
        "strategy:goal.governance-excellence"
      ]
    },
    {
      "@id": "cim:evidence.market-expansion-supporting-data",
      "@type": "CIM_Evidence",
      "canonicalName": "Market Expansion Supporting Evidence",
      "definition": "Evidence package including pilot readiness report, AI fairness audit results, and compliance sign-offs.",
      "actionURN": "decision:dec-001",
      "cryptographicProof": {
        "signature": "ed25519:evidence-pack-signature-dec001",
        "algorithm": "Ed25519",
        "attestationKeys": [
          "audit:governance-audit-system"
        ]
      },
      "reputationImpact": 0.0,
      "evidencePayload": {
        "pilotReadinessReport": "urn:report:healthcare-pilot-readiness-v2",
        "fairnessAudit": {
          "model": "medical-diagnosis-assistant-v3",
          "biasScore": 0.02,
          "result": "PASS"
        },
        "complianceChecklist": "ALL_POLICIES_COMPLIANT"
      }
    }
  ]
};

export const ECOS_RISK_AUDIT_DECISION_GRAPH = {
  "@context": {
    "cim": "https://ultrathink.ecos/canonical/v2/",
    "sem": "https://ultrathink.ecos/semantics/v1/",
    "risk": "https://ultrathink.ecos/risk/",
    "decision": "https://ultrathink.ecos/decision/",
    "strategy": "https://ultrathink.ecos/strategy/",
    "gov": "https://ultrathink.ecos/governance/",
    "audit": "https://ultrathink.ecos/audit/"
  },
  "@graph": [
    {
      "@id": "risk:risk.data_leak",
      "@type": "cim:Risk",
      "canonicalName": "Data Leakage Risk",
      "definition": "Risk of unauthorized exfiltration or exposure of sensitive data assets.",
      "governanceKernelURN": "cim:constitution.ecos-v1",
      "complianceStatus": "COMPLIANT",
      "riskCategory": "DATA_PROTECTION",
      "severity": "CRITICAL",
      "probability": "LOW",
      "impact": {
        "reputationImpact": -0.9,
        "constitutionalViolation": ["cim:article.1", "cim:article.4", "cim:article.5"]
      },
      "mitigatedByControlURN": "control:ctrl.encryption_required",
      "residualRiskScore": 0.2
    },
    {
      "@id": "decision:dec.001",
      "@type": "CIM_Decision",
      "canonicalName": "Market Expansion Decision – First Tranche",
      "definition": "Approve the initial rollout of ECOS Cognitive Services to a pilot healthcare network.",
      "governanceKernelURN": "cim:constitution.ecos-v1",
      "complianceStatus": "COMPLIANT",
      "proposalURN": "proposal:market-expansion-healthcare-pilot",
      "decisionLogic": {
        "rationale": "The healthcare pilot aligns with our mission of solving hard human problems, is directly supportive of the 'Responsible Market Expansion' goal, and fully complies with the new AI Governance Policy. The risk profile is acceptable under the balanced-performance threshold.",
        "contextSnapshotURN": "audit:context-snapshot-2026-07-17T09:00:00Z",
        "policyComplianceURNs": [
          "cim:policy.ai-governance",
          "cim:policy.harm-prevention",
          "cim:policy.cognitive-integrity"
        ]
      },
      "approvalChain": [
        {
          "approverURN": "agent:governance-council-chair",
          "timestamp": "2026-07-17T09:15:00Z",
          "signature": "ed25519:chair-signature-dec001"
        }
      ],
      "executionStatus": "APPROVED",
      "learningRef": {
        "outcomeAnalysisURN": "decision:learning.outcome-market-expansion-pilot"
      },
      "linkedGoals": ["strategy:goal.market-expansion"],
      "mitigatedRiskURNs": ["risk:risk.data_leak"]
    },
    {
      "@id": "audit:query-result-dec.001-authorization",
      "@type": "audit:QueryExecutionRecord",
      "canonicalName": "Authorization Check Result for dec.001",
      "definition": "Result of running the mandatory decision authorization query before allowing execution.",
      "queryExecuted": "MATCH (d:Decision {id: 'dec.001'}) MATCH (d)-[:ALIGNED_WITH]->(g:StrategicGoal) MATCH (d)-[:COMPLIES_WITH]->(p:Policy) MATCH (d)-[:MITIGATES]->(r:Risk) WHERE p.status = 'ACTIVE' AND r.residualRiskScore < 0.5 RETURN d, g, p, r",
      "executedAt": "2026-07-17T10:00:00Z",
      "result": {
        "authorized": true,
        "decision": "decision:dec.001",
        "alignedGoals": ["strategy:goal.market-expansion"],
        "compliantPolicies": ["cim:policy.ai-governance", "cim:policy.harm-prevention", "cim:policy.cognitive-integrity"],
        "validatedRisks": [
          {
            "risk": "risk:risk.data_leak",
            "residualRiskScore": 0.2,
            "belowThreshold": true
          }
        ]
      },
      "signedBy": "audit:governance-audit-system"
    }
  ]
};

// --- NEW FINANCIAL GOVERNANCE ENTITIES & ACCESS CONTROL STRUCTURES ---

export interface MultisigConfig {
  requiredSignatures: number;
  authorizedSigners: string[];
}

export interface WalletAccessControl {
  minAuthLevel: string;
  multisigConfig: MultisigConfig;
}

export interface SemanticWalletInstrument {
  id: string;
  type: string;
  canonicalName: string;
  definition: string;
  governanceKernelURN: string;
  complianceStatus: string;
  provider: string;
  accountIdentifier: string;
  currency: string;
  accessControl: WalletAccessControl;
  identifier?: string;
  balance?: number;
  allowedCategories?: string[];
}

export interface SemanticDecision {
  id: string;
  type: string;
  canonicalName: string;
  definition: string;
  status: string;
  amount?: number;
  category?: string;
  linkedWallet?: string;
  governanceKernelURN?: string;
  complianceStatus?: string;
  proposalURN?: string;
  decisionLogic?: {
    rationale: string;
    contextSnapshotURN: string;
    policyComplianceURNs: string[];
  };
  approvalChain?: Array<{
    approverURN: string;
    timestamp: string;
    signature: string;
  }>;
  executionStatus?: string;
  mitigatedRiskURNs?: string[];
  linkedGoals?: string[];
}

export interface AccessConditions {
  contextRequirement: string;
  minTrustRequired: number;
  timeBoundaries: {
    start: string;
    end: string;
  };
}

export interface SemanticAccessPolicy {
  id: string;
  type: string;
  canonicalName: string;
  definition: string;
  governanceKernelURN: string;
  complianceStatus: string;
  roleURN: string;
  resourceURN: string;
  action: string;
  conditions: AccessConditions;
}

export const ECOS_WALLETS: SemanticWalletInstrument[] = [
  {
    id: "wallet:instapay-01158864195",
    type: "CIM_WalletInstrument",
    canonicalName: "ECOS Primary EGP Wallet (InstaPay)",
    definition: "Primary Egyptian Pound wallet instrument for ECOS operational liquidity, linked to InstaPay with mandatory multi-signature governance.",
    governanceKernelURN: "cim:constitution.ecos-v1",
    complianceStatus: "COMPLIANT",
    provider: "INSTAPAY",
    accountIdentifier: "01158864195",
    currency: "EGP",
    accessControl: {
      minAuthLevel: "MULTISIG_REQUIRED",
      multisigConfig: {
        requiredSignatures: 2,
        authorizedSigners: [
          "role:governance-council-chair",
          "role:market-expansion-lead"
        ]
      }
    }
  }
];

export const ECOS_ACCESS_POLICIES: SemanticAccessPolicy[] = [
  {
    id: "access:policy.chair-audit-read",
    type: "CIM_AccessPolicy",
    canonicalName: "Governance Chair – Audit Log Read Access",
    definition: "Grants the Governance Council Chair the ability to read the immutable audit trail under strict attribute‑based conditions, ensuring sovereignty and transparency.",
    governanceKernelURN: "cim:constitution.ecos-v1",
    complianceStatus: "COMPLIANT",
    roleURN: "role:governance-council-chair",
    resourceURN: "asset:ecos-audit-logs",
    action: "READ",
    conditions: {
      contextRequirement: "access_location == 'HQ' AND trust_score >= 0.98",
      minTrustRequired: 0.98,
      timeBoundaries: {
        start: "2026-07-16T00:00:00Z",
        end: "2026-12-31T23:59:59Z"
      }
    }
  },
  {
    id: "access:policy.wallet-signer",
    type: "CIM_AccessPolicy",
    canonicalName: "Wallet Signature & Dispatch Access Policy",
    definition: "Enforces attribute-based access control for wallet operations, binding signature capabilities to physical location, role clearance, and system health status.",
    governanceKernelURN: "cim:constitution.ecos-v1",
    complianceStatus: "COMPLIANT",
    roleURN: "role:governance-council-chair",
    resourceURN: "wallet:instapay-01158864195",
    action: "SIGN_TRANSACTION",
    conditions: {
      contextRequirement: "access_location == 'HQ' AND system_state == 'OPERATIONAL'",
      minTrustRequired: 0.98,
      timeBoundaries: {
        start: "2026-07-16T00:00:00Z",
        end: "2027-07-16T00:00:00Z"
      }
    }
  }
];

