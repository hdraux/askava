import ChoiceCard from "../ChoiceCard";
import type { IntendedUse } from "../../lib/types";

interface Props {
  value: IntendedUse | undefined;
  onChange: (value: IntendedUse) => void;
}

function IconPerson() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="6.5" r="3"/>
      <path d="M3 18c0-3.9 3.1-7 7-7s7 3.1 7 7"/>
    </svg>
  );
}

function IconPeople() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="7.5" cy="6" r="2.5"/>
      <path d="M1 18c0-3.3 2.9-6 6.5-6"/>
      <circle cx="13" cy="6" r="2.5"/>
      <path d="M19 18c0-3.3-2.9-6-6.5-6s-6.5 2.7-6.5 6"/>
    </svg>
  );
}

function IconScale() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="10" y1="3" x2="10" y2="17"/>
      <line x1="4" y1="17" x2="16" y2="17"/>
      <line x1="4" y1="7" x2="16" y2="7"/>
      <path d="M4 7l-2 4h4l-2-4z"/>
      <path d="M16 7l-2 4h4l-2-4z"/>
    </svg>
  );
}

function IconExternal() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 3h6v6"/>
      <path d="M17 3l-8 8"/>
      <path d="M9 5H4a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1v-5"/>
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2l6 2.5v5c0 4-2.5 7-6 8.5C4.5 16.5 2 13.5 2 9.5v-5L10 2z"/>
    </svg>
  );
}

const OPTIONS: { value: IntendedUse; label: string; description: string; icon: React.ReactNode }[] = [
  { value: "U1", label: "Personal use only",          description: "For your own reference; no one else sees it",              icon: <IconPerson /> },
  { value: "U2", label: "Internal draft",             description: "Shared with colleagues; informs a process or discussion",  icon: <IconPeople /> },
  { value: "U3", label: "Decision support",           description: "Feeds into a decision with real consequences",             icon: <IconScale /> },
  { value: "U4", label: "External or operational",    description: "Sent to clients, published, or triggers an action",       icon: <IconExternal /> },
  { value: "U5", label: "Regulatory or high-stakes",  description: "Subject to compliance, audit, or legal accountability",   icon: <IconShield /> },
];

export default function UseStep({ value, onChange }: Props) {
  return (
    <div className="choice-grid choice-grid--5">
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
