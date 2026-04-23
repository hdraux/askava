import { useState } from "react";
import AppShell from "./components/AppShell";
import Header from "./components/Header";
import VerificationWizard from "./components/VerificationWizard";
import ResultScreen from "./components/ResultScreen";
import { evaluate } from "./lib/evaluate";
import {
  escalationConfigTyped,
  recommendationMapTyped,
  scoringConfigTyped
} from "./lib/parseConfig";
import type { Inputs, Result as EvaluationResult } from "./lib/types";

export default function App() {
  const [debug, setDebug] = useState(false);
  const [inputs, setInputs] = useState<Partial<Inputs>>({});
  const [result, setResult] = useState<EvaluationResult | null>(null);

  return (
    <AppShell>
      <Header />

      {result ? (
        <ResultScreen
          inputs={inputs as Inputs}
          result={result}
          onEdit={() => setResult(null)}
        />
      ) : (
        <VerificationWizard
          inputs={inputs}
          onInputsChange={(nextInputs) => {
            setInputs(nextInputs);
            if (result) {
              setResult(null);
            }
          }}
          onSubmit={(completeInputs) => {
            setInputs(completeInputs);
            setResult(
              evaluate(
                completeInputs,
                scoringConfigTyped,
                escalationConfigTyped,
                recommendationMapTyped,
                debug
              )
            );
          }}
        />
      )}

      <label className="debug-toggle">
        <input
          type="checkbox"
          checked={debug}
          onChange={(e) => setDebug(e.target.checked)}
        />
        Enable debug mode
      </label>

    </AppShell>
  );
}
