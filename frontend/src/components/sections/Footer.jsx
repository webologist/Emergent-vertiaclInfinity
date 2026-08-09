import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { FOOTER } from "@/data/content";
import { scrollToId } from "@/lib/scroll";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-ink pt-20" data-testid="footer">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2.6fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="relative h-7 w-7">
                <div className="absolute inset-0 rounded-[7px] border border-white/25" />
                <div className="absolute inset-[5px] rounded-[3px] bg-crimson" />
              </div>
              <span className="font-display text-lg font-bold tracking-tight">
                Vertical<span className="text-crimson">.</span>Infinity
              </span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-dim">
              AI-enabled digital agency that moves businesses forward. Building high-performing platforms since 2003.
            </p>
            <button
              onClick={() => scrollToId("#contact")}
              className="group mt-7 flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-semibold transition-colors duration-300 hover:border-crimson"
              data-testid="footer-cta-btn"
            >
              Let's chat over coffee
              <ArrowUpRight size={15} className="text-crimson transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {FOOTER.columns.map((col) => (
              <div key={col.heading}>
                <div className="text-xs uppercase tracking-widest text-white">{col.heading}</div>
                <ul className="mt-4 space-y-3">
                  {col.links.map((l) => (
                    <li key={l}>
                      <button
                        onClick={() => scrollToId("#contact")}
                        className="text-left text-sm text-dim transition-colors duration-300 hover:text-crimson"
                        data-testid={`footer-link-${l.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`}
                      >
                        {l}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div className="mt-16 flex flex-wrap gap-3 border-t border-white/10 pt-8">
          {FOOTER.badges.map((b) => (
            <span
              key={b}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-surface px-4 py-2 text-xs text-dim"
              data-testid={`badge-${b.split(" ")[0].toLowerCase()}`}
            >
              <ShieldCheck size={13} className="text-crimson" />
              {b}
            </span>
          ))}
        </div>
      </div>

      {/* Massive brand mark */}
      <div className="mt-16 overflow-hidden border-t border-white/10">
        <div className="container-x py-10">
          <div className="select-none text-center font-display text-[16vw] font-extrabold uppercase leading-none tracking-tighter text-outline">
            Infinity
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-dim sm:flex-row">
          <span>{FOOTER.copyright}</span>
          <button className="transition-colors duration-300 hover:text-white" data-testid="footer-legal-link">Legal</button>
        </div>
      </div>
    </footer>
  );
}
