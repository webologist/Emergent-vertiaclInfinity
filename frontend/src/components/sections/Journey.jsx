import { JOURNEY } from "@/data/content";
import { Reveal } from "@/components/Reveal";

export default function Journey() {
  return (
    <section id="journey" className="relative border-t border-white/10 py-24 md:py-36" data-testid="journey-section">
      <div className="container-x">
        <Reveal>
          <h2 className="font-display text-4xl font-extrabold tracking-tighter sm:text-5xl lg:text-6xl">
            We, our <span className="text-crimson">Journey</span>
          </h2>
        </Reveal>

        <div className="mt-14 flex flex-col gap-8">
          {JOURNEY.chapters.map((c, i) => {
            const highlight = c.title === "Our Philosophy";
            return (
              <Reveal key={c.no} delay={i * 0.05}>
                {highlight ? (
                  <div
                    className="relative overflow-hidden rounded-2xl border border-crimson/50 bg-surface p-8 md:p-12"
                    data-testid={`journey-chapter-${c.no}`}
                  >
                    <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-crimson/15 blur-[100px]" aria-hidden="true" />
                    <h3 className="font-display text-2xl font-bold tracking-tight text-crimson md:text-3xl">{c.title}</h3>
                    <p className="mt-5 max-w-3xl font-display text-lg font-semibold leading-snug text-white md:text-xl">
                      Your growth is the true measure of our success.
                    </p>
                    <p className="mt-4 max-w-3xl text-base leading-relaxed text-dim">
                      {c.body.replace("Your growth is the true measure of our success. ", "")}
                    </p>
                  </div>
                ) : (
                  <div
                    className="border-t border-white/10 py-8 first:border-t-0 first:pt-0"
                    data-testid={`journey-chapter-${c.no}`}
                  >
                    <h3 className="font-display text-2xl font-bold tracking-tight md:text-3xl">{c.title}</h3>
                    <p className="mt-5 max-w-3xl text-base leading-relaxed text-dim">{c.body}</p>
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
