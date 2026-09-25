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
          <div className="border-t border-white/10 py-8 md:border-t-0 md:pt-0" data-testid="journey-chapter-01">
            <Reveal>
              <h3 className="font-display text-2xl font-bold tracking-tight md:text-3xl">{JOURNEY.chapters[0].title}</h3>
            </Reveal>

            <Reveal delay={0.05}>
              <div
                className="relative mb-6 mt-5 w-full overflow-hidden rounded-2xl border border-crimson/50 bg-surface p-8 md:float-right md:ml-10 md:mt-1 md:w-[360px] md:p-9"
                data-testid="journey-chapter-02"
              >
                <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-crimson/15 blur-[100px]" aria-hidden="true" />
                <h3 className="font-display text-2xl font-bold tracking-tight text-crimson md:text-3xl">{JOURNEY.chapters[1].title}</h3>
                <p className="mt-5 font-display text-lg font-semibold leading-snug text-white md:text-xl">
                  Your growth is the true measure of our success.
                </p>
                <p className="mt-4 text-base leading-relaxed text-dim">
                  {JOURNEY.chapters[1].body.replace("Your growth is the true measure of our success. ", "")}
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-dim">
                {JOURNEY.chapters[0].body.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </div>
            </Reveal>
            <div className="clear-both" />
          </div>

          <Reveal delay={0.1}>
            <div className="py-8" data-testid="journey-chapter-03">
              <h3 className="font-display text-2xl font-bold tracking-tight md:text-3xl">{JOURNEY.chapters[2].title}</h3>
              <p className="mt-5 w-full text-base leading-relaxed text-dim">{JOURNEY.chapters[2].body}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
