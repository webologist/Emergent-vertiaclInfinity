import {
  Compass, PenTool, Code2, Rocket, TrendingUp,
  Eye, ShieldCheck, Wallet, MessagesSquare, Layers, Gauge, Sparkles,
} from "lucide-react";
import ServicePage from "@/pages/ServicePage";
import { BudgetLadder } from "@/components/diagrams/PDDiagrams";

export const config = {
  slug: "product-development",
  path: "/product-development",
  breadcrumb: "Product Development",
  title: "SaaS Product Development Company India | Vertical Infinity",
  metaDescription:
    "Custom software development company in Mumbai building SaaS, web and mobile products end-to-end — Discover to Scale, full code ownership, built to your budget.",
  ogTitle: "Product Development Services | Vertical Infinity",
  ogDescription: "Idea to launch and beyond. A transparent, budget-aware product development journey with full IP ownership.",
  jsonLdServiceType: "Product Development",
  metaKeywords: "product development, custom software development company Mumbai, SaaS product development company India",
  hero: {
    overline: "What we build",
    titleParts: [
      { text: "Custom software & SaaS product development, " },
      { text: "made simple", accent: true },
      { text: " — from idea to launch and beyond." },
    ],
    sub: "Turning an idea into a real product should feel exciting, not overwhelming. We take you through one clear journey, in plain language, building in small visible steps — so you always know what's happening, what it costs, and what comes next. And we build to your budget.",
    primaryCta: "Start your build",
  },
  values: {
    overline: "Why it feels easy",
    title: "We removed the friction, kept the craft.",
    items: [
      { icon: Eye, title: "Total clarity", body: "You see progress every week — no black boxes, no jargon, no surprise invoices." },
      { icon: ShieldCheck, title: "You own everything", body: "100% ownership of your source code, data and infrastructure. Always." },
      { icon: Wallet, title: "Built to your budget", body: "We scope the right product for the money you have — and grow it as you grow." },
      { icon: MessagesSquare, title: "One team, honest talk", body: "We work as a high-velocity extension of your team, not a distant vendor." },
    ],
  },
  process: {
    overline: "The journey",
    title: "One clear path — Discover to Scale.",
    intro: "No confusing hand-offs or hidden stages. Here's exactly how your product comes to life with us.",
    cta: "Map my product journey",
    steps: [
      { icon: Compass, title: "Discover", desc: "We map your goals, users and constraints, then agree on a clear, budget-aware scope." },
      { icon: PenTool, title: "Design", desc: "Wireframes and interface design you can see and feel — no surprises later." },
      { icon: Code2, title: "Build", desc: "We engineer in small, visible steps. You watch it come to life every week." },
      { icon: Rocket, title: "Launch", desc: "We ship carefully, test everything and hand you full ownership of the code." },
      { icon: TrendingUp, title: "Scale", desc: "Launch day is the baseline. We stay on to refine, grow and support your platform." },
    ],
  },
  highlight: {
    overline: "Built around your budget",
    title: "Start where you are today.",
    body: "You don't need a giant budget to start building something real. We help you launch a lean, working version first — then add features and scale in sensible stages as your product proves itself and your business grows. You stay in control of spend at every step.",
    bullets: ["No bloated retainers or lock-ins", "Clear, upfront scope for every stage", "Grow feature-by-feature at your pace"],
    cta: "Get a budget-friendly plan",
    diagram: <BudgetLadder />,
  },
  outcomes: {
    overline: "What you get",
    title: "Real outcomes, not empty promises.",
    items: [
      { icon: Layers, title: "A working product, not a slide deck", body: "Every milestone ships something real you can click, test and show investors or customers." },
      { icon: Gauge, title: "Fast, without cutting corners", body: "Modern tooling and tight feedback loops mean speed that doesn't create tech debt." },
      { icon: Sparkles, title: "A partner after launch", body: "We stay on to refine, scale and support — because launch day is the baseline, not the finish line." },
    ],
  },
  faqs: [
    { q: "How does product development at Vertical Infinity work?", a: "We follow a simple five-stage journey — Discover, Design, Build, Launch and Scale. We agree a clear, budget-aware scope up front, then build in small weekly steps you can see, so you always know exactly where your product stands." },
    { q: "Can you build within my budget?", a: "Yes. We shape the product around the budget you have today, starting with a lean, working version and expanding it in stages as your business grows. Every tier is a real product, not a throwaway prototype." },
    { q: "Who owns the code and the product?", a: "You do — completely. You retain full, uncompromised ownership of all source code, data and infrastructure, so your team always stays in control of your future." },
    { q: "What happens after launch?", a: "Launch day is just the baseline. We continue as your technical and strategic partner to monitor, refine, scale and support your platform as your needs evolve." },
    { q: "How long has Vertical Infinity been building products?", a: "Since 2003. What began as Zxis has grown into Vertical Infinity Pvt. Ltd. — over two decades of shipping real digital products for businesses across SaaS, education, media, finance and eCommerce." },
  ],
  contact: {
    heading: "Tell us your idea. We'll make it real.",
    sub: "Share a little about what you're building and your budget. We'll come back with a clear, honest plan — and yes, the first chat is over coffee.",
    topics: ["New Project", "MVP / Startup", "Custom App", "Not sure yet"],
  },
};

export default function ProductDevelopment() {
  return <ServicePage config={config} />;
}
