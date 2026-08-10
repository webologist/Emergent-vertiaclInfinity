import { useEffect, useRef } from "react";

// Subtle "school of fish" particle field for the hero background.
// Boids-lite: each fish wanders, aligns loosely with neighbours and gently
// avoids crowding, giving an organic swimming-in-water feel.
export function FishParticles({ count = 46, theme = "dark", className = "" }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    // Palette tuned to the site: crimson accent + soft tones that stay
    // visible on both the light and dark hero backgrounds.
    const palette =
      theme === "dark"
        ? [
            { r: 206, g: 31, b: 46 },
            { r: 206, g: 31, b: 46 },
            { r: 255, g: 255, b: 255 },
            { r: 255, g: 235, b: 238 },
          ]
        : [
            { r: 206, g: 31, b: 46 },
            { r: 206, g: 31, b: 46 },
            { r: 150, g: 20, b: 32 },
            { r: 40, g: 40, b: 46 },
          ];

    const fishes = Array.from({ length: count }, () => {
      const c = palette[Math.floor(Math.random() * palette.length)];
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.25 + Math.random() * 0.4;
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 1.4 + Math.random() * 2.2,
        color: c,
        alpha: 0.25 + Math.random() * 0.45,
        phase: Math.random() * Math.PI * 2,
      };
    });

    const NEIGHBOR = 70;
    const MAX_SPEED = 0.75;

    const step = (t) => {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < fishes.length; i++) {
        const f = fishes[i];
        let ax = 0;
        let ay = 0;
        let alignX = 0;
        let alignY = 0;
        let n = 0;

        for (let j = 0; j < fishes.length; j++) {
          if (i === j) continue;
          const dx = fishes[j].x - f.x;
          const dy = fishes[j].y - f.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < NEIGHBOR * NEIGHBOR && d2 > 0.001) {
            const d = Math.sqrt(d2);
            // separation
            ax -= dx / d2;
            ay -= dy / d2;
            // alignment
            alignX += fishes[j].vx;
            alignY += fishes[j].vy;
            n++;
          }
        }

        if (n > 0) {
          f.vx += (alignX / n - f.vx) * 0.008;
          f.vy += (alignY / n - f.vy) * 0.008;
        }
        f.vx += ax * 0.06;
        f.vy += ay * 0.06;

        // gentle wander
        f.phase += 0.02;
        f.vx += Math.cos(f.phase) * 0.006;
        f.vy += Math.sin(f.phase * 0.9) * 0.006;

        // clamp speed
        const sp = Math.hypot(f.vx, f.vy);
        if (sp > MAX_SPEED) {
          f.vx = (f.vx / sp) * MAX_SPEED;
          f.vy = (f.vy / sp) * MAX_SPEED;
        }

        f.x += f.vx;
        f.y += f.vy;

        // wrap around edges softly
        const m = 24;
        if (f.x < -m) f.x = w + m;
        if (f.x > w + m) f.x = -m;
        if (f.y < -m) f.y = h + m;
        if (f.y > h + m) f.y = -m;

        // draw fish as a small tapered body facing its heading
        const dir = Math.atan2(f.vy, f.vx);
        const wobble = Math.sin(t * 0.004 + f.phase) * 0.5;
        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(dir + wobble * 0.25);
        ctx.beginPath();
        ctx.moveTo(f.size * 2.4, 0);
        ctx.quadraticCurveTo(0, f.size, -f.size * 1.8, 0);
        ctx.quadraticCurveTo(0, -f.size, f.size * 2.4, 0);
        ctx.fillStyle = `rgba(${f.color.r}, ${f.color.g}, ${f.color.b}, ${f.alpha})`;
        ctx.fill();
        // tiny tail
        ctx.beginPath();
        ctx.moveTo(-f.size * 1.8, 0);
        ctx.lineTo(-f.size * 3, f.size * 1.1);
        ctx.lineTo(-f.size * 3, -f.size * 1.1);
        ctx.closePath();
        ctx.fillStyle = `rgba(${f.color.r}, ${f.color.g}, ${f.color.b}, ${f.alpha * 0.7})`;
        ctx.fill();
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(step);
    };

    if (!prefersReduced) {
      rafRef.current = requestAnimationFrame(step);
    } else {
      // draw a single static frame
      step(0);
      cancelAnimationFrame(rafRef.current);
    }

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [count, theme]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
      data-testid="fish-particles"
    />
  );
}
