import { useState, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { SME } from "@/data/content";
import { Reveal } from "@/components/Reveal";
import { ShootingStars } from "@/components/ShootingStars";
import { scrollToId } from "@/lib/scroll";

const BUBBLE_PHRASES = [
  "Lets Talk",
  "Get in touch",
  "Chai pe chale?",
  "Lets chat",
  "Baat karte hai",
  "Areee ho jayega",
];

// Pills that navigate to a dedicated page instead of showing a bubble.
const TAG_LINKS = {
  "Project Development": "/product-development",
};

// Soft "pop" using the Web Audio API — no asset needed.
function playPop() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(420, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.09);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.22);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.24);
    osc.onended = () => ctx.close();
  } catch (e) {
    /* audio not available — silently ignore */
  }
}

export default function SMEsMarquee() {
  const [activeTag, setActiveTag] = useState(null);
  const [phrase, setPhrase] = useState("");
  const dismissTimer = useRef(null);
  const navigate = useNavigate();

  useEffect(() => () => clearTimeout(dismissTimer.current), []);

  const handleTagClick = useCallback((tag) => {
    if (TAG_LINKS[tag]) {
      navigate(TAG_LINKS[tag]);
      return;
    }
    clearTimeout(dismissTimer.current);
    setActiveTag((prev) => {
      if (prev === tag) return null;
      const next = BUBBLE_PHRASES[Math.floor(Math.random() * BUBBLE_PHRASES.length)];
      setPhrase(next);
      playPop();
      dismissTimer.current = setTimeout(() => setActiveTag(null), 2600);
      return tag;
    });
  }, [navigate]);

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
                      <motion.button
                        type="button"
                        key={phrase}
                        onClick={() => scrollToId("#contact")}
                        initial={{ opacity: 0, y: 12, scale: 0.6 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.7 }}
                        transition={{ type: "spring", stiffness: 480, damping: 20 }}
                        className="group absolute bottom-full left-1/2 z-30 mb-4 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-2xl bg-cwhite px-6 py-3.5 text-lg font-extrabold text-crimson shadow-2xl ring-2 ring-crimson/10 transition-transform duration-200 hover:scale-105 sm:text-xl"
                        data-testid={`sme-tag-bubble-${slug}`}
                        aria-label={`${phrase} — go to contact form`}
                      >
                        {phrase}
                        <MessageCircle size={20} className="text-crimson transition-transform duration-200 group-hover:translate-x-0.5" />
                        <span
                          className="absolute left-1/2 top-full h-4 w-4 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-cwhite"
                          aria-hidden="true"
                        />
                      </motion.button>
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
