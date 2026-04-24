import { useState } from "react";
import { PROMPT_LIBRARY, type MinLevel, type GeneralPromptEntry } from "../lib/promptLibraryData";
import { RESEARCH_PROMPT_LIBRARY } from "../lib/researchPromptLibraryData";
import type { ResearchPromptEntry } from "../lib/researchPromptLibraryData";
import type { WizardMode } from "./RevealWizard";

type Filter = "all" | MinLevel;
type VariantKey = "inConversation" | "freshConversation";

const LEVEL_META: Record<MinLevel, { label: string; bg: string; color: string }> = {
  1: { label: "Level 1+", bg: "var(--level-1-bg, #EAF3DE)", color: "var(--level-1-fg, #3B6D11)" },
  2: { label: "Level 2+", bg: "var(--level-2-bg, #EEF5F1)", color: "var(--level-2-fg, #2D7D54)" },
  3: { label: "Level 3+", bg: "var(--level-3-bg, #FEF5E7)", color: "var(--level-3-fg, #B07D1A)" },
};

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All techniques" },
  { id: 1, label: "Level 1+" },
  { id: 2, label: "Level 2+" },
  { id: 3, label: "Level 3+" },
];

type PromptLibraryProps = {
  mode?: WizardMode;
  onOpenOther?: () => void;
};

export default function PromptLibrary({ mode = "general", onOpenOther }: PromptLibraryProps) {
  const isResearch = mode === "research";
  const library: (GeneralPromptEntry | ResearchPromptEntry)[] =
    isResearch ? RESEARCH_PROMPT_LIBRARY : PROMPT_LIBRARY;

  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<string | null>(library[0]?.id ?? null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [variants, setVariants] = useState<Record<string, VariantKey>>({});

  const visible = activeFilter === "all"
    ? library
    : library.filter((p) => p.minLevel === activeFilter);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  function getVariant(id: string): VariantKey {
    return variants[id] ?? "inConversation";
  }

  function setVariant(id: string, v: VariantKey) {
    setVariants((prev) => ({ ...prev, [id]: v }));
  }

  function copyPrompt(id: string, text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }

  return (
    <div className="prompt-library">
      <p className="prompt-library__connect">
        <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" width="14" height="14" aria-hidden="true">
          <circle cx="7" cy="7" r="6" />
          <line x1="7" y1="5" x2="7" y2="7.5" />
          <circle cx="7" cy="9.5" r="0.5" fill="currentColor" />
        </svg>
        {isResearch
          ? "These are the prompts AVA Research selects based on your activity and verification level. You can also run any of them manually: paste into the same AI tool that produced the output."
          : "These are the prompts AVA selects based on the verification level it assigns. You can also run any of them manually: paste into the same AI tool that produced the output."
        }
      </p>

      <div className="prompt-library__filters" role="group" aria-label="Filter by level">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className={`prompt-library__filter-btn${activeFilter === f.id ? " is-active" : ""}`}
            onClick={() => setActiveFilter(f.id)}
            aria-pressed={activeFilter === f.id}
          >
            {f.label}
          </button>
        ))}
      </div>

      <ul className="prompt-library__list" aria-label="Verification techniques">
        {visible.map((p) => {
          const lm = LEVEL_META[p.minLevel];
          const isOpen = openId === p.id;
          const isCopied = copiedId === p.id;
          const variant = getVariant(p.id);
          const activeVariant = p[variant];
          const variantsAreSame = p.inConversation.text === p.freshConversation.text;

          return (
            <li key={p.id} className="prompt-card">
              <button
                type="button"
                className="prompt-card__header"
                onClick={() => toggle(p.id)}
                aria-expanded={isOpen}
                aria-controls={`prompt-body-${p.id}`}
              >
                <div className="prompt-card__meta">
                  <span className="prompt-card__name">{p.name}</span>
                  <span className="prompt-card__when">{p.when}</span>
                </div>
                <div className="prompt-card__badges">
                  <span className="prompt-card__seq-tag" aria-label={p.sequenceTag}>
                    {p.sequenceTag}
                  </span>
                  <span
                    className="prompt-card__level-tag"
                    style={{ background: lm.bg, color: lm.color }}
                    aria-label={lm.label}
                  >
                    {lm.label}
                  </span>
                  <svg
                    className={`prompt-card__chevron${isOpen ? " is-open" : ""}`}
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    width="14"
                    height="14"
                    aria-hidden="true"
                  >
                    <polyline points="4,6 8,10 12,6" />
                  </svg>
                </div>
              </button>

              {isOpen && (
                <div className="prompt-card__body" id={`prompt-body-${p.id}`}>

                  {/* Variant switcher */}
                  {!variantsAreSame && (
                    <div className="prompt-card__variant-switcher" role="group" aria-label="Where to run this prompt">
                      <button
                        type="button"
                        className={`prompt-card__variant-btn${variant === "inConversation" ? " is-active" : ""}`}
                        onClick={() => setVariant(p.id, "inConversation")}
                        aria-pressed={variant === "inConversation"}
                      >
                        {p.inConversation.where}
                      </button>
                      <button
                        type="button"
                        className={`prompt-card__variant-btn${variant === "freshConversation" ? " is-active" : ""}`}
                        onClick={() => setVariant(p.id, "freshConversation")}
                        aria-pressed={variant === "freshConversation"}
                      >
                        {p.freshConversation.where}
                      </button>
                    </div>
                  )}

                  {/* Why this context */}
                  <p className="prompt-card__why-here">
                    {variantsAreSame ? p.inConversation.whyHere : activeVariant.whyHere}
                  </p>

                  <div className="prompt-card__text-wrap">
                    <button
                      type="button"
                      className="btn-secondary prompt-card__copy"
                      onClick={() => copyPrompt(p.id, activeVariant.text)}
                      aria-label={isCopied ? "Copied" : `Copy ${p.name} prompt`}
                    >
                      {isCopied ? (
                        <>
                          <svg viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" width="13" height="13" aria-hidden="true">
                            <polyline points="2,6 5,9 11,3" />
                          </svg>
                          Copied
                        </>
                      ) : (
                        <>
                          <svg viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" width="13" height="13" aria-hidden="true">
                            <rect x="1" y="3" width="8" height="9" rx="1" />
                            <path d="M4 3V2a1 1 0 011-1h6a1 1 0 011 1v8a1 1 0 01-1 1h-1" />
                          </svg>
                          Copy prompt
                        </>
                      )}
                    </button>
                    <pre className="prompt-card__text" aria-label="Prompt text">
                      {activeVariant.text}
                    </pre>
                  </div>

                  <div className="prompt-card__footer">
                    <p className="prompt-card__note">{p.note}</p>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <p className="prompt-library__footer-note">
        AI makes mistakes. These prompts won't catch everything, but they will surface more issues than skipping them.
      </p>

      <div className="prompt-library__reading">
        <h2 className="prompt-library__reading-h2">Further reading</h2>

        {isResearch ? (
          <>
            <h3 className="prompt-library__reading-h3">Practical</h3>
            <ul className="prompt-library__reading-list">
              <li className="prompt-library__reading-item">
                <a className="prompt-library__reading-title" href="https://www.nature.com/articles/s41586-023-06291-2" target="_blank" rel="noopener noreferrer">
                  Liang et al. (2023): Holistic Evaluation of Language Models
                </a>
                <p className="prompt-library__reading-why">
                  Why: Systematic benchmarking of LLM accuracy across domains, including science, directly relevant to calibrating how much to trust AI research outputs.
                </p>
                <p className="prompt-library__reading-get">
                  What you'll get: A structured view of where models perform well and where they fail, by task type.
                </p>
              </li>
              <li className="prompt-library__reading-item">
                <a className="prompt-library__reading-title" href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12436494/" target="_blank" rel="noopener noreferrer">
                  Hosseini et al. (2025): AI for Scientific Integrity
                </a>
                <p className="prompt-library__reading-why">
                  Why: Reviews AI-generated citation errors, statistical mistakes, and integrity risks in manuscripts — the failure modes behind AVA Research's citation verification and claim–evidence audit prompts.
                </p>
                <p className="prompt-library__reading-get">
                  What you'll get: Concrete evidence of how and where AI outputs fail in scientific writing, with examples.
                </p>
              </li>
              <li className="prompt-library__reading-item">
                <a className="prompt-library__reading-title" href="https://www.sciencedirect.com/science/article/pii/S0001691825009394" target="_blank" rel="noopener noreferrer">
                  Enhancing Literature Reviews Through AI Integration (2025)
                </a>
                <p className="prompt-library__reading-why">
                  Why: Documents specific failure modes in AI-assisted literature review — scope misrepresentation, omission bias, and overconfident synthesis — that the scope audit and citation verification prompts target.
                </p>
                <p className="prompt-library__reading-get">
                  What you'll get: Practical guidance on where human oversight remains necessary in AI-assisted literature work.
                </p>
              </li>
              <li className="prompt-library__reading-item">
                <a className="prompt-library__reading-title" href="https://arxiv.org/html/2505.04651v1" target="_blank" rel="noopener noreferrer">
                  Scientific Hypothesis Generation and Validation (2025)
                </a>
                <p className="prompt-library__reading-why">
                  Why: Reviews convergence bias and novelty limitations in AI hypothesis generation — the failure mode behind the novelty audit and convergence check prompts.
                </p>
                <p className="prompt-library__reading-get">
                  What you'll get: A clear account of why AI-generated hypotheses tend to recombine existing ideas and how to probe for this.
                </p>
              </li>
              <li className="prompt-library__reading-item">
                <a className="prompt-library__reading-title" href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12722777/" target="_blank" rel="noopener noreferrer">
                  AI in Detecting Statistical Errors (2025)
                </a>
                <p className="prompt-library__reading-why">
                  Why: Documents how AI performs on statistical tasks and where method errors occur — the failure mode behind the method audit and computational check prompts.
                </p>
                <p className="prompt-library__reading-get">
                  What you'll get: Evidence of the specific statistical errors AI makes and why method selection is a particular risk.
                </p>
              </li>
            </ul>

            <h3 className="prompt-library__reading-h3">Research</h3>
            <ul className="prompt-library__reading-list">
              <li className="prompt-library__reading-item">
                <a className="prompt-library__reading-title" href="https://arxiv.org/abs/2207.05221" target="_blank" rel="noopener noreferrer">
                  Kadavath et al. (2022): Language Models (Mostly) Know What They Know
                </a>
                <p className="prompt-library__reading-why">
                  Why: The research behind the confidence elicitation prompt — shows that model confidence can sometimes provide a useful signal about uncertainty.
                </p>
                <p className="prompt-library__reading-get">
                  What you'll get: Evidence that prompting for uncertainty is a meaningful signal, and where it breaks down.
                </p>
              </li>
              <li className="prompt-library__reading-item">
                <a className="prompt-library__reading-title" href="https://arxiv.org/abs/2212.08073" target="_blank" rel="noopener noreferrer">
                  Bai et al. (2022): Constitutional AI: Harmlessness from AI Feedback
                </a>
                <p className="prompt-library__reading-why">
                  Why: The foundational paper behind model self-critique as a structured method.
                </p>
                <p className="prompt-library__reading-get">
                  What you'll get: The mechanism that the self-critique and claim–evidence audit prompts draw on.
                </p>
              </li>
              <li className="prompt-library__reading-item">
                <a className="prompt-library__reading-title" href="https://arxiv.org/html/2504.13777v1" target="_blank" rel="noopener noreferrer">
                  Beyond Misinformation: AI Hallucinations in Science Communication (2025)
                </a>
                <p className="prompt-library__reading-why">
                  Why: Provides a conceptual framework for why AI hallucinations in scientific contexts are structurally different from general misinformation.
                </p>
                <p className="prompt-library__reading-get">
                  What you'll get: A principled account of AI hallucination in science communication, with implications for how to probe for it.
                </p>
              </li>
            </ul>
          </>
        ) : (
          <>
            <h3 className="prompt-library__reading-h3">Practical</h3>
            <ul className="prompt-library__reading-list">
              <li className="prompt-library__reading-item">
                <a className="prompt-library__reading-title" href="https://arize.com/llm-evaluation/" target="_blank" rel="noopener noreferrer">
                  Arize: The Definitive Guide to LLM Evaluation
                </a>
                <p className="prompt-library__reading-why">
                  Why: Explains when exact-match checking works and when it doesn't — the distinction behind AVA's task types.
                </p>
                <p className="prompt-library__reading-get">
                  What you'll get: A clear framework for choosing the right verification approach based on output type.
                </p>
              </li>
              <li className="prompt-library__reading-item">
                <a className="prompt-library__reading-title" href="https://docs.langchain.com/langsmith/evaluation" target="_blank" rel="noopener noreferrer">
                  LangSmith: Evaluation Concepts
                </a>
                <p className="prompt-library__reading-why">
                  Why: Covers how to define what can be measured before designing evaluation — the thinking behind AVA's evidence question.
                </p>
                <p className="prompt-library__reading-get">
                  What you'll get: Practical guidance on structuring evaluation for different kinds of AI outputs.
                </p>
              </li>
              <li className="prompt-library__reading-item">
                <a className="prompt-library__reading-title" href="https://hamel.dev/blog/posts/evals/" target="_blank" rel="noopener noreferrer">
                  Hamel Husain: Your AI Product Needs Evals
                </a>
                <p className="prompt-library__reading-why">
                  Why: Practical guide to building evaluation systems for AI products, with emphasis on starting from error analysis rather than infrastructure.
                </p>
                <p className="prompt-library__reading-get">
                  What you'll get: A concrete workflow for deciding when and how to evaluate AI outputs, written from direct consulting experience.
                </p>
              </li>
              <li className="prompt-library__reading-item">
                <a className="prompt-library__reading-title" href="https://eugeneyan.com/writing/llm-evaluators/" target="_blank" rel="noopener noreferrer">
                  Eugene Yan: LLM Evaluators
                </a>
                <p className="prompt-library__reading-why">
                  Why: Comprehensive survey of evaluation techniques, use cases, and the limits of automated checking.
                </p>
                <p className="prompt-library__reading-get">
                  What you'll get: A practitioner's map of the evaluation landscape, from metrics to alignment to critique.
                </p>
              </li>
              <li className="prompt-library__reading-item">
                <a className="prompt-library__reading-title" href="https://www.nist.gov/itl/ai-risk-management-framework" target="_blank" rel="noopener noreferrer">
                  NIST AI Risk Management Framework
                </a>
                <p className="prompt-library__reading-why">
                  Why: A widely used framework for proportional, risk-based AI oversight that informed AVA's overall approach.
                </p>
                <p className="prompt-library__reading-get">
                  What you'll get: A structured approach to thinking about AI risk across different use contexts.
                </p>
              </li>
            </ul>

            <h3 className="prompt-library__reading-h3">Research</h3>
            <ul className="prompt-library__reading-list">
              <li className="prompt-library__reading-item">
                <a className="prompt-library__reading-title" href="https://arxiv.org/abs/2207.05221" target="_blank" rel="noopener noreferrer">
                  Kadavath et al. (2022): Language Models (Mostly) Know What They Know
                </a>
                <p className="prompt-library__reading-why">
                  Why: The research behind AVA's confidence elicitation prompt: shows that model confidence can sometimes provide a limited signal about uncertainty.
                </p>
                <p className="prompt-library__reading-get">
                  What you'll get: Evidence that prompting for uncertainty is a limited but useful signal, and where it breaks down.
                </p>
              </li>
              <li className="prompt-library__reading-item">
                <a className="prompt-library__reading-title" href="https://arxiv.org/abs/2201.11903" target="_blank" rel="noopener noreferrer">
                  Wei et al. (2022): Chain-of-Thought Prompting Elicits Reasoning in Large Language Models
                </a>
                <p className="prompt-library__reading-why">
                  Why: The origin of AVA's chain of thought prompt: shows that prompting for step-by-step reasoning can improve performance and provide intermediate steps to inspect.
                </p>
                <p className="prompt-library__reading-get">
                  What you'll get: Why step-by-step reconstruction can help expose errors that surface-level review may miss.
                </p>
              </li>
              <li className="prompt-library__reading-item">
                <a className="prompt-library__reading-title" href="https://arxiv.org/abs/2212.08073" target="_blank" rel="noopener noreferrer">
                  Bai et al. (2022): Constitutional AI: Harmlessness from AI Feedback
                </a>
                <p className="prompt-library__reading-why">
                  Why: Informs the use of self-critique as a structured probe: using a model's own principles to evaluate and revise its outputs.
                </p>
                <p className="prompt-library__reading-get">
                  What you'll get: The foundational mechanism that AVA's self-critique prompt draws on.
                </p>
              </li>
              <li className="prompt-library__reading-item">
                <a className="prompt-library__reading-title" href="https://arxiv.org/abs/2303.17651" target="_blank" rel="noopener noreferrer">
                  Madaan et al. (2023): Self-Refine: Iterative Refinement with Self-Feedback
                </a>
                <p className="prompt-library__reading-why">
                  Why: Shows that iterative self-critique can improve outputs across diverse tasks, and examines where the method works and where it does not.
                </p>
                <p className="prompt-library__reading-get">
                  What you'll get: Evidence for when self-critique is most useful, and what its limits are.
                </p>
              </li>
            </ul>
          </>
        )}
      </div>

      <p className="prompt-library__reading-get prompt-library__drawer-cross">
        Want to understand how AVA assigns these methods?{" "}
        <button type="button" className="drawer-cross-link" onClick={() => onOpenOther?.()}>
          How it works →
        </button>
      </p>
    </div>
  );
}
