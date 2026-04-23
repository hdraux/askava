import { useEffect, useState } from "react";

const STORAGE_KEY = "ava_intro_seen";

interface Props {
  onDismiss: () => void;
}

export default function FirstRunModal({ onDismiss }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) setVisible(true);
  }, []);

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
    onDismiss();
  }

  if (!visible) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal">
        <div className="modal__logo" aria-hidden="true">
          <svg viewBox="0 0 18 18" fill="none" width="20" height="20">
            <path d="M9 2L14 7L9 12L4 7L9 2Z" fill="white" opacity="0.9" />
            <path d="M4 7L9 12L9 16" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M14 7L9 12L9 16" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
          </svg>
        </div>

        <h2 id="modal-title" className="modal__title">
          Check if an AI answer is safe to use
        </h2>
        <p className="modal__desc">
          Answer a few quick questions and get a verification plan: which model to switch to, and exactly what to ask.
        </p>

        <ul className="modal__bullets" aria-label="Key features">
          <li className="modal__bullet">
            <span className="modal__bullet-icon" aria-hidden="true">
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="2,6 5,9 10,3" />
              </svg>
            </span>
            <span>
              <strong>Risk-calibrated</strong> — checks match the stakes, not a one-size checklist
            </span>
          </li>
          <li className="modal__bullet">
            <span className="modal__bullet-icon" aria-hidden="true">
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="2,6 5,9 10,3" />
              </svg>
            </span>
            <span>
              <strong>Switch model first</strong> — the most reliable check is a fresh pair of AI eyes
            </span>
          </li>
          <li className="modal__bullet">
            <span className="modal__bullet-icon" aria-hidden="true">
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="2,6 5,9 10,3" />
              </svg>
            </span>
            <span>
              <strong>Ready-to-copy prompts</strong> — no guessing what to ask or how to phrase it
            </span>
          </li>
        </ul>

        <div className="modal__actions">
          <button type="button" className="btn-primary modal__btn-start" onClick={dismiss}>
            Get started →
          </button>
          <button type="button" className="modal__btn-skip" onClick={dismiss}>
            I know how this works, skip intro
          </button>
        </div>
      </div>
    </div>
  );
}
