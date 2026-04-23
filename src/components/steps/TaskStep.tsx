// src/components/steps/TaskStep.tsx
// Step 1 — "What kind of task did the AI do?"
// Uses existing ChoiceCard + .choice-grid from styles.css — no custom CSS needed.

import ChoiceCard from "../ChoiceCard";
import { TaskType } from "../../lib/types";

interface Props {
  value: TaskType | undefined;
  onChange: (value: TaskType) => void;
}

interface TaskOption {
  value: TaskType;
  label: string;
  description: string;
  icon: string;
}

const TASK_OPTIONS: TaskOption[] = [
  {
    value: "T10",
    label: "Policy interpretation",
    description: "Laws, regulations, policies, or guidance",
    icon: "📄",
  },
  {
    value: "T9",
    label: "Data analysis",
    description: "Trends, calculations, or statistical insights",
    icon: "📈",
  },
  {
    value: "T3",
    label: "Content generation",
    description: "Drafts, reports, summaries, or recommendations",
    icon: "✏️",
  },
  {
    value: "T7",
    label: "Information lookup",
    description: "Facts, definitions, or quick answers",
    icon: "🔍",
  },
  {
    value: "T2",
    label: "Summarisation",
    description: "Meeting notes, document summaries, data pulled from text",
    icon: "📋",
  },
  {
    value: "T5",
    label: "Translation",
    description: "Text translated between languages",
    icon: "🌐",
  },
  {
    value: "T4",
    label: "Coding assistance",
    description: "Code generation, debugging, or technical explanations",
    icon: "⌨️",
  },
  {
    value: "T8",
    label: "Other",
    description: "Something not listed above",
    icon: "•••",
  },
];

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
