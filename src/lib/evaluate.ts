import { applyEscalation } from "./escalation";
import { getRecommendation } from "./recommendations";
import { computeScore } from "./scoring";
import type {
  EscalationConfig,
  Inputs,
  RecommendationMap,
  Result,
  ScoringConfig
} from "./types";

export function evaluate(
  inputs: Inputs,
  scoringConfig: ScoringConfig,
  escalationConfig: EscalationConfig,
  recommendationMap: RecommendationMap,
  debug = false
): Result {
  const baseScore = computeScore(inputs, scoringConfig);
  const finalScore = applyEscalation(inputs, baseScore, escalationConfig);
  const recommendation = getRecommendation(
    finalScore.finalScore,
    inputs.task,
    recommendationMap,
    finalScore
  );

  return {
    recommendation,
    debug: debug ? finalScore : undefined
  };
}
