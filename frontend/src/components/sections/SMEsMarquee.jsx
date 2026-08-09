import { SME } from "@/data/content";
import { Reveal } from "@/components/Reveal";

const MarqueeRow = ({ reverse }) => (
  <div className="flex select-none overflow-hidden py-2" aria-hidden="true">
    <div className={`flex shrink-0 items-center gap-8 pr-8 ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}>
      {[...SME.tags, ...SME.tags].map((t, i) => (
        <span key={i} className="flex items-center gap-8">
          <span className="font-display text-5xl font-extrabold uppercase tracking-tighter text-outline sm:text-7xl md:text-8xl">
            {t}
          </span>
          <span className="h-3 w-3 rotate-45 bg-crimson" />
        </span>
      ))}
    </div>
  </div>
);

export default function SMEsMarquee() {
  return (
    <section className="relative overflow-hidden border-t border-white/10 py-24 md:py-32" data-testid="sme-section">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <span className="overline">{SME.overline}</span>
            <p className="mt-6 text-lg leading-relaxed text-white/90 md:text-xl">{SME.body}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              {SME.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-dim transition-colors duration-300 hover:border-crimson hover:text-white"
                  data-testid={`sme-tag-${t.split(" ")[0].toLowerCase()}`}
                >
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      <div className="mt-16 flex flex-col gap-2 border-y border-white/10 py-6">
        <MarqueeRow />
        <MarqueeRow reverse />
      </div>
    </section>
  );
}
