import { useState } from "react";
import { PROMPT_LIBRARY, type MinLevel } from "../lib/promptLibraryData";

type Filter = "all" | MinLevel;

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

export default function PromptLibrary() {
  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<string | null>(PROMPT_LIBRARY[0]?.id ?? null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const visible = activeFilter === "all"
    ? PROMPT_LIBRARY
    : PROMPT_LIBRARY.filter((p) => p.minLevel === activeFilter);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
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
        These are the exact prompts AVA selects for you based on your risk score. You can also run any of them manually — paste into the same AI tool that produced the output.
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
                  <span
                    className="prompt-card__seq-tag"
                    aria-label={p.sequenceTag}
                  >
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
                  <div className="prompt-card__actions">
                    <button
                      type="button"
                      className="btn-secondary prompt-card__copy"
                      onClick={() => copyPrompt(p.id, p.text)}
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
                  </div>
                  <pre className="prompt-card__text" aria-label="Prompt text">
                    {p.text}
                  </pre>
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
        Run each prompt in a new conversation — paste your AI output fresh each time so prior context doesn't influence the result.
      </p>
    </div>
  );
}
