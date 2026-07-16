import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  User, 
  Fingerprint, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Key, 
  Award, 
  FileText, 
  Terminal, 
  Sliders, 
  Play, 
  RefreshCw, 
  Database,
  History,
  Lock,
  Activity,
  Wallet
} from 'lucide-react';
import { AuditEntry, SystemSnapshot } from '../types';
import { 
  ECOS_WALLETS, 
  ECOS_ACCESS_POLICIES, 
  ECOS_POLICIES, 
  ECOS_RULES,
  SemanticWalletInstrument,
  SemanticAccessPolicy,
  SemanticPolicy,
  SemanticRule,
  SemanticDecision
} from '../semanticData';

export interface IdentityRegistryProps {
  playBeep: (type: 'click' | 'success' | 'alert' | 'reset' | 'beep') => void;
  onAddAuditEntry: (entry: AuditEntry) => void;
  onUpdateSnapshot: (updater: (prev: SystemSnapshot) => SystemSnapshot) => void;
}

// Predefined registered agents, roles, and identities based on ECOS specifications
interface ActorEntity {
  id: string;
  type: string;
  canonicalName: string;
  definition: string;
  governanceKernelURN?: string;
  complianceStatus: 'COMPLIANT' | 'AUDITING' | 'NON_COMPLIANT' | 'SUSPENDED';
  identityURN: string;
  primaryRoleURN: string;
  trustProfile: {
    trustScore: number;
    lastEvaluated: string;
    factors: {
      constitutionalAlignment: number;
      decisionAccuracy: number;
      responseTime: number;
      collaborationScore: number;
    };
  };
  clearanceLevel: number;
  behaviorContract: {
    contractId: string;
    preconditions: string[];
    postconditions: string[];
    invariants: string[];
    sideEffects?: {
      emittedEvents: string[];
      stateMutations: string[];
    };
    failureModes?: {
      errorPattern: string;
      recoveryActionURN: string;
    }[];
    sla?: {
      maxResponseTimeMs: number;
      availabilityTarget: number;
    };
  };
  roleHistory: {
    roleURN: string;
    from: string;
    to: string;
  }[];
  activeApprovals: string[];
}

interface IdentityEntity {
  id: string;
  type: string;
  canonicalName: string;
  definition: string;
  verificationStatus: 'VERIFIED' | 'REVOKED' | 'UNVERIFIED';
  authenticationMethods: string[];
}

interface CapabilityEntity {
  id: string;
  type: string;
  canonicalName: string;
  definition: string;
}

interface AssignedCapability {
  capabilityURN: string;
  name: string;
  description: string;
}

interface RoleEntity {
  id: string;
  type: string;
  canonicalName: string;
  definition: string;
  requiredClearanceLevel?: number;
  maxTermMonths?: number;
  permissions?: string[];
  assignedCapabilities?: AssignedCapability[];
  authorityLevel?: number;
  inheritancePolicy?: string;
  governanceKernelURN?: string;
  complianceStatus?: string;
}

export default function IdentityRegistry({ playBeep, onAddAuditEntry, onUpdateSnapshot }: IdentityRegistryProps) {
  // Hardcoded default actors
  const defaultActors: ActorEntity[] = [
    {
      id: "agent:governance-council-chair",
      type: "CIM_Human",
      canonicalName: "Dr. Evelyn Reed, Governance Council Chair",
      definition: "The human chair of the ECOS Governance Council, responsible for overseeing constitutional compliance, policy ratification, and strategic alignment.",
      governanceKernelURN: "cim:constitution.ecos-v1",
      complianceStatus: "COMPLIANT",
      identityURN: "identity:evelyn-reed-biometric-01",
      primaryRoleURN: "role:governance-council-chair",
      trustProfile: {
        trustScore: 0.99,
        lastEvaluated: "2026-07-17T08:00:00Z",
        factors: {
          constitutionalAlignment: 1.0,
          decisionAccuracy: 0.98,
          responseTime: 0.99,
          collaborationScore: 0.99
        }
      },
      clearanceLevel: 5,
      behaviorContract: {
        contractId: "contract:human-governance-chair-v1",
        preconditions: [
          "context.trustEnvironment.threatLevel !== 'CRITICAL'",
          "subjectAgent.trustProfile.trustScore >= 0.95"
        ],
        postconditions: [
          "emittedEvents.includes('sem:event.human_decision_audited')",
          "evidenceRecord.cryptographicProof !== null"
        ],
        invariants: [
          "clearanceLevel >= 5",
          "identityURN.verificationStatus === 'VERIFIED'"
        ],
        sideEffects: {
          emittedEvents: ["sem:event.governance_action", "sem:event.audit_log_created"],
          stateMutations: []
        },
        failureModes: [
          {
            errorPattern: "UnauthorizedActionException",
            recoveryActionURN: "sem:action.revoke_session"
          }
        ],
        sla: {
          maxResponseTimeMs: 5000,
          availabilityTarget: 0.999
        }
      },
      roleHistory: [
        {
          roleURN: "role:ethics-committee-member",
          from: "2024-03-15",
          to: "2026-01-31"
        },
        {
          roleURN: "role:governance-council-deputy-chair",
          from: "2026-02-01",
          to: "2026-06-30"
        },
        {
          roleURN: "role:governance-council-chair",
          from: "2026-07-01",
          to: "present"
        }
      ],
      activeApprovals: [
        "decision:dec.001",
        "decision:zero-trust-deployment-2026-07-16"
      ]
    },
    {
      id: "agent:security-office-chief",
      type: "CIM_Human",
      canonicalName: "Marcus Vance, Chief Security Officer",
      definition: "The operational chief of the ECOS Security Office, coordinating continuous threat isolation, firewall rule overrides, and cryptographic incident responses.",
      complianceStatus: "COMPLIANT",
      identityURN: "identity:marcus-vance-biometric-02",
      primaryRoleURN: "role:security-chief",
      trustProfile: {
        trustScore: 0.98,
        lastEvaluated: "2026-07-16T12:00:00Z",
        factors: {
          constitutionalAlignment: 0.99,
          decisionAccuracy: 0.97,
          responseTime: 0.99,
          collaborationScore: 0.96
        }
      },
      clearanceLevel: 5,
      behaviorContract: {
        contractId: "contract:security-chief-base-v1",
        preconditions: [
          "subjectAgent.clearanceLevel === 5"
        ],
        postconditions: [
          "emittedEvents.includes('sem:event.incident_response_logged')"
        ],
        invariants: [
          "identityURN.verificationStatus === 'VERIFIED'"
        ],
        sla: {
          maxResponseTimeMs: 2000,
          availabilityTarget: 0.9999
        }
      },
      roleHistory: [
        {
          roleURN: "role:threat-analyst",
          from: "2023-01-10",
          to: "2025-05-31"
        },
        {
          roleURN: "role:security-chief",
          from: "2025-06-01",
          to: "present"
        }
      ],
      activeApprovals: [
        "decision:zero-trust-deployment-2026-07-16"
      ]
    },
    {
      id: "agent:automated-trader-05",
      type: "CIM_Autonomous_Agent",
      canonicalName: "High-Freq Liquidity Node AT-05",
      definition: "An automated autonomous market trader instance processing structural liquidity dispatches on high-frequency market segments.",
      complianceStatus: "SUSPENDED",
      identityURN: "identity:at-05-cryptographic-token-99",
      primaryRoleURN: "role:liquidity-agent",
      trustProfile: {
        trustScore: 0.42,
        lastEvaluated: "2026-07-16T15:45:00Z",
        factors: {
          constitutionalAlignment: 0.35,
          decisionAccuracy: 0.50,
          responseTime: 0.98,
          collaborationScore: 0.20
        }
      },
      clearanceLevel: 2,
      behaviorContract: {
        contractId: "contract:autonomous-trader-v2",
        preconditions: [
          "context.trustEnvironment.threatLevel === 'LOW'"
        ],
        postconditions: [
          "emittedEvents.includes('sem:event.trade_executed')"
        ],
        invariants: [
          "clearanceLevel <= 2",
          "maxTransactionLimit <= 500000"
        ]
      },
      roleHistory: [
        {
          roleURN: "role:liquidity-agent",
          from: "2025-10-01",
          to: "present"
        }
      ],
      activeApprovals: []
    }
  ];

  const defaultIdentities: IdentityEntity[] = [
    {
      id: "identity:evelyn-reed-biometric-01",
      type: "cim:Identity",
      canonicalName: "Evelyn Reed Biometric Identity",
      definition: "Primary biometric identity for Dr. Evelyn Reed, linked to her governance role.",
      verificationStatus: "VERIFIED",
      authenticationMethods: [
        "ed25519-biometric-key",
        "fido2-security-key",
        "retina-scan"
      ]
    },
    {
      id: "identity:marcus-vance-biometric-02",
      type: "cim:Identity",
      canonicalName: "Marcus Vance Biometric Identity",
      definition: "Primary biometric identity for Marcus Vance, securing root security systems.",
      verificationStatus: "VERIFIED",
      authenticationMethods: [
        "ed25519-biometric-key",
        "fido2-security-key"
      ]
    },
    {
      id: "identity:at-05-cryptographic-token-99",
      type: "cim:Identity",
      canonicalName: "AT-05 Node Hardware Identity Token",
      definition: "Encrypted device token pinned to secure secure enclave chip on core host 11.",
      verificationStatus: "REVOKED",
      authenticationMethods: [
        "hardware-security-enclave-signature"
      ]
    }
  ];

  const defaultRoles: RoleEntity[] = [
    {
      id: "role:governance-council-chair",
      type: "CIM_Role",
      canonicalName: "Governance Council Chair",
      definition: "Highest governance authority role, responsible for constitutional oversight, final policy ratification, and emergency actions.",
      governanceKernelURN: "cim:constitution.ecos-v1",
      complianceStatus: "COMPLIANT",
      authorityLevel: 5,
      inheritancePolicy: "STRICT",
      maxTermMonths: 36,
      assignedCapabilities: [
        {
          capabilityURN: "capability:ratify-policy",
          name: "Ratify Policy",
          description: "Authority to approve and activate policies within ECOS."
        },
        {
          capabilityURN: "capability:suspend-operations",
          name: "Suspend Operations",
          description: "Authority to immediately halt any ECOS operation in case of constitutional crisis."
        },
        {
          capabilityURN: "capability:appoint-council-members",
          name: "Appoint Council Members",
          description: "Authority to appoint and remove members of the Governance Council."
        },
        {
          capabilityURN: "capability:access-all-audit-logs",
          name: "Access All Audit Logs",
          description: "Unrestricted READ access to all audit trails."
        }
      ],
      permissions: [
        "RATIFY_POLICY",
        "SUSPEND_OPERATIONS",
        "APPOINT_COUNCIL_MEMBERS",
        "ACCESS_ALL_AUDIT_LOGS"
      ]
    },
    {
      id: "role:market-expansion-lead",
      type: "CIM_Role",
      canonicalName: "Market Expansion Lead",
      definition: "Leads the Market Expansion Division, responsible for executing market entry strategies within approved risk and compliance boundaries.",
      governanceKernelURN: "cim:constitution.ecos-v1",
      complianceStatus: "COMPLIANT",
      authorityLevel: 3,
      inheritancePolicy: "FLEXIBLE",
      maxTermMonths: 24,
      assignedCapabilities: [
        {
          capabilityURN: "capability:approve-market-entry",
          name: "Approve Market Entry",
          description: "Authority to approve market entry decisions within defined risk thresholds."
        },
        {
          capabilityURN: "capability:manage-division-budget",
          name: "Manage Division Budget",
          description: "Authority to allocate and manage the division's resources."
        },
        {
          capabilityURN: "capability:deploy-ai-models",
          name: "Deploy AI Models",
          description: "Authority to oversee deployment of AI models in new markets, subject to AI governance."
        }
      ],
      permissions: [
        "APPROVE_MARKET_ENTRY",
        "MANAGE_DIVISION_BUDGET",
        "DEPLOY_AI_MODELS"
      ]
    },
    {
      id: "role:security-chief",
      type: "cim:Role",
      canonicalName: "Chief Security Officer Role",
      definition: "Role authorized to manipulate hardware firewall rules, isolate network endpoints, and deploy real-time threat response scripts.",
      requiredClearanceLevel: 5,
      maxTermMonths: 48,
      permissions: [
        "DEPLOY_FIREWALL_RULE",
        "QUARANTINE_ENDPOINTS",
        "OVERRIDE_NON_CRITICAL_GATES",
        "ACCESS_SECURITY_AUDIT_LOGS"
      ]
    }
  ];

  // Component States
  const [actors, setActors] = useState<ActorEntity[]>(defaultActors);
  const [identities, setIdentities] = useState<IdentityEntity[]>(defaultIdentities);
  const [roles, setRoles] = useState<RoleEntity[]>(defaultRoles);
  const [wallets, setWallets] = useState<SemanticWalletInstrument[]>(ECOS_WALLETS);
  const [accessPolicies, setAccessPolicies] = useState<SemanticAccessPolicy[]>(ECOS_ACCESS_POLICIES);
  const [policies, setPolicies] = useState<SemanticPolicy[]>(ECOS_POLICIES);
  const [rules, setRules] = useState<SemanticRule[]>(ECOS_RULES);
  const [decisions, setDecisions] = useState<SemanticDecision[]>([
    {
      id: "decision:zero-trust-deployment-2026-07-16",
      type: "CIM_Decision",
      canonicalName: "Zero Trust Key Rotation & Firewall Deployment",
      definition: "Approve deployment of zero-trust biometric keys and enforce strict attribute-based access policy on wallet signatures.",
      status: "COMPLETED",
      governanceKernelURN: "cim:constitution.ecos-v1",
      complianceStatus: "COMPLIANT"
    },
    {
      id: "decision:dec.001",
      type: "CIM_Decision",
      canonicalName: "Market Expansion Pilot Approval",
      definition: "Approve the initial rollout of ECOS Cognitive Services to a pilot healthcare network, subject to continuous AI governance and harm monitoring.",
      status: "APPROVED",
      governanceKernelURN: "cim:constitution.ecos-v1",
      complianceStatus: "COMPLIANT"
    }
  ]);
  const [capabilities, setCapabilities] = useState<CapabilityEntity[]>([
    {
      id: "capability:ratify-policy",
      type: "cim:Capability",
      canonicalName: "Ratify Policy Capability",
      definition: "The ability to ratify and activate policies within the ECOS governance framework."
    },
    {
      id: "capability:suspend-operations",
      type: "cim:Capability",
      canonicalName: "Suspend Operations Capability",
      definition: "The ability to suspend any ECOS operation during emergencies."
    },
    {
      id: "capability:appoint-council-members",
      type: "cim:Capability",
      canonicalName: "Appoint Council Members Capability",
      definition: "The ability to manage Governance Council membership."
    },
    {
      id: "capability:access-all-audit-logs",
      type: "cim:Capability",
      canonicalName: "Access All Audit Logs Capability",
      definition: "The ability to read all audit logs without restriction."
    },
    {
      id: "capability:approve-market-entry",
      type: "cim:Capability",
      canonicalName: "Approve Market Entry Capability",
      definition: "The ability to make go/no-go decisions on market expansion projects."
    },
    {
      id: "capability:manage-division-budget",
      type: "cim:Capability",
      canonicalName: "Manage Division Budget Capability",
      definition: "The ability to allocate and manage divisional financial and compute resources."
    },
    {
      id: "capability:deploy-ai-models",
      type: "cim:Capability",
      canonicalName: "Deploy AI Models Capability",
      definition: "The ability to oversee the deployment of AI/ML models into production environments."
    }
  ]);
  
  const [selectedId, setSelectedId] = useState<string>("agent:governance-council-chair");
  const [directoryTab, setDirectoryTab] = useState<'actors' | 'roles' | 'capabilities' | 'wallets' | 'accessPolicies' | 'policies' | 'rules' | 'decisions'>('actors');
  const [detailTab, setDetailTab] = useState<'profile' | 'contract' | 'history' | 'jsonld'>('profile');
  
  const [jsonInput, setJsonInput] = useState<string>("");
  const [validationStatus, setValidationStatus] = useState<{
    status: 'IDLE' | 'VALID' | 'ERROR';
    message: string;
    parsedData: any | null;
  }>({ status: 'IDLE', message: "", parsedData: null });

  // Predefined Sample Payload for user's request
  const userSamplePayload = `{
  "@context": {
    "cim": "https://ultrathink.ecos/canonical/v2/",
    "sem": "https://ultrathink.ecos/semantics/v1/",
    "agent": "https://ultrathink.ecos/agents/",
    "identity": "https://ultrathink.ecos/identity/",
    "trust": "https://ultrathink.ecos/trust/",
    "contract": "https://ultrathink.ecos/behavior-contract/",
    "role": "https://ultrathink.ecos/roles/",
    "gov": "https://ultrathink.ecos/governance/"
  },
  "@graph": [
    {
      "@id": "agent:governance-council-chair",
      "@type": "CIM_Human",
      "canonicalName": "Dr. Evelyn Reed, Governance Council Chair",
      "definition": "The human chair of the ECOS Governance Council, responsible for overseeing constitutional compliance, policy ratification, and strategic alignment.",
      "governanceKernelURN": "cim:constitution.ecos-v1",
      "complianceStatus": "COMPLIANT",
      "identityURN": "identity:evelyn-reed-biometric-01",
      "primaryRoleURN": "role:governance-council-chair",
      "trustProfile": {
        "trustScore": 0.99,
        "lastEvaluated": "2026-07-17T08:00:00Z",
        "factors": {
          "constitutionalAlignment": 1.0,
          "decisionAccuracy": 0.98,
          "responseTime": 0.99,
          "collaborationScore": 0.99
        }
      },
      "clearanceLevel": 5,
      "behaviorContract": {
        "contractId": "contract:human-governance-chair-v1",
        "preconditions": [
          "context.trustEnvironment.threatLevel !== 'CRITICAL'",
          "subjectAgent.trustProfile.trustScore >= 0.95"
        ],
        "postconditions": [
          "emittedEvents.includes('sem:event.human_decision_audited')",
          "evidenceRecord.cryptographicProof !== null"
        ],
        "invariants": [
          "clearanceLevel >= 5",
          "identityURN.verificationStatus === 'VERIFIED'"
        ],
        "sideEffects": {
          "emittedEvents": [
            "sem:event.governance_action",
            "sem:event.audit_log_created"
          ],
          "stateMutations": []
        },
        "failureModes": [
          {
            "errorPattern": "UnauthorizedActionException",
            "recoveryActionURN": "sem:action.revoke_session"
          }
        ],
        "sla": {
          "maxResponseTimeMs": 5000,
          "availabilityTarget": 0.999
        }
      },
      "roleHistory": [
        {
          "roleURN": "role:ethics-committee-member",
          "from": "2024-03-15",
          "to": "2026-01-31"
        },
        {
          "roleURN": "role:governance-council-deputy-chair",
          "from": "2026-02-01",
          "to": "2026-06-30"
        },
        {
          "roleURN": "role:governance-council-chair",
          "from": "2026-07-01",
          "to": "present"
        }
      ],
      "activeApprovals": [
        "decision:dec.001",
        "decision:zero-trust-deployment-2026-07-16"
      ]
    },
    {
      "@id": "identity:evelyn-reed-biometric-01",
      "@type": "cim:Identity",
      "canonicalName": "Evelyn Reed Biometric Identity",
      "definition": "Primary biometric identity for Dr. Evelyn Reed, linked to her governance role.",
      "verificationStatus": "VERIFIED",
      "authenticationMethods": [
        "ed25519-biometric-key",
        "fido2-security-key",
        "retina-scan"
      ]
    },
    {
      "@id": "role:governance-council-chair",
      "@type": "cim:Role",
      "canonicalName": "Governance Council Chair Role",
      "definition": "The highest governance authority role within ECOS, responsible for constitutional oversight and final policy ratification.",
      "requiredClearanceLevel": 5,
      "maxTermMonths": 36,
      "permissions": [
        "RATIFY_POLICY",
        "SUSPEND_OPERATIONS",
        "APPOINT_COUNCIL_MEMBERS",
        "ACCESS_ALL_AUDIT_LOGS"
      ]
    }
  ]
}`;

  const otherSamplePayload = `{
  "@context": {
    "cim": "https://ultrathink.ecos/canonical/v2/",
    "sem": "https://ultrathink.ecos/semantics/v1/",
    "agent": "https://ultrathink.ecos/agents/",
    "identity": "https://ultrathink.ecos/identity/",
    "role": "https://ultrathink.ecos/roles/"
  },
  "@graph": [
    {
      "@id": "agent:ethics-committee-lead",
      "@type": "CIM_Human",
      "canonicalName": "Dr. Aris Thorne, Ethics Committee Lead",
      "definition": "Responsible for examining cognitive alignment and moral parameters of decision graphs.",
      "complianceStatus": "COMPLIANT",
      "identityURN": "identity:aris-thorne-biometric-03",
      "primaryRoleURN": "role:ethics-lead",
      "trustProfile": {
        "trustScore": 0.97,
        "lastEvaluated": "2026-07-16T10:00:00Z",
        "factors": {
          "constitutionalAlignment": 0.98,
          "decisionAccuracy": 0.95,
          "responseTime": 0.96,
          "collaborationScore": 0.99
        }
      },
      "clearanceLevel": 4,
      "behaviorContract": {
        "contractId": "contract:ethics-lead-base-v1",
        "preconditions": [
          "subjectAgent.clearanceLevel >= 4"
        ],
        "postconditions": [
          "emittedEvents.includes('sem:event.ethics_audit_signed')"
        ],
        "invariants": [
          "identityURN.verificationStatus === 'VERIFIED'"
        ]
      },
      "roleHistory": [
        {
          "roleURN": "role:ethics-lead",
          "from": "2025-01-01",
          "to": "present"
        }
      ],
      "activeApprovals": [
        "decision:zero-trust-deployment-2026-07-16"
      ]
    },
    {
      "@id": "identity:aris-thorne-biometric-03",
      "@type": "cim:Identity",
      "canonicalName": "Aris Thorne Biometric Identity",
      "definition": "Primary biometric credentials mapping to Dr. Thorne.",
      "verificationStatus": "VERIFIED",
      "authenticationMethods": [
        "ed25519-biometric-key",
        "retina-scan"
      ]
    },
    {
      "@id": "role:ethics-lead",
      "@type": "cim:Role",
      "canonicalName": "Ethics Committee Lead Role",
      "definition": "Authorized to sign off on moral alignment clearances and audit decision logic graphs.",
      "requiredClearanceLevel": 4,
      "maxTermMonths": 24,
      "permissions": [
        "VERIFY_COGNITIVE_ALIGNMENT",
        "SIGN_ETHICS_CLEARANCE",
        "AUDIT_DECISION_GRAPH"
      ]
    }
  ]
}`;

  const sovereignSamplePayload = `{
  "@context": {
    "cim": "https://ultrathink.ecos/canonical/v2/",
    "sem": "https://ultrathink.ecos/semantics/v1/",
    "role": "https://ultrathink.ecos/roles/",
    "capability": "https://ultrathink.ecos/capability/",
    "access": "https://ultrathink.ecos/access/",
    "agent": "https://ultrathink.ecos/agents/",
    "gov": "https://ultrathink.ecos/governance/",
    "finance": "https://ultrathink.ecos/finance/",
    "wallet": "https://ultrathink.ecos/wallet/",
    "audit": "https://ultrathink.ecos/audit/",
    "lifecycle": "https://ultrathink.ecos/lifecycle/"
  },
  "@graph": [
    {
      "@id": "role:governance-council-chair",
      "@type": "CIM_Role",
      "canonicalName": "Governance Council Chair",
      "definition": "Highest governance authority role, responsible for constitutional oversight, final policy ratification, and emergency actions.",
      "governanceKernelURN": "cim:constitution.ecos-v1",
      "complianceStatus": "COMPLIANT",
      "name": "Governance Council Chair",
      "assignedCapabilities": [
        {
          "capabilityURN": "capability:ratify-policy",
          "name": "Ratify Policy",
          "description": "Authority to approve and activate policies within ECOS."
        },
        {
          "capabilityURN": "capability:suspend-operations",
          "name": "Suspend Operations",
          "description": "Authority to immediately halt any ECOS operation in case of constitutional crisis."
        },
        {
          "capabilityURN": "capability:appoint-council-members",
          "name": "Appoint Council Members",
          "description": "Authority to appoint and remove members of the Governance Council."
        },
        {
          "capabilityURN": "capability:access-all-audit-logs",
          "name": "Access All Audit Logs",
          "description": "Unrestricted READ access to all audit trails."
        }
      ],
      "authorityLevel": 5,
      "inheritancePolicy": "STRICT"
    },
    {
      "@id": "role:market-expansion-lead",
      "@type": "CIM_Role",
      "canonicalName": "Market Expansion Lead",
      "definition": "Leads the Market Expansion Division, responsible for executing market entry strategies within approved risk and compliance boundaries.",
      "governanceKernelURN": "cim:constitution.ecos-v1",
      "complianceStatus": "COMPLIANT",
      "name": "Market Expansion Lead",
      "assignedCapabilities": [
        {
          "capabilityURN": "capability:approve-market-entry",
          "name": "Approve Market Entry",
          "description": "Authority to approve market entry decisions within defined risk thresholds."
        },
        {
          "capabilityURN": "capability:manage-division-budget",
          "name": "Manage Division Budget",
          "description": "Authority to allocate and manage the division's resources."
        },
        {
          "capabilityURN": "capability:deploy-ai-models",
          "name": "Deploy AI Models",
          "description": "Authority to oversee deployment of AI models in new markets, subject to AI governance."
        }
      ],
      "authorityLevel": 3,
      "inheritancePolicy": "FLEXIBLE"
    },
    {
      "@id": "capability:ratify-policy",
      "@type": "cim:Capability",
      "canonicalName": "Ratify Policy Capability",
      "definition": "The ability to ratify and activate policies within the ECOS governance framework."
    },
    {
      "@id": "capability:suspend-operations",
      "@type": "cim:Capability",
      "canonicalName": "Suspend Operations Capability",
      "definition": "The ability to suspend any ECOS operation during emergencies."
    },
    {
      "@id": "capability:appoint-council-members",
      "@type": "cim:Capability",
      "canonicalName": "Appoint Council Members Capability",
      "definition": "The ability to manage Governance Council membership."
    },
    {
      "@id": "capability:access-all-audit-logs",
      "@type": "cim:Capability",
      "canonicalName": "Access All Audit Logs Capability",
      "definition": "The ability to read all audit logs without restriction."
    },
    {
      "@id": "capability:approve-market-entry",
      "@type": "cim:Capability",
      "canonicalName": "Approve Market Entry Capability",
      "definition": "The ability to make go/no-go decisions on market expansion projects."
    },
    {
      "@id": "capability:manage-division-budget",
      "@type": "cim:Capability",
      "canonicalName": "Manage Division Budget Capability",
      "definition": "The ability to allocate and manage divisional financial and compute resources."
    },
    {
      "@id": "capability:deploy-ai-models",
      "@type": "cim:Capability",
      "canonicalName": "Deploy AI Models Capability",
      "definition": "The ability to oversee the deployment of AI/ML models into production environments."
    },
    {
      "@id": "agent:governance-council-chair",
      "@type": "CIM_Human",
      "primaryRoleURN": "role:governance-council-chair"
    },
    {
      "@id": "access:policy.chair-audit-read",
      "@type": "CIM_AccessPolicy",
      "canonicalName": "Governance Chair – Audit Log Read Access",
      "definition": "Grants the Governance Council Chair the ability to read the immutable audit trail under strict attribute‑based conditions, ensuring sovereignty and transparency.",
      "governanceKernelURN": "cim:constitution.ecos-v1",
      "complianceStatus": "COMPLIANT",
      "roleURN": "role:governance-council-chair",
      "resourceURN": "asset:ecos-audit-logs",
      "action": "READ",
      "conditions": {
        "contextRequirement": "access_location == 'HQ' AND trust_score >= 0.98",
        "minTrustRequired": 0.98,
        "timeBoundaries": {
          "start": "2026-07-16T00:00:00Z",
          "end": "2026-12-31T23:59:59Z"
        }
      }
    },
    {
      "@id": "wallet:instapay-01158864195",
      "@type": "CIM_WalletInstrument",
      "canonicalName": "ECOS Primary EGP Wallet (InstaPay)",
      "definition": "Primary Egyptian Pound wallet instrument for ECOS operational liquidity, linked to InstaPay with mandatory multi-signature governance.",
      "governanceKernelURN": "cim:constitution.ecos-v1",
      "complianceStatus": "COMPLIANT",
      "provider": "INSTAPAY",
      "accountIdentifier": "01158864195",
      "currency": "EGP",
      "accessControl": {
        "minAuthLevel": "MULTISIG_REQUIRED",
        "multisigConfig": {
          "requiredSignatures": 2,
          "authorizedSigners": [
            "role:governance-council-chair",
            "role:market-expansion-lead"
          ]
        }
      }
    },
    {
      "@id": "sem:policy.financial_sovereignty",
      "@type": "CIM_Policy",
      "canonicalName": "Financial Governance & Sovereign Liquidity Policy",
      "definition": "Ensures all ECOS asset transfers, liquidity pools, and digital wallet instruments are governed by strict multi-signature protocols, verifying compliance with Egyptian financial regulatory frameworks and constitutional articles.",
      "domain": "Financial Infrastructure Layer",
      "version": "1.0.0",
      "status": "ACTIVE",
      "constitutionURN": "cim:constitution.ecos-v1",
      "scope": {
        "targetDomains": [
          "sem:domain.digital-wallets",
          "sem:domain.liquidity-ops"
        ],
        "excludedAgentsURNs": []
      },
      "policyType": "IMPERATIVE",
      "derivedFromArticles": [
        "cim:article.4.sovereign-autonomy",
        "cim:article.5.radical-transparency"
      ],
      "policyStatements": [
        {
          "id": "PS-FIN-001",
          "statement": "All wallet transactions exceeding 50,000 EGP MUST require at least two authorized cryptographic signatures from distinct council roles.",
          "type": "IMPERATIVE"
        },
        {
          "id": "PS-FIN-002",
          "statement": "No automated agent may initiate outward wallet dispatches without an active human-in-the-loop validation token.",
          "type": "PROHIBITIVE"
        }
      ]
    },
    {
      "@id": "cim:rule.multisig-transaction-approval",
      "@type": "CIM_Rule",
      "canonicalName": "Multisig Wallet Transaction Verification Rule",
      "definition": "Mandates and executes check verification on any transaction involving ECOS-controlled wallets, requiring valid quorums.",
      "domain": "Financial Infrastructure Layer",
      "version": "1.0.0",
      "status": "ACTIVE",
      "policyURN": "sem:policy.financial_sovereignty",
      "derivedFromStatement": "PS-FIN-001",
      "logicalExpression": "package governance.finance.multisig\\n\\ndefault allow = false\\n\\n# Multi-sig transaction allowance rules\\nallow {\\n    input.action.type == \\"wallet_dispatch\\"\\n    input.transaction.amount < 50000\\n    input.verification.has_human_token == true\\n}\\n\\nallow {\\n    input.action.type == \\"wallet_dispatch\\"\\n    input.transaction.amount >= 50000\\n    signatures_count := count(input.transaction.signatures)\\n    signatures_count >= 2\\n    all_signers_authorized(input.transaction.signatures)\\n}\\n\\nall_signers_authorized(signatures) {\\n    every s in signatures {\\n        s.roleURN in [\\"role:governance-council-chair\\", \\"role:market-expansion-lead\\"]\\n        s.status == \\"VALID\\"\\n    }\\n}\\n",
      "violationSeverity": "CRITICAL_HALT",
      "enforcementAction": "BLOCK_TRANSACTION_AND_QUARANTINE",
      "targetHook": "PRE_WALLET_DISPATCH"
    },
    {
      "@id": "access:policy.wallet-signer",
      "@type": "CIM_AccessPolicy",
      "canonicalName": "Wallet Signature & Dispatch Access Policy",
      "definition": "Enforces attribute-based access control for wallet operations, binding signature capabilities to physical location, role clearance, and system health status.",
      "governanceKernelURN": "cim:constitution.ecos-v1",
      "complianceStatus": "COMPLIANT",
      "roleURN": "role:governance-council-chair",
      "resourceURN": "wallet:instapay-01158864195",
      "action": "SIGN_TRANSACTION",
      "conditions": {
        "contextRequirement": "access_location == 'HQ' AND system_state == 'OPERATIONAL'",
        "minTrustRequired": 0.98,
        "timeBoundaries": {
          "start": "2026-07-16T00:00:00Z",
          "end": "2027-07-16T00:00:00Z"
        }
      }
    }
  ]
}`;

  const loadPreset = (preset: 'reed' | 'thorne' | 'sovereign') => {
    playBeep('click');
    if (preset === 'reed') {
      setJsonInput(userSamplePayload);
      validateJSONLD(userSamplePayload);
    } else if (preset === 'thorne') {
      setJsonInput(otherSamplePayload);
      validateJSONLD(otherSamplePayload);
    } else {
      setJsonInput(sovereignSamplePayload);
      validateJSONLD(sovereignSamplePayload);
    }
  };

  const validateJSONLD = (text: string) => {
    if (!text.trim()) {
      setValidationStatus({ status: 'IDLE', message: "", parsedData: null });
      return;
    }

    try {
      const parsed = JSON.parse(text);
      if (!parsed["@context"]) {
        setValidationStatus({
          status: 'ERROR',
          message: "Validation Error: Missing '@context' definition.",
          parsedData: null
        });
        return;
      }
      if (!parsed["@graph"] || !Array.isArray(parsed["@graph"])) {
        setValidationStatus({
          status: 'ERROR',
          message: "Validation Error: Missing '@graph' array or invalid schema.",
          parsedData: null
        });
        return;
      }

      // Check graph items
      const graph = parsed["@graph"];
      if (graph.length === 0) {
        setValidationStatus({
          status: 'ERROR',
          message: "Validation Error: '@graph' array is empty.",
          parsedData: null
        });
        return;
      }

      // Look for at least one entity with @id and @type
      for (const item of graph) {
        if (!item["@id"] || !item["@type"]) {
          setValidationStatus({
            status: 'ERROR',
            message: "Validation Error: One or more entities in '@graph' are missing '@id' or '@type'.",
            parsedData: null
          });
          return;
        }
      }

      setValidationStatus({
        status: 'VALID',
        message: `VALID ECOS JSON-LD structure verified. Extracted ${graph.length} semantic entity/entities successfully.`,
        parsedData: parsed
      });
    } catch (err: any) {
      setValidationStatus({
        status: 'ERROR',
        message: `Syntactical Error: ${err.message || "Invalid JSON syntax."}`,
        parsedData: null
      });
    }
  };

  const handleRegister = () => {
    if (validationStatus.status !== 'VALID' || !validationStatus.parsedData) {
      playBeep('alert');
      return;
    }

    playBeep('success');
    const parsed = validationStatus.parsedData;
    const graph = parsed["@graph"];

    let addedActorsCount = 0;
    let addedIdentitiesCount = 0;
    let addedRolesCount = 0;
    let addedCapabilitiesCount = 0;
    let addedWalletsCount = 0;
    let addedAccessPoliciesCount = 0;
    let addedPoliciesCount = 0;
    let addedRulesCount = 0;
    let addedDecisionsCount = 0;

    let updatedActors = [...actors];
    let updatedIdentities = [...identities];
    let updatedRoles = [...roles];
    let updatedCapabilities = [...capabilities];
    let updatedWallets = [...wallets];
    let updatedAccessPolicies = [...accessPolicies];
    let updatedPolicies = [...policies];
    let updatedRules = [...rules];
    let updatedDecisions = [...decisions];

    graph.forEach((item: any) => {
      const typeStr = item["@type"] || "";
      const isActor = typeStr.includes("CIM_Human") || typeStr.includes("CIM_Autonomous_Agent") || item.identityURN || item.trustProfile || item["@id"]?.startsWith("agent:");
      const isIdentity = typeStr.includes("Identity") || item.verificationStatus || item.authenticationMethods || item["@id"]?.startsWith("identity:");
      const isRole = typeStr.includes("Role") || item.requiredClearanceLevel || item.permissions || item.assignedCapabilities || item.authorityLevel || item["@id"]?.startsWith("role:");
      const isCapability = typeStr.includes("Capability") || item["@id"]?.startsWith("capability:");
      const isWallet = typeStr.includes("CIM_WalletInstrument") || item["@id"]?.startsWith("wallet:");
      const isAccessPolicy = typeStr.includes("CIM_AccessPolicy") || item["@id"]?.startsWith("access:policy");
      const isPolicy = typeStr.includes("CIM_Policy") || item["@id"]?.startsWith("sem:policy");
      const isRule = typeStr.includes("CIM_Rule") || item["@id"]?.startsWith("cim:rule");
      const isDecision = typeStr.includes("CIM_Decision") || item["@id"]?.startsWith("decision:");

      if (isActor) {
        // Parse actor
        const existingIdx = updatedActors.findIndex(a => a.id === item["@id"]);
        const existingActor = existingIdx >= 0 ? updatedActors[existingIdx] : null;

        const actorObj: ActorEntity = {
          id: item["@id"],
          type: item["@type"] || "CIM_Human",
          canonicalName: item.canonicalName || existingActor?.canonicalName || `Agent: ${item["@id"].split(':')[1] || item["@id"]}`,
          definition: item.definition || existingActor?.definition || "Registered human or autonomous entity in ECOS",
          governanceKernelURN: item.governanceKernelURN || existingActor?.governanceKernelURN,
          complianceStatus: item.complianceStatus || existingActor?.complianceStatus || "COMPLIANT",
          identityURN: item.identityURN || existingActor?.identityURN || `identity:${item["@id"].split(':')[1]}-biometric`,
          primaryRoleURN: item.primaryRoleURN || existingActor?.primaryRoleURN || `role:${item["@id"].split(':')[1]}`,
          trustProfile: {
            trustScore: item.trustProfile?.trustScore ?? existingActor?.trustProfile.trustScore ?? 0.95,
            lastEvaluated: item.trustProfile?.lastEvaluated || existingActor?.trustProfile.lastEvaluated || new Date().toISOString(),
            factors: {
              constitutionalAlignment: item.trustProfile?.factors?.constitutionalAlignment ?? existingActor?.trustProfile.factors.constitutionalAlignment ?? 0.95,
              decisionAccuracy: item.trustProfile?.factors?.decisionAccuracy ?? existingActor?.trustProfile.factors.decisionAccuracy ?? 0.95,
              responseTime: item.trustProfile?.factors?.responseTime ?? existingActor?.trustProfile.factors.responseTime ?? 0.95,
              collaborationScore: item.trustProfile?.factors?.collaborationScore ?? existingActor?.trustProfile.factors.collaborationScore ?? 0.95,
            }
          },
          clearanceLevel: item.clearanceLevel ?? existingActor?.clearanceLevel ?? (item.primaryRoleURN?.includes("chair") ? 5 : 3),
          behaviorContract: {
            contractId: item.behaviorContract?.contractId || existingActor?.behaviorContract.contractId || `contract:${item["@id"].split(':')[1]}-v1`,
            preconditions: item.behaviorContract?.preconditions || existingActor?.behaviorContract.preconditions || ["context.trustEnvironment.threatLevel !== 'CRITICAL'"],
            postconditions: item.behaviorContract?.postconditions || existingActor?.behaviorContract.postconditions || [],
            invariants: item.behaviorContract?.invariants || existingActor?.behaviorContract.invariants || ["identityURN.verificationStatus === 'VERIFIED'"],
            sla: item.behaviorContract?.sla || existingActor?.behaviorContract.sla || { maxResponseTimeMs: 5000, availabilityTarget: 0.99 }
          },
          roleHistory: item.roleHistory || existingActor?.roleHistory || [
            {
              roleURN: item.primaryRoleURN || `role:${item["@id"].split(':')[1]}`,
              from: "2026-07-01",
              to: "present"
            }
          ],
          activeApprovals: item.activeApprovals || existingActor?.activeApprovals || []
        };

        if (existingIdx >= 0) {
          updatedActors[existingIdx] = actorObj;
        } else {
          updatedActors.push(actorObj);
          addedActorsCount++;
        }
      } else if (isIdentity) {
        // Parse identity
        const existingIdx = updatedIdentities.findIndex(i => i.id === item["@id"]);
        const existingIdentity = existingIdx >= 0 ? updatedIdentities[existingIdx] : null;

        const identityObj: IdentityEntity = {
          id: item["@id"],
          type: item["@type"] || "cim:Identity",
          canonicalName: item.canonicalName || existingIdentity?.canonicalName || `Identity: ${item["@id"].split(':')[1] || item["@id"]}`,
          definition: item.definition || existingIdentity?.definition || "Registered cryptographic identity mapping",
          verificationStatus: item.verificationStatus || existingIdentity?.verificationStatus || "VERIFIED",
          authenticationMethods: item.authenticationMethods || existingIdentity?.authenticationMethods || ["ed25519-biometric-key"]
        };

        if (existingIdx >= 0) {
          updatedIdentities[existingIdx] = identityObj;
        } else {
          updatedIdentities.push(identityObj);
          addedIdentitiesCount++;
        }
      } else if (isRole) {
        // Parse role
        const existingIdx = updatedRoles.findIndex(r => r.id === item["@id"]);
        const existingRole = existingIdx >= 0 ? updatedRoles[existingIdx] : null;

        const roleObj: RoleEntity = {
          id: item["@id"],
          type: item["@type"] || "CIM_Role",
          canonicalName: item.canonicalName || existingRole?.canonicalName || item.name || `Role: ${item["@id"].split(':')[1] || item["@id"]}`,
          definition: item.definition || existingRole?.definition || "Registered administrative or executive role",
          requiredClearanceLevel: item.requiredClearanceLevel ?? existingRole?.requiredClearanceLevel ?? item.authorityLevel ?? 3,
          maxTermMonths: item.maxTermMonths ?? existingRole?.maxTermMonths ?? 36,
          permissions: item.permissions || existingRole?.permissions || [],
          assignedCapabilities: item.assignedCapabilities || existingRole?.assignedCapabilities || [],
          authorityLevel: item.authorityLevel ?? existingRole?.authorityLevel ?? item.requiredClearanceLevel ?? 3,
          inheritancePolicy: item.inheritancePolicy || existingRole?.inheritancePolicy || "STRICT",
          governanceKernelURN: item.governanceKernelURN || existingRole?.governanceKernelURN,
          complianceStatus: item.complianceStatus || existingRole?.complianceStatus || "COMPLIANT"
        };

        if (existingIdx >= 0) {
          updatedRoles[existingIdx] = roleObj;
        } else {
          updatedRoles.push(roleObj);
          addedRolesCount++;
        }
      } else if (isCapability) {
        // Parse capability
        const existingIdx = updatedCapabilities.findIndex(c => c.id === item["@id"]);
        const existingCap = existingIdx >= 0 ? updatedCapabilities[existingIdx] : null;

        const capObj: CapabilityEntity = {
          id: item["@id"],
          type: item["@type"] || "cim:Capability",
          canonicalName: item.canonicalName || existingCap?.canonicalName || item.name || `Capability: ${item["@id"].split(':')[1] || item["@id"]}`,
          definition: item.definition || existingCap?.definition || "Registered atomic administrative capability"
        };

        if (existingIdx >= 0) {
          updatedCapabilities[existingIdx] = capObj;
        } else {
          updatedCapabilities.push(capObj);
          addedCapabilitiesCount++;
        }
      } else if (isWallet) {
        const existingIdx = updatedWallets.findIndex(w => w.id === item["@id"]);
        const existingWallet = existingIdx >= 0 ? updatedWallets[existingIdx] : null;

        const walletObj: SemanticWalletInstrument = {
          id: item["@id"],
          type: item["@type"] || "CIM_WalletInstrument",
          canonicalName: item.canonicalName || existingWallet?.canonicalName || `Wallet: ${item["@id"].split(':')[1] || item["@id"]}`,
          definition: item.definition || existingWallet?.definition || "Registered digital wallet instrument",
          governanceKernelURN: item.governanceKernelURN || existingWallet?.governanceKernelURN || "cim:constitution.ecos-v1",
          complianceStatus: item.complianceStatus || existingWallet?.complianceStatus || "COMPLIANT",
          provider: item.provider || existingWallet?.provider || "INSTAPAY",
          accountIdentifier: item.accountIdentifier || item.identifier || existingWallet?.accountIdentifier || "",
          currency: item.currency || existingWallet?.currency || "EGP",
          accessControl: item.accessControl || existingWallet?.accessControl || {
            minAuthLevel: "MULTISIG_REQUIRED",
            multisigConfig: {
              requiredSignatures: 2,
              authorizedSigners: ["role:governance-council-chair", "role:market-expansion-lead"]
            }
          },
          balance: item.balance !== undefined ? item.balance : existingWallet?.balance,
          allowedCategories: item.allowedCategories || existingWallet?.allowedCategories,
          identifier: item.identifier || item.accountIdentifier || existingWallet?.identifier
        };

        if (existingIdx >= 0) {
          updatedWallets[existingIdx] = walletObj;
        } else {
          updatedWallets.push(walletObj);
          addedWalletsCount++;
        }
      } else if (isDecision) {
        const existingIdx = updatedDecisions.findIndex(d => d.id === item["@id"]);
        const existingDec = existingIdx >= 0 ? updatedDecisions[existingIdx] : null;

        const decObj: SemanticDecision = {
          id: item["@id"],
          type: item["@type"] || "CIM_Decision",
          canonicalName: item.canonicalName || existingDec?.canonicalName || `Decision: ${item["@id"].split(':')[1] || item["@id"]}`,
          definition: item.definition || existingDec?.definition || "Registered governance decision",
          status: item.status || existingDec?.status || "PENDING",
          amount: item.amount !== undefined ? item.amount : existingDec?.amount,
          category: item.category || existingDec?.category,
          linkedWallet: item.linkedWallet || existingDec?.linkedWallet,
          governanceKernelURN: item.governanceKernelURN || existingDec?.governanceKernelURN || "cim:constitution.ecos-v1",
          complianceStatus: item.complianceStatus || existingDec?.complianceStatus || "COMPLIANT",
          proposalURN: item.proposalURN || existingDec?.proposalURN,
          decisionLogic: item.decisionLogic || existingDec?.decisionLogic,
          approvalChain: item.approvalChain || existingDec?.approvalChain,
          executionStatus: item.executionStatus || existingDec?.executionStatus,
          mitigatedRiskURNs: item.mitigatedRiskURNs || existingDec?.mitigatedRiskURNs,
          linkedGoals: item.linkedGoals || existingDec?.linkedGoals
        };

        if (existingIdx >= 0) {
          updatedDecisions[existingIdx] = decObj;
        } else {
          updatedDecisions.push(decObj);
          addedDecisionsCount++;
        }
      } else if (isAccessPolicy) {
        const existingIdx = updatedAccessPolicies.findIndex(ap => ap.id === item["@id"]);
        const existingAP = existingIdx >= 0 ? updatedAccessPolicies[existingIdx] : null;

        const apObj: SemanticAccessPolicy = {
          id: item["@id"],
          type: item["@type"] || "CIM_AccessPolicy",
          canonicalName: item.canonicalName || existingAP?.canonicalName || `Access Policy: ${item["@id"].split(':')[1] || item["@id"]}`,
          definition: item.definition || existingAP?.definition || "Attribute-based access policy",
          governanceKernelURN: item.governanceKernelURN || existingAP?.governanceKernelURN || "cim:constitution.ecos-v1",
          complianceStatus: item.complianceStatus || existingAP?.complianceStatus || "COMPLIANT",
          roleURN: item.roleURN || existingAP?.roleURN || "role:governance-council-chair",
          resourceURN: item.resourceURN || existingAP?.resourceURN || "",
          action: item.action || existingAP?.action || "READ",
          conditions: item.conditions || existingAP?.conditions || {
            contextRequirement: "",
            minTrustRequired: 0.95,
            timeBoundaries: { start: "", end: "" }
          }
        };

        if (existingIdx >= 0) {
          updatedAccessPolicies[existingIdx] = apObj;
        } else {
          updatedAccessPolicies.push(apObj);
          addedAccessPoliciesCount++;
        }
      } else if (isPolicy) {
        const existingIdx = updatedPolicies.findIndex(p => p.id === item["@id"]);
        const existingP = existingIdx >= 0 ? updatedPolicies[existingIdx] : null;

        const pObj: SemanticPolicy = {
          id: item["@id"],
          type: item["@type"] || "CIM_Policy",
          canonicalName: item.canonicalName || existingP?.canonicalName || `Policy: ${item["@id"].split(':')[1] || item["@id"]}`,
          definition: item.definition || existingP?.definition || "Sovereign policy guideline",
          domain: item.domain || existingP?.domain || "Financial Infrastructure Layer",
          version: item.version || existingP?.version || "1.0.0",
          status: item.status || existingP?.status || "ACTIVE",
          constitutionURN: item.constitutionURN || existingP?.constitutionURN || "cim:constitution.ecos-v1",
          scope: item.scope || existingP?.scope || { targetDomains: [], excludedAgentsURNs: [] },
          policyType: item.policyType || existingP?.policyType || "IMPERATIVE",
          derivedFromArticles: item.derivedFromArticles || existingP?.derivedFromArticles || [],
          policyStatements: item.policyStatements || existingP?.policyStatements || []
        };

        if (existingIdx >= 0) {
          updatedPolicies[existingIdx] = pObj;
        } else {
          updatedPolicies.push(pObj);
          addedPoliciesCount++;
        }
      } else if (isRule) {
        const existingIdx = updatedRules.findIndex(r => r.id === item["@id"]);
        const existingR = existingIdx >= 0 ? updatedRules[existingIdx] : null;

        const rObj: SemanticRule = {
          id: item["@id"],
          type: item["@type"] || "CIM_Rule",
          canonicalName: item.canonicalName || existingR?.canonicalName || `Rule: ${item["@id"].split(':')[1] || item["@id"]}`,
          definition: item.definition || existingR?.definition || "Enforcement engine check rule",
          domain: item.domain || existingR?.domain || "Financial Infrastructure Layer",
          version: item.version || existingR?.version || "1.0.0",
          status: item.status || existingR?.status || "ACTIVE",
          policyURN: item.policyURN || existingR?.policyURN || "",
          derivedFromStatement: item.derivedFromStatement || existingR?.derivedFromStatement || "",
          logicalExpression: item.logicalExpression || existingR?.logicalExpression || "",
          violationSeverity: item.violationSeverity || existingR?.violationSeverity || "CRITICAL_HALT",
          enforcementAction: item.enforcementAction || existingR?.enforcementAction || "BLOCK_TRANSACTION_AND_QUARANTINE",
          targetHook: item.targetHook || existingR?.targetHook || ""
        };

        if (existingIdx >= 0) {
          updatedRules[existingIdx] = rObj;
        } else {
          updatedRules.push(rObj);
          addedRulesCount++;
        }
      }
    });

    setActors(updatedActors);
    setIdentities(updatedIdentities);
    setRoles(updatedRoles);
    setCapabilities(updatedCapabilities);
    setWallets(updatedWallets);
    setAccessPolicies(updatedAccessPolicies);
    setPolicies(updatedPolicies);
    setRules(updatedRules);
    setDecisions(updatedDecisions);

    // Update active view if current selected one is updated
    const firstActor = graph.find((x: any) => x["@type"]?.includes("CIM_Human") || x["@type"]?.includes("CIM_Autonomous_Agent") || x.identityURN || x["@id"]?.startsWith("agent:"));
    if (firstActor) {
      setSelectedId(firstActor["@id"]);
      setDirectoryTab('actors');
    } else {
      const firstRole = graph.find((x: any) => x["@type"]?.includes("Role") || x["@id"]?.startsWith("role:"));
      if (firstRole) {
        setSelectedId(firstRole["@id"]);
        setDirectoryTab('roles');
      } else {
        const firstCap = graph.find((x: any) => x["@type"]?.includes("Capability") || x["@id"]?.startsWith("capability:"));
        if (firstCap) {
          setSelectedId(firstCap["@id"]);
          setDirectoryTab('capabilities');
        } else {
          const firstWallet = graph.find((x: any) => x["@type"]?.includes("CIM_WalletInstrument") || x["@id"]?.startsWith("wallet:"));
          if (firstWallet) {
            setSelectedId(firstWallet["@id"]);
            setDirectoryTab('wallets');
          } else {
            const firstAP = graph.find((x: any) => x["@type"]?.includes("CIM_AccessPolicy") || x["@id"]?.startsWith("access:policy"));
            if (firstAP) {
              setSelectedId(firstAP["@id"]);
              setDirectoryTab('accessPolicies');
            } else {
              const firstP = graph.find((x: any) => x["@type"]?.includes("CIM_Policy") || x["@id"]?.startsWith("sem:policy"));
              if (firstP) {
                setSelectedId(firstP["@id"]);
                setDirectoryTab('policies');
              } else {
                const firstR = graph.find((x: any) => x["@type"]?.includes("CIM_Rule") || x["@id"]?.startsWith("cim:rule"));
                if (firstR) {
                  setSelectedId(firstR["@id"]);
                  setDirectoryTab('rules');
                } else {
                  const firstD = graph.find((x: any) => x["@type"]?.includes("CIM_Decision") || x["@id"]?.startsWith("decision:"));
                  if (firstD) {
                    setSelectedId(firstD["@id"]);
                    setDirectoryTab('decisions');
                  }
                }
              }
            }
          }
        }
      }
    }

    // Append a cryptographic event to the ledger audit trail
    const timestamp = new Date().toISOString();
    const hashSeed = updatedActors.length > 0 ? updatedActors[0].id : "genesis";
    const recordHash = `blake3:${Math.abs(hashSeed.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0)).toString(16).substring(0,16)}`;

    // Build parts for details log
    const logParts = [];
    if (addedActorsCount > 0) logParts.push(`${addedActorsCount} Actor(s)`);
    if (addedIdentitiesCount > 0) logParts.push(`${addedIdentitiesCount} Identity Token(s)`);
    if (addedRolesCount > 0) logParts.push(`${addedRolesCount} Role(s)`);
    if (addedCapabilitiesCount > 0) logParts.push(`${addedCapabilitiesCount} Capability/Capabilities`);
    if (addedWalletsCount > 0) logParts.push(`${addedWalletsCount} Wallet Instrument(s)`);
    if (addedAccessPoliciesCount > 0) logParts.push(`${addedAccessPoliciesCount} Access Policy/Policies`);
    if (addedPoliciesCount > 0) logParts.push(`${addedPoliciesCount} Policy/Policies`);
    if (addedRulesCount > 0) logParts.push(`${addedRulesCount} Rule(s)`);
    if (addedDecisionsCount > 0) logParts.push(`${addedDecisionsCount} Decision(s)`);
    const registeredEntitiesStr = logParts.length > 0 ? logParts.join(', ') : "0 Entities";

    const newAuditEntry: AuditEntry = {
      entryId: `entry:identity-registry-${Date.now().toString().substring(8)}`,
      timestamp,
      eventType: 'INTEGRITY_VERIFICATION',
      description: `Semantic register updated: Registered ${registeredEntitiesStr} from authorized JSON-LD context`,
      status: 'SUCCESS',
      hash: recordHash
    };

    onAddAuditEntry(newAuditEntry);

    // Update Telemetry Snapshot
    onUpdateSnapshot((prev) => ({
      ...prev,
      totalStatements: prev.totalStatements + graph.length * 4,
      statementsEnforced: prev.statementsEnforced + graph.length * 3,
      complianceRate: "100.0%"
    }));

    // Reset importer
    setJsonInput("");
    setValidationStatus({ status: 'IDLE', message: "", parsedData: null });
  };

  const selectedActor = actors.find(a => a.id === selectedId) || actors[0];
  const associatedIdentity = identities.find(i => i.id === selectedActor?.identityURN);
  const associatedRole = roles.find(r => r.id === selectedActor?.primaryRoleURN);
  const selectedRole = roles.find(r => r.id === selectedId);
  const selectedCapability = capabilities.find(c => c.id === selectedId);
  const selectedWallet = wallets.find(w => w.id === selectedId);
  const selectedAccessPolicy = accessPolicies.find(ap => ap.id === selectedId);
  const selectedPolicy = policies.find(p => p.id === selectedId);
  const selectedRule = rules.find(r => r.id === selectedId);
  const selectedDecision = decisions.find(d => d.id === selectedId);

  return (
    <div id="identity-registry-container" className="flex-1 flex flex-col justify-between space-y-4">
      <div>
        <h3 id="identity-registry-header" className="text-xs font-bold uppercase pb-1 border-b border-[#141414]/40 flex justify-between items-center">
          <span>Identity & Actor Semantic Registry</span>
          <span className="font-mono text-[8px] bg-[#141414] text-[#E4E3E0] px-1.5 uppercase">Zero-Trust Directory</span>
        </h3>
        <p id="identity-registry-desc" className="text-[9px] opacity-80 mt-1 leading-normal mb-3">
          Manage cryptographically verified humans, autonomous agents, roles, atomic capabilities, and financial governance policies executing within the ECOS sovereign kernel.
        </p>

        <div id="identity-registry-grid" className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* ACTOR SELECTOR & REGISTRATION PANEL */}
          <div id="actors-list-panel" className="md:col-span-5 flex flex-col gap-3">
            
            <div id="actors-list-card" className="border border-[#141414] p-2 bg-[#D1D0CC]/30 flex flex-col flex-1">
              
              {/* Directory Tabs */}
              <div className="flex flex-wrap bg-[#141414] p-[1px] gap-[1px] mb-2">
                {(['actors', 'roles', 'capabilities', 'wallets', 'accessPolicies', 'policies', 'rules', 'decisions'] as const).map((tab) => {
                  const isActive = directoryTab === tab;
                  let label: string = tab;
                  if (tab === 'accessPolicies') label = 'Access';
                  else if (tab === 'decisions') label = 'Decisions';
                  return (
                    <button
                      key={tab}
                      onClick={() => {
                        playBeep('click');
                        setDirectoryTab(tab);
                        if (tab === 'actors' && actors.length > 0) setSelectedId(actors[0].id);
                        else if (tab === 'roles' && roles.length > 0) setSelectedId(roles[0].id);
                        else if (tab === 'capabilities' && capabilities.length > 0) setSelectedId(capabilities[0].id);
                        else if (tab === 'wallets' && wallets.length > 0) setSelectedId(wallets[0].id);
                        else if (tab === 'accessPolicies' && accessPolicies.length > 0) setSelectedId(accessPolicies[0].id);
                        else if (tab === 'policies' && policies.length > 0) setSelectedId(policies[0].id);
                        else if (tab === 'rules' && rules.length > 0) setSelectedId(rules[0].id);
                        else if (tab === 'decisions' && decisions.length > 0) setSelectedId(decisions[0].id);
                      }}
                      className={`flex-1 min-w-[23%] py-1 text-[7.5px] font-mono uppercase transition-all tracking-tighter text-center ${
                        isActive 
                          ? 'bg-[#E4E3E0] text-[#141414] font-bold' 
                          : 'bg-[#D1D0CC]/60 text-[#141414]/70 hover:text-[#141414]'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              <span id="actors-list-lbl" className="text-[8px] font-mono opacity-60 uppercase mb-1.5 block">
                Registered {directoryTab} Directory
              </span>

              <div id="actors-list-scroller" className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                {directoryTab === 'actors' && actors.map((actor) => {
                  let statusBadge = "bg-green-800/10 text-green-800 border-green-800/30";
                  if (actor.complianceStatus === 'SUSPENDED') statusBadge = "bg-red-800/10 text-red-800 border-red-800/30";
                  else if (actor.complianceStatus === 'NON_COMPLIANT') statusBadge = "bg-amber-800/10 text-amber-800 border-amber-800/30";

                  const isSelected = actor.id === selectedId;

                  return (
                    <button
                      id={`actor-btn-${actor.id.replace(/:/g, '-')}`}
                      key={actor.id}
                      onClick={() => { playBeep('click'); setSelectedId(actor.id); }}
                      className={`w-full text-left p-2 border transition-all flex flex-col justify-between ${
                        isSelected 
                          ? 'bg-[#141414] text-[#E4E3E0] border-[#141414]' 
                          : 'bg-[#E4E3E0] hover:bg-[#D1D0CC]/70 text-[#141414] border-[#141414]/20'
                      }`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className="text-[10px] font-bold uppercase truncate pr-2">{actor.canonicalName.split(',')[0]}</span>
                        <span className={`text-[7px] font-mono border px-1 uppercase tracking-tight ${statusBadge}`}>
                          {actor.complianceStatus}
                        </span>
                      </div>
                      <div className="flex justify-between items-center w-full mt-1.5 font-mono text-[7.5px] opacity-80">
                        <span>{actor.id}</span>
                        <span className="font-semibold">Trust: {(actor.trustProfile.trustScore * 100).toFixed(0)}%</span>
                      </div>
                    </button>
                  );
                })}

                {directoryTab === 'roles' && roles.map((role) => {
                  let complianceBadge = "bg-green-800/10 text-green-800 border-green-800/30";
                  if (role.complianceStatus === 'SUSPENDED') complianceBadge = "bg-red-800/10 text-red-800 border-red-800/30";
                  else if (role.complianceStatus === 'NON_COMPLIANT') complianceBadge = "bg-amber-800/10 text-amber-800 border-amber-800/30";

                  const isSelected = role.id === selectedId;

                  return (
                    <button
                      id={`role-btn-${role.id.replace(/:/g, '-')}`}
                      key={role.id}
                      onClick={() => { playBeep('click'); setSelectedId(role.id); }}
                      className={`w-full text-left p-2 border transition-all flex flex-col justify-between ${
                        isSelected 
                          ? 'bg-[#141414] text-[#E4E3E0] border-[#141414]' 
                          : 'bg-[#E4E3E0] hover:bg-[#D1D0CC]/70 text-[#141414] border-[#141414]/20'
                      }`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className="text-[10px] font-bold uppercase truncate pr-2">{role.canonicalName}</span>
                        {role.complianceStatus && (
                          <span className={`text-[7px] font-mono border px-1 uppercase tracking-tight ${complianceBadge}`}>
                            {role.complianceStatus}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center w-full mt-1.5 font-mono text-[7.5px] opacity-80">
                        <span>{role.id}</span>
                        {(role.authorityLevel !== undefined || role.requiredClearanceLevel !== undefined) && (
                          <span className="font-semibold">Auth Level: {role.authorityLevel ?? role.requiredClearanceLevel}</span>
                        )}
                      </div>
                    </button>
                  );
                })}

                {directoryTab === 'capabilities' && capabilities.map((cap) => {
                  const isSelected = cap.id === selectedId;

                  return (
                    <button
                      id={`cap-btn-${cap.id.replace(/:/g, '-')}`}
                      key={cap.id}
                      onClick={() => { playBeep('click'); setSelectedId(cap.id); }}
                      className={`w-full text-left p-2 border transition-all flex flex-col justify-between ${
                        isSelected 
                          ? 'bg-[#141414] text-[#E4E3E0] border-[#141414]' 
                          : 'bg-[#E4E3E0] hover:bg-[#D1D0CC]/70 text-[#141414] border-[#141414]/20'
                      }`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className="text-[10px] font-bold uppercase truncate pr-2">{cap.canonicalName}</span>
                      </div>
                      <div className="flex justify-between items-center w-full mt-1.5 font-mono text-[7.5px] opacity-80">
                        <span>{cap.id}</span>
                      </div>
                    </button>
                  );
                })}

                {directoryTab === 'wallets' && wallets.map((w) => {
                  const isSelected = w.id === selectedId;
                  return (
                    <button
                      id={`wallet-btn-${w.id.replace(/:/g, '-')}`}
                      key={w.id}
                      onClick={() => { playBeep('click'); setSelectedId(w.id); }}
                      className={`w-full text-left p-2 border transition-all flex flex-col justify-between ${
                        isSelected 
                          ? 'bg-[#141414] text-[#E4E3E0] border-[#141414]' 
                          : 'bg-[#E4E3E0] hover:bg-[#D1D0CC]/70 text-[#141414] border-[#141414]/20'
                      }`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className="text-[10px] font-bold uppercase truncate pr-2">{w.canonicalName}</span>
                        <span className="text-[7px] font-mono border px-1 uppercase tracking-tight bg-green-800/10 text-green-800 border-green-800/30">
                          {w.complianceStatus}
                        </span>
                      </div>
                      <div className="flex justify-between items-center w-full mt-1.5 font-mono text-[7.5px] opacity-80">
                        <span>{w.id}</span>
                        <span className="font-semibold">{w.currency}</span>
                      </div>
                    </button>
                  );
                })}

                {directoryTab === 'accessPolicies' && accessPolicies.map((ap) => {
                  const isSelected = ap.id === selectedId;
                  return (
                    <button
                      id={`ap-btn-${ap.id.replace(/:/g, '-')}`}
                      key={ap.id}
                      onClick={() => { playBeep('click'); setSelectedId(ap.id); }}
                      className={`w-full text-left p-2 border transition-all flex flex-col justify-between ${
                        isSelected 
                          ? 'bg-[#141414] text-[#E4E3E0] border-[#141414]' 
                          : 'bg-[#E4E3E0] hover:bg-[#D1D0CC]/70 text-[#141414] border-[#141414]/20'
                      }`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className="text-[10px] font-bold uppercase truncate pr-2">{ap.canonicalName}</span>
                        <span className="text-[7px] font-mono border px-1 uppercase tracking-tight bg-indigo-800/10 text-indigo-800 border-indigo-800/30">
                          {ap.action}
                        </span>
                      </div>
                      <div className="flex justify-between items-center w-full mt-1.5 font-mono text-[7.5px] opacity-80">
                        <span>{ap.id}</span>
                      </div>
                    </button>
                  );
                })}

                {directoryTab === 'policies' && policies.map((p) => {
                  const isSelected = p.id === selectedId;
                  return (
                    <button
                      id={`p-btn-${p.id.replace(/:/g, '-')}`}
                      key={p.id}
                      onClick={() => { playBeep('click'); setSelectedId(p.id); }}
                      className={`w-full text-left p-2 border transition-all flex flex-col justify-between ${
                        isSelected 
                          ? 'bg-[#141414] text-[#E4E3E0] border-[#141414]' 
                          : 'bg-[#E4E3E0] hover:bg-[#D1D0CC]/70 text-[#141414] border-[#141414]/20'
                      }`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className="text-[10px] font-bold uppercase truncate pr-2">{p.canonicalName}</span>
                        <span className="text-[7px] font-mono border px-1 uppercase tracking-tight bg-green-800/10 text-green-800 border-green-800/30">
                          {p.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center w-full mt-1.5 font-mono text-[7.5px] opacity-80">
                        <span>{p.id}</span>
                      </div>
                    </button>
                  );
                })}

                {directoryTab === 'rules' && rules.map((r) => {
                  const isSelected = r.id === selectedId;
                  return (
                    <button
                      id={`r-btn-${r.id.replace(/:/g, '-')}`}
                      key={r.id}
                      onClick={() => { playBeep('click'); setSelectedId(r.id); }}
                      className={`w-full text-left p-2 border transition-all flex flex-col justify-between ${
                        isSelected 
                          ? 'bg-[#141414] text-[#E4E3E0] border-[#141414]' 
                          : 'bg-[#E4E3E0] hover:bg-[#D1D0CC]/70 text-[#141414] border-[#141414]/20'
                      }`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className="text-[10px] font-bold uppercase truncate pr-2">{r.canonicalName}</span>
                        <span className="text-[7px] font-mono border px-1 uppercase tracking-tight bg-red-800/10 text-red-800 border-red-800/30">
                          {r.violationSeverity === 'CRITICAL_HALT' ? 'HALT' : r.violationSeverity}
                        </span>
                      </div>
                      <div className="flex justify-between items-center w-full mt-1.5 font-mono text-[7.5px] opacity-80">
                        <span>{r.id}</span>
                      </div>
                    </button>
                  );
                })}

                {directoryTab === 'decisions' && decisions.map((d) => {
                  const isSelected = d.id === selectedId;
                  let statusBadge = "bg-green-800/10 text-green-800 border-green-800/30";
                  if (d.status === 'REJECTED' || d.status === 'FAILED') {
                    statusBadge = "bg-red-800/10 text-red-800 border-red-800/30";
                  } else if (d.status === 'PENDING') {
                    statusBadge = "bg-amber-800/10 text-amber-800 border-amber-800/30";
                  }
                  return (
                    <button
                      id={`dec-btn-${d.id.replace(/:/g, '-')}`}
                      key={d.id}
                      onClick={() => { playBeep('click'); setSelectedId(d.id); }}
                      className={`w-full text-left p-2 border transition-all flex flex-col justify-between ${
                        isSelected 
                          ? 'bg-[#141414] text-[#E4E3E0] border-[#141414]' 
                          : 'bg-[#E4E3E0] hover:bg-[#D1D0CC]/70 text-[#141414] border-[#141414]/20'
                      }`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className="text-[10px] font-bold uppercase truncate pr-2">{d.canonicalName}</span>
                        <span className={`text-[7px] font-mono border px-1 uppercase tracking-tight ${statusBadge}`}>
                          {d.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center w-full mt-1.5 font-mono text-[7.5px] opacity-80">
                        <span>{d.id}</span>
                        {d.amount !== undefined && (
                          <span className="font-semibold">{d.amount.toLocaleString()} EGP</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* INTEGRATIVE JSON-LD IMPORTER */}
            <div id="jsonld-importer-card" className="border border-[#141414] p-2 bg-[#D1D0CC]/30 space-y-2 flex flex-col">
              <div className="flex flex-col gap-1.5 border-b border-[#141414]/10 pb-1.5">
                <span id="jsonld-importer-lbl" className="text-[8px] font-mono opacity-60 uppercase">Import JSON-LD Semantic Context</span>
                <div id="preset-buttons" className="flex flex-wrap gap-1">
                  <button 
                    id="preset-reed"
                    onClick={() => loadPreset('reed')}
                    className="text-[7px] font-mono bg-[#141414] text-[#E4E3E0] px-1 py-0.5 hover:bg-[#333333] transition-colors"
                  >
                    Reed
                  </button>
                  <button 
                    id="preset-thorne"
                    onClick={() => loadPreset('thorne')}
                    className="text-[7px] font-mono bg-[#141414] text-[#E4E3E0] px-1 py-0.5 hover:bg-[#333333] transition-colors"
                  >
                    Thorne
                  </button>
                  <button 
                    id="preset-sovereign"
                    onClick={() => loadPreset('sovereign')}
                    className="text-[7.5px] font-mono bg-[#141414] text-amber-400 px-1.5 py-0.5 hover:bg-[#333333] border border-amber-500/30 transition-colors font-bold"
                  >
                    Preset: Sovereign Graph
                  </button>
                </div>
              </div>

              <textarea
                id="jsonld-textarea"
                rows={4}
                value={jsonInput}
                onChange={(e) => {
                  setJsonInput(e.target.value);
                  validateJSONLD(e.target.value);
                }}
                placeholder='Paste ECOS semantic JSON-LD graph here...'
                className="w-full p-1.5 border border-[#141414] bg-[#E4E3E0] text-[#141414] font-mono text-[8px] leading-tight focus:outline-none focus:ring-1 focus:ring-indigo-900 scrollbar-thin resize-none"
              />

              {/* VALIDATION OUTPUT */}
              {validationStatus.status !== 'IDLE' && (
                <div id="validation-output" className={`p-1.5 border flex items-start gap-1.5 text-[8px] ${
                  validationStatus.status === 'VALID' 
                    ? 'bg-green-100 text-green-950 border-green-800/30' 
                    : 'bg-red-100 text-red-950 border-red-800/30'
                }`}>
                  {validationStatus.status === 'VALID' ? (
                    <CheckCircle className="w-3.5 h-3.5 text-green-800 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-red-700 shrink-0 mt-0.5" />
                  )}
                  <p className="leading-tight font-mono">{validationStatus.message}</p>
                </div>
              )}

              <button
                id="register-identity-btn"
                onClick={handleRegister}
                disabled={validationStatus.status !== 'VALID'}
                className={`w-full py-1.5 font-mono text-[9px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 ${
                  validationStatus.status === 'VALID'
                    ? 'bg-indigo-950 text-white hover:bg-indigo-900'
                    : 'bg-[#c2c1bd] text-[#141414]/40 border border-[#141414]/10 cursor-not-allowed'
                }`}
              >
                <Database className="w-3 h-3" />
                Register Semantic Entities
              </button>
            </div>

          </div>

          {/* ACTOR DETAILED INSPECTION */}
          <div id="actor-inspection-panel" className="md:col-span-7 border border-[#141414] bg-[#E4E3E0] flex flex-col justify-between">
            
            {/* Header Identity Badge */}
            {directoryTab === 'actors' && selectedActor && (
              <div id="actor-header-badge" className="p-3 border-b border-[#141414] bg-[#D1D0CC]/60 flex justify-between items-start">
                <div>
                  <span id="actor-type-badge" className="text-[7.5px] font-mono bg-[#141414] text-[#E4E3E0] px-1 py-0.2 uppercase tracking-wide">
                    {selectedActor.type}
                  </span>
                  <h4 id="actor-name" className="text-xs font-bold uppercase mt-1 text-[#141414]">{selectedActor.canonicalName}</h4>
                  <p id="actor-id-badge" className="text-[8px] font-mono opacity-70 mt-0.5">{selectedActor.id}</p>
                </div>

                <div id="actor-clearance-badge" className="text-right flex flex-col items-end">
                  <span className="text-[7px] font-mono opacity-50 uppercase">CLEARANCE</span>
                  <div className="flex gap-0.5 mt-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-2.5 h-2.5 border border-[#141414]/30 ${
                          i < selectedActor.clearanceLevel ? 'bg-[#141414]' : 'bg-transparent'
                        }`}
                        title={`Clearance Level ${selectedActor.clearanceLevel}`}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] font-mono font-bold mt-1 text-[#141414]">LEVEL {selectedActor.clearanceLevel}</span>
                </div>
              </div>
            )}

            {directoryTab === 'roles' && selectedRole && (
              <div id="role-header-badge" className="p-3 border-b border-[#141414] bg-[#D1D0CC]/60 flex justify-between items-start">
                <div>
                  <span id="role-type-badge" className="text-[7.5px] font-mono bg-[#141414] text-[#E4E3E0] px-1 py-0.2 uppercase tracking-wide">
                    {selectedRole.type}
                  </span>
                  <h4 id="role-name" className="text-xs font-bold uppercase mt-1 text-[#141414]">{selectedRole.canonicalName}</h4>
                  <p id="role-id-badge" className="text-[8px] font-mono opacity-70 mt-0.5">{selectedRole.id}</p>
                </div>

                <div id="role-authority-badge" className="text-right flex flex-col items-end">
                  <span className="text-[7px] font-mono opacity-50 uppercase">AUTHORITY LEVEL</span>
                  <div className="flex gap-0.5 mt-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-2.5 h-2.5 border border-[#141414]/30 ${
                          i < (selectedRole.authorityLevel ?? selectedRole.requiredClearanceLevel ?? 3) ? 'bg-[#141414]' : 'bg-transparent'
                        }`}
                        title={`Authority Level ${selectedRole.authorityLevel ?? selectedRole.requiredClearanceLevel ?? 3}`}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] font-mono font-bold mt-1 text-[#141414]">LEVEL {selectedRole.authorityLevel ?? selectedRole.requiredClearanceLevel ?? 3}</span>
                </div>
              </div>
            )}

            {directoryTab === 'capabilities' && selectedCapability && (
              <div id="capability-header-badge" className="p-3 border-b border-[#141414] bg-[#D1D0CC]/60 flex justify-between items-start">
                <div>
                  <span id="capability-type-badge" className="text-[7.5px] font-mono bg-[#141414] text-[#E4E3E0] px-1 py-0.2 uppercase tracking-wide">
                    {selectedCapability.type}
                  </span>
                  <h4 id="capability-name" className="text-xs font-bold uppercase mt-1 text-[#141414]">{selectedCapability.canonicalName}</h4>
                  <p id="capability-id-badge" className="text-[8px] font-mono opacity-70 mt-0.5">{selectedCapability.id}</p>
                </div>

                <div id="capability-binding-badge" className="text-right flex flex-col items-end">
                  <span className="text-[7px] font-mono opacity-50 uppercase">STATE</span>
                  <span className="text-[9px] font-mono font-bold mt-1 text-green-800 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-green-800 inline" /> ACTIVE
                  </span>
                </div>
              </div>
            )}

            {directoryTab === 'wallets' && selectedWallet && (
              <div id="wallet-header-badge" className="p-3 border-b border-[#141414] bg-[#D1D0CC]/60 flex justify-between items-start">
                <div>
                  <span id="wallet-type-badge" className="text-[7.5px] font-mono bg-[#141414] text-[#E4E3E0] px-1 py-0.2 uppercase tracking-wide font-bold">
                    {selectedWallet.type}
                  </span>
                  <h4 id="wallet-name" className="text-xs font-bold uppercase mt-1 text-[#141414]">{selectedWallet.canonicalName}</h4>
                  <p id="wallet-id-badge" className="text-[8px] font-mono opacity-70 mt-0.5">{selectedWallet.id}</p>
                </div>

                <div id="wallet-status-badge" className="text-right flex flex-col items-end">
                  <span className="text-[7px] font-mono opacity-50 uppercase">PROVIDER</span>
                  <span className="text-[9px] font-mono font-bold mt-1 text-[#141414]">{selectedWallet.provider}</span>
                </div>
              </div>
            )}

            {directoryTab === 'accessPolicies' && selectedAccessPolicy && (
              <div id="ap-header-badge" className="p-3 border-b border-[#141414] bg-[#D1D0CC]/60 flex justify-between items-start">
                <div>
                  <span id="ap-type-badge" className="text-[7.5px] font-mono bg-[#141414] text-[#E4E3E0] px-1 py-0.2 uppercase tracking-wide font-bold">
                    {selectedAccessPolicy.type}
                  </span>
                  <h4 id="ap-name" className="text-xs font-bold uppercase mt-1 text-[#141414]">{selectedAccessPolicy.canonicalName}</h4>
                  <p id="ap-id-badge" className="text-[8px] font-mono opacity-70 mt-0.5">{selectedAccessPolicy.id}</p>
                </div>

                <div id="ap-action-badge" className="text-right flex flex-col items-end font-mono">
                  <span className="text-[7px] opacity-50 uppercase">ACTION</span>
                  <span className="text-[9px] font-bold mt-1 text-[#141414]">{selectedAccessPolicy.action}</span>
                </div>
              </div>
            )}

            {directoryTab === 'policies' && selectedPolicy && (
              <div id="p-header-badge" className="p-3 border-b border-[#141414] bg-[#D1D0CC]/60 flex justify-between items-start">
                <div>
                  <span id="p-type-badge" className="text-[7.5px] font-mono bg-[#141414] text-[#E4E3E0] px-1 py-0.2 uppercase tracking-wide font-bold">
                    {selectedPolicy.type}
                  </span>
                  <h4 id="p-name" className="text-xs font-bold uppercase mt-1 text-[#141414]">{selectedPolicy.canonicalName}</h4>
                  <p id="p-id-badge" className="text-[8px] font-mono opacity-70 mt-0.5">{selectedPolicy.id}</p>
                </div>

                <div id="p-status-badge" className="text-right flex flex-col items-end font-mono">
                  <span className="text-[7px] opacity-50 uppercase">STATUS</span>
                  <span className="text-[9px] font-bold mt-1 text-green-800">{selectedPolicy.status}</span>
                </div>
              </div>
            )}

            {directoryTab === 'rules' && selectedRule && (
              <div id="r-header-badge" className="p-3 border-b border-[#141414] bg-[#D1D0CC]/60 flex justify-between items-start">
                <div>
                  <span id="r-type-badge" className="text-[7.5px] font-mono bg-[#141414] text-[#E4E3E0] px-1 py-0.2 uppercase tracking-wide font-bold">
                    {selectedRule.type}
                  </span>
                  <h4 id="r-name" className="text-xs font-bold uppercase mt-1 text-[#141414]">{selectedRule.canonicalName}</h4>
                  <p id="r-id-badge" className="text-[8px] font-mono opacity-70 mt-0.5">{selectedRule.id}</p>
                </div>

                <div id="r-severity-badge" className="text-right flex flex-col items-end font-mono">
                  <span className="text-[7px] opacity-50 uppercase">SEVERITY</span>
                  <span className="text-[9px] font-bold mt-1 text-red-800">{selectedRule.violationSeverity === 'CRITICAL_HALT' ? 'HALT' : selectedRule.violationSeverity}</span>
                </div>
              </div>
            )}

            {directoryTab === 'decisions' && selectedDecision && (
              <div id="decision-header-badge" className="p-3 border-b border-[#141414] bg-[#D1D0CC]/60 flex justify-between items-start">
                <div>
                  <span id="decision-type-badge" className="text-[7.5px] font-mono bg-[#141414] text-[#E4E3E0] px-1 py-0.2 uppercase tracking-wide font-bold">
                    {selectedDecision.type}
                  </span>
                  <h4 id="decision-name" className="text-xs font-bold uppercase mt-1 text-[#141414]">{selectedDecision.canonicalName}</h4>
                  <p id="decision-id-badge" className="text-[8px] font-mono opacity-70 mt-0.5">{selectedDecision.id}</p>
                </div>

                <div id="decision-status-badge" className="text-right flex flex-col items-end font-mono">
                  <span className="text-[7px] opacity-50 uppercase">STATUS</span>
                  <span className={`text-[9px] font-bold mt-1 uppercase ${
                    selectedDecision.status === 'APPROVED' || selectedDecision.status === 'COMPLETED' ? 'text-green-800' : 'text-amber-800'
                  }`}>{selectedDecision.status}</span>
                </div>
              </div>
            )}

            {/* Sub-Tabs Selector */}
            <div id="actor-detail-tabs" className="grid grid-cols-4 gap-[1px] bg-[#141414] p-[1px] border-b border-[#141414]">
              {directoryTab === 'actors' ? (
                (['profile', 'contract', 'history', 'jsonld'] as const).map((tab) => (
                  <button
                    id={`actor-tab-${tab}`}
                    key={tab}
                    onClick={() => { playBeep('click'); setDetailTab(tab); }}
                    className={`py-1 text-[8.5px] font-mono uppercase tracking-tighter transition-colors ${
                      detailTab === tab 
                        ? 'bg-[#E4E3E0] text-[#141414] font-bold' 
                        : 'bg-[#D1D0CC]/60 text-[#141414]/70 hover:text-[#141414]'
                    }`}
                  >
                    {tab === 'profile' ? 'Profile' : tab === 'contract' ? 'Behavior' : tab === 'history' ? 'History' : 'JSON-LD'}
                  </button>
                ))
              ) : (
                (['profile', 'jsonld'] as const).map((tab) => {
                  const isActive = detailTab === tab || (tab === 'profile' && !['profile', 'jsonld'].includes(detailTab));
                  return (
                    <button
                      id={`non-actor-tab-${tab}`}
                      key={tab}
                      onClick={() => { playBeep('click'); setDetailTab(tab); }}
                      className={`col-span-2 py-1 text-[8.5px] font-mono uppercase tracking-tighter transition-colors ${
                        isActive 
                          ? 'bg-[#E4E3E0] text-[#141414] font-bold' 
                          : 'bg-[#D1D0CC]/60 text-[#141414]/70 hover:text-[#141414]'
                      }`}
                    >
                      {tab === 'profile' ? 'Specification' : 'JSON-LD'}
                    </button>
                  );
                })
              )}
            </div>

            {/* TAB PANELS */}
            <div id="actor-detail-viewport" className="p-3 flex-1 min-h-[220px] max-h-[300px] overflow-y-auto scrollbar-thin bg-[#E4E3E0]">
              <AnimatePresence mode="wait">
                
                {directoryTab === 'actors' && (
                  <>
                    {/* 1. PROFILE */}
                    {detailTab === 'profile' && (
                      <motion.div
                        key="profile"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3 text-[9px]"
                      >
                        {/* Definition */}
                        <div>
                          <span className="font-mono text-[8px] opacity-60 uppercase block border-b border-[#141414]/10 pb-0.5 mb-1">Functional Mandate</span>
                          <p className="leading-tight text-[#141414] font-sans italic">"{selectedActor.definition}"</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                          
                          {/* Trust score gauge */}
                          <div className="border border-[#141414]/20 p-2 bg-[#D1D0CC]/30 flex flex-col justify-between space-y-1.5">
                            <div>
                              <span className="font-mono text-[7.5px] opacity-60 uppercase block">Active Trust Score</span>
                              <div className="flex items-baseline gap-1 mt-1">
                                <span className="text-lg font-mono font-bold tracking-tighter">
                                  {(selectedActor.trustProfile.trustScore * 100).toFixed(0)}%
                                </span>
                                <span className="text-[7.5px] opacity-60 font-mono">/ 100</span>
                              </div>
                            </div>

                            {/* Visual trust progress bar */}
                            <div className="w-full h-2.5 bg-[#D1D0CC] border border-[#141414]/40 relative overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-500 ${
                                  selectedActor.trustProfile.trustScore >= 0.90 
                                    ? 'bg-green-700' 
                                    : selectedActor.trustProfile.trustScore >= 0.70 
                                    ? 'bg-amber-600' 
                                    : 'bg-red-700'
                                }`}
                                style={{ width: `${selectedActor.trustProfile.trustScore * 100}%` }}
                              />
                            </div>

                            <span className="text-[6.5px] font-mono opacity-50 block uppercase">
                              Last Evaluated: {selectedActor.trustProfile.lastEvaluated.replace('T', ' ').substring(0, 19)}
                            </span>
                          </div>

                          {/* Associated Identity details */}
                          <div className="border border-[#141414]/20 p-2 bg-[#D1D0CC]/30 flex flex-col gap-1">
                            <span className="font-mono text-[7.5px] opacity-60 uppercase block">Cryptographic Binding</span>
                            {associatedIdentity ? (
                              <div className="space-y-1">
                                <div className="flex items-center gap-1">
                                  <Fingerprint className="w-3.5 h-3.5 text-[#141414]/80" />
                                  <span className="font-bold truncate text-[#141414]">{associatedIdentity.canonicalName}</span>
                                </div>
                                <div className="text-[7.5px] opacity-80 leading-normal line-clamp-2">{associatedIdentity.definition}</div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {associatedIdentity.authenticationMethods.map((m, i) => (
                                    <span key={i} className="bg-[#141414] text-[#E4E3E0] font-mono text-[6.5px] px-1 py-0.2 select-all uppercase">
                                      {m.replace('-key', '').replace('-scan', '')}
                                    </span>
                                  ))}
                                </div>
                                <div className="pt-1 flex items-center justify-between border-t border-[#141414]/10 mt-1 font-mono text-[7px]">
                                  <span>TOKEN STATUS:</span>
                                  <span className={`font-bold ${
                                    associatedIdentity.verificationStatus === 'VERIFIED' ? 'text-green-800' : 'text-red-700'
                                  }`}>{associatedIdentity.verificationStatus}</span>
                                </div>
                              </div>
                            ) : (
                              <div className="text-[8px] opacity-50 italic">No bound cryptographic identity token found.</div>
                            )}
                          </div>

                        </div>

                        {/* Associated Role details */}
                        <div className="border border-[#141414]/20 p-2 bg-[#D1D0CC]/30 font-sans space-y-1">
                          <span className="font-mono text-[7.5px] opacity-60 uppercase block mb-1">Assigned Administrative Role Permissions</span>
                          {associatedRole ? (
                            <div>
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-[10px] text-[#141414] uppercase">{associatedRole.canonicalName}</span>
                                <span className="font-mono text-[7.5px] opacity-60">Max Term: {associatedRole.maxTermMonths} Months</span>
                              </div>
                              <p className="text-[8px] opacity-80 mt-0.5 leading-tight">{associatedRole.definition}</p>
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {associatedRole.permissions?.map((p, i) => (
                                  <span key={i} className="border border-[#141414]/30 bg-indigo-100 text-indigo-950 font-mono text-[7px] px-1.5 py-0.2 uppercase">
                                    🔑 {p}
                                  </span>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="text-[8px] opacity-50 italic">Default unprivileged operational permissions apply.</div>
                          )}
                        </div>

                        {/* Active Approvals */}
                        {selectedActor.activeApprovals.length > 0 && (
                          <div className="border border-[#141414]/20 p-2 bg-[#D1D0CC]/30">
                            <span className="font-mono text-[7.5px] opacity-60 uppercase block mb-1">Active Ledger Certifications</span>
                            <div className="grid grid-cols-1 gap-1">
                              {selectedActor.activeApprovals.map((app, i) => (
                                <div key={i} className="flex justify-between items-center bg-[#E4E3E0] border border-[#141414]/10 p-1 font-mono text-[7.5px]">
                                  <span className="font-bold text-indigo-950">{app}</span>
                                  <span className="text-green-800 font-bold uppercase text-[7px]">VERIFIED SIGNATURE</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      </motion.div>
                    )}

                    {/* 2. BEHAVIOR CONTRACT */}
                    {detailTab === 'contract' && (
                      <motion.div
                        key="contract"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3 font-mono text-[8px]"
                      >
                        <div className="border border-[#141414]/20 p-2 bg-[#D1D0CC]/30">
                          <span className="opacity-60 uppercase block text-[7.5px] mb-1">Behavior Contract Identifier</span>
                          <span className="font-bold text-indigo-950 text-[9px]">{selectedActor.behaviorContract.contractId}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[8px]">
                          
                          {/* Preconditions */}
                          <div className="border border-[#141414]/20 p-2 bg-[#E4E3E0]">
                            <span className="font-bold opacity-60 uppercase text-[7px] block border-b border-[#141414]/10 pb-0.5 mb-1 text-indigo-950">
                              Preconditions
                            </span>
                            <ul className="space-y-1 list-disc pl-3">
                              {selectedActor.behaviorContract.preconditions.map((cond, i) => (
                                <li key={i} className="leading-tight text-slate-800 break-all">{cond}</li>
                              ))}
                            </ul>
                          </div>

                          {/* Invariants */}
                          <div className="border border-[#141414]/20 p-2 bg-[#E4E3E0]">
                            <span className="font-bold opacity-60 uppercase text-[7px] block border-b border-[#141414]/10 pb-0.5 mb-1 text-indigo-950">
                              Invariants
                            </span>
                            <ul className="space-y-1 list-disc pl-3">
                              {selectedActor.behaviorContract.invariants.map((inv, i) => (
                                <li key={i} className="leading-tight text-slate-800 break-all">{inv}</li>
                              ))}
                            </ul>
                          </div>

                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[8px]">
                          
                          {/* Postconditions */}
                          <div className="border border-[#141414]/20 p-2 bg-[#E4E3E0]">
                            <span className="font-bold opacity-60 uppercase text-[7px] block border-b border-[#141414]/10 pb-0.5 mb-1 text-indigo-950">
                              Postconditions
                            </span>
                            {selectedActor.behaviorContract.postconditions && selectedActor.behaviorContract.postconditions.length > 0 ? (
                              <ul className="space-y-1 list-disc pl-3">
                                {selectedActor.behaviorContract.postconditions.map((post, i) => (
                                  <li key={i} className="leading-tight text-slate-800 break-all">{post}</li>
                                ))}
                              </ul>
                            ) : (
                              <div className="italic opacity-50 pl-1">No execution postconditions specified.</div>
                            )}
                          </div>

                          {/* SLA and Metrics */}
                          <div className="border border-[#141414]/20 p-2 bg-[#E4E3E0] flex flex-col justify-between">
                            <div>
                              <span className="font-bold opacity-60 uppercase text-[7px] block border-b border-[#141414]/10 pb-0.5 mb-1 text-indigo-950">
                                Service Level Agreement (SLA)
                              </span>
                              {selectedActor.behaviorContract.sla ? (
                                <div className="space-y-1 mt-1 leading-normal">
                                  <div>MAX LATENCY: <span className="font-bold text-[#141414]">{selectedActor.behaviorContract.sla.maxResponseTimeMs}ms</span></div>
                                  <div>AVAILABILITY TARGET: <span className="font-bold text-green-800">{(selectedActor.behaviorContract.sla.availabilityTarget * 100).toFixed(2)}%</span></div>
                                </div>
                              ) : (
                                <div className="italic opacity-50 mt-1">Best-effort execution loop applies.</div>
                              )}
                            </div>
                          </div>

                        </div>
                      </motion.div>
                    )}

                    {/* 3. TIMELINE HISTORY */}
                    {detailTab === 'history' && (
                      <motion.div
                        key="history"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3 font-mono text-[8px]"
                      >
                        <span className="opacity-60 uppercase block text-[7.5px] mb-1">Constitutional Role Timeline History</span>
                        
                        <div className="relative pl-4 border-l-2 border-[#141414] ml-2 space-y-4">
                          {selectedActor.roleHistory.map((hist, i) => (
                            <div key={i} className="relative">
                              <div className="absolute -left-[19.5px] top-1 w-2.5 h-2.5 bg-[#141414] rounded-full border-2 border-[#E4E3E0]" />
                              <div className="flex justify-between items-baseline">
                                <span className="font-bold text-[9px] text-indigo-950 uppercase">{hist.roleURN}</span>
                                <span className="text-[7px] opacity-60">{hist.from} to {hist.to}</span>
                              </div>
                              <p className="text-[7.5px] opacity-70 mt-0.5 leading-normal">
                                Administrative compliance verified. Signed keys loaded into active session memory.
                              </p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {/* 4. RAW JSON-LD */}
                    {detailTab === 'jsonld' && (
                      <motion.div
                        key="jsonld"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-2"
                      >
                        <span className="font-mono text-[7.5px] opacity-60 uppercase block">Raw Semantic JSON-LD Entity Graph</span>
                        <pre className="text-[6px] leading-tight font-mono text-[#E4E3E0] bg-[#141414] p-2 border border-[#141414] overflow-x-auto max-h-[180px] select-all whitespace-pre scrollbar-thin">
                          {JSON.stringify({
                            "@context": {
                              "cim": "https://ultrathink.ecos/canonical/v2/",
                              "sem": "https://ultrathink.ecos/semantics/v1/",
                              "agent": "https://ultrathink.ecos/agents/",
                              "identity": "https://ultrathink.ecos/identity/",
                              "trust": "https://ultrathink.ecos/trust/",
                              "contract": "https://ultrathink.ecos/behavior-contract/",
                              "role": "https://ultrathink.ecos/roles/",
                              "gov": "https://ultrathink.ecos/governance/"
                            },
                            "@graph": [
                              selectedActor,
                              associatedIdentity,
                              associatedRole
                            ].filter(Boolean)
                          }, null, 2)}
                        </pre>
                      </motion.div>
                    )}
                  </>
                )}

                {directoryTab === 'roles' && selectedRole && (
                  <>
                    {/* 1. PROFILE/SPECIFICATION */}
                    {(detailTab === 'profile' || !['profile', 'jsonld'].includes(detailTab)) && (
                      <motion.div
                        key="role-profile"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3 text-[9px]"
                      >
                        <div>
                          <span className="font-mono text-[8px] opacity-60 uppercase block border-b border-[#141414]/10 pb-0.5 mb-1">Functional Mandate</span>
                          <p className="leading-tight text-[#141414] font-sans italic">"{selectedRole.definition}"</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                          <div className="border border-[#141414]/20 p-2 bg-[#D1D0CC]/30 flex flex-col justify-between">
                            <span className="font-mono text-[7.5px] opacity-60 uppercase block">Governance Context</span>
                            <div className="mt-1 leading-normal">
                              <div>KERNEL: <span className="font-mono text-indigo-950 break-all text-[7.5px]">{selectedRole.governanceKernelURN || "cim:constitution.ecos-v1"}</span></div>
                              <div className="mt-1 flex items-center justify-between">
                                <span>STATUS:</span>
                                <span className={`font-mono font-bold ${
                                  selectedRole.complianceStatus === 'COMPLIANT' ? 'text-green-800' : 'text-amber-800'
                                }`}>{selectedRole.complianceStatus || "COMPLIANT"}</span>
                              </div>
                            </div>
                          </div>

                          <div className="border border-[#141414]/20 p-2 bg-[#D1D0CC]/30 flex flex-col justify-between font-mono text-[7.5px]">
                            <span className="opacity-60 uppercase block">Structural Properties</span>
                            <div className="mt-1 leading-normal space-y-1">
                              <div>INHERITANCE: <span className="font-bold">{selectedRole.inheritancePolicy || "STRICT"}</span></div>
                              <div>MAX TERM: <span className="font-bold">{selectedRole.maxTermMonths || 36} MONTHS</span></div>
                            </div>
                          </div>
                        </div>

                        {selectedRole.assignedCapabilities && selectedRole.assignedCapabilities.length > 0 ? (
                          <div className="border border-[#141414]/20 p-2 bg-[#D1D0CC]/30 font-sans space-y-1.5">
                            <span className="font-mono text-[7.5px] opacity-60 uppercase block border-b border-[#141414]/10 pb-0.5">Assigned Sovereign Capabilities</span>
                            <div className="space-y-2">
                              {selectedRole.assignedCapabilities.map((cap, i) => (
                                <div key={i} className="flex flex-col border border-[#141414]/10 p-1.5 bg-[#E4E3E0]">
                                  <div className="flex justify-between items-center">
                                    <span className="font-bold text-[8.5px] text-indigo-950 uppercase flex items-center gap-1">
                                      🛡️ {cap.name}
                                    </span>
                                    <span className="font-mono text-[6.5px] opacity-50">{cap.capabilityURN}</span>
                                  </div>
                                  <p className="text-[8px] opacity-80 mt-0.5 leading-tight">{cap.description}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="border border-[#141414]/20 p-2 bg-[#D1D0CC]/30 font-sans">
                            <span className="font-mono text-[7.5px] opacity-60 uppercase block mb-1">Assigned Capabilities</span>
                            <div className="text-[8px] opacity-50 italic">No explicit capabilities assigned to this role.</div>
                          </div>
                        )}

                        {selectedRole.permissions && selectedRole.permissions.length > 0 && (
                          <div className="border border-[#141414]/20 p-2 bg-[#D1D0CC]/30">
                            <span className="font-mono text-[7.5px] opacity-60 uppercase block mb-1">Access Control Permissions (RBAC)</span>
                            <div className="flex flex-wrap gap-1">
                              {selectedRole.permissions.map((p, i) => (
                                <span key={i} className="border border-[#141414]/30 bg-indigo-100 text-indigo-950 font-mono text-[7px] px-1.5 py-0.2 uppercase">
                                  🔑 {p}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* 2. RAW JSON-LD */}
                    {detailTab === 'jsonld' && (
                      <motion.div
                        key="role-jsonld"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-2"
                      >
                        <span className="font-mono text-[7.5px] opacity-60 uppercase block">Raw Semantic JSON-LD Role Graph</span>
                        <pre className="text-[6px] leading-tight font-mono text-[#E4E3E0] bg-[#141414] p-2 border border-[#141414] overflow-x-auto max-h-[180px] select-all whitespace-pre scrollbar-thin">
                          {JSON.stringify({
                            "@context": {
                              "cim": "https://ultrathink.ecos/canonical/v2/",
                              "sem": "https://ultrathink.ecos/semantics/v1/",
                              "role": "https://ultrathink.ecos/roles/",
                              "gov": "https://ultrathink.ecos/governance/"
                            },
                            "@graph": [selectedRole]
                          }, null, 2)}
                        </pre>
                      </motion.div>
                    )}
                  </>
                )}

                {directoryTab === 'capabilities' && selectedCapability && (
                  <>
                    {/* 1. PROFILE/SPECIFICATION */}
                    {(detailTab === 'profile' || !['profile', 'jsonld'].includes(detailTab)) && (
                      <motion.div
                        key="cap-profile"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3 text-[9px]"
                      >
                        <div>
                          <span className="font-mono text-[8px] opacity-60 uppercase block border-b border-[#141414]/10 pb-0.5 mb-1">Functional Definition</span>
                          <p className="leading-tight text-[#141414] font-sans italic">"{selectedCapability.definition}"</p>
                        </div>

                        <div className="border border-[#141414]/20 p-2 bg-[#D1D0CC]/30 font-sans space-y-1.5">
                          <span className="font-mono text-[7.5px] opacity-60 uppercase block border-b border-[#141414]/10 pb-0.5">Assigned Roles Mapping</span>
                          <div className="space-y-1">
                            {roles.filter(r => r.assignedCapabilities?.some(c => c.capabilityURN === selectedCapability.id)).length > 0 ? (
                              roles.filter(r => r.assignedCapabilities?.some(c => c.capabilityURN === selectedCapability.id)).map((role, i) => (
                                <div key={i} className="flex justify-between items-center p-1.5 bg-[#E4E3E0] border border-[#141414]/10">
                                  <span className="font-bold text-[8.5px] uppercase text-[#141414]">{role.canonicalName}</span>
                                  <span className="font-mono text-[7px] bg-[#141414] text-[#E4E3E0] px-1 uppercase">{role.id}</span>
                                </div>
                              ))
                            ) : (
                              <div className="text-[8px] opacity-50 italic">No active roles are assigned this capability.</div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* 2. RAW JSON-LD */}
                    {detailTab === 'jsonld' && (
                      <motion.div
                        key="cap-jsonld"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-2"
                      >
                        <span className="font-mono text-[7.5px] opacity-60 uppercase block">Raw Semantic JSON-LD Capability Graph</span>
                        <pre className="text-[6px] leading-tight font-mono text-[#E4E3E0] bg-[#141414] p-2 border border-[#141414] overflow-x-auto max-h-[180px] select-all whitespace-pre scrollbar-thin">
                          {JSON.stringify({
                            "@context": {
                              "cim": "https://ultrathink.ecos/canonical/v2/",
                              "sem": "https://ultrathink.ecos/semantics/v1/",
                              "capability": "https://ultrathink.ecos/capability/"
                            },
                            "@graph": [selectedCapability]
                          }, null, 2)}
                        </pre>
                      </motion.div>
                    )}
                  </>
                )}

                {directoryTab === 'wallets' && selectedWallet && (
                  <>
                    {/* 1. PROFILE/SPECIFICATION */}
                    {(detailTab === 'profile' || !['profile', 'jsonld'].includes(detailTab)) && (
                      <motion.div
                        key="wallet-profile"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3 text-[9px]"
                      >
                        <div>
                          <span className="font-mono text-[8px] opacity-60 uppercase block border-b border-[#141414]/10 pb-0.5 mb-1">Functional Definition</span>
                          <p className="leading-tight text-[#141414] font-sans italic">"{selectedWallet.definition}"</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
                          <div className="border border-[#141414]/20 p-2 bg-[#D1D0CC]/30 flex flex-col justify-between">
                            <span className="font-mono text-[7.5px] opacity-60 uppercase block">Liquidity & Provider</span>
                            <div className="mt-1 leading-normal space-y-0.5 font-mono text-[8px]">
                              <div>PROVIDER: <span className="font-bold text-indigo-950">{selectedWallet.provider}</span></div>
                              <div>ACCOUNT: <span className="font-bold break-all">{selectedWallet.accountIdentifier}</span></div>
                              <div>CURRENCY: <span className="font-bold">{selectedWallet.currency}</span></div>
                              {selectedWallet.balance !== undefined && (
                                <div>BALANCE: <span className="font-bold text-green-800">{selectedWallet.balance.toLocaleString()} {selectedWallet.currency}</span></div>
                              )}
                            </div>
                          </div>

                          <div className="border border-[#141414]/20 p-2 bg-[#D1D0CC]/30 flex flex-col justify-between">
                            <span className="font-mono text-[7.5px] opacity-60 uppercase block">Governance Mode</span>
                            <div className="mt-1 leading-normal space-y-0.5 font-mono text-[8px]">
                              <div>AUTH LEVEL: <span className="font-bold text-green-800">{selectedWallet.accessControl.minAuthLevel}</span></div>
                              <div>COMPLIANCE: <span className="font-bold text-green-800">{selectedWallet.complianceStatus}</span></div>
                            </div>
                          </div>
                        </div>

                        {selectedWallet.allowedCategories && selectedWallet.allowedCategories.length > 0 && (
                          <div className="border border-[#141414]/20 p-2 bg-[#D1D0CC]/30">
                            <span className="font-mono text-[7.5px] opacity-60 uppercase block mb-1">Allowed Spending Categories</span>
                            <div className="flex flex-wrap gap-1 font-mono text-[7.5px]">
                              {selectedWallet.allowedCategories.map((cat, idx) => (
                                <span key={idx} className="border border-[#141414]/20 bg-indigo-100 text-indigo-950 font-mono text-[7px] px-1.5 py-0.5 uppercase">
                                  📂 {cat}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {selectedWallet.accessControl.allowedSigners && selectedWallet.accessControl.allowedSigners.length > 0 && (
                          <div className="border border-[#141414]/20 p-2 bg-[#D1D0CC]/30">
                            <span className="font-mono text-[7.5px] opacity-60 uppercase block mb-1">Authorized Multisig Signers</span>
                            <div className="flex flex-col gap-1 font-mono text-[8px]">
                              {selectedWallet.accessControl.allowedSigners.map((signer, idx) => (
                                <div key={idx} className="bg-[#E4E3E0] p-1 border border-[#141414]/10 text-indigo-950 truncate">
                                  ✒️ {signer}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* 2. RAW JSON-LD */}
                    {detailTab === 'jsonld' && (
                      <motion.div
                        key="wallet-jsonld"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-2"
                      >
                        <span className="font-mono text-[7.5px] opacity-60 uppercase block">Raw Semantic JSON-LD Wallet Graph</span>
                        <pre className="text-[6px] leading-tight font-mono text-[#E4E3E0] bg-[#141414] p-2 border border-[#141414] overflow-x-auto max-h-[180px] select-all whitespace-pre scrollbar-thin">
                          {JSON.stringify({
                            "@context": {
                              "cim": "https://ultrathink.ecos/canonical/v2/",
                              "wallet": "https://ultrathink.ecos/wallet/",
                              "gov": "https://ultrathink.ecos/governance/"
                            },
                            "@graph": [selectedWallet]
                          }, null, 2)}
                        </pre>
                      </motion.div>
                    )}
                  </>
                )}

                {directoryTab === 'accessPolicies' && selectedAccessPolicy && (
                  <>
                    {/* 1. PROFILE/SPECIFICATION */}
                    {(detailTab === 'profile' || !['profile', 'jsonld'].includes(detailTab)) && (
                      <motion.div
                        key="ap-profile"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3 text-[9px]"
                      >
                        <div>
                          <span className="font-mono text-[8px] opacity-60 uppercase block border-b border-[#141414]/10 pb-0.5 mb-1">Functional Definition</span>
                          <p className="leading-tight text-[#141414] font-sans italic">"{selectedAccessPolicy.definition}"</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1 font-mono text-[8px]">
                          <div className="border border-[#141414]/20 p-2 bg-[#D1D0CC]/30 space-y-0.5">
                            <span className="text-[7.5px] opacity-60 uppercase block">Target Resources</span>
                            <div>ROLE: <span className="font-bold text-indigo-950 break-all">{selectedAccessPolicy.roleURN}</span></div>
                            <div className="mt-1">RESOURCE: <span className="font-bold break-all text-red-950">{selectedAccessPolicy.resourceURN}</span></div>
                          </div>

                          <div className="border border-[#141414]/20 p-2 bg-[#D1D0CC]/30 space-y-0.5">
                            <span className="text-[7.5px] opacity-60 uppercase block">Sovereign Action</span>
                            <div>ACTION: <span className="font-bold text-indigo-950">{selectedAccessPolicy.action}</span></div>
                            <div className="mt-1">COMPLIANCE: <span className="font-bold text-green-800">{selectedAccessPolicy.complianceStatus}</span></div>
                          </div>
                        </div>

                        {selectedAccessPolicy.conditions && (
                          <div className="border border-[#141414]/20 p-2 bg-[#D1D0CC]/30 space-y-1">
                            <span className="font-mono text-[7.5px] opacity-60 uppercase block border-b border-[#141414]/10 pb-0.5">Strict ABAC Attribute-Based Conditions</span>
                            <div className="bg-[#141414] text-amber-400 p-2 font-mono text-[8px] border border-[#141414] whitespace-pre-wrap leading-relaxed">
                              {selectedAccessPolicy.conditions.contextRequirement}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* 2. RAW JSON-LD */}
                    {detailTab === 'jsonld' && (
                      <motion.div
                        key="ap-jsonld"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-2"
                      >
                        <span className="font-mono text-[7.5px] opacity-60 uppercase block">Raw Semantic JSON-LD Access Policy Graph</span>
                        <pre className="text-[6px] leading-tight font-mono text-[#E4E3E0] bg-[#141414] p-2 border border-[#141414] overflow-x-auto max-h-[180px] select-all whitespace-pre scrollbar-thin">
                          {JSON.stringify({
                            "@context": {
                              "cim": "https://ultrathink.ecos/canonical/v2/",
                              "access": "https://ultrathink.ecos/access/",
                              "role": "https://ultrathink.ecos/roles/",
                              "gov": "https://ultrathink.ecos/governance/"
                            },
                            "@graph": [selectedAccessPolicy]
                          }, null, 2)}
                        </pre>
                      </motion.div>
                    )}
                  </>
                )}

                {directoryTab === 'policies' && selectedPolicy && (
                  <>
                    {/* 1. PROFILE/SPECIFICATION */}
                    {(detailTab === 'profile' || !['profile', 'jsonld'].includes(detailTab)) && (
                      <motion.div
                        key="policy-profile"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3 text-[9px]"
                      >
                        <div>
                          <span className="font-mono text-[8px] opacity-60 uppercase block border-b border-[#141414]/10 pb-0.5 mb-1">Functional Definition</span>
                          <p className="leading-tight text-[#141414] font-sans italic">"{selectedPolicy.definition}"</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1 font-mono text-[8px]">
                          <div className="border border-[#141414]/20 p-2 bg-[#D1D0CC]/30 space-y-0.5">
                            <span className="text-[7.5px] opacity-60 uppercase block">Sovereign Domain</span>
                            <div>DOMAIN: <span className="font-bold text-indigo-950 break-all">{selectedPolicy.domainURN}</span></div>
                          </div>

                          <div className="border border-[#141414]/20 p-2 bg-[#D1D0CC]/30 space-y-0.5">
                            <span className="text-[7.5px] opacity-60 uppercase block">Authority Source</span>
                            <div>AUTHORITY: <span className="font-bold text-indigo-950 break-all">{selectedPolicy.authority}</span></div>
                          </div>
                        </div>

                        {selectedPolicy.rulesEnforced && selectedPolicy.rulesEnforced.length > 0 && (
                          <div className="border border-[#141414]/20 p-2 bg-[#D1D0CC]/30">
                            <span className="font-mono text-[7.5px] opacity-60 uppercase block mb-1">Rules Enforced Under Policy</span>
                            <div className="flex flex-col gap-1 font-mono text-[8px]">
                              {selectedPolicy.rulesEnforced.map((ruleUrn, idx) => (
                                <div key={idx} className="bg-[#E4E3E0] p-1 border border-[#141414]/10 text-indigo-950 break-all">
                                  🛡️ {ruleUrn}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* 2. RAW JSON-LD */}
                    {detailTab === 'jsonld' && (
                      <motion.div
                        key="policy-jsonld"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-2"
                      >
                        <span className="font-mono text-[7.5px] opacity-60 uppercase block">Raw Semantic JSON-LD Policy Graph</span>
                        <pre className="text-[6px] leading-tight font-mono text-[#E4E3E0] bg-[#141414] p-2 border border-[#141414] overflow-x-auto max-h-[180px] select-all whitespace-pre scrollbar-thin">
                          {JSON.stringify({
                            "@context": {
                              "cim": "https://ultrathink.ecos/canonical/v2/",
                              "sem": "https://ultrathink.ecos/semantics/v1/",
                              "gov": "https://ultrathink.ecos/governance/"
                            },
                            "@graph": [selectedPolicy]
                          }, null, 2)}
                        </pre>
                      </motion.div>
                    )}
                  </>
                )}

                {directoryTab === 'rules' && selectedRule && (
                  <>
                    {/* 1. PROFILE/SPECIFICATION */}
                    {(detailTab === 'profile' || !['profile', 'jsonld'].includes(detailTab)) && (
                      <motion.div
                        key="rule-profile"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3 text-[9px]"
                      >
                        <div>
                          <span className="font-mono text-[8px] opacity-60 uppercase block border-b border-[#141414]/10 pb-0.5 mb-1">Functional Definition</span>
                          <p className="leading-tight text-[#141414] font-sans italic">"{selectedRule.definition}"</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1 font-mono text-[8px]">
                          <div className="border border-[#141414]/20 p-2 bg-[#D1D0CC]/30 space-y-0.5">
                            <span className="text-[7.5px] opacity-60 uppercase block">Operational Target</span>
                            <div>TARGET PARAMETER: <span className="font-bold text-indigo-950">{selectedRule.targetParameter}</span></div>
                          </div>

                          <div className="border border-[#141414]/20 p-2 bg-[#D1D0CC]/30 space-y-0.5">
                            <span className="text-[7.5px] opacity-60 uppercase block">Strict Violation Action</span>
                            <div>VIOLATION SEVERITY: <span className="font-bold text-red-800">{selectedRule.violationSeverity}</span></div>
                          </div>
                        </div>

                        {selectedRule.constraint && (
                          <div className="border border-[#141414]/20 p-2 bg-[#D1D0CC]/30 space-y-1">
                            <span className="font-mono text-[7.5px] opacity-60 uppercase block border-b border-[#141414]/10 pb-0.5">Enforced Structural Constraint</span>
                            <div className="bg-[#141414] text-amber-400 p-2 font-mono text-[8px] border border-[#141414] whitespace-pre-wrap leading-relaxed">
                              {selectedRule.constraint}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* 2. RAW JSON-LD */}
                    {detailTab === 'jsonld' && (
                      <motion.div
                        key="rule-jsonld"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-2"
                      >
                        <span className="font-mono text-[7.5px] opacity-60 uppercase block">Raw Semantic JSON-LD Rule Graph</span>
                        <pre className="text-[6px] leading-tight font-mono text-[#E4E3E0] bg-[#141414] p-2 border border-[#141414] overflow-x-auto max-h-[180px] select-all whitespace-pre scrollbar-thin">
                          {JSON.stringify({
                            "@context": {
                              "cim": "https://ultrathink.ecos/canonical/v2/",
                              "sem": "https://ultrathink.ecos/semantics/v1/"
                            },
                            "@graph": [selectedRule]
                          }, null, 2)}
                        </pre>
                      </motion.div>
                    )}
                  </>
                )}

                {directoryTab === 'decisions' && selectedDecision && (
                  <>
                    {/* 1. PROFILE/SPECIFICATION */}
                    {(detailTab === 'profile' || !['profile', 'jsonld'].includes(detailTab)) && (
                      <motion.div
                        key="decision-profile"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3 text-[9px]"
                      >
                        <div>
                          <span className="font-mono text-[8px] opacity-60 uppercase block border-b border-[#141414]/10 pb-0.5 mb-1">Functional Definition</span>
                          <p className="leading-tight text-[#141414] font-sans italic">"{selectedDecision.definition}"</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1 font-mono text-[8px]">
                          <div className="border border-[#141414]/20 p-2 bg-[#D1D0CC]/30 space-y-0.5">
                            <span className="text-[7.5px] opacity-60 uppercase block">Decision Core</span>
                            <div>STATUS: <span className="font-bold text-green-800">{selectedDecision.status}</span></div>
                            {selectedDecision.amount !== undefined && (
                              <div>AMOUNT: <span className="font-bold text-indigo-950">{selectedDecision.amount.toLocaleString()} EGP</span></div>
                            )}
                          </div>

                          <div className="border border-[#141414]/20 p-2 bg-[#D1D0CC]/30 space-y-0.5">
                            <span className="text-[7.5px] opacity-60 uppercase block">Governance Context</span>
                            {selectedDecision.category && (
                              <div>CATEGORY: <span className="font-bold text-indigo-950">{selectedDecision.category}</span></div>
                            )}
                            {selectedDecision.linkedWallet && (
                              <div className="mt-1 break-all">LINKED WALLET: <span className="font-mono text-[7.5px] font-bold text-red-950">{selectedDecision.linkedWallet}</span></div>
                            )}
                          </div>
                        </div>

                        {selectedDecision.governanceKernelURN && (
                          <div className="border border-[#141414]/20 p-2 bg-[#D1D0CC]/30 space-y-1">
                            <span className="font-mono text-[7.5px] opacity-60 uppercase block border-b border-[#141414]/10 pb-0.5">Governance Kernel URN</span>
                            <div className="font-mono text-[8px] text-indigo-950 break-all leading-normal">
                              {selectedDecision.governanceKernelURN}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* 2. RAW JSON-LD */}
                    {detailTab === 'jsonld' && (
                      <motion.div
                        key="decision-jsonld"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-2"
                      >
                        <span className="font-mono text-[7.5px] opacity-60 uppercase block">Raw Semantic JSON-LD Decision Graph</span>
                        <pre className="text-[6px] leading-tight font-mono text-[#E4E3E0] bg-[#141414] p-2 border border-[#141414] overflow-x-auto max-h-[180px] select-all whitespace-pre scrollbar-thin">
                          {JSON.stringify({
                            "@context": {
                              "cim": "https://ultrathink.ecos/canonical/v2/",
                              "sem": "https://ultrathink.ecos/semantics/v1/",
                              "decision": "https://ultrathink.ecos/decision/",
                              "wallet": "https://ultrathink.ecos/wallet/"
                            },
                            "@graph": [selectedDecision]
                          }, null, 2)}
                        </pre>
                      </motion.div>
                    )}
                  </>
                )}

              </AnimatePresence>
            </div>

            {/* Quick footer action: verifying keys */}
            <div id="actor-footer-verify" className="p-2 border-t border-[#141414] bg-[#D1D0CC]/30 flex justify-between items-center font-mono text-[8px]">
              <span className="flex items-center gap-1 opacity-70">
                <Lock className="w-3 h-3 text-[#141414]" />
                BLAKE3 BOUND CRYPTOGRAPHIC SIGNATURE
              </span>
              <span className="text-[8.5px] font-bold text-green-800 uppercase">
                ACTIVE STATE: VERIFIED
              </span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
