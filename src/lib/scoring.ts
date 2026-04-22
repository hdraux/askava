import type { Inputs, ScoreBreakdown, ScoringConfig, VerificationLevel } from "./types";

export function computeScore(inputs: Inputs, config: ScoringConfig): ScoreBreakdown {
  const base = config.baseScores[inputs.use];

  const adjustments = {
    impact: inputs.impact === "I3" ? config.adjustments.impactHigh : 0,
    taskRisk: config.highRiskTasks.includes(inputs.task) ? config.adjustments.highRiskTask : 0,
    evidence: inputs.evidence === "E3" ? config.adjustments.noEvidence : 0
  };

  const rawScore = base + adjustments.impact + adjustments.taskRisk + adjustments.evidence;
  const finalScore = Math.min(rawScore, config.maxLevel) as VerificationLevel;

  return {
    base,
    adjustments,
    preEscalationScore: finalScore,
    escalationApplied: false,
    finalScore,
    triggersFired: []
  };
}
