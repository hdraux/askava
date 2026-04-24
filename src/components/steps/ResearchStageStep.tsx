// src/components/steps/ResearchStageStep.tsx

import ChoiceCard from "../ChoiceCard";
import type { ResearchStage } from "../../lib/researchTypes";

interface Props {
  value: ResearchStage | undefined;
  onChange: (value: ResearchStage) => void;
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconExplore() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="7" />
      <line x1="10" y1="6" x2="10" y2="10" />
      <line x1="10" y1="10" x2="13" y2="13" />
    </svg>
  );
}

function IconInternal() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7" cy="8" r="2.5" />
      <circle cx="13" cy="8" r="2.5" />
      <path d="M2 17c0-3 2.2-5 5-5h6c2.8 0 5 2 5 5" />
    </svg>
  );
}

function IconDecision() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="4,10 10,4 16,10" />
      <line x1="10" y1="4" x2="10" y2="16" />
    </svg>
  );
}

function IconDraft() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2.5a2 2 0 012.8 2.8L6 16l-3.5.7.7-3.5L14 2.5z" />
      <line x1="12" y1="5" x2="15" y2="8" />
    </svg>
  );
}

function IconSubmit() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10l7-7 7 7" />
      <path d="M10 3v14" />
      <line x1="5" y1="17" x2="15" y2="17" />
    </svg>
  );
}

// ── Options ───────────────────────────────────────────────────────────────────

const OPTIONS: { value: ResearchStage; label: string; description: string; icon: React.ReactNode }[] = [
  { value: "S1", label: "Personal exploration",                      description: "Just for my own thinking — not going anywhere yet",          icon: <IconExplore /> },
  { value: "S2", label: "Internal working document",                 description: "Shared with collaborators but not external or formal",       icon: <IconInternal /> },
  { value: "S3", label: "Informing a research decision or direction", description: "Shaping study design, analysis choices, or interpretation", icon: <IconDecision /> },
  { value: "S4", label: "Manuscript draft",                          description: "Going into a paper, report, or formal writeup",             icon: <IconDraft /> },
  { value: "S5", label: "Submission or publication",                 description: "Being submitted to a journal, funder, or public record",    icon: <IconSubmit /> },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function ResearchStageStep({ value, onChange }: Props) {
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
