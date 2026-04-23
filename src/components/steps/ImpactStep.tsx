import type { Impact } from "../../lib/types";
import ChoiceCard from "../ChoiceCard";
import { IMPACT_OPTIONS } from "../wizardMetadata";

interface Props {
  value?: Impact;
  onChange: (value: Impact) => void;
}

export default function ImpactStep({ value, onChange }: Props) {
  return (
    <div className="choice-grid choice-grid--3">
      {IMPACT_OPTIONS.map((option) => (
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
