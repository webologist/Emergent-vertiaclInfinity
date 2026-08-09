import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, ArrowUpRight, Plus } from "lucide-react";
import { GROWTH } from "@/data/content";
import { Reveal, StaggerGroup, staggerItem } from "@/components/Reveal";
import { scrollToId } from "@/lib/scroll";

const API = process.env.REACT_APP_BACKEND_URL;

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

  useEffect(() => {
    fetch(`${API}/api/reviews`)
      .then((r) => (r.ok ? r.json() : null))
      .then(setRev)
      .catch(() => setRev(null));
  }, []);

  const rating = rev?.rating ?? 4.9;
  const reviewList = rev?.live && rev.reviews?.length ? rev.reviews : GROWTH.fallbackReviews;

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
          <StaggerGroup className="grid grid-cols-2 items-center gap-x-8 gap-y-6 sm:grid-cols-3">
            {GROWTH.clients.map((c) => (
              <motion.div
                key={c}
                variants={staggerItem}
                className="flex items-center justify-center"
                data-testid={`client-${c.toLowerCase()}`}
              >
                <span className="font-display text-lg font-bold uppercase tracking-tight text-white/35 transition-colors duration-300 hover:text-white">
                  {c}
                </span>
              </motion.div>
            ))}
          </StaggerGroup>
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
            <div className="flex w-full max-w-xl flex-col rounded-2xl border border-white/10 bg-elevated p-8 md:p-9" data-testid="google-reviews-card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GoogleG />
                  <span className="font-display text-lg font-bold">Google Reviews</span>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5">
                    <span className="font-display text-3xl font-extrabold leading-none" data-testid="reviews-rating">{Number(rating).toFixed(1)}</span>
                    <div className="flex gap-0.5 text-crimson">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} fill="currentColor" strokeWidth={0} />
                      ))}
                    </div>
                  </div>
                  <div className="mt-0.5 text-[11px] text-dim" data-testid="reviews-count">
                    {rev?.live && rev.review_count != null ? `${rev.review_count} Google reviews` : "Verified listing on Google Maps"}
                  </div>
                </div>
              </div>

              {/* Auto-scrolling review feed — shows 2 reviews at a time */}
              <div className="relative mt-6 h-[248px] overflow-hidden" data-testid="reviews-scroller">
                <div className="animate-marquee-y flex flex-col gap-3">
                  {[...reviewList, ...reviewList].map((r, i) => (
                    <figure key={i} className="h-[118px] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-surface p-4">
                      <div className="flex items-center gap-2">
                        {r.author_photo_uri ? (
                          <img src={r.author_photo_uri} alt="" className="h-6 w-6 rounded-full" loading="lazy" />
                        ) : (
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-crimson/15 text-[10px] font-bold text-crimson">
                            {(r.author || "G")[0]}
                          </span>
                        )}
                        <span className="text-xs font-semibold text-white">{r.author || "Google user"}</span>
                        <span className="ml-auto flex gap-0.5 text-crimson">
                          {[...Array(r.rating || 5)].map((_, s) => (
                            <Star key={s} size={10} fill="currentColor" strokeWidth={0} />
                          ))}
                        </span>
                      </div>
                      <blockquote className="mt-2 line-clamp-3 text-xs leading-relaxed text-dim">
                        "{r.text.length > 160 ? `${r.text.slice(0, 160)}…` : r.text}"
                      </blockquote>
                    </figure>
                  ))}
                </div>
                <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-elevated to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-elevated to-transparent" />
              </div>

              <div className="mt-6 flex flex-col gap-3">
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
