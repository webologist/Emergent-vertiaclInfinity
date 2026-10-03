import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowLeft, RotateCcw, Check, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { scrollToId } from "@/lib/scroll";
import { SERVICE_INDEX as SERVICE_INDEX_DEFAULT, RELATED_SERVICES } from "@/data/services";
import { SITUATIONS as SITUATIONS_DEFAULT, PRIORITIES as PRIORITIES_DEFAULT } from "@/data/serviceHelper";
import { useContent } from "@/cms/CmsContext";

const slide = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, x: -24, transition: { duration: 0.2 } },
};

const Chip = ({ active, onClick, children, testId }) => (
  <button
    type="button"
    onClick={onClick}
    data-testid={testId}
    className={`group flex items-center justify-between gap-3 rounded-2xl border px-5 py-4 text-left text-sm font-medium transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 ${
      active ? "border-crimson bg-crimson text-cwhite" : "border-white/10 bg-surface text-white hover:border-crimson"
    }`}
  >
    <span>{children}</span>
    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${active ? "border-cwhite/40" : "border-white/15 text-transparent group-hover:text-crimson"}`}>
      <Check size={12} strokeWidth={3} />
    </span>
  </button>
);

function Result({ situation, priority, onReset }) {
  const SERVICE_INDEX = useContent("services", SERVICE_INDEX_DEFAULT);
  const primary = SERVICE_INDEX[situation.service];
  const secondary = SERVICE_INDEX[RELATED_SERVICES[situation.service][0]];
  return (
    <motion.div key="result" {...slide} className="grid gap-6 lg:grid-cols-[1.2fr_1fr]" data-testid="service-finder-result">
      <div className="rounded-2xl border border-crimson/40 bg-surface p-7 md:p-9">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-crimson">Our recommendation</span>
        <div className="mt-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-crimson text-cwhite">
            <primary.icon size={22} strokeWidth={1.7} />
          </div>
          <h3 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl" data-testid="service-finder-primary">{primary.name}</h3>
        </div>
        <p className="mt-5 text-base leading-relaxed text-white/85">{situation.why}</p>
        <p className="mt-3 text-sm leading-relaxed text-dim">
          <span className="font-semibold text-white">Because you care about {priority.label.toLowerCase()}:</span> {priority.note}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to={primary.path}
            className="group inline-flex items-center gap-2 rounded-full bg-crimson px-6 py-3 text-sm font-semibold text-cwhite transition-colors duration-300 hover:bg-ink hover:text-white"
            data-testid="service-finder-primary-link"
          >
            Explore {primary.name}
            <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
          <button
            type="button"
            onClick={() => scrollToId("contact")}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:border-crimson"
            data-testid="service-finder-contact-btn"
          >
            <MessageCircle size={15} className="text-crimson" /> Talk it through with us
          </button>
        </div>
      </div>
      <div className="flex flex-col justify-between gap-6">
        <Link
          to={secondary.path}
          className="group flex flex-col rounded-2xl border border-white/10 bg-elevated p-7 transition-[border-color] duration-300 hover:border-crimson"
          data-testid="service-finder-secondary-link"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-dim">Often paired with</span>
          <div className="mt-4 flex items-center gap-3">
            <secondary.icon size={20} strokeWidth={1.7} className="text-crimson" />
            <span className="font-display text-lg font-bold">{secondary.name}</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-dim">{secondary.blurb}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-crimson">
            Explore <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </Link>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 self-start text-sm text-dim transition-colors hover:text-crimson"
          data-testid="service-finder-reset-btn"
        >
          <RotateCcw size={14} /> Start over
        </button>
      </div>
    </motion.div>
  );
}

export default function ServiceFinder() {
  const finder = useContent("finder", { situations: SITUATIONS_DEFAULT, priorities: PRIORITIES_DEFAULT });
  const SITUATIONS = finder.situations;
  const PRIORITIES = finder.priorities;
  const [situation, setSituation] = useState(null);
  const [priority, setPriority] = useState(null);
  const step = !situation ? 1 : !priority ? 2 : 3;

  const pick = (p) => {
    setPriority(p);
    const payload = { situation: situation.id, priority: p.id, service: situation.service };
    if (typeof window.gtag === "function") window.gtag("event", "service_finder_result", payload);
    fetch(`${process.env.REACT_APP_BACKEND_URL || ""}/api/finder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  };
  const reset = () => {
    setSituation(null);
    setPriority(null);
  };

  return (
    <section id="finder" className="relative border-t border-white/10 py-24 md:py-32" data-testid="service-finder-section">
      <div className="container-x">
        <Reveal>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="overline">Not sure where to start?</span>
              <h2 className="mt-4 font-display text-4xl font-extrabold tracking-tighter sm:text-5xl lg:text-6xl">
                Which service do <span className="text-crimson">I</span> need?
              </h2>
              <p className="mt-4 max-w-xl text-base text-dim">Answer two quick questions and we'll point you to the right page — no email required.</p>
            </div>
            <ol className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-dim" aria-label="Progress" data-testid="service-finder-progress">
              {[1, 2, 3].map((n) => (
                <li key={n} className="flex items-center gap-2">
                  <span className={`flex h-7 w-7 items-center justify-center rounded-full border text-[11px] transition-colors duration-300 ${step >= n ? "border-crimson bg-crimson text-cwhite" : "border-white/15"}`}>{n}</span>
                  {n < 3 && <span className={`h-px w-6 ${step > n ? "bg-crimson" : "bg-white/15"}`} />}
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        <div className="mt-12 min-h-[320px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="s1" {...slide}>
                <p className="mb-5 text-sm font-semibold uppercase tracking-widest text-dim">1 · What best describes your situation?</p>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {SITUATIONS.map((s) => (
                    <Chip key={s.id} onClick={() => setSituation(s)} testId={`finder-situation-${s.id}`}>{s.label}</Chip>
                  ))}
                </div>
              </motion.div>
            )}
            {step === 2 && (
              <motion.div key="s2" {...slide}>
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm font-semibold uppercase tracking-widest text-dim">2 · What matters most right now?</p>
                  <button type="button" onClick={() => setSituation(null)} className="inline-flex items-center gap-1.5 text-sm text-dim transition-colors hover:text-crimson" data-testid="service-finder-back-btn">
                    <ArrowLeft size={14} /> Back
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {PRIORITIES.map((p) => (
                    <Chip key={p.id} onClick={() => pick(p)} testId={`finder-priority-${p.id}`}>{p.label}</Chip>
                  ))}
                </div>
              </motion.div>
            )}
            {step === 3 && <Result situation={situation} priority={priority} onReset={reset} />}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
