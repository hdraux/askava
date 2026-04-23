import type { Recommendation } from "../lib/types";

interface Props {
  data: Recommendation;
}

export default function Result({ data }: Props) {
  return (
    <section className="card result">
      <p className="eyebrow">Verification level</p>
      <h2>{data.level}: {data.levelName}</h2>
      <p>{data.explanation}</p>

      {data.checklist.length > 0 ? (
        <ul>
          {data.checklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="result__empty">No specific verification actions were generated for this case.</p>
      )}

      {data.escalationNotice ? <p className="notice">{data.escalationNotice}</p> : null}
    </section>
  );
}
