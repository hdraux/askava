import type { Inputs, Result as EvaluationResult } from "../lib/types";
import DebugPanel from "./DebugPanel";
import Result from "./Result";
import { EVIDENCE_OPTIONS, IMPACT_OPTIONS, TASK_OPTIONS, USE_OPTIONS } from "./wizardMetadata";

interface Props {
  inputs: Inputs;
  result: EvaluationResult;
  onEdit: () => void;
}

function lookupLabel<T extends string>(value: T, options: Array<{ value: T; label: string }>) {
  const match = options.find((option) => option.value === value);
  return match ? match.label : value;
}

export default function ResultScreen({ inputs, result, onEdit }: Props) {
  return (
    <section className="result-screen">
      <div className="result-screen__selections card">
        <dl className="result-screen__summary-grid">
          <div>
            <dt>Task type</dt>
            <dd>{lookupLabel(inputs.task, TASK_OPTIONS)}</dd>
          </div>
          <div>
            <dt>Intended use</dt>
            <dd>{lookupLabel(inputs.use, USE_OPTIONS)}</dd>
          </div>
          <div>
            <dt>Impact if wrong</dt>
            <dd>{lookupLabel(inputs.impact, IMPACT_OPTIONS)}</dd>
          </div>
          <div>
            <dt>Evidence availability</dt>
            <dd>{lookupLabel(inputs.evidence, EVIDENCE_OPTIONS)}</dd>
          </div>
        </dl>
        <button type="button" className="button-secondary result-screen__edit" onClick={onEdit}>
          Edit inputs
        </button>
      </div>
      <Result data={result.recommendation} />
      <DebugPanel data={result.debug} />
    </section>
  );
}
