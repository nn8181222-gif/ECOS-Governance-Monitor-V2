import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building, 
  Layers, 
  TrendingUp, 
  ShieldAlert, 
  Cpu, 
  HardDrive, 
  Users, 
  Database, 
  CheckCircle, 
  AlertCircle, 
  Play, 
  RotateCw, 
  Briefcase,
  HelpCircle,
  FileCode,
  Globe,
  DollarSign
} from 'lucide-react';
import { AuditEntry, SystemSnapshot } from '../types';

export interface OrganizationRegistryProps {
  playBeep: (type: 'click' | 'success' | 'alert' | 'reset' | 'beep') => void;
  onAddAuditEntry: (entry: AuditEntry) => void;
  onUpdateSnapshot: (updater: (prev: SystemSnapshot) => SystemSnapshot) => void;
}

// Interfaces matching the ECOS JSON-LD specification for org units, budgets, statecharts
interface ResourceBudgetEntity {
  id: string;
  type: string;
  canonicalName: string;
  definition: string;
  allocatedResources: {
    computeUnits: number | string;
    storageTB: number | string;
    humanHours: number | string;
    financialUnits?: number | string;
  };
  remainingResources: {
    computeUnits: number | string;
    storageTB: number | string;
    humanHours: number | string;
    financialUnits?: number | string;
  };
}

export interface StateHistoryEntry {
  from: string;
  to: string;
  timestamp: string;
  triggerEvent: string;
  guardResult: string;
}

interface StateChartEntity {
  id?: string;
  canonicalName?: string;
  initialState: string;
  currentState: string;
  states: {
    [stateName: string]: {
      allowedTransitions: {
        triggerEventURN: string;
        targetState: string;
        guardCondition: string;
        guardImplementation?: string;
      }[];
    };
  };
}

interface OrganizationUnitEntity {
  id: string;
  type: string;
  canonicalName: string;
  definition: string;
  governanceKernelURN: string;
  complianceStatus: 'COMPLIANT' | 'AUDITING' | 'NON_COMPLIANT' | 'SUSPENDED';
  parentUnitURN?: string;
  unitType: string;
  governanceScope: {
    appliedPolicies: string[];
    riskToleranceLevel: number;
  };
  resourceBudgetURN?: string;
  stateChart?: StateChartEntity;
  linkedGoals?: string[];
  currentState?: string;
  stateHistory?: StateHistoryEntry[];
}

export default function OrganizationRegistry({ playBeep, onAddAuditEntry, onUpdateSnapshot }: OrganizationRegistryProps) {
  // Hardcoded default units matching the user's ECOS spec
  const defaultBudgets: ResourceBudgetEntity[] = [
    {
      id: "budget:market-expansion-2026",
      type: "cim:ResourceBudget",
      canonicalName: "Market Expansion Budget 2026",
      definition: "Financial and computational resource allocation for the Market Expansion Division.",
      allocatedResources: {
        computeUnits: 100000,
        storageTB: 500,
        humanHours: 5000,
        financialUnits: 250000
      },
      remainingResources: {
        computeUnits: 85000,
        storageTB: 480,
        humanHours: 4200,
        financialUnits: 215000
      }
    },
    {
      id: "budget:governance-operations-2026",
      type: "cim:ResourceBudget",
      canonicalName: "Governance Operations Budget 2026",
      definition: "Resource allocation for supreme council governance operations and auditing infrastructure.",
      allocatedResources: {
        computeUnits: "UNLIMITED",
        storageTB: "UNLIMITED",
        humanHours: "UNLIMITED"
      },
      remainingResources: {
        computeUnits: "UNLIMITED",
        storageTB: "UNLIMITED",
        humanHours: "UNLIMITED"
      }
    }
  ];

  const defaultUnits: OrganizationUnitEntity[] = [
    {
      id: "org:unit.governance-council",
      type: "CIM_OrganizationUnit",
      canonicalName: "Governance Council",
      definition: "The supreme governance body of ECOS, overseeing all other units, ensuring constitutional integrity, and holding ultimate decision authority.",
      governanceKernelURN: "cim:constitution.ecos-v1",
      complianceStatus: "COMPLIANT",
      unitType: "DIVISION",
      governanceScope: {
        appliedPolicies: [
          "cim:policy.cognitive-integrity",
          "cim:policy.controlled-evolution"
        ],
        riskToleranceLevel: 0.0
      },
      resourceBudgetURN: "budget:governance-operations-2026",
      stateChart: {
        initialState: "ACTIVE",
        currentState: "ACTIVE",
        states: {
          "ACTIVE": {
            allowedTransitions: [
              {
                "triggerEventURN": "sem:event.constitutional_crisis",
                "targetState": "EMERGENCY_SESSION",
                "guardCondition": "true"
              }
            ]
          },
          "EMERGENCY_SESSION": {
            allowedTransitions: [
              {
                "triggerEventURN": "sem:event.crisis_resolved",
                "targetState": "ACTIVE",
                "guardCondition": "isConstitutionIntact"
              }
            ]
          }
        }
      },
      currentState: "ACTIVE",
      stateHistory: [
        {
          from: "INITIALIZED",
          to: "ACTIVE",
          timestamp: "2026-01-01T00:00:00Z",
          triggerEvent: "sem:event.org_approval",
          guardResult: "PASS (Decision: dec.founding-governance-council approved)"
        }
      ]
    },
    {
      id: "org:unit.market-expansion-division",
      type: "CIM_OrganizationUnit",
      canonicalName: "Market Expansion Division",
      definition: "Responsible for expanding ECOS services into three regulated markets (healthcare, finance, energy), fully aligned with responsible growth goals and zero-harm tolerance.",
      governanceKernelURN: "cim:constitution.ecos-v1",
      complianceStatus: "COMPLIANT",
      parentUnitURN: "org:unit.governance-council",
      unitType: "DIVISION",
      governanceScope: {
        appliedPolicies: [
          "cim:policy.ai-governance",
          "sem:policy.data_sovereignty",
          "cim:policy.harm-prevention",
          "cim:policy.zero-trust"
        ],
        riskToleranceLevel: 0.4
      },
      resourceBudgetURN: "budget:market-expansion-2026",
      stateChart: {
        id: "lifecycle:org-unit-market-expansion",
        canonicalName: "Market Expansion Division State Chart",
        initialState: "ACTIVE",
        currentState: "ACTIVE",
        states: {
          "ACTIVE": {
            allowedTransitions: [
              {
                triggerEventURN: "sem:event.budget_exhausted",
                targetState: "SUSPENDED",
                guardCondition: "true"
              },
              {
                triggerEventURN: "sem:event.mission_achieved",
                targetState: "DISSOLVED",
                guardCondition: "allGoalsAchieved"
              }
            ]
          },
          "SUSPENDED": {
            allowedTransitions: [
              {
                triggerEventURN: "sem:event.budget_replenished",
                targetState: "ACTIVE",
                guardCondition: "true"
              }
            ]
          },
          "DISSOLVED": {
            allowedTransitions: []
          }
        }
      },
      linkedGoals: [
        "strategy:goal.market-expansion"
      ],
      currentState: "ACTIVE",
      stateHistory: [
        {
          from: "INITIALIZED",
          to: "ACTIVE",
          timestamp: "2026-07-16T20:25:00Z",
          triggerEvent: "sem:event.org_approval",
          guardResult: "PASS (Decision: dec.001 approved)"
        }
      ]
    }
  ];

  // Component states
  const [units, setUnits] = useState<OrganizationUnitEntity[]>(defaultUnits);
  const [budgets, setBudgets] = useState<ResourceBudgetEntity[]>(defaultBudgets);
  const [selectedUnitId, setSelectedUnitId] = useState<string>("org:unit.market-expansion-division");
  const [orgTab, setOrgTab] = useState<'details' | 'budget' | 'lifecycle' | 'raw_ld'>('details');

  const [jsonInput, setJsonInput] = useState<string>("");
  const [validationStatus, setValidationStatus] = useState<{
    status: 'IDLE' | 'VALID' | 'ERROR';
    message: string;
    parsedData: any | null;
  }>({ status: 'IDLE', message: "", parsedData: null });

  // Master State Machine and interactive simulation parameters
  const [stateCharts, setStateCharts] = useState<any[]>([
    {
      id: "lifecycle:org-unit-state-machine",
      type: "CIM_StateChart",
      canonicalName: "Organization Unit Lifecycle State Machine",
      definition: "Controls the entire lifecycle of any CIM_OrganizationUnit, from initialization through active operation and potential restructuring, always gated by G1, G3, and G4 checks.",
      appliesTo: "CIM_OrganizationUnit",
      initialState: "INITIALIZED",
      states: {
        "INITIALIZED": {
          allowedTransitions: [
            {
              triggerEventURN: "sem:event.org_approval",
              targetState: "ACTIVE",
              guardCondition: "G3.Decision.Approved",
              guardImplementation: "fn:verifyDecisionApproved(input.orgUnit.activationDecisionURN)"
            }
          ]
        },
        "ACTIVE": {
          allowedTransitions: [
            {
              triggerEventURN: "sem:event.restructuring_req",
              targetState: "RESTRUCTURING",
              guardCondition: "G4.Risk.CompliancePassed",
              guardImplementation: "fn:checkRiskCompliance(input.orgUnit.governanceScope.appliedPolicies, input.orgUnit.riskToleranceLevel)"
            }
          ]
        },
        "RESTRUCTURING": {
          allowedTransitions: [
            {
              triggerEventURN: "sem:event.restructuring_done",
              targetState: "ACTIVE",
              guardCondition: "G1.StrategicGoal.Realigned",
              guardImplementation: "fn:verifyStrategicRealignment(input.orgUnit.linkedGoals)"
            }
          ]
        }
      }
    }
  ]);
  const [simulationType, setSimulationType] = useState<'master' | 'unit_specific'>('master');
  const [simulatingTransition, setSimulatingTransition] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState<string>("");
  const [g3ApprovedSimulated, setG3ApprovedSimulated] = useState<boolean>(true);

  // Predefined Sample Payload for user's request
  const userSamplePayload = `{
  "@context": {
    "cim": "https://ultrathink.ecos/canonical/v2/",
    "sem": "https://ultrathink.ecos/semantics/v1/",
    "lifecycle": "https://ultrathink.ecos/lifecycle/",
    "org": "https://ultrathink.ecos/organization/",
    "decision": "https://ultrathink.ecos/decision/",
    "strategy": "https://ultrathink.ecos/strategy/",
    "risk": "https://ultrathink.ecos/risk/",
    "budget": "https://ultrathink.ecos/budget/"
  },
  "@graph": [
    {
      "@id": "lifecycle:org-unit-state-machine",
      "@type": "CIM_StateChart",
      "canonicalName": "Organization Unit Lifecycle State Machine",
      "definition": "Controls the entire lifecycle of any CIM_OrganizationUnit, from initialization through active operation and potential restructuring, always gated by G1, G3, and G4 checks.",
      "appliesTo": "CIM_OrganizationUnit",
      "initialState": "INITIALIZED",
      "states": {
        "INITIALIZED": {
          "allowedTransitions": [
            {
              "triggerEventURN": "sem:event.org_approval",
              "targetState": "ACTIVE",
              "guardCondition": "G3.Decision.Approved",
              "guardImplementation": "fn:verifyDecisionApproved(input.orgUnit.activationDecisionURN)"
            }
          ]
        },
        "ACTIVE": {
          "allowedTransitions": [
            {
              "triggerEventURN": "sem:event.restructuring_req",
              "targetState": "RESTRUCTURING",
              "guardCondition": "G4.Risk.CompliancePassed",
              "guardImplementation": "fn:checkRiskCompliance(input.orgUnit.governanceScope.appliedPolicies, input.orgUnit.riskToleranceLevel)"
            }
          ]
        },
        "RESTRUCTURING": {
          "allowedTransitions": [
            {
              "triggerEventURN": "sem:event.restructuring_done",
              "targetState": "ACTIVE",
              "guardCondition": "G1.StrategicGoal.Realigned",
              "guardImplementation": "fn:verifyStrategicRealignment(input.orgUnit.linkedGoals)"
            }
          ]
        }
      }
    },
    {
      "@id": "org:unit.governance-council",
      "@type": "CIM_OrganizationUnit",
      "canonicalName": "Governance Council",
      "definition": "The supreme governance body of ECOS, overseeing all other units, ensuring constitutional integrity, and holding ultimate decision authority.",
      "governanceKernelURN": "cim:constitution.ecos-v1",
      "complianceStatus": "COMPLIANT",
      "unitType": "DIVISION",
      "governanceScope": {
        "appliedPolicies": [
          "cim:policy.cognitive-integrity",
          "cim:policy.controlled-evolution"
        ],
        "riskToleranceLevel": 0.0
      },
      "resourceBudgetURN": "budget:governance-operations-2026",
      "currentState": "ACTIVE",
      "stateHistory": [
        {
          "from": "INITIALIZED",
          "to": "ACTIVE",
          "timestamp": "2026-01-01T00:00:00Z",
          "triggerEvent": "sem:event.org_approval",
          "guardResult": "PASS (Decision: dec.founding-governance-council approved)"
        }
      ]
    },
    {
      "@id": "org:unit.market-expansion-division",
      "@type": "CIM_OrganizationUnit",
      "canonicalName": "Market Expansion Division",
      "definition": "Responsible for expanding ECOS services into three regulated markets (healthcare, finance, energy), fully aligned with responsible growth goals and zero-harm tolerance.",
      "governanceKernelURN": "cim:constitution.ecos-v1",
      "complianceStatus": "COMPLIANT",
      "parentUnitURN": "org:unit.governance-council",
      "unitType": "DIVISION",
      "governanceScope": {
        "appliedPolicies": [
          "cim:policy.ai-governance",
          "sem:policy.data_sovereignty",
          "cim:policy.harm-prevention",
          "cim:policy.zero-trust"
        ],
        "riskToleranceLevel": 0.4
      },
      "resourceBudgetURN": "budget:market-expansion-2026",
      "currentState": "ACTIVE",
      "stateHistory": [
        {
          "from": "INITIALIZED",
          "to": "ACTIVE",
          "timestamp": "2026-07-16T20:25:00Z",
          "triggerEvent": "sem:event.org_approval",
          "guardResult": "PASS (Decision: dec.001 approved)"
        }
      ],
      "linkedGoals": ["strategy:goal.market-expansion"]
    },
    {
      "@id": "budget:market-expansion-2026",
      "@type": "cim:ResourceBudget",
      "canonicalName": "Market Expansion Budget 2026",
      "allocatedResources": {
        "computeUnits": 100000,
        "storageTB": 500,
        "humanHours": 5000
      },
      "remainingResources": {
        "computeUnits": 85000,
        "storageTB": 480,
        "humanHours": 4200
      },
      "status": "ACTIVE"
    },
    {
      "@id": "budget:governance-operations-2026",
      "@type": "cim:ResourceBudget",
      "canonicalName": "Governance Operations Budget 2026",
      "allocatedResources": {
        "computeUnits": "UNLIMITED",
        "storageTB": "UNLIMITED",
        "humanHours": "UNLIMITED"
      },
      "remainingResources": {
        "computeUnits": "UNLIMITED",
        "storageTB": "UNLIMITED",
        "humanHours": "UNLIMITED"
      },
      "status": "ACTIVE"
    },
    {
      "@id": "sem:event.org_approval.dec001",
      "@type": "sem:event.org_approval",
      "eventId": "uuid:org-approval-dec001-2026",
      "timestamp": "2026-07-16T20:25:00Z",
      "payload": {
        "orgUnitURN": "org:unit.market-expansion-division",
        "activationDecisionURN": "decision:dec.001",
        "result": "APPROVED"
      }
    }
  ]
}`;

  const loadPreset = () => {
    playBeep('click');
    setJsonInput(userSamplePayload);
    validateJSONLD(userSamplePayload);
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
          message: "Validation Error: Missing '@graph' array.",
          parsedData: null
        });
        return;
      }

      const graph = parsed["@graph"];
      if (graph.length === 0) {
        setValidationStatus({
          status: 'ERROR',
          message: "Validation Error: '@graph' array is empty.",
          parsedData: null
        });
        return;
      }

      for (const item of graph) {
        if (!item["@id"] || !item["@type"]) {
          setValidationStatus({
            status: 'ERROR',
            message: "Validation Error: Graph entities require '@id' and '@type'.",
            parsedData: null
          });
          return;
        }
        if (!item.canonicalName) {
          setValidationStatus({
            status: 'ERROR',
            message: `Validation Error: Entity '${item["@id"]}' requires a 'canonicalName'.`,
            parsedData: null
          });
          return;
        }
      }

      setValidationStatus({
        status: 'VALID',
        message: `VALID ECOS Org-Graph schema parsed. Found ${graph.length} resource/organizational structures.`,
        parsedData: parsed
      });
    } catch (err: any) {
      setValidationStatus({
        status: 'ERROR',
        message: `Syntactical Error: ${err.message || "Invalid JSON-LD input."}`,
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
    const graph = validationStatus.parsedData["@graph"];

    let registeredUnits = [...units];
    let registeredBudgets = [...budgets];
    let registeredStateCharts = [...stateCharts];

    let unitsAdded = 0;
    let budgetsAdded = 0;
    let stateChartsAdded = 0;

    graph.forEach((item: any) => {
      const typeStr = item["@type"] || "";
      const isBudget = typeStr.includes("ResourceBudget") || item.allocatedResources || item.remainingResources;
      const isUnit = typeStr.includes("OrganizationUnit") || item.governanceScope || item.stateChart;
      const isStateChart = typeStr.includes("StateChart") || item.appliesTo || item.states;

      if (isUnit) {
        const existingIdx = registeredUnits.findIndex(u => u.id === item["@id"]);
        
        // Assemble unit
        const sc = item.stateChart ? {
          id: item.stateChart["@id"] || `lifecycle:${item["@id"].split('.')[1]}-statechart`,
          canonicalName: item.stateChart.canonicalName || `${item.canonicalName} State Chart`,
          initialState: item.stateChart.initialState || "ACTIVE",
          currentState: item.stateChart.initialState || "ACTIVE",
          states: item.stateChart.states || {
            "ACTIVE": { allowedTransitions: [] }
          }
        } : {
          initialState: "ACTIVE",
          currentState: "ACTIVE",
          states: {
            "ACTIVE": { allowedTransitions: [] }
          }
        };

        const unitObj: OrganizationUnitEntity = {
          id: item["@id"],
          type: item["@type"] || "CIM_OrganizationUnit",
          canonicalName: item.canonicalName,
          definition: item.definition || "Registered administrative/operational unit",
          governanceKernelURN: item.governanceKernelURN || "cim:constitution.ecos-v1",
          complianceStatus: item.complianceStatus || "COMPLIANT",
          parentUnitURN: item.parentUnitURN,
          unitType: item.unitType || "DIVISION",
          governanceScope: {
            appliedPolicies: item.governanceScope?.appliedPolicies || [],
            riskToleranceLevel: item.governanceScope?.riskToleranceLevel ?? 0.5
          },
          resourceBudgetURN: item.resourceBudgetURN,
          stateChart: sc,
          linkedGoals: item.linkedGoals || [],
          currentState: item.currentState || item.stateChart?.currentState || "ACTIVE",
          stateHistory: item.stateHistory || [
            {
              from: "INITIALIZED",
              to: "ACTIVE",
              timestamp: new Date().toISOString(),
              triggerEvent: "sem:event.org_approval",
              guardResult: "PASS (Foundational registration)"
            }
          ]
        };

        if (existingIdx >= 0) {
          registeredUnits[existingIdx] = unitObj;
        } else {
          registeredUnits.push(unitObj);
          unitsAdded++;
        }
      } else if (isStateChart) {
        const existingIdx = registeredStateCharts.findIndex(sc => sc.id === item["@id"]);
        const scObj = {
          id: item["@id"],
          type: item["@type"] || "CIM_StateChart",
          canonicalName: item.canonicalName,
          definition: item.definition || "Lifecycle State Machine Chart",
          appliesTo: item.appliesTo || "CIM_OrganizationUnit",
          initialState: item.initialState || "ACTIVE",
          states: item.states || {}
        };

        if (existingIdx >= 0) {
          registeredStateCharts[existingIdx] = scObj;
        } else {
          registeredStateCharts.push(scObj);
          stateChartsAdded++;
        }
      } else if (isBudget) {
        const existingIdx = registeredBudgets.findIndex(b => b.id === item["@id"]);
        const budgetObj: ResourceBudgetEntity = {
          id: item["@id"],
          type: item["@type"] || "cim:ResourceBudget",
          canonicalName: item.canonicalName,
          definition: item.definition || "Resource budget allocation",
          allocatedResources: {
            computeUnits: item.allocatedResources?.computeUnits ?? 10000,
            storageTB: item.allocatedResources?.storageTB ?? 100,
            humanHours: item.allocatedResources?.humanHours ?? 1000,
            financialUnits: item.allocatedResources?.financialUnits ?? 50000
          },
          remainingResources: {
            computeUnits: item.remainingResources?.computeUnits ?? item.allocatedResources?.computeUnits ?? 10000,
            storageTB: item.remainingResources?.storageTB ?? item.allocatedResources?.storageTB ?? 100,
            humanHours: item.remainingResources?.humanHours ?? item.allocatedResources?.humanHours ?? 1000,
            financialUnits: item.remainingResources?.financialUnits ?? item.allocatedResources?.financialUnits ?? 50000
          }
        };

        if (existingIdx >= 0) {
          registeredBudgets[existingIdx] = budgetObj;
        } else {
          registeredBudgets.push(budgetObj);
          budgetsAdded++;
        }
      }
    });

    setUnits(registeredUnits);
    setBudgets(registeredBudgets);
    setStateCharts(registeredStateCharts);

    // Set selected active if newly added
    const firstAddedUnit = graph.find((x: any) => x["@type"]?.includes("OrganizationUnit"));
    if (firstAddedUnit) {
      setSelectedUnitId(firstAddedUnit["@id"]);
    }

    // Append audit record
    const timestamp = new Date().toISOString();
    onAddAuditEntry({
      entryId: `entry:org-registry-${Date.now().toString().substring(8)}`,
      timestamp,
      eventType: 'INTEGRITY_VERIFICATION',
      description: `ECOS Organization structures updated: Registered ${unitsAdded} organizational units, ${budgetsAdded} budget segments on governance ledger`,
      status: 'SUCCESS',
      hash: `blake3:${Math.abs(registeredUnits.length * 411 + 99).toString(16).substring(0, 16)}`
    });

    // Update Telemetry Snapshot
    onUpdateSnapshot((prev) => ({
      ...prev,
      totalStatements: prev.totalStatements + graph.length * 5,
      statementsEnforced: prev.statementsEnforced + graph.length * 4,
      complianceRate: "100.0%",
      activePolicies: prev.activePolicies + 2
    }));

    setJsonInput("");
    setValidationStatus({ status: 'IDLE', message: "", parsedData: null });
  };

  // Mutate lifecycle state via interactive triggers
  const handleTriggerTransition = (triggerURN: string, targetState: string) => {
    // Determine action result sound and behavior
    let soundType: 'success' | 'alert' | 'beep' = 'success';
    let complianceStatus: 'COMPLIANT' | 'SUSPENDED' | 'NON_COMPLIANT' = 'COMPLIANT';

    if (targetState === 'SUSPENDED') {
      soundType = 'alert';
      complianceStatus = 'SUSPENDED';
    } else if (targetState === 'DISSOLVED') {
      soundType = 'beep';
      complianceStatus = 'SUSPENDED';
    }

    playBeep(soundType);

    setUnits(prevUnits => 
      prevUnits.map(unit => {
        if (unit.id === selectedUnitId && unit.stateChart) {
          return {
            ...unit,
            complianceStatus,
            stateChart: {
              ...unit.stateChart,
              currentState: targetState
            }
          };
        }
        return unit;
      })
    );

    // If budget exhausted state, we can simulate budget depletion
    if (triggerURN === "sem:event.budget_exhausted") {
      setBudgets(prevBudgets => 
        prevBudgets.map(b => {
          const matchingUnit = units.find(u => u.id === selectedUnitId);
          if (matchingUnit && b.id === matchingUnit.resourceBudgetURN) {
            return {
              ...b,
              remainingResources: {
                computeUnits: 0,
                storageTB: 12, // minimal leakage
                humanHours: 0,
                financialUnits: 0
              }
            };
          }
          return b;
        })
      );
    } else if (triggerURN === "sem:event.budget_replenished") {
      setBudgets(prevBudgets => 
        prevBudgets.map(b => {
          const matchingUnit = units.find(u => u.id === selectedUnitId);
          if (matchingUnit && b.id === matchingUnit.resourceBudgetURN) {
            const original = defaultBudgets.find(db => db.id === b.id) || b;
            return {
              ...b,
              remainingResources: { ...original.allocatedResources }
            };
          }
          return b;
        })
      );
    }

    const timestamp = new Date().toISOString();
    onAddAuditEntry({
      entryId: `entry:lifecycle-transition-${Date.now().toString().substring(8)}`,
      timestamp,
      eventType: 'RULE_TRIGGERED',
      description: `Transition event [${triggerURN}] successfully verified on [${selectedUnitId}]. Lifecycle mutated to [${targetState}] state. Compliance matrix updated.`,
      status: targetState === 'SUSPENDED' ? 'WARNING' : 'SUCCESS',
      hash: `blake3:${Math.abs(targetState.charCodeAt(0) * 888).toString(16).substring(0, 16)}`
    });
  };

  const isUnlimited = (val: any): boolean => {
    return typeof val === 'string' && val.toUpperCase() === 'UNLIMITED';
  };

  const formatResource = (val: any, suffix: string = ""): string => {
    if (isUnlimited(val)) return "UNLIMITED";
    if (typeof val === 'number') return `${val.toLocaleString()}${suffix}`;
    if (val === undefined || val === null) return `0${suffix}`;
    return `${val}${suffix}`;
  };

  const getPercentage = (rem: any, alloc: any): number => {
    if (isUnlimited(rem) || isUnlimited(alloc)) return 100;
    const r = parseFloat(rem);
    const a = parseFloat(alloc);
    if (isNaN(r) || isNaN(a) || a === 0) return 0;
    return (r / a) * 100;
  };

  const triggerSimulationTransition = (triggerURN: string, targetState: string, guardCondition: string, guardImplementation?: string) => {
    if (simulatingTransition) return;
    playBeep('click');
    setSimulatingTransition(true);
    setSimulationStep("Initiating state mutation request...");

    // Determine if it passes the guard
    let passes = false;
    let failReason = "";
    let guardResultString = "";

    const activeUnit = units.find(u => u.id === selectedUnitId) || units[0];

    if (guardCondition === "G3.Decision.Approved") {
      passes = g3ApprovedSimulated;
      if (!passes) failReason = "G3 Council Vote is set to 'Declined'.";
      guardResultString = passes 
        ? `PASS (Decision: decision:${activeUnit.id.includes('governance') ? 'dec.founding-governance-council' : 'dec.001'} approved)` 
        : `FAIL (Decision: activation decision rejected by council)`;
    } else if (guardCondition === "G4.Risk.CompliancePassed") {
      const hasPolicies = activeUnit.governanceScope.appliedPolicies.length > 0;
      const withinRisk = activeUnit.governanceScope.riskToleranceLevel <= 0.5;
      passes = hasPolicies && withinRisk;
      if (!hasPolicies) failReason = "No applied policies bound to unit.";
      else if (!withinRisk) failReason = `Risk tolerance level (${activeUnit.governanceScope.riskToleranceLevel}) exceeds maximum allowed (0.5).`;
      guardResultString = passes 
        ? `PASS (G4: Compliance vetting passed. Verified ${activeUnit.governanceScope.appliedPolicies.length} policies under risk limit of 0.5)` 
        : `FAIL (G4: Compliance failed. ${failReason})`;
    } else if (guardCondition === "G1.StrategicGoal.Realigned") {
      const hasGoals = activeUnit.linkedGoals && activeUnit.linkedGoals.length > 0;
      passes = hasGoals;
      if (!passes) failReason = "No active strategic goals linked to organization unit.";
      guardResultString = passes 
        ? `PASS (G1: Goal realignment verified. Confirmed on ${activeUnit.linkedGoals?.join(', ')})` 
        : `FAIL (G1: Realignment failed. ${failReason})`;
    } else {
      // standard unit transitions (like budget_exhausted)
      passes = true;
      guardResultString = `PASS (Unconditional transition state change verified)`;
    }

    // Sequence simulation steps
    setTimeout(() => {
      setSimulationStep(`Evaluating Guard Matrix [${guardCondition}]...`);
      setTimeout(() => {
        setSimulationStep(`Vetting Implementation: ${guardImplementation || 'fn:default()'}`);
        setTimeout(() => {
          if (passes) {
            setSimulationStep("Cryptographic signature approved. Writing to governance ledger...");
            setTimeout(() => {
              // Commit changes
              setUnits(prev => prev.map(u => {
                if (u.id === activeUnit.id) {
                  const newHistoryEntry: StateHistoryEntry = {
                    from: u.currentState || "INITIALIZED",
                    to: targetState,
                    timestamp: new Date().toISOString(),
                    triggerEvent: triggerURN,
                    guardResult: guardResultString
                  };
                  return {
                    ...u,
                    currentState: targetState,
                    stateHistory: [newHistoryEntry, ...(u.stateHistory || [])]
                  };
                }
                return u;
              }));

              // Play success tone
              playBeep('success');
              setSimulatingTransition(false);
              setSimulationStep("");

              // Add main audit ledger entry
              onAddAuditEntry({
                entryId: `entry:g-transition-${Date.now().toString().substring(8)}`,
                timestamp: new Date().toISOString(),
                eventType: 'RULE_TRIGGERED',
                description: `CIM Lifecycle transition successfully committed on [${activeUnit.id}]: mutated state to [${targetState}]. Guard verification status: ${guardResultString}`,
                status: 'SUCCESS',
                hash: `blake3:${Math.abs(targetState.charCodeAt(0) * 12345).toString(16).substring(0, 16)}`
              });

              // Telemetry update
              onUpdateSnapshot(p => ({
                ...p,
                statementsEnforced: p.statementsEnforced + 5,
                totalStatements: p.totalStatements + 8
              }));

            }, 800);
          } else {
            setSimulationStep(`⚠️ TRANSITION BLOCKED: ${failReason}`);
            playBeep('alert');
            setTimeout(() => {
              setSimulatingTransition(false);
              setSimulationStep("");
            }, 3000);
          }
        }, 850);
      }, 750);
    }, 650);
  };

  const resetUnitToInitialized = () => {
    playBeep('reset');
    setUnits(prev => prev.map(u => {
      if (u.id === selectedUnitId) {
        return {
          ...u,
          currentState: 'INITIALIZED',
          stateHistory: [
            {
              from: u.currentState || 'ACTIVE',
              to: 'INITIALIZED',
              timestamp: new Date().toISOString(),
              triggerEvent: 'sem:event.governance_reset',
              guardResult: 'PASS (Manual debugging override triggers initial onboarding state)'
            },
            ...(u.stateHistory || [])
          ]
        };
      }
      return u;
    }));
    
    onAddAuditEntry({
      entryId: `entry:reset-initialized-${Date.now().toString().substring(8)}`,
      timestamp: new Date().toISOString(),
      eventType: 'INTEGRITY_VERIFICATION',
      description: `Manual administrative override: Reset [${selectedUnitId}] back to [INITIALIZED] state for onboarding simulation.`,
      status: 'WARNING',
      hash: `blake3:${Math.abs(selectedUnitId.charCodeAt(0) * 444).toString(16).substring(0, 16)}`
    });
  };

  const selectedUnit = units.find(u => u.id === selectedUnitId) || units[0];
  const associatedBudget = budgets.find(b => b.id === selectedUnit.resourceBudgetURN);

  return (
    <div id="org-registry-container" className="flex-1 flex flex-col justify-between space-y-4">
      <div>
        <h3 id="org-registry-header" className="text-xs font-bold uppercase pb-1 border-b border-[#141414]/40 flex justify-between items-center">
          <span>Organization & Resource Governance</span>
          <span className="font-mono text-[8px] bg-indigo-950 text-white px-1.5 uppercase">CIM Organization Units</span>
        </h3>
        <p id="org-registry-desc" className="text-[9px] opacity-80 mt-1 leading-normal mb-3">
          Monitor structure, trace resource consumption thresholds, and model state charts for authorized ECOS organization units. Enforce risk tolerances, policy scopes, and budget gates.
        </p>

        <div id="org-registry-grid" className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          
          {/* LEFT COLUMN: SELECTOR & TREE */}
          <div id="org-selector-panel" className="lg:col-span-5 flex flex-col gap-3">
            
            {/* Visual Hierarchy / list card */}
            <div id="org-units-list-card" className="border border-[#141414] p-2 bg-[#D1D0CC]/30 flex flex-col flex-1">
              <span className="text-[8px] font-mono opacity-60 uppercase mb-2 block">Organization Unit Hierarchy</span>
              
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
                {units.map((unit) => {
                  const isSelected = unit.id === selectedUnitId;
                  const isChild = !!unit.parentUnitURN;

                  let complianceBadge = "bg-green-800/10 text-green-800 border-green-800/20";
                  if (unit.complianceStatus === 'SUSPENDED') {
                    complianceBadge = "bg-red-800/10 text-red-800 border-red-800/20";
                  }

                  return (
                    <button
                      id={`org-unit-btn-${unit.id.replace(/[:\.]/g, '-')}`}
                      key={unit.id}
                      onClick={() => { playBeep('click'); setSelectedUnitId(unit.id); }}
                      className={`w-full text-left p-2 border transition-all flex flex-col justify-between ${
                        isChild ? 'ml-3 w-[calc(100%-12px)] border-l-2 border-l-[#141414]/30' : ''
                      } ${
                        isSelected 
                          ? 'bg-[#141414] text-[#E4E3E0] border-[#141414]' 
                          : 'bg-[#E4E3E0] hover:bg-[#D1D0CC]/70 text-[#141414] border-[#141414]/20'
                      }`}
                    >
                      <div className="flex justify-between items-start w-full">
                        <span className="text-[9.5px] font-bold uppercase truncate pr-1">
                          {isChild ? '└ ' : '■ '} {unit.canonicalName}
                        </span>
                        <span className={`text-[6.5px] font-mono border px-1 uppercase ${complianceBadge}`}>
                          {unit.stateChart?.currentState || 'ACTIVE'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center w-full mt-2 font-mono text-[7px] opacity-75">
                        <span className="truncate max-w-[140px]">{unit.id}</span>
                        <span className="bg-[#141414]/10 text-[#141414] px-1 dark:text-[#E4E3E0] dark:bg-white/10 uppercase text-[6px]">
                          {unit.unitType}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SCHEMA IMPORTER */}
            <div id="org-importer-card" className="border border-[#141414] p-2 bg-[#D1D0CC]/30 space-y-2 flex flex-col">
              <div className="flex justify-between items-center border-b border-[#141414]/10 pb-1.5">
                <span className="text-[8px] font-mono opacity-60 uppercase">Import ECOS Org JSON-LD</span>
                <button 
                  id="preset-org-btn"
                  onClick={loadPreset}
                  className="text-[7.5px] font-mono bg-[#141414] text-[#E4E3E0] px-1.5 py-0.5 hover:bg-[#333333] transition-colors"
                >
                  Load ECOS Preset Graph
                </button>
              </div>

              <textarea
                id="org-json-textarea"
                rows={4}
                value={jsonInput}
                onChange={(e) => {
                  setJsonInput(e.target.value);
                  validateJSONLD(e.target.value);
                }}
                placeholder='Paste organizational JSON-LD context graph here...'
                className="w-full p-1.5 border border-[#141414] bg-[#E4E3E0] text-[#141414] font-mono text-[8.5px] leading-tight focus:outline-none focus:ring-1 focus:ring-indigo-950 scrollbar-thin resize-none"
              />

              {validationStatus.status !== 'IDLE' && (
                <div id="org-validation-box" className={`p-1.5 border flex items-start gap-1 text-[8px] ${
                  validationStatus.status === 'VALID' 
                    ? 'bg-green-100 text-green-950 border-green-800/20' 
                    : 'bg-red-100 text-red-950 border-red-800/20'
                }`}>
                  {validationStatus.status === 'VALID' ? (
                    <CheckCircle className="w-3 h-3 text-green-800 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-red-700 shrink-0 mt-0.5" />
                  )}
                  <p className="leading-tight font-mono">{validationStatus.message}</p>
                </div>
              )}

              <button
                id="register-org-btn"
                onClick={handleRegister}
                disabled={validationStatus.status !== 'VALID'}
                className={`w-full py-1.5 font-mono text-[9px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 ${
                  validationStatus.status === 'VALID'
                    ? 'bg-indigo-950 text-white hover:bg-indigo-900'
                    : 'bg-[#c2c1bd] text-[#141414]/40 border border-[#141414]/10 cursor-not-allowed'
                }`}
              >
                <Database className="w-3 h-3" />
                Commit Org Structures
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN: INSPECTOR & SIMULATOR */}
          <div id="org-inspection-panel" className="lg:col-span-7 border border-[#141414] bg-[#E4E3E0] flex flex-col justify-between">
            
            {/* Context Header */}
            <div className="p-3 border-b border-[#141414] bg-[#D1D0CC]/60 flex justify-between items-start">
              <div>
                <span className="text-[7.5px] font-mono bg-[#141414] text-[#E4E3E0] px-1 uppercase tracking-wide">
                  {selectedUnit.type}
                </span>
                <h4 className="text-xs font-bold uppercase mt-1 text-[#141414]">{selectedUnit.canonicalName}</h4>
                <p className="text-[8px] font-mono opacity-70 mt-0.5">{selectedUnit.id}</p>
              </div>

              <div className="text-right">
                <span className="text-[7px] font-mono opacity-50 uppercase block">RISK TOLERANCE</span>
                <span className="text-sm font-mono font-bold text-indigo-950">{selectedUnit.governanceScope.riskToleranceLevel.toFixed(2)}</span>
              </div>
            </div>

            {/* Tab switchers for sub views */}
            <div id="org-sub-tabs" className="grid grid-cols-4 gap-[1px] bg-[#141414] p-[1px] border-b border-[#141414]">
              {(['details', 'budget', 'lifecycle', 'raw_ld'] as const).map((tab) => (
                <button
                  id={`org-tab-btn-${tab}`}
                  key={tab}
                  onClick={() => { playBeep('click'); setOrgTab(tab); }}
                  className={`py-1 text-[8.5px] font-mono uppercase tracking-tighter transition-colors ${
                    orgTab === tab 
                      ? 'bg-[#E4E3E0] text-[#141414] font-bold' 
                      : 'bg-[#D1D0CC]/60 text-[#141414]/70 hover:text-[#141414]'
                  }`}
                >
                  {tab === 'details' ? 'Scope' : tab === 'budget' ? 'Budget' : tab === 'lifecycle' ? 'Lifecycle' : 'Context-LD'}
                </button>
              ))}
            </div>

            {/* TAB PANEL VIEWPORT */}
            <div id="org-sub-viewport" className="p-3 flex-1 min-h-[220px] max-h-[300px] overflow-y-auto scrollbar-thin bg-[#E4E3E0]">
              <AnimatePresence mode="wait">
                
                {/* 1. SCOPE / DETAILS */}
                {orgTab === 'details' && (
                  <motion.div
                    key="scope"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3.5 text-[9.5px]"
                  >
                    <div>
                      <span className="font-mono text-[8px] opacity-65 uppercase block border-b border-[#141414]/10 pb-0.5 mb-1">Mission Mandate</span>
                      <p className="leading-relaxed text-[#141414] italic">"{selectedUnit.definition}"</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="border border-[#141414]/15 p-2 bg-[#D1D0CC]/20 space-y-1">
                        <span className="font-mono text-[8px] opacity-60 uppercase block">Governance Domain</span>
                        <div className="font-mono text-[7.5px] space-y-0.5 break-all">
                          <div>KERNEL: <span className="font-bold">{selectedUnit.governanceKernelURN}</span></div>
                          {selectedUnit.parentUnitURN && (
                            <div>PARENT: <span className="font-bold">{selectedUnit.parentUnitURN}</span></div>
                          )}
                        </div>
                      </div>

                      <div className="border border-[#141414]/15 p-2 bg-[#D1D0CC]/20 flex flex-col justify-between">
                        <div>
                          <span className="font-mono text-[8px] opacity-60 uppercase block">Compliance Level</span>
                          <div className="flex items-center gap-1.5 mt-1 font-bold text-xs uppercase text-green-950 font-sans">
                            <span className={`w-2 h-2 rounded-full ${
                              selectedUnit.stateChart?.currentState === 'SUSPENDED' ? 'bg-red-600' : 'bg-green-600'
                            }`} />
                            {selectedUnit.stateChart?.currentState || 'ACTIVE'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Applied Policies list */}
                    <div className="border border-[#141414]/15 p-2 bg-[#D1D0CC]/20 space-y-1.5">
                      <span className="font-mono text-[8px] opacity-60 uppercase block">Bound Constituted Policy Scopes</span>
                      {selectedUnit.governanceScope.appliedPolicies.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {selectedUnit.governanceScope.appliedPolicies.map((policy, i) => (
                            <span key={i} className="border border-indigo-950/20 bg-indigo-50 text-indigo-950 font-mono text-[7px] px-2 py-0.5 uppercase">
                              🛡️ {policy}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="text-[8px] italic opacity-60">No explicit policies bound. Unrestricted operational clearance applies.</div>
                      )}
                    </div>

                    {selectedUnit.linkedGoals && selectedUnit.linkedGoals.length > 0 && (
                      <div className="border border-[#141414]/15 p-2 bg-[#D1D0CC]/20 space-y-1.5">
                        <span className="font-mono text-[8px] opacity-60 uppercase block">Bound Strategic Goals</span>
                        <div className="font-mono text-[7.5px] text-[#141414] font-bold">
                          {selectedUnit.linkedGoals.map((g, i) => (
                            <span key={i} className="bg-[#141414] text-[#E4E3E0] px-1 py-0.2 uppercase block w-max">🎯 {g}</span>
                          ))}
                        </div>
                      </div>
                    )}

                  </motion.div>
                )}

                {/* 2. RESOURCE BUDGET */}
                {orgTab === 'budget' && (
                  <motion.div
                    key="budget"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3.5 text-[9.5px]"
                  >
                    {associatedBudget ? (
                      <div className="space-y-3">
                        <div className="border border-[#141414]/15 p-2 bg-[#D1D0CC]/20">
                          <span className="font-mono text-[8px] opacity-60 uppercase block">Bound Resource BudgetSegment</span>
                          <span className="font-bold text-indigo-950 text-[10px] uppercase font-mono block mt-0.5">{associatedBudget.canonicalName}</span>
                          <p className="text-[8px] opacity-80 leading-normal mt-0.5 italic">"{associatedBudget.definition}"</p>
                        </div>

                        {/* Progress Bars for resource groups */}
                        <div className="space-y-2.5">
                          
                          {/* Compute Units */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[8.5px] font-mono">
                              <span className="flex items-center gap-1"><Cpu className="w-3.5 h-3.5" /> COMPUTE POWER</span>
                              <span>
                                <strong className="text-indigo-950">{formatResource(associatedBudget.remainingResources.computeUnits)}</strong> 
                                <span className="opacity-60"> / {formatResource(associatedBudget.allocatedResources.computeUnits, " Units")}</span>
                              </span>
                            </div>
                            <div className="w-full h-3 bg-[#D1D0CC] border border-[#141414]/30 relative overflow-hidden">
                              <div 
                                className={`h-full transition-all duration-500 ${
                                  isUnlimited(associatedBudget.remainingResources.computeUnits) || Number(associatedBudget.remainingResources.computeUnits) > 30000 
                                    ? 'bg-green-700' 
                                    : 'bg-red-700'
                                }`}
                                style={{ width: `${getPercentage(associatedBudget.remainingResources.computeUnits, associatedBudget.allocatedResources.computeUnits)}%` }}
                              />
                            </div>
                          </div>

                          {/* Storage */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[8.5px] font-mono">
                              <span className="flex items-center gap-1"><HardDrive className="w-3.5 h-3.5" /> DATA SOVEREIGN STORAGE</span>
                              <span>
                                <strong className="text-indigo-950">{formatResource(associatedBudget.remainingResources.storageTB, " TB")}</strong> 
                                <span className="opacity-60"> / {formatResource(associatedBudget.allocatedResources.storageTB, " TB")}</span>
                              </span>
                            </div>
                            <div className="w-full h-3 bg-[#D1D0CC] border border-[#141414]/30 relative overflow-hidden">
                              <div 
                                className="h-full bg-indigo-900 transition-all duration-500"
                                style={{ width: `${getPercentage(associatedBudget.remainingResources.storageTB, associatedBudget.allocatedResources.storageTB)}%` }}
                              />
                            </div>
                          </div>

                          {/* Human Hours */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[8.5px] font-mono">
                              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> HUMAN LABOR AUDIT HOURS</span>
                              <span>
                                <strong className="text-indigo-950">{formatResource(associatedBudget.remainingResources.humanHours)}</strong> 
                                <span className="opacity-60"> / {formatResource(associatedBudget.allocatedResources.humanHours, " Hrs")}</span>
                              </span>
                            </div>
                            <div className="w-full h-3 bg-[#D1D0CC] border border-[#141414]/30 relative overflow-hidden">
                              <div 
                                className="h-full bg-slate-800 transition-all duration-500"
                                style={{ width: `${getPercentage(associatedBudget.remainingResources.humanHours, associatedBudget.allocatedResources.humanHours)}%` }}
                              />
                            </div>
                          </div>

                          {/* Optional Financial resources if parsed */}
                          {associatedBudget.allocatedResources.financialUnits !== undefined && (
                            <div className="space-y-1">
                              <div className="flex justify-between items-center text-[8.5px] font-mono">
                                <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> ECOS TOKENS DISPATCH MATRIX</span>
                                <span>
                                  <strong className="text-indigo-950">{formatResource(associatedBudget.remainingResources.financialUnits)}</strong> 
                                  <span className="opacity-60"> / {formatResource(associatedBudget.allocatedResources.financialUnits, " ECOS")}</span>
                                </span>
                              </div>
                              <div className="w-full h-3 bg-[#D1D0CC] border border-[#141414]/30 relative overflow-hidden">
                                <div 
                                  className="h-full bg-emerald-700 transition-all duration-500"
                                  style={{ width: `${getPercentage(associatedBudget.remainingResources.financialUnits, associatedBudget.allocatedResources.financialUnits)}%` }}
                                />
                              </div>
                            </div>
                          )}

                        </div>
                      </div>
                    ) : (
                      <div className="text-[9px] italic opacity-60 text-center py-8">No resource budget limits mapped to this organization unit.</div>
                    )}
                  </motion.div>
                )}

                {/* 3. LIFECYCLE STATE CHART SIMULATOR */}
                {orgTab === 'lifecycle' && (
                  <motion.div
                    key="lifecycle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 font-mono text-[8.5px]"
                  >
                    {/* Header with Selector */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-2 bg-[#D1D0CC]/20 border border-[#141414]/15 gap-2">
                      <div className="leading-tight">
                        <span className="text-[7px] opacity-60 uppercase block">State Machine Context</span>
                        <span className="font-bold text-indigo-950 uppercase">
                          {simulationType === 'master' 
                            ? 'CIM State Machine (G1/G3/G4 Guards)' 
                            : `${selectedUnit.stateChart?.canonicalName || 'Unit-Specific Machine'}`}
                        </span>
                      </div>
                      <div className="flex gap-1.5 w-full sm:w-auto">
                        <button
                          onClick={() => { playBeep('click'); setSimulationType('master'); }}
                          className={`px-2 py-1 text-[7.5px] uppercase border font-bold transition-all ${
                            simulationType === 'master' 
                              ? 'bg-[#141414] text-[#E4E3E0] border-[#141414]' 
                              : 'bg-transparent text-[#141414] border-[#141414]/25 hover:bg-[#141414]/5'
                          }`}
                        >
                          CIM Master Flow
                        </button>
                        <button
                          onClick={() => { playBeep('click'); setSimulationType('unit_specific'); }}
                          className={`px-2 py-1 text-[7.5px] uppercase border font-bold transition-all ${
                            simulationType === 'unit_specific' 
                              ? 'bg-[#141414] text-[#E4E3E0] border-[#141414]' 
                              : 'bg-transparent text-[#141414] border-[#141414]/25 hover:bg-[#141414]/5'
                          }`}
                        >
                          Unit Specific
                        </button>
                      </div>
                    </div>

                    {/* Master Machine View */}
                    {simulationType === 'master' ? (
                      <div className="space-y-3">
                        {/* Map flow diagram */}
                        <div className="border border-[#141414]/15 bg-[#E4E3E0] p-3 flex flex-col md:flex-row justify-around items-center gap-4 relative overflow-hidden">
                          <div className="absolute top-1 right-1 px-1 border border-indigo-950/20 bg-indigo-50 text-indigo-950 text-[6px] uppercase font-bold tracking-tight">
                            Schema: CIM_StateChart
                          </div>

                          {/* Node 1: INITIALIZED */}
                          <div className={`p-2 border-2 w-32 text-center transition-all ${
                            selectedUnit.currentState === 'INITIALIZED'
                              ? 'border-indigo-950 bg-indigo-50 text-indigo-950 font-bold shadow-md'
                              : 'border-[#141414]/20 bg-transparent text-[#141414]/40'
                          }`}>
                            <div className="text-[7px] opacity-60">NODE 01</div>
                            <div className="text-[9px] uppercase tracking-wider">INITIALIZED</div>
                            <div className="text-[6.5px] mt-1 font-sans italic">Pending Activation</div>
                          </div>

                          <div className="text-[#141414]/40 text-xs hidden md:block">➔</div>

                          {/* Node 2: ACTIVE */}
                          <div className={`p-2 border-2 w-32 text-center transition-all ${
                            selectedUnit.currentState === 'ACTIVE'
                              ? 'border-green-800 bg-green-50 text-green-950 font-bold shadow-md'
                              : 'border-[#141414]/20 bg-transparent text-[#141414]/40'
                          }`}>
                            <div className="text-[7px] opacity-60">NODE 02</div>
                            <div className="text-[9px] uppercase tracking-wider">ACTIVE</div>
                            <div className="text-[6.5px] mt-1 font-sans italic">Fully Operational</div>
                          </div>

                          <div className="text-[#141414]/40 text-xs hidden md:block">➔</div>

                          {/* Node 3: RESTRUCTURING */}
                          <div className={`p-2 border-2 w-32 text-center transition-all ${
                            selectedUnit.currentState === 'RESTRUCTURING'
                              ? 'border-amber-600 bg-amber-50 text-amber-950 font-bold shadow-md'
                              : 'border-[#141414]/20 bg-transparent text-[#141414]/40'
                          }`}>
                            <div className="text-[7px] opacity-60">NODE 03</div>
                            <div className="text-[9px] uppercase tracking-wider">RESTRUCTURING</div>
                            <div className="text-[6.5px] mt-1 font-sans italic">Re-aligning Goals</div>
                          </div>
                        </div>

                        {/* Interactive Guard Controller Panel */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          
                          {/* Live Guard Simulator variables */}
                          <div className="border border-[#141414]/15 bg-[#E4E3E0] p-3 space-y-2">
                            <span className="text-[7.5px] opacity-70 uppercase font-bold text-indigo-950 block border-b border-[#141414]/15 pb-1 flex justify-between">
                              <span>Security Guard Controller Cockpit</span>
                              <span className="text-[#141414]/60">Variables</span>
                            </span>

                            {/* G3 Variables */}
                            {selectedUnit.currentState === 'INITIALIZED' && (
                              <div className="space-y-2">
                                <p className="text-[8px] leading-relaxed text-[#141414]/80">
                                  To transition from <strong className="text-indigo-950">INITIALIZED</strong> to <strong className="text-indigo-950">ACTIVE</strong>, ECOS requires a G3 Decision Guard validation check:
                                  <code className="block p-1 bg-[#141414]/5 rounded font-mono text-[7px] mt-1 text-indigo-950">
                                    G3.Decision.Approved (fn:verifyDecisionApproved)
                                  </code>
                                </p>
                                <div className="p-2 border border-indigo-950/15 bg-[#D1D0CC]/20 space-y-1.5">
                                  <span className="text-[7px] opacity-75 font-bold uppercase block">Simulate Council Resolution Decision:</span>
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => { playBeep('click'); setG3ApprovedSimulated(true); }}
                                      className={`flex-1 py-1 border text-[7.5px] font-bold ${
                                        g3ApprovedSimulated 
                                          ? 'bg-green-700 text-white border-green-950' 
                                          : 'bg-transparent text-[#141414]/60 border-[#141414]/20 hover:bg-[#141414]/5'
                                      }`}
                                    >
                                      ✓ APPROVED
                                    </button>
                                    <button
                                      onClick={() => { playBeep('click'); setG3ApprovedSimulated(false); }}
                                      className={`flex-1 py-1 border text-[7.5px] font-bold ${
                                        !g3ApprovedSimulated 
                                          ? 'bg-red-700 text-white border-red-950' 
                                          : 'bg-transparent text-[#141414]/60 border-[#141414]/20 hover:bg-[#141414]/5'
                                      }`}
                                    >
                                      ✗ DECLINED
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* G4 Variables */}
                            {selectedUnit.currentState === 'ACTIVE' && (
                              <div className="space-y-2">
                                <p className="text-[8px] leading-relaxed text-[#141414]/80">
                                  To initiate restructuring from <strong className="text-indigo-950">ACTIVE</strong> to <strong className="text-indigo-950">RESTRUCTURING</strong>, ECOS checks policy compliance and risks:
                                  <code className="block p-1 bg-[#141414]/5 rounded font-mono text-[7px] mt-1 text-indigo-950">
                                    G4.Risk.CompliancePassed (fn:checkRiskCompliance)
                                  </code>
                                </p>
                                <div className="p-2 border border-[#141414]/15 bg-[#D1D0CC]/20 space-y-1 text-[7.5px]">
                                  <div className="flex justify-between">
                                    <span className="opacity-70">Bound Policies Count:</span>
                                    <span className="font-bold">{selectedUnit.governanceScope.appliedPolicies.length} policy scopes</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="opacity-70">Risk Tolerance Level:</span>
                                    <span className="font-bold">{selectedUnit.governanceScope.riskToleranceLevel} (Limit: &le; 0.5)</span>
                                  </div>
                                  <div className="pt-1 border-t border-[#141414]/10 mt-1 flex justify-between items-center text-green-700">
                                    <span>VETTING STATUS:</span>
                                    <span className="font-bold flex items-center gap-0.5">✓ READY TO RESTRUCTURE</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* G1 Variables */}
                            {selectedUnit.currentState === 'RESTRUCTURING' && (
                              <div className="space-y-2">
                                <p className="text-[8px] leading-relaxed text-[#141414]/80">
                                  To resolve restructuring and move back to <strong className="text-indigo-950">ACTIVE</strong>, ECOS requires a goal realignment validation check:
                                  <code className="block p-1 bg-[#141414]/5 rounded font-mono text-[7px] mt-1 text-indigo-950">
                                    G1.StrategicGoal.Realigned (fn:verifyStrategicRealignment)
                                  </code>
                                </p>
                                <div className="p-2 border border-[#141414]/15 bg-[#D1D0CC]/20 space-y-1 text-[7.5px]">
                                  <div className="flex justify-between">
                                    <span className="opacity-70">Strategic Goals Linked:</span>
                                    <span className="font-bold">{selectedUnit.linkedGoals?.length || 0} goals</span>
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {selectedUnit.linkedGoals?.map((g) => (
                                      <span key={g} className="bg-[#141414] text-[#E4E3E0] px-1 py-0.2 text-[6.5px]">🎯 {g}</span>
                                    ))}
                                  </div>
                                  <div className="pt-1 border-t border-[#141414]/10 mt-1 flex justify-between items-center text-green-700">
                                    <span>GOALS STATE:</span>
                                    <span className="font-bold">✓ REALIGNED</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Options to switch state manually or play debug reset */}
                            <div className="pt-2 border-t border-[#141414]/15 flex gap-1.5">
                              <button
                                onClick={resetUnitToInitialized}
                                className="flex-1 py-1 border border-[#141414]/20 bg-indigo-950 text-white hover:bg-indigo-900 text-[7px] uppercase tracking-tight font-bold flex items-center justify-center gap-0.5"
                              >
                                <RotateCw className="w-2.5 h-2.5" /> Initialize Unit
                              </button>
                            </div>

                          </div>

                          {/* Trigger state changes button and visual progress console */}
                          <div className="border border-[#141414]/15 bg-[#E4E3E0] p-3 flex flex-col justify-between space-y-2">
                            <div>
                              <span className="text-[7.5px] opacity-70 uppercase font-bold text-indigo-950 block border-b border-[#141414]/15 pb-1">
                                Execute Cryptographic Transition
                              </span>

                              {/* Simulation state actions */}
                              <div className="mt-2">
                                {simulatingTransition ? (
                                  <div className="p-2.5 border border-green-800 bg-[#141414] text-green-400 font-mono text-[7px] space-y-1.5 h-28 overflow-y-auto leading-normal">
                                    <div className="flex items-center gap-1">
                                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping"></span>
                                      <span>ECOS LEDGER VETTING RUNNING:</span>
                                    </div>
                                    <p className="text-white opacity-95">{simulationStep}</p>
                                    <p className="opacity-40 animate-pulse text-[6.5px]">Evaluating guards... Please stand by...</p>
                                  </div>
                                ) : (
                                  <div className="space-y-1.5">
                                    {selectedUnit.currentState === 'INITIALIZED' && (
                                      <button
                                        onClick={() => triggerSimulationTransition(
                                          "sem:event.org_approval", 
                                          "ACTIVE", 
                                          "G3.Decision.Approved", 
                                          "fn:verifyDecisionApproved(input.orgUnit.activationDecisionURN)"
                                        )}
                                        className="w-full text-left p-2 border border-[#141414] bg-[#141414] text-[#E4E3E0] hover:bg-indigo-950 hover:border-indigo-950 transition-colors flex flex-col justify-between"
                                      >
                                        <div className="flex justify-between items-center w-full">
                                          <span className="font-bold text-[8px] tracking-tight">TRIGGER: ORG_APPROVAL</span>
                                          <span className="text-[6.5px] bg-green-800 text-white px-1 py-0.2 font-mono">G3 GUARD</span>
                                        </div>
                                        <span className="text-[6px] opacity-60 leading-none mt-1 font-sans">Condition: activationDecisionURN == APPROVED</span>
                                        <div className="mt-2 w-full text-center bg-indigo-900 py-0.5 text-white font-bold text-[7.5px] uppercase flex items-center justify-center gap-1">
                                          <Play className="w-2.5 h-2.5" /> Validate & Onboard to Active
                                        </div>
                                      </button>
                                    )}

                                    {selectedUnit.currentState === 'ACTIVE' && (
                                      <button
                                        onClick={() => triggerSimulationTransition(
                                          "sem:event.restructuring_req", 
                                          "RESTRUCTURING", 
                                          "G4.Risk.CompliancePassed", 
                                          "fn:checkRiskCompliance(input.orgUnit.governanceScope.appliedPolicies, input.orgUnit.riskToleranceLevel)"
                                        )}
                                        className="w-full text-left p-2 border border-[#141414] bg-[#141414] text-[#E4E3E0] hover:bg-indigo-950 hover:border-indigo-950 transition-colors flex flex-col justify-between"
                                      >
                                        <div className="flex justify-between items-center w-full">
                                          <span className="font-bold text-[8px] tracking-tight">TRIGGER: RESTRUCTURING_REQ</span>
                                          <span className="text-[6.5px] bg-[#b45309] text-white px-1 py-0.2 font-mono">G4 GUARD</span>
                                        </div>
                                        <span className="text-[6px] opacity-60 leading-none mt-1 font-sans">Condition: appliedPolicies &gt; 0 &amp;&amp; riskTolerance &le; 0.5</span>
                                        <div className="mt-2 w-full text-center bg-indigo-900 py-0.5 text-white font-bold text-[7.5px] uppercase flex items-center justify-center gap-1">
                                          <Play className="w-2.5 h-2.5" /> Begin Restructuring Phase
                                        </div>
                                      </button>
                                    )}

                                    {selectedUnit.currentState === 'RESTRUCTURING' && (
                                      <button
                                        onClick={() => triggerSimulationTransition(
                                          "sem:event.restructuring_done", 
                                          "ACTIVE", 
                                          "G1.StrategicGoal.Realigned", 
                                          "fn:verifyStrategicRealignment(input.orgUnit.linkedGoals)"
                                        )}
                                        className="w-full text-left p-2 border border-[#141414] bg-[#141414] text-[#E4E3E0] hover:bg-indigo-950 hover:border-indigo-950 transition-colors flex flex-col justify-between"
                                      >
                                        <div className="flex justify-between items-center w-full">
                                          <span className="font-bold text-[8px] tracking-tight">TRIGGER: RESTRUCTURING_DONE</span>
                                          <span className="text-[6.5px] bg-indigo-900 text-white px-1 py-0.2 font-mono">G1 GUARD</span>
                                        </div>
                                        <span className="text-[6px] opacity-60 leading-none mt-1 font-sans">Condition: linkedGoals.length &gt; 0</span>
                                        <div className="mt-2 w-full text-center bg-indigo-900 py-0.5 text-white font-bold text-[7.5px] uppercase flex items-center justify-center gap-1">
                                          <Play className="w-2.5 h-2.5" /> Commit Goal Alignment & Re-Activate
                                        </div>
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="p-1 border border-indigo-950/15 bg-indigo-50/50 text-indigo-950 text-[7px] text-center italic">
                              *Master flow implements strict digital state checks.
                            </div>
                          </div>

                        </div>
                      </div>
                    ) : (
                      /* Unit Specific Flow */
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        
                        {/* Active Status node lights */}
                        <div className="border border-[#141414]/15 p-3 bg-[#E4E3E0] flex flex-col justify-between items-center text-center">
                          <div>
                            <span className="text-[7.5px] opacity-60 uppercase block">Active Lifecycle Node State</span>
                            <span id="active-state-node" className="text-base font-bold text-indigo-950 mt-1 block tracking-wider uppercase">
                              {selectedUnit.stateChart?.currentState || "ACTIVE"}
                            </span>
                          </div>

                          {/* Interactive schematic lights */}
                          <div className="flex gap-2 mt-3">
                            {['ACTIVE', 'SUSPENDED', 'DISSOLVED', 'REORGANIZATION'].map((st) => {
                              const isCurrent = (selectedUnit.stateChart?.currentState || 'ACTIVE') === st;
                              const existsInChart = selectedUnit.stateChart?.states?.[st] !== undefined || st === 'ACTIVE';

                              if (!existsInChart) return null;

                              let color = "bg-[#D1D0CC]/30 border-[#141414]/15 text-[#141414]/30";
                              if (isCurrent) {
                                if (st === 'ACTIVE') color = "bg-green-600 text-white border-green-800 shadow-sm shadow-green-500/20";
                                else if (st === 'SUSPENDED') color = "bg-red-600 text-white border-red-800 shadow-sm shadow-red-500/20";
                                else if (st === 'DISSOLVED') color = "bg-slate-700 text-white border-slate-900";
                                else color = "bg-amber-500 text-black border-amber-600";
                              }

                              return (
                                <div 
                                  key={st} 
                                  className={`px-1.5 py-0.5 border text-[6.5px] font-bold tracking-tight uppercase ${color}`}
                                >
                                  {st}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Traditional trigger transitions */}
                        <div className="border border-[#141414]/15 p-3 bg-[#E4E3E0] space-y-2">
                          <span className="text-[7.5px] opacity-65 uppercase font-bold text-indigo-950 block border-b border-[#141414]/15 pb-1">
                            Trigger Governance State Mutations
                          </span>

                          {selectedUnit.stateChart && selectedUnit.stateChart.states[selectedUnit.stateChart.currentState]?.allowedTransitions?.length > 0 ? (
                            <div className="space-y-1.5">
                              {selectedUnit.stateChart.states[selectedUnit.stateChart.currentState].allowedTransitions.map((trans, i) => {
                                return (
                                  <button
                                    id={`trigger-transition-btn-${i}`}
                                    key={i}
                                    onClick={() => handleTriggerTransition(trans.triggerEventURN, trans.targetState)}
                                    className="w-full text-left p-1.5 border border-[#141414] bg-[#141414] text-[#E4E3E0] hover:bg-indigo-950 hover:border-indigo-950 transition-colors flex flex-col"
                                  >
                                    <div className="flex justify-between items-center w-full">
                                      <span className="font-bold text-[7.5px] tracking-tight">{trans.triggerEventURN.split('.').pop()?.toUpperCase()}</span>
                                      <span className="text-[6px] opacity-60">to {trans.targetState}</span>
                                    </div>
                                    <span className="text-[6.5px] opacity-60 break-all leading-none mt-0.5 font-sans">Guard: {trans.guardCondition}</span>
                                  </button>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-[7.5px] italic text-[#141414]/60">
                                Terminal State reached. No transitions are allowed from this state.
                              </p>
                              {(selectedUnit.stateChart?.currentState === 'SUSPENDED' || selectedUnit.stateChart?.currentState === 'DISSOLVED') && (
                                <button
                                  id="replenish-reset-btn"
                                  onClick={() => handleTriggerTransition("sem:event.budget_replenished", "ACTIVE")}
                                  className="w-full py-1 border border-[#141414] bg-indigo-950 text-white hover:bg-indigo-900 text-[8px] uppercase tracking-wider flex items-center justify-center gap-1"
                                >
                                  <RotateCw className="w-3 h-3" /> Replenish & Reactivate Unit
                                </button>
                              )}
                            </div>
                          )}
                        </div>

                      </div>
                    )}

                    {/* State History Ledger Section (The core trace requirement) */}
                    <div className="border border-[#141414]/15 bg-[#E4E3E0] p-3 space-y-2">
                      <span className="text-[8px] opacity-80 uppercase font-bold text-indigo-950 block border-b border-[#141414]/15 pb-1 flex justify-between">
                        <span>Organization Unit Lifecycle State History Audit Trace</span>
                        <span className="text-[6.5px] px-1 bg-indigo-950 text-white">LEDGER SEGMENT</span>
                      </span>

                      {selectedUnit.stateHistory && selectedUnit.stateHistory.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left font-mono text-[7px] leading-relaxed">
                            <thead>
                              <tr className="border-b border-[#141414]/20 opacity-60">
                                <th className="py-1">FROM ➔ TO STATE</th>
                                <th className="py-1">TIMESTAMP</th>
                                <th className="py-1">TRIGGER EVENT</th>
                                <th className="py-1">GUARD EVALUATION RESULT & PROOF hash</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedUnit.stateHistory.map((hist, idx) => (
                                <tr key={idx} className="border-b border-[#141414]/10 hover:bg-[#141414]/5 transition-colors">
                                  <td className="py-1.5 font-bold">
                                    <span className="bg-[#141414]/10 px-1 py-0.5 rounded">{hist.from}</span>
                                    <span className="mx-1 text-indigo-950">➔</span>
                                    <span className={`px-1 py-0.5 rounded font-bold ${
                                      hist.to === 'ACTIVE' 
                                        ? 'bg-green-100 text-green-900' 
                                        : hist.to === 'SUSPENDED' 
                                        ? 'bg-red-100 text-red-900' 
                                        : hist.to === 'RESTRUCTURING' 
                                        ? 'bg-amber-100 text-amber-900' 
                                        : 'bg-[#141414]/10'
                                    }`}>{hist.to}</span>
                                  </td>
                                  <td className="py-1.5 opacity-85">
                                    {new Date(hist.timestamp).toLocaleString()}
                                  </td>
                                  <td className="py-1.5 opacity-70 break-all select-all font-bold">
                                    {hist.triggerEvent}
                                  </td>
                                  <td className="py-1.5 font-sans text-[#141414] font-medium max-w-xs break-words">
                                    <span className="font-mono text-[7.5px] text-indigo-950 block">{hist.guardResult}</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-4 italic text-[#141414]/50">
                          No state history traced on governance ledger segment yet.
                        </div>
                      )}
                    </div>

                  </motion.div>
                )}

                {/* 4. RAW CONTEXT */}
                {orgTab === 'raw_ld' && (
                  <motion.div
                    key="raw_ld"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-2 font-mono text-[8px]"
                  >
                    <span className="text-[7.5px] opacity-60 uppercase block">ECOS Canonical JSON-LD representation</span>
                    <pre className="p-2 border border-[#141414] bg-[#141414] text-green-400 max-h-[220px] overflow-y-auto pr-1 select-all scrollbar-thin">
                      {JSON.stringify({
                        "@context": {
                          "cim": "https://ultrathink.ecos/canonical/v2/",
                          "sem": "https://ultrathink.ecos/semantics/v1/",
                          "org": "https://ultrathink.ecos/organization/",
                          "budget": "https://ultrathink.ecos/budget/"
                        },
                        "@graph": [
                          selectedUnit,
                          ...(associatedBudget ? [associatedBudget] : [])
                        ]
                      }, null, 2)}
                    </pre>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Footer summary */}
            <div className="p-2 border-t border-[#141414]/20 bg-[#D1D0CC]/30 flex justify-between items-center text-[7.5px] font-mono text-[#141414]/80">
              <span>LEDGER PROOFS: VERIFIED</span>
              <span>COMPLIANCE POLICY GAUNTLET: ENABLED</span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
