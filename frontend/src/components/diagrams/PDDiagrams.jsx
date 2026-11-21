import { motion } from "framer-motion";
import { Compass, PenTool, Code2, Rocket, TrendingUp, ArrowRight } from "lucide-react";

const DEFAULT_STEPS = [
  { icon: Compass, title: "Discover", desc: "We map your goals, users and constraints, then agree on a clear, budget-aware scope." },
  { icon: PenTool, title: "Design", desc: "Wireframes and interface design you can see and feel — no surprises later." },
  { icon: Code2, title: "Build", desc: "We engineer in small, visible steps. You watch it come to life every week." },
  { icon: Rocket, title: "Launch", desc: "We ship carefully, test everything and hand you full ownership of the code." },
  { icon: TrendingUp, title: "Scale", desc: "Launch day is the baseline. We stay on to refine, grow and support your platform." },
];

// Animated end-to-end journey flow — configurable steps.
export function ProcessFlow({ steps = DEFAULT_STEPS }) {
  const cols = steps.length;
  return (
    <div className="relative" data-testid="process-flow-diagram">
      {/* Desktop: horizontal flow */}
      <div className="relative hidden md:block">
        <div className="absolute left-0 right-0 top-9 mx-[10%] h-[3px] overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "left" }}
            className="h-full w-full bg-gradient-to-r from-crimson via-crimson to-crimson/40"
          />
        </div>
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center text-center"
            >
              <div className="relative z-10 flex h-[72px] w-[72px] items-center justify-center rounded-2xl border border-crimson/40 bg-surface shadow-lg shadow-crimson/10">
                <s.icon size={28} className="text-crimson" strokeWidth={1.7} />
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-crimson font-display text-xs font-bold text-cwhite">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-5 font-display text-lg font-bold tracking-tight">{s.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-dim">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile: vertical flow */}
      <div className="relative md:hidden">
        <div className="absolute bottom-6 left-[35px] top-6 w-[3px] overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "top" }}
            className="h-full w-full bg-gradient-to-b from-crimson via-crimson to-crimson/40"
          />
        </div>
        <div className="space-y-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="flex items-start gap-5"
            >
              <div className="relative z-10 flex h-[70px] w-[70px] shrink-0 items-center justify-center rounded-2xl border border-crimson/40 bg-surface">
                <s.icon size={26} className="text-crimson" strokeWidth={1.7} />
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-crimson font-display text-xs font-bold text-cwhite">
                  {i + 1}
                </span>
              </div>
              <div className="pt-1">
                <h3 className="font-display text-lg font-bold tracking-tight">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-dim">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Generic animated bar-ladder diagram.
export function LadderDiagram({ tiers, caption, testid = "ladder-diagram" }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-surface p-8 md:p-10" data-testid={testid}>
      <div className="flex items-end justify-between gap-4" style={{ height: 220 }}>
        {tiers.map((t, i) => (
          <div key={t.label} className="flex h-full flex-1 flex-col items-center justify-end">
            <motion.div
              initial={{ height: 0, opacity: 0.4 }}
              whileInView={{ height: `${t.h}%`, opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, delay: 0.2 + i * 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-[110px] rounded-t-xl bg-gradient-to-t from-crimson/60 to-crimson"
            />
            <div className="mt-4 text-center">
              <div className="font-display text-sm font-bold">{t.label}</div>
              <div className="mt-1 text-[11px] leading-tight text-dim">{t.note}</div>
            </div>
          </div>
        ))}
      </div>
      {caption && <p className="mt-8 text-center text-sm text-dim">{caption}</p>}
    </div>
  );
}

const BUDGET_TIERS = [
  { label: "Starter", h: 42, note: "Lean MVP to validate fast" },
  { label: "Growth", h: 74, note: "Full product, more features" },
  { label: "Scale", h: 100, note: "Enterprise-grade platform" },
];
export function BudgetLadder() {
  return (
    <LadderDiagram
      tiers={BUDGET_TIERS}
      caption="Start where your budget is today — every tier is a real, working product you can grow from."
      testid="budget-ladder-diagram"
    />
  );
}

// Before → After comparison diagram (great for automation).
export function BeforeAfter({ before, after, beforeTitle = "Before", afterTitle = "After" }) {
  return (
    <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]" data-testid="before-after-diagram">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6 }}
        className="rounded-2xl border border-white/10 bg-surface p-6"
      >
        <div className="text-xs font-semibold uppercase tracking-widest text-dim">{beforeTitle}</div>
        <ul className="mt-4 space-y-3">
          {before.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-dim">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-dim/60" />
              {b}
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-crimson text-cwhite md:rotate-0"
      >
        <ArrowRight size={20} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="rounded-2xl border border-crimson/40 bg-surface p-6 shadow-lg shadow-crimson/10"
      >
        <div className="text-xs font-semibold uppercase tracking-widest text-crimson">{afterTitle}</div>
        <ul className="mt-4 space-y-3">
          {after.map((a) => (
            <li key={a} className="flex items-start gap-2 text-sm text-white">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-crimson" />
              {a}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
