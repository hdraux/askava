interface Props {
  totalSteps: number;
  currentStep: number;
}

export default function Stepper({ totalSteps, currentStep }: Props) {
  return (
    <ol className="stepper" aria-label="Progress">
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isCurrent = stepNumber === currentStep;
        const isComplete = stepNumber < currentStep;
        return (
          <li key={stepNumber} className="stepper__item">
            <span
              className={[
                "stepper__dot",
                isCurrent ? "is-current" : "",
                isComplete ? "is-complete" : ""
              ]
                .filter(Boolean)
                .join(" ")}
              aria-current={isCurrent ? "step" : undefined}
            >
              {stepNumber}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
