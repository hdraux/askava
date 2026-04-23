import ChoiceCard from "../ChoiceCard";
import type { Impact } from "../../lib/types";

interface Props {
  value: Impact | undefined;
  onChange: (value: Impact) => void;
}

function IconLow() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="10" y1="4" x2="10" y2="14"/>
      <polyline points="6,10 10,14 14,10"/>
    </svg>
  );
}

function IconMedium() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="13" width="3" height="4" rx="0.5"/>
      <rect x="8.5" y="9" width="3" height="8" rx="0.5"/>
      <rect x="15" y="5" width="3" height="12" rx="0.5"/>
    </svg>
  );
}

function IconHigh() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 3l7 13H3L10 3z"/>
      <line x1="10" y1="9" x2="10" y2="12"/>
      <circle cx="10" cy="14.5" r="0.8" fill="currentColor" stroke="none"/>
    </svg>
  );
}

const OPTIONS: { value: Impact; label: string; description: string; icon: React.ReactNode }[] = [
  { value: "I1", label: "Low impact",    description: "Minor inconvenience; easily spotted and corrected",              icon: <IconLow /> },
  { value: "I2", label: "Medium impact", description: "Causes confusion, rework, or reputational friction",            icon: <IconMedium /> },
  { value: "I3", label: "High impact",   description: "Material harm: financial, legal, operational, or personal",     icon: <IconHigh /> },
];

export default function ImpactStep({ value, onChange }: Props) {
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
