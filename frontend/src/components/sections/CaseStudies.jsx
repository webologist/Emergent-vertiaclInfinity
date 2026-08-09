import { CASE_STUDIES } from "@/data/content";
import { Reveal } from "@/components/Reveal";

const CaseRow = ({ cs, flip }) => (
  <article
    className="grid items-center gap-8 lg:grid-cols-2 lg:gap-14"
    data-testid={`case-study-${cs.no}`}
  >
    <div className={`group overflow-hidden rounded-2xl border border-white/10 bg-surface ${flip ? "lg:order-2" : ""}`}>
      <img
        src={cs.img}
        alt={`${cs.client} — ${cs.title}`}
        loading="lazy"
        className="aspect-[3/2] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      />
    </div>
    <div className={flip ? "lg:order-1" : ""}>
      <div className="flex items-center gap-3 text-xs uppercase tracking-widest">
        <span className="font-display font-bold text-crimson">{cs.no}</span>
        <span className="h-px w-8 bg-white/20" />
        <span className="text-dim">{cs.client}</span>
      </div>
      <h3 className="mt-5 font-display text-2xl font-bold leading-tight tracking-tight md:text-3xl">
        {cs.title}
      </h3>
      <p className="mt-4 text-sm leading-relaxed text-dim md:text-base">{cs.body}</p>
      <div className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-6">
        {cs.stats.map((s) => (
          <div key={s.label}>
            <div className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">{s.value}</div>
            <div className="mt-1 text-xs leading-snug text-dim">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        {cs.tags.map((t) => (
          <span key={t} className="rounded-full border border-white/10 bg-surface px-3.5 py-1.5 text-xs text-dim">
            {t}
          </span>
        ))}
      </div>
    </div>
  </article>
);

export default function CaseStudies() {
  return (
    <section id="work" className="relative border-t border-white/10 py-24 md:py-36" data-testid="case-studies-section">
      <div className="container-x">
        <Reveal>
          <span className="overline">{CASE_STUDIES.overline}</span>
        </Reveal>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <Reveal delay={0.05}>
            <h2 className="font-display text-4xl font-extrabold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
              {CASE_STUDIES.title.split(" ").map((w, i) =>
                w === "promises." ? (
                  <span key={i} className="text-crimson">{w}</span>
                ) : (
                  <span key={i}>{w} </span>
                )
              )}
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="max-w-md text-sm leading-relaxed text-dim md:text-base">{CASE_STUDIES.intro}</p>
          </Reveal>
        </div>

        <div className="mt-16 space-y-20 md:mt-24 md:space-y-28">
          {CASE_STUDIES.items.map((cs, i) => (
            <Reveal key={cs.no}>
              <CaseRow cs={cs} flip={i % 2 === 1} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
