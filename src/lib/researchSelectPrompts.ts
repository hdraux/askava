// src/lib/researchSelectPrompts.ts
//
// Selects one prompt per populated step for Research mode.
// Parallel to selectPrompts.ts — uses ResearchInputs and ResearchTaskMethodMatrix.

import type {
  ResearchInputs,
  ResearchMatrixActivityKey,
  ResearchTaskMethodMatrix,
  ResearchVerificationObjectKey,
} from "./researchTypes";

function verificationObjectToKey(vo: ResearchInputs["verificationObject"]): ResearchVerificationObjectKey {
  switch (vo) {
    case "V1": return "direct";
    case "V2": return "partial";
    case "V3": return "weak";
    case "V4": return "none";
  }
}

function isHighImpact(impact: ResearchInputs["impact"]): boolean {
  return impact === "I3";
}

type StepName = "step1" | "step2" | "step3";

function getLevelBundle(
  matrix: ResearchTaskMethodMatrix,
  activityKey: ResearchMatrixActivityKey,
  effectiveLevel: 1 | 2 | 3
): { step1: string[]; step2: string[]; step3: string[] } {
  const row = matrix.baseMatrix[activityKey];
  const key = `level${effectiveLevel}` as "level1" | "level2" | "level3";
  const block = row[key];
  return {
    step1: [...block.step1],
    step2: [...block.step2],
    step3: [...block.step3],
  };
}

function removeFromSteps(
  steps: Record<StepName, string[]>,
  ids: string[]
): Record<StepName, string[]> {
  const set = new Set(ids);
  return {
    step1: steps.step1.filter((id) => !set.has(id)),
    step2: steps.step2.filter((id) => !set.has(id)),
    step3: steps.step3.filter((id) => !set.has(id)),
  };
}

function resolveStep3Default(
  activityKey: ResearchMatrixActivityKey,
  voKey: ResearchVerificationObjectKey,
  matrix: ResearchTaskMethodMatrix
): string | undefined {
  return matrix.defaultPromptChoice[activityKey]?.step3[voKey];
}

function pickOne(candidates: string[]): string | null {
  return candidates.length > 0 ? candidates[0] : null;
}

/**
 * Returns one prompt id per populated step, in order (Step 1 → Step 3).
 * Level 0 returns []. Level 4 uses the same matrix rows as level 3.
 */
export function selectResearchPrompts(
  inputs: ResearchInputs,
  level: number,
  matrix: ResearchTaskMethodMatrix
): string[] {
  if (level === 0) return [];

  const effectiveLevel: 1 | 2 | 3 =
    level >= 4 ? 3 : level >= 1 && level <= 3 ? (level as 1 | 2 | 3) : 1;

  const activityKey = inputs.activity as ResearchMatrixActivityKey;
  const voKey = verificationObjectToKey(inputs.verificationObject);

  let steps = getLevelBundle(matrix, activityKey, effectiveLevel);

  // No verification object: remove source-dependent prompts, replace with
  // uncertainty-surfacing. The replaceWith ids are only added to step3 if
  // step3 is otherwise empty after removal.
  if (voKey === "none") {
    const removeList = matrix.overrides.verificationObject.none.remove;
    steps = removeFromSteps(steps, removeList);

    if (steps.step3.length === 0) {
      const replaceWith = matrix.overrides.verificationObject.none.replaceWith;
      steps = { ...steps, step3: [...replaceWith] };
    }
  }

  // High impact: force a specific Step 3 prompt for relevant activities
  if (isHighImpact(inputs.impact) && level >= 2) {
    const forcedId = matrix.overrides.impact.high.forceStep3[activityKey];
    if (forcedId && !steps.step3.includes(forcedId)) {
      steps = { ...steps, step3: [forcedId, ...steps.step3] };
    }
  }

  // Resolve step3 default via verificationObject key when multiple candidates
  const ordered: string[] = [];

  const p1 = pickOne(steps.step1);
  if (p1) ordered.push(p1);

  const p2 = pickOne(steps.step2);
  if (p2) ordered.push(p2);

  // For step3, prefer the defaultPromptChoice for this activity+voKey combo
  let p3: string | null = null;
  if (steps.step3.length > 0) {
    const def = resolveStep3Default(activityKey, voKey, matrix);
    if (def && steps.step3.includes(def)) {
      p3 = def;
    } else {
      p3 = pickOne(steps.step3);
    }
  }
  if (p3) ordered.push(p3);

  return ordered;
}
