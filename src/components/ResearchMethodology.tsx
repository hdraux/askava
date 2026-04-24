function PrincipleIcon({ variant }: { variant: "scale" | "task" | "action" | "human" }) {
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
  if (variant === "human") {
    return (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
        <circle cx="8" cy="5" r="2.5" />
        <path d="M3 14c0-2.8 2.2-5 5-5s5 2.2 5 5" />
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

// ── Score tables ───────────────────────────────────────────────────────────────

const SCORE_ACTIVITY_ROWS: [string, string][] = [
  ["Searching and discovering literature", "+0"],
  ["Generating ideas and hypotheses", "+0"],
  ["Writing or editing research text", "+0"],
  ["Synthesising and summarising evidence", "+1"],
  ["Designing studies or experiments", "+1"],
  ["Checking compliance or reporting standards", "+1"],
  ["Processing, analysing, or coding data", "+2"],
  ["Interpreting results or drawing conclusions", "+2"],
];

const SCORE_STAGE_ROWS: [string, string][] = [
  ["Personal exploration", "+0"],
  ["Internal working document", "+1"],
  ["Informing a research decision or direction", "+2"],
  ["Manuscript draft", "+3"],
  ["Submission or publication", "+4"],
];

const SCORE_IMPACT_ROWS: [string, string][] = [
  ["Low — affects only this exploration", "+0"],
  ["Medium — affects downstream work or decisions", "+1"],
  ["High — affects conclusions, other researchers, or subjects", "+2"],
];

const SCORE_VERIFICATION_ROWS: [string, string][] = [
  ["Direct — I have something to check against (papers, data, code, protocol, or standard)", "+0"],
  ["Partial — some material available", "+1"],
  ["Weak or indirect — limited checkable material", "+2"],
  ["None", "+3"],
];

// ── Activity-method table ──────────────────────────────────────────────────────

const ACTIVITY_METHOD_ROWS: [string, string, string, string][] = [
  ["Searching and discovering literature",        "Scope audit",             "Prompt variation",      "Source verification or known-literature test"],
  ["Synthesising and summarising evidence",       "Scope audit",             "Claim–evidence audit",  "Citation verification or source verification"],
  ["Generating ideas and hypotheses",             "Novelty audit",           "Assumption audit",      "Convergence check or known-literature test"],
  ["Designing studies or experiments",            "Self-critique",           "Reproducibility probe", "Rule-based check"],
  ["Processing, analysing, or coding data",       "Confidence elicitation",  "Assumption audit",      "Computational check or rerunnability check"],
  ["Writing or editing research text",            "Self-critique",           "Claim–evidence audit",  "Source verification"],
  ["Interpreting results or drawing conclusions", "Confidence elicitation",  "Claim–evidence audit",  "Assumption audit"],
  ["Checking compliance or reporting standards",  "Self-critique",           "Rule-based check",      "Source verification"],
];

// ── Verification levels ────────────────────────────────────────────────────────

const LEVEL_TABLE_ROWS: [string, string, string, string][] = [
  ["0", "Use freely",            "No verification needed. Exploratory, personal output with no downstream consequence.",                                                    "0"],
  ["1", "Quick check",           "One prompt from Step 1. Can help catch obvious errors before you reuse this output.",                                "1–2"],
  ["2", "Grounded verification", "Step 1 and Step 2 prompts. Supports inspection of both the output itself and the assumptions behind it.",                   "3–5"],
  ["3", "Independent review",    "All three steps, plus a task-specific method at Step 3. Intended for manuscript-stage work and above.",                                  "6–7"],
  ["4", "Formal control",        "Full prompt suite plus mandatory sign-off from a qualified human expert. Prompts are advisory; expert review is the control.",           "8+"],
];

// ── Failure modes ──────────────────────────────────────────────────────────────

const FAILURE_MODES: [string, string][] = [
  ["Citation hallucination",     "AI generates plausible-looking references to papers that do not exist, or subtly corrupts real ones: wrong author, wrong year, wrong journal. These may pass casual inspection."],
  ["Statistical method error",   "AI selects or applies the wrong statistical test, or misinterprets results. The output looks correct: it has numbers, p-values, confidence intervals. But the method may be inappropriate for the data or the question."],
  ["Convergence bias",           "AI hypothesis generation tends to recombine existing ideas from training data rather than identify genuinely novel directions. Outputs appear creative but tend to under-explore the space."],
  ["Reproducibility gaps",       "AI-generated experimental designs or methods sections often omit details that a human expert would include, making replication difficult or impossible."],
  ["Scope misrepresentation",    "AI literature syntheses may overstate consensus, omit contradictory evidence, or fail to signal where evidence is thin. The summary reads as authoritative when the underlying literature is contested or sparse."],
  ["Claim–evidence mismatch",    "AI writing routinely expresses more certainty than the underlying evidence warrants. Facts may be correct; conclusions may be overstated. This is a common and often subtle failure mode in AI-assisted research writing."],
];

// ── Shared table component ─────────────────────────────────────────────────────

function ScoreTable({ title, colHeader, rows }: { title: string; colHeader: string; rows: [string, string][] }) {
  return (
    <>
      <h3 className="methodology__subheading methodology__subheading--tight">{title}</h3>
      <div className="methodology__table-wrap">
        <table className="methodology__table">
          <thead>
            <tr>
              <th scope="col">{colHeader}</th>
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

// ── Component ──────────────────────────────────────────────────────────────────

type ResearchMethodologyProps = {
  onOpenOther?: () => void;
};

export default function ResearchMethodology({ onOpenOther }: ResearchMethodologyProps) {
  return (
    <article className="methodology">
      <h1 className="methodology__title">How AVA Research works</h1>

      <h2 className="methodology__heading">Verification proportional to research integrity exposure</h2>
      <p className="methodology__body">
        A hypothesis brainstorm and a submitted methods section are not the same thing. AVA Research scales verification checks to where an output actually sits in your research process, and to the specific ways AI outputs fail in research contexts.
      </p>
      <p className="methodology__body">
        One assumption underlies everything: if you are using AVA Research, the output is treated as if it may enter the scientific record. The tool does not ask whether this is certain. It treats the possibility as worth taking seriously.
      </p>

      <hr className="methodology__rule" aria-hidden="true" />

      <h2 className="methodology__heading">Why research is different</h2>
      <p className="methodology__body">
        General AI verification focuses on factual accuracy and logical consistency. Research work has additional, domain-specific failure modes that standard checks miss. These are not edge cases. They are patterns that show up consistently in how AI outputs fail in scientific contexts.
      </p>

      <div className="methodology__table-wrap">
        <table className="methodology__table methodology__table--wide">
          <thead>
            <tr>
              <th scope="col">Failure mode</th>
              <th scope="col">What it looks like</th>
            </tr>
          </thead>
          <tbody>
            {FAILURE_MODES.map(([mode, desc]) => (
              <tr key={mode}>
                <td><strong>{mode}</strong></td>
                <td>{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="methodology__body methodology__body--after-table">
        Additionally, errors in research are not isolated. An output that feeds into a subsequent step carries its errors downstream. AVA Research reflects this: outputs used to inform experimental design, drafts, or submission score higher than outputs used only for personal exploration.
      </p>

      <hr className="methodology__rule" aria-hidden="true" />

      <h2 className="methodology__heading">Four principles</h2>

      <div className="methodology__principle">
        <div className="methodology__principle-icon" aria-hidden="true">
          <PrincipleIcon variant="scale" />
        </div>
        <div>
          <p className="methodology__principle-title">Proportionality over completeness</p>
          <p className="methodology__principle-desc">
            A hypothesis brainstorm and a submitted methods section are not the same thing. Applying the same verification checklist to both wastes time on exploratory work and creates false confidence in publication-ready outputs. AVA Research scales the checks to the actual research integrity exposure.
          </p>
        </div>
      </div>

      <div className="methodology__principle">
        <div className="methodology__principle-icon" aria-hidden="true">
          <PrincipleIcon variant="task" />
        </div>
        <div>
          <p className="methodology__principle-title">Activity shapes method</p>
          <p className="methodology__principle-desc">
            The dominant failure mode differs by what you are doing with AI. Citation hallucination in a literature synthesis calls for a different probe than numerical error in a data analysis, or convergence bias in hypothesis generation. AVA Research selects prompts matched to the activity's specific failure mode, not just the risk level.
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
            AVA Research gives you the prompts to run, ready to copy. You do not need expertise in AI safety or research methodology to use it.
          </p>
        </div>
      </div>

      <div className="methodology__principle">
        <div className="methodology__principle-icon" aria-hidden="true">
          <PrincipleIcon variant="human" />
        </div>
        <div>
          <p className="methodology__principle-title">Prompts are not enough</p>
          <p className="methodology__principle-desc">
            Running the prompts is a starting point. Every result includes a minimum human action (a concrete step you must take before relying on the output). This defines a minimum expectation, not a guarantee. Domain expertise and human judgement remain essential at every level.
          </p>
        </div>
      </div>

      <hr className="methodology__rule" aria-hidden="true" />

      <h2 className="methodology__heading">How the score is calculated</h2>
      <p className="methodology__body">
        AVA Research asks four questions. Each answer contributes points to a risk score, which maps to a verification level.
      </p>

      <ScoreTable title="Research activity" colHeader="Activity" rows={SCORE_ACTIVITY_ROWS} />
      <ScoreTable title="Research process stage" colHeader="Stage" rows={SCORE_STAGE_ROWS} />
      <ScoreTable title="Impact if wrong" colHeader="Impact" rows={SCORE_IMPACT_ROWS} />
      <ScoreTable title="Verification object availability" colHeader="What you can check against" rows={SCORE_VERIFICATION_ROWS} />

      <p className="methodology__body methodology__body--after-table">
        Two process stage overrides apply regardless of score: manuscript draft always reaches at least level 3; submission or publication always reaches level 4 and requires formal human expert sign-off.
      </p>

      <hr className="methodology__rule" aria-hidden="true" />

      <h2 className="methodology__heading">How the method is chosen</h2>
      <p className="methodology__body">
        Your verification level sets the depth. Your activity determines which prompts are most relevant at that depth.
      </p>
      <p className="methodology__body">
        For each level, AVA Research selects one prompt per step from a fixed activity-method table. At Step 1, the prompt targets the primary failure mode for your activity. At Step 2, a complementary probe is added. At Step 3, activity determines the primary method; verification object availability determines which variant is used when alternatives exist.
      </p>
      <p className="methodology__body">
        When no verification object is available (+3), source-dependent prompts are removed and replaced with alternatives that work without external material: assumption audit, uncertainty surfacing, and a prompt that describes what would be needed to verify each claim. This is both a score effect and a method selection effect.
      </p>
      <p className="methodology__body">
        Activities with a high reproducibility signal: data processing, analysis, compliance checking — route toward computational and rerunnability checks. Activities with a low signal: writing, hypothesis generation, interpretation — route toward probes that do not require a rerunable output.
      </p>

      <h3 className="methodology__subheading methodology__subheading--tight">Activity-method table</h3>
      <div className="methodology__table-wrap">
        <table className="methodology__table methodology__table--wide">
          <thead>
            <tr>
              <th scope="col">Activity</th>
              <th scope="col">Step 1</th>
              <th scope="col">Step 2</th>
              <th scope="col">Step 3</th>
            </tr>
          </thead>
          <tbody>
            {ACTIVITY_METHOD_ROWS.map(([activity, s1, s2, s3]) => (
              <tr key={activity}>
                <td>{activity}</td>
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
        Thresholds are calibrated to keep exploratory and internal work at levels 1 and 2, with level 3 required for manuscript-stage outputs and level 4 for submission or formally accountable ones.
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
        AVA Research is a deterministic decision aid. It runs entirely in your browser with no backend, no model calls, and no data storage. The recommendations come from a fixed scoring table and an activity-method matrix. All selection rules are deterministic and fixed. AVA Research tells you how to verify; it does not verify for you. Domain expertise and human judgement remain essential at every level.
      </p>
      <p className="methodology__body">
        AVA Research does not assess whether an AI use is consistent with your journal's or institution's AI policy. It does not reduce the required verification level based on your expertise or seniority. It does not constitute research integrity advice.
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
