export default function Header() {
  return (
    <header className="ava-header">
      <div className="ava-header__brand">
        <span className="ava-logo" aria-hidden="true">
          AVA
        </span>
        <p className="ava-header__title">AI Verification Advisor</p>
      </div>
      <p className="ava-header__tagline">Built for speed. Designed for clarity.</p>
    </header>
  );
}
