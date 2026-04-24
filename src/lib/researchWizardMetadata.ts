// src/components/researchWizardMetadata.ts
//
// Question titles, helper text, and minimum human action strings for
// AVA Research mode. Option arrays live in the step components (as in TaskStep.tsx).

import type { StepMeta } from "./wizardMetadata";
import type { ActivityType } from "../lib/researchTypes";

export const RESEARCH_STEP_METADATA: Record<1 | 2 | 3 | 4, StepMeta> = {
  1: {
    title: "What research activity did you use AI for?",
    helper: "Pick the activity that best describes what you asked AI to do.",
  },
  2: {
    title: "Where in your research process will you use this output?",
    helper: "Think about what happens next, not just where you are now.",
  },
  3: {
    title: "What happens if the output is wrong?",
    helper: "Consider the worst plausible case, not the most likely one.",
  },
  4: {
    title: "What can you check this output against?",
    helper: "This includes papers, raw data, code, protocols, or applicable standards.",
  },
};

// Lookup labels for the collapsed pill in the wizard.
// Values must match the option values defined in each step component.
export const RESEARCH_STEP_LABELS: Record<string, Record<string, string>> = {
  activity: {
    A1: "Searching and discovering literature",
    A2: "Synthesising and summarising evidence",
    A3: "Generating ideas and hypotheses",
    A4: "Designing studies or experiments",
    A5: "Processing, analysing, or coding data",
    A6: "Writing or editing research text",
    A7: "Interpreting results or drawing conclusions",
    A8: "Checking compliance or reporting standards",
  },
  stage: {
    S1: "Personal exploration",
    S2: "Internal working document",
    S3: "Informing a research decision or direction",
    S4: "Manuscript draft",
    S5: "Submission or publication",
  },
  impact: {
    I1: "Low",
    I2: "Medium",
    I3: "High",
  },
  verificationObject: {
    V1: "Direct: I have something to check against",
    V2: "Partial: some material available",
    V3: "Weak or indirect",
    V4: "None",
  },
};

// Minimum human action shown above prompts in the result.
// One per activity — always visible regardless of level.
export const MINIMUM_HUMAN_ACTION: Record<ActivityType, string> = {
  A1: "Inspect the result set for gaps and run at least one independent search before treating coverage as representative.",
  A2: "Verify every citation independently before reuse. Do not rely on the synthesis alone to represent the literature.",
  A3: "Assess novelty against your own knowledge of the field. Do not treat AI-generated directions as a complete map of the space.",
  A4: "Have the design reviewed by a domain expert before use. Do not rely on AI-generated protocols for replication-critical elements.",
  A5: "Rerun or independently verify the analysis before reporting results. Do not use AI-generated outputs as a primary analysis without checking.",
  A6: "Trace every claim to a source before submission. Do not rely on the text's internal coherence as evidence of accuracy.",
  A7: "Assess conclusions against the raw results yourself. Do not adopt AI-generated interpretations without independent judgement.",
  A8: "Verify each compliance item against the original standard or guideline. Do not treat AI-generated checklists as authoritative.",
};
