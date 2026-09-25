import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Plus, ChevronDown } from "lucide-react";
import { GROWTH } from "@/data/content";
import { Reveal, StaggerGroup, staggerItem } from "@/components/Reveal";
import { scrollToId } from "@/lib/scroll";

const INITIAL_COUNT = 9;

export default function Growth() {
  const [showAll, setShowAll] = useState(false);
  const gridRef = useRef(null);

  const hiddenCount = Math.max(GROWTH.clients.length - INITIAL_COUNT, 0);
  const visibleClients = showAll ? GROWTH.clients : GROWTH.clients.slice(0, INITIAL_COUNT);

  const toggleClients = () => {
    setShowAll((v) => {
      const next = !v;
      if (!next && gridRef.current) {
        const el = gridRef.current;
        requestAnimationFrame(() => {
          if (window.__lenis) window.__lenis.scrollTo(el, { offset: -100, duration: 1.1 });
          else el.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
      return next;
    });
  };

  return (
    <section id="growth" className="relative border-t border-white/10 py-24 md:py-36" data-testid="growth-section">
      <div className="container-x">
        <Reveal>
          <span className="overline">{GROWTH.overline}</span>
        </Reveal>
        <Reveal delay={0.05}>
          <blockquote className="mt-6 max-w-3xl font-display text-2xl font-semibold leading-snug tracking-tight text-white md:text-3xl" data-testid="growth-subtext">
            "{GROWTH.subQuote.text}"
          </blockquote>
          <p className="mt-3 text-sm text-dim" data-testid="growth-subtext-author">— {GROWTH.subQuote.author}</p>
        </Reveal>

        {/* Client wordmarks */}
        <div ref={gridRef} className="mt-12 scroll-mt-28 border-y border-white/10 py-8">
          <StaggerGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {visibleClients.map((c, i) => (
              <motion.div
                key={c.name}
                variants={staggerItem}
                initial={i >= INITIAL_COUNT ? { opacity: 0, y: 20 } : undefined}
                animate={i >= INITIAL_COUNT ? { opacity: 1, y: 0 } : undefined}
                transition={i >= INITIAL_COUNT ? { duration: 0.5, ease: [0.22, 1, 0.36, 1] } : undefined}
                className="group relative flex h-[150px] w-full items-center justify-center rounded-xl border border-white/10 bg-cwhite p-6 transition-colors duration-300 hover:border-crimson/50 sm:h-[200px]"
                data-testid={`client-${c.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <img
                  src={c.logo}
                  alt={c.name}
                  className="h-full w-full object-contain grayscale contrast-125 transition-[filter] duration-500 group-hover:grayscale-0"
                  loading="lazy"
                  draggable={false}
                />
                <span
                  className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-full bg-ink px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-cwhite opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                  data-testid={`client-tooltip-${c.name.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {c.name}
                </span>
              </motion.div>
            ))}
          </StaggerGroup>

          {/* Expand / collapse CTA */}
          {hiddenCount > 0 && (
            <Reveal delay={0.1}>
              <div className="mt-10 flex flex-col items-center">
                <button
                  onClick={toggleClients}
                  className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-crimson px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.15em] text-cwhite shadow-lg shadow-crimson/20 transition-all duration-300 hover:shadow-crimson/40"
                  data-testid="toggle-clients-btn"
                >
                  <span className="absolute inset-0 -translate-x-full bg-white/15 transition-transform duration-500 group-hover:translate-x-0" aria-hidden="true" />
                  <span className="relative z-10">
                    {showAll ? "Show less" : "View all brands"}
                  </span>
                  <ChevronDown
                    size={17}
                    className={`relative z-10 transition-transform duration-300 ${showAll ? "rotate-180" : "group-hover:translate-y-0.5"}`}
                  />
                </button>
                {!showAll && (
                  <span className="mt-3 text-xs text-dim" data-testid="hidden-clients-hint">
                    More brands who trust us
                  </span>
                )}
              </div>
            </Reveal>
          )}

          <Reveal delay={0.1}>
            <button
              onClick={() => scrollToId("#contact")}
              className="group mx-auto mt-8 flex items-center gap-2.5 rounded-full border border-dashed border-white/25 px-6 py-2.5 text-sm text-dim transition-colors duration-300 hover:border-crimson hover:text-white"
              data-testid="your-logo-here-btn"
            >
              <Plus size={14} className="text-crimson transition-transform duration-300 group-hover:rotate-90" />
              We would like&nbsp;<span className="font-semibold text-white">your logo</span>&nbsp;to be here.
            </button>
          </Reveal>
        </div>

        {/* Branson quote — centered, breaking over the divider */}
        <div className="relative z-10 -mt-6 flex justify-center px-4 md:-mt-7">
          <Reveal delay={0.15}>
            <div className="max-w-2xl bg-ink px-4 text-center md:px-8">
              <blockquote className="font-display text-xl font-semibold leading-snug tracking-tight text-white md:text-2xl" data-testid="branson-quote">
                "{GROWTH.bransonQuote.text}"
              </blockquote>
              <p className="mt-3 text-sm text-dim" data-testid="branson-quote-author">– {GROWTH.bransonQuote.author}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
