import type { Evidence } from "../../lib/types";
import ChoiceCard from "../ChoiceCard";
import { EVIDENCE_OPTIONS } from "../wizardMetadata";

interface Props {
  value?: Evidence;
  onChange: (value: Evidence) => void;
}

export default function EvidenceStep({ value, onChange }: Props) {
  return (
    <div className="choice-grid choice-grid--3">
      {EVIDENCE_OPTIONS.map((option) => (
        <ChoiceCard
          key={option.value}
          label={option.label}
          description={option.description}
          icon={option.icon}
          selected={value === option.value}
          onSelect={() => onChange(option.value)}
        />
      ))}
    </div>
  );
}
