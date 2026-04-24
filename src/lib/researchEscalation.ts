// src/lib/researchEscalation.ts
//
// Applies escalation rules to a ResearchScoreBreakdown.
// Parallel to escalation.ts.
//
// Unlike the general escalation config (single minLevelIfTriggered for all
// triggers), research triggers each carry their own minimumLevel, allowing
// manuscript draft (min 3) and submission (min 4) to be separate rules.

import type {
  ResearchEscalationConfig,
  ResearchInputs,
  ResearchScoreBreakdown,
} from "./researchTypes";
import type { VerificationLevel } from "./types";

export function applyResearchEscalation(
  inputs: ResearchInputs,
  score: ResearchScoreBreakdown,
  config: ResearchEscalationConfig
): ResearchScoreBreakdown {
  let highestMinimum: VerificationLevel = score.finalScore;
  const fired: string[] = [];
  const notices: string[] = [];

  for (const trigger of config.triggers) {
    const matches = Object.entries(trigger.condition).every(([key, values]) => {
      const inputVal = inputs[key as keyof ResearchInputs];
      return (values as string[]).includes(inputVal);
    });

    if (matches) {
      fired.push(trigger.id);
      if (trigger.minimumLevel !== undefined && trigger.minimumLevel > highestMinimum) {
        highestMinimum = trigger.minimumLevel;
      }
      if (trigger.escalationNotice) {
        notices.push(trigger.escalationNotice);
      }
    }
  }

  const escalationApplied = highestMinimum > score.finalScore;

  return {
    ...score,
    escalationApplied,
    finalScore: highestMinimum,
    triggersFired: fired,
    ...(notices.length > 0 ? { escalationNotice: notices[0] } : {}),
  };
}
