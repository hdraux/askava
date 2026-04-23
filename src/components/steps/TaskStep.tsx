import ChoiceCard from "../ChoiceCard";
import type { TaskType } from "../../lib/types";

interface Props {
  value: TaskType | undefined;
  onChange: (value: TaskType) => void;
}

// ── Icons ────────────────────────────────────────────────────────────────────
// Clean 24px line-art SVGs matching the mockup style.

function IconPolicy() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="2" width="14" height="16" rx="2"/>
      <line x1="7" y1="7" x2="13" y2="7"/>
      <line x1="7" y1="10" x2="13" y2="10"/>
      <line x1="7" y1="13" x2="10" y2="13"/>
    </svg>
  );
}

function IconData() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2,14 6,9 9,12 13,6 18,10"/>
    </svg>
  );
}

function IconContent() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2.5a2 2 0 012.8 2.8L6 16l-3.5.7.7-3.5L14 2.5z"/>
    </svg>
  );
}

function IconSearch() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="6"/>
      <line x1="13.5" y1="13.5" x2="18" y2="18"/>
    </svg>
  );
}

function IconList() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="5" x2="17" y2="5"/>
      <line x1="7" y1="10" x2="17" y2="10"/>
      <line x1="7" y1="15" x2="17" y2="15"/>
      <circle cx="3.5" cy="5" r="1" fill="none" stroke="currentColor" />
      <circle cx="3.5" cy="10" r="1" fill="none" stroke="currentColor" />
      <circle cx="3.5" cy="15" r="1" fill="none" stroke="currentColor" />
    </svg>
  );
}

function IconTranslate() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 5h9M7 2v3M5 9c.5 1.5 2 3 4 4M9 9c-.5 1.5-2 3-4 4"/>
      <path d="M12 14l2-5 2 5M13 12.5h2"/>
    </svg>
  );
}

function IconCode() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6,7 2,10 6,13"/>
      <polyline points="14,7 18,10 14,13"/>
      <line x1="11" y1="5" x2="9" y2="15"/>
    </svg>
  );
}

function IconClassify() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 3.5h4.2L18 10l-6.5 6.5L2.5 10V3.5z" />
      <circle cx="5" cy="5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

// ── Options ───────────────────────────────────────────────────────────────────

const OPTIONS: { value: TaskType; label: string; description: string; icon: React.ReactNode }[] = [
  { value: "T3",  label: "Content generation",      description: "Drafts, reports, summaries, or recommendations",         icon: <IconContent /> },
  { value: "T9",  label: "Data analysis",           description: "Trends, calculations, or statistical insights",          icon: <IconData /> },
  { value: "T2",  label: "Summarisation",           description: "Meeting notes, document summaries, data pulled from text", icon: <IconList /> },
  { value: "T7",  label: "Information lookup",     description: "Facts, definitions, or quick answers",                 icon: <IconSearch /> },
  { value: "T4",  label: "Coding assistance",       description: "Code generation, debugging, or technical explanations",  icon: <IconCode /> },
  { value: "T1",  label: "Classification / labelling", description: "Tags, categories, or labels applied to content",  icon: <IconClassify /> },
  { value: "T5",  label: "Translation",             description: "Text translated between languages",                    icon: <IconTranslate /> },
  { value: "T10", label: "Policy interpretation",  description: "Laws, regulations, policies, or guidance",            icon: <IconPolicy /> },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function TaskStep({ value, onChange }: Props) {
  return (
    <div className="choice-grid choice-grid--4">
      {OPTIONS.map((opt) => (
        <ChoiceCard
          key={opt.value}
          label={opt.label}
          description={opt.description}
          icon={opt.icon}
          selected={value === opt.value}
          onSelect={() => onChange(opt.value)}
        />
      ))}
    </div>
  );
}
