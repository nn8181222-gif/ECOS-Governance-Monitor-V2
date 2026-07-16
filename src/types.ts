export interface InitializationStep {
  step: number;
  action: string;
  target?: string | string[];
  status: 'COMPLETE' | 'PENDING' | 'FAILED';
  timestamp: string;
  result: string;
}

export interface MonitoringTarget {
  rule: string;
  canonicalName: string;
  checkFrequency: string;
  currentStatus: 'PASSIVE_SCANNING' | 'GATE_ACTIVE' | 'FILTERING' | 'SCANNING_KNOWLEDGE_BASE' | 'GATE_ARMED' | 'SCANNING_OUTPUTS' | 'ALERT_TRIGGERED';
  lastViolation: string | null;
  violationCount24h: number;
  description: string;
}

export interface EnforcementCapability {
  name: string;
  mechanism: string;
  escalationTarget: string;
  reversible: boolean;
  requiresAuthorization?: boolean;
}

export interface AuditEntry {
  entryId: string;
  timestamp: string;
  eventType: 'GOVERNANCE_INITIALIZATION' | 'MONITORING_ESTABLISHED' | 'RULE_TRIGGERED' | 'VIOLATION_BLOCKED' | 'SANDBOX_SIMULATION' | 'INTEGRITY_VERIFICATION';
  description: string;
  constitutionalHash?: string;
  monitoringCoverage?: 'FULL' | 'PARTIAL' | 'NONE';
  status: 'SUCCESS' | 'BLOCKED' | 'WARNING' | 'FAILED';
  hash: string;
}

export interface ProtectedOperation {
  operation: string;
  enforcedArticle: string;
  mechanism: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface SystemSnapshot {
  timestamp: string;
  constitutionVersion: string;
  articlesActive: number;
  articlesViolated: number;
  integrityHash: string;
  activePolicies: number;
  totalStatements: number;
  statementsEnforced: number;
  complianceRate: string;
  rulesActive: number;
  rulesTriggered24h: number;
  violationsBlocked24h: number;
  falsePositives24h: number;
  enforcementActionsActive: number;
  enforcementActionsPending: number;
  enforcementActionsResolved24h: number;
  healthFirewall: 'OPERATIONAL' | 'ARMED' | 'ALERT' | 'LOCKED';
  healthMonitoringLoop: 'RUNNING' | 'PAUSED' | 'FAILED';
  healthAuditTrail: 'APPENDING' | 'READ_ONLY' | 'CORRUPTED';
}
