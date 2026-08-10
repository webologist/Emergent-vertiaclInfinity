import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Workflow, Boxes, RefreshCcw, ArrowRight } from "lucide-react";
import { FOCUS } from "@/data/content";
import { Reveal, StaggerGroup, staggerItem } from "@/components/Reveal";

const ICONS = { Workflow, Boxes, RefreshCcw };

export default function FocusedAreas() {
  const navigate = useNavigate();
  return (
    <section id="focus" className="relative border-t border-white/10 py-24 md:py-36" data-testid="focus-section">
      <div className="container-x">
        <Reveal>
          <div>
            <span className="overline">{FOCUS.overline}</span>
            <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tighter sm:text-5xl lg:text-6xl">
              {FOCUS.title}
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-dim md:text-base">{FOCUS.intro}</p>
          </div>
        </Reveal>

        <StaggerGroup className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">
          {FOCUS.services.map((s) => {
            const Icon = ICONS[s.icon];
            return (
              <motion.article
                key={s.no}
                variants={staggerItem}
                onClick={s.href ? () => navigate(s.href) : undefined}
                className={`group relative flex flex-col justify-between bg-surface p-8 transition-colors duration-500 hover:bg-elevated md:p-10 md:min-h-[420px] ${s.href ? "cursor-pointer" : ""}`}
                data-testid={`service-card-${s.no}`}
              >
                <div className="absolute right-8 top-8 font-display text-sm text-dim/50 transition-colors duration-300 group-hover:text-crimson">
                  / {s.no}
                </div>
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 text-white transition-colors duration-500 group-hover:border-crimson group-hover:bg-crimson">
                    <Icon size={22} strokeWidth={1.6} />
                  </div>
                  <h3 className="mt-8 font-display text-2xl font-bold tracking-tight">{s.title}</h3>
                  <p className="mt-4 text-sm leading-relaxed text-dim">{s.body}</p>
                </div>
                <div className="mt-10 flex items-center gap-2 text-sm font-semibold text-white">
                  <span className="text-dim transition-colors duration-300 group-hover:text-white">{s.href ? "Explore Product Development" : "Learn more"}</span>
                  <ArrowRight size={16} className="text-crimson transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </motion.article>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
