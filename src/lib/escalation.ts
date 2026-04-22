import type { EscalationConfig, Inputs, ScoreBreakdown } from "./types";

export function applyEscalation(
  inputs: Inputs,
  score: ScoreBreakdown,
  config: EscalationConfig
): ScoreBreakdown {
  const fired = config.triggers
    .filter((trigger) =>
      Object.entries(trigger.condition).every(([key, values]) =>
        values.includes(inputs[key as keyof Inputs])
      )
    )
    .map((trigger) => trigger.id);

  const escalationApplied =
    fired.length > 0 && score.finalScore < config.minLevelIfTriggered;

  return {
    ...score,
    escalationApplied,
    finalScore: escalationApplied ? config.minLevelIfTriggered : score.finalScore,
    triggersFired: fired
  };
}
