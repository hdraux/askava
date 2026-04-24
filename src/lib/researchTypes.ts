// src/lib/researchTypes.ts
//
// Types for the AVA Research scoring pipeline.
// Parallel to types.ts — deliberately separate so the research pipeline
// never intersects with the general pipeline's validation layer.

import type { VerificationLevel } from "./types";

export type ActivityType =
  | "A1" // Searching and discovering literature
  | "A2" // Synthesising and summarising evidence
  | "A3" // Generating ideas and hypotheses
  | "A4" // Designing studies or experiments
  | "A5" // Processing, analysing, or coding data
  | "A6" // Writing or editing research text
  | "A7" // Interpreting results or drawing conclusions
  | "A8"; // Checking compliance or reporting standards

export type ResearchStage =
  | "S1" // Personal exploration
  | "S2" // Internal working document
  | "S3" // Informing a research decision or direction
  | "S4" // Manuscript draft
  | "S5"; // Submission / publication

export type ResearchImpact = "I1" | "I2" | "I3";

export type VerificationObject =
  | "V1" // Direct — papers, data, code, protocol, or standard available
  | "V2" // Partial — some verification objects accessible
  | "V3" // Weak or indirect
  | "V4"; // None

export interface ResearchInputs {
  activity: ActivityType;
  stage: ResearchStage;
  impact: ResearchImpact;
  verificationObject: VerificationObject;
}

// Scoring config shape for research — different field names from ScoringConfig
export interface ResearchScoringConfig {
  activityAdjustments: Record<ActivityType, number>;
  stageBaseScores: Record<ResearchStage, number>;
  impactAdjustments: Record<ResearchImpact, number>;
  verificationObjectAdjustments: Record<VerificationObject, number>;
  maxLevel: VerificationLevel;
}

// Escalation config for research — same shape as EscalationConfig but
// condition keys match ResearchInputs fields
export interface ResearchEscalationTrigger {
  id: string;
  condition: Partial<Record<keyof ResearchInputs, string[]>>;
  minimumLevel?: VerificationLevel;
  escalationNotice?: string;
}

export interface ResearchEscalationConfig {
  triggers: ResearchEscalationTrigger[];
}

// Recommendation map for research — keyed by level only (no task key,
// since the recommendation text is level-based not activity-based)
export interface ResearchRecommendationEntry {
  explanation: string;
  checklist: string[];
}

export type ResearchRecommendationMap = Partial<
  Record<VerificationLevel, ResearchRecommendationEntry>
>;

export interface ResearchRecommendation {
  level: VerificationLevel;
  levelName: string;
  explanation: string;
  checklist: string[];
  escalationNotice?: string;
}

export interface ResearchScoreBreakdown {
  stageBase: number;
  activityAdjustment: number;
  impactAdjustment: number;
  verificationObjectAdjustment: number;
  rawScore: number;
  preEscalationLevel: VerificationLevel;
  escalationApplied: boolean;
  finalScore: VerificationLevel;
  triggersFired: string[];
}

export interface ResearchResult {
  recommendation: ResearchRecommendation;
  debug?: ResearchScoreBreakdown;
}

// Matrix types for research prompt selection —
// parallel to TaskMethodMatrix in parseConfig.ts

export const RESEARCH_MATRIX_ACTIVITY_KEYS = [
  "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8"
] as const;

export type ResearchMatrixActivityKey = (typeof RESEARCH_MATRIX_ACTIVITY_KEYS)[number];

export type ResearchVerificationObjectKey =
  | "direct"
  | "partial"
  | "weak"
  | "none";

export interface ResearchTaskMethodStepBundle {
  step1: string[];
  step2: string[];
  step3: string[];
}

export interface ResearchTaskMethodBaseRow {
  level0: [];
  level1: ResearchTaskMethodStepBundle;
  level2: ResearchTaskMethodStepBundle;
  level3: ResearchTaskMethodStepBundle;
  level4: ResearchTaskMethodStepBundle;
}

export interface ResearchTaskMethodMatrix {
  baseMatrix: Record<ResearchMatrixActivityKey, ResearchTaskMethodBaseRow>;
  overrides: {
    verificationObject: {
      none: { remove: string[]; replaceWith: string[] };
    };
    impact: {
      high: {
        forceStep3: Partial<Record<ResearchMatrixActivityKey, string>>;
      };
    };
  };
  defaultPromptChoice: Partial<
    Record<
      ResearchMatrixActivityKey,
      {
        step3: Record<ResearchVerificationObjectKey, string>;
      }
    >
  >;
}
