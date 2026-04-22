import type { Inputs } from "../lib/types";

interface Props {
  inputs: Partial<Inputs>;
}

export default function InputSummary({ inputs }: Props) {
  if (!inputs.task && !inputs.use && !inputs.impact && !inputs.evidence) {
    return null;
  }

  return (
    <details className="card">
      <summary>Review inputs</summary>
      <dl className="summary-grid">
        <dt>Task</dt>
        <dd>{inputs.task ?? "Not selected"}</dd>
        <dt>Use</dt>
        <dd>{inputs.use ?? "Not selected"}</dd>
        <dt>Impact</dt>
        <dd>{inputs.impact ?? "Not selected"}</dd>
        <dt>Evidence</dt>
        <dd>{inputs.evidence ?? "Not selected"}</dd>
      </dl>
    </details>
  );
}
