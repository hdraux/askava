import type { TaskType } from "../../lib/types";
import ChoiceCard from "../ChoiceCard";
import { TASK_OPTIONS } from "../wizardMetadata";

interface Props {
  value?: TaskType;
  onChange: (value: TaskType) => void;
}

export default function TaskStep({ value, onChange }: Props) {
  return (
    <div className="choice-grid choice-grid--4">
      {TASK_OPTIONS.map((option) => (
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
