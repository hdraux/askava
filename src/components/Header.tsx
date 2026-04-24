// src/components/Header.tsx

import generalLogoUrl from "assets/logo_nobckg.png";
import researchLogoUrl from "assets/logo_research_nobckg.png";
import type { WizardMode } from "./RevealWizard";

interface Props {
  mode: WizardMode;
  onHowItWorks: () => void;
  onVerificationMethods: () => void;
  onRestart?: () => void;
}

export default function Header({
  mode,
  onHowItWorks,
  onVerificationMethods,
  onRestart,
}: Props) {
  const logoUrl = mode === "research" ? researchLogoUrl : generalLogoUrl;
  const logoAlt = mode === "research" ? "AVA Research" : "Ask AVA";

  return (
    <div className="ava-header-shell">
      <header className="ava-header">
        <button
          type="button"
          className="ava-header__brand"
          onClick={() => onRestart?.()}
          aria-label="Start over"
        >
          <img src={logoUrl} alt={logoAlt} className="ava-logo-mark" />
          <div className="ava-header__titles">
            <p className="ava-header__title">Ask AVA</p>
            <p className="ava-header__tagline">AI verification advisor</p>
          </div>
        </button>
        <nav className="ava-header__nav" aria-label="Site navigation">
          <button type="button" className="ava-header__nav-link" onClick={onHowItWorks}>
            How it works
          </button>
          <button type="button" className="ava-header__nav-link" onClick={onVerificationMethods}>
            Verification methods
          </button>
        </nav>
      </header>
    </div>
  );
}
