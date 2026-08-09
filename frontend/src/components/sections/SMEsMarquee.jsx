import { SME } from "@/data/content";
import { Reveal } from "@/components/Reveal";

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
        <Reveal>
          <span className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-cwhite">
            <span className="h-2 w-2 rotate-45 bg-cwhite" />
            {SME.overline}
          </span>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-cwhite/90 md:text-xl">{SME.body}</p>
        </Reveal>
      </div>
    </section>
  );
}
