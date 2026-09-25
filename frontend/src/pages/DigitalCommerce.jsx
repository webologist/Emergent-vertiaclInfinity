import {
  Search, Store, CreditCard, TrendingUp,
  ShoppingCart, ShieldCheck, Smartphone, Package, LineChart, Zap,
} from "lucide-react";
import ServicePage from "@/pages/ServicePage";
import { LadderDiagram } from "@/components/diagrams/PDDiagrams";

const TIERS = [
  { label: "Launch", h: 40, note: "Get selling online fast" },
  { label: "Grow", h: 72, note: "Optimize & add channels" },
  { label: "Scale", h: 100, note: "High-volume, global-ready" },
];

export const config = {
  slug: "digital-commerce",
  path: "/digital-commerce",
  breadcrumb: "Digital Commerce",
  title: "Digital Commerce Services | Vertical Infinity — Stores That Sell",
  metaDescription:
    "Vertical Infinity builds fast, reliable online stores that convert — from launch to scale, with secure payments and full ownership. Built to your budget since 2003.",
  ogTitle: "Digital Commerce Services | Vertical Infinity",
  ogDescription: "Fast, reliable, high-converting online stores — from your first sale to high-volume scale.",
  jsonLdServiceType: "Digital Commerce & eCommerce Development",
  hero: {
    overline: "What we build",
    titleParts: [
      { text: "Online stores that " },
      { text: "actually sell", accent: true },
      { text: "." },
    ],
    sub: "Selling online should be smooth for your customers and simple for you. We build fast, reliable commerce experiences with easy checkout, secure payments and the flexibility to grow — so more browsers become buyers, and running your store never becomes a headache.",
    primaryCta: "Build my store",
  },
  values: {
    overline: "Why it converts",
    title: "Every second and every click counts.",
    items: [
      { icon: Zap, title: "Fast = more sales", body: "Speed-obsessed builds mean fewer abandoned carts and happier shoppers." },
      { icon: ShoppingCart, title: "Effortless checkout", body: "A smooth, trustworthy path to purchase that removes reasons to leave." },
      { icon: ShieldCheck, title: "Secure payments", body: "Trusted, compliant payment flows that protect you and your customers." },
      { icon: Smartphone, title: "Sells on every device", body: "A store that looks and works beautifully on phones, where most shopping happens." },
    ],
  },
  process: {
    overline: "The journey",
    title: "How we build your store — Plan to Grow.",
    intro: "We design for selling from day one, then keep optimizing so your store gets better at converting over time.",
    cta: "Plan my store",
    steps: [
      { icon: Search, title: "Plan", desc: "We map your products, customers and goals to shape the right store for you." },
      { icon: Store, title: "Build", desc: "We build a fast, flexible storefront with your catalogue and brand front and centre." },
      { icon: CreditCard, title: "Launch", desc: "We connect secure payments and shipping, test everything, and go live confidently." },
      { icon: TrendingUp, title: "Grow", desc: "We track behaviour and optimize checkout, pages and offers to lift conversion." },
    ],
  },
  highlight: {
    overline: "Launch to scale",
    title: "Start selling now, scale when you're ready.",
    body: "You don't need an enterprise platform on day one. We get you selling quickly with a lean, reliable store, then add channels, automation and scale as your orders grow — so your spend always matches your momentum.",
    bullets: ["Live and selling faster", "Add channels and features as you grow", "Ready for high-volume when you are"],
    cta: "Get a store plan",
    diagram: (
      <LadderDiagram
        tiers={TIERS}
        caption="Launch lean, then scale your store as sales grow — you control the pace and the spend."
        testid="commerce-ladder-diagram"
      />
    ),
  },
  outcomes: {
    overline: "What you get",
    title: "A store that pulls its weight.",
    items: [
      { icon: LineChart, title: "Higher conversion", body: "A faster, clearer buying journey turns more visits into completed orders." },
      { icon: Package, title: "Easier to run", body: "Manage products, orders and stock without wrestling your own website." },
      { icon: ShieldCheck, title: "Peace of mind", body: "Secure, reliable and monitored — so payday isn't ruined by downtime." },
    ],
  },
  faqs: [
    { q: "What kind of stores do you build?", a: "Everything from a lean shop for your first products to high-volume, multi-channel commerce platforms. We choose the right approach for your catalogue, customers and budget — you're never over-built or under-served." },
    { q: "Can you handle payments and shipping?", a: "Yes. We integrate trusted, secure payment providers and shipping options suited to your market, with compliant, smooth checkout flows that build buyer trust." },
    { q: "Will my store be fast on mobile?", a: "Yes — speed and mobile experience are top priorities, because most shoppers buy on their phones and every second of delay costs sales." },
    { q: "Can I start small and scale later?", a: "Definitely. We get you selling quickly with a lean store, then add channels, automation and scale as your orders grow — matching spend to results." },
    { q: "Do I own my store and data?", a: "Yes — completely. You retain full ownership of your storefront, code, customer data and infrastructure." },
  ],
  contact: {
    heading: "Tell us what you want to sell.",
    sub: "Share your products and goals and we'll come back with a clear, budget-aware plan to get you selling online — and converting.",
    topics: ["New Store", "Migration", "Optimization", "Not sure yet"],
  },
};

export default function DigitalCommerce() {
  return <ServicePage config={config} />;
}
