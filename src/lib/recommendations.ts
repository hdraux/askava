import type { Recommendation, RecommendationMap, ScoreBreakdown, TaskType, VerificationLevel } from "./types";

function levelName(level: VerificationLevel): string {
  switch (level) {
    case 0:
      return "Use freely";
    case 1:
      return "Quick check";
    case 2:
      return "Grounded verification";
    case 3:
      return "Independent review";
    case 4:
      return "Formal control";
  }
}

export function getRecommendation(
  level: VerificationLevel,
  task: TaskType,
  map: RecommendationMap,
  score: ScoreBreakdown
): Recommendation {
  const entry = map[level]?.[task];

  const checklistLimit = level <= 2 ? 3 : 4;
  const explanation =
    entry?.explanationTemplate ?? "Use a proportionate level of verification before relying on this output.";
  const checklist =
    entry?.checklist.slice(0, checklistLimit) ?? ["Review the output before using it."];

  return {
    level,
    levelName: levelName(level),
    explanation,
    checklist,
    escalationNotice: score.escalationApplied
      ? `Escalated due to: ${score.triggersFired.join(", ")}.`
      : undefined
  };
}
