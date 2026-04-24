// src/components/steps/VerificationObjectStep.tsx

import ChoiceCard from "../ChoiceCard";
import type { VerificationObject } from "../../lib/researchTypes";

interface Props {
  value: VerificationObject | undefined;
  onChange: (value: VerificationObject) => void;
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function IconDirect() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3,10 7,14 17,5" />
    </svg>
  );
}

function IconPartial() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="7" />
      <path d="M10 3a7 7 0 010 14" fill="currentColor" fillOpacity="0.15" stroke="none" />
      <line x1="10" y1="3" x2="10" y2="17" />
    </svg>
  );
}

function IconWeak() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="7" strokeDasharray="3 2" />
      <line x1="10" y1="7" x2="10" y2="10" />
      <circle cx="10" cy="13" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconNone() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" y1="4" x2="16" y2="16" />
      <line x1="16" y1="4" x2="4" y2="16" />
    </svg>
  );
}

// ── Options ───────────────────────────────────────────────────────────────────

const OPTIONS: { value: VerificationObject; label: string; description: string; icon: React.ReactNode }[] = [
  { value: "V1", label: "Direct — I have something to check against", description: "Papers, raw data, code, a protocol, or an applicable standard", icon: <IconDirect /> },
  { value: "V2", label: "Partial — some material available",          description: "I can check some claims but not all",                          icon: <IconPartial /> },
  { value: "V3", label: "Weak or indirect",                           description: "Limited checkable material — mostly reasoning from memory",    icon: <IconWeak /> },
  { value: "V4", label: "None",                                       description: "Nothing I can check this against right now",                   icon: <IconNone /> },
];

// ── Component ─────────────────────────────────────────────────────────────────

export default function VerificationObjectStep({ value, onChange }: Props) {
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
