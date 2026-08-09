import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { JOURNEY, ASSETS } from "@/data/content";
import { Reveal } from "@/components/Reveal";

export default function Journey() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section id="journey" ref={ref} className="relative border-t border-white/10 py-24 md:py-36" data-testid="journey-section">
      <div className="container-x grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Sticky side */}
        <div className="lg:sticky lg:top-28 lg:h-max">
          <Reveal>
            <span className="overline">{JOURNEY.overline}</span>
            <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tighter sm:text-5xl lg:text-6xl">
              A quarter century<br />of <span className="text-crimson">momentum.</span>
            </h2>
          </Reveal>
          <div className="mt-10 overflow-hidden rounded-2xl border border-white/10">
            <motion.img
              style={{ y: imgY, scale: 1.2 }}
              src={ASSETS.crimson}
              alt="Vertical Infinity signature form"
              className="aspect-[4/3] w-full object-cover"
              draggable={false}
            />
          </div>
        </div>

        {/* Chapters */}
        <div className="flex flex-col">
          {JOURNEY.chapters.map((c, i) => (
            <Reveal key={c.no} delay={i * 0.05}>
              <div
                className="group border-t border-white/10 py-10 first:border-t-0 first:pt-0"
                data-testid={`journey-chapter-${c.no}`}
              >
                <div className="flex items-baseline gap-5">
                  <span className="font-display text-sm font-bold text-crimson">{c.no}</span>
                  <h3 className="font-display text-2xl font-bold tracking-tight md:text-3xl">{c.title}</h3>
                </div>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-dim">{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
