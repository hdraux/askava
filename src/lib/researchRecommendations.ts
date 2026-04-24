// src/lib/researchRecommendations.ts
//
// Maps a final score to a ResearchRecommendation.
// Parallel to recommendations.ts.
//
// Research recommendations are keyed by level only — there is no
// task-specific explanation template as the activity shapes prompt
// selection, not the recommendation text.

import type {
  ResearchRecommendation,
  ResearchRecommendationMap,
  ResearchScoreBreakdown,
} from "./researchTypes";
import type { VerificationLevel } from "./types";

function levelName(level: VerificationLevel): string {
  switch (level) {
    case 0: return "Use freely";
    case 1: return "Quick check";
    case 2: return "Grounded verification";
    case 3: return "Independent review";
    case 4: return "Formal control";
  }
}

export function getResearchRecommendation(
  level: VerificationLevel,
  map: ResearchRecommendationMap,
  score: ResearchScoreBreakdown & { escalationNotice?: string }
): ResearchRecommendation {
  const entry = map[level];

  const explanation =
    entry?.explanation ??
    "Use a proportionate level of verification before relying on this output.";

  const checklistLimit = level <= 2 ? 3 : 4;
  const checklist =
    entry?.checklist.slice(0, checklistLimit) ?? ["Review the output before using it."];

  return {
    level,
    levelName: levelName(level),
    explanation,
    checklist,
    escalationNotice: score.escalationNotice ??
      (score.escalationApplied
        ? `Verification level raised due to: ${score.triggersFired.join(", ")}.`
        : undefined),
  };
}
