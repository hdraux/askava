import escalationConfigRaw from "../config/escalation.config.json";
import recommendationMapRaw from "../config/recommendation-map.json";
import scoringConfigRaw from "../config/scoring.config.json";
import type {
  EscalationConfig,
  EscalationTrigger,
  Evidence,
  Impact,
  IntendedUse,
  RecommendationEntry,
  RecommendationMap,
  ScoringConfig,
  TaskType,
  VerificationLevel
} from "./types";

const TASK_TYPES = [
  "T1",
  "T2",
  "T3",
  "T4",
  "T5",
  "T6",
  "T7",
  "T8",
  "T9",
  "T10"
] as const satisfies readonly TaskType[];

const INTENDED_USES = ["U1", "U2", "U3", "U4", "U5"] as const satisfies readonly IntendedUse[];

const IMPACTS = ["I1", "I2", "I3"] as const satisfies readonly Impact[];

const EVIDENCES = ["E1", "E2", "E3"] as const satisfies readonly Evidence[];

// UNUSED? isTaskType / isVerificationLevel are exported but only referenced inside this file; no other module imports them.

export function isTaskType(value: string): value is TaskType {
  return TASK_TYPES.some((t) => t === value);
}

export function isVerificationLevel(n: number): n is VerificationLevel {
  return n === 0 || n === 1 || n === 2 || n === 3 || n === 4;
}

function isIntendedUse(value: string): value is IntendedUse {
  return INTENDED_USES.some((u) => u === value);
}

function isImpact(value: string): value is Impact {
  return IMPACTS.some((i) => i === value);
}

function isEvidence(value: string): value is Evidence {
  return EVIDENCES.some((e) => e === value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function expectRecord(value: unknown, context: string): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new Error(`${context}: expected a plain object`);
  }
  return value;
}

function expectFiniteNumber(value: unknown, context: string): number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`${context}: expected a finite number`);
  }
  return value;
}

function expectNonEmptyString(value: unknown, context: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`${context}: expected a non-empty string`);
  }
  return value;
}

function expectStringArray(value: unknown, context: string): string[] {
  if (!Array.isArray(value)) {
    throw new Error(`${context}: expected an array of strings`);
  }
  const out: string[] = [];
  for (let i = 0; i < value.length; i++) {
    const el = value[i];
    if (typeof el !== "string") {
      throw new Error(`${context}: element at index ${i} is not a string`);
    }
    out.push(el);
  }
  return out;
}

function isCompleteBaseScores(
  partial: Partial<Record<IntendedUse, number>>
): partial is Record<IntendedUse, number> {
  return INTENDED_USES.every((u) => typeof partial[u] === "number");
}

function parseBaseScores(value: unknown, context: string): Record<IntendedUse, number> {
  const o = expectRecord(value, context);
  const out: Partial<Record<IntendedUse, number>> = {};
  for (const u of INTENDED_USES) {
    if (!(u in o)) {
      throw new Error(`${context}: missing baseScores key "${u}"`);
    }
    out[u] = expectFiniteNumber(o[u], `${context}.baseScores.${u}`);
  }
  if (!isCompleteBaseScores(out)) {
    throw new Error(`${context}: baseScores is incomplete`);
  }
  return out;
}

function parseHighRiskTasks(value: unknown, context: string): TaskType[] {
  if (!Array.isArray(value)) {
    throw new Error(`${context}: highRiskTasks must be an array`);
  }
  const out: TaskType[] = [];
  for (let i = 0; i < value.length; i++) {
    const el = value[i];
    if (typeof el !== "string" || !isTaskType(el)) {
      throw new Error(
        `${context}: highRiskTasks[${i}] is not a valid TaskType (got ${JSON.stringify(el)})`
      );
    }
    out.push(el);
  }
  return out;
}

function isCompleteAdjustments(
  partial: Partial<ScoringConfig["adjustments"]>
): partial is ScoringConfig["adjustments"] {
  return (
    typeof partial.impactHigh === "number" &&
    typeof partial.highRiskTask === "number" &&
    typeof partial.noEvidence === "number"
  );
}

function parseAdjustments(value: unknown, context: string): ScoringConfig["adjustments"] {
  const o = expectRecord(value, context);
  const keys = ["impactHigh", "highRiskTask", "noEvidence"] as const;
  const out: Partial<ScoringConfig["adjustments"]> = {};
  for (const k of keys) {
    if (!(k in o)) {
      throw new Error(`${context}: missing adjustments key "${k}"`);
    }
    out[k] = expectFiniteNumber(o[k], `${context}.adjustments.${k}`);
  }
  if (!isCompleteAdjustments(out)) {
    throw new Error(`${context}: adjustments is incomplete`);
  }
  return out;
}

function parseScoringConfig(raw: typeof scoringConfigRaw): ScoringConfig {
  const ctx = "scoring.config.json";
  const o = expectRecord(raw, ctx);
  const baseScores = parseBaseScores(o.baseScores, `${ctx}.baseScores`);
  const highRiskTasks = parseHighRiskTasks(o.highRiskTasks, `${ctx}.highRiskTasks`);
  const adjustments = parseAdjustments(o.adjustments, `${ctx}.adjustments`);
  if (!("maxLevel" in o)) {
    throw new Error(`${ctx}: missing maxLevel`);
  }
  const maxLevelNum = expectFiniteNumber(o.maxLevel, `${ctx}.maxLevel`);
  if (!Number.isInteger(maxLevelNum) || !isVerificationLevel(maxLevelNum)) {
    throw new Error(
      `${ctx}.maxLevel must be an integer VerificationLevel 0–4 (got ${JSON.stringify(o.maxLevel)})`
    );
  }
  return {
    baseScores,
    highRiskTasks,
    adjustments,
    maxLevel: maxLevelNum
  };
}

function parseTaskTypeStrings(arr: string[], context: string): TaskType[] {
  const out: TaskType[] = [];
  for (let i = 0; i < arr.length; i++) {
    const v = arr[i];
    if (!isTaskType(v)) {
      throw new Error(`${context}[${i}]: invalid task value ${JSON.stringify(v)}`);
    }
    out.push(v);
  }
  return out;
}

function parseIntendedUseStrings(arr: string[], context: string): IntendedUse[] {
  const out: IntendedUse[] = [];
  for (let i = 0; i < arr.length; i++) {
    const v = arr[i];
    if (!isIntendedUse(v)) {
      throw new Error(`${context}[${i}]: invalid use value ${JSON.stringify(v)}`);
    }
    out.push(v);
  }
  return out;
}

function parseImpactStrings(arr: string[], context: string): Impact[] {
  const out: Impact[] = [];
  for (let i = 0; i < arr.length; i++) {
    const v = arr[i];
    if (!isImpact(v)) {
      throw new Error(`${context}[${i}]: invalid impact value ${JSON.stringify(v)}`);
    }
    out.push(v);
  }
  return out;
}

function parseEvidenceStrings(arr: string[], context: string): Evidence[] {
  const out: Evidence[] = [];
  for (let i = 0; i < arr.length; i++) {
    const v = arr[i];
    if (!isEvidence(v)) {
      throw new Error(`${context}[${i}]: invalid evidence value ${JSON.stringify(v)}`);
    }
    out.push(v);
  }
  return out;
}

function parseEscalationCondition(
  value: unknown,
  context: string
): EscalationTrigger["condition"] {
  const o = expectRecord(value, context);
  const condition: EscalationTrigger["condition"] = {};
  for (const [rawKey, rawVals] of Object.entries(o)) {
    const arr = expectStringArray(rawVals, `${context}.${rawKey}`);
    if (arr.length === 0) {
      throw new Error(`${context}.${rawKey}: condition array must not be empty`);
    }
    switch (rawKey) {
      case "task":
        condition.task = parseTaskTypeStrings(arr, `${context}.task`);
        break;
      case "use":
        condition.use = parseIntendedUseStrings(arr, `${context}.use`);
        break;
      case "impact":
        condition.impact = parseImpactStrings(arr, `${context}.impact`);
        break;
      case "evidence":
        condition.evidence = parseEvidenceStrings(arr, `${context}.evidence`);
        break;
      default:
        throw new Error(`${context}: unknown condition key ${JSON.stringify(rawKey)}`);
    }
  }
  return condition;
}

function parseEscalationTriggers(value: unknown, context: string): EscalationTrigger[] {
  if (!Array.isArray(value)) {
    throw new Error(`${context}: triggers must be an array`);
  }
  const out: EscalationTrigger[] = [];
  for (let i = 0; i < value.length; i++) {
    const el = value[i];
    const itemCtx = `${context}[${i}]`;
    const t = expectRecord(el, itemCtx);
    const id = expectNonEmptyString(t.id, `${itemCtx}.id`);
    if (!("condition" in t)) {
      throw new Error(`${itemCtx}: missing condition`);
    }
    const condition = parseEscalationCondition(t.condition, `${itemCtx}.condition`);
    out.push({ id, condition });
  }
  return out;
}

function parseEscalationConfig(raw: typeof escalationConfigRaw): EscalationConfig {
  const ctx = "escalation.config.json";
  const o = expectRecord(raw, ctx);
  if (!("minLevelIfTriggered" in o)) {
    throw new Error(`${ctx}: missing minLevelIfTriggered`);
  }
  const minNum = expectFiniteNumber(o.minLevelIfTriggered, `${ctx}.minLevelIfTriggered`);
  if (!Number.isInteger(minNum) || !isVerificationLevel(minNum)) {
    throw new Error(
      `${ctx}.minLevelIfTriggered must be an integer VerificationLevel 0–4 (got ${JSON.stringify(o.minLevelIfTriggered)})`
    );
  }
  if (!("triggers" in o)) {
    throw new Error(`${ctx}: missing triggers`);
  }
  return {
    minLevelIfTriggered: minNum,
    triggers: parseEscalationTriggers(o.triggers, `${ctx}.triggers`)
  };
}

function parseRecommendationEntry(value: unknown, context: string): RecommendationEntry {
  const o = expectRecord(value, context);
  if (!("explanationTemplate" in o)) {
    throw new Error(`${context}: missing explanationTemplate`);
  }
  if (!("checklist" in o)) {
    throw new Error(`${context}: missing checklist`);
  }
  const explanationTemplate = expectNonEmptyString(
    o.explanationTemplate,
    `${context}.explanationTemplate`
  );
  const rawList = o.checklist;
  if (!Array.isArray(rawList)) {
    throw new Error(`${context}.checklist: expected an array of strings`);
  }
  const checklist: string[] = [];
  for (let i = 0; i < rawList.length; i++) {
    const item = rawList[i];
    if (typeof item !== "string") {
      throw new Error(`${context}.checklist[${i}]: expected string`);
    }
    checklist.push(item);
  }
  return { explanationTemplate, checklist };
}

function parseRecommendationMap(raw: typeof recommendationMapRaw): RecommendationMap {
  const ctx = "recommendation-map.json";
  const root = expectRecord(raw, ctx);
  const out: RecommendationMap = {};
  for (const [levelKey, levelVal] of Object.entries(root)) {
    const levelNum = Number(levelKey);
    if (!Number.isInteger(levelNum) || !isVerificationLevel(levelNum)) {
      throw new Error(
        `${ctx}: top-level key ${JSON.stringify(levelKey)} is not a VerificationLevel 0–4`
      );
    }
    const levelObj = expectRecord(levelVal, `${ctx}[${levelKey}]`);
    const levelRecord: Partial<Record<TaskType, RecommendationEntry>> = {};
    for (const [taskKey, entryRaw] of Object.entries(levelObj)) {
      if (!isTaskType(taskKey)) {
        throw new Error(
          `${ctx}[${levelKey}]: task key ${JSON.stringify(taskKey)} is not a valid TaskType`
        );
      }
      levelRecord[taskKey] = parseRecommendationEntry(
        entryRaw,
        `${ctx}[${levelKey}][${taskKey}]`
      );
    }
    out[levelNum] = levelRecord;
  }
  return out;
}

export const scoringConfigTyped: ScoringConfig = parseScoringConfig(scoringConfigRaw);

export const escalationConfigTyped: EscalationConfig = parseEscalationConfig(escalationConfigRaw);

export const recommendationMapTyped: RecommendationMap = parseRecommendationMap(recommendationMapRaw);
