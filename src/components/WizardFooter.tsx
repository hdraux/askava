interface Props {
  isFirstStep: boolean;
  isLastStep: boolean;
  canProceed: boolean;
  onBack: () => void;
  onNext: () => void;
  onEvaluate: () => void;
}

export default function WizardFooter({
  isFirstStep,
  isLastStep,
  canProceed,
  onBack,
  onNext,
  onEvaluate,
}: Props) {
  return (
    <div className="wizard-footer">
      <button
        type="button"
        className="btn-secondary"
        onClick={onBack}
        disabled={isFirstStep}
      >
        Back
      </button>

      {isLastStep ? (
        <button
          type="button"
          className="btn-primary"
          onClick={onEvaluate}
          disabled={!canProceed}
        >
          Get recommendation
        </button>
      ) : (
        <button
          type="button"
          className="btn-primary"
          onClick={onNext}
          disabled={!canProceed}
        >
          Continue
        </button>
      )}
    </div>
  );
}
