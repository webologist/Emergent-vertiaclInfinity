import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SME } from "@/data/content";
import { Reveal } from "@/components/Reveal";
import { ShootingStars } from "@/components/ShootingStars";

const BUBBLE_PHRASES = [
  "Lets Talk",
  "Get in touch",
  "Chai pe chale?",
  "Lets chat",
  "Baat karte hai",
  "Areee ho jayega",
];

export default function SMEsMarquee() {
  const [activeTag, setActiveTag] = useState(null);
  const [phrase, setPhrase] = useState("");

  const handleTagClick = useCallback((tag) => {
    const next = BUBBLE_PHRASES[Math.floor(Math.random() * BUBBLE_PHRASES.length)];
    setPhrase(next);
    setActiveTag((prev) => (prev === tag ? null : tag));
  }, []);

  return (
    <section
      id="sme"
      className="relative overflow-hidden border-t border-cwhite/15 bg-crimson py-24 text-cwhite transition-colors duration-500 dark:bg-[#8F121F] md:py-32"
      data-testid="sme-section"
    >
      <ShootingStars count={9} />
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[28rem] w-[28rem] rounded-full bg-cwhite/10 blur-[150px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-black/25 blur-[130px]" aria-hidden="true" />
      <div className="container-x relative">
        <Reveal>
          <h2
            className="flex items-center gap-4 font-display text-4xl font-extrabold tracking-tighter text-cwhite sm:text-5xl lg:text-6xl"
            data-testid="sme-heading"
          >
            <span className="h-3 w-3 shrink-0 rotate-45 bg-cwhite/70" aria-hidden="true" />
            {SME.overline}
          </h2>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-cwhite/90 md:text-xl">{SME.body}</p>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="mt-10 flex flex-wrap gap-3" data-testid="sme-tags-row">
            {SME.tags.map((tag) => {
              const slug = tag.toLowerCase().replace(/\s+/g, "-");
              const isActive = activeTag === tag;
              return (
                <div key={tag} className="relative">
                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        key={phrase}
                        initial={{ opacity: 0, y: 8, scale: 0.7 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.8 }}
                        transition={{ type: "spring", stiffness: 500, damping: 22 }}
                        className="absolute bottom-full left-1/2 z-20 mb-3 -translate-x-1/2 whitespace-nowrap"
                        data-testid={`sme-tag-bubble-${slug}`}
                      >
                        <span className="relative block rounded-2xl bg-cwhite px-4 py-2 text-sm font-bold text-crimson shadow-xl">
                          {phrase}
                          <span
                            className="absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-cwhite"
                            aria-hidden="true"
                          />
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <button
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    data-testid={`sme-tag-${slug}`}
                    className={`rounded-full border px-5 py-2 text-xs font-medium uppercase tracking-[0.15em] backdrop-blur-sm transition-colors duration-300 ${
                      isActive
                        ? "border-cwhite bg-cwhite text-crimson"
                        : "border-cwhite/40 bg-cwhite/10 text-cwhite hover:bg-cwhite hover:text-crimson"
                    }`}
                  >
                    {tag}
                  </button>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
