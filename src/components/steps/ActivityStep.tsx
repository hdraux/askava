// src/components/steps/ActivityStep.tsx

import ChoiceCard from "../ChoiceCard";
import type { ActivityType } from "../../lib/researchTypes";

interface Props {
  value: ActivityType | undefined;
  onChange: (value: ActivityType) => void;
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconSearch() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="9" r="6" />
      <line x1="13.5" y1="13.5" x2="18" y2="18" />
    </svg>
  );
}

function IconSynthesis() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="14" height="14" rx="2" />
      <line x1="7" y1="7" x2="13" y2="7" />
      <line x1="7" y1="10" x2="13" y2="10" />
      <line x1="7" y1="13" x2="10" y2="13" />
    </svg>
  );
}

function IconIdea() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 3a5 5 0 011.5 9.75V14a1.5 1.5 0 01-3 0v-1.25A5 5 0 0110 3z" />
      <line x1="8" y1="17" x2="12" y2="17" />
    </svg>
  );
}

function IconDesign() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="16" height="11" rx="1.5" />
      <line x1="2" y1="8" x2="18" y2="8" />
      <line x1="7" y1="5" x2="7" y2="4" />
      <line x1="13" y1="5" x2="13" y2="4" />
    </svg>
  );
}

function IconData() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2,14 6,9 9,12 13,6 18,10" />
    </svg>
  );
}

function IconWrite() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2.5a2 2 0 012.8 2.8L6 16l-3.5.7.7-3.5L14 2.5z" />
    </svg>
  );
}

function IconInterpret() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="7" />
      <line x1="10" y1="7" x2="10" y2="10" />
      <circle cx="10" cy="13" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconCompliance() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4,10 8,14 16,6" />
      <rect x="2" y="2" width="16" height="16" rx="2" />
    </svg>
  );
}

// ── Options ───────────────────────────────────────────────────────────────────

const OPTIONS: { value: ActivityType; label: string; description: string; icon: React.ReactNode }[] = [
  { value: "A1", label: "Searching and discovering literature",        description: "Finding papers, sources, or prior work on a topic",                    icon: <IconSearch /> },
  { value: "A2", label: "Synthesising and summarising evidence",       description: "Pulling together findings across sources into a coherent picture",     icon: <IconSynthesis /> },
  { value: "A3", label: "Generating ideas and hypotheses",             description: "Using AI to propose directions, questions, or novel framings",         icon: <IconIdea /> },
  { value: "A4", label: "Designing studies or experiments",            description: "Structuring a methodology, protocol, or experimental plan",           icon: <IconDesign /> },
  { value: "A5", label: "Processing, analysing, or coding data",       description: "Running analysis, writing analysis code, or processing a dataset",    icon: <IconData /> },
  { value: "A6", label: "Writing or editing research text",            description: "Drafting or refining abstracts, sections, proposals, or papers",      icon: <IconWrite /> },
  { value: "A7", label: "Interpreting results or drawing conclusions", description: "Using AI to make sense of findings or frame what they mean",          icon: <IconInterpret /> },
  { value: "A8", label: "Checking compliance or reporting standards",  description: "Reviewing output against PRISMA, CONSORT, or other field standards", icon: <IconCompliance /> },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function ActivityStep({ value, onChange }: Props) {
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
