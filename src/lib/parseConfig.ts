import escalationConfigRaw from "../config/escalation.config.json";
import recommendationMapRaw from "../config/recommendation-map.json";
import scoringConfigRaw from "../config/scoring.config.json";
import taskMethodMatrixRaw from "../config/task-method-matrix.json";
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

export const MATRIX_TASK_KEYS = [
  "content_generation",
  "summarisation",
  "information_lookup",
  "data_analysis",
  "policy_interpretation",
  "translation",
  "coding_assistance",
  "other"
] as const;

export type MatrixTaskKey = (typeof MATRIX_TASK_KEYS)[number];

export type EvidenceMatrixKey = "clear_source" | "partial_source" | "no_source";

export interface TaskMethodOverrideWhen {
  task?: string;
  level_gte?: number;
  task_in?: string[];
  evidence_in?: EvidenceMatrixKey[];
}

export interface TaskMethodStepBundle {
  step1: string[];
  step2: string[];
  step3: string[];
}

export interface TaskMethodBaseRow {
  level0: [];
  level1: TaskMethodStepBundle;
  level2: TaskMethodStepBundle;
  level3: TaskMethodStepBundle;
  level4: TaskMethodStepBundle;
}

export interface TaskMethodEvidenceRule {
  when: TaskMethodOverrideWhen;
  forceInclude?: Partial<Record<"step1" | "step2" | "step3", string[]>>;
  note?: string;
}

export interface TaskMethodEvidenceBucket {
  prioritise?: Partial<Record<MatrixTaskKey, string[]>>;
  remove?: string[];
  rules?: TaskMethodEvidenceRule[];
}

export interface TaskMethodImpactHighRule {
  when: TaskMethodOverrideWhen;
  requireStep3?: boolean;
  forceInclude?: Partial<Record<"step1" | "step2" | "step3", string[]>>;
  note?: string;
  setMinimumLevel?: number;
  requireHumanReview?: boolean;
}

export interface TaskMethodDefaultRow {
  step1: string;
  step2: string;
  step3: string | Record<EvidenceMatrixKey, string>;
}

export interface TaskMethodMatrix {
  version: string;
  baseMatrix: Record<MatrixTaskKey, TaskMethodBaseRow>;
  overrides: {
    evidence: Record<EvidenceMatrixKey, TaskMethodEvidenceBucket>;
    impact: {
      high: { rules: TaskMethodImpactHighRule[] };
    };
    intended_use?: Record<string, { rules: TaskMethodImpactHighRule[] }>;
  };
  defaultPromptChoice: Record<MatrixTaskKey, TaskMethodDefaultRow>;
  notes?: unknown;
  selectionPolicy?: unknown;
  copyGuardrails?: unknown;
}

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

function isCompleteTaskAdjustments(
  partial: Partial<Record<TaskType, number>>
): partial is Record<TaskType, number> {
  for (const t of TASK_TYPES) {
    if (typeof partial[t] !== "number") return false;
  }
  return true;
}

function parseTaskAdjustments(value: unknown, context: string): Record<TaskType, number> {
  const o = expectRecord(value, context);
  const out: Partial<Record<TaskType, number>> = {};
  for (const t of TASK_TYPES) {
    if (!(t in o)) {
      throw new Error(`${context}: missing taskAdjustments key "${t}"`);
    }
    out[t] = expectFiniteNumber(o[t], `${context}.taskAdjustments.${t}`);
  }
  if (!isCompleteTaskAdjustments(out)) {
    throw new Error(`${context}: taskAdjustments is incomplete`);
  }
  return out;
}

function isCompleteAdjustments(
  partial: Partial<ScoringConfig["adjustments"]>
): partial is ScoringConfig["adjustments"] {
  return typeof partial.impactHigh === "number" && typeof partial.noEvidence === "number";
}

function parseAdjustments(value: unknown, context: string): ScoringConfig["adjustments"] {
  const o = expectRecord(value, context);
  const keys = ["impactHigh", "noEvidence"] as const;
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
  if (!("taskAdjustments" in o)) {
    throw new Error(`${ctx}: missing taskAdjustments`);
  }
  const taskAdjustments = parseTaskAdjustments(o.taskAdjustments, `${ctx}.taskAdjustments`);
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
    taskAdjustments,
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

function isMatrixTaskKey(s: string): s is MatrixTaskKey {
  return (MATRIX_TASK_KEYS as readonly string[]).includes(s);
}

function parseWhenClause(value: unknown, context: string): TaskMethodOverrideWhen {
  const o = expectRecord(value, context);
  const when: TaskMethodOverrideWhen = {};
  if ("task" in o && o.task !== undefined) {
    when.task = expectNonEmptyString(o.task, `${context}.task`);
  }
  if ("level_gte" in o && o.level_gte !== undefined) {
    when.level_gte = expectFiniteNumber(o.level_gte, `${context}.level_gte`);
  }
  if ("task_in" in o && o.task_in !== undefined) {
    const arr = expectStringArray(o.task_in, `${context}.task_in`);
    for (let i = 0; i < arr.length; i++) {
      if (!isMatrixTaskKey(arr[i])) {
        throw new Error(
          `${context}.task_in[${i}]: invalid matrix task key ${JSON.stringify(arr[i])}`
        );
      }
    }
    when.task_in = arr;
  }
  if ("evidence_in" in o && o.evidence_in !== undefined) {
    const arr = expectStringArray(o.evidence_in, `${context}.evidence_in`);
    const keys: EvidenceMatrixKey[] = ["clear_source", "partial_source", "no_source"];
    for (let i = 0; i < arr.length; i++) {
      const v = arr[i];
      if (!keys.includes(v as EvidenceMatrixKey)) {
        throw new Error(`${context}.evidence_in[${i}]: invalid evidence key ${JSON.stringify(v)}`);
      }
    }
    when.evidence_in = arr as EvidenceMatrixKey[];
  }
  return when;
}

function parseForceInclude(
  value: unknown,
  context: string
): Partial<Record<"step1" | "step2" | "step3", string[]>> {
  const o = expectRecord(value, context);
  const out: Partial<Record<"step1" | "step2" | "step3", string[]>> = {};
  for (const stepKey of ["step1", "step2", "step3"] as const) {
    if (stepKey in o && o[stepKey] !== undefined) {
      out[stepKey] = expectStringArray(o[stepKey], `${context}.${stepKey}`);
    }
  }
  return out;
}

function parseEvidenceRules(value: unknown, context: string): TaskMethodEvidenceRule[] {
  if (value === undefined) return [];
  if (!Array.isArray(value)) {
    throw new Error(`${context}: rules must be an array or omitted`);
  }
  const out: TaskMethodEvidenceRule[] = [];
  for (let i = 0; i < value.length; i++) {
    const el = value[i];
    const itemCtx = `${context}[${i}]`;
    const t = expectRecord(el, itemCtx);
    if (!("when" in t)) {
      throw new Error(`${itemCtx}: missing when`);
    }
    const when = parseWhenClause(t.when, `${itemCtx}.when`);
    const rule: TaskMethodEvidenceRule = { when };
    if ("forceInclude" in t && t.forceInclude !== undefined) {
      rule.forceInclude = parseForceInclude(t.forceInclude, `${itemCtx}.forceInclude`);
    }
    if ("note" in t && typeof t.note === "string") {
      rule.note = t.note;
    }
    out.push(rule);
  }
  return out;
}

function parseEvidenceBucket(value: unknown, context: string): TaskMethodEvidenceBucket {
  const o = expectRecord(value, context);
  const bucket: TaskMethodEvidenceBucket = {};
  if ("prioritise" in o && o.prioritise !== undefined) {
    const p = expectRecord(o.prioritise, `${context}.prioritise`);
    const prioritise: Partial<Record<MatrixTaskKey, string[]>> = {};
    for (const [k, v] of Object.entries(p)) {
      if (!isMatrixTaskKey(k)) {
        throw new Error(`${context}.prioritise: unknown key ${JSON.stringify(k)}`);
      }
      prioritise[k] = expectStringArray(v, `${context}.prioritise.${k}`);
    }
    bucket.prioritise = prioritise;
  }
  if ("remove" in o && o.remove !== undefined) {
    bucket.remove = expectStringArray(o.remove, `${context}.remove`);
  }
  if ("rules" in o && o.rules !== undefined) {
    bucket.rules = parseEvidenceRules(o.rules, `${context}.rules`);
  }
  return bucket;
}

function parseImpactHighRules(value: unknown, context: string): TaskMethodImpactHighRule[] {
  if (!Array.isArray(value)) {
    throw new Error(`${context}: rules must be an array`);
  }
  const out: TaskMethodImpactHighRule[] = [];
  for (let i = 0; i < value.length; i++) {
    const el = value[i];
    const itemCtx = `${context}[${i}]`;
    const t = expectRecord(el, itemCtx);
    if (!("when" in t)) {
      throw new Error(`${itemCtx}: missing when`);
    }
    const when = parseWhenClause(t.when, `${itemCtx}.when`);
    const rule: TaskMethodImpactHighRule = { when };
    if ("requireStep3" in t && typeof t.requireStep3 === "boolean") {
      rule.requireStep3 = t.requireStep3;
    }
    if ("forceInclude" in t && t.forceInclude !== undefined) {
      rule.forceInclude = parseForceInclude(t.forceInclude, `${itemCtx}.forceInclude`);
    }
    if ("note" in t && typeof t.note === "string") {
      rule.note = t.note;
    }
    if ("setMinimumLevel" in t && t.setMinimumLevel !== undefined) {
      rule.setMinimumLevel = expectFiniteNumber(t.setMinimumLevel, `${itemCtx}.setMinimumLevel`);
    }
    if ("requireHumanReview" in t && typeof t.requireHumanReview === "boolean") {
      rule.requireHumanReview = t.requireHumanReview;
    }
    out.push(rule);
  }
  return out;
}

function parseStepBundle(value: unknown, context: string): TaskMethodStepBundle {
  const o = expectRecord(value, context);
  return {
    step1: expectStringArray(o.step1, `${context}.step1`),
    step2: expectStringArray(o.step2, `${context}.step2`),
    step3: expectStringArray(o.step3, `${context}.step3`)
  };
}

function parseBaseMatrixRow(value: unknown, context: string): TaskMethodBaseRow {
  const o = expectRecord(value, context);
  if (!("level0" in o)) {
    throw new Error(`${context}: missing level0`);
  }
  const l0 = o.level0;
  if (!Array.isArray(l0) || l0.length !== 0) {
    throw new Error(`${context}.level0: expected empty array`);
  }
  for (const lv of [1, 2, 3, 4] as const) {
    const k = `level${lv}` as const;
    if (!(k in o)) {
      throw new Error(`${context}: missing ${k}`);
    }
  }
  return {
    level0: [],
    level1: parseStepBundle(o.level1, `${context}.level1`),
    level2: parseStepBundle(o.level2, `${context}.level2`),
    level3: parseStepBundle(o.level3, `${context}.level3`),
    level4: parseStepBundle(o.level4, `${context}.level4`)
  };
}

function parseBaseMatrix(value: unknown, context: string): TaskMethodMatrix["baseMatrix"] {
  const o = expectRecord(value, context);
  const out = {} as TaskMethodMatrix["baseMatrix"];
  for (const key of MATRIX_TASK_KEYS) {
    if (!(key in o)) {
      throw new Error(`${context}: missing row ${key}`);
    }
    out[key] = parseBaseMatrixRow(o[key], `${context}.${key}`);
  }
  return out;
}

function parseDefaultPromptRow(
  value: unknown,
  context: string
): TaskMethodMatrix["defaultPromptChoice"][MatrixTaskKey] {
  const o = expectRecord(value, context);
  if (!("step1" in o && "step2" in o && "step3" in o)) {
    throw new Error(`${context}: expected step1, step2, step3`);
  }
  const s3 = o.step3;
  let step3: string | Record<EvidenceMatrixKey, string>;
  if (typeof s3 === "string") {
    step3 = expectNonEmptyString(s3, `${context}.step3`);
  } else {
    const r = expectRecord(s3, `${context}.step3`);
    const keys: EvidenceMatrixKey[] = ["clear_source", "partial_source", "no_source"];
    const ob: Partial<Record<EvidenceMatrixKey, string>> = {};
    for (const ek of keys) {
      if (!(ek in r)) {
        throw new Error(`${context}.step3: missing key ${ek}`);
      }
      ob[ek] = expectNonEmptyString(r[ek], `${context}.step3.${ek}`);
    }
    step3 = ob as Record<EvidenceMatrixKey, string>;
  }
  return {
    step1: expectNonEmptyString(o.step1, `${context}.step1`),
    step2: expectNonEmptyString(o.step2, `${context}.step2`),
    step3
  };
}

function parseDefaultPromptChoice(
  value: unknown,
  context: string
): TaskMethodMatrix["defaultPromptChoice"] {
  const o = expectRecord(value, context);
  const out = {} as TaskMethodMatrix["defaultPromptChoice"];
  for (const key of MATRIX_TASK_KEYS) {
    if (!(key in o)) {
      throw new Error(`${context}: missing ${key}`);
    }
    out[key] = parseDefaultPromptRow(o[key], `${context}.${key}`);
  }
  return out;
}

function parseTaskMethodMatrix(raw: typeof taskMethodMatrixRaw): TaskMethodMatrix {
  const ctx = "task-method-matrix.json";
  const root = expectRecord(raw, ctx);
  if (!("version" in root)) {
    throw new Error(`${ctx}: missing version`);
  }
  const version = expectNonEmptyString(root.version, `${ctx}.version`);
  if (!("baseMatrix" in root)) {
    throw new Error(`${ctx}: missing baseMatrix`);
  }
  const baseMatrix = parseBaseMatrix(root.baseMatrix, `${ctx}.baseMatrix`);
  if (!("overrides" in root)) {
    throw new Error(`${ctx}: missing overrides`);
  }
  const ov = expectRecord(root.overrides, `${ctx}.overrides`);
  if (!("evidence" in ov)) {
    throw new Error(`${ctx}.overrides: missing evidence`);
  }
  const evRoot = expectRecord(ov.evidence, `${ctx}.overrides.evidence`);
  const evidenceKeys: EvidenceMatrixKey[] = ["clear_source", "partial_source", "no_source"];
  const evidence = {} as TaskMethodMatrix["overrides"]["evidence"];
  for (const ek of evidenceKeys) {
    if (!(ek in evRoot)) {
      throw new Error(`${ctx}.overrides.evidence: missing ${ek}`);
    }
    evidence[ek] = parseEvidenceBucket(evRoot[ek], `${ctx}.overrides.evidence.${ek}`);
  }
  if (!("remove" in evidence.no_source) || evidence.no_source.remove === undefined) {
    throw new Error(`${ctx}.overrides.evidence.no_source: missing remove`);
  }
  if (!("impact" in ov)) {
    throw new Error(`${ctx}.overrides: missing impact`);
  }
  const imp = expectRecord(ov.impact, `${ctx}.overrides.impact`);
  if (!("high" in imp)) {
    throw new Error(`${ctx}.overrides.impact: missing high`);
  }
  const high = expectRecord(imp.high, `${ctx}.overrides.impact.high`);
  if (!("rules" in high)) {
    throw new Error(`${ctx}.overrides.impact.high: missing rules`);
  }
  const impactHighRules = parseImpactHighRules(high.rules, `${ctx}.overrides.impact.high.rules`);
  if (!("defaultPromptChoice" in root)) {
    throw new Error(`${ctx}: missing defaultPromptChoice`);
  }
  const defaultPromptChoice = parseDefaultPromptChoice(
    root.defaultPromptChoice,
    `${ctx}.defaultPromptChoice`
  );
  const overrides: TaskMethodMatrix["overrides"] = {
    evidence,
    impact: { high: { rules: impactHighRules } }
  };
  if ("intended_use" in ov && ov.intended_use !== undefined) {
    const iu = expectRecord(ov.intended_use, `${ctx}.overrides.intended_use`);
    const iuOut: Record<string, { rules: TaskMethodImpactHighRule[] }> = {};
    for (const [k, v] of Object.entries(iu)) {
      const bucket = expectRecord(v, `${ctx}.overrides.intended_use.${k}`);
      if (!("rules" in bucket)) {
        throw new Error(`${ctx}.overrides.intended_use.${k}: missing rules`);
      }
      iuOut[k] = {
        rules: parseImpactHighRules(bucket.rules, `${ctx}.overrides.intended_use.${k}.rules`)
      };
    }
    overrides.intended_use = iuOut;
  }

  const result: TaskMethodMatrix = {
    version,
    baseMatrix,
    overrides,
    defaultPromptChoice
  };
  if ("notes" in root) {
    result.notes = root.notes;
  }
  if ("selectionPolicy" in root) {
    result.selectionPolicy = root.selectionPolicy;
  }
  if ("copyGuardrails" in root) {
    result.copyGuardrails = root.copyGuardrails;
  }
  return result;
}

export const scoringConfigTyped: ScoringConfig = parseScoringConfig(scoringConfigRaw);

export const escalationConfigTyped: EscalationConfig = parseEscalationConfig(escalationConfigRaw);

export const recommendationMapTyped: RecommendationMap = parseRecommendationMap(recommendationMapRaw);

export const taskMethodMatrixTyped: TaskMethodMatrix = parseTaskMethodMatrix(taskMethodMatrixRaw);
