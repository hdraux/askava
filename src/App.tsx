import { useState } from "react";
import Form from "./components/Form";
import Result from "./components/Result";
import DebugPanel from "./components/DebugPanel";
import InputSummary from "./components/InputSummary";
import scoringConfig from "./config/scoring.config.json";
import escalationConfig from "./config/escalation.config.json";
import recommendationMap from "./config/recommendation-map.json";
import { evaluate } from "./lib/evaluate";
import type { Inputs, Result as EvaluationResult } from "./lib/types";

export default function App() {
  const [debug, setDebug] = useState(false);
  const [inputs, setInputs] = useState<Partial<Inputs>>({});
  const [result, setResult] = useState<EvaluationResult | null>(null);

  return (
    <main className="app-shell">
      <header className="hero">
        <h1>LLM Output Verification Advisor</h1>
        <p>
          Get a proportionate verification recommendation based on the task, use,
          impact, and evidence available.
        </p>
      </header>

      <Form
        onInputsChange={setInputs}
        onSubmit={(completeInputs) => {
          setInputs(completeInputs);
          setResult(
            evaluate(
              completeInputs,
              scoringConfig,
              escalationConfig,
              recommendationMap,
              debug
            )
          );
        }}
      />

      <label className="debug-toggle">
        <input
          type="checkbox"
          checked={debug}
          onChange={(e) => setDebug(e.target.checked)}
        />
        Enable debug mode
      </label>

      <InputSummary inputs={inputs} />

      {result ? (
        <>
          <Result data={result.recommendation} />
          <DebugPanel data={result.debug} />
        </>
      ) : null}
    </main>
  );
}
