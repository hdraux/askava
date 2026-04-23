import { useMemo, useState } from "react";
import type { Inputs } from "../lib/types";
import TaskStep from "./steps/TaskStep";
import UseStep from "./steps/UseStep";
import ImpactStep from "./steps/ImpactStep";
import EvidenceStep from "./steps/EvidenceStep";
import Stepper from "./Stepper";
import WizardFooter from "./WizardFooter";
import { STEP_METADATA } from "./wizardMetadata";

interface Props {
  inputs: Partial<Inputs>;
  onInputsChange: (inputs: Partial<Inputs>) => void;
  onSubmit: (inputs: Inputs) => void;
}

const TOTAL_STEPS = 4;

export default function VerificationWizard({ inputs, onInputsChange, onSubmit }: Props) {
  const [currentStep, setCurrentStep] = useState(1);

  const canProceed = useMemo(() => {
    if (currentStep === 1) return Boolean(inputs.task);
    if (currentStep === 2) return Boolean(inputs.use);
    if (currentStep === 3) return Boolean(inputs.impact);
    return Boolean(inputs.evidence);
  }, [currentStep, inputs.evidence, inputs.impact, inputs.task, inputs.use]);
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === TOTAL_STEPS;
  const stepMeta = STEP_METADATA[currentStep as 1 | 2 | 3 | 4];

  const renderStep = () => {
    if (currentStep === 1) {
      return <TaskStep value={inputs.task} onChange={(value) => onInputsChange({ ...inputs, task: value })} />;
    }

    if (currentStep === 2) {
      return <UseStep value={inputs.use} onChange={(value) => onInputsChange({ ...inputs, use: value })} />;
    }

    if (currentStep === 3) {
      return <ImpactStep value={inputs.impact} onChange={(value) => onInputsChange({ ...inputs, impact: value })} />;
    }

    return <EvidenceStep value={inputs.evidence} onChange={(value) => onInputsChange({ ...inputs, evidence: value })} />;
  };

  return (
    <section className="card wizard" aria-labelledby="wizard-heading">
      <Stepper totalSteps={TOTAL_STEPS} currentStep={currentStep} />
      <h2 id="wizard-heading" className="wizard__title">
        {stepMeta.title}
      </h2>
      <p className="wizard__helper">{stepMeta.helper}</p>
      {renderStep()}

      <WizardFooter
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        canProceed={canProceed}
        onBack={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
        onNext={() => setCurrentStep((prev) => Math.min(TOTAL_STEPS, prev + 1))}
        onEvaluate={() => {
          if (inputs.task && inputs.use && inputs.impact && inputs.evidence) {
            onSubmit({
              task: inputs.task,
              use: inputs.use,
              impact: inputs.impact,
              evidence: inputs.evidence
            });
          }
        }}
      />
    </section>
  );
}
