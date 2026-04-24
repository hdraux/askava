// src/lib/researchEvaluate.ts
//
// Orchestrates the research scoring pipeline.
// Parallel to evaluate.ts — calls research-specific functions only.

import { computeResearchScore } from "./researchScoring";
import { applyResearchEscalation } from "./researchEscalation";
import { getResearchRecommendation } from "./researchRecommendations";
import type {
  ResearchEscalationConfig,
  ResearchInputs,
  ResearchRecommendationMap,
  ResearchResult,
  ResearchScoringConfig,
} from "./researchTypes";

export function evaluateResearch(
  inputs: ResearchInputs,
  scoringConfig: ResearchScoringConfig,
  escalationConfig: ResearchEscalationConfig,
  recommendationMap: ResearchRecommendationMap,
  debug = false
): ResearchResult {
  const baseScore = computeResearchScore(inputs, scoringConfig);
  const finalScore = applyResearchEscalation(inputs, baseScore, escalationConfig);
  const recommendation = getResearchRecommendation(
    finalScore.finalScore,
    recommendationMap,
    finalScore
  );

  return {
    recommendation,
    debug: debug ? finalScore : undefined,
  };
}
