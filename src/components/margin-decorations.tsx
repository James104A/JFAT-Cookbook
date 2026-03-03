export function MarginDecorations() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 hidden overflow-hidden lg:block">
      {/* Left margin decorations */}
      {/* Fork */}
      <svg
        className="absolute top-[12%] left-6 h-16 w-6 opacity-[0.06]"
        viewBox="0 0 24 64"
        fill="none"
      >
        <line x1="12" y1="28" x2="12" y2="64" stroke="var(--accent-amber)" strokeWidth="2" strokeLinecap="round" />
        <line x1="6" y1="0" x2="6" y2="22" stroke="var(--accent-amber)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="12" y1="0" x2="12" y2="22" stroke="var(--accent-amber)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="18" y1="0" x2="18" y2="22" stroke="var(--accent-amber)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M6 22 C6 26, 12 28, 12 28 C12 28, 18 26, 18 22" stroke="var(--accent-amber)" strokeWidth="1.5" fill="none" />
      </svg>

      {/* Left swirl */}
      <svg
        className="absolute top-[30%] left-4 h-20 w-10 opacity-[0.05]"
        viewBox="0 0 40 80"
        fill="none"
      >
        <path
          d="M20 0 C30 10, 35 25, 25 35 S5 40, 10 55 C15 65, 30 65, 30 55"
          stroke="var(--accent-copper)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="30" cy="55" r="2" fill="var(--accent-copper)" />
      </svg>

      {/* Knife */}
      <svg
        className="absolute top-[55%] left-7 h-16 w-5 -rotate-12 opacity-[0.06]"
        viewBox="0 0 20 64"
        fill="none"
      >
        <path d="M10 0 L14 32 L10 36 L6 32 Z" stroke="var(--accent-sage)" strokeWidth="1.2" fill="none" />
        <line x1="10" y1="36" x2="10" y2="64" stroke="var(--accent-sage)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="5" y1="38" x2="15" y2="38" stroke="var(--accent-sage)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      {/* Left lower swirl */}
      <svg
        className="absolute top-[75%] left-5 h-14 w-8 opacity-[0.04]"
        viewBox="0 0 32 56"
        fill="none"
      >
        <path
          d="M16 0 C24 8, 28 20, 20 28 S4 32, 8 44 C10 50, 20 52, 24 46"
          stroke="var(--accent-amber)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <circle cx="8" cy="44" r="1.5" fill="var(--accent-amber)" />
      </svg>

      {/* Right margin decorations */}
      {/* Knife (right) */}
      <svg
        className="absolute top-[15%] right-7 h-16 w-5 rotate-12 opacity-[0.06]"
        viewBox="0 0 20 64"
        fill="none"
      >
        <path d="M10 0 L14 32 L10 36 L6 32 Z" stroke="var(--accent-sage)" strokeWidth="1.2" fill="none" />
        <line x1="10" y1="36" x2="10" y2="64" stroke="var(--accent-sage)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="5" y1="38" x2="15" y2="38" stroke="var(--accent-sage)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>

      {/* Right swirl */}
      <svg
        className="absolute top-[35%] right-4 h-20 w-10 -scale-x-100 opacity-[0.05]"
        viewBox="0 0 40 80"
        fill="none"
      >
        <path
          d="M20 0 C30 10, 35 25, 25 35 S5 40, 10 55 C15 65, 30 65, 30 55"
          stroke="var(--accent-amber)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="30" cy="55" r="2" fill="var(--accent-amber)" />
      </svg>

      {/* Fork (right) */}
      <svg
        className="absolute top-[58%] right-6 h-16 w-6 opacity-[0.06]"
        viewBox="0 0 24 64"
        fill="none"
      >
        <line x1="12" y1="28" x2="12" y2="64" stroke="var(--accent-copper)" strokeWidth="2" strokeLinecap="round" />
        <line x1="6" y1="0" x2="6" y2="22" stroke="var(--accent-copper)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="12" y1="0" x2="12" y2="22" stroke="var(--accent-copper)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="18" y1="0" x2="18" y2="22" stroke="var(--accent-copper)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M6 22 C6 26, 12 28, 12 28 C12 28, 18 26, 18 22" stroke="var(--accent-copper)" strokeWidth="1.5" fill="none" />
      </svg>

      {/* Right lower swirl */}
      <svg
        className="absolute top-[78%] right-5 h-14 w-8 -scale-x-100 opacity-[0.04]"
        viewBox="0 0 32 56"
        fill="none"
      >
        <path
          d="M16 0 C24 8, 28 20, 20 28 S4 32, 8 44 C10 50, 20 52, 24 46"
          stroke="var(--accent-copper)"
          strokeWidth="1"
          strokeLinecap="round"
        />
        <circle cx="8" cy="44" r="1.5" fill="var(--accent-copper)" />
      </svg>
    </div>
  );
}
