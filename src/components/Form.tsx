import { useMemo, useState } from "react";
import type { Evidence, Impact, Inputs, IntendedUse, TaskType } from "../lib/types";

interface Props {
  onSubmit: (inputs: Inputs) => void;
  onInputsChange: (inputs: Partial<Inputs>) => void;
}

const TASK_OPTIONS: Array<{ value: TaskType; label: string }> = [
  { value: "T1", label: "Classification / labelling — tagging, routing, triage" },
  { value: "T2", label: "Summarisation / extraction — notes, summaries, pulled fields" },
  { value: "T3", label: "Drafting / writing — emails, reports, proposals" },
  { value: "T4", label: "Code generation — scripts, queries, config" },
  { value: "T5", label: "Translation — language or register conversion" },
  { value: "T6", label: "Data transformation — reformatting or restructuring" },
  { value: "T7", label: "Research / planning — questions, comparisons, brainstorms" },
  { value: "T8", label: "Evaluation / scoring — grading, ranking, assessment" },
  { value: "T9", label: "Calculation / analysis — numbers, modelling, statistics" },
  { value: "T10", label: "Policy interpretation — rules, regulations, criteria" }
];

const USE_OPTIONS: Array<{ value: IntendedUse; label: string }> = [
  { value: "U1", label: "Personal — for your own use only" },
  { value: "U2", label: "Internal draft — shared with colleagues" },
  { value: "U3", label: "Decision support — informs a real decision" },
  { value: "U4", label: "External / operational — sent out or triggers action" },
  { value: "U5", label: "Regulatory / high-stakes — compliance or legal accountability" }
];

const IMPACT_OPTIONS: Array<{ value: Impact; label: string }> = [
  { value: "I1", label: "Low — minor inconvenience" },
  { value: "I2", label: "Medium — confusion, rework, reputational friction" },
  { value: "I3", label: "High — financial, legal, operational, or personal harm" }
];

const EVIDENCE_OPTIONS: Array<{ value: Evidence; label: string }> = [
  { value: "E1", label: "Clear source — document, dataset, or ground truth exists" },
  { value: "E2", label: "Partial source — some reference material exists" },
  { value: "E3", label: "No source — generative output, no ground truth" }
];

export default function Form({ onSubmit, onInputsChange }: Props) {
  const [task, setTask] = useState<TaskType | "">("");
  const [use, setUse] = useState<IntendedUse | "">("");
  const [impact, setImpact] = useState<Impact | "">("");
  const [evidence, setEvidence] = useState<Evidence | "">("");

  const isComplete = useMemo(
    () => Boolean(task && use && impact && evidence),
    [task, use, impact, evidence]
  );

  const partialInputs = {
    ...(task ? { task } : {}),
    ...(use ? { use } : {}),
    ...(impact ? { impact } : {}),
    ...(evidence ? { evidence } : {})
  };

  return (
    <section className="card">
      <div className="field">
        <label htmlFor="task">Task type</label>
        <select
          id="task"
          value={task}
          onChange={(e) => {
            const value = e.target.value as TaskType | "";
            setTask(value);
            onInputsChange({ ...partialInputs, ...(value ? { task: value } : {}) });
          }}
        >
          <option value="">Select task type</option>
          {TASK_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="use">Intended use</label>
        <select
          id="use"
          value={use}
          onChange={(e) => {
            const value = e.target.value as IntendedUse | "";
            setUse(value);
            onInputsChange({ ...partialInputs, ...(value ? { use: value } : {}) });
          }}
        >
          <option value="">Select intended use</option>
          {USE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="impact">Impact if wrong</label>
        <select
          id="impact"
          value={impact}
          onChange={(e) => {
            const value = e.target.value as Impact | "";
            setImpact(value);
            onInputsChange({ ...partialInputs, ...(value ? { impact: value } : {}) });
          }}
        >
          <option value="">Select impact</option>
          {IMPACT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="evidence">Evidence availability</label>
        <select
          id="evidence"
          value={evidence}
          onChange={(e) => {
            const value = e.target.value as Evidence | "";
            setEvidence(value);
            onInputsChange({ ...partialInputs, ...(value ? { evidence: value } : {}) });
          }}
        >
          <option value="">Select evidence availability</option>
          {EVIDENCE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="button"
        disabled={!isComplete}
        onClick={() => {
          if (isComplete) {
            onSubmit({
              task: task as TaskType,
              use: use as IntendedUse,
              impact: impact as Impact,
              evidence: evidence as Evidence
            });
          }
        }}
      >
        Evaluate
      </button>
    </section>
  );
}
