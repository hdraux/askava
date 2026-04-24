// src/lib/researchScoring.ts
//
// Computes a numeric risk score from ResearchInputs.
// Parallel to scoring.ts — reads research-specific field names.

import type {
  ResearchInputs,
  ResearchScoreBreakdown,
  ResearchScoringConfig,
  VerificationObject,
} from "./researchTypes";
import type { VerificationLevel } from "./types";

function clampToLevel(score: number, maxLevel: VerificationLevel): VerificationLevel {
  const clamped = Math.max(0, Math.min(score, maxLevel));
  if (clamped === 0) return 0;
  if (clamped === 1) return 1;
  if (clamped === 2) return 2;
  if (clamped === 3) return 3;
  return 4;
}

export function computeResearchScore(
  inputs: ResearchInputs,
  config: ResearchScoringConfig
): ResearchScoreBreakdown {
  const stageBase = config.stageBaseScores[inputs.stage];
  const activityAdjustment = config.activityAdjustments[inputs.activity];
  const impactAdjustment = config.impactAdjustments[inputs.impact];
  const verificationObjectAdjustment =
    config.verificationObjectAdjustments[inputs.verificationObject];

  const rawScore =
    stageBase + activityAdjustment + impactAdjustment + verificationObjectAdjustment;

  const preEscalationLevel = clampToLevel(rawScore, config.maxLevel);

  return {
    stageBase,
    activityAdjustment,
    impactAdjustment,
    verificationObjectAdjustment,
    rawScore,
    preEscalationLevel,
    escalationApplied: false,
    finalScore: preEscalationLevel,
    triggersFired: [],
  };
}
