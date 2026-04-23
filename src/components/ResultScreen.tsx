import type { Inputs, Result as EvaluationResult } from "../lib/types";
import DebugPanel from "./DebugPanel";
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

const LEVELS = [0, 1, 2, 3, 4] as const;

function IconLayers() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1.5 5.5L8 2.5l6.5 3L8 8.5 1.5 5.5z" />
      <path d="M1.5 10.5l6.5 3 6.5-3" />
      <path d="M1.5 8l6.5 3 6.5-3" />
    </svg>
  );
}

function IconTarget() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="8" cy="8" r="6" />
      <circle cx="8" cy="8" r="2.5" />
      <line x1="8" y1="1.5" x2="8" y2="4" />
      <line x1="8" y1="12" x2="8" y2="14.5" />
      <line x1="1.5" y1="8" x2="4" y2="8" />
      <line x1="12" y1="8" x2="14.5" y2="8" />
    </svg>
  );
}

function IconBarChart() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1.5" y="9" width="3" height="5.5" rx="0.5" />
      <rect x="6.5" y="5.5" width="3" height="9" rx="0.5" />
      <rect x="11.5" y="2" width="3" height="12.5" rx="0.5" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 1.5L2 4v3.5c0 3.5 2.5 6 6 7 3.5-1 6-3.5 6-7V4L8 1.5z" />
    </svg>
  );
}

function IconChevronDown() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3,5 7,9 11,5" />
    </svg>
  );
}

function IconSearch() {
  return (
    <svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="11" height="14" rx="1.5" />
      <circle cx="14.5" cy="14.5" r="3.5" />
      <line x1="17" y1="17" x2="18.5" y2="18.5" />
      <line x1="5" y1="6" x2="10" y2="6" />
      <line x1="5" y1="9" x2="10" y2="9" />
    </svg>
  );
}

function IconChartBig() {
  return (
    <svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="11" width="4" height="7" rx="0.5" />
      <rect x="8" y="6" width="4" height="12" rx="0.5" />
      <rect x="14" y="2" width="4" height="16" rx="0.5" />
    </svg>
  );
}

function IconScales() {
  return (
    <svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="10" y1="2" x2="10" y2="18" />
      <line x1="6" y1="18" x2="14" y2="18" />
      <line x1="2" y1="6" x2="18" y2="6" />
      <path d="M2 6L1 11a4 4 0 008 0L8 6" />
      <path d="M18 6l1 5a4 4 0 01-8 0l1-5" />
    </svg>
  );
}

function IconFlag() {
  return (
    <svg width="19" height="19" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="2" x2="4" y2="18" />
      <path d="M4 3.5h12l-3 4.5 3 4.5H4" />
    </svg>
  );
}

const CHECKLIST_ICONS = [
  <IconSearch key="search" />,
  <IconChartBig key="chart" />,
  <IconScales key="scales" />,
  <IconFlag key="flag" />,
];

export default function ResultScreen({ inputs, result, onEdit }: Props) {
  const { recommendation } = result;

  return (
    <section className="result-screen">
      <div className="result-screen__bar card">
        {(
          [
            { icon: <IconLayers />, label: "Task type", value: lookupLabel(inputs.task, TASK_OPTIONS) },
            { icon: <IconTarget />, label: "Intended use", value: lookupLabel(inputs.use, USE_OPTIONS) },
            { icon: <IconBarChart />, label: "Impact if wrong", value: lookupLabel(inputs.impact, IMPACT_OPTIONS) },
            { icon: <IconShield />, label: "Evidence availability", value: lookupLabel(inputs.evidence, EVIDENCE_OPTIONS) },
          ] as const
        ).map(({ icon, label, value }) => (
          <button key={label} type="button" className="result-screen__field" onClick={onEdit}>
            <span className="result-screen__field-header">
              <span className="result-screen__field-icon">{icon}</span>
              <span className="result-screen__field-label">{label}</span>
            </span>
            <span className="result-screen__field-value">
              <span>{value}</span>
              <IconChevronDown />
            </span>
          </button>
        ))}
      </div>

      <div className="result-screen__cols">
        <div className="card result-screen__level-card">
          <p className="eyebrow">Verification level</p>
          <div className="result-screen__hero">
            <span className="result-screen__hero-num">{recommendation.level}</span>
            <span className="result-screen__hero-name">{recommendation.levelName}</span>
          </div>
          <div className="result-screen__progress">
            {LEVELS.map((n) => (
              <div
                key={n}
                className={[
                  "result-screen__progress-seg",
                  n < recommendation.level ? "is-past" : "",
                  n === recommendation.level ? "is-current" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              />
            ))}
          </div>
          <div className="result-screen__progress-nums">
            {LEVELS.map((n) => (
              <span key={n} className={n === recommendation.level ? "is-current" : ""}>
                {n}
              </span>
            ))}
          </div>
          <p className="result-screen__explanation">{recommendation.explanation}</p>
          {recommendation.escalationNotice && (
            <p className="notice">{recommendation.escalationNotice}</p>
          )}
        </div>

        <div className="card result-screen__checklist-card">
          <p className="eyebrow">Verification checklist</p>
          {recommendation.checklist.length > 0 ? (
            <ul className="result-screen__checklist">
              {recommendation.checklist.map((item, i) => (
                <li key={item} className="result-screen__check-item">
                  <span className="result-screen__check-icon">
                    {CHECKLIST_ICONS[i % CHECKLIST_ICONS.length]}
                  </span>
                  <span className="result-screen__check-text">{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="result__empty">No specific verification actions were generated for this case.</p>
          )}
        </div>
      </div>

      <DebugPanel data={result.debug} />
    </section>
  );
}
