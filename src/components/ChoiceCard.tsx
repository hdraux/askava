interface Props {
  label: string;
  description: string;
  icon?: string;
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
      <span className="choice-card__icon" aria-hidden="true">
        {icon ?? "•"}
      </span>
      <span className="choice-card__label">{label}</span>
      <span className="choice-card__description">{description}</span>
    </button>
  );
}
