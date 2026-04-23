import type { Inputs, ScoreBreakdown, ScoringConfig, VerificationLevel } from "./types";

function verificationLevelFromCappedScore(
  rawScore: number,
  maxLevel: VerificationLevel
): VerificationLevel {
  const capped = Math.min(rawScore, maxLevel);
  switch (capped) {
    case 0:
      return 0;
    case 1:
      return 1;
    case 2:
      return 2;
    case 3:
      return 3;
    case 4:
      return 4;
    default:
      throw new Error(
        `computeScore: capped score must be 0–4, got ${String(capped)} (rawScore=${String(rawScore)}, maxLevel=${String(maxLevel)})`
      );
  }
}

export function computeScore(inputs: Inputs, config: ScoringConfig): ScoreBreakdown {
  const base = config.baseScores[inputs.use];

  const adjustments = {
    impact: inputs.impact === "I3" ? config.adjustments.impactHigh : 0,
    taskRisk: config.taskAdjustments[inputs.task],
    evidence: inputs.evidence === "E3" ? config.adjustments.noEvidence : 0
  };

  const rawScore = base + adjustments.impact + adjustments.taskRisk + adjustments.evidence;
  const finalScore = verificationLevelFromCappedScore(rawScore, config.maxLevel);

  return {
    base,
    adjustments,
    preEscalationScore: finalScore,
    escalationApplied: false,
    finalScore,
    triggersFired: []
  };
}
