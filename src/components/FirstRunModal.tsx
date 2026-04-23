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
        <h2 id="modal-title" className="modal__title">
          Check if an AI answer is safe to use
        </h2>
        <p className="modal__desc">
          Answer a few quick questions and get a verification plan: what checks to run, and exactly what to ask.
        </p>

        <ul className="modal__bullets" aria-label="Key features">
          <li className="modal__bullet">
            <span className="modal__bullet-icon" aria-hidden="true">
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="2,6 5,9 10,3" />
              </svg>
            </span>
            <span>
              <strong>Risk-calibrated</strong>: checks match the stakes, not a one-size checklist
            </span>
          </li>
          <li className="modal__bullet">
            <span className="modal__bullet-icon" aria-hidden="true">
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="2,6 5,9 10,3" />
              </svg>
            </span>
            <span>
              <strong>Step-by-step prompts</strong>: pick one per step, paste your output, done
            </span>
          </li>
          <li className="modal__bullet">
            <span className="modal__bullet-icon" aria-hidden="true">
              <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="2,6 5,9 10,3" />
              </svg>
            </span>
            <span>
              <strong>Ready-to-copy prompts</strong>: no guessing what to ask or how to phrase it
            </span>
          </li>
        </ul>

        <div className="modal__actions">
          <button type="button" className="btn-primary modal__btn-start" onClick={dismiss}>
            Get started →
          </button>
        </div>
      </div>
    </div>
  );
}
