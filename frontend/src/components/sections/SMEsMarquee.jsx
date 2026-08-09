import { SME } from "@/data/content";
import { Reveal } from "@/components/Reveal";

const MarqueeRow = ({ reverse, strong }) => (
  <div className="flex select-none overflow-hidden py-2" aria-hidden="true">
    <div className={`flex shrink-0 items-center gap-8 pr-8 ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}>
      {[...SME.tags, ...SME.tags].map((t, i) => (
        <span key={i} className="flex items-center gap-8">
          <span className={`font-display text-5xl font-extrabold uppercase tracking-tighter sm:text-7xl md:text-8xl ${strong ? "text-outline-white" : "text-outline-white-soft"}`}>
            {t}
          </span>
          <span className="h-3 w-3 rotate-45 bg-cwhite" />
        </span>
      ))}
    </div>
  </div>
);

export default function SMEsMarquee() {
  return (
    <section
      id="sme"
      className="relative overflow-hidden border-t border-cwhite/15 bg-crimson py-24 text-cwhite transition-colors duration-500 dark:bg-[#8F121F] md:py-32"
      data-testid="sme-section"
    >
      <div className="pointer-events-none absolute -left-40 top-1/3 h-[28rem] w-[28rem] rounded-full bg-cwhite/10 blur-[150px]" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-black/25 blur-[130px]" aria-hidden="true" />
      <div className="container-x relative">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <span className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-cwhite">
              <span className="h-2 w-2 rotate-45 bg-cwhite" />
              {SME.overline}
            </span>
            <p className="mt-6 text-lg leading-relaxed text-cwhite/90 md:text-xl">{SME.body}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              {SME.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-cwhite/30 px-5 py-2.5 text-sm text-cwhite/80 transition-colors duration-300 hover:border-cwhite hover:bg-cwhite hover:text-crimson"
                  data-testid={`sme-tag-${t.split(" ")[0].toLowerCase()}`}
                >
                  {t}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      <div className="relative mt-16 flex flex-col gap-2 border-y border-cwhite/20 py-6">
        <MarqueeRow />
        <MarqueeRow reverse strong />
      </div>
    </section>
  );
}
