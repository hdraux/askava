export type TaskType =
  | "T1"
  | "T2"
  | "T3"
  | "T4"
  | "T5"
  | "T6"
  | "T7"
  | "T8"
  | "T9"
  | "T10";

export type IntendedUse = "U1" | "U2" | "U3" | "U4" | "U5";
export type Impact = "I1" | "I2" | "I3";
export type Evidence = "E1" | "E2" | "E3";
export type VerificationLevel = 0 | 1 | 2 | 3 | 4;

export interface Inputs {
  task: TaskType;
  use: IntendedUse;
  impact: Impact;
  evidence: Evidence;
}

export interface ScoringConfig {
  baseScores: Record<IntendedUse, number>;
  taskAdjustments: Record<TaskType, number>;
  adjustments: {
    impactHigh: number;
    noEvidence: number;
  };
  maxLevel: VerificationLevel;
}

export interface EscalationTrigger {
  id: string;
  condition: Partial<Record<keyof Inputs, string[]>>;
}

export interface EscalationConfig {
  minLevelIfTriggered: VerificationLevel;
  triggers: EscalationTrigger[];
}

export interface ScoreBreakdown {
  base: number;
  adjustments: {
    impact: number;
    taskRisk: number;
    evidence: number;
  };
  preEscalationScore: number;
  escalationApplied: boolean;
  finalScore: VerificationLevel;
  triggersFired: string[];
}

export interface RecommendationEntry {
  explanationTemplate: string;
  checklist: string[];
}

export type RecommendationMap = Partial<
  Record<VerificationLevel, Partial<Record<TaskType, RecommendationEntry>>>
>;

export interface Recommendation {
  level: VerificationLevel;
  levelName: string;
  explanation: string;
  checklist: string[];
  escalationNotice?: string;
}

export interface Result {
  recommendation: Recommendation;
  debug?: ScoreBreakdown;
}
