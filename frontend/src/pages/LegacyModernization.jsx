import {
  Stethoscope, ShieldCheck, Hammer, MoveRight,
  ShieldAlert, Gauge, Wallet, Lock, Rocket, HeartPulse,
} from "lucide-react";
import ServicePage from "@/pages/ServicePage";
import { LadderDiagram } from "@/components/diagrams/PDDiagrams";

const PHASES = [
  { label: "Assess", h: 30, note: "Find the real risks first" },
  { label: "Stabilize", h: 58, note: "Patch what's urgent, safely" },
  { label: "Rebuild", h: 82, note: "Modernize piece by piece" },
  { label: "Scale", h: 100, note: "Future-ready platform" },
];

const config = {
  slug: "legacy-modernization",
  path: "/legacy-modernization",
  breadcrumb: "Legacy Modernization",
  title: "Legacy Modernization Services | Vertical Infinity — Update Safely, Without Downtime",
  metaDescription:
    "Vertical Infinity modernizes outdated software safely — pinpointing risks, patching what's urgent and rebuilding step-by-step without breaking daily operations. Transparent, budget-aware, since 2003.",
  ogTitle: "Legacy Modernization Services | Vertical Infinity",
  ogDescription: "Outdated software slowing you down? We modernize it safely, one careful step at a time — no downtime, no drama.",
  jsonLdServiceType: "Legacy Software Modernization",
  hero: {
    overline: "What we build",
    titleParts: [
      { text: "Modernize your legacy software — " },
      { text: "safely, without the downtime", accent: true },
      { text: "." },
    ],
    sub: "Outdated software makes your business slower and more vulnerable — but ripping it out overnight is risky and expensive. We inspect your stack, fix what's urgent, and rebuild step-by-step while everything keeps running. You get a modern, secure platform without betting the business on a big-bang rewrite.",
    primaryCta: "Assess my system",
  },
  values: {
    overline: "Why it's low-risk",
    title: "Update with confidence, not crossed fingers.",
    items: [
      { icon: ShieldAlert, title: "Risks found first", body: "We audit your stack to see exactly what's fragile, insecure or holding you back." },
      { icon: Lock, title: "Security shored up", body: "We close the gaps that make old software a liability — data, access and compliance." },
      { icon: Gauge, title: "No downtime", body: "We modernize in safe stages alongside your live system, so operations never stop." },
      { icon: Wallet, title: "Spend where it counts", body: "We fix what matters most first, so your budget goes to the highest-impact work." },
    ],
  },
  process: {
    overline: "The journey",
    title: "A safe path — Assess to Scale.",
    intro: "No reckless rewrites. We modernize in careful, reversible steps so your business keeps running the whole way.",
    cta: "Plan my modernization",
    steps: [
      { icon: Stethoscope, title: "Assess", desc: "We inspect your code, data and infrastructure to pinpoint risks and quick wins." },
      { icon: ShieldCheck, title: "Stabilize", desc: "We patch the urgent security and reliability issues so you're safe right now." },
      { icon: Hammer, title: "Rebuild", desc: "We modernize component by component — testable, reversible, no big-bang risk." },
      { icon: MoveRight, title: "Scale", desc: "We migrate fully to a modern, maintainable platform ready for what's next." },
    ],
  },
  highlight: {
    overline: "Step-by-step, not big-bang",
    title: "We reduce risk before we add features.",
    body: "The biggest danger with legacy systems is rushing a full rewrite. Instead, we lower your risk first — securing and stabilizing what you have — then rebuild in small, reversible steps. Each phase leaves you better off than before, and you keep control of the pace and the spend.",
    bullets: ["Keep running while we modernize", "Every step is testable and reversible", "Full ownership of the new codebase"],
    cta: "Get a modernization plan",
    diagram: (
      <LadderDiagram
        tiers={PHASES}
        caption="Each phase lowers risk and raises capability — you decide how far and how fast to go."
        testid="modernization-ladder-diagram"
      />
    ),
  },
  outcomes: {
    overline: "What you get",
    title: "A platform you can trust again.",
    items: [
      { icon: HeartPulse, title: "Stable & secure", body: "No more midnight outages or security scares — a system that behaves and protects your data." },
      { icon: Rocket, title: "Faster to change", body: "Modern foundations mean new features and fixes ship in days, not painful months." },
      { icon: Wallet, title: "Cheaper to run", body: "Retire brittle, costly infrastructure and cut the tax of maintaining ageing software." },
    ],
  },
  faqs: [
    { q: "Do I have to rebuild everything at once?", a: "No — and we'd advise against it. We modernize in small, reversible phases so your system keeps running. Each step reduces risk and adds value on its own, and you control the pace." },
    { q: "Will my business keep running during the work?", a: "Yes. We work alongside your live system in safe stages rather than switching everything off for a risky big-bang migration, so daily operations continue uninterrupted." },
    { q: "How do you decide what to fix first?", a: "We start with an assessment of your code, data and infrastructure, then prioritize the most urgent security and reliability risks — the things most likely to hurt the business — before rebuilding the rest." },
    { q: "Can you work within my budget?", a: "Yes. Because we modernize in phases, you spend on the highest-impact work first and expand at a pace that suits your budget, rather than funding one huge project upfront." },
    { q: "Who owns the modernized system?", a: "You do — completely. You retain full ownership of the new codebase, data and infrastructure, so you're never dependent on us to move forward." },
  ],
  contact: {
    heading: "Tell us about your legacy system.",
    sub: "Share what's outdated or risky and we'll come back with a clear, safe, budget-aware modernization plan — no jargon.",
    topics: ["Modernization", "Security Audit", "Migration", "Not sure yet"],
  },
};

export default function LegacyModernization() {
  return <ServicePage config={config} />;
}
