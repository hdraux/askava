import type { ReactNode } from "react";

interface Props {
  label: string;
  description: string;
  icon?: ReactNode;
  selected: boolean;
  onSelect: () => void;
}

export default function ChoiceCard({ label, description, icon, selected, onSelect }: Props) {
  return (
    <button
      type="button"
      className={`choice-card${selected ? " is-selected" : ""}`}
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`${label}${selected ? ", selected" : ""}`}
    >
      {selected && (
        <span className="choice-card__check" aria-hidden="true">
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <polyline points="1.5,5.5 4.5,8.5 9.5,2.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      )}
      <span className="choice-card__icon" aria-hidden="true">
        {icon ?? "•"}
      </span>
      <span className="choice-card__label">{label}</span>
      <span className="choice-card__description">{description}</span>
    </button>
  );
}
