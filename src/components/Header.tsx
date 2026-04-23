import logoUrl from "../../../design/mockups/logo.png";

function LightningIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M8.5 1.5L3 8.5H7.5L6.5 13.5L12 6.5H7.5L8.5 1.5Z" stroke="#43a26f" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default function Header() {
  return (
    <header className="ava-header">
      <div className="ava-header__brand">
        <img src={logoUrl} alt="AVA" className="ava-logo-mark" height="36" />
        <p className="ava-header__title">AI Verification Advisor</p>
      </div>
      <p className="ava-header__tagline">
        <LightningIcon />
        Built for speed. Designed for clarity.
      </p>
    </header>
  );
}
