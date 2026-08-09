import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";
import { HERO, ASSETS } from "@/data/content";
import { scrollToId } from "@/lib/scroll";

const lineVariant = {
  hidden: { y: "110%" },
  show: (i) => ({
    y: "0%",
    transition: { duration: 1, delay: 0.4 + i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "24%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section id="top" ref={ref} className="relative min-h-[100svh] w-full overflow-hidden" data-testid="hero-section">
      {/* Parallax background */}
      <motion.div style={{ y: bgY, scale: bgScale }} className="absolute inset-0 -z-10">
        <img src={ASSETS.heroBg} alt="" className="h-full w-full object-cover object-right" draggable={false} />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/60" />
      </motion.div>

      <motion.div style={{ y: contentY, opacity: fade }} className="container-x flex min-h-[100svh] flex-col justify-center pt-28 pb-24">
        {/* Overline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-8 flex items-center gap-3"
        >
          <span className="flex h-6 items-center gap-2 rounded-full border border-crimson/40 bg-crimson/10 px-3 text-[11px] uppercase tracking-[0.25em] text-white">
            <Sparkles size={12} className="text-crimson" /> {HERO.overline}
          </span>
          <span className="hidden h-px flex-1 max-w-[120px] bg-white/15 sm:block" />
        </motion.div>

        {/* Kinetic masked headline */}
        <h1 className="font-display font-extrabold uppercase leading-[0.92] tracking-tighter text-white text-[clamp(2.7rem,10vw,8.5rem)]">
          {HERO.lines.map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <motion.span
                className={`inline-block ${line === HERO.accentWord ? "text-crimson" : ""}`}
                custom={i}
                variants={lineVariant}
                initial="hidden"
                animate="show"
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        {/* Sub + CTA */}
        <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.9 }}
            className="max-w-xl text-base leading-relaxed text-dim md:text-lg"
            data-testid="hero-sub"
          >
            {HERO.sub}
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.9 }}
            onClick={() => scrollToId(HERO.ctaHref)}
            data-testid="hero-cta-btn"
            className="group flex w-max items-center gap-3 rounded-full bg-crimson px-7 py-4 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white hover:text-ink"
          >
            {HERO.cta}
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-colors duration-300 group-hover:bg-ink/10">
              <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </motion.button>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.9 }}
          className="mt-16 grid max-w-2xl grid-cols-3 divide-x divide-white/10 border-t border-white/10 pt-6"
          data-testid="hero-stats"
        >
          {HERO.stats.map((s) => (
            <div key={s.label} className="px-4 first:pl-0">
              <div className="font-display text-3xl font-bold text-white md:text-4xl">{s.value}</div>
              <div className="mt-1 text-xs uppercase tracking-widest text-dim">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-dim md:flex"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }}>
          <ArrowDown size={16} />
        </motion.span>
      </motion.div>
    </section>
  );
}
