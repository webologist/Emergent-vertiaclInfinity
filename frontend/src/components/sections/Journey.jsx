import { JOURNEY } from "@/data/content";
import { Reveal } from "@/components/Reveal";

export default function Journey() {
  return (
    <section id="journey" className="relative border-t border-white/10 py-24 md:py-36" data-testid="journey-section">
      <div className="container-x grid gap-14 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Sticky side */}
        <div className="lg:sticky lg:top-28 lg:h-max">
          <Reveal>
            <span className="overline">{JOURNEY.overline}</span>
            <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tighter sm:text-5xl lg:text-6xl">
              A quarter century<br />of <span className="text-crimson">momentum.</span>
            </h2>
          </Reveal>
        </div>

        {/* Chapters */}
        <div className="flex flex-col gap-6">
          {JOURNEY.chapters.map((c, i) => {
            const highlight = c.title === "Our Philosophy";
            return (
              <Reveal key={c.no} delay={i * 0.05}>
                {highlight ? (
                  <div
                    className="relative overflow-hidden rounded-2xl border border-crimson/50 bg-surface p-8 md:p-10"
                    data-testid={`journey-chapter-${c.no}`}
                  >
                    <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-crimson/15 blur-[90px]" aria-hidden="true" />
                    <div className="flex items-baseline gap-5">
                      <span className="font-display text-sm font-bold text-crimson">{c.no}</span>
                      <h3 className="font-display text-2xl font-bold tracking-tight text-crimson md:text-3xl">{c.title}</h3>
                    </div>
                    <p className="mt-5 font-display text-lg font-semibold leading-snug text-white md:text-xl">
                      Your growth is the true measure of our success.
                    </p>
                    <p className="mt-4 max-w-xl text-base leading-relaxed text-dim">
                      {c.body.replace("Your growth is the true measure of our success. ", "")}
                    </p>
                  </div>
                ) : (
                  <div
                    className="group border-t border-white/10 px-1 py-8 first:border-t-0"
                    data-testid={`journey-chapter-${c.no}`}
                  >
                    <div className="flex items-baseline gap-5">
                      <span className="font-display text-sm font-bold text-crimson">{c.no}</span>
                      <h3 className="font-display text-2xl font-bold tracking-tight md:text-3xl">{c.title}</h3>
                    </div>
                    <p className="mt-5 max-w-xl text-base leading-relaxed text-dim">{c.body}</p>
                  </div>
                )}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
