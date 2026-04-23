import type { Evidence, Impact, IntendedUse, TaskType } from "../lib/types";

export interface ChoiceOption<T extends string> {
  value: T;
  label: string;
  description: string;
  icon?: string;
}

export interface StepMeta {
  title: string;
  helper: string;
}

export const STEP_METADATA: Record<1 | 2 | 3 | 4, StepMeta> = {
  1: {
    title: "What kind of task did the AI do?",
    helper: "Choose the closest task type so AVA can set an appropriate verification baseline."
  },
  2: {
    title: "What will you use this output for?",
    helper: "Select the intended use to reflect how broadly this output will be relied on."
  },
  3: {
    title: "What happens if the output is wrong?",
    helper: "Estimate impact if incorrect to calibrate review depth and controls."
  },
  4: {
    title: "Can you check this output against a source?",
    helper: "Indicate source availability so AVA can suggest practical verification methods."
  }
};

export const TASK_OPTIONS: ChoiceOption<TaskType>[] = [
  { value: "T3", label: "Content generation", description: "Drafts, reports, summaries, or recommendations", icon: "✍" },
  { value: "T9", label: "Data analysis", description: "Trends, calculations, or statistical insights", icon: "📊" },
  { value: "T2", label: "Summarisation", description: "Meeting notes, document summaries, data pulled from text", icon: "📝" },
  { value: "T7", label: "Information lookup", description: "Facts, definitions, or quick answers", icon: "🔍" },
  { value: "T4", label: "Coding assistance", description: "Code generation, debugging, or technical explanations", icon: "💻" },
  { value: "T1", label: "Classification / labelling", description: "Tags, categories, or labels applied to content", icon: "🏷" },
  { value: "T5", label: "Translation", description: "Text translated between languages", icon: "🌐" },
  { value: "T10", label: "Policy interpretation", description: "Laws, regulations, policies, or guidance", icon: "⚖" }
];

export const USE_OPTIONS: ChoiceOption<IntendedUse>[] = [
  { value: "U1", label: "Personal use only", description: "For your own reference; no one else sees it", icon: "👤" },
  { value: "U2", label: "Internal draft", description: "Shared with colleagues; informs a process or discussion", icon: "👥" },
  { value: "U3", label: "Decision support", description: "Feeds into a decision with real consequences", icon: "⚖" },
  { value: "U4", label: "External or operational", description: "Sent to clients, published, or triggers an action", icon: "↗" },
  { value: "U5", label: "Regulatory or high-stakes", description: "Subject to compliance, audit, or legal accountability", icon: "🛡" }
];

export const IMPACT_OPTIONS: ChoiceOption<Impact>[] = [
  { value: "I1", label: "Low impact", description: "Minor inconvenience; easily spotted and corrected", icon: "↧" },
  { value: "I2", label: "Medium impact", description: "Causes confusion, rework, or reputational friction", icon: "📶" },
  { value: "I3", label: "High impact", description: "Material harm: financial, legal, operational, or personal", icon: "⚠" }
];

export const EVIDENCE_OPTIONS: ChoiceOption<Evidence>[] = [
  { value: "E1", label: "Yes, clearly", description: "A document, dataset, or ground truth exists and is accessible", icon: "✓" },
  { value: "E2", label: "Partially", description: "Some reference material exists but is incomplete", icon: "◔" },
  { value: "E3", label: "No source", description: "The output is generative; nothing to check it against", icon: "✕" }
];
