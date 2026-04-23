import type { IntendedUse } from "../../lib/types";
import ChoiceCard from "../ChoiceCard";
import { USE_OPTIONS } from "../wizardMetadata";

interface Props {
  value?: IntendedUse;
  onChange: (value: IntendedUse) => void;
}

export default function UseStep({ value, onChange }: Props) {
  return (
    <div className="choice-grid choice-grid--5">
      {USE_OPTIONS.map((option) => (
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
