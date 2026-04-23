// src/components/steps/TaskStep.tsx
// Step 1 — "What kind of task did the AI do?"
// Props contract: value: TaskType | undefined, onChange: (value: TaskType) => void
// No navigation, no stepper, no submission logic — all handled by VerificationWizard.tsx

import React from "react";
import { TaskType } from "../../lib/types";
import "./TaskStep.css";

// ─── Option definitions ────────────────────────────────────────────────────

interface TaskOption {
  value: TaskType;
  label: string;
  description: string;
  icon: React.ReactNode;
}

const TASK_OPTIONS: TaskOption[] = [
  {
    value: "T10",
    label: "Policy interpretation",
    description: "Laws, regulations, policies, or guidance",
    icon: <PolicyIcon />,
  },
  {
    value: "T9",
    label: "Data analysis",
    description: "Trends, calculations, or statistical insights",
    icon: <DataIcon />,
  },
  {
    value: "T3",
    label: "Content generation",
    description: "Drafts, reports, summaries, or recommendations",
    icon: <ContentIcon />,
  },
  {
    value: "T7",
    label: "Information lookup",
    description: "Facts, definitions, or quick answers",
    icon: <SearchIcon />,
  },
  {
    value: "T2",
    label: "Summarisation",
    description: "Meeting notes, document summaries, data pulled from text",
    icon: <ListIcon />,
  },
  {
    value: "T5",
    label: "Translation",
    description: "Text translated between languages",
    icon: <TranslateIcon />,
  },
  {
    value: "T4",
    label: "Coding assistance",
    description: "Code generation, debugging, or technical explanations",
    icon: <CodeIcon />,
  },
  {
    value: "T8",
    label: "Other",
    description: "Something not listed above",
    icon: <OtherIcon />,
  },
];

// ─── Component ─────────────────────────────────────────────────────────────

interface Props {
  value: TaskType | undefined;
  onChange: (value: TaskType) => void;
}

export default function TaskStep({ value, onChange }: Props) {
  return (
    <div className="task-step">
      <div className="task-step__grid">
        {TASK_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={[
              "task-step__card",
              value === option.value ? "task-step__card--selected" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            onClick={() => onChange(option.value)}
            aria-pressed={value === option.value}
          >
            {value === option.value && (
              <span className="task-step__card-check" aria-hidden="true">
                <CheckIcon />
              </span>
            )}
            <span className="task-step__card-icon" aria-hidden="true">
              {option.icon}
            </span>
            <span className="task-step__card-label">{option.label}</span>
            <span className="task-step__card-desc">{option.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── SVG Icons ─────────────────────────────────────────────────────────────
// Inline SVGs — no external icon library dependency.
// Swap for your existing icon component if you have one.

function PolicyIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12h6M9 16h6M9 8h2" />
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  );
}

function DataIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function ContentIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function TranslateIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 8l6 6" />
      <path d="M4 14l6-6 2-3" />
      <path d="M2 5h12" />
      <path d="M7 2h1" />
      <path d="M22 22l-5-10-5 10" />
      <path d="M14 18h6" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

function OtherIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2 7 5.5 10.5 12 3.5" />
    </svg>
  );
}
