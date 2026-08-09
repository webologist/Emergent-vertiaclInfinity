import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Quote, Star, ArrowUpRight } from "lucide-react";
import { GROWTH } from "@/data/content";
import { Reveal, StaggerGroup, staggerItem } from "@/components/Reveal";

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
  const topReview = rev?.live && rev.reviews?.length ? rev.reviews[0] : null;

  return (
    <section id="growth" className="relative border-t border-white/10 py-24 md:py-36" data-testid="growth-section">
      <div className="container-x">
        <Reveal>
          <span className="overline">{GROWTH.overline}</span>
        </Reveal>

        {/* Testimonials */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {GROWTH.quotes.map((q, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <figure className="relative flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-surface p-8 transition-colors duration-500 hover:border-crimson/40 md:p-10">
                <Quote className="text-crimson" size={30} strokeWidth={1.4} />
                <blockquote className="mt-6 font-display text-xl font-medium leading-snug tracking-tight text-white md:text-2xl">
                  "{q.text}"
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-3 border-t border-white/10 pt-6">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-white/20 to-white/5" />
                  <div>
                    <div className="text-sm font-semibold text-white">{q.author}</div>
                    <div className="text-xs text-dim">{q.role}</div>
                  </div>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>

        {/* Clients + reviews */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <Reveal>
            <div className="h-full rounded-2xl border border-white/10 bg-surface p-8 md:p-10">
              <p className="text-sm text-dim">Trusted by teams that ship.</p>
              <StaggerGroup className="mt-8 grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-4">
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
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-elevated p-8 md:p-10" data-testid="google-reviews-card">
              <div className="flex items-center gap-3">
                <GoogleG />
                <span className="font-display text-lg font-bold">Google Reviews</span>
              </div>
              <div className="mt-6 flex items-end gap-3">
                <span className="font-display text-6xl font-extrabold leading-none" data-testid="reviews-rating">{Number(rating).toFixed(1)}</span>
                <div className="mb-1.5">
                  <div className="flex gap-0.5 text-crimson">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
                    ))}
                  </div>
                  <div className="mt-1 text-xs text-dim" data-testid="reviews-count">
                    {rev?.live && rev.review_count != null ? `${rev.review_count} Google reviews` : "Verified listing on Google Maps"}
                  </div>
                </div>
              </div>
              {topReview && (
                <figure className="mt-6 border-t border-white/10 pt-5" data-testid="reviews-top-review">
                  <blockquote className="text-sm leading-relaxed text-dim">
                    "{topReview.text.length > 150 ? `${topReview.text.slice(0, 150)}…` : topReview.text}"
                  </blockquote>
                  <figcaption className="mt-2 flex items-center gap-2 text-xs text-white">
                    {topReview.author_photo_uri && (
                      <img src={topReview.author_photo_uri} alt="" className="h-5 w-5 rounded-full" loading="lazy" />
                    )}
                    {topReview.author} · {topReview.rating}/5
                  </figcaption>
                </figure>
              )}
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
