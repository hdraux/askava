import { useRef, useState } from "react";
import type { Evidence, Impact, Inputs, IntendedUse, TaskType } from "../lib/types";
import TaskStep from "./steps/TaskStep";
import UseStep from "./steps/UseStep";
import ImpactStep from "./steps/ImpactStep";
import EvidenceStep from "./steps/EvidenceStep";
import {
  STEP_METADATA,
  TASK_OPTIONS,
  USE_OPTIONS,
  IMPACT_OPTIONS,
  EVIDENCE_OPTIONS,
} from "./wizardMetadata";
import { PROMPT_LIBRARY } from "../lib/promptLibraryData";
import type { PromptEntry } from "../lib/promptLibraryData";
import { evaluate } from "../lib/evaluate";
import { selectPrompts } from "../lib/selectPrompts";
import {
  escalationConfigTyped,
  recommendationMapTyped,
  scoringConfigTyped,
  taskMethodMatrixTyped,
} from "../lib/parseConfig";

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconCheck({ size = 11 }: { size?: number }) {
  return (
    <svg viewBox="0 0 11 11" fill="none" width={size} height={size}>
      <polyline points="1.5,5.5 4.5,8.5 9.5,2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconChevronDown() {
  return (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" width="12" height="12">
      <polyline points="2,4 6,8 10,4" />
    </svg>
  );
}

function IconChevronUp() {
  return (
    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" width="12" height="12">
      <polyline points="2,8 6,4 10,8" />
    </svg>
  );
}

function IconCopy() {
  return (
    <svg viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" width="13" height="13">
      <rect x="1" y="3" width="8" height="9" rx="1" />
      <path d="M4 3V2a1 1 0 011-1h6a1 1 0 011 1v8a1 1 0 01-1 1h-1" />
    </svg>
  );
}

function IconCopied() {
  return (
    <svg viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" width="13" height="13">
      <polyline points="2,6 5,9 11,3" />
    </svg>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

type StepId = "task" | "use" | "impact" | "evidence";

const STEP_IDS: StepId[] = ["task", "use", "impact", "evidence"];

function lookupLabel(stepId: StepId, value: string): string {
  const list =
    stepId === "task"
      ? TASK_OPTIONS
      : stepId === "use"
        ? USE_OPTIONS
        : stepId === "impact"
          ? IMPACT_OPTIONS
          : EVIDENCE_OPTIONS;
  return list.find((o) => o.value === value)?.label ?? value;
}

function stepMetaForIndex(idx: number) {
  const meta = STEP_METADATA[(idx + 1) as 1 | 2 | 3 | 4];
  return { q: meta.title, sub: meta.helper };
}

// ── Level metadata ────────────────────────────────────────────────────────────

const LEVEL_META: Record<number, { label: string; desc: string; colorClass: string }> = {
  0: { label: "Use freely",            desc: "No verification needed for this output.",                                              colorClass: "level--gray"  },
  1: { label: "Quick check",           desc: "A light self-check is enough before using this.",                                     colorClass: "level--green" },
  2: { label: "Grounded verification", desc: "Read carefully and spot-check key claims before using.",                              colorClass: "level--teal"  },
  3: { label: "Independent review",    desc: "Work through both steps below before acting on this output.",                         colorClass: "level--amber" },
  4: { label: "Formal control",        desc: "Do not share or act on this without formal human sign-off and a documented approval.", colorClass: "level--red"   },
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function RevealWizard() {
  const [answers, setAnswers] = useState<Partial<Record<StepId, string>>>({});
  const [visibleCount, setVisibleCount] = useState(1);
  const [openPromptId, setOpenPromptId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const stepRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const allAnswered = STEP_IDS.every((id) => answers[id] !== undefined);

  // Build inputs and evaluate when all answered
  const inputs = allAnswered
    ? {
        task:     answers.task     as TaskType,
        use:      answers.use      as IntendedUse,
        impact:   answers.impact   as Impact,
        evidence: answers.evidence as Evidence,
      }
    : null;

  const evalResult = inputs
    ? evaluate(inputs, scoringConfigTyped, escalationConfigTyped, recommendationMapTyped, false)
    : null;

  const level = evalResult ? (evalResult.recommendation.level as number) : null;
  const lm = level !== null ? LEVEL_META[level] ?? LEVEL_META[4] : null;
  const selectedPromptIds =
    inputs && level !== null
      ? selectPrompts(inputs.task, level, inputs.evidence, inputs.impact, taskMethodMatrixTyped)
      : [];

  const applicablePrompts: PromptEntry[] = selectedPromptIds
    .map((id) => PROMPT_LIBRARY.find((p) => p.id === id))
    .filter((p): p is PromptEntry => p !== undefined);

  function selectOption(stepId: StepId, value: string, stepIdx: number) {
    const newAnswers = { ...answers, [stepId]: value };
    // Clear answers for steps after this one
    STEP_IDS.slice(stepIdx + 1).forEach((id) => delete newAnswers[id]);
    setAnswers(newAnswers);
    setOpenPromptId(null);

    const nextCount = Math.min(stepIdx + 2, STEP_IDS.length);
    setVisibleCount(nextCount);

    // Scroll next step into view
    setTimeout(() => {
      const nextId = STEP_IDS[stepIdx + 1];
      if (nextId && stepRefs.current[nextId]) {
        stepRefs.current[nextId]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 80);
  }

  function reopenStep(stepId: StepId) {
    const idx = STEP_IDS.indexOf(stepId);
    const newAnswers = { ...answers };
    STEP_IDS.slice(idx).forEach((id) => delete newAnswers[id]);
    setAnswers(newAnswers);
    setVisibleCount(idx + 1);
    setOpenPromptId(null);
  }

  function copyPrompt(id: string, text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }

  function renderStep(stepIdx: number) {
    switch (stepIdx) {
      case 0:
        return (
          <TaskStep
            value={answers.task as TaskType | undefined}
            onChange={(value) => selectOption("task", value, 0)}
          />
        );
      case 1:
        return (
          <UseStep
            value={answers.use as IntendedUse | undefined}
            onChange={(value) => selectOption("use", value, 1)}
          />
        );
      case 2:
        return (
          <ImpactStep
            value={answers.impact as Impact | undefined}
            onChange={(value) => selectOption("impact", value, 2)}
          />
        );
      default:
        return (
          <EvidenceStep
            value={answers.evidence as Evidence | undefined}
            onChange={(value) => selectOption("evidence", value, 3)}
          />
        );
    }
  }

  return (
    <div className="reveal-wizard">
      <div className="reveal-wizard__flow">

        {/* Timeline */}
        <div className="reveal-wizard__timeline" aria-hidden="true">
          {STEP_IDS.map((stepId, idx) => (
            <div key={stepId} className="reveal-wizard__tl-item">
              <div className={[
                "reveal-wizard__tl-dot",
                answers[stepId] !== undefined ? "is-done" : idx < visibleCount ? "is-active" : "is-pending",
              ].join(" ")} />
              {idx < STEP_IDS.length - 1 && (
                <div className={[
                  "reveal-wizard__tl-line",
                  answers[stepId] !== undefined ? "is-done" : "",
                ].join(" ")} />
              )}
            </div>
          ))}
          {allAnswered && <div className="reveal-wizard__tl-line reveal-wizard__tl-line--result" />}
          {allAnswered && <div className="reveal-wizard__tl-dot is-result" />}
        </div>

        {/* Steps */}
        <div className="reveal-wizard__steps">
          {STEP_IDS.slice(0, visibleCount).map((stepId, idx) => {
            const isAnswered = answers[stepId] !== undefined;
            const isActive = idx === visibleCount - 1 && !isAnswered;
            const meta = stepMetaForIndex(idx);

            return (
              <div
                key={stepId}
                ref={(el) => { stepRefs.current[stepId] = el; }}
                className={[
                  "reveal-wizard__step",
                  isAnswered ? "is-answered" : "",
                  isActive ? "is-active" : "",
                ].join(" ")}
              >
                {isAnswered ? (
                  /* Collapsed answered state */
                  <div className="reveal-wizard__answered">
                    <span className="reveal-wizard__answered-q">{meta.q}</span>
                    <button
                      type="button"
                      className="reveal-wizard__answered-pill"
                      onClick={() => reopenStep(stepId)}
                      aria-label={`Change answer: ${lookupLabel(stepId, answers[stepId]!)}`}
                    >
                      <span className="reveal-wizard__answered-check" aria-hidden="true">
                        <IconCheck />
                      </span>
                      {lookupLabel(stepId, answers[stepId]!)}
                      <IconChevronDown />
                    </button>
                  </div>
                ) : (
                  /* Active question state */
                  <div className="reveal-wizard__question">
                    <h2 className="reveal-wizard__q-title">{meta.q}</h2>
                    <p className="reveal-wizard__q-sub">{meta.sub}</p>
                    <div role="group" aria-label={meta.q}>
                      {renderStep(idx)}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Inline result */}
          {allAnswered && evalResult && lm && (
            <div className="reveal-wizard__result" aria-label="Verification recommendation">

              {/* Verdict */}
              <div className={`reveal-wizard__verdict ${lm.colorClass}`}>
                <div className="reveal-wizard__verdict-badge" aria-label={`Level ${level}`}>
                  {level}
                </div>
                <div>
                  <p className="reveal-wizard__verdict-title">{lm.label}</p>
                  <p className="reveal-wizard__verdict-desc">{lm.desc}</p>
                </div>
              </div>

              {/* Prompts */}
              {applicablePrompts.length > 0 && (
                <div className="reveal-wizard__section">
                  <div className="reveal-wizard__section-label">
                    Run these prompts
                  </div>
                  <p className="reveal-wizard__prompts-hint">
                    You don't need to run all of them: one per step is enough.
                  </p>
                  <ul className="reveal-wizard__prompts" aria-label="Verification prompts">
                    {applicablePrompts.map((p, i) => {
                      const isOpen = openPromptId === p.id;
                      const isCopied = copiedId === p.id;
                      return (
                        <li key={p.id} className="prompt-card reveal-wizard__prompt-item">
                          <button
                            type="button"
                            className="prompt-card__header"
                            onClick={() => setOpenPromptId(isOpen ? null : p.id)}
                            aria-expanded={isOpen}
                            aria-controls={`prompt-${p.id}`}
                          >
                            <div className="prompt-card__meta">
                              <span className="reveal-wizard__prompt-num" aria-hidden="true">{i + 1}</span>
                              <div>
                                <span className="prompt-card__name">{p.name}</span>
                                <span className="prompt-card__when">{p.when}</span>
                              </div>
                            </div>
                            <div className="prompt-card__badges">
                              <span className="prompt-card__seq-tag">{p.sequenceTag}</span>
                              <span className={`prompt-card__chevron${isOpen ? " is-open" : ""}`}>
                                {isOpen ? <IconChevronUp /> : <IconChevronDown />}
                              </span>
                            </div>
                          </button>
                          {isOpen && (
                            <div className="prompt-card__body" id={`prompt-${p.id}`}>
                              <div className="prompt-card__actions">
                                <button
                                  type="button"
                                  className="btn-secondary prompt-card__copy"
                                  onClick={() => copyPrompt(p.id, p.text)}
                                  aria-label={isCopied ? "Copied" : `Copy ${p.name} prompt`}
                                >
                                  {isCopied ? <><IconCopied /> Copied</> : <><IconCopy /> Copy prompt</>}
                                </button>
                              </div>
                              <pre className="prompt-card__text" aria-label="Prompt text">
                                {p.text}
                              </pre>
                              <div className="prompt-card__footer">
                                <p className="prompt-card__note">{p.note}</p>
                              </div>
                            </div>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  <p className="reveal-wizard__prompts-note">
                    Run each prompt in a new conversation. Include your AI output
                    in the message when you send it.
                  </p>
                </div>
              )}

              {evalResult.recommendation.escalationNotice && (
                <p className="notice">{evalResult.recommendation.escalationNotice}</p>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
