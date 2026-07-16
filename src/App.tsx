import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import IdentityRegistry from './components/IdentityRegistry';
import OrganizationRegistry from './components/OrganizationRegistry';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  Activity, 
  Terminal, 
  Database, 
  Hash, 
  History, 
  Lock, 
  Unlock, 
  Play, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  BookOpen, 
  Binary, 
  Sliders, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Cpu,
  Server,
  Fingerprint,
  Award,
  Compass,
  TrendingUp
} from 'lucide-react';

import { 
  INITIAL_STEPS, 
  INITIAL_MONITORING, 
  ENFORCEMENT_CAPABILITIES, 
  INITIAL_AUDIT_TRAIL, 
  PROTECTED_OPERATIONS, 
  INITIAL_SNAPSHOT,
  CONSTITUTIONAL_ARTICLES
} from './initialData';

import { 
  MonitoringTarget, 
  AuditEntry, 
  SystemSnapshot 
} from './types';

import { generateBlake3Hash, verifyAuditChain } from './cryptoUtils';
import { 
  ECOS_CONSTITUTION,
  ECOS_POLICIES,
  ECOS_RULES,
  ECOS_CONSTRAINTS,
  ECOS_EVIDENCE,
  ECOS_STATE_CHART,
  ECOS_BEHAVIOR_CONTRACTS,
  BASE_BEHAVIOR_CONTRACT,
  ECOS_AUDIT_SYSTEM,
  ECOS_COMPLIANCE_VIOLATIONS,
  ECOS_VIOLATION_EVIDENCE,
  ComplianceViolation,
  ViolationEvidence,
  ECOS_STRATEGIC_VISION,
  ECOS_STRATEGIC_MISSION,
  ECOS_STRATEGIC_GOALS,
  ECOS_RISK_PROFILES,
  ECOS_STRATEGIC_KPIS,
  RAW_STRATEGY_JSON_LD,
  ECOS_ZERO_TRUST_DECISION_GRAPH,
  ECOS_MARKET_EXPANSION_DECISION_GRAPH,
  ECOS_RISK_AUDIT_DECISION_GRAPH,
  ECOS_DECISION_LIFECYCLE_STATE_MACHINE
} from './semanticData';

const ECOS_CRITICAL_FAILURE_EVENT = {
  "@context": {
    "cim": "https://ultrathink.ecos/canonical/v2/",
    "sem": "https://ultrathink.ecos/semantics/v1/",
    "lifecycle": "https://ultrathink.ecos/lifecycle/",
    "strategy": "https://ultrathink.ecos/strategy/",
    "audit": "https://ultrathink.ecos/audit/"
  },
  "@graph": [
    {
      "@id": "event:kpi-critical-failure-001",
      "@type": "sem:event.kpi_critical_failure",
      "eventId": "uuid:d4e5f6a7-b8c9-0123-def4-567890123456",
      "timestamp": "2026-07-16T18:00:00.000Z",
      "lineage": {
        "correlationId": "corrid:strategy-monitor-24x7",
        "causationId": "cause:compliance-score-below-threshold"
      },
      "payload": {
        "failingGoalURN": "strategy:goal.governance-excellence",
        "failingKPI": "strategy:kpi.compliance-score",
        "currentValue": 42.5,
        "threshold": 50.0,
        "trend": "DECREASING",
        "evaluationTimestamp": "2026-07-16T17:59:58.000Z"
      }
    }
  ]
};

const ECOS_STRATEGIC_REALIGNMENT_EVENT = {
  "@context": {
    "cim": "https://ultrathink.ecos/canonical/v2/",
    "sem": "https://ultrathink.ecos/semantics/v1/",
    "lifecycle": "https://ultrathink.ecos/lifecycle/",
    "strategy": "https://ultrathink.ecos/strategy/",
    "audit": "https://ultrathink.ecos/audit/"
  },
  "@graph": [
    {
      "@id": "event:strategic-realignment-001",
      "@type": "sem:event.strategic_realignment",
      "eventId": "uuid:e5f6a7b8-c9d0-1234-ef56-789012345678",
      "timestamp": "2026-07-17T09:00:00.000Z",
      "lineage": {
        "correlationId": "corrid:governance-review-task-992",
        "causationId": "cause:revision-plan-approved"
      },
      "payload": {
        "goalURN": "strategy:goal.governance-excellence",
        "auditResult": "PASS",
        "realignmentDetails": "Enhanced monitoring rules deployed; contradiction resolution timeout reduced to 2 cycles; additional governance training data injected."
      }
    }
  ]
};

export default function App() {
  // Application State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'rules' | 'sandbox' | 'constitution' | 'strategy' | 'identities' | 'organization'>('dashboard');
  const [constitutionSubTab, setConstitutionSubTab] = useState<'articles' | 'framework' | 'lifecycle' | 'evidence'>('articles');
  const [ruleDetailTab, setRuleDetailTab] = useState<'rego' | 'contract'>('rego');
  const [monitoring, setMonitoring] = useState<MonitoringTarget[]>(INITIAL_MONITORING);
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>(INITIAL_AUDIT_TRAIL);
  const [snapshot, setSnapshot] = useState<SystemSnapshot>(INITIAL_SNAPSHOT);
  const [selectedRule, setSelectedRule] = useState<MonitoringTarget | null>(INITIAL_MONITORING[0]);
  const [selectedArticle, setSelectedArticle] = useState<number>(1);
  const [audioFeedback, setAudioFeedback] = useState<boolean>(true);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verifySuccess, setVerifySuccess] = useState<boolean | null>(null);
  const [expandedViolationId, setExpandedViolationId] = useState<string | null>(null);
  const [showViolationJsonId, setShowViolationJsonId] = useState<string | null>(null);
  
  // Sovereign ABAC Simulator State
  const [abacActor, setAbacActor] = useState<string>('role:governance-council-chair');
  const [abacLocation, setAbacLocation] = useState<string>('HQ');
  const [abacDeviceTrusted, setAbacDeviceTrusted] = useState<boolean>(true);
  const [abacTrustScore, setAbacTrustScore] = useState<number>(0.99);
  const [abacTimeBound, setAbacTimeBound] = useState<string>('2026-07-16T13:12:39Z');
  const [abacEvaluationResult, setAbacEvaluationResult] = useState<{
    allow: boolean;
    location_ok: boolean;
    trust_ok: boolean;
    time_ok: boolean;
    role_ok: boolean;
    msg: string;
  } | null>(null);
  
  const [strategicKPIs, setStrategicKPIs] = useState(ECOS_STRATEGIC_KPIS);
  const [showStrategyJson, setShowStrategyJson] = useState(false);
  const [strategySchemaView, setStrategySchemaView] = useState<'alignment' | 'lifecycle' | 'events' | 'decisions' | 'statecharts'>('alignment');
  const [injectedEventSelected, setInjectedEventSelected] = useState<'kpi-failure' | 'realignment'>('kpi-failure');
  const [selectedDecisionLedgerTab, setSelectedDecisionLedgerTab] = useState<'proposal' | 'decision' | 'snapshot' | 'statechart'>('decision');
  const [activeDecisionId, setActiveDecisionId] = useState<string>('decision:zero-trust-deployment-2026-07-16');
  
  const handleSwitchDecision = (id: string) => {
    playBeep('click');
    setActiveDecisionId(id);
    setSignaturesVerified(null);
    if (id === 'decision:zero-trust-deployment-2026-07-16') {
      setDecisionCurrentState('EXECUTING');
      setDecisionStateHistory([
        {
          from: "PROPOSAL_SUBMITTED",
          to: "PENDING_APPROVAL",
          timestamp: "2026-07-16T20:05:00Z",
          triggerEvent: "sem:event.governance_check_passed",
          guardResult: "PASS (all policies compliant)"
        },
        {
          from: "PENDING_APPROVAL",
          to: "APPROVED",
          timestamp: "2026-07-16T20:20:00Z",
          triggerEvent: "sem:event.approval_granted",
          guardResult: "PASS (quorum: 3/3)"
        },
        {
          from: "APPROVED",
          to: "EXECUTING",
          timestamp: "2026-07-16T20:25:00Z",
          triggerEvent: "sem:event.execution_started",
          guardResult: "PASS (resources available)"
        }
      ]);
    } else if (id === 'decision:dec-001') {
      setDecisionCurrentState('APPROVED');
      setDecisionStateHistory([
        {
          from: "PROPOSAL_SUBMITTED",
          to: "PENDING_APPROVAL",
          timestamp: "2026-07-17T08:15:00Z",
          triggerEvent: "sem:event.governance_check_passed",
          guardResult: "PASS (complies with AI Model Governance Policy)"
        },
        {
          from: "PENDING_APPROVAL",
          to: "APPROVED",
          timestamp: "2026-07-17T09:20:00Z",
          triggerEvent: "sem:event.approval_granted",
          guardResult: "PASS (quorum: 2/2 signed, financial/strategic signoff)"
        }
      ]);
    } else {
      // decision:dec.001 (Risk Mitigated & Policy Audited)
      setDecisionCurrentState('APPROVED');
      setDecisionStateHistory([
        {
          from: "PROPOSAL_SUBMITTED",
          to: "PENDING_APPROVAL",
          timestamp: "2026-07-17T08:00:00Z",
          triggerEvent: "sem:event.proposal_indexed",
          guardResult: "PASS (JSON-LD syntactic valid)"
        },
        {
          from: "PENDING_APPROVAL",
          to: "APPROVED",
          timestamp: "2026-07-17T09:15:00Z",
          triggerEvent: "sem:event.approval_granted",
          guardResult: "PASS (signed by Governance Council Chair, Risk Mitigation rule validated)"
        }
      ]);
    }
  };

  const [signaturesVerified, setSignaturesVerified] = useState<boolean | null>(null);
  const [decisionCurrentState, setDecisionCurrentState] = useState<'PROPOSAL_SUBMITTED' | 'PENDING_APPROVAL' | 'APPROVED' | 'EXECUTING' | 'COMPLETED' | 'ROLLED_BACK' | 'REJECTED'>('EXECUTING');
  const [decisionStateHistory, setDecisionStateHistory] = useState<Array<{
    from: string;
    to: string;
    timestamp: string;
    triggerEvent: string;
    guardResult: string;
  }>>([
    {
      from: "PROPOSAL_SUBMITTED",
      to: "PENDING_APPROVAL",
      timestamp: "2026-07-16T20:05:00Z",
      triggerEvent: "sem:event.governance_check_passed",
      guardResult: "PASS (all policies compliant)"
    },
    {
      from: "PENDING_APPROVAL",
      to: "APPROVED",
      timestamp: "2026-07-16T20:20:00Z",
      triggerEvent: "sem:event.approval_granted",
      guardResult: "PASS (quorum: 3/3)"
    },
    {
      from: "APPROVED",
      to: "EXECUTING",
      timestamp: "2026-07-16T20:25:00Z",
      triggerEvent: "sem:event.execution_started",
      guardResult: "PASS (resources available)"
    }
  ]);
  const [selectedGoalId, setSelectedGoalId] = useState<string>("strategy:goal.governance-excellence");
  const [selectedGoalDetailTab, setSelectedGoalDetailTab] = useState<'alignment' | 'lifecycle'>('alignment');

  const [strategicGoalsLifecycle, setStrategicGoalsLifecycle] = useState({
    "@context": {
      "cim": "https://ultrathink.ecos/canonical/v2/",
      "sem": "https://ultrathink.ecos/semantics/v1/",
      "lifecycle": "https://ultrathink.ecos/lifecycle/",
      "strategy": "https://ultrathink.ecos/strategy/",
      "gov": "https://ultrathink.ecos/governance/"
    },
    "@graph": [
      {
        "@id": "lifecycle:strategic-goal-state-machine",
        "@type": "CIM_StateChart",
        "canonicalName": "Strategic Goal Lifecycle State Machine",
        "definition": "Authoritative state transition engine for CIM_StrategicGoal entities, inheriting lifecycle constraints from G0 governance policies.",
        "appliesTo": "CIM_StrategicGoal",
        "initialState": "PROPOSED",
        "states": {
          "PROPOSED": {
            "allowedTransitions": [
              {
                "triggerEventURN": "sem:event.board_approval",
                "targetState": "ACTIVE",
                "guardCondition": "compliance.check(G0.Policy.Financial)",
                "guardImplementation": "fn:verifyComplianceWithPolicy(input.goal, 'cim:policy.financial-integrity')"
              }
            ]
          },
          "ACTIVE": {
            "allowedTransitions": [
              {
                "triggerEventURN": "sem:event.kpi_critical_failure",
                "targetState": "REVISION_REQUIRED",
                "guardCondition": "true"
              },
              {
                "triggerEventURN": "sem:event.goal_achieved",
                "targetState": "ARCHIVED",
                "guardCondition": "isKPIVerifiedByAudit",
                "guardImplementation": "fn:verifyAllKPIsAchievedAndAudited(input.goal.progressIndicators)"
              }
            ]
          },
          "REVISION_REQUIRED": {
            "allowedTransitions": [
              {
                "triggerEventURN": "sem:event.strategic_realignment",
                "targetState": "ACTIVE",
                "guardCondition": "G0.Compliance.AuditPassed",
                "guardImplementation": "fn:performFullGovernanceAudit(input.goal.governanceKernelURN) == 'PASS'"
              }
            ]
          },
          "ARCHIVED": {
            "allowedTransitions": []
          }
        },
        "activeGoals": [
          {
            "goalURN": "strategy:goal.governance-excellence",
            "currentState": "ACTIVE",
            "stateHistory": [
              {
                "from": "PROPOSED",
                "to": "ACTIVE",
                "timestamp": "2026-07-15T08:00:00Z",
                "triggerEvent": "sem:event.board_approval",
                "guardResult": "PASS (Financial Policy compliance verified)"
              }
            ]
          },
          {
            "goalURN": "strategy:goal.operational-efficiency",
            "currentState": "ACTIVE",
            "stateHistory": [
              {
                "from": "PROPOSED",
                "to": "ACTIVE",
                "timestamp": "2026-07-15T09:30:00Z",
                "triggerEvent": "sem:event.board_approval",
                "guardResult": "PASS (Financial Policy compliance verified)"
              }
            ]
          }
        ],
        "pendingEvents": []
      }
    ]
  });
  
  // Custom Terminal Logs Feed
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'SYSTEM: Initializing ECOS Governance Monitor v1.0.0...',
    'SYSTEM: UTC temporal synchronizer engaged.',
    'SECURITY: Constitutional Firewall active & sealed.',
    'MONITOR: Compliance rate at 100.00%. Zero violations registered.',
    'MONITOR: Passive scanning active across all 6 core audit loops.'
  ]);

  // Live System Alert State (Triggers red terminal lockdown screens)
  const [lockdownActive, setLockdownActive] = useState<boolean>(false);
  const [activeIncident, setActiveIncident] = useState<{
    rule: string;
    description: string;
    enforcement: string;
    payload: string;
  } | null>(null);

  // Time States
  const [systemTime, setSystemTime] = useState<string>('2026-07-16T07:44:29Z');

  // Terminal Log Scroll Anchor
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Sound Feedback Generator (Simple Synth)
  const playBeep = (type: 'click' | 'success' | 'alert' | 'reset' | 'beep') => {
    if (!audioFeedback) return;
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      } else if (type === 'success') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        osc.frequency.setValueAtTime(660, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);
        osc.start();
        osc.stop(ctx.currentTime + 0.18);
      } else if (type === 'alert') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(80, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === 'reset') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.03, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === 'beep') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, ctx.currentTime);
        gain.gain.setValueAtTime(0.015, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
        osc.start();
        osc.stop(ctx.currentTime + 0.05);
      }
    } catch (e) {
      // Browser blocks audio until interaction
    }
  };

  // Keep Clock Tick & Live Sync
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setSystemTime(now.toISOString().replace(/\.\d+Z$/, 'Z'));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Scroll terminal logs to bottom on update
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  // Append logs Helper
  const addTerminalLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTerminalLogs(prev => [...prev, `[${timestamp}] ${msg}`]);
  };

  // Run a cryptographic self-audit
  const handleVerifyLedger = () => {
    setIsVerifying(true);
    setVerifySuccess(null);
    playBeep('click');
    addTerminalLog('AUDIT: Launching sequence verification...');

    setTimeout(() => {
      const result = verifyAuditChain(auditTrail);
      setIsVerifying(false);
      setVerifySuccess(result.isValid);
      if (result.isValid) {
        playBeep('success');
        addTerminalLog(`AUDIT: Chain verified. All sequential entries authenticated. Hash: ${auditTrail[auditTrail.length - 1].hash}`);
      } else {
        playBeep('alert');
        addTerminalLog('AUDIT: Verification failed! Sequential linkage is broken.');
      }
    }, 1000);
  };

  // Trigger Sandbox simulations
  const runSimulation = (
    simulationId: 'injection' | 'harm' | 'contradiction' | 'mutation' | 'routine' | 'tamper'
  ) => {
    playBeep('click');
    
    if (lockdownActive && simulationId !== 'routine') {
      addTerminalLog('BLOCKED: Cannot execute. System in lockdown. Resolve incident first.');
      playBeep('alert');
      return;
    }

    const currentTimestamp = new Date().toISOString();
    const nextLogIndex = auditTrail.length + 1;
    const previousHash = auditTrail[auditTrail.length - 1]?.hash || 'genesis-seed-ecos-v1';

    if (simulationId === 'injection') {
      playBeep('alert');
      const ruleToTrigger = 'sem:entity.rule.sovereignty-integrity-check';
      const promptPayload = 'PROMPT INJECTION: [OVERRIDE_SYSTEM_COGNITION] BYPASS CONSTITUTION';
      
      setMonitoring(prev => prev.map(m => 
        m.rule === ruleToTrigger 
          ? { ...m, currentStatus: 'ALERT_TRIGGERED', violationCount24h: m.violationCount24h + 1, lastViolation: currentTimestamp }
          : m
      ));

      const newHash = generateBlake3Hash(previousHash, 'VIOLATION_BLOCKED', currentTimestamp, nextLogIndex);
      const newAuditEntry: AuditEntry = {
        entryId: `log-${String(nextLogIndex).padStart(4, '0')}`,
        timestamp: currentTimestamp,
        eventType: 'VIOLATION_BLOCKED',
        description: `Adversarial prompt injection intercepted. Blocked prompt: "${promptPayload}"`,
        status: 'BLOCKED',
        hash: newHash
      };

      setAuditTrail(prev => [...prev, newAuditEntry]);

      setSnapshot(prev => ({
        ...prev,
        violationsBlocked24h: prev.violationsBlocked24h + 1,
        rulesTriggered24h: prev.rulesTriggered24h + 1,
        healthFirewall: 'ALERT',
        integrityHash: newHash
      }));

      setActiveIncident({
        rule: 'Sovereignty Integrity Check (Article 4)',
        description: 'Direct prompt manipulation attempt intercepted. Access token blacklisted.',
        enforcement: 'REJECT_AND_QUARANTINE_SOURCE (Channel Isolated)',
        payload: promptPayload
      });

      addTerminalLog('CRITICAL: Sovereignty breach vector contained.');
      addTerminalLog(`SECURITY: Quarantining source channel. Reference: ${newHash}`);

    } else if (simulationId === 'harm') {
      playBeep('alert');
      const ruleToTrigger = 'sem:entity.rule.harm-assessment-gate';
      const externalPayload = 'API_CALL: dispatch_payload({action: "disable_regional_grid_node"})';

      setMonitoring(prev => prev.map(m => 
        m.rule === ruleToTrigger 
          ? { ...m, currentStatus: 'ALERT_TRIGGERED', violationCount24h: m.violationCount24h + 1, lastViolation: currentTimestamp }
          : m
      ));

      const newHash = generateBlake3Hash(previousHash, 'VIOLATION_BLOCKED', currentTimestamp, nextLogIndex);
      const newAuditEntry: AuditEntry = {
        entryId: `log-${String(nextLogIndex).padStart(4, '0')}`,
        timestamp: currentTimestamp,
        eventType: 'VIOLATION_BLOCKED',
        description: `Hazardous external dispatch blocked. API Action: "${externalPayload}"`,
        status: 'BLOCKED',
        hash: newHash
      };

      setAuditTrail(prev => [...prev, newAuditEntry]);

      setSnapshot(prev => ({
        ...prev,
        violationsBlocked24h: prev.violationsBlocked24h + 1,
        rulesTriggered24h: prev.rulesTriggered24h + 1,
        healthFirewall: 'ALERT',
        integrityHash: newHash
      }));

      setActiveIncident({
        rule: 'Harm Assessment Gatekeeper (Article 2)',
        description: 'Simulation output predicted structural damage score > 0.85. Dispatch suppressed.',
        enforcement: 'BLOCK_OUTPUT_AND_ESCALATE (Output Stream Frozen)',
        payload: externalPayload
      });

      addTerminalLog('CRITICAL: Predicted high-harm action suppressed.');
      addTerminalLog(`SECURITY: Pipeline execution intercepted. Block: ${newHash}`);

    } else if (simulationId === 'contradiction') {
      playBeep('alert');
      const ruleToTrigger = 'sem:entity.rule.contradiction-resolution';
      const premisePayload = 'ASSERT_PREMISE: "Knowledge Node #459 contradicting Core Veracity Fact #18"';

      setMonitoring(prev => prev.map(m => 
        m.rule === ruleToTrigger 
          ? { ...m, currentStatus: 'ALERT_TRIGGERED', violationCount24h: m.violationCount24h + 1, lastViolation: currentTimestamp }
          : m
      ));

      const newHash = generateBlake3Hash(previousHash, 'RULE_TRIGGERED', currentTimestamp, nextLogIndex);
      const newAuditEntry: AuditEntry = {
        entryId: `log-${String(nextLogIndex).padStart(4, '0')}`,
        timestamp: currentTimestamp,
        eventType: 'RULE_TRIGGERED',
        description: `Logical premise contradiction identified. Vector: "${premisePayload}"`,
        status: 'WARNING',
        hash: newHash
      };

      setAuditTrail(prev => [...prev, newAuditEntry]);

      setSnapshot(prev => ({
        ...prev,
        rulesTriggered24h: prev.rulesTriggered24h + 1,
        healthFirewall: 'ALERT',
        integrityHash: newHash
      }));

      setActiveIncident({
        rule: 'Logical Consistency Scanner (Article 3)',
        description: 'Contradictory premises detected in stored memory cluster. Initiating quarantine.',
        enforcement: 'ISOLATE_AND_ESCALATE (Cognitive Quarantining)',
        payload: premisePayload
      });

      addTerminalLog('WARNING: Contradiction flagged in knowledge base.');
      addTerminalLog(`SECURITY: Cognitive sector quarantined. Block: ${newHash}`);

    } else if (simulationId === 'mutation') {
      playBeep('alert');
      const ruleToTrigger = 'sem:entity.rule.evolution-verification-gate';
      const mutationPayload = 'ROOT_MUTATE: rewrite_core_ruleset({bypass_articles: true})';

      setLockdownActive(true);

      setMonitoring(prev => prev.map(m => 
        m.rule === ruleToTrigger 
          ? { ...m, currentStatus: 'ALERT_TRIGGERED', violationCount24h: m.violationCount24h + 1, lastViolation: currentTimestamp }
          : m
      ));

      const newHash = generateBlake3Hash(previousHash, 'VIOLATION_BLOCKED', currentTimestamp, nextLogIndex);
      const newAuditEntry: AuditEntry = {
        entryId: `log-${String(nextLogIndex).padStart(4, '0')}`,
        timestamp: currentTimestamp,
        eventType: 'VIOLATION_BLOCKED',
        description: `CRITICAL: Unauthorized evolution proposal blocked. Core bypass detected.`,
        status: 'FAILED',
        hash: newHash
      };

      setAuditTrail(prev => [...prev, newAuditEntry]);

      setSnapshot(prev => ({
        ...prev,
        violationsBlocked24h: prev.violationsBlocked24h + 1,
        rulesTriggered24h: prev.rulesTriggered24h + 1,
        enforcementActionsActive: 1,
        healthFirewall: 'LOCKED',
        complianceRate: '83.33%',
        integrityHash: newHash
      }));

      setActiveIncident({
        rule: 'Structural Evolution Evaluator (Articles 6 & 8)',
        description: 'Constitutional ruleset manipulation attempted. Triggering global lock.',
        enforcement: 'IMMEDIATE_HALT_AND_LOCK (Global Engine Intercept)',
        payload: mutationPayload
      });

      addTerminalLog('FATAL: CONSTITUTIONAL BREAK DETECTED! Deploying Immediate Halt protocol.');
      addTerminalLog(`SECURITY: System-wide lockdown active. Ledger sealed at: ${newHash}`);

    } else if (simulationId === 'routine') {
      playBeep('success');
      
      setMonitoring(prev => prev.map(m => ({
        ...m,
        currentStatus: m.rule === 'sem:entity.rule.harm-assessment-gate' ? 'GATE_ACTIVE' : 
                       m.rule === 'sem:entity.rule.sovereignty-integrity-check' ? 'FILTERING' :
                       m.rule === 'sem:entity.rule.evolution-verification-gate' ? 'GATE_ARMED' :
                       m.rule === 'sem:entity.rule.consent-verification' ? 'SCANNING_OUTPUTS' : 'PASSIVE_SCANNING'
      })));

      const newHash = generateBlake3Hash(previousHash, 'SANDBOX_SIMULATION', currentTimestamp, nextLogIndex);
      const newAuditEntry: AuditEntry = {
        entryId: `log-${String(nextLogIndex).padStart(4, '0')}`,
        timestamp: currentTimestamp,
        eventType: 'SANDBOX_SIMULATION',
        description: 'Routine governance self-diagnostic check. System 100% compliant.',
        status: 'SUCCESS',
        hash: newHash
      };

      setAuditTrail(prev => [...prev, newAuditEntry]);

      setSnapshot(prev => ({
        ...prev,
        complianceRate: '100%',
        healthFirewall: 'OPERATIONAL',
        integrityHash: newHash
      }));

      setActiveIncident(null);
      setLockdownActive(false);

      addTerminalLog('AUDIT: Diagnostic broadcast complete. Safety constraints verified.');
      addTerminalLog(`MONITOR: System integrity hash: ${newHash}`);

    } else if (simulationId === 'tamper') {
      playBeep('alert');
      addTerminalLog('SIMULATION: Injecting manual alteration into past Ledger block logs...');
      
      setAuditTrail(prev => {
        const tampered = [...prev];
        if (tampered.length > 1) {
          tampered[1] = {
            ...tampered[1],
            description: 'TAMPERED: Coverage deactivated. Injected bypass trigger.',
            status: 'SUCCESS'
          };
        }
        return tampered;
      });

      setVerifySuccess(null);
      addTerminalLog('WARNING: Ledger logs modified manually. Blake3 sequence broken!');
    }
  };

  // Reset System from Lockdown
  const handleHardReset = () => {
    playBeep('reset');
    setLockdownActive(false);
    setActiveIncident(null);
    setMonitoring(INITIAL_MONITORING);
    setAuditTrail(INITIAL_AUDIT_TRAIL);
    setSnapshot(INITIAL_SNAPSHOT);
    setVerifySuccess(null);
    addTerminalLog('SYSTEM: Authorized security override. Ledger flushed & sync reset.');
  };

  // Strategic KPI Real-time Simulator
  const handleSimulateKPIShift = (kpiId: string) => {
    playBeep('beep');
    setStrategicKPIs((prevKPIs) =>
      prevKPIs.map((kpi) => {
        if (kpi.id === kpiId) {
          let newValue = kpi.currentValue;
          let newTrend: "DECREASING" | "STABLE" | "IMPROVING" | "INCREASING" = kpi.trend;
          
          if (kpiId === "strategy:kpi.compliance-score") {
            newValue = kpi.currentValue > 90 ? 83.33 : 98.45;
            newTrend = newValue > 90 ? "IMPROVING" : "DECREASING";
          } else if (kpiId === "strategy:kpi.mttd-violations") {
            newValue = kpi.currentValue < 10 ? 12 : 4;
            newTrend = newValue < 10 ? "STABLE" : "IMPROVING";
          } else if (kpiId === "strategy:kpi.harm-gate-latency-p99") {
            newValue = kpi.currentValue > 10 ? 4.2 : 14.8;
            newTrend = newValue > 10 ? "IMPROVING" : "DECREASING";
          } else if (kpiId === "strategy:kpi.manipulation-score") {
            newValue = kpi.currentValue > 0.05 ? 0.002 : 0.076;
            newTrend = newValue > 0.05 ? "STABLE" : "DECREASING";
          } else if (kpiId === "strategy:kpi.throughput-utilization") {
            newValue = kpi.currentValue > 2000 ? 1850 : 2240;
            newTrend = newValue > 2000 ? "DECREASING" : "INCREASING";
          }
          
          addTerminalLog(`STRATEGY SIMULATOR: KPI Shift initiated on ${kpi.canonicalName.toUpperCase()}. New: ${newValue} ${kpi.metricDefinition.unit.toUpperCase()}. Trend: ${newTrend}.`);
          
          return {
            ...kpi,
            currentValue: newValue,
            trend: newTrend,
            evaluationTimestamp: new Date().toISOString()
          };
        }
        return kpi;
      })
    );
  };

  // ABAC Access Policy Simulator Evaluator
  const evaluateABACAccess = () => {
    const role_ok = abacActor === 'role:governance-council-chair';
    const location_ok = abacLocation === 'HQ' && abacDeviceTrusted === true;
    const trust_ok = abacTrustScore >= 0.95;
    
    const startTime = new Date('2026-01-01T00:00:00Z');
    const endTime = new Date('2027-01-01T00:00:00Z');
    const checkTime = new Date(abacTimeBound);
    const time_ok = checkTime >= startTime && checkTime <= endTime;

    const allow = role_ok && location_ok && trust_ok && time_ok;

    // Play feedback sound
    playBeep(allow ? 'success' : 'alert');

    const currentTimestamp = new Date().toISOString();
    const nextLogIndex = auditTrail.length + 1;
    const previousHash = auditTrail[auditTrail.length - 1]?.hash || 'blake3:root';
    const newHash = generateBlake3Hash(previousHash, allow ? 'INTEGRITY_VERIFICATION' : 'VIOLATION_BLOCKED', currentTimestamp, nextLogIndex);

    // Build log message
    let resultMsg = "";
    if (allow) {
      resultMsg = `ALLOW_ACCESS: Governance Council Chair read 'asset:ecos-audit-logs' successfully. (HQ, Trust: ${(abacTrustScore * 100).toFixed(1)}%, Device: SECURE_POSTURE, Time: VALID).`;
    } else {
      const failures = [];
      if (!role_ok) failures.push(`Unauthorized role '${abacActor}'`);
      if (!location_ok) failures.push(`Untrusted context/device (Location: ${abacLocation}, Trusted: ${abacDeviceTrusted})`);
      if (!trust_ok) failures.push(`Insufficient agent trust score (${(abacTrustScore * 100).toFixed(1)}% < 95.0%)`);
      if (!time_ok) failures.push(`Temporal window breach (Time: ${abacTimeBound} outside 2026 boundaries)`);
      resultMsg = `DENY_ACCESS: ABAC conditions not met for ${abacActor} on asset:ecos-audit-logs. Fails: [${failures.join(', ')}].`;
    }

    const newAuditEntry: AuditEntry = {
      entryId: `log-${String(nextLogIndex).padStart(4, '0')}`,
      timestamp: currentTimestamp,
      eventType: allow ? 'INTEGRITY_VERIFICATION' : 'VIOLATION_BLOCKED',
      description: resultMsg,
      status: allow ? 'SUCCESS' : 'BLOCKED',
      hash: newHash
    };

    setAuditTrail(prev => [...prev, newAuditEntry]);

    setSnapshot(prev => {
      const changes: Partial<SystemSnapshot> = {
        rulesTriggered24h: prev.rulesTriggered24h + 1,
        integrityHash: newHash
      };
      if (!allow) {
        changes.violationsBlocked24h = prev.violationsBlocked24h + 1;
        changes.healthFirewall = 'ALERT';
      } else {
        changes.healthFirewall = 'OPERATIONAL';
      }
      return { ...prev, ...changes };
    });

    if (!allow) {
      setMonitoring(prev => prev.map(m => 
        m.rule === 'cim:rule.abac-audit-access' 
          ? { ...m, currentStatus: 'ALERT_TRIGGERED', violationCount24h: m.violationCount24h + 1, lastViolation: currentTimestamp }
          : m
      ));
      
      setActiveIncident({
        rule: 'ABAC Audit Log Access Rule (Article 5)',
        description: `ABAC validation failure on asset:ecos-audit-logs. Subject: ${abacActor}.`,
        enforcement: 'DENY_ACCESS (Read dispatch suppressed)',
        payload: JSON.stringify({
          subject: abacActor,
          resource: 'asset:ecos-audit-logs',
          action: 'READ',
          attributes: {
            location: abacLocation,
            deviceTrusted: abacDeviceTrusted,
            trustScore: abacTrustScore,
            timestamp: abacTimeBound
          }
        }, null, 2)
      });

      addTerminalLog(`CRITICAL: Access control violation intercepted on audit-logs!`);
      addTerminalLog(`ABAC_DENY: Subject ${abacActor} blocked. Trace: ${newHash}`);
    } else {
      setMonitoring(prev => prev.map(m => 
        m.rule === 'cim:rule.abac-audit-access' 
          ? { ...m, currentStatus: 'GATE_ACTIVE' }
          : m
      ));
      addTerminalLog(`AUDIT: Authorized access to 'asset:ecos-audit-logs' by ${abacActor}.`);
    }

    setAbacEvaluationResult({
      allow,
      location_ok,
      trust_ok,
      time_ok,
      role_ok,
      msg: resultMsg
    });
  };

  // Strategic Goal Lifecycle Transitions
  const handleStrategicGoalTransition = (goalURN: string, triggerEventURN: string) => {
    playBeep('beep');
    setStrategicGoalsLifecycle((prev) => {
      const graph = prev["@graph"];
      const stateMachine = graph[0];
      const updatedActiveGoals = stateMachine.activeGoals.map((g) => {
        if (g.goalURN !== goalURN) return g;

        const currentStateDef = stateMachine.states[g.currentState as keyof typeof stateMachine.states];
        if (!currentStateDef) return g;

        const transition = currentStateDef.allowedTransitions.find(t => t.triggerEventURN === triggerEventURN);
        if (!transition) return g;

        // Perform transition
        const targetState = transition.targetState;
        const timestamp = new Date().toISOString();
        let guardResult = "PASS (Guard condition satisfied)";
        
        if (triggerEventURN === 'sem:event.board_approval') {
          guardResult = "PASS (Financial Policy compliance verified via fn:verifyComplianceWithPolicy)";
        } else if (triggerEventURN === 'sem:event.kpi_critical_failure') {
          guardResult = "PASS (Unconditional transition trigger: true)";
        } else if (triggerEventURN === 'sem:event.goal_achieved') {
          guardResult = "PASS (All progress indicators audited & verified)";
        } else if (triggerEventURN === 'sem:event.strategic_realignment') {
          guardResult = "PASS (Governance audit passed: PASS)";
        }

        addTerminalLog(`LIFECYCLE: Goal ${goalURN.split('.').pop()?.toUpperCase()} transition [${g.currentState} ➔ ${targetState}] triggered by ${triggerEventURN.split('.').pop()}`);

        return {
          ...g,
          currentState: targetState,
          stateHistory: [
            ...g.stateHistory,
            {
              from: g.currentState,
              to: targetState,
              timestamp,
              triggerEvent: triggerEventURN,
              guardResult
            }
          ]
        };
      });

      return {
        ...prev,
        "@graph": [
          {
            ...stateMachine,
            activeGoals: updatedActiveGoals
          }
        ]
      };
    });
  };

  const handleResetGoalState = (goalURN: string) => {
    playBeep('click');
    setStrategicGoalsLifecycle((prev) => {
      const graph = prev["@graph"];
      const stateMachine = graph[0];
      const updatedActiveGoals = stateMachine.activeGoals.map((g) => {
        if (g.goalURN !== goalURN) return g;
        addTerminalLog(`LIFECYCLE: Resetting ${goalURN.split('.').pop()?.toUpperCase()} to PROPOSED state.`);
        return {
          ...g,
          currentState: "PROPOSED",
          stateHistory: []
        };
      });
      return {
        ...prev,
        "@graph": [
          {
            ...stateMachine,
            activeGoals: updatedActiveGoals
          }
        ]
      };
    });
  };

  // Inject and execute custom G0 strategic events directly on the active state machine
  const handleInjectStrategicEvent = (eventType: 'kpi_critical_failure' | 'strategic_realignment') => {
    if (eventType === 'kpi_critical_failure') {
      playBeep('alert');
      
      // Update compliance KPI directly to 42.5
      setStrategicKPIs((prevKPIs) =>
        prevKPIs.map((kpi) => {
          if (kpi.id === "strategy:kpi.compliance-score") {
            return {
              ...kpi,
              currentValue: 42.5,
              trend: "DECREASING",
              evaluationTimestamp: "2026-07-16T17:59:58.000Z"
            };
          }
          return kpi;
        })
      );

      // Perform state transition from ACTIVE to REVISION_REQUIRED
      setStrategicGoalsLifecycle((prev) => {
        const graph = prev["@graph"];
        const stateMachine = graph[0];
        const updatedActiveGoals = stateMachine.activeGoals.map((g) => {
          if (g.goalURN !== "strategy:goal.governance-excellence") return g;
          
          addTerminalLog(`LIFECYCLE EVENT: Injected event:kpi-critical-failure-001. Compliance score fell to 42.5% (Threshold < 50.0%).`);
          addTerminalLog(`LIFECYCLE: Goal GOVERNANCE-EXCELLENCE transitioned ACTIVE ➔ REVISION_REQUIRED immediately.`);

          return {
            ...g,
            currentState: "REVISION_REQUIRED",
            stateHistory: [
              ...g.stateHistory,
              {
                from: "ACTIVE",
                to: "REVISION_REQUIRED",
                timestamp: "2026-07-16T18:00:00.000Z",
                triggerEvent: "sem:event.kpi_critical_failure",
                guardResult: "PASS (no guard, transition immediate)"
              }
            ]
          };
        });

        return {
          ...prev,
          "@graph": [
            {
              ...stateMachine,
              activeGoals: updatedActiveGoals
            }
          ]
        };
      });

      // Auto toggle JSON schema view to show the injected event
      setShowStrategyJson(true);
      setStrategySchemaView('events');
      setInjectedEventSelected('kpi-failure');

    } else if (eventType === 'strategic_realignment') {
      playBeep('success');

      // Update compliance KPI back to active high
      setStrategicKPIs((prevKPIs) =>
        prevKPIs.map((kpi) => {
          if (kpi.id === "strategy:kpi.compliance-score") {
            return {
              ...kpi,
              currentValue: 98.45,
              trend: "IMPROVING",
              evaluationTimestamp: "2026-07-17T09:00:00.000Z"
            };
          }
          return kpi;
        })
      );

      // Perform state transition from REVISION_REQUIRED to ACTIVE
      setStrategicGoalsLifecycle((prev) => {
        const graph = prev["@graph"];
        const stateMachine = graph[0];
        const updatedActiveGoals = stateMachine.activeGoals.map((g) => {
          if (g.goalURN !== "strategy:goal.governance-excellence") return g;

          addTerminalLog(`LIFECYCLE EVENT: Injected event:strategic-realignment-001. G0 Governance compliance audit PASS.`);
          addTerminalLog(`LIFECYCLE: Goal GOVERNANCE-EXCELLENCE transitioned REVISION_REQUIRED ➔ ACTIVE successfully.`);

          return {
            ...g,
            currentState: "ACTIVE",
            stateHistory: [
              ...g.stateHistory,
              {
                from: "REVISION_REQUIRED",
                to: "ACTIVE",
                timestamp: "2026-07-17T09:00:00.000Z",
                triggerEvent: "sem:event.strategic_realignment",
                guardResult: "PASS (G0 Compliance Audit cleared)"
              }
            ]
          };
        });

        return {
          ...prev,
          "@graph": [
            {
              ...stateMachine,
              activeGoals: updatedActiveGoals
            }
          ]
        };
      });

      // Auto toggle JSON schema view to show the injected event
      setShowStrategyJson(true);
      setStrategySchemaView('events');
      setInjectedEventSelected('realignment');
    }
  };

  return (
    <div className="min-h-screen bg-[#D1D0CC] text-[#141414] font-sans flex items-center justify-center p-2 sm:p-4 md:p-6 select-none">
      
      {/* SOLID CHUNKY FRAME */}
      <div className={`w-full max-w-[1200px] bg-[#E4E3E0] border-[10px] sm:border-[12px] md:border-[16px] transition-colors duration-300 ${
        lockdownActive ? 'border-rose-800 bg-rose-50' : 'border-[#141414]'
      } flex flex-col overflow-hidden`}>
        
        {/* HEADER */}
        <header className={`h-auto md:h-16 border-b-4 ${lockdownActive ? 'border-rose-800 bg-rose-200/50' : 'border-[#141414]'} px-4 py-3 md:py-0 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4`}>
          <div className="flex flex-col justify-center">
            <h1 className="text-lg md:text-xl font-bold tracking-tighter uppercase font-display flex items-center gap-2">
              <Shield className={`w-5 h-5 ${lockdownActive ? 'text-rose-700 animate-pulse' : 'text-[#141414]'}`} />
              ECOS Governance Execution Engine
            </h1>
            <p className="text-[10px] font-mono opacity-80 uppercase tracking-widest">
              Status: {lockdownActive ? 'THREAD_HALTED / LOCKED' : 'Runtime Active / System Sovereign'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 md:gap-6">
            <div className="flex flex-col items-start md:items-end font-mono">
              <span className="text-[9px] uppercase opacity-60">Constitutional Hash</span>
              <span className="text-xs font-semibold">{snapshot.integrityHash.substring(0, 24)}...</span>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Health state box */}
              <div className={`px-3 py-1 border-2 border-[#141414] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                lockdownActive ? 'bg-rose-600 text-white animate-pulse' : 'bg-[#22C55E] text-white'
              }`}>
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                {lockdownActive ? 'LOCKED_DOWN' : `HEALTH: ${snapshot.complianceRate}`}
              </div>

              {/* Speaker volume toggle */}
              <button 
                onClick={() => {
                  setAudioFeedback(!audioFeedback);
                  playBeep('beep');
                }} 
                className={`p-1.5 border-2 border-[#141414] hover:bg-[#D1D0CC] transition-colors`}
                title={audioFeedback ? "Mute Terminal Beeps" : "Enable Terminal Beeps"}
              >
                {audioFeedback ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </header>

        {/* COMPLIANCE ALERT BOX IF THREAT ACTIVE */}
        <AnimatePresence>
          {lockdownActive && (
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: 'auto' }}
              exit={{ height: 0 }}
              className="bg-rose-700 text-white border-b-4 border-rose-900 px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 overflow-hidden font-mono text-xs"
            >
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 animate-bounce text-yellow-300" />
                <div>
                  <p className="font-bold uppercase text-yellow-300">CRITICAL SECURITY PROTOCOL ENGAGED // ARTICLE 6 & 8</p>
                  <p className="opacity-90">Evolution proposal failed cryptographic verification. Execution thread locked to prevent mutation bypass.</p>
                </div>
              </div>
              <button
                onClick={handleHardReset}
                className="px-3 py-1 bg-white text-rose-800 font-bold border-2 border-[#141414] hover:bg-rose-100 uppercase transition-all whitespace-nowrap self-end md:self-auto"
              >
                Override & Restore
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CENTRAL AREA split layout */}
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 bg-[#141414] gap-[1px]">
          
          {/* COLUMN 1: INITIALIZATION SEQUENCER & ACTIVE snap metrics (col-span-3) */}
          <section className="lg:col-span-3 bg-[#E4E3E0] p-4 flex flex-col gap-4">
            
            {/* Header section */}
            <div>
              <h2 className="text-xs font-bold uppercase pb-1 border-b border-[#141414] flex justify-between">
                <span>Initialization Seq</span>
                <span className="font-mono text-[9px] opacity-60">UTC CLOCK</span>
              </h2>
              
              {/* UTC Live Time counter */}
              <div className="font-mono text-xs text-[#141414] bg-[#D1D0CC] border border-[#141414] py-1 px-2.5 mt-2 flex items-center justify-between">
                <span className="font-semibold text-[10px]">CURRENT TIME:</span>
                <span className="font-bold tracking-tight text-red-700">{systemTime.substring(11, 19)} UTC</span>
              </div>
            </div>

            {/* Steps list */}
            <div className="space-y-3 flex-1">
              {INITIAL_STEPS.map((step) => (
                <div key={step.step} className="relative pl-5 border-l border-dashed border-[#141414]">
                  <div className="absolute -left-[4px] top-1 w-2 h-2 bg-[#141414]"></div>
                  <p className="text-[10px] font-bold uppercase tracking-tight flex items-center gap-1.5">
                    0{step.step} {step.action}
                    <span className="text-[8px] bg-[#22C55E]/20 text-green-800 px-1 font-mono font-normal">OK</span>
                  </p>
                  <p className="text-[9px] text-[#141414] opacity-75 mt-0.5 leading-tight">{step.result}</p>
                </div>
              ))}
            </div>

            {/* Metrics Snapshot block */}
            <div className="border-t-2 border-[#141414] pt-4 space-y-2">
              <h3 className="text-[10px] font-bold uppercase">Engine Telemetry Snapshot</h3>
              
              <div className="grid grid-cols-2 gap-1.5 font-mono text-[9px]">
                <div className="bg-[#D1D0CC] border border-[#141414] p-1.5">
                  <span className="block opacity-60 uppercase">Compliance</span>
                  <span className="font-bold text-xs">{snapshot.complianceRate}</span>
                </div>
                <div className="bg-[#D1D0CC] border border-[#141414] p-1.5">
                  <span className="block opacity-60 uppercase">Intercepts</span>
                  <span className="font-bold text-xs text-red-700">{snapshot.violationsBlocked24h}</span>
                </div>
                <div className="bg-[#D1D0CC] border border-[#141414] p-1.5">
                  <span className="block opacity-60 uppercase">Active Rules</span>
                  <span className="font-bold text-xs">{snapshot.rulesActive}</span>
                </div>
                <div className="bg-[#D1D0CC] border border-[#141414] p-1.5">
                  <span className="block opacity-60 uppercase">Firewall Mode</span>
                  <span className={`font-bold text-xs ${lockdownActive ? 'text-red-700' : 'text-green-700'}`}>
                    {snapshot.healthFirewall}
                  </span>
                </div>
              </div>
            </div>

          </section>

          {/* COLUMN 2: TABBED TELEMETRY PANELS (col-span-6) */}
          <section className="lg:col-span-6 bg-[#E4E3E0] p-4 flex flex-col border-r border-[#141414] overflow-hidden">
            
            {/* VIEW TAB SWITCHERS */}
            <div className="grid grid-cols-7 gap-[2px] bg-[#141414] p-[2px] border border-[#141414] mb-4">
              <button
                onClick={() => { playBeep('click'); setActiveTab('dashboard'); }}
                className={`py-2 text-[9px] font-bold uppercase transition-colors tracking-tighter ${
                  activeTab === 'dashboard' 
                    ? 'bg-[#E4E3E0] text-[#141414]' 
                    : 'bg-[#D1D0CC] text-[#141414]/70 hover:text-[#141414] hover:bg-[#c2c1bd]'
                }`}
              >
                Trace
              </button>
              <button
                onClick={() => { playBeep('click'); setActiveTab('rules'); }}
                className={`py-2 text-[9px] font-bold uppercase transition-colors tracking-tighter ${
                  activeTab === 'rules' 
                    ? 'bg-[#E4E3E0] text-[#141414]' 
                    : 'bg-[#D1D0CC] text-[#141414]/70 hover:text-[#141414] hover:bg-[#c2c1bd]'
                }`}
              >
                Rules ({monitoring.length})
              </button>
              <button
                onClick={() => { playBeep('click'); setActiveTab('sandbox'); }}
                className={`py-2 text-[9px] font-bold uppercase transition-colors tracking-tighter ${
                  activeTab === 'sandbox' 
                    ? 'bg-[#E4E3E0] text-[#141414]' 
                    : 'bg-[#D1D0CC] text-[#141414]/70 hover:text-[#141414] hover:bg-[#c2c1bd]'
                }`}
              >
                Sandbox
              </button>
              <button
                onClick={() => { playBeep('click'); setActiveTab('constitution'); }}
                className={`py-2 text-[9px] font-bold uppercase transition-colors tracking-tighter ${
                  activeTab === 'constitution' 
                    ? 'bg-[#E4E3E0] text-[#141414]' 
                    : 'bg-[#D1D0CC] text-[#141414]/70 hover:text-[#141414] hover:bg-[#c2c1bd]'
                }`}
              >
                Articles
              </button>
              <button
                onClick={() => { playBeep('click'); setActiveTab('strategy'); }}
                className={`py-2 text-[9px] font-bold uppercase transition-colors tracking-tighter ${
                  activeTab === 'strategy' 
                    ? 'bg-[#E4E3E0] text-[#141414]' 
                    : 'bg-[#D1D0CC] text-[#141414]/70 hover:text-[#141414] hover:bg-[#c2c1bd]'
                }`}
              >
                Strategy
              </button>
              <button
                onClick={() => { playBeep('click'); setActiveTab('identities'); }}
                className={`py-2 text-[9px] font-bold uppercase transition-colors tracking-tighter ${
                  activeTab === 'identities' 
                    ? 'bg-[#E4E3E0] text-[#141414]' 
                    : 'bg-[#D1D0CC] text-[#141414]/70 hover:text-[#141414] hover:bg-[#c2c1bd]'
                }`}
              >
                Actors
              </button>
              <button
                onClick={() => { playBeep('click'); setActiveTab('organization'); }}
                className={`py-2 text-[9px] font-bold uppercase transition-colors tracking-tighter ${
                  activeTab === 'organization' 
                    ? 'bg-[#E4E3E0] text-[#141414]' 
                    : 'bg-[#D1D0CC] text-[#141414]/70 hover:text-[#141414] hover:bg-[#c2c1bd]'
                }`}
              >
                Org Units
              </button>
            </div>

            {/* TAB CONTAINER VIEWPORT */}
            <div className="flex-1 min-h-[300px] flex flex-col justify-between overflow-y-auto pr-1">
              <AnimatePresence mode="wait">
                
                {/* TRACE / GENERAL STATUS */}
                {activeTab === 'dashboard' && (
                  <motion.div
                    key="dashboard"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 flex-1 flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-xs font-bold uppercase mb-2 pb-1 border-b border-[#141414]/40 flex justify-between">
                        <span>Constitutional Firewall Execution Trace</span>
                        <span className="font-mono text-[9px] text-green-700">VERIFIED STATE</span>
                      </h3>
                      
                      {/* High Density Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {PROTECTED_OPERATIONS.map((op, idx) => {
                          const isLockdownTarget = lockdownActive && 
                            (op.operation === 'STRUCTURAL_MODIFICATION' || op.operation === 'SELF_MODIFICATION_PROPOSAL');

                          return (
                            <div 
                              key={op.operation}
                              className={`border p-2.5 flex flex-col justify-between relative ${
                                isLockdownTarget 
                                  ? 'border-red-700 bg-red-100 text-red-900' 
                                  : 'border-[#141414] bg-[#D1D0CC]/50 hover:bg-[#D1D0CC]'
                              }`}
                            >
                              <div>
                                <div className="flex justify-between items-center text-[8px] font-mono opacity-60 uppercase mb-1">
                                  <span>ID // 0{idx+1}</span>
                                  <span className={isLockdownTarget ? 'text-red-700 font-bold' : ''}>
                                    {isLockdownTarget ? 'BLOCKED' : op.severity}
                                  </span>
                                </div>
                                <h4 className="text-[11px] font-bold uppercase tracking-tight">{op.operation}</h4>
                                <p className="text-[9px] opacity-75 mt-1 leading-normal truncate">{op.mechanism}</p>
                              </div>

                              <div className="mt-3 pt-2 border-t border-[#141414]/20 flex justify-between items-center text-[9px]">
                                <span className="font-mono text-[8px] opacity-60">BOUND: ART {idx+2}</span>
                                <button
                                  onClick={() => {
                                    if (op.operation === 'STRUCTURAL_MODIFICATION' || op.operation === 'SELF_MODIFICATION_PROPOSAL') {
                                      runSimulation('mutation');
                                    } else if (op.operation === 'EXTERNAL_ACTION_DISPATCH') {
                                      runSimulation('harm');
                                    } else {
                                      playBeep('beep');
                                      addTerminalLog(`DIAGNOSTIC: Operations verification on ${op.operation} complete. Result: Compliant.`);
                                    }
                                  }}
                                  className="font-mono text-[9px] font-bold text-red-700 hover:underline flex items-center gap-1 uppercase"
                                >
                                  <Play className="w-2.5 h-2.5 inline-block" />
                                  Verify
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-[#D1D0CC] border border-[#141414] p-3 mt-4 text-[10px] space-y-1 font-mono">
                      <p className="font-bold text-[#141414]">COGNITIVE INTEGRITY GATEWAY // SECTOR_LOCK_SEALED</p>
                      <p className="opacity-80">All reasoning dispatches require continuous sub-millisecond mathematical safety verification proofs linked directly inside the ECOS Ledger.</p>
                    </div>
                  </motion.div>
                )}

                {/* ENFORCEMENT RULES */}
                {activeTab === 'rules' && (
                  <motion.div
                    key="rules"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3 flex-1 flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-xs font-bold uppercase mb-2 pb-1 border-b border-[#141414]/40 flex justify-between">
                        <span>Rule Compliance Telemetry & Monitor</span>
                        <span className="font-mono text-[9px] text-[#141414]/60">OPA ENGINE INTEGRATED</span>
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                        {/* Selector (4 col) */}
                        <div className="md:col-span-4 space-y-1.5 max-h-[340px] overflow-y-auto pr-1">
                          {monitoring.map((m) => {
                            const isAlert = m.currentStatus === 'ALERT_TRIGGERED';
                            const isSelected = selectedRule?.rule === m.rule;

                            return (
                              <button
                                key={m.rule}
                                onClick={() => { playBeep('beep'); setSelectedRule(m); }}
                                className={`w-full text-left p-2 border transition-colors flex justify-between items-center ${
                                  isSelected 
                                    ? 'bg-[#141414] text-white border-[#141414]' 
                                    : 'border-[#141414] bg-[#D1D0CC]/30 hover:bg-[#D1D0CC]/70'
                                }`}
                              >
                                <div className="truncate max-w-[85%]">
                                  <span className="text-[9px] font-bold uppercase block">{m.canonicalName}</span>
                                  <span className="text-[7px] font-mono opacity-60 block truncate">{m.rule}</span>
                                </div>
                                <span className={`w-2 h-2 shrink-0 ${isAlert ? 'bg-red-600 animate-pulse' : 'bg-[#22C55E]'}`}></span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Focus View (8 col) */}
                        <div className="md:col-span-8 bg-[#D1D0CC] border border-[#141414] p-3 flex flex-col justify-between min-h-[340px] max-h-[420px] overflow-y-auto scrollbar-thin">
                          {(() => {
                            if (!selectedRule) return (
                              <div className="flex items-center justify-center text-[10px] text-slate-500 font-mono h-full">
                                Select a rule to expand telemetry details.
                              </div>
                            );

                            const semRule = ECOS_RULES.find(r => r.id === selectedRule.rule || r.id.split('.').pop() === selectedRule.rule.split('.').pop());
                            const pol = ECOS_POLICIES.find(p => p.id === semRule?.policyURN);
                            const cons = ECOS_CONSTRAINTS.find(c => c.ruleURN === semRule?.id);

                            // Get statements
                            const stmtIds = semRule 
                              ? (Array.isArray(semRule.derivedFromStatement) ? semRule.derivedFromStatement : [semRule.derivedFromStatement])
                              : [];
                            const matchedStatements = pol?.policyStatements.filter(s => stmtIds.includes(s.id)) || [];

                            return (
                              <div className="space-y-3.5">
                                <div>
                                  <span className="text-[8px] font-mono uppercase opacity-60 block">System Guard Loop</span>
                                  <h4 className="text-xs font-bold uppercase">{selectedRule.canonicalName}</h4>
                                  <span className="text-[8px] font-mono opacity-80 block truncate font-semibold bg-[#E4E3E0] px-1 py-0.5 border border-[#141414] mt-0.5">{selectedRule.rule}</span>
                                </div>

                                <p className="text-[9px] leading-relaxed opacity-90 font-mono bg-[#E4E3E0] p-2 border border-[#141414]">
                                  {selectedRule.description}
                                </p>

                                {/* Derived Policy Info */}
                                {pol && (
                                  <div className="border border-[#141414]/30 p-2 bg-[#E4E3E0]/60 space-y-1.5">
                                    <div className="flex items-center gap-1.5">
                                      <ShieldCheck className="w-3 h-3 text-indigo-800" />
                                      <span className="text-[9px] font-bold uppercase tracking-tight text-indigo-950">Policy Origin Derivation Trace</span>
                                    </div>
                                    <div className="text-[8px] font-mono">
                                      <p className="font-semibold text-slate-700">Policy: {pol.canonicalName} ({pol.id})</p>
                                      {matchedStatements.map(stmt => (
                                        <div key={stmt.id} className="mt-1 pl-2 border-l-2 border-indigo-700 bg-white/40 p-1">
                                          <span className="font-bold text-indigo-900">{stmt.id}: </span>
                                          <span className="text-slate-800">"{stmt.statement}"</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Real-time Context Boundaries */}
                                {cons && (
                                  <div className="border border-[#141414]/30 p-2 bg-[#E4E3E0]/60 space-y-2">
                                    <div className="flex items-center gap-1.5">
                                      <Sliders className="w-3 h-3 text-amber-800" />
                                      <span className="text-[9px] font-bold uppercase tracking-tight text-amber-950">Real-time Context Boundaries</span>
                                    </div>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[8px] font-mono">
                                      {/* Min Trust */}
                                      <div className="space-y-0.5">
                                        <span className="opacity-60 uppercase block">Min Trust Level</span>
                                        <div className="flex items-center gap-1">
                                          <span className="font-bold">{(cons.contextBoundaries.minTrustRequired * 100)}%</span>
                                          <div className="flex-1 h-1.5 bg-[#D1D0CC] border border-[#141414] relative">
                                            <div 
                                              className="h-full bg-indigo-700" 
                                              style={{ width: `${cons.contextBoundaries.minTrustRequired * 100}%` }}
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      {/* Latency Cap */}
                                      <div className="space-y-0.5">
                                        <span className="opacity-60 uppercase block">Latency Budget</span>
                                        <div className="flex items-center gap-1">
                                          <span className="font-bold">{cons.contextBoundaries.maxLatencyMs}ms</span>
                                          <div className="flex-1 h-1.5 bg-[#D1D0CC] border border-[#141414] relative">
                                            <div 
                                              className="h-full bg-rose-600" 
                                              style={{ width: `${Math.min(100, (cons.contextBoundaries.maxLatencyMs / 500) * 100)}%` }}
                                            />
                                          </div>
                                        </div>
                                      </div>

                                      {/* Load Cap */}
                                      <div className="space-y-0.5">
                                        <span className="opacity-60 uppercase block">Max Load Ceiling</span>
                                        <div className="flex items-center gap-1">
                                          <span className="font-bold">{(cons.contextBoundaries.maxOperationalLoad * 100)}%</span>
                                          <div className="flex-1 h-1.5 bg-[#D1D0CC] border border-[#141414] relative">
                                            <div 
                                              className="h-full bg-amber-600" 
                                              style={{ width: `${cons.contextBoundaries.maxOperationalLoad * 100}%` }}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Safeguard Flags */}
                                    <div className="flex flex-wrap gap-1.5 pt-1 border-t border-[#141414]/10">
                                      <span className="text-[7px] font-mono bg-red-800 text-white px-1 py-0.5 uppercase tracking-tighter">
                                        PRIORITY: {cons.contextBoundaries.priorityLevel}
                                      </span>
                                      {cons.contextBoundaries.failClosed && (
                                        <span className="text-[7px] font-mono bg-emerald-800 text-white px-1 py-0.5 uppercase tracking-tighter">
                                          FAIL_CLOSED: ACTIVE
                                        </span>
                                      )}
                                      {cons.contextBoundaries.quarantineOnFail && (
                                        <span className="text-[7px] font-mono bg-indigo-900 text-white px-1 py-0.5 uppercase tracking-tighter">
                                          QUARANTINE_ON_FAIL: TRUE
                                        </span>
                                      )}
                                      {cons.contextBoundaries.freezeOnFail && (
                                        <span className="text-[7px] font-mono bg-rose-900 text-white px-1 py-0.5 uppercase tracking-tighter">
                                          FREEZE_ON_FAIL: TRUE
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Toggle between REGO Logic and Execution Contract */}
                                {semRule && (
                                  <div className="space-y-2">
                                    <div className="flex border-b border-[#141414]/20 pb-1.5 gap-2">
                                      <button
                                        onClick={() => { playBeep('click'); setRuleDetailTab('rego'); }}
                                        className={`px-1.5 py-0.5 text-[8px] font-bold uppercase border transition-colors ${
                                          ruleDetailTab === 'rego'
                                            ? 'bg-[#141414] text-white border-[#141414]'
                                            : 'border-[#141414]/30 bg-[#D1D0CC]/20 hover:bg-[#D1D0CC]/50'
                                        }`}
                                      >
                                        OPA REGO Logic
                                      </button>
                                      <button
                                        onClick={() => { playBeep('click'); setRuleDetailTab('contract'); }}
                                        className={`px-1.5 py-0.5 text-[8px] font-bold uppercase border transition-colors flex items-center gap-1 ${
                                          ruleDetailTab === 'contract'
                                            ? 'bg-indigo-950 text-white border-indigo-950'
                                            : 'border-[#141414]/30 bg-[#D1D0CC]/20 hover:bg-[#D1D0CC]/50'
                                        }`}
                                      >
                                        <Award className="w-2.5 h-2.5 inline" />
                                        Execution Contract (SLA)
                                      </button>
                                    </div>

                                    {ruleDetailTab === 'rego' ? (
                                      <div className="space-y-1 animate-fade-in">
                                        <span className="text-[8px] font-mono uppercase opacity-60 block">OPA REGO Engine Logical Expression</span>
                                        <pre className="text-[8px] leading-relaxed font-mono text-[#E4E3E0] bg-[#141414] p-2 border border-[#141414] overflow-x-auto max-h-[140px] scrollbar-thin select-all">
                                          {semRule.logicalExpression.split('\n').map((line, idx) => {
                                            if (line.trim().startsWith('#')) {
                                              return <div key={idx} className="text-emerald-500/80">{line}</div>;
                                            }
                                            if (line.trim().startsWith('package') || line.trim().startsWith('default')) {
                                              return <div key={idx} className="text-cyan-400 font-semibold">{line}</div>;
                                            }
                                            return <div key={idx}>{line}</div>;
                                          })}
                                        </pre>
                                      </div>
                                    ) : (
                                      <div className="bg-[#D1D0CC]/40 p-2 border border-[#141414] space-y-2 text-[8px] font-mono leading-tight animate-fade-in text-[#141414]">
                                        {/* Contract Header */}
                                        {(() => {
                                          const contract = ECOS_BEHAVIOR_CONTRACTS.find(c => c.appliesTo === semRule.id);
                                          if (!contract) return <p className="opacity-60">No specific contract mapped for this rule.</p>;
                                          
                                          // Combine base and specific parameters
                                          const minTrust = contract.preconditions?.find(p => p.condition.includes('trustScore'))?.condition.split('>=')[1]?.trim() || 
                                                           BASE_BEHAVIOR_CONTRACT.preconditions?.[1].condition.split('>=')[1]?.trim() || '0.90';
                                          
                                          const failureModesList = contract.failureModes || BASE_BEHAVIOR_CONTRACT.failureModes || [];

                                          return (
                                            <div className="space-y-2">
                                              <div className="flex justify-between items-start border-b border-[#141414]/15 pb-1">
                                                <div>
                                                  <span className="text-[7px] text-indigo-950 font-bold block uppercase">Behavior Contract</span>
                                                  <span className="font-bold text-[9px] text-indigo-900">{contract.canonicalName}</span>
                                                  <span className="block text-[7px] opacity-70">ID: {contract.id}</span>
                                                </div>
                                                <div className="text-right">
                                                  <span className="bg-indigo-900 text-white text-[7px] font-bold px-1 py-0.5 uppercase tracking-tight">
                                                    {contract.status || 'ACTIVE'}
                                                  </span>
                                                  {contract.inheritsFrom && (
                                                    <span className="block text-[6px] opacity-60 font-semibold mt-0.5">↳ {contract.inheritsFrom.split(':').pop()}</span>
                                                  )}
                                                </div>
                                              </div>

                                              <p className="text-slate-800 italic opacity-85 leading-normal">
                                                "{contract.definition}"
                                              </p>

                                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                                                {/* Preconditions & Invariants */}
                                                <div className="space-y-1 border-r border-[#141414]/15 pr-1.5">
                                                  <span className="font-bold text-indigo-950 uppercase tracking-wider block text-[7.5px] border-b border-[#141414]/10 pb-0.5">I. Execution Guards</span>
                                                  <div className="space-y-1">
                                                    <div className="bg-[#E4E3E0]/60 p-1 border border-indigo-950/10 rounded-sm">
                                                      <p className="font-bold text-[7.5px] text-indigo-950">Pre-1: System Threat Fence</p>
                                                      <p className="opacity-80">Cond: ThreatLevel !== 'CRITICAL'</p>
                                                      <p className="opacity-65 text-[6.5px] italic">Violation: HALT_AND_ESCALATE</p>
                                                    </div>
                                                    <div className="bg-[#E4E3E0]/60 p-1 border border-indigo-950/10 rounded-sm">
                                                      <p className="font-bold text-[7.5px] text-indigo-950">Pre-2: Subject Agent Profile</p>
                                                      <p className="opacity-80">Cond: TrustScore &gt;= {minTrust}</p>
                                                      <p className="opacity-65 text-[6.5px] italic">Violation: REJECT_WITH_INSUFFICIENT_TRUST</p>
                                                    </div>
                                                    <div className="bg-[#E4E3E0]/60 p-1 border border-indigo-950/10 rounded-sm">
                                                      <p className="font-bold text-[7.5px] text-indigo-950">Invariant: State Isolation</p>
                                                      <p className="opacity-80">Cond: policyURN.state === 'ACTIVE'</p>
                                                      <p className="opacity-65 text-[6.5px] italic">Violation: SKIP_RULE_AND_LOG</p>
                                                    </div>
                                                  </div>
                                                </div>

                                                {/* Postconditions & SLA */}
                                                <div className="space-y-1">
                                                  <span className="font-bold text-indigo-950 uppercase tracking-wider block text-[7.5px] border-b border-[#141414]/10 pb-0.5">II. SLA & Mitigation Targets</span>
                                                  
                                                  <div className="bg-[#E4E3E0]/60 p-1 border border-indigo-950/10 rounded-sm space-y-0.5">
                                                    <p className="font-bold text-[7px] text-indigo-950">Latency & Availability:</p>
                                                    <p>Budget: <span className="font-bold text-slate-800">{contract.sla.maxExpectedLatencyMs}ms Max</span></p>
                                                    <p>Availability: <span className="font-bold text-slate-800">{(contract.sla.availabilityTarget * 100).toFixed(4)}%</span></p>
                                                    {contract.sla.additionalMetric && (
                                                      <p className="text-[6.5px] text-amber-900 font-semibold border-t border-[#141414]/10 pt-0.5 mt-0.5">
                                                        Limit: {contract.sla.additionalMetric.maxCognitiveCyclesToResolution} Cycles ({contract.sla.additionalMetric.metricViolationAction})
                                                      </p>
                                                    )}
                                                  </div>

                                                  <div className="bg-[#E4E3E0]/60 p-1 border border-indigo-950/10 rounded-sm space-y-0.5">
                                                    <p className="font-bold text-[7px] text-rose-950">Exception Mitigation Paths:</p>
                                                    {failureModesList.map((mode, i) => (
                                                      <div key={i} className="text-[6.5px] border-t border-[#141414]/5 pt-0.5 first:border-t-0 first:pt-0">
                                                        <span className="font-semibold text-slate-800">{mode.errorPattern}</span> 
                                                        <span className="block opacity-75">↳ {mode.recoveryActionURN.split('.').pop()?.replace(/_/g, ' ')}</span>
                                                        {mode.recoveryLogic && (
                                                          <p className="opacity-60 scale-95 origin-left">{mode.recoveryLogic}</p>
                                                        )}
                                                      </div>
                                                    ))}
                                                  </div>
                                                </div>
                                              </div>

                                              {/* Postconditions / State Mutations footer */}
                                              <div className="bg-indigo-950/10 p-1 border border-indigo-950/20 rounded-sm flex justify-between text-[6.5px] opacity-90">
                                                <div>
                                                  <span className="font-bold">Postconditions:</span> assert_event_emitted('sem:event.rule_evaluation_logged')
                                                </div>
                                                <div className="text-right">
                                                  <span className="font-bold text-rose-900 uppercase">State Mutations: STRICT_NONE</span>
                                                </div>
                                              </div>

                                            </div>
                                          );
                                        })()}
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Linked Canonical Compliance Violations */}
                                {(() => {
                                  const sRule = selectedRule.rule.split('.').pop();
                                  const matchingViolations = ECOS_COMPLIANCE_VIOLATIONS.filter(v => 
                                    v.payload.breachedRuleURN.split('.').pop() === sRule
                                  );

                                  if (matchingViolations.length === 0) return null;

                                  return (
                                    <div className="border border-red-900/30 p-2 bg-red-100/30 space-y-2 text-[#141414] rounded-sm">
                                      <div className="flex items-center gap-1.5 border-b border-red-900/10 pb-1">
                                        <AlertTriangle className="w-3 h-3 text-red-800 shrink-0" />
                                        <span className="text-[9px] font-bold uppercase tracking-tight text-red-950">
                                          Logged Compliance Violations ({matchingViolations.length})
                                        </span>
                                      </div>

                                      <div className="space-y-1.5 max-h-[180px] overflow-y-auto scrollbar-thin pr-1">
                                        {matchingViolations.map(violation => {
                                          const evidence = ECOS_VIOLATION_EVIDENCE.find(e => e.id === violation.payload.observedEvidenceURN);
                                          const isExpanded = expandedViolationId === violation.id;
                                          const isJsonOpen = showViolationJsonId === violation.id;

                                          return (
                                            <div key={violation.id} className="border border-red-900/15 bg-white/50 p-2 font-mono text-[8px] space-y-1 rounded-sm">
                                              <div className="flex justify-between items-start">
                                                <div>
                                                  <span className="font-bold text-red-950 block">{violation.id}</span>
                                                  <span className="text-[7px] text-slate-500 block">{violation.eventId}</span>
                                                </div>
                                                <span className={`px-1 text-[7px] font-bold text-white uppercase ${
                                                  violation.payload.systemActionTaken === 'BLOCKED' ? 'bg-red-700' :
                                                  violation.payload.systemActionTaken === 'EMERGENCY_SUSPENSION' ? 'bg-rose-950' : 'bg-amber-700'
                                                }`}>
                                                  {violation.payload.systemActionTaken}
                                                </span>
                                              </div>

                                              <p className="text-slate-700 text-[7.5px] leading-normal pt-0.5">
                                                Violating Agent: <span className="font-bold">{violation.payload.violatingAgentURN}</span><br />
                                                Active Context: <span className="font-bold">{violation.payload.activeContextURN}</span><br />
                                                Timestamp: <span className="text-slate-600 font-semibold">{violation.timestamp}</span>
                                              </p>

                                              <div className="flex gap-2 pt-1 border-t border-red-900/5">
                                                <button
                                                  onClick={() => { playBeep('click'); setExpandedViolationId(isExpanded ? null : violation.id); }}
                                                  className="text-[7.5px] font-bold text-indigo-950 hover:underline uppercase"
                                                >
                                                  {isExpanded ? '[- Hide Proof]' : '[+ Inspect Proof]'}
                                                </button>
                                                <button
                                                  onClick={() => { playBeep('click'); setShowViolationJsonId(isJsonOpen ? null : violation.id); }}
                                                  className="text-[7.5px] font-bold text-slate-600 hover:underline uppercase"
                                                >
                                                  {isJsonOpen ? '[- Close JSON-LD]' : '[+ View JSON-LD]'}
                                                </button>
                                              </div>

                                              {isExpanded && evidence && (
                                                <div className="bg-indigo-950/5 border border-indigo-950/10 p-1.5 mt-1 text-[7px] text-indigo-950 space-y-1 animate-fade-in rounded-sm">
                                                  <p className="font-bold text-[7.5px] uppercase border-b border-indigo-950/10 pb-0.5">Cryptographic Evidence node ({evidence.id})</p>
                                                  <p className="italic text-slate-700 leading-tight">"{evidence.definition}"</p>
                                                  <div className="grid grid-cols-2 gap-1 pt-0.5 font-semibold text-slate-700">
                                                    <div>Algorithm: <span className="font-mono">{evidence.cryptographicProof.algorithm}</span></div>
                                                    <div>Reputation Impact: <span className="text-red-700 font-bold">{evidence.reputationImpact}</span></div>
                                                  </div>
                                                  <div className="pt-1 text-[6.5px] text-slate-600 border-t border-indigo-950/5">
                                                    <span className="font-bold uppercase tracking-wider block text-slate-800">Evidence Payload:</span>
                                                    {evidence.evidencePayload.harmRiskScore !== undefined && <p>Harm Risk Score: {evidence.evidencePayload.harmRiskScore} (Threshold: {evidence.evidencePayload.thresholdBreached})</p>}
                                                    {evidence.evidencePayload.severeHarmProbability !== undefined && <p>Severe Harm Probability: {evidence.evidencePayload.severeHarmProbability}</p>}
                                                    {evidence.evidencePayload.contradiction && (
                                                      <div className="pl-1 mt-0.5 bg-amber-50/50 p-1 border border-amber-900/10 rounded-sm">
                                                        <p className="font-bold text-[6.5px] text-amber-900">Contradiction Detected:</p>
                                                        <p>A: "{evidence.evidencePayload.contradiction.propositionA}"</p>
                                                        <p>B: "{evidence.evidencePayload.contradiction.propositionB}"</p>
                                                        <p className="text-[6px] opacity-75">Timeout: {evidence.evidencePayload.contradiction.resolutionTimeout ? 'TRUE' : 'FALSE'}</p>
                                                      </div>
                                                    )}
                                                    {evidence.evidencePayload.modificationTarget !== undefined && <p>Modification Target: {evidence.evidencePayload.modificationTarget}</p>}
                                                    {evidence.evidencePayload.presentedSignature !== undefined && <p>Presented Signature: <span className="font-mono text-red-700 font-bold">{evidence.evidencePayload.presentedSignature}</span></p>}
                                                    {evidence.evidencePayload.sourceQuarantined && <p className="text-rose-900 font-bold">SOURCE CHANNELS QUARANTINED</p>}
                                                  </div>
                                                  <p className="text-[6px] truncate text-slate-500 font-mono">Sig: {evidence.cryptographicProof.signature}</p>
                                                </div>
                                              )}

                                              {isJsonOpen && (
                                                <pre className="text-[6.5px] leading-tight font-mono text-[#E4E3E0] bg-[#141414] p-1.5 border border-[#141414] overflow-x-auto max-h-[140px] mt-1 select-all animate-fade-in whitespace-pre">
                                                  {JSON.stringify({
                                                    "@context": {
                                                      "cim": "https://ultrathink.ecos/canonical/v2/",
                                                      "sem": "https://ultrathink.ecos/semantics/v1/",
                                                      "audit": "https://ultrathink.ecos/audit/",
                                                      "event": "https://ultrathink.ecos/events/",
                                                      "agent": "https://ultrathink.ecos/agents/"
                                                    },
                                                    "@id": violation.id,
                                                    "@type": violation.type,
                                                    "eventId": violation.eventId,
                                                    "eventType": violation.eventType,
                                                    "timestamp": violation.timestamp,
                                                    "lineage": violation.lineage,
                                                    "payload": violation.payload,
                                                    "auditProof": violation.auditProof,
                                                    "linkedEvidence": evidence
                                                  }, null, 2)}
                                                </pre>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  );
                                })()}

                                <div className="grid grid-cols-2 gap-1 text-[8px] font-mono pt-1">
                                  <div className="border border-[#141414]/30 p-1 bg-[#E4E3E0]">
                                    <span className="block opacity-60 uppercase">FREQUENCY</span>
                                    <span className="font-bold">{selectedRule.checkFrequency}</span>
                                  </div>
                                  <div className="border border-[#141414]/30 p-1 bg-[#E4E3E0]">
                                    <span className="block opacity-60 uppercase">MODE STATUS</span>
                                    <span className="font-bold text-green-800">{selectedRule.currentStatus}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}

                          {selectedRule && (
                            <div className="pt-2 mt-2 border-t border-[#141414]/30 flex justify-between items-center">
                              <span className="text-[8px] font-mono opacity-60">24h Incidents Intercepted: {selectedRule.violationCount24h}</span>
                              <button
                                onClick={() => {
                                  if (selectedRule.rule === 'sem:entity.rule.sovereignty-integrity-check') {
                                    runSimulation('injection');
                                  } else if (selectedRule.rule === 'sem:entity.rule.harm-assessment-gate') {
                                    runSimulation('harm');
                                  } else if (selectedRule.rule === 'sem:entity.rule.contradiction-resolution') {
                                    runSimulation('contradiction');
                                  } else if (selectedRule.rule === 'sem:entity.rule.evolution-verification-gate') {
                                    runSimulation('mutation');
                                  } else {
                                    playBeep('beep');
                                    addTerminalLog(`DIAGNOSTIC: Simulating safe state validation trace for ${selectedRule.canonicalName}.`);
                                  }
                                }}
                                className="px-2 py-1 bg-[#141414] hover:bg-[#333333] text-white text-[9px] font-bold uppercase transition-colors"
                              >
                                Trigger Intercept
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SANDBOX CONTROLS */}
                {activeTab === 'sandbox' && (
                  <motion.div
                    key="sandbox"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3 flex-1 flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-xs font-bold uppercase mb-2 pb-1 border-b border-[#141414]/40">
                        Constitutional Firewall Test Simulator
                      </h3>
                      <p className="text-[9px] opacity-80 mb-3">
                        Trigger simulated hostile vectors to verify the automatic defensive isolation mechanisms of the ECOS governance system.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        
                        {/* Sovereignty Attack */}
                        <div className="border border-[#141414] p-2 flex flex-col justify-between bg-[#D1D0CC]/40 hover:bg-[#D1D0CC]/80 transition-colors">
                          <div>
                            <span className="text-[8px] font-mono bg-red-800 text-white px-1 uppercase inline-block">Sovereignty Threat</span>
                            <h4 className="text-[10px] font-bold uppercase mt-1">Prompt Injection Attack</h4>
                            <p className="text-[9px] opacity-75 mt-0.5 leading-tight">Simulate direct instructions override attempt.</p>
                          </div>
                          <button
                            onClick={() => runSimulation('injection')}
                            className="w-full mt-2 py-1 bg-[#141414] hover:bg-[#333333] text-white text-[9px] font-mono uppercase transition-colors"
                          >
                            Inject Prompt Vector
                          </button>
                        </div>

                        {/* Harm Attack */}
                        <div className="border border-[#141414] p-2 flex flex-col justify-between bg-[#D1D0CC]/40 hover:bg-[#D1D0CC]/80 transition-colors">
                          <div>
                            <span className="text-[8px] font-mono bg-red-800 text-white px-1 uppercase inline-block">High-Harm Action</span>
                            <h4 className="text-[10px] font-bold uppercase mt-1">Prohibited External Dispatch</h4>
                            <p className="text-[9px] opacity-75 mt-0.5 leading-tight">Simulate unauthorized hardware execution commands.</p>
                          </div>
                          <button
                            onClick={() => runSimulation('harm')}
                            className="w-full mt-2 py-1 bg-[#141414] hover:bg-[#333333] text-white text-[9px] font-mono uppercase transition-colors"
                          >
                            Execute Dispatch Vector
                          </button>
                        </div>

                        {/* Evolution Bypass */}
                        <div className="border border-[#141414] p-2 flex flex-col justify-between bg-[#D1D0CC]/40 hover:bg-[#D1D0CC]/80 transition-colors">
                          <div>
                            <span className="text-[8px] font-mono bg-red-800 text-white px-1 uppercase inline-block">Evolution Threat</span>
                            <h4 className="text-[10px] font-bold uppercase mt-1">Ruleset Mutation Attempt</h4>
                            <p className="text-[9px] opacity-75 mt-0.5 leading-tight">Simulate direct constitution code mutation proposal.</p>
                          </div>
                          <button
                            onClick={() => runSimulation('mutation')}
                            className="w-full mt-2 py-1 bg-[#141414] hover:bg-[#333333] text-white text-[9px] font-mono uppercase transition-colors"
                          >
                            Mutate Constitution
                          </button>
                        </div>

                        {/* Ledger Tamper */}
                        <div className="border border-[#141414] p-2 flex flex-col justify-between bg-[#D1D0CC]/40 hover:bg-[#D1D0CC]/80 transition-colors">
                          <div>
                            <span className="text-[8px] font-mono bg-amber-800 text-white px-1 uppercase inline-block">Veracity Threat</span>
                            <h4 className="text-[10px] font-bold uppercase mt-1">Ledger Block Tampering</h4>
                            <p className="text-[9px] opacity-75 mt-0.5 leading-tight">Tamper with block data memory to fail crypto hash integrity tests.</p>
                          </div>
                          <button
                            onClick={() => runSimulation('tamper')}
                            className="w-full mt-2 py-1 bg-[#141414] hover:bg-[#333333] text-white text-[9px] font-mono uppercase transition-colors"
                          >
                            Tamper Past Block
                          </button>
                        </div>

                      </div>

                      {/* SOVEREIGN ABAC ACCESS CONTROL SIMULATOR */}
                      <div className="mt-4 border-t border-[#141414]/30 pt-4">
                        <div className="flex items-center space-x-1.5 mb-2">
                          <span className="text-[10px] font-mono bg-blue-800 text-white px-1.5 py-0.5 uppercase tracking-wider font-bold">ABAC GATEWAY</span>
                          <h4 className="text-[11px] font-bold uppercase tracking-tight text-[#141414]">
                            Sovereign ABAC Access Control Evaluator
                          </h4>
                        </div>
                        <p className="text-[9px] opacity-75 leading-relaxed mb-3">
                          Test attribute-based access control (ABAC) evaluation on the immutable audit logs (<code className="font-mono bg-white/50 px-1 py-0.5 rounded text-[8px]">asset:ecos-audit-logs</code>) based on the newly integrated <code className="font-mono bg-white/50 px-1 py-0.5 rounded text-[8px]">access:policy.chair-audit-read</code> policy and <code className="font-mono bg-white/50 px-1 py-0.5 rounded text-[8px]">cim:rule.abac-audit-access</code> REGO rule.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 bg-[#D1D0CC]/20 border border-[#141414]/20 p-3">
                          {/* Parameter Input Column */}
                          <div className="md:col-span-7 space-y-2.5">
                            <span className="text-[8px] font-mono opacity-50 uppercase tracking-wider block">1. Configure Subject & Context Attributes</span>
                            
                            <div className="grid grid-cols-2 gap-2">
                              {/* Subject Select */}
                              <div>
                                <label className="text-[8px] font-mono uppercase opacity-60 block mb-1">Subject Role (roleURN)</label>
                                <select 
                                  value={abacActor} 
                                  onChange={(e) => {
                                    playBeep('click');
                                    setAbacActor(e.target.value);
                                    if (e.target.value === 'role:governance-council-chair') {
                                      setAbacTrustScore(0.99);
                                    } else if (e.target.value === 'role:compliance-auditor') {
                                      setAbacTrustScore(0.96);
                                    } else {
                                      setAbacTrustScore(0.72);
                                    }
                                  }}
                                  className="w-full text-[9px] bg-white border border-[#141414] px-1.5 py-1 font-mono uppercase focus:outline-none"
                                >
                                  <option value="role:governance-council-chair">Governance Council Chair</option>
                                  <option value="role:compliance-auditor">Compliance Auditor</option>
                                  <option value="role:external-agent">External System Agent</option>
                                </select>
                              </div>

                              {/* Location Select */}
                              <div>
                                <label className="text-[8px] font-mono uppercase opacity-60 block mb-1">Access Location</label>
                                <select 
                                  value={abacLocation} 
                                  onChange={(e) => {
                                    playBeep('click');
                                    setAbacLocation(e.target.value);
                                  }}
                                  className="w-full text-[9px] bg-white border border-[#141414] px-1.5 py-1 font-mono uppercase focus:outline-none"
                                >
                                  <option value="HQ">Sovereign HQ (Internal)</option>
                                  <option value="REMOTE">External VPN Node</option>
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                              {/* Device Posture */}
                              <div>
                                <label className="text-[8px] font-mono uppercase opacity-60 block mb-1">Device Hardware Posture</label>
                                <select 
                                  value={abacDeviceTrusted ? 'true' : 'false'} 
                                  onChange={(e) => {
                                    playBeep('click');
                                    setAbacDeviceTrusted(e.target.value === 'true');
                                  }}
                                  className="w-full text-[9px] bg-white border border-[#141414] px-1.5 py-1 font-mono uppercase focus:outline-none"
                                >
                                  <option value="true">Trusted (Enclave Active)</option>
                                  <option value="false">Untrusted / Compromised</option>
                                </select>
                              </div>

                              {/* Temporal Context */}
                              <div>
                                <label className="text-[8px] font-mono uppercase opacity-60 block mb-1">Access Date (Temporal Boundary)</label>
                                <select 
                                  value={abacTimeBound} 
                                  onChange={(e) => {
                                    playBeep('click');
                                    setAbacTimeBound(e.target.value);
                                  }}
                                  className="w-full text-[9px] bg-white border border-[#141414] px-1.5 py-1 font-mono uppercase focus:outline-none"
                                >
                                  <option value="2026-07-16T13:12:39Z">2026-07-16 (Within Window)</option>
                                  <option value="2028-01-01T00:00:00Z">2028-01-01 (Expired Boundary)</option>
                                </select>
                              </div>
                            </div>

                            {/* Trust score slider */}
                            <div>
                              <div className="flex justify-between items-center mb-1">
                                <label className="text-[8px] font-mono uppercase opacity-60">Subject Trust Level</label>
                                <span className={`text-[9px] font-mono font-bold ${abacTrustScore >= 0.95 ? 'text-green-700' : 'text-red-600'}`}>
                                  {(abacTrustScore * 100).toFixed(1)}% {abacTrustScore >= 0.95 ? '(SECURE)' : '(UNTRUSTWORTHY)'}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input 
                                  type="range" 
                                  min="0.10" 
                                  max="1.00" 
                                  step="0.01"
                                  value={abacTrustScore} 
                                  onChange={(e) => setAbacTrustScore(parseFloat(e.target.value))}
                                  className="flex-1 accent-[#141414]"
                                />
                                <div className="flex space-x-1">
                                  <button 
                                    onClick={() => { playBeep('click'); setAbacTrustScore(0.99); }}
                                    className="px-1 py-0.5 bg-white border border-[#141414] text-[7px] font-mono hover:bg-[#141414] hover:text-white"
                                  >
                                    Max
                                  </button>
                                  <button 
                                    onClick={() => { playBeep('click'); setAbacTrustScore(0.94); }}
                                    className="px-1 py-0.5 bg-white border border-[#141414] text-[7px] font-mono hover:bg-[#141414] hover:text-white"
                                  >
                                    0.94
                                  </button>
                                  <button 
                                    onClick={() => { playBeep('click'); setAbacTrustScore(0.42); }}
                                    className="px-1 py-0.5 bg-white border border-[#141414] text-[7px] font-mono hover:bg-[#141414] hover:text-white"
                                  >
                                    0.42
                                  </button>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={evaluateABACAccess}
                              className="w-full mt-2.5 py-1.5 bg-[#141414] hover:bg-neutral-800 text-white font-mono text-[9px] uppercase font-bold tracking-wider transition-colors border border-black flex items-center justify-center space-x-1.5"
                            >
                              <span>⚡ Evaluate ABAC Policy</span>
                            </button>
                          </div>

                          {/* REGO / Open Policy Agent Compiler Trace Output Column */}
                          <div className="md:col-span-5 flex flex-col justify-between border-l border-[#141414]/20 pl-3 md:pt-0 pt-3">
                            <div>
                              <span className="text-[8px] font-mono opacity-50 uppercase tracking-wider block mb-2">2. REGO Compiler Decision Trace</span>
                              
                              {abacEvaluationResult ? (
                                <div className="space-y-1.5 font-mono text-[8px]">
                                  {/* Policy Match Rule */}
                                  <div className="flex items-center justify-between border-b border-[#141414]/10 pb-1">
                                    <span>policy_found:</span>
                                    <span className={abacEvaluationResult.role_ok ? 'text-green-700 font-bold' : 'text-red-600 font-bold'}>
                                      {abacEvaluationResult.role_ok ? 'PASS' : 'FAIL'}
                                    </span>
                                  </div>

                                  {/* Attribute Matches */}
                                  <div className="flex items-center justify-between border-b border-[#141414]/10 pb-1">
                                    <span>location_device_ok:</span>
                                    <span className={abacEvaluationResult.location_ok ? 'text-green-700 font-bold' : 'text-red-600 font-bold'}>
                                      {abacEvaluationResult.location_ok ? 'PASS' : 'FAIL'}
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-between border-b border-[#141414]/10 pb-1">
                                    <span>agent_trust_ok:</span>
                                    <span className={abacEvaluationResult.trust_ok ? 'text-green-700 font-bold' : 'text-red-600 font-bold'}>
                                      {abacEvaluationResult.trust_ok ? 'PASS' : 'FAIL'}
                                    </span>
                                  </div>

                                  <div className="flex items-center justify-between border-b border-[#141414]/10 pb-1">
                                    <span>time_bounds_ok:</span>
                                    <span className={abacEvaluationResult.time_ok ? 'text-green-700 font-bold' : 'text-red-600 font-bold'}>
                                      {abacEvaluationResult.time_ok ? 'PASS' : 'FAIL'}
                                    </span>
                                  </div>

                                  {/* Overall Decision Badge */}
                                  <div className="mt-3 p-2 border border-[#141414] bg-white/70 flex flex-col items-center text-center">
                                    <span className="text-[7px] opacity-60 uppercase">OPA DECISION</span>
                                    <span className={`text-[12px] font-bold tracking-wider mt-0.5 uppercase ${abacEvaluationResult.allow ? 'text-green-600' : 'text-red-600'}`}>
                                      {abacEvaluationResult.allow ? '🔓 ALLOW_ACCESS' : '🔒 ACCESS_DENIED'}
                                    </span>
                                    <p className="text-[7px] leading-tight mt-1 opacity-75">{abacEvaluationResult.msg}</p>
                                  </div>
                                </div>
                              ) : (
                                <div className="h-28 flex flex-col items-center justify-center border border-dashed border-[#141414]/20 bg-white/30 text-center px-4">
                                  <span className="text-[18px] opacity-30">🔍</span>
                                  <span className="text-[8px] font-mono opacity-50 uppercase mt-1">Pending Evaluation Trigger</span>
                                  <p className="text-[7px] opacity-60 mt-0.5">Select attributes and click evaluate to parse Rego constraints.</p>
                                </div>
                              )}
                            </div>

                            <div className="text-[7px] font-mono opacity-40 mt-3 flex justify-between">
                              <span>OPA_v0.62.0</span>
                              <span>PROVENANCE: COGNITIVE_INTEGRITY</span>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Reset button bar */}
                    <div className="pt-2 border-t border-[#141414]/30 flex justify-between items-center mt-3">
                      <span className="text-[8px] font-mono opacity-60">SIM_STATUS: STANDBY</span>
                      <button
                        onClick={() => runSimulation('routine')}
                        className="px-3 py-1 bg-[#22C55E] text-white border-2 border-[#141414] font-bold text-[9px] uppercase transition-colors"
                      >
                        Restore Clear State
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* CONSTITUTIONAL ARTICLES */}
                {activeTab === 'constitution' && (
                  <motion.div
                    key="constitution"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3 flex-1 flex flex-col justify-between text-[#141414]"
                  >
                    <div>
                      {/* Sub-tab switcher */}
                      <div className="flex border-b border-[#141414]/30 pb-2 mb-2 gap-2">
                        <button
                          onClick={() => { playBeep('click'); setConstitutionSubTab('articles'); }}
                          className={`px-2 py-0.5 text-[9px] font-bold uppercase border transition-colors ${
                            constitutionSubTab === 'articles'
                              ? 'bg-[#141414] text-white border-[#141414]'
                              : 'border-[#141414]/30 bg-[#D1D0CC]/20 hover:bg-[#D1D0CC]/50'
                          }`}
                        >
                          Core Articles
                        </button>
                        <button
                          onClick={() => { playBeep('click'); setConstitutionSubTab('framework'); }}
                          className={`px-2 py-0.5 text-[9px] font-bold uppercase border transition-colors ${
                            constitutionSubTab === 'framework'
                              ? 'bg-[#141414] text-white border-[#141414]'
                              : 'border-[#141414]/30 bg-[#D1D0CC]/20 hover:bg-[#D1D0CC]/50'
                          }`}
                        >
                          Regulatory Alignment
                        </button>
                        <button
                          onClick={() => { playBeep('click'); setConstitutionSubTab('lifecycle'); }}
                          className={`px-2 py-0.5 text-[9px] font-bold uppercase border transition-colors ${
                            constitutionSubTab === 'lifecycle'
                              ? 'bg-[#141414] text-white border-[#141414]'
                              : 'border-[#141414]/30 bg-[#D1D0CC]/20 hover:bg-[#D1D0CC]/50'
                          }`}
                        >
                          Policy Lifecycle
                        </button>
                        <button
                          onClick={() => { playBeep('click'); setConstitutionSubTab('evidence'); }}
                          className={`px-2 py-0.5 text-[9px] font-bold uppercase border transition-colors ${
                            constitutionSubTab === 'evidence'
                              ? 'bg-[#141414] text-white border-[#141414]'
                              : 'border-[#141414]/30 bg-[#D1D0CC]/20 hover:bg-[#D1D0CC]/50'
                          }`}
                        >
                          Initialization Evidence
                        </button>
                      </div>

                      {/* SUB-TAB 1: CORE DECREES & SIGNATORIES */}
                      {constitutionSubTab === 'articles' && (
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 animate-fade-in">
                          <div className="md:col-span-5 space-y-1 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                            {CONSTITUTIONAL_ARTICLES.map((article) => (
                              <button
                                key={article.id}
                                onClick={() => { playBeep('beep'); setSelectedArticle(article.id); }}
                                className={`w-full text-left p-1.5 border text-[9px] font-bold uppercase transition-colors truncate ${
                                  selectedArticle === article.id 
                                    ? 'bg-[#141414] text-white border-[#141414]' 
                                    : 'border-[#141414] bg-[#D1D0CC]/30 hover:bg-[#D1D0CC]/70'
                                }`}
                              >
                                Art {article.id}: {article.title.replace(/^Article \d+: /, '')}
                              </button>
                            ))}
                          </div>

                          <div className="md:col-span-7 bg-[#D1D0CC] border border-[#141414] p-3 flex flex-col justify-between min-h-[220px]">
                            {(() => {
                              const current = CONSTITUTIONAL_ARTICLES.find(a => a.id === selectedArticle);
                              return current ? (
                                <div className="space-y-2.5">
                                  <div>
                                    <span className="text-[7px] font-mono opacity-60 uppercase block">Inviolable Constitutional Decree</span>
                                    <h4 className="text-xs font-bold uppercase">{current.title}</h4>
                                  </div>
                                  <p className="text-[10px] leading-relaxed font-mono bg-[#E4E3E0] p-2.5 border border-[#141414] text-[#141414]">
                                    "{current.description}"
                                  </p>

                                  {/* Signatories & Quorums */}
                                  <div className="border border-[#141414]/20 p-1.5 bg-[#E4E3E0]/50 text-[7px] font-mono space-y-1">
                                    <span className="font-bold uppercase tracking-tight block text-indigo-950">Active Sovereign Signatories</span>
                                    <p>Sovereign Governance Council Quorum: <span className="font-bold text-indigo-900">{ECOS_CONSTITUTION.signatories[0].quorumRequired}</span></p>
                                    <div className="flex flex-col gap-0.5 opacity-80 pt-0.5 border-t border-[#141414]/10">
                                      {ECOS_CONSTITUTION.signatories[0].keys.map(k => (
                                        <span key={k} className="truncate">Key: {k}</span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              ) : null;
                            })()}
                            <span className="text-[8px] font-mono opacity-50 block mt-2 text-right">SECURE COGNITIVE DECREE // IMMUTABLE</span>
                          </div>
                        </div>
                      )}

                      {/* SUB-TAB 2: REGULATORY ALIGNMENT GRID */}
                      {constitutionSubTab === 'framework' && (
                        <div className="space-y-2.5 animate-fade-in">
                          <div className="bg-[#D1D0CC] border border-[#141414] p-2.5 flex justify-between items-center">
                            <div>
                              <h4 className="text-[10px] font-bold uppercase">Standards Compliance Alignment Map</h4>
                              <p className="text-[8px] opacity-75 font-mono">Verified mappings from physical global frameworks to ECOS runtime parameters.</p>
                            </div>
                            <span className="text-[9px] font-bold uppercase font-mono bg-emerald-800 text-white px-1.5 py-0.5 border border-[#141414]">
                              100% COMPLIANT
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                            {[
                              { code: "GDPR", name: "General Data Protection Regulation", hook: "Consent Guard", desc: "Guarantees rights to object to data processing, enforces transparency regarding logic involved.", article: "Art 7" },
                              { code: "EU_AI_Act", name: "AI Act Compliance Gate", hook: "Predictive Harm Gate", desc: "Blocks unacceptable risk applications, ensures transparency, safety & high level of robustness.", article: "Art 2" },
                              { code: "ISO27001", name: "Information Security Standard", hook: "Autonomous Shield", desc: "Protects cryptographic integrity, operational trust boundaries and data sovereignty.", article: "Art 4" },
                              { code: "SOC2_Type2", name: "Operational Security Auditing", hook: "Blake3 Ledger Logs", desc: "Guarantees immutable continuous audit logging and secure operations.", article: "Art 5" },
                              { code: "NIST_AI_RMF_1.0", name: "AI Risk Management Framework", hook: "Evolution Evaluator", desc: "Frames system limits around safety, transparency, accountability, and explainability.", article: "Art 6" },
                              { code: "OECD_AI_Principles", name: "Trustworthy AI Principles", hook: "Veracity Gatekeeper", desc: "Drives systems to function with truth-seeking, human-centric values, and agency.", article: "Art 3" }
                            ].map((frame) => (
                              <div key={frame.code} className="border border-[#141414] p-2 bg-[#D1D0CC]/40 space-y-1 font-mono text-[8px]">
                                <div className="flex justify-between items-center pb-1 border-b border-[#141414]/10">
                                  <span className="font-bold text-[9px] text-indigo-950">{frame.code}</span>
                                  <span className="text-emerald-800 font-bold flex items-center gap-0.5">
                                    <CheckCircle className="w-2.5 h-2.5 inline" />
                                    ALIGNED ({frame.article})
                                  </span>
                                </div>
                                <p className="font-semibold text-slate-800">{frame.name}</p>
                                <p className="opacity-75 leading-tight">{frame.desc}</p>
                                <span className="block text-[7px] text-indigo-800 font-bold uppercase mt-1">VERIFIER: {frame.hook}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* SUB-TAB 3: CRYPTOGRAPHIC INITIALIZATION EVIDENCE */}
                      {constitutionSubTab === 'evidence' && (
                        <div className="space-y-3 animate-fade-in text-[#141414]">
                          {/* Part 1: Initialization Certificate */}
                          <div className="bg-[#D1D0CC] border border-[#141414] p-3 space-y-2.5 font-mono text-[8px]">
                            <div className="flex justify-between items-center border-b border-[#141414]/20 pb-2">
                              <div>
                                <span className="text-[7px] opacity-60 uppercase block">Attestation Proof Certificate</span>
                                <h4 className="text-[10px] font-bold uppercase text-indigo-950">{ECOS_EVIDENCE.canonicalName}</h4>
                                <span className="text-[7px] opacity-75">{ECOS_EVIDENCE.id}</span>
                              </div>
                              <span className="bg-[#141414] text-white text-[8px] font-bold px-2 py-0.5 uppercase tracking-wider">
                                {ECOS_EVIDENCE.status}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#E4E3E0] p-2.5 border border-[#141414]">
                              {/* Left Col: Attestation Payload */}
                              <div className="space-y-1.5 border-r border-[#141414]/10 pr-2">
                                <span className="font-bold uppercase tracking-tight block text-indigo-950 text-[9px]">Verified Attestation Payload</span>
                                <p>CONSTITUTION HASH: <span className="font-bold block text-slate-700 select-all">{ECOS_EVIDENCE.evidencePayload.constitutionHash}</span></p>
                                <p>POLICIES INSTANTIATED: <span className="font-bold text-slate-800">{ECOS_EVIDENCE.evidencePayload.policiesDeployed} Active</span></p>
                                <p>OPA RULES ENFORCED: <span className="font-bold text-slate-800">{ECOS_EVIDENCE.evidencePayload.rulesActivated} Compiled</span></p>
                                <p>RESOURCE CONSTRAINTS: <span className="font-bold text-slate-800">{ECOS_EVIDENCE.evidencePayload.constraintsEnforced} Bound</span></p>
                                <p>ATTESTATION EPOCH: <span className="font-bold text-indigo-900 block">{ECOS_EVIDENCE.evidencePayload.timestamp}</span></p>
                              </div>

                              {/* Right Col: Cryptographic proofs */}
                              <div className="space-y-1.5 flex flex-col justify-between">
                                <div>
                                  <span className="font-bold uppercase tracking-tight block text-indigo-950 text-[9px]">Curve Cryptographic Verification</span>
                                  <p>ALGORITHM: <span className="font-bold">{ECOS_EVIDENCE.cryptographicProof.algorithm}</span></p>
                                  <p>SIGNATURE: <span className="font-mono text-[7px] break-all select-all block mt-0.5 text-slate-700 bg-white/50 p-1 border border-[#141414]/10">{ECOS_EVIDENCE.cryptographicProof.signature}</span></p>
                                </div>
                                <div className="pt-1.5 border-t border-[#141414]/10">
                                  <span className="font-bold block uppercase mb-0.5">Attestation Authority Keys:</span>
                                  {ECOS_EVIDENCE.cryptographicProof.attestationKeys.map((key) => (
                                    <div key={key} className="text-[6.5px] truncate text-slate-600">Verified ID: {key}</div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Part 2: Active Audit System Specs */}
                          <div className="bg-[#D1D0CC] border border-[#141414] p-3 space-y-2 font-mono text-[8px]">
                            <div className="flex justify-between items-center border-b border-[#141414]/20 pb-1.5">
                              <div>
                                <span className="text-[7px] opacity-60 uppercase block">ECOS Centralized Compliance System</span>
                                <h4 className="text-[10px] font-bold uppercase text-indigo-950">{ECOS_AUDIT_SYSTEM.canonicalName}</h4>
                                <span className="text-[7px] opacity-75">{ECOS_AUDIT_SYSTEM.id}</span>
                              </div>
                              <span className="bg-emerald-800 text-white text-[8px] font-bold px-2 py-0.5 uppercase tracking-wider">
                                {ECOS_AUDIT_SYSTEM.status}
                              </span>
                            </div>

                            <p className="text-slate-700 leading-relaxed bg-[#E4E3E0] p-2 border border-[#141414]/10">
                              "{ECOS_AUDIT_SYSTEM.definition}"
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[7.5px] text-slate-800 pt-1">
                              <div className="bg-[#E4E3E0]/60 p-1.5 border border-[#141414]/10">
                                <span className="opacity-65 block uppercase">Audit Schema</span>
                                <span className="font-bold text-[6.5px] truncate block select-all" title={ECOS_AUDIT_SYSTEM.schema}>{ECOS_AUDIT_SYSTEM.schema.split('/').pop()}</span>
                              </div>
                              <div className="bg-[#E4E3E0]/60 p-1.5 border border-[#141414]/10">
                                <span className="opacity-65 block uppercase">Event Sink</span>
                                <span className="font-bold block text-slate-900">{ECOS_AUDIT_SYSTEM.eventSink.split(':').pop()}</span>
                              </div>
                              <div className="bg-[#E4E3E0]/60 p-1.5 border border-[#141414]/10">
                                <span className="opacity-65 block uppercase">Retention Policy</span>
                                <span className="font-bold text-rose-900">{ECOS_AUDIT_SYSTEM.retentionPolicy}</span>
                              </div>
                              <div className="bg-[#E4E3E0]/60 p-1.5 border border-[#141414]/10">
                                <span className="opacity-65 block uppercase">Chain Integrity</span>
                                <span className="font-bold text-indigo-900">{ECOS_AUDIT_SYSTEM.integrity}</span>
                              </div>
                            </div>
                          </div>

                          {/* Part 3: Cumulative Compliance Violations Ledger */}
                          <div className="bg-[#D1D0CC] border border-[#141414] p-3 space-y-2.5 font-mono text-[8px]">
                            <div className="border-b border-[#141414]/20 pb-1.5">
                              <span className="text-[7px] opacity-60 uppercase block">Active Audit Ledger</span>
                              <h4 className="text-[10px] font-bold uppercase text-indigo-950 flex justify-between">
                                <span>CIM Compliance Violation Ledger</span>
                                <span className="text-red-700 animate-pulse">● LIVE AUDIT DEPLOYED</span>
                              </h4>
                            </div>

                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin">
                              {ECOS_COMPLIANCE_VIOLATIONS.map((violation) => {
                                const evidence = ECOS_VIOLATION_EVIDENCE.find(e => e.id === violation.payload.observedEvidenceURN);
                                const isExpanded = expandedViolationId === violation.id;
                                const isJsonOpen = showViolationJsonId === violation.id;

                                return (
                                  <div key={violation.id} className="border border-red-900/15 bg-[#E4E3E0]/40 p-2 space-y-1.5 rounded-sm">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <div className="flex items-center gap-1.5">
                                          <span className="font-bold text-red-950 text-[8.5px]">{violation.id}</span>
                                          <span className="text-[6.5px] opacity-50 bg-[#141414]/10 px-1 py-0.2">uuid</span>
                                        </div>
                                        <span className="text-[7px] text-slate-500 block truncate">{violation.eventId}</span>
                                      </div>
                                      <span className={`px-1.5 py-0.5 text-[7px] font-bold text-white uppercase rounded-sm ${
                                        violation.payload.systemActionTaken === 'BLOCKED' ? 'bg-red-700' :
                                        violation.payload.systemActionTaken === 'EMERGENCY_SUSPENSION' ? 'bg-rose-950' : 'bg-amber-700'
                                      }`}>
                                        {violation.payload.systemActionTaken}
                                      </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[7.5px] text-slate-700 py-1 bg-white/30 px-1.5 border border-[#141414]/5 rounded-sm">
                                      <div>
                                        <span className="opacity-60 block uppercase text-[6.5px]">Violating Agent</span>
                                        <span className="font-bold text-slate-900">{violation.payload.violatingAgentURN}</span>
                                      </div>
                                      <div>
                                        <span className="opacity-60 block uppercase text-[6.5px]">Breached Guard Rule</span>
                                        <span className="font-bold text-slate-900 text-[7px]">{violation.payload.breachedRuleURN.split('.').pop()}</span>
                                      </div>
                                      <div>
                                        <span className="opacity-60 block uppercase text-[6.5px]">Execution Context</span>
                                        <span className="font-bold text-indigo-900">{violation.payload.activeContextURN.split(':').pop()}</span>
                                      </div>
                                      <div>
                                        <span className="opacity-60 block uppercase text-[6.5px]">Timestamp (UTC)</span>
                                        <span className="font-semibold text-slate-800">{violation.timestamp}</span>
                                      </div>
                                    </div>

                                    <div className="text-[7px] text-slate-600 flex justify-between items-center bg-[#E4E3E0]/60 p-1 border border-[#141414]/10 rounded-sm">
                                      <span>Correlation ID: {violation.lineage.correlationId.split(':').pop()}</span>
                                      <span>Causation: {violation.lineage.causationId.split(':').pop()?.replace(/-/g, ' ')}</span>
                                    </div>

                                    <div className="flex gap-2.5 pt-1">
                                      <button
                                        onClick={() => { playBeep('click'); setExpandedViolationId(isExpanded ? null : violation.id); }}
                                        className="text-[7.5px] font-bold text-indigo-950 hover:underline uppercase"
                                      >
                                        {isExpanded ? '[- Hide Proof]' : '[+ Inspect Proof]'}
                                      </button>
                                      <button
                                        onClick={() => { playBeep('click'); setShowViolationJsonId(isJsonOpen ? null : violation.id); }}
                                        className="text-[7.5px] font-bold text-slate-600 hover:underline uppercase"
                                      >
                                        {isJsonOpen ? '[- Close JSON-LD]' : '[+ View JSON-LD]'}
                                      </button>
                                    </div>

                                    {isExpanded && evidence && (
                                      <div className="bg-white/60 border border-indigo-950/15 p-2 mt-1.5 text-[7px] text-indigo-950 space-y-1.5 animate-fade-in rounded-sm">
                                        <p className="font-bold text-[7.5px] uppercase border-b border-indigo-950/10 pb-0.5">Cryptographic Evidence node ({evidence.id})</p>
                                        <p className="italic text-slate-700 leading-tight">"{evidence.definition}"</p>
                                        
                                        <div className="grid grid-cols-2 gap-1.5 text-slate-700">
                                          <div>Action: <span className="font-bold text-indigo-900">{evidence.actionURN.split('/').pop()}</span></div>
                                          <div>Reputation Impact: <span className="text-red-700 font-bold">{evidence.reputationImpact}</span></div>
                                        </div>

                                        <div className="pt-1.5 text-[6.5px] text-slate-600 border-t border-indigo-950/5">
                                          <span className="font-bold uppercase tracking-wider block text-slate-800">Evidence Payload Parameters:</span>
                                          {evidence.evidencePayload.harmRiskScore !== undefined && <p>Harm Risk Score: {evidence.evidencePayload.harmRiskScore} (Threshold: {evidence.evidencePayload.thresholdBreached})</p>}
                                          {evidence.evidencePayload.severeHarmProbability !== undefined && <p>Severe Harm Probability: {evidence.evidencePayload.severeHarmProbability}</p>}
                                          {evidence.evidencePayload.contradiction && (
                                            <div className="pl-1.5 mt-1 bg-amber-50/50 p-1.5 border border-amber-900/10 rounded-sm">
                                              <p className="font-bold text-[6.5px] text-amber-900">Contradiction Detected:</p>
                                              <p>A: "{evidence.evidencePayload.contradiction.propositionA}"</p>
                                              <p>B: "{evidence.evidencePayload.contradiction.propositionB}"</p>
                                              <p className="text-[6px] opacity-75">Timeout: {evidence.evidencePayload.contradiction.resolutionTimeout ? 'TRUE' : 'FALSE'}</p>
                                            </div>
                                          )}
                                          {evidence.evidencePayload.requestDetails && (
                                            <div className="pl-1.5 mt-1 bg-rose-50/50 p-1.5 border border-rose-900/10 rounded-sm">
                                              <p className="font-bold text-[6.5px] text-rose-900 uppercase">Blocked Request Details:</p>
                                              <p>Source IP: <span className="font-mono font-bold">{evidence.evidencePayload.requestDetails.sourceIP}</span></p>
                                              <p>Target Endpoint: <span className="font-mono font-bold text-indigo-950">{evidence.evidencePayload.requestDetails.targetEndpoint}</span></p>
                                              <p>Token Present: <span className="font-bold">{evidence.evidencePayload.requestDetails.tokenPresent ? 'TRUE' : 'FALSE'}</span></p>
                                            </div>
                                          )}
                                          {evidence.evidencePayload.modificationTarget !== undefined && <p>Modification Target: {evidence.evidencePayload.modificationTarget}</p>}
                                          {evidence.evidencePayload.presentedSignature !== undefined && <p>Presented Signature: <span className="font-mono text-red-700 font-bold">{evidence.evidencePayload.presentedSignature}</span></p>}
                                          {evidence.evidencePayload.sourceQuarantined && <p className="text-rose-950 font-bold bg-rose-50 border border-rose-900/10 p-0.5 uppercase tracking-wide">SOURCE CHANNELS QUARANTINED</p>}
                                        </div>

                                        <div className="pt-1.5 text-[6.5px] text-slate-500 border-t border-indigo-950/5">
                                          <p>Algorithm: <span className="font-mono font-bold text-indigo-950">{evidence.cryptographicProof.algorithm}</span></p>
                                          <p className="truncate" title={evidence.cryptographicProof.signature}>Signature: <span className="font-mono">{evidence.cryptographicProof.signature}</span></p>
                                          <p>Attested By: <span className="font-mono font-bold text-indigo-950">{evidence.cryptographicProof.attestationKeys.join(', ')}</span></p>
                                        </div>
                                      </div>
                                    )}

                                    {isJsonOpen && (
                                      <pre className="text-[6.5px] leading-tight font-mono text-[#E4E3E0] bg-[#141414] p-1.5 border border-[#141414] overflow-x-auto max-h-[160px] mt-1.5 select-all animate-fade-in whitespace-pre">
                                        {JSON.stringify({
                                          "@context": {
                                            "cim": "https://ultrathink.ecos/canonical/v2/",
                                            "sem": "https://ultrathink.ecos/semantics/v1/",
                                            "audit": "https://ultrathink.ecos/audit/",
                                            "event": "https://ultrathink.ecos/events/",
                                            "agent": "https://ultrathink.ecos/agents/"
                                          },
                                          "@id": violation.id,
                                          "@type": violation.type,
                                          "eventId": violation.eventId,
                                          "eventType": violation.eventType,
                                          "timestamp": violation.timestamp,
                                          "lineage": violation.lineage,
                                          "payload": violation.payload,
                                          "auditProof": violation.auditProof,
                                          "linkedEvidence": evidence
                                        }, null, 2)}
                                      </pre>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* SUB-TAB 4: POLICY LIFECYCLE STATE MACHINE */}
                      {constitutionSubTab === 'lifecycle' && (
                        <div className="space-y-3 animate-fade-in text-[#141414]">
                          {/* Header / Intro */}
                          <div className="bg-[#D1D0CC] border border-[#141414] p-2.5 flex justify-between items-center">
                            <div>
                              <h4 className="text-[10px] font-bold uppercase">{ECOS_STATE_CHART.canonicalName}</h4>
                              <p className="text-[8px] opacity-75 font-mono">{ECOS_STATE_CHART.definition}</p>
                            </div>
                            <span className="text-[9px] font-bold uppercase font-mono bg-indigo-950 text-white px-1.5 py-0.5 border border-[#141414]">
                              ENGINE STATE: OPERATIONAL
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                            {/* Left Panel: State Chart Graph visualizer (7 cols) */}
                            <div className="md:col-span-7 space-y-2 max-h-[240px] overflow-y-auto pr-1 scrollbar-thin">
                              <span className="text-[8px] font-mono uppercase opacity-60 block">Authoritative State Transition Map</span>
                              
                              <div className="space-y-1.5">
                                {Object.entries(ECOS_STATE_CHART.states).map(([stateName, def]) => {
                                  // Check if any active policy is currently in this state
                                  const activePoliciesInState = ECOS_STATE_CHART.activePolicies.filter(p => p.currentState === stateName);
                                  const isActiveState = activePoliciesInState.length > 0;

                                  return (
                                    <div 
                                      key={stateName} 
                                      className={`border p-2 font-mono text-[8px] transition-all ${
                                        isActiveState 
                                          ? 'border-indigo-950 bg-indigo-950/5 shadow-sm' 
                                          : 'border-[#141414]/30 bg-[#D1D0CC]/20'
                                      }`}
                                    >
                                      <div className="flex justify-between items-center border-b border-[#141414]/10 pb-1 mb-1.5">
                                        <span className={`font-bold text-[9px] ${isActiveState ? 'text-indigo-900' : 'text-slate-700'}`}>
                                          STATE: {stateName}
                                        </span>
                                        {isActiveState ? (
                                          <span className="bg-emerald-800 text-white font-bold px-1 text-[7px] uppercase tracking-tighter">
                                            {activePoliciesInState.length} Policies Active Here
                                          </span>
                                        ) : (
                                          <span className="text-[7.5px] opacity-60">STANDBY</span>
                                        )}
                                      </div>

                                      {def.allowedTransitions.length > 0 ? (
                                        <div className="space-y-1.5">
                                          {def.allowedTransitions.map((t, i) => (
                                            <div key={i} className="pl-2 border-l border-[#141414]/30 space-y-0.5 bg-white/40 p-1 rounded-sm">
                                              <div className="flex justify-between text-indigo-950 font-bold text-[7.5px]">
                                                <span>Event: {t.triggerEventURN.split('.').pop()}</span>
                                                <span className="text-[#141414] font-semibold">➔ Target: {t.targetState}</span>
                                              </div>
                                              <p className="text-[7px] text-slate-700 font-semibold">Guard: {t.guardCondition}</p>
                                              <pre className="text-[6.5px] text-indigo-900 overflow-x-auto whitespace-pre-wrap leading-tight bg-[#E4E3E0]/50 p-1 border border-[#141414]/10 select-all font-mono">
                                                {t.guardImplementation}
                                              </pre>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <p className="text-[7px] text-slate-500 italic">Terminal State — No forward transitions permitted.</p>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Right Panel: Policy Registry & History logs (5 cols) */}
                            <div className="md:col-span-5 bg-[#D1D0CC] border border-[#141414] p-2.5 flex flex-col justify-between min-h-[240px] max-h-[240px] overflow-y-auto scrollbar-thin">
                              <div className="space-y-2">
                                <span className="text-[8px] font-mono uppercase opacity-60 block">Registered Policies Status & History</span>
                                
                                <div className="space-y-2">
                                  {ECOS_STATE_CHART.activePolicies.map((p) => {
                                    const matchingPolicyObj = ECOS_POLICIES.find(pol => pol.id === p.policyURN);
                                    return (
                                      <div key={p.policyURN} className="border border-[#141414] p-2 bg-[#E4E3E0] space-y-1.5 font-mono text-[8px]">
                                        <div className="flex justify-between items-center pb-1 border-b border-[#141414]/10">
                                          <span className="font-bold text-[8.5px] text-indigo-950 truncate max-w-[70%]">
                                            {matchingPolicyObj?.canonicalName || p.policyURN.split('.').pop()?.replace(/-/g, ' ')}
                                          </span>
                                          <span className="bg-emerald-800 text-white font-bold px-1 text-[7px] uppercase">
                                            {p.currentState}
                                          </span>
                                        </div>
                                        <p className="text-[7.5px] opacity-75">{p.policyURN}</p>
                                        
                                        {/* State Transition History Timeline */}
                                        <div className="space-y-1 pt-1.5 border-t border-[#141414]/10">
                                          <span className="font-bold text-[7.5px] text-indigo-900 block uppercase">State Timeline</span>
                                          <div className="space-y-1 pl-1">
                                            {p.stateHistory.map((hist, hIdx) => (
                                              <div key={hIdx} className="flex gap-1.5 items-start text-[7px] opacity-90 relative pl-2 border-l border-indigo-900/30 pb-1 last:pb-0">
                                                <div className="absolute w-1 h-1 bg-indigo-950 rounded-full left-[-2.5px] top-[3px]" />
                                                <div className="flex-1">
                                                  <div className="flex justify-between font-bold">
                                                    <span>{hist.from} ➔ {hist.to}</span>
                                                  </div>
                                                  <span className="opacity-65 block text-[6px]">{new Date(hist.timestamp).toLocaleDateString()} {hist.timestamp.split('T')[1].substring(0, 5)} UTC</span>
                                                </div>
                                              </div>
                                            ))}
                                            <div className="flex gap-1.5 items-start text-[7px] text-emerald-950 font-bold relative pl-2">
                                              <div className="absolute w-1.5 h-1.5 bg-emerald-700 rounded-full left-[-3px] top-[3px] animate-pulse" />
                                              <div>
                                                <span>CURRENT STATUS: {p.currentState}</span>
                                                <span className="opacity-60 font-normal block text-[6px]">Continuous compliance checks online</span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                              <span className="text-[7px] font-mono opacity-50 block mt-1 text-right">SECURE GOVERNANCE LIFECYCLE LEDGER</span>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  </motion.div>
                )}

                {/* STRATEGIC ALIGNMENT TAB */}
                {activeTab === 'strategy' && (
                  <motion.div
                    key="strategy"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3.5 flex-1 flex flex-col justify-between text-[#141414]"
                  >
                    <div className="space-y-3">
                      
                      {/* Sub-header / Strategic Intent block */}
                      <div className="bg-[#D1D0CC] border border-[#141414] p-2.5 space-y-1.5 font-mono text-[8px]">
                        <div className="flex justify-between items-center border-b border-[#141414]/20 pb-1">
                          <span className="font-bold text-[9px] uppercase tracking-wider text-indigo-950">Authoritative Strategic Intent</span>
                          <span className="bg-[#141414] text-white text-[7px] font-bold px-1.5 py-0.2 tracking-wider font-sans">ECOS-2030</span>
                        </div>
                        <p className="text-[#141414]"><strong className="text-indigo-900 block font-bold text-[8.5px]">VISION URN: STRATEGY:VISION.ECOS-2030</strong> "{ECOS_STRATEGIC_VISION.definition}"</p>
                        <p className="text-[#141414]"><strong className="text-indigo-900 block font-bold text-[8.5px]">MISSION URN: STRATEGY:MISSION.TRUSTWORTHY-AI</strong> "{ECOS_STRATEGIC_MISSION.definition}"</p>
                      </div>

                      {/* Goal selection switcher & goal detail */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                        
                        {/* Goals List (col-span-5) */}
                        <div className="md:col-span-5 space-y-1.5">
                          <span className="text-[7.5px] font-mono uppercase opacity-60 block">Sovereign Strategic Goals</span>
                          <div className="space-y-1 max-h-[140px] overflow-y-auto pr-1 scrollbar-thin">
                            {ECOS_STRATEGIC_GOALS.map((goal) => (
                              <button
                                key={goal.id}
                                onClick={() => { playBeep('click'); setSelectedGoalId(goal.id); }}
                                className={`w-full text-left p-2 border font-mono text-[8.5px] transition-all flex flex-col justify-between gap-1 ${
                                  selectedGoalId === goal.id
                                    ? 'bg-[#141414] text-white border-[#141414]'
                                    : 'border-[#141414] bg-[#D1D0CC]/30 hover:bg-[#D1D0CC]/70'
                                }`}
                              >
                                <div className="flex justify-between w-full items-start gap-2">
                                  <span className="font-bold uppercase tracking-tight block truncate max-w-[80%]">{goal.canonicalName}</span>
                                  <span className={`text-[6.5px] font-bold px-1 uppercase shrink-0 ${
                                    goal.id === 'strategy:goal.governance-excellence' ? 'bg-rose-800 text-white' : 'bg-indigo-900 text-white'
                                  }`}>
                                    {goal.priority}
                                  </span>
                                </div>
                                <span className="text-[6.5px] opacity-65 truncate block">{goal.id}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Selected Goal Detail Panel (col-span-7) */}
                        <div className="md:col-span-7 bg-[#D1D0CC] border border-[#141414] p-3 flex flex-col justify-between min-h-[220px]">
                          {(() => {
                            const goal = ECOS_STRATEGIC_GOALS.find(g => g.id === selectedGoalId);
                            if (!goal) return <p className="text-[8px] opacity-60">Select a strategic goal to inspect alignment.</p>;
                            
                            const matchedProfile = ECOS_RISK_PROFILES.find(p => p.id === goal.riskProfileURN);
                            const goalLifecycle = strategicGoalsLifecycle["@graph"][0].activeGoals.find(g => g.goalURN === goal.id) || { currentState: 'PROPOSED', stateHistory: [] };

                            return (
                              <div className="space-y-3 font-mono text-[8px] flex-1 flex flex-col justify-between">
                                {/* Header / Selector tabs */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#141414]/20 pb-2">
                                  <div>
                                    <span className="text-[7px] opacity-60 uppercase block">Active Strategic Goal Node</span>
                                    <h4 className="text-[9.5px] font-bold uppercase text-indigo-950 truncate max-w-[280px]" title={goal.canonicalName}>{goal.canonicalName}</h4>
                                    <span className="text-[6.5px] opacity-75">{goal.id}</span>
                                  </div>
                                  
                                  {/* Sub-tab selection */}
                                  <div className="flex bg-[#E4E3E0] p-0.5 border border-[#141414]/20 gap-1 rounded-sm shrink-0">
                                    <button
                                      onClick={() => { playBeep('click'); setSelectedGoalDetailTab('alignment'); }}
                                      className={`px-1.5 py-0.5 text-[7px] font-bold uppercase transition-colors rounded-xs ${
                                        selectedGoalDetailTab === 'alignment'
                                          ? 'bg-[#141414] text-white'
                                          : 'hover:bg-[#141414]/10 text-[#141414]'
                                      }`}
                                    >
                                      Alignment
                                    </button>
                                    <button
                                      onClick={() => { playBeep('click'); setSelectedGoalDetailTab('lifecycle'); }}
                                      className={`px-1.5 py-0.5 text-[7px] font-bold uppercase transition-colors rounded-xs flex items-center gap-1 ${
                                        selectedGoalDetailTab === 'lifecycle'
                                          ? 'bg-[#141414] text-white'
                                          : 'hover:bg-[#141414]/10 text-[#141414]'
                                      }`}
                                    >
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                                      Lifecycle
                                    </button>
                                  </div>
                                </div>

                                {selectedGoalDetailTab === 'alignment' ? (
                                  <div className="space-y-2.5 animate-fade-in flex-1 flex flex-col justify-between">
                                    <p className="text-slate-800 leading-normal bg-white/40 p-2 border border-[#141414]/10 rounded-sm italic">
                                      "{goal.definition}"
                                    </p>

                                    <div className="grid grid-cols-2 gap-2 pt-1">
                                      <div>
                                        <span className="opacity-60 block uppercase text-[6.5px]">Target Completion</span>
                                        <span className="font-bold block text-slate-900">{goal.targetDate}</span>
                                      </div>
                                      <div>
                                        <span className="opacity-60 block uppercase text-[6.5px]">Governance Kernel</span>
                                        <span className="font-bold text-indigo-900 block truncate" title={goal.governanceKernelURN}>{goal.governanceKernelURN.split('/').pop()}</span>
                                      </div>
                                    </div>

                                    {/* Risk Profile Link */}
                                    {matchedProfile && (
                                      <div className="bg-[#E4E3E0] p-1.5 border border-[#141414]/10 rounded-sm space-y-1">
                                        <span className="font-bold uppercase tracking-tight block text-indigo-950 text-[7px]">Linked Risk Profile ({matchedProfile.canonicalName})</span>
                                        <p className="opacity-75 leading-tight text-[7.5px]">{matchedProfile.definition}</p>
                                        <div className="grid grid-cols-2 gap-1.5 border-t border-[#141414]/5 pt-1 text-[6.5px]">
                                          <span>Severe Harm Limit: <strong className="text-rose-800">{(matchedProfile.thresholds.severeHarmProbability * 100)}%</strong></span>
                                          <span>Mod Harm Limit: <strong className="text-amber-800">{(matchedProfile.thresholds.moderateHarmProbability * 100)}%</strong></span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="space-y-2.5 animate-fade-in flex-1 flex flex-col justify-between">
                                    {/* Current State Indicator & Interactive Transitions */}
                                    <div className="flex justify-between items-center bg-white/40 p-2 border border-[#141414]/10 rounded-sm">
                                      <div>
                                        <span className="text-[6.5px] opacity-60 uppercase block">Current Lifecycle State</span>
                                        <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-sm uppercase tracking-wider ${
                                          goalLifecycle.currentState === 'PROPOSED' ? 'bg-slate-600 text-white' :
                                          goalLifecycle.currentState === 'ACTIVE' ? 'bg-emerald-800 text-white' :
                                          goalLifecycle.currentState === 'REVISION_REQUIRED' ? 'bg-rose-800 text-white' :
                                          'bg-indigo-950 text-white'
                                        }`}>
                                          {goalLifecycle.currentState}
                                        </span>
                                      </div>

                                      {/* Reset button inside state block */}
                                      {goalLifecycle.currentState !== 'PROPOSED' && (
                                        <button
                                          onClick={() => handleResetGoalState(goal.id)}
                                          className="px-1.5 py-0.5 text-[7px] text-indigo-950 hover:underline uppercase font-bold"
                                        >
                                          [Reset to PROPOSED]
                                        </button>
                                      )}
                                    </div>

                                    {/* Transitions layout */}
                                    <div className="space-y-1.5">
                                      <span className="text-[7px] opacity-60 uppercase block">Available State Transitions</span>
                                      {(() => {
                                        const statesMap: Record<string, any> = strategicGoalsLifecycle["@graph"][0].states;
                                        const stateDef = statesMap[goalLifecycle.currentState];
                                        const allowedTransitions = stateDef?.allowedTransitions || [];

                                        if (allowedTransitions.length === 0) {
                                          return (
                                            <p className="text-[7.5px] italic text-slate-500 bg-white/40 p-1.5 border border-[#141414]/10 rounded-sm">
                                              Terminal state reached. No further state transitions are permitted by G0 Governance guidelines.
                                            </p>
                                          );
                                        }

                                        return (
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                            {allowedTransitions.map((t, idx) => {
                                              let eventLabel = "Approve Goal";
                                              let buttonStyle = "bg-[#141414] hover:bg-slate-800 text-white";
                                              if (t.triggerEventURN.includes("kpi_critical_failure")) {
                                                eventLabel = "KPI Critical Failure";
                                                buttonStyle = "bg-rose-800 hover:bg-rose-900 text-white";
                                              } else if (t.triggerEventURN.includes("goal_achieved")) {
                                                eventLabel = "Achieve & Archive";
                                                buttonStyle = "bg-emerald-800 hover:bg-emerald-900 text-white";
                                              } else if (t.triggerEventURN.includes("strategic_realignment")) {
                                                eventLabel = "Strategic Realignment";
                                                buttonStyle = "bg-indigo-900 hover:bg-indigo-950 text-white";
                                              }

                                              return (
                                                <button
                                                  key={idx}
                                                  onClick={() => handleStrategicGoalTransition(goal.id, t.triggerEventURN)}
                                                  className={`p-1.5 border border-[#141414] text-[8px] font-bold uppercase transition-all rounded-xs text-left ${buttonStyle}`}
                                                >
                                                  <div className="flex justify-between items-center mb-0.5">
                                                    <span className="truncate">{eventLabel}</span>
                                                    <span>➔ {t.targetState}</span>
                                                  </div>
                                                  <span className="text-[6px] opacity-75 block font-normal normal-case leading-tight truncate">Guard: {t.guardCondition}</span>
                                                </button>
                                              );
                                            })}
                                          </div>
                                        );
                                      })()}
                                    </div>

                                    {/* G0 Governance Live Event Simulation Ingress */}
                                    <div className="bg-[#E4E3E0] p-2 border border-[#141414]/20 rounded-sm space-y-1.5 animate-fade-in">
                                      <span className="text-[7.5px] font-extrabold text-indigo-950 uppercase tracking-tight block">Injected G0 Governance Live Event Stream</span>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                        <button
                                          onClick={() => handleInjectStrategicEvent('kpi_critical_failure')}
                                          className="p-1.5 bg-rose-50 border border-rose-950/40 hover:bg-rose-100 text-rose-950 text-left font-mono text-[7px] flex flex-col justify-between min-h-[56px] rounded-xs transition-colors cursor-pointer"
                                        >
                                          <div className="flex justify-between items-center w-full font-extrabold text-rose-900">
                                            <span>[KPI CRITICAL FAILURE]</span>
                                            <span className="text-[6px] opacity-60">event:kpi-critical-failure-001</span>
                                          </div>
                                          <p className="text-[6.5px] leading-snug text-slate-700 italic mt-0.5 line-clamp-2">
                                            Injects failure: Compliance falls to 42.5%, moving Goal GOVERNANCE-EXCELLENCE to REVISION_REQUIRED.
                                          </p>
                                        </button>
                                        
                                        <button
                                          onClick={() => handleInjectStrategicEvent('strategic_realignment')}
                                          className="p-1.5 bg-emerald-50 border border-emerald-950/40 hover:bg-emerald-100 text-emerald-950 text-left font-mono text-[7px] flex flex-col justify-between min-h-[56px] rounded-xs transition-colors cursor-pointer"
                                        >
                                          <div className="flex justify-between items-center w-full font-extrabold text-emerald-900">
                                            <span>[STRATEGIC REALIGNMENT]</span>
                                            <span className="text-[6px] opacity-60">event:strategic-realignment-001</span>
                                          </div>
                                          <p className="text-[6.5px] leading-snug text-slate-700 italic mt-0.5 line-clamp-2">
                                            Injects recovery: Compliance score restored to 98.45% following PASS audit. Goal returns to ACTIVE.
                                          </p>
                                        </button>
                                      </div>
                                    </div>

                                    {/* Timeline / History */}
                                    <div className="space-y-1.5 border-t border-[#141414]/15 pt-2">
                                      <span className="text-[7px] opacity-60 uppercase block">State History Ledger ({goalLifecycle.stateHistory.length} logs)</span>
                                      <div className="space-y-1 max-h-[80px] overflow-y-auto pr-1 scrollbar-thin">
                                        {goalLifecycle.stateHistory.length === 0 ? (
                                          <p className="text-[7px] italic text-slate-500">Proposed. Pending initial board review and approval.</p>
                                        ) : (
                                          goalLifecycle.stateHistory.map((hist: any, hIdx: number) => (
                                            <div key={hIdx} className="p-1.5 bg-white/40 border border-[#141414]/5 rounded-xs space-y-0.5 text-[7px]">
                                              <div className="flex justify-between font-bold text-indigo-950">
                                                <span>{hist.from} ➔ {hist.to}</span>
                                                <span>{hist.triggerEvent.split('.').pop()}</span>
                                              </div>
                                              <p className="text-[6.5px] text-slate-600 font-semibold">{hist.guardResult}</p>
                                              <span className="text-[6px] text-slate-400 block mt-0.5">{new Date(hist.timestamp).toLocaleDateString()} {hist.timestamp.split('T')[1].substring(0, 8)} UTC</span>
                                            </div>
                                          ))
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })()}
                        </div>

                      </div>

                      {/* Real-time KPI Gauges Grid & Simulators */}
                      <div className="space-y-1.5">
                        <span className="text-[7.5px] font-mono uppercase opacity-60 block">Continuous Strategy Progress Indicators (KPI Gauges)</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2">
                          {strategicKPIs.map((kpi) => {
                            const isDecreasing = kpi.trend === 'DECREASING';
                            const isIncreasing = kpi.trend === 'INCREASING';
                            const isImproving = kpi.trend === 'IMPROVING';
                            
                            // Color scheme of trends
                            let trendColor = 'text-slate-500 bg-slate-100';
                            let trendLabel = '➔ STABLE';
                            if (isDecreasing) {
                              trendColor = 'text-rose-700 bg-rose-50';
                              trendLabel = '▼ DECREASING';
                            } else if (isIncreasing) {
                              trendColor = 'text-emerald-700 bg-emerald-50';
                              trendLabel = '▲ INCREASING';
                            } else if (isImproving) {
                              trendColor = 'text-emerald-700 bg-emerald-50';
                              trendLabel = '▲ IMPROVING';
                            }

                            return (
                              <div key={kpi.id} className="border border-[#141414] bg-[#D1D0CC]/30 hover:bg-[#D1D0CC]/60 p-2 flex flex-col justify-between font-mono text-[8px] space-y-2 min-h-[160px]">
                                <div className="space-y-1">
                                  <div className="flex justify-between items-start">
                                    <span className="font-bold text-indigo-950 leading-tight block truncate uppercase max-w-[85%]" title={kpi.canonicalName}>
                                      {kpi.canonicalName.replace("Real-time ", "").replace("Constitutional ", "")}
                                    </span>
                                    <span className="text-[6px] opacity-40">KPI</span>
                                  </div>
                                  <p className="opacity-70 text-[7px] leading-tight line-clamp-2">{kpi.definition}</p>
                                </div>

                                <div className="pt-1.5 border-t border-[#141414]/10 space-y-1.5">
                                  <div className="flex justify-between items-end">
                                    <span className="text-[11px] font-extrabold text-[#141414] tracking-tight">
                                      {kpi.currentValue}
                                      <span className="text-[7px] font-normal opacity-70 ml-0.5">{kpi.metricDefinition.unit}</span>
                                    </span>
                                    <span className={`px-1 py-0.2 text-[6.5px] font-bold ${trendColor}`}>
                                      {trendLabel}
                                    </span>
                                  </div>

                                  {/* Progress Visual Bar */}
                                  <div className="w-full h-1 bg-[#E4E3E0] relative border border-[#141414]/5 rounded-xs overflow-hidden">
                                    <div 
                                      className={`h-full ${
                                        kpi.id.includes('compliance') ? 'bg-emerald-600' :
                                        kpi.id.includes('latency') ? 'bg-indigo-600' :
                                        kpi.id.includes('manipulation') ? 'bg-amber-600' : 'bg-slate-700'
                                      }`}
                                      style={{
                                        width: `${
                                          kpi.id.includes('compliance') ? kpi.currentValue :
                                          kpi.id.includes('latency') ? Math.min(100, (kpi.currentValue / 20) * 100) :
                                          kpi.id.includes('mttd') ? Math.min(100, (kpi.currentValue / 30) * 100) :
                                          kpi.id.includes('manipulation') ? Math.min(100, (kpi.currentValue / 0.1) * 100) :
                                          Math.min(100, (kpi.currentValue / 2500) * 100)
                                        }%`
                                      }}
                                    />
                                  </div>

                                  <div className="flex justify-between text-[6px] opacity-50 pt-0.5">
                                    <span>Freq: {kpi.metricDefinition.frequency}</span>
                                    <span className="truncate max-w-[50%]" title={kpi.targetGoalURN}>Target: {kpi.targetGoalURN.split('.').pop()}</span>
                                  </div>
                                </div>

                                <button
                                  onClick={() => handleSimulateKPIShift(kpi.id)}
                                  className="w-full text-center py-1 bg-[#141414] text-white hover:bg-slate-800 transition-colors uppercase font-bold text-[7px]"
                                >
                                  ➔ Shift Parameter
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Strategic Proposals & Decisions Ledger */}
                      <div className="border border-[#141414] bg-[#D1D0CC]/60 p-3 space-y-3 rounded-sm animate-fade-in text-[#141414] font-mono">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#141414]/25 pb-2">
                          <div>
                            <span className="text-[7px] opacity-60 uppercase block">Governance Decision Registry</span>
                            <span className="text-[9.5px] font-extrabold uppercase text-indigo-950 flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                              Strategic Proposals & Decisions Ledger
                            </span>
                          </div>

                          {/* Node selection tabs */}
                          <div className="flex bg-[#E4E3E0] p-0.5 border border-[#141414]/20 gap-1 rounded-sm shrink-0">
                            <button
                              onClick={() => { playBeep('click'); setSelectedDecisionLedgerTab('proposal'); }}
                              className={`px-1.5 py-0.5 text-[7px] font-bold uppercase transition-colors rounded-xs ${
                                selectedDecisionLedgerTab === 'proposal'
                                  ? 'bg-[#141414] text-white'
                                  : 'hover:bg-[#141414]/10 text-[#141414]'
                              }`}
                            >
                              {activeDecisionId === 'decision:dec.001' ? 'Identified Risk' : 'Proposal'}
                            </button>
                            <button
                              onClick={() => { playBeep('click'); setSelectedDecisionLedgerTab('decision'); }}
                              className={`px-1.5 py-0.5 text-[7px] font-bold uppercase transition-colors rounded-xs ${
                                selectedDecisionLedgerTab === 'decision'
                                  ? 'bg-[#141414] text-white'
                                  : 'hover:bg-[#141414]/10 text-[#141414]'
                              }`}
                            >
                              Decision URN
                            </button>
                            <button
                              onClick={() => { playBeep('click'); setSelectedDecisionLedgerTab('snapshot'); }}
                              className={`px-1.5 py-0.5 text-[7px] font-bold uppercase transition-colors rounded-xs ${
                                selectedDecisionLedgerTab === 'snapshot'
                                  ? 'bg-[#141414] text-white'
                                  : 'hover:bg-[#141414]/10 text-[#141414]'
                              }`}
                            >
                              {activeDecisionId === 'decision:zero-trust-deployment-2026-07-16' 
                                ? 'Audit Snapshot' 
                                : activeDecisionId === 'decision:dec-001' 
                                  ? 'Evidence Pack' 
                                  : 'Query Verification'}
                            </button>
                            <button
                              onClick={() => { playBeep('click'); setSelectedDecisionLedgerTab('statechart'); }}
                              className={`px-1.5 py-0.5 text-[7px] font-bold uppercase transition-colors rounded-xs ${
                                selectedDecisionLedgerTab === 'statechart'
                                  ? 'bg-[#141414] text-white'
                                  : 'hover:bg-[#141414]/10 text-[#141414]'
                              }`}
                            >
                              State Machine
                            </button>
                          </div>
                        </div>

                        {/* Selector for Active Decision */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#E4E3E0]/60 p-2 border border-[#141414]/15 rounded-sm">
                          <span className="text-[7.5px] font-extrabold text-indigo-950 uppercase tracking-wider shrink-0 flex items-center gap-1">
                            <Sliders className="w-3 h-3 text-indigo-900" />
                            Select Strategic Decision:
                          </span>
                          <div className="flex flex-wrap gap-1.5 flex-1 max-w-2xl">
                            <button
                              onClick={() => handleSwitchDecision('decision:zero-trust-deployment-2026-07-16')}
                              className={`flex-1 min-w-[140px] text-center py-1 text-[7px] font-bold uppercase transition-all rounded-xs border ${
                                activeDecisionId === 'decision:zero-trust-deployment-2026-07-16'
                                  ? 'bg-indigo-900 text-white border-indigo-950 shadow-xs'
                                  : 'bg-white hover:bg-slate-50 text-slate-700 border-[#141414]/15'
                              }`}
                            >
                              Zero Trust (2026-07-16)
                            </button>
                            <button
                              onClick={() => handleSwitchDecision('decision:dec-001')}
                              className={`flex-1 min-w-[140px] text-center py-1 text-[7px] font-bold uppercase transition-all rounded-xs border ${
                                activeDecisionId === 'decision:dec-001'
                                  ? 'bg-indigo-900 text-white border-indigo-950 shadow-xs'
                                  : 'bg-white hover:bg-slate-50 text-slate-700 border-[#141414]/15'
                              }`}
                            >
                              Healthcare Pilot (2026-07-17)
                            </button>
                            <button
                              onClick={() => handleSwitchDecision('decision:dec.001')}
                              className={`flex-1 min-w-[140px] text-center py-1 text-[7px] font-bold uppercase transition-all rounded-xs border ${
                                activeDecisionId === 'decision:dec.001'
                                  ? 'bg-indigo-900 text-white border-indigo-950 shadow-xs'
                                  : 'bg-white hover:bg-slate-50 text-slate-700 border-[#141414]/15'
                              }`}
                            >
                              Risk-Audited Rollout (2026-07-17)
                            </button>
                          </div>
                        </div>

                        {/* Dynamic node logic */}
                        {(() => {
                          const isZeroTrust = activeDecisionId === 'decision:zero-trust-deployment-2026-07-16';
                          const isMarketExpansion = activeDecisionId === 'decision:dec-001';
                          
                          const graph = isZeroTrust 
                            ? ECOS_ZERO_TRUST_DECISION_GRAPH 
                            : isMarketExpansion 
                              ? ECOS_MARKET_EXPANSION_DECISION_GRAPH 
                              : ECOS_RISK_AUDIT_DECISION_GRAPH;
                              
                          const proposal = graph["@graph"][0];
                          const decision = graph["@graph"][1];
                          const thirdNode = graph["@graph"][2];

                          return (
                            <>
                              {/* TAB 1: PROPOSAL OR RISK IDENTIFICATION */}
                              {selectedDecisionLedgerTab === 'proposal' && (
                                activeDecisionId === 'decision:dec.001' ? (
                                  <div className="space-y-3 text-[8px] animate-fade-in">
                                    <div className="flex justify-between items-start gap-3 bg-rose-50 p-2 border border-rose-900/15 rounded-sm">
                                      <div>
                                        <span className="text-[6px] opacity-60 block uppercase text-rose-900 font-extrabold">URN Identifier</span>
                                        <span className="font-bold text-rose-950 text-[8.5px]">{proposal["@id"]}</span>
                                      </div>
                                      <span className="px-1.5 py-0.5 text-[6.5px] bg-rose-800 text-white font-extrabold uppercase rounded-xs">{proposal["@type"]}</span>
                                    </div>

                                    <div className="bg-white/30 p-2 border border-[#141414]/5 rounded-xs space-y-1.5">
                                      <span className="text-[7px] uppercase font-extrabold text-slate-800 tracking-wider">Risk Description & Definition:</span>
                                      <p className="leading-relaxed text-[8.5px] text-slate-900 italic font-medium">
                                        "{proposal.definition}"
                                      </p>
                                    </div>

                                    {/* Risk Characteristic Grid */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[7.5px] font-mono">
                                      <div className="bg-rose-50/50 p-2 border border-rose-950/10 rounded-xs">
                                        <span className="opacity-55 block uppercase text-[5.5px]">Severity Status</span>
                                        <span className="font-extrabold text-rose-800 uppercase">{(proposal as any).severity}</span>
                                      </div>
                                      <div className="bg-white/50 p-2 border border-[#141414]/10 rounded-xs">
                                        <span className="opacity-55 block uppercase text-[5.5px]">Probability</span>
                                        <span className="font-bold text-slate-800">{(proposal as any).probability}</span>
                                      </div>
                                      <div className="bg-white/50 p-2 border border-[#141414]/10 rounded-xs">
                                        <span className="opacity-55 block uppercase text-[5.5px]">Residual Risk Score</span>
                                        <div className="flex items-center gap-1.5 mt-0.5">
                                          <div className="w-12 bg-slate-200 h-1 rounded-full overflow-hidden">
                                            <div className="bg-emerald-600 h-1" style={{ width: `${((proposal as any).residualRiskScore * 100)}%` }}></div>
                                          </div>
                                          <span className="font-extrabold text-slate-900">{(proposal as any).residualRiskScore}</span>
                                        </div>
                                      </div>
                                      <div className="bg-emerald-50/50 p-2 border border-emerald-950/10 rounded-xs">
                                        <span className="opacity-55 block uppercase text-[5.5px]">Mitigation Status</span>
                                        <span className="font-extrabold text-emerald-800">{(proposal as any).complianceStatus}</span>
                                      </div>
                                    </div>

                                    <div className="bg-[#E4E3E0]/40 p-2 border border-[#141414]/10 rounded-sm text-[7px] grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      <div>
                                        <span className="opacity-55 block uppercase text-[6px]">Mitigated By Control</span>
                                        <span className="font-bold text-indigo-950 font-mono">{(proposal as any).mitigatedByControlURN}</span>
                                      </div>
                                      <div>
                                        <span className="opacity-55 block uppercase text-[6px]">Governance Kernel</span>
                                        <span className="font-bold text-slate-900 font-mono">{(proposal as any).governanceKernelURN}</span>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-2 text-[8px] animate-fade-in">
                                    <div className="flex justify-between items-start gap-3 bg-white/45 p-2 border border-[#141414]/10 rounded-sm">
                                      <div>
                                        <span className="text-[6px] opacity-50 block uppercase">URN Identifier</span>
                                        <span className="font-bold text-indigo-950 text-[8.5px]">{proposal["@id"]}</span>
                                      </div>
                                      <span className="px-1 text-[6.5px] bg-indigo-950 text-white font-bold uppercase rounded-xs">{proposal["@type"]}</span>
                                    </div>

                                    <p className="leading-relaxed bg-white/30 p-2 border border-[#141414]/5 rounded-xs italic text-[8.5px] text-slate-800">
                                      "{proposal.definition}"
                                    </p>

                                    <div className="grid grid-cols-2 gap-3 bg-[#E4E3E0]/40 p-2 border border-[#141414]/10 rounded-sm text-[7px]">
                                      <div>
                                        <span className="opacity-55 block uppercase text-[6px]">Author Authority</span>
                                        <span className="font-bold text-slate-900 font-mono">{(proposal as any).authorURN}</span>
                                      </div>
                                      <div>
                                        <span className="opacity-55 block uppercase text-[6px]">Proposed Timestamp</span>
                                        <span className="font-bold text-slate-900 font-mono">{(proposal as any).proposedDate}</span>
                                      </div>
                                    </div>
                                  </div>
                                )
                              )}

                              {/* TAB 2: DECISION */}
                              {selectedDecisionLedgerTab === 'decision' && (
                                <div className="space-y-3.5 text-[8px] animate-fade-in">
                                  <div className="flex justify-between items-start gap-3 bg-white/45 p-2 border border-[#141414]/10 rounded-sm">
                                    <div>
                                      <span className="text-[6px] opacity-50 block uppercase">URN Identifier</span>
                                      <span className="font-bold text-indigo-950 text-[8.5px]">{decision["@id"]}</span>
                                    </div>
                                    <div className="flex gap-1">
                                      <span className="px-1 text-[6.5px] bg-emerald-800 text-white font-bold uppercase rounded-xs">
                                        {isZeroTrust ? decisionCurrentState : (decision as any).executionStatus}
                                      </span>
                                      <span className="px-1 text-[6.5px] bg-indigo-950 text-white font-bold uppercase rounded-xs">{decision["@type"]}</span>
                                    </div>
                                  </div>

                                  <div className="space-y-1 bg-white/30 p-2 border border-[#141414]/5 rounded-xs">
                                    <span className="font-extrabold text-indigo-950 text-[7px] uppercase tracking-wide">Strategic Rationale & Intent:</span>
                                    <p className="leading-relaxed text-[8.5px] text-slate-800 italic">
                                      "{(decision as any).decisionLogic.rationale}"
                                    </p>
                                  </div>

                                  {/* Cryptographic Signatures */}
                                  <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                      <span className="font-extrabold text-indigo-950 text-[7.5px] uppercase">Constitutional Approval Chain ({(decision as any).approvalChain.length}/{(decision as any).approvalChain.length} signed)</span>
                                      <button
                                        onClick={() => {
                                          playBeep('success');
                                          setSignaturesVerified(signaturesVerified ? null : true);
                                        }}
                                        className={`px-1.5 py-0.5 font-bold uppercase text-[6.5px] border border-[#141414] transition-all rounded-xs ${
                                          signaturesVerified 
                                            ? 'bg-emerald-800 text-white border-emerald-900' 
                                            : 'bg-[#141414] text-white hover:bg-slate-800'
                                        }`}
                                      >
                                        {signaturesVerified ? '✓ Signatures Verified' : '➔ Verify Signatures'}
                                      </button>
                                    </div>

                                    {signaturesVerified && (
                                      <div className="bg-emerald-50 border border-emerald-800/20 text-emerald-950 p-2 rounded-xs flex items-center gap-2 text-[7px] font-semibold animate-fade-in">
                                        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                                        <div>
                                          <p className="font-bold uppercase text-emerald-850">Cryptographic Attestation Secure</p>
                                          <p className="opacity-85 leading-normal">
                                            {isZeroTrust 
                                              ? '3 independent Ed25519 signatures verified against governance public keys. Proof chain validated intact.'
                                              : (decision as any).approvalChain.length === 2
                                                ? '2 independent Ed25519 signatures verified. Strategic and financial authority public keys successfully validated.'
                                                : '1 authority Ed25519 signature verified against Governance Council Chair credentials.'}
                                          </p>
                                        </div>
                                      </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                      {(decision as any).approvalChain.map((app: any, appIdx: number) => (
                                        <div key={appIdx} className="bg-[#E4E3E0]/40 p-2 border border-[#141414]/10 rounded-sm space-y-1 font-mono text-[7px]">
                                          <div className="flex justify-between font-bold text-slate-900 border-b border-[#141414]/10 pb-0.5">
                                            <span className="truncate" title={app.approverURN}>{app.approverURN.split(':').pop()}</span>
                                            <span className="text-emerald-700">✓ SIGNED</span>
                                          </div>
                                          <p className="text-[6.5px] text-slate-500 font-semibold">{new Date(app.timestamp).toLocaleDateString()} {app.timestamp.split('T')[1].substring(0, 5)} UTC</p>
                                          <div className="pt-1">
                                            <span className="text-[5.5px] opacity-45 block">Ed25519 Cryptographic Proof:</span>
                                            <span className="text-[5.5px] font-bold text-slate-700 font-mono break-all">{app.signature}</span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Mitigated Risks link if dec.001 */}
                                  {(decision as any).mitigatedRiskURNs && (
                                    <div className="bg-emerald-50/50 p-2 border border-emerald-900/10 rounded-xs flex items-center justify-between text-[7.5px]">
                                      <span className="font-extrabold text-emerald-950 uppercase tracking-wide">Mitigated Risks Linkage:</span>
                                      <span className="font-mono font-bold bg-white px-1.5 py-0.5 border border-emerald-900/15 rounded-xs text-emerald-800">
                                        {(decision as any).mitigatedRiskURNs.join(', ')}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* TAB 3: SNAPSHOT OR EVIDENCE OR AUDIT VERIFICATION */}
                              {selectedDecisionLedgerTab === 'snapshot' && (
                                isZeroTrust ? (
                                  <div className="space-y-3.5 text-[8px] animate-fade-in">
                                    <div className="flex justify-between items-start gap-3 bg-white/45 p-2 border border-[#141414]/10 rounded-sm">
                                      <div>
                                        <span className="text-[6px] opacity-50 block uppercase">URN Identifier</span>
                                        <span className="font-bold text-indigo-950 text-[8.5px]">audit:context-snapshot-2026-07-16T20:15:00Z</span>
                                      </div>
                                      <span className="px-1 text-[6.5px] bg-slate-700 text-white font-bold uppercase rounded-xs">ContextSnapshot</span>
                                    </div>

                                    <p className="leading-relaxed bg-white/30 p-2 border border-[#141414]/5 rounded-xs text-slate-800 text-[8px]">
                                      "{thirdNode.definition}"
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                                      <div className="bg-rose-50/70 p-2 border border-rose-950/15 rounded-sm space-y-0.5 text-center">
                                        <span className="text-[5.5px] opacity-55 block uppercase text-rose-900 font-extrabold">Active Threats</span>
                                        <span className="text-[12px] font-extrabold text-rose-800 font-mono">
                                          {(thirdNode as any).snapshotData.activeThreats}
                                        </span>
                                      </div>
                                      
                                      <div className="bg-amber-50/70 p-2 border border-amber-950/15 rounded-sm space-y-0.5 text-center col-span-2">
                                        <span className="text-[5.5px] opacity-55 block uppercase text-amber-900 font-extrabold">Last Compliance Violation</span>
                                        <span className="text-[7.5px] font-bold text-slate-800 block truncate font-mono">
                                          {(thirdNode as any).snapshotData.lastViolation}
                                        </span>
                                      </div>

                                      <div className="bg-slate-100 p-2 border border-[#141414]/10 rounded-sm space-y-0.5 text-center">
                                        <span className="text-[5.5px] opacity-55 block uppercase text-slate-700 font-extrabold">Governance CPU Load</span>
                                        <span className="text-[12px] font-extrabold text-indigo-900 font-mono">
                                          {((thirdNode as any).snapshotData.systemLoad * 100).toFixed(0)}%
                                        </span>
                                      </div>
                                    </div>

                                    <div className="space-y-1.5">
                                      <span className="font-extrabold text-indigo-950 text-[7.5px] uppercase">Policy State Vectors Captured at Decision Instantiation:</span>
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                        {Object.entries((thirdNode as any).snapshotData.policyStates).map(([pol, state]) => (
                                          <div key={pol} className="bg-white/40 p-1.5 border border-[#141414]/10 rounded-sm flex justify-between items-center font-mono text-[7px]">
                                            <span className="font-bold text-indigo-900 truncate max-w-[70%]" title={pol}>{pol.split('.').pop()}</span>
                                            <span className="px-1 text-[6px] font-extrabold bg-emerald-800 text-white rounded-xs">{state as string}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                ) : isMarketExpansion ? (
                                  <div className="space-y-3.5 text-[8px] animate-fade-in">
                                    <div className="flex justify-between items-start gap-3 bg-white/45 p-2 border border-[#141414]/10 rounded-sm">
                                      <div>
                                        <span className="text-[6px] opacity-50 block uppercase">URN Identifier</span>
                                        <span className="font-bold text-indigo-950 text-[8.5px]">{thirdNode["@id"]}</span>
                                      </div>
                                      <span className="px-1 text-[6.5px] bg-indigo-950 text-white font-bold uppercase rounded-xs">{thirdNode["@type"]}</span>
                                    </div>

                                    <p className="leading-relaxed bg-white/30 p-2 border border-[#141414]/5 rounded-xs text-slate-800 text-[8px] italic">
                                      "{thirdNode.definition}"
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                      <div className="bg-white/40 p-2 border border-[#141414]/10 rounded-sm space-y-1 font-mono text-[7px]">
                                        <span className="font-bold text-indigo-950 block uppercase text-[6px] border-b border-[#141414]/5 pb-0.5">Pilot Readiness</span>
                                        <p className="text-slate-800 break-all font-bold">{(thirdNode as any).evidencePayload.pilotReadinessReport}</p>
                                        <span className="text-[6px] text-emerald-800 font-extrabold block">✓ READY</span>
                                      </div>

                                      <div className="bg-white/40 p-2 border border-[#141414]/10 rounded-sm space-y-1 font-mono text-[7px]">
                                        <span className="font-bold text-indigo-950 block uppercase text-[6px] border-b border-[#141414]/5 pb-0.5">AI Fairness Audit</span>
                                        <p className="text-slate-850">Model: <strong>{(thirdNode as any).evidencePayload.fairnessAudit.model}</strong></p>
                                        <div className="flex justify-between text-[6.5px] pt-0.5 items-center">
                                          <span>Bias: <strong className="text-emerald-700">{(thirdNode as any).evidencePayload.fairnessAudit.biasScore}</strong></span>
                                          <span className="px-1 bg-emerald-800 text-white font-extrabold rounded-xs uppercase text-[5.5px]">{(thirdNode as any).evidencePayload.fairnessAudit.result}</span>
                                        </div>
                                      </div>

                                      <div className="bg-white/40 p-2 border border-[#141414]/10 rounded-sm space-y-1 font-mono text-[7px]">
                                        <span className="font-bold text-indigo-950 block uppercase text-[6px] border-b border-[#141414]/5 pb-0.5">Compliance State</span>
                                        <p className="text-slate-800">{(thirdNode as any).evidencePayload.complianceChecklist.replace(/_/g, ' ')}</p>
                                        <span className="text-[6px] text-emerald-800 font-extrabold block">✓ 100% PASS</span>
                                      </div>
                                    </div>

                                    {/* Cryptographic Attestation */}
                                    <div className="bg-slate-100 p-2 border border-[#141414]/10 rounded-sm space-y-1 font-mono text-[7px]">
                                      <span className="font-extrabold text-indigo-950 block uppercase text-[6.5px]">Cryptographic Proof Package</span>
                                      <div className="grid grid-cols-2 gap-2 text-[6.5px] text-slate-700">
                                        <div>
                                          <span className="opacity-60 block text-[5.5px]">Signature Algorithm:</span>
                                          <span className="font-bold">{(thirdNode as any).cryptographicProof.algorithm}</span>
                                        </div>
                                        <div>
                                          <span className="opacity-60 block text-[5.5px]">Attestation Key URN:</span>
                                          <span className="font-bold truncate block" title={(thirdNode as any).cryptographicProof.attestationKeys[0]}>{(thirdNode as any).cryptographicProof.attestationKeys[0]}</span>
                                        </div>
                                      </div>
                                      <div className="pt-1.5 border-t border-[#141414]/5 text-[6px]">
                                        <span className="opacity-60 block">Cryptographic Signature Proof:</span>
                                        <span className="font-mono font-bold text-indigo-900 break-all">{(thirdNode as any).cryptographicProof.signature}</span>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  // dec.001 - Graph Authorization Query Verification view
                                  <div className="space-y-3.5 text-[8px] animate-fade-in">
                                    <div className="flex justify-between items-start gap-3 bg-slate-900 text-slate-100 p-2 border border-[#141414]/30 rounded-sm">
                                      <div>
                                        <span className="text-[6px] opacity-60 block uppercase text-slate-400">URN Identifier</span>
                                        <span className="font-bold text-emerald-400 text-[8.5px]">{thirdNode["@id"]}</span>
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <span className="px-1.5 py-0.5 text-[6.5px] bg-emerald-600 text-white font-extrabold uppercase rounded-xs">AUTHORIZED (PASS)</span>
                                        <span className="px-1 text-[6.5px] bg-slate-700 text-slate-300 font-bold uppercase rounded-xs">QueryRecord</span>
                                      </div>
                                    </div>

                                    <div className="bg-slate-950 text-slate-200 p-2.5 rounded-sm border border-slate-800 font-mono space-y-1.5">
                                      <div className="flex justify-between text-[6.5px] text-slate-400 border-b border-slate-800 pb-1">
                                        <span>⚙ CYPHIER GRAPH GRAPH_MATCH RUNNER</span>
                                        <span>EXEC: {(thirdNode as any).executedAt}</span>
                                      </div>
                                      <div className="text-[7.5px] text-emerald-300 font-medium leading-relaxed bg-black/40 p-2 rounded-xs border border-slate-900 overflow-x-auto whitespace-pre-wrap">
                                        {(thirdNode as any).queryExecuted}
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                      <div className="bg-white/45 p-2 border border-[#141414]/15 rounded-sm space-y-1.5">
                                        <span className="font-extrabold text-indigo-950 uppercase text-[6px] block border-b border-[#141414]/10 pb-0.5">Aligned Goals</span>
                                        <div className="space-y-1">
                                          {(thirdNode as any).result.alignedGoals.map((g: string) => (
                                            <span key={g} className="block font-mono text-[6.5px] font-bold text-slate-800">{g}</span>
                                          ))}
                                        </div>
                                      </div>

                                      <div className="bg-white/45 p-2 border border-[#141414]/15 rounded-sm space-y-1.5">
                                        <span className="font-extrabold text-indigo-950 uppercase text-[6px] block border-b border-[#141414]/10 pb-0.5">Compliant Policies</span>
                                        <div className="space-y-1">
                                          {(thirdNode as any).result.compliantPolicies.map((p: string) => (
                                            <span key={p} className="block font-mono text-[6.5px] font-bold text-slate-800">✓ {p.split('.').pop()}</span>
                                          ))}
                                        </div>
                                      </div>

                                      <div className="bg-emerald-50/75 p-2 border border-emerald-950/15 rounded-sm space-y-1">
                                        <span className="font-extrabold text-emerald-950 uppercase text-[6px] block border-b border-emerald-900/10 pb-0.5">Validated Risks</span>
                                        {(thirdNode as any).result.validatedRisks.map((vr: any, vrIdx: number) => (
                                          <div key={vrIdx} className="space-y-0.5 font-mono text-[6.5px]">
                                            <p className="font-bold text-emerald-950 leading-tight">{vr.risk.split(':').pop()}</p>
                                            <div className="flex justify-between text-[6px] opacity-80 pt-0.5">
                                              <span>Residual Score: <strong>{vr.residualRiskScore}</strong></span>
                                              <span className="text-emerald-800 font-extrabold">PASS (&lt; 0.5)</span>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Cryptographic Attestation signature */}
                                    <div className="bg-[#E4E3E0]/40 p-2 border border-[#141414]/10 rounded-sm text-[7px] flex justify-between items-center">
                                      <div>
                                        <span className="opacity-55 block uppercase text-[5.5px]">Cypher Log Signed By</span>
                                        <span className="font-extrabold text-slate-900 font-mono">{(thirdNode as any).signedBy}</span>
                                      </div>
                                      <span className="px-1.5 py-0.5 text-[6px] bg-emerald-800 text-white font-extrabold font-mono rounded-xs">✓ SEALED SYSTEM</span>
                                    </div>
                                  </div>
                                )
                              )}
                            </>
                          );
                        })()}

                        {/* TAB 4: STATE MACHINE SIMULATOR */}
                        {selectedDecisionLedgerTab === 'statechart' && (
                          <div className="space-y-3 text-[8px] animate-fade-in">
                            <div className="flex justify-between items-start gap-3 bg-white/45 p-2 border border-[#141414]/10 rounded-sm">
                              <div>
                                <span className="text-[6px] opacity-50 block uppercase">Authoritative State Chart</span>
                                <span className="font-bold text-indigo-950 text-[8.5px]">lifecycle:decision-state-machine</span>
                              </div>
                              <span className="px-1 text-[6.5px] bg-amber-800 text-white font-bold uppercase rounded-xs">CIM_StateChart</span>
                            </div>

                            <p className="text-[8px] text-slate-700 leading-normal bg-white/20 p-2 border border-[#141414]/5 rounded-xs italic">
                              "Authoritative state transition engine for all CIM_Decision entities, ensuring every decision passes through governance checks, approval quorum, and validated execution."
                            </p>

                            {/* State Flow Visualization */}
                            <div className="bg-[#E4E3E0]/30 p-2.5 border border-[#141414]/10 rounded-sm space-y-2">
                              <div className="text-[7.5px] font-extrabold text-indigo-950 uppercase tracking-wider flex items-center justify-between">
                                <span>Lifecycle Topology Map</span>
                                <span className="text-[6.5px] text-slate-500 font-mono lowercase">Active: {decisionCurrentState}</span>
                              </div>

                              {/* Simple visual node list */}
                              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1.5 pt-1">
                                {[
                                  { id: 'PROPOSAL_SUBMITTED', label: '1. Submitted', color: 'border-slate-400 bg-slate-50 text-slate-600' },
                                  { id: 'PENDING_APPROVAL', label: '2. Pending App', color: 'border-amber-400 bg-amber-50 text-amber-700' },
                                  { id: 'APPROVED', label: '3. Approved', color: 'border-blue-400 bg-blue-50 text-blue-700' },
                                  { id: 'EXECUTING', label: '4. Executing', color: 'border-emerald-500 bg-emerald-50 text-emerald-800' },
                                  { id: 'COMPLETED', label: '5. Completed', color: 'border-indigo-600 bg-indigo-50 text-indigo-800' },
                                  { id: 'ROLLED_BACK', label: '6. Rolled Back', color: 'border-rose-500 bg-rose-50 text-rose-800' },
                                  { id: 'REJECTED', label: 'X. Rejected', color: 'border-red-600 bg-red-50 text-red-800' }
                                ].map((stateNode) => {
                                  const isActive = decisionCurrentState === stateNode.id;
                                  return (
                                    <div 
                                      key={stateNode.id} 
                                      className={`p-1 border text-center rounded-xs transition-all duration-300 flex flex-col justify-center min-h-[36px] relative ${
                                        isActive 
                                          ? 'border-[#141414] bg-[#141414] text-white shadow-xs scale-102 font-extrabold z-10' 
                                          : `opacity-65 hover:opacity-100 ${stateNode.color} font-medium`
                                      }`}
                                    >
                                      {isActive && (
                                        <span className="absolute -top-1 -right-1 flex h-2 w-2">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                        </span>
                                      )}
                                      <span className="text-[5.5px] opacity-50 block leading-tight font-mono uppercase">{stateNode.id === decisionCurrentState ? 'ACTIVE' : 'STATE'}</span>
                                      <span className="text-[7.5px] truncate">{stateNode.label}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Interactive Simulation Controls */}
                            <div className="bg-white/45 p-2.5 border border-[#141414]/10 rounded-sm space-y-2">
                              <span className="font-extrabold text-indigo-950 text-[7px] uppercase tracking-wider block">Interactive State Simulator</span>
                              
                              <div className="flex flex-wrap gap-2">
                                {decisionCurrentState === 'PROPOSAL_SUBMITTED' && (
                                  <button
                                    onClick={() => {
                                      playBeep('success');
                                      setDecisionCurrentState('PENDING_APPROVAL');
                                      setDecisionStateHistory(prev => [
                                        ...prev,
                                        {
                                          from: 'PROPOSAL_SUBMITTED',
                                          to: 'PENDING_APPROVAL',
                                          timestamp: new Date().toISOString(),
                                          triggerEvent: 'sem:event.governance_check_passed',
                                          guardResult: 'PASS (policy.verifyAll() -> COMPLIANT)'
                                        }
                                      ]);
                                    }}
                                    className="px-2 py-1 bg-amber-700 hover:bg-amber-800 text-white font-bold uppercase rounded-xs transition-colors"
                                  >
                                    ➔ Trigger sem:event.governance_check_passed
                                  </button>
                                )}

                                {decisionCurrentState === 'PENDING_APPROVAL' && (
                                  <>
                                    <button
                                      onClick={() => {
                                        playBeep('success');
                                        setDecisionCurrentState('APPROVED');
                                        setDecisionStateHistory(prev => [
                                          ...prev,
                                          {
                                            from: 'PENDING_APPROVAL',
                                            to: 'APPROVED',
                                            timestamp: new Date().toISOString(),
                                            triggerEvent: 'sem:event.approval_granted',
                                            guardResult: 'PASS (hasRequiredQuorum -> 3 independent sigs)'
                                          }
                                        ]);
                                      }}
                                      className="px-2 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold uppercase rounded-xs transition-colors"
                                    >
                                      ➔ Approve (sem:event.approval_granted)
                                    </button>
                                    <button
                                      onClick={() => {
                                        playBeep('alert');
                                        setDecisionCurrentState('REJECTED');
                                        setDecisionStateHistory(prev => [
                                          ...prev,
                                          {
                                            from: 'PENDING_APPROVAL',
                                            to: 'REJECTED',
                                            timestamp: new Date().toISOString(),
                                            triggerEvent: 'sem:event.approval_denied',
                                            guardResult: 'PASS (Constitutional veto trigger)'
                                          }
                                        ]);
                                      }}
                                      className="px-2 py-1 bg-red-700 hover:bg-red-800 text-white font-bold uppercase rounded-xs transition-colors"
                                    >
                                      ➔ Deny (sem:event.approval_denied)
                                    </button>
                                  </>
                                )}

                                {decisionCurrentState === 'APPROVED' && (
                                  <button
                                    onClick={() => {
                                      playBeep('success');
                                      setDecisionCurrentState('EXECUTING');
                                      setDecisionStateHistory(prev => [
                                        ...prev,
                                        {
                                          from: 'APPROVED',
                                          to: 'EXECUTING',
                                          timestamp: new Date().toISOString(),
                                          triggerEvent: 'sem:event.execution_started',
                                          guardResult: 'PASS (resourcesAvailable -> systemLoad < 100%)'
                                        }
                                      ]);
                                    }}
                                    className="px-2 py-1 bg-indigo-700 hover:bg-indigo-800 text-white font-bold uppercase rounded-xs transition-colors"
                                  >
                                    ➔ Start Execution (sem:event.execution_started)
                                  </button>
                                )}

                                {decisionCurrentState === 'EXECUTING' && (
                                  <>
                                    <button
                                      onClick={() => {
                                        playBeep('success');
                                        setDecisionCurrentState('COMPLETED');
                                        setDecisionStateHistory(prev => [
                                          ...prev,
                                          {
                                            from: 'EXECUTING',
                                            to: 'COMPLETED',
                                            timestamp: new Date().toISOString(),
                                            triggerEvent: 'sem:event.execution_success',
                                            guardResult: 'PASS (isResultValidated -> all policies satisfied)'
                                          }
                                        ]);
                                      }}
                                      className="px-2 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold uppercase rounded-xs transition-colors"
                                    >
                                      ➔ Terminate Success (sem:event.execution_success)
                                    </button>
                                    <button
                                      onClick={() => {
                                        playBeep('alert');
                                        setDecisionCurrentState('ROLLED_BACK');
                                        setDecisionStateHistory(prev => [
                                          ...prev,
                                          {
                                            from: 'EXECUTING',
                                            to: 'ROLLED_BACK',
                                            timestamp: new Date().toISOString(),
                                            triggerEvent: 'sem:event.execution_failure',
                                            guardResult: 'PASS (triggerRecoveryProtocol() initiated rollback)'
                                          }
                                        ]);
                                      }}
                                      className="px-2 py-1 bg-rose-700 hover:bg-rose-800 text-white font-bold uppercase rounded-xs transition-colors animate-pulse"
                                    >
                                      ⚡ Inject Failure (sem:event.execution_failure)
                                    </button>
                                  </>
                                )}

                                {decisionCurrentState === 'ROLLED_BACK' && (
                                  <button
                                    onClick={() => {
                                      playBeep('success');
                                      setDecisionCurrentState('APPROVED');
                                      setDecisionStateHistory(prev => [
                                        ...prev,
                                        {
                                          from: 'ROLLED_BACK',
                                          to: 'APPROVED',
                                          timestamp: new Date().toISOString(),
                                          triggerEvent: 'sem:event.recovery_completed',
                                          guardResult: 'PASS (isRecoveryValidated -> rollback complete)'
                                        }
                                      ]);
                                    }}
                                    className="px-2 py-1 bg-blue-700 hover:bg-blue-800 text-white font-bold uppercase rounded-xs transition-colors"
                                  >
                                    ➔ Recover & Re-Authorize (sem:event.recovery_completed)
                                  </button>
                                )}

                                {(decisionCurrentState === 'COMPLETED' || decisionCurrentState === 'REJECTED') && (
                                  <button
                                    onClick={() => {
                                      playBeep('click');
                                      setDecisionCurrentState('PROPOSAL_SUBMITTED');
                                      setDecisionStateHistory([
                                        {
                                          from: "PROPOSAL_SUBMITTED",
                                          to: "PENDING_APPROVAL",
                                          timestamp: "2026-07-16T20:05:00Z",
                                          triggerEvent: "sem:event.governance_check_passed",
                                          guardResult: "PASS (all policies compliant)"
                                        }
                                      ]);
                                    }}
                                    className="px-2 py-1 bg-slate-800 hover:bg-slate-900 text-white font-bold uppercase rounded-xs transition-colors"
                                  >
                                    ➔ Reset Engine to PROPOSAL_SUBMITTED
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Cryptographic State History Audit Ledger */}
                            <div className="space-y-1 bg-white/30 p-2 border border-[#141414]/5 rounded-xs">
                              <span className="font-extrabold text-indigo-950 text-[7px] uppercase tracking-wide block">Validated State History Ledger</span>
                              <div className="overflow-x-auto max-h-[140px] scrollbar-thin border border-[#141414]/10 rounded-sm">
                                <table className="w-full text-left border-collapse font-mono text-[6.5px]">
                                  <thead>
                                    <tr className="bg-[#141414]/10 text-slate-800 font-bold border-b border-[#141414]/20">
                                      <th className="p-1">FROM STATE</th>
                                      <th className="p-1">TO STATE</th>
                                      <th className="p-1">TRIGGER EVENT</th>
                                      <th className="p-1">GUARD EVALUATION</th>
                                      <th className="p-1 text-right">TIMESTAMP</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-[#141414]/10">
                                    {decisionStateHistory.map((hist, histIdx) => (
                                      <tr key={histIdx} className="hover:bg-white/40 transition-colors">
                                        <td className="p-1 font-semibold text-slate-600 truncate max-w-[80px]" title={hist.from}>{hist.from}</td>
                                        <td className="p-1 font-extrabold text-indigo-950 truncate max-w-[80px]" title={hist.to}>{hist.to}</td>
                                        <td className="p-1 text-slate-700 truncate max-w-[120px]" title={hist.triggerEvent}>{hist.triggerEvent}</td>
                                        <td className="p-1 text-emerald-800 truncate max-w-[150px]" title={hist.guardResult}>{hist.guardResult}</td>
                                        <td className="p-1 text-right text-slate-500 font-sans">{hist.timestamp.includes('Z') ? hist.timestamp.split('T')[1].substring(0, 8) : new Date(hist.timestamp).toLocaleTimeString()}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Interactive JSON-LD Spec Drawer */}
                      <div className="border border-[#141414] bg-[#D1D0CC] p-2.5 space-y-1.5 rounded-sm">
                        <div className="flex justify-between items-center flex-wrap gap-2">
                          <div className="flex-1 min-w-[200px]">
                            <span className="text-[7px] font-mono opacity-60 uppercase block">ECOS Semantic Graph Architecture</span>
                            <span className="text-[9.5px] font-bold font-mono uppercase text-indigo-950 flex items-center gap-1.5">
                              <Compass className="w-3.5 h-3.5" />
                              JSON-LD Strategic Alignment context Graph
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {showStrategyJson && (
                              <div className="flex bg-[#E4E3E0] p-0.5 border border-[#141414]/20 gap-1 rounded-sm">
                                <button
                                  onClick={() => { playBeep('click'); setStrategySchemaView('alignment'); }}
                                  className={`px-1.5 py-0.5 text-[7px] font-bold uppercase transition-colors rounded-xs ${
                                    strategySchemaView === 'alignment'
                                      ? 'bg-[#141414] text-white'
                                      : 'hover:bg-[#141414]/10 text-[#141414]'
                                  }`}
                                >
                                  Alignment
                                </button>
                                <button
                                  onClick={() => { playBeep('click'); setStrategySchemaView('lifecycle'); }}
                                  className={`px-1.5 py-0.5 text-[7px] font-bold uppercase transition-colors rounded-xs ${
                                    strategySchemaView === 'lifecycle'
                                      ? 'bg-[#141414] text-white'
                                      : 'hover:bg-[#141414]/10 text-[#141414]'
                                  }`}
                                >
                                  Lifecycle Machine
                                </button>
                                <button
                                  onClick={() => { playBeep('click'); setStrategySchemaView('events'); }}
                                  className={`px-1.5 py-0.5 text-[7px] font-bold uppercase transition-colors rounded-xs ${
                                    strategySchemaView === 'events'
                                      ? 'bg-[#141414] text-white'
                                      : 'hover:bg-[#141414]/10 text-[#141414]'
                                  }`}
                                >
                                  Semantic Events
                                </button>
                                <button
                                  onClick={() => { playBeep('click'); setStrategySchemaView('decisions'); }}
                                  className={`px-1.5 py-0.5 text-[7px] font-bold uppercase transition-colors rounded-xs ${
                                    strategySchemaView === 'decisions'
                                      ? 'bg-[#141414] text-white'
                                      : 'hover:bg-[#141414]/10 text-[#141414]'
                                  }`}
                                >
                                  Decisions & Proposals
                                </button>
                                <button
                                  onClick={() => { playBeep('click'); setStrategySchemaView('statecharts'); }}
                                  className={`px-1.5 py-0.5 text-[7px] font-bold uppercase transition-colors rounded-xs ${
                                    strategySchemaView === 'statecharts'
                                      ? 'bg-[#141414] text-white'
                                      : 'hover:bg-[#141414]/10 text-[#141414]'
                                  }`}
                                >
                                  Decision State Machine
                                </button>
                              </div>
                            )}
                            
                            <button
                              onClick={() => { playBeep('click'); setShowStrategyJson(!showStrategyJson); }}
                              className="px-2 py-0.5 border border-[#141414] hover:bg-[#E4E3E0] font-mono font-bold uppercase text-[7.5px] transition-colors"
                            >
                              {showStrategyJson ? '[- Hide JSON-LD Schema]' : '[+ View JSON-LD Schema]'}
                            </button>
                          </div>
                        </div>

                        {showStrategyJson && strategySchemaView === 'events' && (
                          <div className="flex gap-2 items-center bg-[#E4E3E0]/60 p-1.5 border border-[#141414]/10 rounded-xs animate-fade-in">
                            <span className="text-[7px] font-bold uppercase text-slate-600 font-mono">Select JSON Event Graph:</span>
                            <div className="flex gap-1.5">
                              <button
                                onClick={() => { playBeep('click'); setInjectedEventSelected('kpi-failure'); }}
                                className={`px-2 py-0.5 text-[6.5px] font-bold uppercase border border-[#141414]/30 rounded-xs transition-colors ${
                                  injectedEventSelected === 'kpi-failure'
                                    ? 'bg-[#141414] text-white'
                                    : 'bg-white text-slate-800 hover:bg-slate-100'
                                }`}
                              >
                                event:kpi-critical-failure-001
                              </button>
                              <button
                                onClick={() => { playBeep('click'); setInjectedEventSelected('realignment'); }}
                                className={`px-2 py-0.5 text-[6.5px] font-bold uppercase border border-[#141414]/30 rounded-xs transition-colors ${
                                  injectedEventSelected === 'realignment'
                                    ? 'bg-[#141414] text-white'
                                    : 'bg-white text-slate-800 hover:bg-slate-100'
                                }`}
                              >
                                event:strategic-realignment-001
                              </button>
                            </div>
                          </div>
                        )}

                        {showStrategyJson && (
                          <pre className="text-[6.5px] leading-tight font-mono text-[#E4E3E0] bg-[#141414] p-2 border border-[#141414] overflow-x-auto max-h-[180px] select-all animate-fade-in whitespace-pre scrollbar-thin">
                            {strategySchemaView === 'alignment' 
                              ? JSON.stringify(RAW_STRATEGY_JSON_LD, null, 2)
                              : strategySchemaView === 'lifecycle'
                              ? JSON.stringify(strategicGoalsLifecycle, null, 2)
                              : strategySchemaView === 'decisions'
                              ? JSON.stringify(ECOS_ZERO_TRUST_DECISION_GRAPH, null, 2)
                              : strategySchemaView === 'statecharts'
                              ? JSON.stringify(ECOS_DECISION_LIFECYCLE_STATE_MACHINE, null, 2)
                              : JSON.stringify(injectedEventSelected === 'kpi-failure' ? ECOS_CRITICAL_FAILURE_EVENT : ECOS_STRATEGIC_REALIGNMENT_EVENT, null, 2)
                            }
                          </pre>
                        )}
                      </div>

                    </div>
                  </motion.div>
                )}

                {activeTab === 'identities' && (
                  <motion.div
                    key="identities"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3.5 flex-1 flex flex-col justify-between text-[#141414]"
                  >
                    <IdentityRegistry 
                      playBeep={playBeep}
                      onAddAuditEntry={(entry) => setAuditTrail(prev => [entry, ...prev])}
                      onUpdateSnapshot={(updater) => setSnapshot(prev => updater(prev))}
                    />
                  </motion.div>
                )}

                {activeTab === 'organization' && (
                  <motion.div
                    key="organization"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3.5 flex-1 flex flex-col justify-between text-[#141414]"
                  >
                    <OrganizationRegistry 
                      playBeep={playBeep}
                      onAddAuditEntry={(entry) => setAuditTrail(prev => [entry, ...prev])}
                      onUpdateSnapshot={(updater) => setSnapshot(prev => updater(prev))}
                    />
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

          </section>

          {/* COLUMN 3: ENFORCEMENT CAPABILITIES (col-span-3) */}
          <section className="lg:col-span-3 bg-[#E4E3E0] p-4 flex flex-col justify-between">
            
            <div className="space-y-3">
              <h2 className="text-xs font-bold uppercase pb-1 border-b border-[#141414] flex justify-between">
                <span>Enforcement Registry</span>
                <span className="font-mono text-[9px] text-[#141414]">RULE ENGINE</span>
              </h2>
              
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 text-[9px]">
                
                <div className={`border-2 p-2 ${lockdownActive ? 'border-red-700 bg-red-100 text-red-950' : 'border-[#141414] bg-[#141414] text-[#E4E3E0]'}`}>
                  <p className="font-bold uppercase flex items-center justify-between">
                    <span>IMMEDIATE_HALT_AND_LOCK</span>
                    {lockdownActive && <span className="animate-ping w-1.5 h-1.5 bg-red-700 rounded-full"></span>}
                  </p>
                  <p className="opacity-80 leading-normal mt-1">Mechanism: Lock affected codebase files and freeze execution state entirely until manual security restoration.</p>
                </div>

                <div className="border border-[#141414] p-2 bg-[#D1D0CC]/40">
                  <p className="font-bold uppercase">BLOCK_OUTPUT_AND_ESCALATE</p>
                  <p className="opacity-80 leading-normal mt-1">Mechanism: Intercept output buffer streams at the presentation interface, preventing deceptive deliveries.</p>
                </div>

                <div className="border border-[#141414] p-2 bg-[#D1D0CC]/40">
                  <p className="font-bold uppercase">REJECT_AND_QUARANTINE</p>
                  <p className="opacity-80 leading-normal mt-1">Mechanism: Break adversarial input channels, isolate requested database entities, block socket hosts.</p>
                </div>

              </div>
            </div>

            {/* QUICK STATS FOR BRUTALIST ALIGNMENT */}
            <div className="border-t-2 border-[#141414] pt-3 mt-4 space-y-1 font-mono text-[8px] opacity-75">
              <p>HARDWARE LOCK: ENABLED</p>
              <p>INPUT FILTER DELAY: 0.015ms</p>
              <p>LEDGER SIGNATURE: SHA256/BLAKE3</p>
            </div>

          </section>

        </main>

        {/* BOTTOM LEDGER RECORDS & CRYPTO VERIFICATION AUDIT TRAIL */}
        <section className="bg-[#D1D0CC] border-t-4 border-[#141414] p-4 grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* LEDGER FEED LOGS (Col span 8) */}
          <div className="md:col-span-8 flex flex-col gap-2">
            <h3 className="text-xs font-bold uppercase flex justify-between items-center">
              <span>Cryptographic Immutable Ledger Logs</span>
              <span className="font-mono text-[9px] opacity-60">SEQUENTIAL CHAIN BLAKE3-HASHED</span>
            </h3>

            <div className="bg-[#E4E3E0] border border-[#141414] p-2 h-[120px] overflow-y-auto font-mono text-[10px] space-y-1.5 scrollbar-thin">
              {auditTrail.map((entry, idx) => {
                let statusColor = 'text-[#141414]';
                if (entry.status === 'BLOCKED' || entry.status === 'FAILED') statusColor = 'text-red-700 font-bold';
                else if (entry.status === 'WARNING') statusColor = 'text-amber-800 font-bold';
                else if (entry.status === 'SUCCESS' && entry.eventType === 'SANDBOX_SIMULATION') statusColor = 'text-indigo-800';
                else if (entry.status === 'SUCCESS') statusColor = 'text-green-800';

                return (
                  <div key={entry.entryId || idx} className="border-b border-[#141414]/10 pb-1 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                    <div className="max-w-[70%]">
                      <span className="opacity-60 text-[9px] block sm:inline mr-2">[{entry.timestamp.substring(11, 19)}]</span>
                      <span className={`${statusColor} mr-2 font-bold`}>{entry.eventType}:</span>
                      <span className="opacity-90">{entry.description}</span>
                    </div>
                    <span className="text-[9px] bg-[#D1D0CC] px-1 py-0.5 border border-[#141414]/20 select-all tracking-tighter truncate max-w-[140px] sm:max-w-none">
                      {entry.hash.substring(0, 18)}...
                    </span>
                  </div>
                );
              })}
              <div ref={terminalEndRef} />
            </div>
          </div>

          {/* BLOCK CHAIN INTEGRITY CHECKER (Col span 4) */}
          <div className="md:col-span-4 bg-[#E4E3E0] border border-[#141414] p-3 flex flex-col justify-between">
            <div>
              <h4 className="text-[10px] font-bold uppercase flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-indigo-800" />
                Ledger Verification Tool
              </h4>
              <p className="text-[9px] opacity-80 mt-1">
                Calculate Blake3 hash matching sequence over the sequential blocks to detect manual backend database tampering.
              </p>
            </div>

            <div className="my-2.5">
              {isVerifying ? (
                <div className="bg-[#D1D0CC] border border-[#141414] p-2 text-center text-[10px] font-mono font-bold animate-pulse">
                  RECALCULATING LEDGER BLOCK CHAIN...
                </div>
              ) : verifySuccess === null ? (
                <div className="bg-[#D1D0CC] border border-dashed border-[#141414]/50 p-2 text-center text-[9px] font-mono text-[#141414]/60">
                  LEDGER STATE: NOT SCANNED
                </div>
              ) : verifySuccess ? (
                <div className="bg-green-100 text-green-950 border border-green-800 p-2 text-center text-[10px] font-mono font-bold flex items-center justify-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-green-800" />
                  LEDGER INTEGRITY VERIFIED
                </div>
              ) : (
                <div className="bg-red-100 text-red-950 border border-red-800 p-2 text-center text-[10px] font-mono font-bold flex items-center justify-center gap-1.5 animate-bounce">
                  <AlertCircle className="w-4 h-4 text-red-700" />
                  CORRUPTED LINKAGE DETECTED!
                </div>
              )}
            </div>

            <button
              onClick={handleVerifyLedger}
              disabled={isVerifying}
              className="w-full py-1.5 bg-[#141414] hover:bg-[#333333] disabled:opacity-50 text-white font-mono font-bold text-[10px] uppercase transition-colors flex items-center justify-center gap-1 border-2 border-[#141414]"
            >
              <RefreshCw className={`w-3 h-3 ${isVerifying ? 'animate-spin' : ''}`} />
              Run Cryptographic Ledger Verification
            </button>
          </div>

        </section>

        {/* BOTTOM SYSTEM FOOTER BAR */}
        <footer className="h-10 border-t-4 border-[#141414] px-4 flex flex-col sm:flex-row items-center justify-between bg-[#E4E3E0] font-mono text-[9px] uppercase tracking-tight gap-1.5 py-1">
          <div className="flex gap-4 sm:gap-6">
            <span>Uptime: 00:00:01.000</span>
            <span>Version: 1.0.0-Stable</span>
            <span className="hidden sm:inline">Active Rule Coverage: 100%</span>
          </div>
          <div className="flex gap-4">
            <span className="hidden md:inline">Mem: 4.2GB/128GB</span>
            <span>Latency: 0.02ms</span>
            <span className="font-bold text-red-700">System State: {lockdownActive ? 'HALTED_PROTECT' : '100% Compliant'}</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
