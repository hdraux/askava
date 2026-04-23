import logoUrl from "assets/logo_nobckg.png";

function IconRestart() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={18}
      height={18}
      aria-hidden={true}
    >
      <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  );
}

interface Props {
  onHowItWorks: () => void;
  onVerificationMethods: () => void;
  onRestart?: () => void;
}

export default function Header({ onHowItWorks, onVerificationMethods, onRestart }: Props) {
  return (
    <div className="ava-header-shell">
      <header className="ava-header">
        <button
          type="button"
          className="ava-header__brand"
          onClick={() => onRestart?.()}
          aria-label="Start over"
        >
          <img src={logoUrl} alt="" className="ava-logo-mark" />
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
      {onRestart ? (
        <div className="ava-header__restart-row">
          <button
            type="button"
            className="ava-header__nav-link ava-header__restart-icon"
            onClick={() => onRestart()}
            aria-label="Start over"
            title="Start over"
          >
            <IconRestart />
          </button>
        </div>
      ) : null}
    </div>
  );
}
