function PrincipleIcon({ variant }: { variant: "scale" | "task" | "action" }) {
  if (variant === "scale") {
    return (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
        <path d="M8 2L3 4v4c0 3 2.5 5.5 5 6.5C11 13.5 13 11 13 8V4L8 2z" />
      </svg>
    );
  }
  if (variant === "task") {
    return (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
        <circle cx="8" cy="8" r="6" />
        <path d="M8 2c-2 2-2 8 0 12M8 2c2 2 2 8 0 12M2 8h12" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
      <rect x="2" y="3" width="12" height="10" rx="1.5" />
      <line x1="5" y1="7" x2="11" y2="7" />
      <line x1="5" y1="9.5" x2="8.5" y2="9.5" />
    </svg>
  );
}

const SCORE_TASK_ROWS: [string, string][] = [
  ["Content generation", "+0"],
  ["Summarisation", "+0"],
  ["Information lookup", "+0"],
  ["Translation", "+0"],
  ["Classification / labelling", "+1"],
  ["Coding assistance", "+1"],
  ["Data analysis", "+1"],
  ["Policy interpretation", "+2"],
];

const SCORE_USE_ROWS: [string, string][] = [
  ["Personal only", "+0"],
  ["Internal draft", "+1"],
  ["Decision support", "+2"],
  ["External / operational", "+3"],
  ["Regulatory / high-stakes", "+4"],
];

const SCORE_IMPACT_ROWS: [string, string][] = [
  ["Low", "+0"],
  ["Medium", "+1"],
  ["High", "+2"],
];

const SCORE_EVIDENCE_ROWS: [string, string][] = [
  ["Clear source", "+0"],
  ["Partial source", "+1"],
  ["No source", "+2"],
];

const TASK_METHOD_ROWS: [string, string, string, string][] = [
  ["Content generation", "Self-critique", "Assumption audit", "Source verification or known-answer test"],
  ["Summarisation", "Self-critique", "Prompt variation", "Source verification"],
  ["Information lookup", "Confidence elicitation", "Prompt variation", "Known-answer test or source verification"],
  ["Data analysis", "Confidence elicitation", "Assumption audit", "Computational check"],
  ["Policy interpretation", "Confidence elicitation", "Assumption audit", "Rule-based check"],
  ["Translation", "Self-critique", "Prompt variation", "Source verification or known-answer test"],
  ["Coding assistance", "Self-critique", "Assumption audit", "Rule-based check"],
  ["Classification / labelling", "Self-critique", "Assumption audit", "Known-answer test or source verification"],
];

const LEVEL_TABLE_ROWS: [string, string, string, string][] = [
  ["0", "Use freely",            "No verification needed. Low-stakes, personal, generative output with no meaningful consequence if wrong.",                    "0"],
  ["1", "Quick check",           "One prompt from Step 1, chosen for your task type. Can help catch obvious errors before they travel further.",               "1–2"],
  ["2", "Grounded verification", "Two prompts: Step 1 and Step 2. Supports inspection of the output itself and the assumptions behind it.",                    "3–5"],
  ["3", "Independent review",    "Three prompts across all steps. A task-specific method is prioritised at Step 3.",                                           "6–7"],
  ["4", "Formal control",        "Full prompt suite plus mandatory human sign-off. Prompts are advisory; human judgement is the control.",                     "8+"],
];

function ScoreTable({ title, rows }: { title: string; rows: [string, string][] }) {
  return (
    <>
      <h3 className="methodology__subheading methodology__subheading--tight">{title}</h3>
      <div className="methodology__table-wrap">
        <table className="methodology__table">
          <thead>
            <tr>
              <th scope="col">{title === "Task type" ? "Task" : title === "Intended use" ? "Use" : title === "Impact if wrong" ? "Impact" : "Evidence"}</th>
              <th scope="col">Points</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, pts]) => (
              <tr key={label}>
                <td>{label}</td>
                <td>{pts}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

type MethodologyProps = {
  onOpenOther?: () => void;
};

export default function Methodology({ onOpenOther }: MethodologyProps) {
  return (
    <article className="methodology">
      <h1 className="methodology__title">How AVA works</h1>

      <h2 className="methodology__heading">Verification should match use and risk, not be uniform</h2>
      <p className="methodology__body">
        Most teams either over-verify low-stakes drafts or under-verify high-stakes outputs. AVA helps you choose the right level of scrutiny quickly, without requiring expertise in AI safety or risk management.
      </p>

      <hr className="methodology__rule" aria-hidden="true" />

      <h2 className="methodology__heading">Why we built this</h2>
      <p className="methodology__body">
        AI tools are now a normal part of how people work. But the question of when to trust an output, and how to check it, is left entirely to the individual. The same colleague who carefully fact-checks a client report will often paste an AI summary directly into a meeting without a second thought, not because they are careless, but because no one has given them a simple framework for when caution is actually warranted.
      </p>

      <hr className="methodology__rule" aria-hidden="true" />

      <h2 className="methodology__heading">Three principles</h2>

      <div className="methodology__principle">
        <div className="methodology__principle-icon" aria-hidden="true">
          <PrincipleIcon variant="scale" />
        </div>
        <div>
          <p className="methodology__principle-title">Proportionality over completeness</p>
          <p className="methodology__principle-desc">
            A personal brainstorm and a regulatory submission are not the same thing. Applying the same verification checklist to both wastes time on low-stakes work and creates a false sense of security on high-stakes work. AVA scales the checks to the actual risk.
          </p>
        </div>
      </div>

      <div className="methodology__principle">
        <div className="methodology__principle-icon" aria-hidden="true">
          <PrincipleIcon variant="task" />
        </div>
        <div>
          <p className="methodology__principle-title">Task shapes method</p>
          <p className="methodology__principle-desc">
            Not all verification prompts are equally useful for all tasks. Rechecking a calculation calls for a different probe than reviewing a policy interpretation or a translated document. AVA selects the most relevant prompts for your task type, not just your risk level.
          </p>
        </div>
      </div>

      <div className="methodology__principle">
        <div className="methodology__principle-icon" aria-hidden="true">
          <PrincipleIcon variant="action" />
        </div>
        <div>
          <p className="methodology__principle-title">Actionable over educational</p>
          <p className="methodology__principle-desc">
            AVA gives you the prompts to run, ready to copy. You do not need to read this page to use AVA.
          </p>
        </div>
      </div>

      <hr className="methodology__rule" aria-hidden="true" />

      <h2 className="methodology__heading">How the score is calculated</h2>
      <p className="methodology__body">
        AVA asks four questions. Each answer contributes points to a risk score, which maps to a verification level.
      </p>

      <ScoreTable title="Task type" rows={SCORE_TASK_ROWS} />
      <ScoreTable title="Intended use" rows={SCORE_USE_ROWS} />
      <ScoreTable title="Impact if wrong" rows={SCORE_IMPACT_ROWS} />
      <ScoreTable title="Evidence availability" rows={SCORE_EVIDENCE_ROWS} />

      <hr className="methodology__rule" aria-hidden="true" />

      <h2 className="methodology__heading">How the method is chosen</h2>
      <p className="methodology__body">
        Your verification level sets the depth. Your task type determines which prompts are most relevant at that depth.
      </p>
      <p className="methodology__body">
        For each level, AVA selects one prompt per step from a fixed task-method table. At Step 1, the prompt is chosen to probe common failure modes for your task. At Step 2, a complementary probe is added. At Step 3, task determines the primary method; evidence availability determines which variant is used when alternatives exist.
      </p>
      <p className="methodology__body">
        Evidence availability affects both the score and which methods are used. The no-source adjustment (+2) raises your score and removes source-based prompts from the selection, replacing them with alternatives that work without one. Where a source would normally be expected, its absence is a stronger signal to avoid source-dependent prompts.
      </p>
      <p className="methodology__body">
        For tasks where prompt-based checks have inherent limits: code that needs running, calculations that need independent tools, policies that need legal review — treat the prompts as a starting point, not a substitute.
      </p>

      <h3 className="methodology__subheading methodology__subheading--tight">Task-method table</h3>
      <div className="methodology__table-wrap">
        <table className="methodology__table methodology__table--wide">
          <thead>
            <tr>
              <th scope="col">Task</th>
              <th scope="col">Step 1</th>
              <th scope="col">Step 2</th>
              <th scope="col">Step 3</th>
            </tr>
          </thead>
          <tbody>
            {TASK_METHOD_ROWS.map(([task, s1, s2, s3]) => (
              <tr key={task}>
                <td>{task}</td>
                <td>{s1}</td>
                <td>{s2}</td>
                <td>{s3}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="methodology__body methodology__body--after-table">
        Steps are shown based on your level. Level 1 shows Step 1 only. Level 2 adds Step 2. Level 3 and above add Step 3.
      </p>

      <hr className="methodology__rule" aria-hidden="true" />

      <h2 className="methodology__heading">Verification levels</h2>
      <p className="methodology__body">
        Thresholds are calibrated to keep most internal work at levels 1 and 2, with level 3 reserved for externally consequential outputs and level 4 for regulated or formally accountable ones.
      </p>
      <div className="methodology__table-wrap">
        <table className="methodology__table methodology__table--levels">
          <thead>
            <tr>
              <th scope="col">Level</th>
              <th scope="col">Name</th>
              <th scope="col">Description</th>
              <th scope="col">Score</th>
            </tr>
          </thead>
          <tbody>
            {LEVEL_TABLE_ROWS.map(([level, name, desc, score]) => (
              <tr key={level}>
                <td>{level}</td>
                <td>{name}</td>
                <td>{desc}</td>
                <td>{score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="methodology__rule" aria-hidden="true" />

      <h2 className="methodology__heading">Technical notes</h2>
      <p className="methodology__disclaimer methodology__disclaimer--flush">
        AVA is a deterministic decision aid. It runs entirely in your browser with no backend, no model calls, and no data storage. The recommendations come from a fixed scoring table and a task-method matrix. All selection rules are deterministic and fixed. AVA tells you how to verify; it does not verify for you. Human judgement remains essential at every level.
      </p>

      <p className="methodology__body">
        Expertise improves how checks are applied, but does not replace the need for them.
      </p>

      <p className="methodology__body methodology__drawer-cross">
        See the full list of verification prompts in{" "}
        <button type="button" className="drawer-cross-link" onClick={() => onOpenOther?.()}>
          Verification methods →
        </button>
      </p>
    </article>
  );
}
