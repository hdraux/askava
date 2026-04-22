import type { ScoreBreakdown } from "../lib/types";

interface Props {
  data?: ScoreBreakdown;
}

export default function DebugPanel({ data }: Props) {
  if (!data) {
    return null;
  }

  return (
    <details className="card">
      <summary>Debug details</summary>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </details>
  );
}
