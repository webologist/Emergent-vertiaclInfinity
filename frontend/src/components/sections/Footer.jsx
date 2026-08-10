import { ArrowUpRight, Star } from "lucide-react";
import { toast } from "sonner";
import { FOOTER } from "@/data/content";
import { scrollToId } from "@/lib/scroll";
import { Logo } from "@/components/Logo";

const DEST = {
  "Our Focused Areas": "#focus",
  "Power For SMEs": "#sme",
  "Drivers of our Growth": "#growth",
  "Who we are": "#journey",
  "Platform Modernization": "#focus",
  "Product Engineering": "#focus",
  "AI & Automation": "#focus",
  "Experience Design": "#focus",
  "Digital Commerce": "#focus",
  "Sitemap": "#top",
};
const destFor = (l) => DEST[l] || "#contact";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-ink pt-20" data-testid="footer">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2.6fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <Logo size={30} />
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
            <a
              href="https://search.google.com/local/writereview?placeid=ChIJ910PJ2Cx5zsRhxiWfmuJSgw"
              target="_blank"
              rel="noreferrer"
              className="group mt-4 flex w-max items-center gap-2 text-sm text-dim transition-colors duration-300 hover:text-crimson"
              data-testid="footer-review-nudge"
            >
              <Star size={14} className="text-crimson" fill="currentColor" strokeWidth={0} />
              Loved working with us?{" "}
              <span className="font-semibold text-white underline decoration-crimson/50 underline-offset-4 transition-colors duration-300 group-hover:text-crimson">
                Leave us a review
              </span>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {FOOTER.columns.map((col) => (
              <div key={col.heading}>
                <div className="text-xs uppercase tracking-widest text-white">{col.heading}</div>
                <ul className="mt-4 space-y-3">
                  {col.links.map((l) => (
                    <li key={l}>
                      <button
                        onClick={() => scrollToId(destFor(l))}
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
        <div className="mt-16 flex flex-wrap items-center gap-4 border-t border-white/10 pt-8">
          {FOOTER.badges.map((b) => (
            <div
              key={b.name}
              className="flex h-16 items-center justify-center rounded-lg bg-cwhite px-4 py-2"
              data-testid={`badge-${b.name.split(" ")[0].toLowerCase().replace(/[^a-z0-9]/g, "")}`}
            >
              <img src={b.logo} alt={b.name} className="h-full w-auto max-w-[130px] object-contain" loading="lazy" />
            </div>
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
          <button className="transition-colors duration-300 hover:text-white" data-testid="footer-legal-link" onClick={() => toast("Legal & Privacy — full policy pages coming soon.")}>Legal</button>
        </div>
      </div>
    </footer>
  );
}
