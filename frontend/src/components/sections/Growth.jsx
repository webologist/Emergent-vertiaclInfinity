import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, ArrowUpRight, Plus, ChevronDown } from "lucide-react";
import { GROWTH } from "@/data/content";
import { Reveal, StaggerGroup, staggerItem } from "@/components/Reveal";
import { scrollToId } from "@/lib/scroll";

const API = process.env.REACT_APP_BACKEND_URL;
const INITIAL_COUNT = 9;

const GoogleG = () => (
  <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.6 30.2 0 24 0 14.6 0 6.4 5.4 2.5 13.3l7.8 6c1.9-5.5 7-9.8 13.7-9.8z" />
    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.5 3-2.2 5.5-4.7 7.2l7.3 5.7c4.3-4 6.8-9.9 6.8-17.4z" />
    <path fill="#FBBC05" d="M10.3 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.8-6C.9 16.5 0 20.1 0 24s.9 7.5 2.5 10.7l7.8-6z" />
    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.3-5.7c-2 1.4-4.7 2.3-8.6 2.3-6.7 0-12.4-4.5-14.4-10.6l-7.8 6C6.4 42.6 14.6 48 24 48z" />
  </svg>
);

export default function Growth() {
  const [rev, setRev] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/reviews`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setRev)
      .catch(() => setRev(null));
  }, []);

  const rating = rev?.rating ?? 4.9;
  const hiddenCount = Math.max(GROWTH.clients.length - INITIAL_COUNT, 0);
  const visibleClients = showAll ? GROWTH.clients : GROWTH.clients.slice(0, INITIAL_COUNT);

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
        <div className="mt-12 border-y border-white/10 py-8">
          <StaggerGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {visibleClients.map((c, i) => (
              <motion.div
                key={c.name}
                variants={staggerItem}
                initial={i >= INITIAL_COUNT ? { opacity: 0, y: 20 } : undefined}
                animate={i >= INITIAL_COUNT ? { opacity: 1, y: 0 } : undefined}
                transition={i >= INITIAL_COUNT ? { duration: 0.5, ease: [0.22, 1, 0.36, 1] } : undefined}
                className="flex h-[150px] w-full items-center justify-center rounded-xl border border-white/10 bg-cwhite p-6 transition-colors duration-300 hover:border-crimson/50 sm:h-[200px]"
                data-testid={`client-${c.name.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <img
                  src={c.logo}
                  alt={c.name}
                  className="h-full w-full object-contain grayscale contrast-125 transition-[filter] duration-500 hover:grayscale-0"
                  loading="lazy"
                  draggable={false}
                />
              </motion.div>
            ))}
          </StaggerGroup>

          {/* Expand / collapse CTA */}
          {hiddenCount > 0 && (
            <Reveal delay={0.1}>
              <div className="mt-10 flex flex-col items-center">
                <button
                  onClick={() => setShowAll((v) => !v)}
                  className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-crimson px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.15em] text-cwhite shadow-lg shadow-crimson/20 transition-all duration-300 hover:shadow-crimson/40"
                  data-testid="toggle-clients-btn"
                >
                  <span className="absolute inset-0 -translate-x-full bg-white/15 transition-transform duration-500 group-hover:translate-x-0" aria-hidden="true" />
                  <span className="relative z-10">
                    {showAll ? "Show less" : `View all ${GROWTH.clients.length} brands`}
                  </span>
                  <ChevronDown
                    size={17}
                    className={`relative z-10 transition-transform duration-300 ${showAll ? "rotate-180" : "group-hover:translate-y-0.5"}`}
                  />
                </button>
                {!showAll && (
                  <span className="mt-3 text-xs text-dim" data-testid="hidden-clients-hint">
                    +{hiddenCount} more brands who trust us
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

        {/* Google reviews */}
        <div className="mt-12 flex justify-center">
          <Reveal delay={0.1}>
            <div className="flex w-full max-w-md flex-col rounded-2xl border border-white/10 bg-elevated p-8 md:p-9" data-testid="google-reviews-card">
              <div className="flex items-center gap-3">
                <GoogleG />
                <span className="font-display text-lg font-bold">Google Reviews</span>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <span className="font-display text-5xl font-extrabold leading-none" data-testid="reviews-rating">
                  {Number(rating).toFixed(1)}
                </span>
                <div>
                  <div className="flex gap-0.5 text-crimson">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                    ))}
                  </div>
                  <div className="mt-1 text-[11px] text-dim" data-testid="reviews-count">
                    {rev?.live && rev.review_count != null ? `${rev.review_count} Google reviews` : "Verified listing on Google Maps"}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3">
                <a
                  href={rev?.google_maps_uri || "https://maps.google.com/?cid=885671371509995655"}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-white px-5 py-3 text-center text-sm font-semibold text-ink transition-colors duration-300 hover:bg-crimson hover:text-cwhite"
                  data-testid="view-reviews-btn"
                >
                  View all reviews
                </a>
                <a
                  href={rev?.write_review_uri || rev?.google_maps_uri || "https://maps.google.com/?cid=885671371509995655"}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:border-crimson"
                  data-testid="review-google-btn"
                >
                  Review us on Google
                  <ArrowUpRight size={15} className="text-crimson transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                {rev?.live && <span className="text-center text-[10px] text-dim">Live data provided by Google Maps</span>}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
