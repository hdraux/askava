export default function Methodology() {
  return (
    <article className="methodology">

      {/* TL;DR */}
      <div className="methodology__tldr" aria-label="Summary">
        <p className="methodology__tldr-label">In short</p>
        <ul className="methodology__tldr-list">
          <li><strong>High-risk output</strong> — deeper checks, switch model first, formal sign-off if needed</li>
          <li><strong>Low-risk output</strong> — quick self-critique or nothing at all</li>
          <li><strong>Best first step, always</strong> — ask a different AI before running any prompts</li>
        </ul>
      </div>

      <h2 className="methodology__heading">
        Verification proportional to use and risk — not uniform
      </h2>
      <p className="methodology__body">
        Most teams either over-verify low-stakes drafts or under-verify high-stakes outputs. AVA makes the right level of scrutiny obvious — quickly, without requiring expertise in AI safety or risk management.
      </p>

      <h3 className="methodology__subheading">Why we built this</h3>
      <p className="methodology__body">
        AI tools are now a normal part of how people work. But the question of when to trust an output — and how to check it — is left entirely to the individual. The same colleague who carefully fact-checks a client report will often paste an AI summary directly into a meeting without a second thought, not because they're careless, but because no one has given them a simple framework for when caution is actually warranted.
      </p>

      <h3 className="methodology__subheading">Three principles</h3>

      <div className="methodology__principle">
        <div className="methodology__principle-icon" aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
            <path d="M8 2L3 4v4c0 3 2.5 5.5 5 6.5C11 13.5 13 11 13 8V4L8 2z" />
          </svg>
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
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
            <circle cx="8" cy="8" r="6" />
            <path d="M8 2c-2 2-2 8 0 12M8 2c2 2 2 8 0 12M2 8h12" />
          </svg>
        </div>
        <div>
          <p className="methodology__principle-title">Switch model first</p>
          <p className="methodology__principle-desc">
            The most reliable way to catch an AI error is to ask a different AI. Different models have different training, different biases, and different blind spots. Disagreement between them is a meaningful signal. This is always the first recommended action for levels 3 and 4.
          </p>
        </div>
      </div>

      <div className="methodology__principle">
        <div className="methodology__principle-icon" aria-hidden="true">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
            <rect x="2" y="3" width="12" height="10" rx="1.5" />
            <line x1="5" y1="7" x2="11" y2="7" />
            <line x1="5" y1="9.5" x2="8.5" y2="9.5" />
          </svg>
        </div>
        <div>
          <p className="methodology__principle-title">Actionable over educational</p>
          <p className="methodology__principle-desc">
            AVA gives you the exact prompts to run, in the right order, ready to copy. You don't need to read this page to use AVA effectively.
          </p>
        </div>
      </div>

      <h3 className="methodology__subheading">How the score is calculated</h3>
      <p className="methodology__body">
        AVA asks four questions. Each answer contributes points to a risk score, which maps to a verification level.
      </p>

      <div className="methodology__factor-list">
        {[
          {
            name: "Task type",
            q: "What did the AI do?",
            options: [
              { label: "Drafting / writing", pts: "+0" },
              { label: "Summarisation", pts: "+0" },
              { label: "Most tasks", pts: "+1" },
              { label: "Calculation / analysis", pts: "+2" },
              { label: "Policy interpretation", pts: "+2" },
            ],
          },
          {
            name: "Intended use",
            q: "Who will rely on this?",
            options: [
              { label: "Personal only", pts: "+0" },
              { label: "Internal draft", pts: "+1" },
              { label: "Decision support", pts: "+2" },
              { label: "External / operational", pts: "+3" },
              { label: "Regulatory / high-stakes", pts: "+4" },
            ],
          },
          {
            name: "Impact if wrong",
            q: "What's the downside?",
            options: [
              { label: "Low", pts: "+0" },
              { label: "Medium", pts: "+0" },
              { label: "High", pts: "+1" },
            ],
          },
          {
            name: "Evidence availability",
            q: "Can you check it against a source?",
            options: [
              { label: "Clear source", pts: "+0" },
              { label: "Partial source", pts: "+1" },
              { label: "No source", pts: "+2" },
            ],
          },
        ].map((factor) => (
          <div key={factor.name} className="methodology__factor">
            <div className="methodology__factor-header">
              <span className="methodology__factor-name">{factor.name}</span>
              <span className="methodology__factor-q">{factor.q}</span>
            </div>
            <div className="methodology__factor-options">
              {factor.options.map((opt) => (
                <span key={opt.label} className="methodology__factor-opt">
                  {opt.label} <span className="methodology__factor-pts">{opt.pts}</span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h3 className="methodology__subheading">Verification levels</h3>
      <div className="methodology__levels">
        {[
          { level: 0, name: "Use freely", range: "Score 0", desc: "No verification needed. Low-stakes, personal, generative output with no meaningful consequence if wrong.", color: "gray" },
          { level: 1, name: "Quick check", range: "Score 1–2", desc: "One prompt — confidence elicitation or self-critique. Takes two minutes. Catches obvious errors before they travel further.", color: "green" },
          { level: 2, name: "Grounded verification", range: "Score 3–4", desc: "Two prompts — self-critique plus assumption audit. Checks both the reasoning and the hidden assumptions.", color: "teal" },
          { level: 3, name: "Independent review", range: "Score 5–6", desc: "Switch model first, then run multiple prompts including chain of thought and source verification.", color: "amber" },
          { level: 4, name: "Formal control", range: "Score 7+", desc: "Full verification suite plus human sign-off. A named person must approve before the output is shared or acted on.", color: "red" },
        ].map((l) => (
          <div key={l.level} className={`methodology__level methodology__level--${l.color}`}>
            <div className="methodology__level-badge" aria-label={`Level ${l.level}`}>{l.level}</div>
            <div className="methodology__level-body">
              <p className="methodology__level-name">{l.name}</p>
              <p className="methodology__level-desc">{l.desc}</p>
            </div>
            <span className="methodology__level-range">{l.range}</span>
          </div>
        ))}
      </div>

      <p className="methodology__disclaimer">
        AVA is a deterministic decision aid — it runs entirely in your browser with no backend, no model calls, and no data storage. The recommendations are based on a fixed scoring table, not an AI judgement. AVA tells you how to verify; it does not verify for you. Human judgement remains essential at every level.
      </p>

    </article>
  );
}
