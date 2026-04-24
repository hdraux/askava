import { useRef, useState } from "react";
import type { Evidence, Impact, Inputs, IntendedUse, TaskType } from "../lib/types";
import type { ActivityType, ResearchImpact, ResearchInputs, ResearchStage, VerificationObject } from "../lib/researchTypes";
import TaskStep from "./steps/TaskStep";
import UseStep from "./steps/UseStep";
import ImpactStep from "./steps/ImpactStep";
import EvidenceStep from "./steps/EvidenceStep";
import ActivityStep from "./steps/ActivityStep";
import ResearchStageStep from "./steps/ResearchStageStep";
import VerificationObjectStep from "./steps/VerificationObjectStep";
import {
  STEP_METADATA,
  TASK_OPTIONS,
  USE_OPTIONS,
  IMPACT_OPTIONS,
  EVIDENCE_OPTIONS,
} from "./wizardMetadata";
import {
  RESEARCH_STEP_METADATA,
  RESEARCH_STEP_LABELS,
  MINIMUM_HUMAN_ACTION,
} from "./researchWizardMetadata";
import { PROMPT_LIBRARY } from "../lib/promptLibraryData";
import type { GeneralPromptEntry } from "../lib/promptLibraryData";
import { RESEARCH_PROMPT_LIBRARY } from "../lib/researchPromptLibraryData";
import type { ResearchPromptEntry } from "../lib/researchPromptLibraryData";
import { evaluate } from "../lib/evaluate";
import { selectPrompts } from "../lib/selectPrompts";
import {
  escalationConfigTyped,
  recommendationMapTyped,
  scoringConfigTyped,
  taskMethodMatrixTyped,
} from "../lib/parseConfig";
import { evaluateResearch } from "../lib/researchEvaluate";
import { selectResearchPrompts } from "../lib/researchSelectPrompts";
import {
  researchEscalationConfigTyped,
  researchRecommendationMapTyped,
  researchScoringConfigTyped,
  researchTaskMethodMatrixTyped,
} from "../lib/parseResearchConfig";

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
    <svg viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" width="13" height="13" aria-hidden="true">
      <rect x="1" y="3" width="8" height="9" rx="1" />
      <path d="M4 3V2a1 1 0 011-1h6a1 1 0 011 1v8a1 1 0 01-1 1h-1" />
    </svg>
  );
}

function IconCopied() {
  return (
    <svg viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" width="13" height="13" aria-hidden="true">
      <polyline points="2,6 5,9 11,3" />
    </svg>
  );
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type WizardMode = "general" | "research";

type GeneralStepId = "task" | "use" | "impact" | "evidence";
type ResearchStepId = "activity" | "stage" | "impact" | "verificationObject";

const GENERAL_STEP_IDS: GeneralStepId[] = ["task", "use", "impact", "evidence"];
const RESEARCH_STEP_IDS: ResearchStepId[] = ["activity", "stage", "impact", "verificationObject"];

// Variant selection state per prompt: "inConversation" | "freshConversation"
type VariantKey = "inConversation" | "freshConversation";

// ── Level metadata ────────────────────────────────────────────────────────────

const LEVEL_META: Record<number, { label: string; desc: string; colorClass: string }> = {
  0: { label: "Use freely",            desc: "No verification needed for this output.",                                              colorClass: "level--gray"  },
  1: { label: "Quick check",           desc: "A light self-check is enough before using this.",                                     colorClass: "level--green" },
  2: { label: "Grounded verification", desc: "Read carefully and spot-check key claims before using.",                              colorClass: "level--teal"  },
  3: { label: "Independent review",    desc: "Work through both steps below before acting on this output.",                         colorClass: "level--amber" },
  4: { label: "Formal control",        desc: "Do not share or act on this without formal human sign-off and a documented approval.", colorClass: "level--red"   },
};

// ── Label lookup helpers ───────────────────────────────────────────────────────

function lookupGeneralLabel(stepId: GeneralStepId, value: string): string {
  const list =
    stepId === "task"     ? TASK_OPTIONS
    : stepId === "use"    ? USE_OPTIONS
    : stepId === "impact" ? IMPACT_OPTIONS
    : EVIDENCE_OPTIONS;
  return list.find((o) => o.value === value)?.label ?? value;
}

function lookupResearchLabel(stepId: ResearchStepId, value: string): string {
  return RESEARCH_STEP_LABELS[stepId]?.[value] ?? value;
}

// ── Dual-variant prompt card (used in both General and Research modes) ────────

interface DualVariantPromptCardProps {
  p: GeneralPromptEntry | ResearchPromptEntry;
  index: number;
  isOpen: boolean;
  isCopied: boolean;
  onToggle: () => void;
  onCopy: (text: string) => void;
}

function DualVariantPromptCard({
  p, index, isOpen, isCopied, onToggle, onCopy,
}: DualVariantPromptCardProps) {
  const [variant, setVariant] = useState<VariantKey>("inConversation");
  const activeVariant = p[variant];

  // For computational-check the two variants are identical (both require fresh)
  // — detect this and show a single variant without the switcher
  const variantsAreSame = p.inConversation.text === p.freshConversation.text;

  return (
    <li className="prompt-card reveal-wizard__prompt-item">
      <button
        type="button"
        className="prompt-card__header"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`prompt-${p.id}`}
      >
        <div className="prompt-card__meta">
          <span className="reveal-wizard__prompt-num" aria-hidden="true">{index + 1}</span>
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

          {/* Variant switcher — only shown when variants differ */}
          {!variantsAreSame && (
            <div className="prompt-card__variant-switcher" role="group" aria-label="Where to run this prompt">
              <button
                type="button"
                className={`prompt-card__variant-btn${variant === "inConversation" ? " is-active" : ""}`}
                onClick={() => setVariant("inConversation")}
                aria-pressed={variant === "inConversation"}
              >
                {p.inConversation.where}
              </button>
              <button
                type="button"
                className={`prompt-card__variant-btn${variant === "freshConversation" ? " is-active" : ""}`}
                onClick={() => setVariant("freshConversation")}
                aria-pressed={variant === "freshConversation"}
              >
                {p.freshConversation.where}
              </button>
            </div>
          )}

          {/* Why this context matters */}
          {!variantsAreSame && (
            <p className="prompt-card__why-here">{activeVariant.whyHere}</p>
          )}
          {variantsAreSame && (
            <p className="prompt-card__why-here">{p.inConversation.whyHere}</p>
          )}

          <div className="prompt-card__text-wrap">
            <button
              type="button"
              className="btn-secondary prompt-card__copy"
              onClick={() => onCopy(activeVariant.text)}
              aria-label={isCopied ? "Copied" : `Copy ${p.name} prompt`}
            >
              {isCopied ? <><IconCopied /> Copied</> : <><IconCopy /> Copy prompt</>}
            </button>
            <pre className="prompt-card__text" aria-label="Prompt text">
              {activeVariant.text}
            </pre>
          </div>

          <div className="prompt-card__footer">
            <p className="prompt-card__note">{p.note}</p>
          </div>
        </div>
      )}
    </li>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

interface RevealWizardProps {
  mode?: WizardMode;
}

export default function RevealWizard({ mode = "general" }: RevealWizardProps) {
  const isResearch = mode === "research";

  const [answers, setAnswers] = useState<Partial<Record<string, string>>>({});
  const [visibleCount, setVisibleCount] = useState(1);
  const [openPromptId, setOpenPromptId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const stepRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const stepIds: readonly string[] = isResearch ? RESEARCH_STEP_IDS : GENERAL_STEP_IDS;
  const allAnswered = stepIds.every((id) => answers[id] !== undefined);

  // ── Evaluate ───────────────────────────────────────────────────────────────

  const generalInputs: Inputs | null =
    !isResearch && allAnswered
      ? {
          task:     answers.task     as TaskType,
          use:      answers.use      as IntendedUse,
          impact:   answers.impact   as Impact,
          evidence: answers.evidence as Evidence,
        }
      : null;

  const researchInputs: ResearchInputs | null =
    isResearch && allAnswered
      ? {
          activity:           answers.activity           as ActivityType,
          stage:              answers.stage              as ResearchStage,
          impact:             answers.impact             as ResearchImpact,
          verificationObject: answers.verificationObject as VerificationObject,
        }
      : null;

  const generalResult = generalInputs
    ? evaluate(generalInputs, scoringConfigTyped, escalationConfigTyped, recommendationMapTyped, false)
    : null;

  const researchResult = researchInputs
    ? evaluateResearch(researchInputs, researchScoringConfigTyped, researchEscalationConfigTyped, researchRecommendationMapTyped, false)
    : null;

  const level =
    (isResearch ? researchResult?.recommendation.level : generalResult?.recommendation.level) ?? null;
  const lm = level !== null ? LEVEL_META[level] ?? LEVEL_META[4] : null;

  // ── Prompt selection ───────────────────────────────────────────────────────

  const selectedPromptIds: string[] =
    level !== null && allAnswered
      ? isResearch && researchInputs
        ? selectResearchPrompts(researchInputs, level, researchTaskMethodMatrixTyped)
        : generalInputs
          ? selectPrompts(generalInputs.task, level, generalInputs.evidence, generalInputs.impact, taskMethodMatrixTyped)
          : []
      : [];

  // General mode uses GeneralPromptEntry[]; Research mode uses ResearchPromptEntry[]
  const generalPrompts: GeneralPromptEntry[] = !isResearch
    ? selectedPromptIds
        .map((id) => PROMPT_LIBRARY.find((p) => p.id === id))
        .filter((p): p is GeneralPromptEntry => p !== undefined)
    : [];

  const researchPrompts: ResearchPromptEntry[] = isResearch
    ? selectedPromptIds
        .map((id) => RESEARCH_PROMPT_LIBRARY.find((p) => p.id === id))
        .filter((p): p is ResearchPromptEntry => p !== undefined)
    : [];

  // ── Minimum human action (research only) ──────────────────────────────────

  const minHumanAction =
    isResearch && researchInputs
      ? MINIMUM_HUMAN_ACTION[researchInputs.activity]
      : null;

  const escalationNotice =
    isResearch
      ? researchResult?.recommendation.escalationNotice
      : generalResult?.recommendation.escalationNotice;

  // ── Wizard interaction ─────────────────────────────────────────────────────

  function selectOption(stepId: string, value: string, stepIdx: number) {
    const newAnswers = { ...answers, [stepId]: value };
    stepIds.slice(stepIdx + 1).forEach((id) => delete newAnswers[id]);
    setAnswers(newAnswers);
    setOpenPromptId(null);

    const nextCount = Math.min(stepIdx + 2, stepIds.length);
    setVisibleCount(nextCount);

    setTimeout(() => {
      const nextId = stepIds[stepIdx + 1];
      if (nextId && stepRefs.current[nextId]) {
        stepRefs.current[nextId]?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 80);
  }

  function reopenStep(stepId: string) {
    const idx = stepIds.indexOf(stepId);
    const newAnswers = { ...answers };
    stepIds.slice(idx).forEach((id) => delete newAnswers[id]);
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

  function lookupLabel(stepId: string, value: string): string {
    return isResearch
      ? lookupResearchLabel(stepId as ResearchStepId, value)
      : lookupGeneralLabel(stepId as GeneralStepId, value);
  }

  function stepMeta(idx: number) {
    const meta = isResearch
      ? RESEARCH_STEP_METADATA[(idx + 1) as 1 | 2 | 3 | 4]
      : STEP_METADATA[(idx + 1) as 1 | 2 | 3 | 4];
    return { q: meta.title, sub: meta.helper };
  }

  function renderStep(stepIdx: number) {
    if (isResearch) {
      switch (stepIdx) {
        case 0: return <ActivityStep value={answers.activity as ActivityType | undefined} onChange={(v) => selectOption("activity", v, 0)} />;
        case 1: return <ResearchStageStep value={answers.stage as ResearchStage | undefined} onChange={(v) => selectOption("stage", v, 1)} />;
        case 2: return <ImpactStep value={answers.impact as Impact | undefined} onChange={(v) => selectOption("impact", v, 2)} />;
        default: return <VerificationObjectStep value={answers.verificationObject as VerificationObject | undefined} onChange={(v) => selectOption("verificationObject", v, 3)} />;
      }
    }
    switch (stepIdx) {
      case 0: return <TaskStep value={answers.task as TaskType | undefined} onChange={(v) => selectOption("task", v, 0)} />;
      case 1: return <UseStep value={answers.use as IntendedUse | undefined} onChange={(v) => selectOption("use", v, 1)} />;
      case 2: return <ImpactStep value={answers.impact as Impact | undefined} onChange={(v) => selectOption("impact", v, 2)} />;
      default: return <EvidenceStep value={answers.evidence as Evidence | undefined} onChange={(v) => selectOption("evidence", v, 3)} />;
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="reveal-wizard">
      <div className="reveal-wizard__flow">

        {/* Timeline */}
        <div className="reveal-wizard__timeline" aria-hidden="true">
          {stepIds.map((stepId, idx) => (
            <div key={stepId} className="reveal-wizard__tl-item">
              <div className={[
                "reveal-wizard__tl-dot",
                answers[stepId] !== undefined ? "is-done" : idx < visibleCount ? "is-active" : "is-pending",
              ].join(" ")} />
              {idx < stepIds.length - 1 && (
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
          {stepIds.slice(0, visibleCount).map((stepId, idx) => {
            const isAnswered = answers[stepId] !== undefined;
            const isActive = idx === visibleCount - 1 && !isAnswered;
            const meta = stepMeta(idx);

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
          {allAnswered && level !== null && lm && (
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

              {/* Minimum human action — research only */}
              {isResearch && minHumanAction && (
                <div className="reveal-wizard__human-action">
                  <p className="reveal-wizard__human-action-label">Before you use this output</p>
                  <p className="reveal-wizard__human-action-text">{minHumanAction}</p>
                </div>
              )}

              {/* Prompts */}
              {(generalPrompts.length > 0 || researchPrompts.length > 0) && (
                <div className="reveal-wizard__section">
                  <div className="reveal-wizard__section-label">Run these prompts</div>
                  <p className="reveal-wizard__prompts-hint">
                    You don't need to run all of them: one per step is usually enough.
                  </p>

                  <ul className="reveal-wizard__prompts" aria-label="Verification prompts">

                    {/* General mode — dual-variant prompt cards */}
                    {!isResearch && generalPrompts.map((p, i) => (
                      <DualVariantPromptCard
                        key={p.id}
                        p={p}
                        index={i}
                        isOpen={openPromptId === p.id}
                        isCopied={copiedId === p.id}
                        onToggle={() => setOpenPromptId(openPromptId === p.id ? null : p.id)}
                        onCopy={(text) => copyPrompt(p.id, text)}
                      />
                    ))}

                    {/* Research mode — dual-variant prompt cards */}
                    {isResearch && researchPrompts.map((p, i) => (
                      <DualVariantPromptCard
                        key={p.id}
                        p={p}
                        index={i}
                        isOpen={openPromptId === p.id}
                        isCopied={copiedId === p.id}
                        onToggle={() => setOpenPromptId(openPromptId === p.id ? null : p.id)}
                        onCopy={(text) => copyPrompt(p.id, text)}
                      />
                    ))}

                  </ul>

                  {level > 0 && (
                    <p className="reveal-wizard__prompts-note reveal-wizard__domain-nudge">
                      {level <= 2
                        ? "Use your domain expertise to apply these checks. It doesn't replace them."
                        : "Expert review should focus on edge cases, assumptions, and failure modes. Treat the output as unverified until checked."}
                    </p>
                  )}

                  <p className="reveal-wizard__prompts-note">
                    AI makes mistakes. These prompts won't catch everything, but they will surface more issues than skipping them.
                  </p>
                </div>
              )}

              {escalationNotice && (
                <p className="notice">{escalationNotice}</p>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
