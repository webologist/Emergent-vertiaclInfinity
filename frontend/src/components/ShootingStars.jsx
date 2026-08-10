import { useMemo } from "react";

export function ShootingStars({ count = 8, className = "" }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        top: Math.random() * 65,
        left: Math.random() * 85 + 5,
        width: 70 + Math.random() * 110,
        duration: 2.8 + Math.random() * 3.5,
        delay: Math.random() * 7,
      })),
    [count]
  );

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true" data-testid="shooting-stars">
      {stars.map((s) => (
        <span
          key={s.id}
          className="shooting-star"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.width}px`,
            animationDuration: `${s.duration}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
