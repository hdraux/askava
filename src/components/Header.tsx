function AvaLogoMark() {
  return (
    <svg
      viewBox="0 0 64 52"
      height="36"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className="ava-logo-mark"
    >
      {/* A-V-A letterform */}
      <polyline
        points="3,36 16,4 32,31 48,4 61,36"
        stroke="#173a67"
        strokeWidth="7.5"
        strokeLinecap="butt"
        strokeLinejoin="miter"
        fill="none"
      />
      {/* Green accent chevron */}
      <polyline
        points="26,31 32,42 38,31"
        stroke="#43a26f"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Slate accent chevron */}
      <polyline
        points="28.5,40 32,47 35.5,40"
        stroke="#8699b2"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export default function Header() {
  return (
    <header className="ava-header">
      <div className="ava-header__brand">
        <AvaLogoMark />
        <p className="ava-header__title">AI Verification Advisor</p>
      </div>
      <p className="ava-header__tagline">Built for speed. Designed for clarity.</p>
    </header>
  );
}
