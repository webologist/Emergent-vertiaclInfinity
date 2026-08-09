// Vertical Infinity brand mark — vertical figure-8, crimson top loop.
export const Logo = ({ size = 28, className = "" }) => (
  <svg
    width={Math.round(size * 0.64)}
    height={size}
    viewBox="0 0 64 100"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    <path
      d="M32 50 C 10 68, 10 94, 32 94 C 54 94, 54 68, 32 50"
      stroke="white"
      strokeWidth="10"
      strokeLinecap="round"
    />
    <path
      d="M32 50 C 10 32, 10 6, 32 6 C 54 6, 54 32, 32 50"
      stroke="#CE1F2E"
      strokeWidth="10"
      strokeLinecap="round"
    />
  </svg>
);
