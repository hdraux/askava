// src/components/ModeSwitcher.tsx
//
// Tab bar rendered between the header and the wizard.
// Sticky so it stays visible while scrolling.

import type { WizardMode } from "./RevealWizard";

interface Props {
  mode: WizardMode;
  onModeChange: (mode: WizardMode) => void;
  onRestart: () => void;
}

function IconSparkle() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden="true">
      <path d="M8 2v2M8 12v2M2 8h2M12 8h2M4.2 4.2l1.4 1.4M10.4 10.4l1.4 1.4M4.2 11.8l1.4-1.4M10.4 5.6l1.4-1.4" />
      <circle cx="8" cy="8" r="2" />
    </svg>
  );
}

function IconBook() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="15" height="15" aria-hidden="true">
      <path d="M2 3.5C2 3.5 4 3 8 3s6 .5 6 .5V13s-2-.5-6-.5-6 .5-6 .5V3.5z" />
      <line x1="8" y1="3" x2="8" y2="12.5" />
    </svg>
  );
}

function IconRestart() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
      <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  );
}

export default function ModeSwitcher({ mode, onModeChange, onRestart }: Props) {
  return (
    <div className="mode-switcher" role="navigation" aria-label="Tool mode">
      <div className="mode-switcher__tabs">
        <button
          type="button"
          className={`mode-switcher__tab${mode === "general" ? " is-active" : ""}`}
          onClick={() => onModeChange("general")}
          aria-pressed={mode === "general"}
        >
          <IconSparkle />
          General AI tasks
        </button>
        <button
          type="button"
          className={`mode-switcher__tab${mode === "research" ? " is-active" : ""}`}
          onClick={() => onModeChange("research")}
          aria-pressed={mode === "research"}
        >
          <IconBook />
          Research tasks
        </button>
      </div>
      <button
        type="button"
        className="mode-switcher__restart"
        onClick={onRestart}
        aria-label="Start over"
        title="Start over"
      >
        <IconRestart />
      </button>
    </div>
  );
}
