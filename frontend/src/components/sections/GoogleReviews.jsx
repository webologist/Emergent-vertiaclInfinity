import { Star, ArrowUpRight, Quote } from "lucide-react";
import { GOOGLE_REVIEWS } from "@/data/content";
import { Reveal, StaggerGroup, staggerItem } from "@/components/Reveal";
import { useGoogleReviews } from "@/lib/useGoogleReviews";
import { motion } from "framer-motion";

export const GoogleG = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.6 2.6 30.2 0 24 0 14.6 0 6.4 5.4 2.5 13.3l7.8 6c1.9-5.5 7-9.8 13.7-9.8z" />
    <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.5 3-2.2 5.5-4.7 7.2l7.3 5.7c4.3-4 6.8-9.9 6.8-17.4z" />
    <path fill="#FBBC05" d="M10.3 28.7c-.5-1.5-.8-3-.8-4.7s.3-3.2.8-4.7l-7.8-6C.9 16.5 0 20.1 0 24s.9 7.5 2.5 10.7l7.8-6z" />
    <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.3-5.7c-2 1.4-4.7 2.3-8.6 2.3-6.7 0-12.4-4.5-14.4-10.6l-7.8 6C6.4 42.6 14.6 48 24 48z" />
  </svg>
);

const Stars = ({ n = 5, size = 14 }) => (
  <div className="flex gap-0.5 text-crimson" aria-label={`${n} out of 5 stars`}>
    {[...Array(5)].map((_, i) => (
      <Star key={i} size={size} fill={i < n ? "currentColor" : "none"} strokeWidth={i < n ? 0 : 1.5} className={i < n ? "" : "opacity-40"} />
    ))}
  </div>
);

export default function GoogleReviews({ slug = "home" }) {
  const g = useGoogleReviews();
  const hasReviews = GOOGLE_REVIEWS.length > 0;

  return (
    <section className="relative border-t border-white/10 py-20 md:py-28" data-testid={`${slug}-google-reviews`}>
      <div className="container-x">
        <div className={`grid gap-10 ${hasReviews ? "lg:grid-cols-[minmax(280px,360px)_1fr]" : "lg:grid-cols-[1fr_1fr] lg:items-center"}`}>
          <Reveal>
            <div>
              <span className="overline">Loved on Google</span>
              <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tighter sm:text-4xl lg:text-5xl">
                Rated <span className="text-crimson">{Number(g.rating).toFixed(1)}</span> by the people we build for.
              </h2>
              <p className="mt-5 max-w-md text-base leading-relaxed text-dim">
                Real feedback from founders and teams who trusted us with their platforms — verified on Google.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center gap-6 rounded-2xl border border-white/10 bg-elevated p-6 md:p-7" data-testid="google-reviews-card">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface shadow-sm">
                    <GoogleG size={28} />
                  </div>
                  <div>
                    <div className="flex items-end gap-2">
                      <span className="font-display text-4xl font-extrabold leading-none" data-testid="reviews-rating">
                        {Number(g.rating).toFixed(1)}
                      </span>
                      <span className="pb-0.5 text-sm text-dim">/ 5</span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-2">
                      <Stars />
                      <span className="text-[11px] text-dim" data-testid="reviews-count">
                        {g.count != null ? `${g.count} Google reviews` : "Verified listing on Google Maps"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="ml-auto flex flex-wrap gap-3">
                  <a
                    href={g.mapsUri}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink transition-colors duration-300 hover:bg-crimson hover:text-cwhite"
                    data-testid="view-reviews-btn"
                  >
                    Read all reviews
                  </a>
                  <a
                    href={g.writeUri}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-300 hover:border-crimson"
                    data-testid="review-google-btn"
                  >
                    Review us on Google
                    <ArrowUpRight size={15} className="text-crimson transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              </div>

              {hasReviews && (
                <div data-testid="google-reviews-grid">
                <StaggerGroup className="grid gap-4 md:grid-cols-2">
                  {GOOGLE_REVIEWS.map((r, i) => (
                    <motion.blockquote
                      key={r.author + i}
                      variants={staggerItem}
                      className="relative flex flex-col rounded-2xl border border-white/10 bg-surface p-6"
                      data-testid={`google-review-${i}`}
                    >
                      <Quote size={22} className="absolute right-5 top-5 text-crimson/30" aria-hidden="true" />
                      <Stars n={r.rating} size={13} />
                      <p className="mt-4 flex-1 text-sm leading-relaxed text-white/90">"{r.text}"</p>
                      <footer className="mt-5 flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-crimson font-display text-sm font-bold text-cwhite">
                          {r.author.trim().charAt(0).toUpperCase()}
                        </div>
                        <div className="leading-tight">
                          <div className="text-sm font-semibold text-white">{r.author}</div>
                          <div className="flex items-center gap-1 text-[11px] text-dim">
                            <GoogleG size={10} /> Google review{r.date ? ` · ${r.date}` : ""}
                          </div>
                        </div>
                      </footer>
                    </motion.blockquote>
                  ))}
                </StaggerGroup>
                </div>
              )}
              {g.live && <span className="text-[10px] text-dim">Rating and review count are live from Google Maps.</span>}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
