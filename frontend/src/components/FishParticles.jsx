import { useEffect, useRef } from "react";

// "Fish in Water" interactive particle field.
// Reference: https://codepen.io/alexsafayan/pen/VYmXLM
// A grid of particles darts away from the cursor and springs back to its
// origin, swelling based on displacement — like a school of fish reacting to
// a hand in water. Palette + opacity tuned subtle to match the site.
export function FishParticles({ theme = "dark", spacing = 46, className = "" }) {
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
    let particles = [];

    // Crimson + soft accents, tuned per theme so they read on both backgrounds.
    const colors =
      theme === "dark"
        ? [
            "rgba(206, 31, 46, 0.55)",
            "rgba(255, 255, 255, 0.5)",
            "rgba(255, 235, 238, 0.45)",
          ]
        : [
            "rgba(206, 31, 46, 0.5)",
            "rgba(150, 20, 32, 0.35)",
            "rgba(40, 40, 46, 0.28)",
          ];

    const build = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      particles = [];
      for (let x = 0; x < w / spacing; x++) {
        for (let y = 0; y < h / spacing; y++) {
          const ox = x * spacing + 20;
          const oy = y * spacing + 20;
          particles.push({
            x: ox,
            y: oy,
            xo: ox,
            yo: oy,
            baseR: 1.6,
            r: 1.6,
            color: colors[Math.floor(Math.random() * colors.length)],
          });
        }
      }
    };
    build();

    const mouse = { x: -9999, y: -9999 };
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, w, h);

      for (let t = 0; t < particles.length; t++) {
        const p = particles[t];

        // repel from cursor
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= 110) {
          p.x -= dx / 22;
          p.y -= dy / 22;
        }

        // spring back to origin
        const dxo = p.x - p.xo;
        const dyo = p.y - p.yo;
        const disto = Math.sqrt(dxo * dxo + dyo * dyo);
        p.x -= dxo / 42;
        p.y -= dyo / 42;

        // swell with displacement
        p.r = disto / 6 + p.baseR;

        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, false);
        ctx.fill();
      }
    };

    if (prefersReduced) {
      draw();
      cancelAnimationFrame(rafRef.current);
    } else {
      rafRef.current = requestAnimationFrame(draw);
    }

    window.addEventListener("resize", build);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", build);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [theme, spacing]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      aria-hidden="true"
      data-testid="fish-particles"
    />
  );
}
