import type {
  EvidenceMatrixKey,
  MatrixTaskKey,
  TaskMethodMatrix,
  TaskMethodOverrideWhen,
} from "./parseConfig";
import type { Evidence, Impact, TaskType } from "./types";

/** Matrix row key for a wizard task (T1–T10). */
function taskTypeToMatrixKey(task: TaskType): MatrixTaskKey {
  switch (task) {
    case "T1":
      // Classification / labelling has no dedicated row in the matrix; use "other".
      return "other";
    case "T2":
      return "summarisation";
    case "T3":
      return "content_generation";
    case "T4":
      return "coding_assistance";
    case "T5":
      return "translation";
    case "T6":
      // Data transformation — closest fit to summarisation-style checks.
      return "summarisation";
    case "T7":
      return "information_lookup";
    case "T8":
      // Evaluation / scoring — closest fit to content_generation-style checks.
      return "content_generation";
    case "T9":
      return "data_analysis";
    case "T10":
      return "policy_interpretation";
    default:
      return "other";
  }
}

function evidenceToMatrixKey(evidence: Evidence): EvidenceMatrixKey {
  switch (evidence) {
    case "E1":
      return "clear_source";
    case "E2":
      return "partial_source";
    case "E3":
      return "no_source";
    default:
      return "no_source";
  }
}

function isHighImpact(impact: Impact): boolean {
  return impact === "I3";
}

type StepName = "step1" | "step2" | "step3";

function whenMatches(
  when: TaskMethodOverrideWhen,
  ctx: { taskKey: MatrixTaskKey; level: number; evidenceKey: EvidenceMatrixKey }
): boolean {
  if (when.task !== undefined && when.task !== ctx.taskKey) return false;
  if (when.level_gte !== undefined && ctx.level < when.level_gte) return false;
  if (when.task_in !== undefined && !(when.task_in as string[]).includes(ctx.taskKey)) {
    return false;
  }
  if (when.evidence_in !== undefined && !when.evidence_in.includes(ctx.evidenceKey)) {
    return false;
  }
  return true;
}

function prependIdsToStep(step: string[], ids: string[]): string[] {
  const out = [...step];
  for (let i = ids.length - 1; i >= 0; i--) {
    const id = ids[i];
    const idx = out.indexOf(id);
    if (idx >= 0) out.splice(idx, 1);
    out.unshift(id);
  }
  return out;
}

function removePromptFromSteps(
  steps: Record<StepName, string[]>,
  promptId: string
): Record<StepName, string[]> {
  return {
    step1: steps.step1.filter((id) => id !== promptId),
    step2: steps.step2.filter((id) => id !== promptId),
    step3: steps.step3.filter((id) => id !== promptId),
  };
}

function applyForceInclude(
  steps: Record<StepName, string[]>,
  force: Partial<Record<StepName, string[]>> | undefined
): Record<StepName, string[]> {
  if (!force) return steps;
  const next = { ...steps };
  (["step1", "step2", "step3"] as const).forEach((sn) => {
    const ids = force[sn];
    if (ids?.length) {
      next[sn] = prependIdsToStep(next[sn], ids);
    }
  });
  return next;
}

function resolveStepDefault(
  stepName: StepName,
  taskKey: MatrixTaskKey,
  evidenceKey: EvidenceMatrixKey,
  defaults: TaskMethodMatrix["defaultPromptChoice"]
): string | undefined {
  const row = defaults[taskKey];
  if (!row) return undefined;
  const raw = row[stepName];
  if (stepName === "step3" && typeof raw === "object" && raw !== null && !Array.isArray(raw)) {
    const v = raw[evidenceKey];
    return typeof v === "string" ? v : undefined;
  }
  return typeof raw === "string" ? raw : undefined;
}

function pickOneForStep(
  stepIds: string[],
  stepName: StepName,
  taskKey: MatrixTaskKey,
  evidenceKey: EvidenceMatrixKey,
  matrix: TaskMethodMatrix
): string | null {
  if (stepIds.length === 0) return null;
  const def = resolveStepDefault(stepName, taskKey, evidenceKey, matrix.defaultPromptChoice);
  if (def !== undefined && stepIds.includes(def)) return def;
  return stepIds[0];
}

function getLevelBundle(
  matrix: TaskMethodMatrix,
  taskKey: MatrixTaskKey,
  effectiveLevel: 1 | 2 | 3
): { step1: string[]; step2: string[]; step3: string[] } {
  const row = matrix.baseMatrix[taskKey];
  const key = `level${effectiveLevel}` as "level1" | "level2" | "level3";
  const block = row[key];
  return {
    step1: [...block.step1],
    step2: [...block.step2],
    step3: [...block.step3],
  };
}

/**
 * Returns one prompt id per populated verification step (Step 1 → Step 3), in order.
 * Level 0 yields []. Level 4 uses the same matrix row as level 3.
 */
export function selectPrompts(
  task: TaskType,
  level: number,
  evidence: Evidence,
  impact: Impact,
  matrix: TaskMethodMatrix
): string[] {
  if (level === 0) return [];

  const effectiveLevel: 1 | 2 | 3 = level >= 4 ? 3 : (level as 1 | 2 | 3);
  if (effectiveLevel !== 1 && effectiveLevel !== 2 && effectiveLevel !== 3) {
    return [];
  }

  const taskKey = taskTypeToMatrixKey(task);
  const evidenceKey = evidenceToMatrixKey(evidence);

  let steps = getLevelBundle(matrix, taskKey, effectiveLevel);

  if (evidenceKey === "no_source") {
    const removeList = matrix.overrides.evidence.no_source.remove ?? [];
    for (const id of removeList) {
      steps = removePromptFromSteps(steps, id);
    }
  }

  const evidenceBuckets: EvidenceMatrixKey[] =
    evidenceKey === "clear_source" || evidenceKey === "partial_source"
      ? [evidenceKey]
      : [];

  for (const bucket of evidenceBuckets) {
    const rules = matrix.overrides.evidence[bucket]?.rules ?? [];
    for (const rule of rules) {
      if (!rule.forceInclude) continue;
      if (whenMatches(rule.when, { taskKey, level, evidenceKey })) {
        steps = applyForceInclude(steps, rule.forceInclude);
      }
    }
  }

  let requireStep3 = false;
  if (isHighImpact(impact) && level >= 2) {
    const impactRules = matrix.overrides.impact.high.rules;
    for (const rule of impactRules) {
      if (rule.requireStep3 && whenMatches(rule.when, { taskKey, level, evidenceKey })) {
        requireStep3 = true;
      }
      if (rule.forceInclude && whenMatches(rule.when, { taskKey, level, evidenceKey })) {
        steps = applyForceInclude(steps, rule.forceInclude);
      }
    }
  }

  if (requireStep3 && steps.step3.length === 0) {
    const fallback = resolveStepDefault("step3", taskKey, evidenceKey, matrix.defaultPromptChoice);
    if (fallback) {
      steps = { ...steps, step3: [fallback] };
    }
  }

  const ordered: string[] = [];
  const p1 = pickOneForStep(steps.step1, "step1", taskKey, evidenceKey, matrix);
  if (p1) ordered.push(p1);
  const p2 = pickOneForStep(steps.step2, "step2", taskKey, evidenceKey, matrix);
  if (p2) ordered.push(p2);
  const p3 = pickOneForStep(steps.step3, "step3", taskKey, evidenceKey, matrix);
  if (p3) ordered.push(p3);

  return ordered;
}
