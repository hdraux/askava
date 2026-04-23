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
  onEvaluate
}: Props) {
  return (
    <div className="wizard-footer">
      <button type="button" className="button-secondary" onClick={onBack} disabled={isFirstStep}>
        Previous step
      </button>
      {isLastStep ? (
        <button type="button" onClick={onEvaluate} disabled={!canProceed}>
          Get recommendation
        </button>
      ) : (
        <button type="button" onClick={onNext} disabled={!canProceed}>
          Next step
        </button>
      )}
    </div>
  );
}
