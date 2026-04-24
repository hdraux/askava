// src/lib/parseResearchConfig.ts
//
// Runtime validation and typed exports for research config files.
// Parallel to parseConfig.ts — uses the same validation helpers pattern
// but validates research-specific shapes.

import researchScoringRaw       from "../config/research.scoring.config.json";
import researchEscalationRaw    from "../config/research.escalation.config.json";
import researchRecommendationRaw from "../config/research.recommendation-map.json";
import researchMatrixRaw        from "../config/research.task-method-matrix.json";

import type {
  ActivityType,
  ResearchEscalationConfig,
  ResearchEscalationTrigger,
  ResearchImpact,
  ResearchMatrixActivityKey,
  ResearchRecommendationEntry,
  ResearchRecommendationMap,
  ResearchScoringConfig,
  ResearchStage,
  ResearchTaskMethodMatrix,
  ResearchVerificationObjectKey,
  VerificationObject,
} from "./researchTypes";
import { RESEARCH_MATRIX_ACTIVITY_KEYS } from "./researchTypes";
import type { VerificationLevel } from "./types";

// ── Shared helpers (mirrors parseConfig.ts helpers) ───────────────────────────

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function expectRecord(value: unknown, context: string): Record<string, unknown> {
  if (!isRecord(value)) throw new Error(`${context}: expected a plain object`);
  return value;
}

function expectFiniteNumber(value: unknown, context: string): number {
  if (typeof value !== "number" || !Number.isFinite(value))
    throw new Error(`${context}: expected a finite number`);
  return value;
}

function expectNonEmptyString(value: unknown, context: string): string {
  if (typeof value !== "string" || value.length === 0)
    throw new Error(`${context}: expected a non-empty string`);
  return value;
}

function expectStringArray(value: unknown, context: string): string[] {
  if (!Array.isArray(value)) throw new Error(`${context}: expected an array`);
  return value.map((el, i) => {
    if (typeof el !== "string") throw new Error(`${context}[${i}]: expected string`);
    return el;
  });
}

function isVerificationLevel(n: number): n is VerificationLevel {
  return n === 0 || n === 1 || n === 2 || n === 3 || n === 4;
}

// ── Value sets ────────────────────────────────────────────────────────────────

const ACTIVITY_TYPES: ActivityType[] = ["A1","A2","A3","A4","A5","A6","A7","A8"];
const RESEARCH_STAGES: ResearchStage[] = ["S1","S2","S3","S4","S5"];
const RESEARCH_IMPACTS: ResearchImpact[] = ["I1","I2","I3"];
const VERIFICATION_OBJECTS: VerificationObject[] = ["V1","V2","V3","V4"];

function isActivityType(v: string): v is ActivityType {
  return ACTIVITY_TYPES.includes(v as ActivityType);
}
function isResearchStage(v: string): v is ResearchStage {
  return RESEARCH_STAGES.includes(v as ResearchStage);
}
function isResearchImpact(v: string): v is ResearchImpact {
  return RESEARCH_IMPACTS.includes(v as ResearchImpact);
}
function isVerificationObject(v: string): v is VerificationObject {
  return VERIFICATION_OBJECTS.includes(v as VerificationObject);
}

// ── Scoring config ────────────────────────────────────────────────────────────

function parseResearchScoringConfig(raw: unknown): ResearchScoringConfig {
  const ctx = "research.scoring.config.json";
  const o = expectRecord(raw, ctx);

  const activityRaw = expectRecord(o.activity, `${ctx}.activity`);
  const activityAdjustments = {} as Record<ActivityType, number>;
  for (const k of ACTIVITY_TYPES) {
    if (!(k in activityRaw)) throw new Error(`${ctx}.activity: missing key "${k}"`);
    activityAdjustments[k] = expectFiniteNumber(activityRaw[k], `${ctx}.activity.${k}`);
  }

  const stageRaw = expectRecord(o.stage, `${ctx}.stage`);
  const stageBaseScores = {} as Record<ResearchStage, number>;
  for (const k of RESEARCH_STAGES) {
    if (!(k in stageRaw)) throw new Error(`${ctx}.stage: missing key "${k}"`);
    stageBaseScores[k] = expectFiniteNumber(stageRaw[k], `${ctx}.stage.${k}`);
  }

  const impactRaw = expectRecord(o.impact, `${ctx}.impact`);
  const impactAdjustments = {} as Record<ResearchImpact, number>;
  for (const k of RESEARCH_IMPACTS) {
    if (!(k in impactRaw)) throw new Error(`${ctx}.impact: missing key "${k}"`);
    impactAdjustments[k] = expectFiniteNumber(impactRaw[k], `${ctx}.impact.${k}`);
  }

  const voRaw = expectRecord(o.verificationObject, `${ctx}.verificationObject`);
  const verificationObjectAdjustments = {} as Record<VerificationObject, number>;
  for (const k of VERIFICATION_OBJECTS) {
    if (!(k in voRaw)) throw new Error(`${ctx}.verificationObject: missing key "${k}"`);
    verificationObjectAdjustments[k] = expectFiniteNumber(voRaw[k], `${ctx}.verificationObject.${k}`);
  }

  const maxLevelNum = expectFiniteNumber(o.maxLevel, `${ctx}.maxLevel`);
  if (!Number.isInteger(maxLevelNum) || !isVerificationLevel(maxLevelNum)) {
    throw new Error(`${ctx}.maxLevel must be 0–4`);
  }

  return { activityAdjustments, stageBaseScores, impactAdjustments, verificationObjectAdjustments, maxLevel: maxLevelNum };
}

// ── Escalation config ─────────────────────────────────────────────────────────

function parseResearchEscalationConfig(raw: unknown): ResearchEscalationConfig {
  const ctx = "research.escalation.config.json";
  const o = expectRecord(raw, ctx);
  if (!Array.isArray(o.triggers)) throw new Error(`${ctx}: triggers must be an array`);

  const triggers: ResearchEscalationTrigger[] = o.triggers.map((el: unknown, i: number) => {
    const itemCtx = `${ctx}.triggers[${i}]`;
    const t = expectRecord(el, itemCtx);
    const id = expectNonEmptyString(t.id, `${itemCtx}.id`);

    const condRaw = expectRecord(t.condition, `${itemCtx}.condition`);
    const condition: Partial<Record<keyof import("./researchTypes").ResearchInputs, string[]>> = {};
    for (const [key, vals] of Object.entries(condRaw)) {
      const arr = expectStringArray(vals, `${itemCtx}.condition.${key}`);
      switch (key) {
        case "activity":
          arr.forEach((v, j) => { if (!isActivityType(v)) throw new Error(`${itemCtx}.condition.activity[${j}]: invalid value "${v}"`); });
          condition.activity = arr as ActivityType[];
          break;
        case "stage":
          arr.forEach((v, j) => { if (!isResearchStage(v)) throw new Error(`${itemCtx}.condition.stage[${j}]: invalid value "${v}"`); });
          condition.stage = arr as ResearchStage[];
          break;
        case "impact":
          arr.forEach((v, j) => { if (!isResearchImpact(v)) throw new Error(`${itemCtx}.condition.impact[${j}]: invalid value "${v}"`); });
          condition.impact = arr as ResearchImpact[];
          break;
        case "verificationObject":
          arr.forEach((v, j) => { if (!isVerificationObject(v)) throw new Error(`${itemCtx}.condition.verificationObject[${j}]: invalid value "${v}"`); });
          condition.verificationObject = arr as VerificationObject[];
          break;
        default:
          throw new Error(`${itemCtx}.condition: unknown key "${key}"`);
      }
    }

    const trigger: ResearchEscalationTrigger = { id, condition };

    if ("minimumLevel" in t && t.minimumLevel !== undefined) {
      const lvl = expectFiniteNumber(t.minimumLevel, `${itemCtx}.minimumLevel`);
      if (!Number.isInteger(lvl) || !isVerificationLevel(lvl))
        throw new Error(`${itemCtx}.minimumLevel must be 0–4`);
      trigger.minimumLevel = lvl;
    }
    if ("escalationNotice" in t && t.escalationNotice !== undefined) {
      trigger.escalationNotice = expectNonEmptyString(t.escalationNotice, `${itemCtx}.escalationNotice`);
    }

    return trigger;
  });

  return { triggers };
}

// ── Recommendation map ────────────────────────────────────────────────────────

function parseResearchRecommendationMap(raw: unknown): ResearchRecommendationMap {
  const ctx = "research.recommendation-map.json";
  const o = expectRecord(raw, ctx);
  if (!Array.isArray(o.levels)) throw new Error(`${ctx}: expected "levels" array`);

  const map: ResearchRecommendationMap = {};
  for (let i = 0; i < o.levels.length; i++) {
    const itemCtx = `${ctx}.levels[${i}]`;
    const entry = expectRecord(o.levels[i], itemCtx);
    const levelNum = expectFiniteNumber(entry.level, `${itemCtx}.level`);
    if (!Number.isInteger(levelNum) || !isVerificationLevel(levelNum))
      throw new Error(`${itemCtx}.level must be 0–4`);
    const explanation = expectNonEmptyString(entry.explanation, `${itemCtx}.explanation`);
    const checklist = expectStringArray(entry.checklist ?? [], `${itemCtx}.checklist`);
    const rec: ResearchRecommendationEntry = { explanation, checklist };
    map[levelNum as VerificationLevel] = rec;
  }
  return map;
}

// ── Task-method matrix ────────────────────────────────────────────────────────

function parseStepBundle(value: unknown, ctx: string) {
  const o = expectRecord(value, ctx);
  return {
    step1: expectStringArray(o.step1, `${ctx}.step1`),
    step2: expectStringArray(o.step2, `${ctx}.step2`),
    step3: expectStringArray(o.step3, `${ctx}.step3`),
  };
}

function parseResearchTaskMethodMatrix(raw: unknown): ResearchTaskMethodMatrix {
  const ctx = "research.task-method-matrix.json";
  const root = expectRecord(raw, ctx);

  // baseMatrix
  const bm = expectRecord(root.baseMatrix, `${ctx}.baseMatrix`);
  const baseMatrix = {} as ResearchTaskMethodMatrix["baseMatrix"];
  for (const key of RESEARCH_MATRIX_ACTIVITY_KEYS) {
    if (!(key in bm)) throw new Error(`${ctx}.baseMatrix: missing row "${key}"`);
    const row = expectRecord(bm[key], `${ctx}.baseMatrix.${key}`);
    const l0 = row.level0;
    if (!Array.isArray(l0) || l0.length !== 0)
      throw new Error(`${ctx}.baseMatrix.${key}.level0: must be empty array`);
    baseMatrix[key] = {
      level0: [],
      level1: parseStepBundle(row.level1, `${ctx}.baseMatrix.${key}.level1`),
      level2: parseStepBundle(row.level2, `${ctx}.baseMatrix.${key}.level2`),
      level3: parseStepBundle(row.level3, `${ctx}.baseMatrix.${key}.level3`),
      level4: parseStepBundle(row.level4, `${ctx}.baseMatrix.${key}.level4`),
    };
  }

  // overrides
  const ov = expectRecord(root.overrides, `${ctx}.overrides`);
  const voOv = expectRecord(ov.verificationObject, `${ctx}.overrides.verificationObject`);
  const noneOv = expectRecord(voOv.none, `${ctx}.overrides.verificationObject.none`);
  const impOv = expectRecord(ov.impact, `${ctx}.overrides.impact`);
  const highOv = expectRecord(impOv.high, `${ctx}.overrides.impact.high`);
  const forceStep3Raw = expectRecord(highOv.forceStep3, `${ctx}.overrides.impact.high.forceStep3`);
  const forceStep3: Partial<Record<ResearchMatrixActivityKey, string>> = {};
  for (const [k, v] of Object.entries(forceStep3Raw)) {
    if (!RESEARCH_MATRIX_ACTIVITY_KEYS.includes(k as ResearchMatrixActivityKey))
      throw new Error(`${ctx}.overrides.impact.high.forceStep3: unknown activity key "${k}"`);
    forceStep3[k as ResearchMatrixActivityKey] = expectNonEmptyString(v, `${ctx}.overrides.impact.high.forceStep3.${k}`);
  }

  // defaultPromptChoice
  const dpcRaw = expectRecord(root.defaultPromptChoice, `${ctx}.defaultPromptChoice`);
  const voKeys: ResearchVerificationObjectKey[] = ["direct", "partial", "weak", "none"];
  const defaultPromptChoice: ResearchTaskMethodMatrix["defaultPromptChoice"] = {};
  for (const [actKey, dpcVal] of Object.entries(dpcRaw)) {
    if (!RESEARCH_MATRIX_ACTIVITY_KEYS.includes(actKey as ResearchMatrixActivityKey))
      throw new Error(`${ctx}.defaultPromptChoice: unknown activity key "${actKey}"`);
    const dpcEntry = expectRecord(dpcVal, `${ctx}.defaultPromptChoice.${actKey}`);
    const step3Raw = expectRecord(dpcEntry.step3, `${ctx}.defaultPromptChoice.${actKey}.step3`);
    const step3 = {} as Record<ResearchVerificationObjectKey, string>;
    for (const vk of voKeys) {
      if (!(vk in step3Raw)) throw new Error(`${ctx}.defaultPromptChoice.${actKey}.step3: missing key "${vk}"`);
      step3[vk] = expectNonEmptyString(step3Raw[vk], `${ctx}.defaultPromptChoice.${actKey}.step3.${vk}`);
    }
    defaultPromptChoice[actKey as ResearchMatrixActivityKey] = { step3 };
  }

  return {
    baseMatrix,
    overrides: {
      verificationObject: {
        none: {
          remove: expectStringArray(noneOv.remove, `${ctx}.overrides.verificationObject.none.remove`),
          replaceWith: expectStringArray(noneOv.replaceWith, `${ctx}.overrides.verificationObject.none.replaceWith`),
        },
      },
      impact: { high: { forceStep3 } },
    },
    defaultPromptChoice,
  };
}

// ── Typed exports ─────────────────────────────────────────────────────────────

export const researchScoringConfigTyped: ResearchScoringConfig =
  parseResearchScoringConfig(researchScoringRaw);

export const researchEscalationConfigTyped: ResearchEscalationConfig =
  parseResearchEscalationConfig(researchEscalationRaw);

export const researchRecommendationMapTyped: ResearchRecommendationMap =
  parseResearchRecommendationMap(researchRecommendationRaw);

export const researchTaskMethodMatrixTyped: ResearchTaskMethodMatrix =
  parseResearchTaskMethodMatrix(researchMatrixRaw);
