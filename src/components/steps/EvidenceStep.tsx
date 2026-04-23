import ChoiceCard from "../ChoiceCard";
import type { Evidence } from "../../lib/types";

interface Props {
  value: Evidence | undefined;
  onChange: (value: Evidence) => void;
}

function IconCheck() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="7.5"/>
      <polyline points="6.5,10.5 9,13 13.5,7.5"/>
    </svg>
  );
}

function IconPartial() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="7.5"/>
      <line x1="6.5" y1="10" x2="13.5" y2="10"/>
    </svg>
  );
}

function IconNone() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="7.5"/>
      <line x1="7" y1="7" x2="13" y2="13"/>
      <line x1="13" y1="7" x2="7" y2="13"/>
    </svg>
  );
}

const OPTIONS: { value: Evidence; label: string; description: string; icon: React.ReactNode }[] = [
  { value: "E1", label: "Yes, clearly", description: "A document, dataset, or ground truth exists and is accessible", icon: <IconCheck /> },
  { value: "E2", label: "Partially",    description: "Some reference material exists but is incomplete",             icon: <IconPartial /> },
  { value: "E3", label: "No source",    description: "The output is generative; nothing to check it against",       icon: <IconNone /> },
];

export default function EvidenceStep({ value, onChange }: Props) {
  return (
    <div className="choice-grid choice-grid--3">
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
