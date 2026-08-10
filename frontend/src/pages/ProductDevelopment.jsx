import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  ArrowUpRight, ArrowRight, Loader2, Check, ShieldCheck, Wallet, Eye,
  MessagesSquare, Layers, Gauge, ChevronRight, Sparkles,
} from "lucide-react";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Reveal } from "@/components/Reveal";
import { ProcessFlow, BudgetLadder } from "@/components/diagrams/PDDiagrams";
import { scrollToId } from "@/lib/scroll";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const CANONICAL = "https://clean-tech-hero.emergent.host/product-development";

const VALUES = [
  { icon: Eye, title: "Total clarity", body: "You see progress every week — no black boxes, no jargon, no surprise invoices." },
  { icon: ShieldCheck, title: "You own everything", body: "100% ownership of your source code, data and infrastructure. Always." },
  { icon: Wallet, title: "Built to your budget", body: "We scope the right product for the money you have — and grow it as you grow." },
  { icon: MessagesSquare, title: "One team, honest talk", body: "We work as a high-velocity extension of your team, not a distant vendor." },
];

const OUTCOMES = [
  { icon: Layers, title: "A working product, not a slide deck", body: "Every milestone ships something real you can click, test and show investors or customers." },
  { icon: Gauge, title: "Fast, without cutting corners", body: "Modern tooling and tight feedback loops mean speed that doesn't create tech debt." },
  { icon: Sparkles, title: "A partner after launch", body: "We stay on to refine, scale and support — because launch day is the baseline, not the finish line." },
];

const FAQS = [
  {
    q: "How does product development at Vertical Infinity work?",
    a: "We follow a simple five-stage journey — Discover, Design, Build, Launch and Scale. We agree a clear, budget-aware scope up front, then build in small weekly steps you can see, so you always know exactly where your product stands.",
  },
  {
    q: "Can you build within my budget?",
    a: "Yes. We shape the product around the budget you have today, starting with a lean, working version and expanding it in stages as your business grows. Every tier is a real product, not a throwaway prototype.",
  },
  {
    q: "Who owns the code and the product?",
    a: "You do — completely. You retain full, uncompromised ownership of all source code, data and infrastructure, so your team always stays in control of your future.",
  },
  {
    q: "What happens after launch?",
    a: "Launch day is just the baseline. We continue as your technical and strategic partner to monitor, refine, scale and support your platform as your needs evolve.",
  },
  {
    q: "How long has Vertical Infinity been building products?",
    a: "Since 2003. What began as Zxis has grown into Vertical Infinity Pvt. Ltd. — over two decades of shipping real digital products for businesses across SaaS, education, media, finance and eCommerce.",
  },
];

function useSeoJsonLd() {
  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Product Development",
    provider: {
      "@type": "Organization",
      name: "Vertical Infinity Pvt. Ltd.",
      url: "https://clean-tech-hero.emergent.host",
      foundingDate: "2003",
    },
    areaServed: "Worldwide",
    description:
      "End-to-end product development — from idea to launch and beyond. Transparent process, full IP ownership, and products built to your budget.",
    url: CANONICAL,
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://clean-tech-hero.emergent.host" },
      { "@type": "ListItem", position: 2, name: "Product Development", item: CANONICAL },
    ],
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return [service, breadcrumb, faq];
}

export default function ProductDevelopment() {
  const jsonLd = useSeoJsonLd();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* SEO / AIO metadata (React 19 hoists these to <head>) */}
      <title>Product Development Services | Vertical Infinity — Idea to Launch, On Your Budget</title>
      <meta
        name="description"
        content="Vertical Infinity builds your product end-to-end — a clear five-stage journey from Discover to Scale, full code ownership, and products built to your budget. Building since 2003."
      />
      <link rel="canonical" href={CANONICAL} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Product Development Services | Vertical Infinity" />
      <meta
        property="og:description"
        content="Idea to launch and beyond. A transparent, budget-aware product development journey with full IP ownership."
      />
      <meta property="og:url" content={CANONICAL} />
      <meta name="twitter:card" content="summary_large_image" />
      {jsonLd.map((obj, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }} />
      ))}

      <Nav />

      <main data-testid="product-development-page">
        {/* HERO */}
        <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28" data-testid="pd-hero">
          <div className="pointer-events-none absolute -right-40 top-10 -z-10 hidden h-[520px] w-[520px] items-center justify-center md:flex" aria-hidden="true">
            <div className="vi-8-glow absolute h-[70%] w-[70%] rounded-full bg-crimson/20 blur-[100px]" />
            <img src="/vi-8-hero.png" alt="" className="vi-8-float h-full w-auto object-contain opacity-70" draggable={false} />
          </div>
          <div className="container-x">
            {/* Breadcrumb */}
            <nav className="mb-8 flex items-center gap-2 text-xs text-dim" aria-label="Breadcrumb" data-testid="pd-breadcrumb">
              <Link to="/" className="transition-colors hover:text-crimson">Home</Link>
              <ChevronRight size={13} />
              <span className="text-white">Product Development</span>
            </nav>

            <Reveal>
              <span className="overline">What we build</span>
              <h1 className="mt-4 max-w-4xl font-display text-4xl font-extrabold uppercase leading-[0.98] tracking-tighter sm:text-5xl lg:text-6xl">
                Product development, <span className="text-crimson">made simple</span> — from idea to launch and beyond.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-dim md:text-lg">
                Turning an idea into a real product should feel exciting, not overwhelming. We take you through one
                clear journey, in plain language, building in small visible steps — so you always know what's happening,
                what it costs, and what comes next. And we build to your budget.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={() => scrollToId("#contact")}
                  data-testid="pd-hero-cta-primary"
                  className="group flex w-max items-center gap-3 rounded-full bg-crimson px-7 py-4 text-sm font-semibold text-cwhite transition-colors duration-300 hover:bg-white hover:text-ink"
                >
                  Start your build
                  <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
                <button
                  onClick={() => scrollToId("#process")}
                  data-testid="pd-hero-cta-secondary"
                  className="group flex w-max items-center gap-2 rounded-full border border-white/20 px-7 py-4 text-sm font-semibold transition-colors duration-300 hover:border-crimson"
                >
                  See how it works
                  <ArrowRight size={16} className="text-crimson transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </Reveal>
          </div>
        </section>

        {/* WHY IT FEELS EASY */}
        <section className="border-t border-white/10 py-20 md:py-28" data-testid="pd-values">
          <div className="container-x">
            <Reveal>
              <span className="overline">Why it feels easy</span>
              <h2 className="mt-4 max-w-2xl font-display text-3xl font-extrabold tracking-tighter sm:text-4xl">
                We removed the friction, kept the craft.
              </h2>
            </Reveal>
            <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
              {VALUES.map((v, i) => (
                <Reveal key={v.title} delay={i * 0.08}>
                  <div className="flex h-full flex-col bg-surface p-8" data-testid={`pd-value-${i}`}>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 text-crimson">
                      <v.icon size={22} strokeWidth={1.7} />
                    </div>
                    <h3 className="mt-6 font-display text-lg font-bold tracking-tight">{v.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-dim">{v.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* THE JOURNEY DIAGRAM */}
        <section id="process" className="scroll-mt-24 border-t border-white/10 py-20 md:py-28" data-testid="pd-process">
          <div className="container-x">
            <Reveal>
              <span className="overline">The journey</span>
              <h2 className="mt-4 max-w-2xl font-display text-3xl font-extrabold tracking-tighter sm:text-4xl">
                One clear path — Discover to Scale.
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-dim">
                No confusing hand-offs or hidden stages. Here's exactly how your product comes to life with us.
              </p>
            </Reveal>
            <div className="mt-16">
              <ProcessFlow />
            </div>
            <Reveal delay={0.1}>
              <div className="mt-14 flex justify-center">
                <button
                  onClick={() => scrollToId("#contact")}
                  data-testid="pd-process-cta"
                  className="group flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold transition-colors duration-300 hover:border-crimson"
                >
                  Map my product journey
                  <ArrowRight size={16} className="text-crimson transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </Reveal>
          </div>
        </section>

        {/* BUDGET */}
        <section className="border-t border-white/10 py-20 md:py-28" data-testid="pd-budget">
          <div className="container-x grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <div>
                <span className="overline">Built around your budget</span>
                <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tighter sm:text-4xl">
                  Start where you are today.
                </h2>
                <p className="mt-6 text-base leading-relaxed text-dim">
                  You don't need a giant budget to start building something real. We help you launch a lean, working
                  version first — then add features and scale in sensible stages as your product proves itself and your
                  business grows. You stay in control of spend at every step.
                </p>
                <ul className="mt-8 space-y-3">
                  {["No bloated retainers or lock-ins", "Clear, upfront scope for every stage", "Grow feature-by-feature at your pace"].map((li) => (
                    <li key={li} className="flex items-center gap-3 text-sm text-white">
                      <Check size={16} className="text-crimson" /> {li}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => scrollToId("#contact")}
                  data-testid="pd-budget-cta"
                  className="group mt-10 flex w-max items-center gap-3 rounded-full bg-crimson px-7 py-4 text-sm font-semibold text-cwhite transition-colors duration-300 hover:bg-white hover:text-ink"
                >
                  Get a budget-friendly plan
                  <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <BudgetLadder />
            </Reveal>
          </div>
        </section>

        {/* OUTCOMES */}
        <section className="border-t border-white/10 py-20 md:py-28" data-testid="pd-outcomes">
          <div className="container-x">
            <Reveal>
              <span className="overline">What you get</span>
              <h2 className="mt-4 max-w-2xl font-display text-3xl font-extrabold tracking-tighter sm:text-4xl">
                Real outcomes, not empty promises.
              </h2>
            </Reveal>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {OUTCOMES.map((o, i) => (
                <Reveal key={o.title} delay={i * 0.08}>
                  <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-surface p-8 transition-colors duration-300 hover:border-crimson/50" data-testid={`pd-outcome-${i}`}>
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 text-crimson">
                      <o.icon size={22} strokeWidth={1.7} />
                    </div>
                    <h3 className="mt-6 font-display text-xl font-bold tracking-tight">{o.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-dim">{o.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-white/10 py-20 md:py-28" data-testid="pd-faq">
          <div className="container-x">
            <Reveal>
              <span className="overline">Good questions</span>
              <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tighter sm:text-4xl">
                Frequently asked
              </h2>
            </Reveal>
            <div className="mx-auto mt-12 max-w-3xl divide-y divide-white/10 border-y border-white/10">
              {FAQS.map((f, i) => (
                <details key={i} className="group py-5" data-testid={`pd-faq-${i}`}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-base font-semibold md:text-lg">
                    {f.q}
                    <ChevronRight size={18} className="shrink-0 text-crimson transition-transform duration-300 group-open:rotate-90" />
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-dim">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA BAND + EMBEDDED CONTACT */}
        <section id="contact" className="scroll-mt-24 border-t border-white/10 bg-crimson py-20 text-cwhite dark:bg-[#8F121F] md:py-28" data-testid="pd-contact">
          <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.1fr]">
            <Reveal>
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-cwhite/70">Let's build it</span>
                <h2 className="mt-4 font-display text-3xl font-extrabold uppercase leading-[0.98] tracking-tighter sm:text-4xl lg:text-5xl">
                  Tell us your idea. We'll make it real.
                </h2>
                <p className="mt-6 max-w-md text-base leading-relaxed text-cwhite/85">
                  Share a little about what you're building and your budget. We'll come back with a clear, honest plan —
                  and yes, the first chat is over coffee.
                </p>
                <div className="mt-8 flex items-center gap-3 text-sm text-cwhite/80">
                  <ShieldCheck size={18} /> Your idea and IP stay 100% yours.
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <PDContactForm />
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
      <ScrollToTop />
    </>
  );
}

const TOPICS = ["New Project", "MVP / Startup", "Custom App", "Not sure yet"];

function PDContactForm() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "", topic: "New Project" });
  const [status, setStatus] = useState("idle");
  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in your name, email and message.");
      return;
    }
    setStatus("loading");
    try {
      await axios.post(`${API}/contact`, form);
      setStatus("done");
      toast.success("Got it — we'll be in touch soon.");
      setForm({ name: "", email: "", company: "", message: "", topic: "New Project" });
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err) {
      console.error(err);
      setStatus("idle");
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col rounded-2xl bg-cwhite p-7 text-ink md:p-9" data-testid="pd-contact-form">
      <div className="mb-6 flex flex-wrap gap-2">
        {TOPICS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setForm((f) => ({ ...f, topic: t }))}
            data-testid={`pd-topic-${t.split(" ")[0].toLowerCase()}`}
            className={`rounded-full border px-4 py-1.5 text-xs transition-colors duration-300 ${
              form.topic === t ? "border-crimson bg-crimson text-cwhite" : "border-ink/15 text-ink/60 hover:border-ink/40"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <PDField label="Name*">
          <Input value={form.name} onChange={update("name")} placeholder="Jane Doe" data-testid="pd-name-input" className="border-ink/15 bg-transparent text-ink focus-visible:ring-crimson" />
        </PDField>
        <PDField label="Email*">
          <Input type="email" value={form.email} onChange={update("email")} placeholder="jane@company.com" data-testid="pd-email-input" className="border-ink/15 bg-transparent text-ink focus-visible:ring-crimson" />
        </PDField>
      </div>
      <div className="mt-4">
        <PDField label="Company / Product">
          <Input value={form.company} onChange={update("company")} placeholder="Company or product name" data-testid="pd-company-input" className="border-ink/15 bg-transparent text-ink focus-visible:ring-crimson" />
        </PDField>
      </div>
      <div className="mt-4">
        <PDField label="What do you want to build?*">
          <Textarea value={form.message} onChange={update("message")} placeholder="A quick idea + rough budget helps us reply well…" rows={5} data-testid="pd-message-input" className="resize-none border-ink/15 bg-transparent text-ink focus-visible:ring-crimson" />
        </PDField>
      </div>
      <motion.button
        type="submit"
        disabled={status === "loading"}
        whileTap={{ scale: 0.98 }}
        data-testid="pd-submit-btn"
        className="group mt-6 flex items-center justify-center gap-2 rounded-full bg-crimson px-6 py-4 text-sm font-semibold text-cwhite transition-colors duration-300 hover:bg-ink disabled:opacity-60"
      >
        {status === "loading" && <Loader2 size={16} className="animate-spin" />}
        {status === "done" && <Check size={16} />}
        {status === "idle" ? "Send & schedule a chat" : status === "loading" ? "Sending…" : "Sent!"}
        {status === "idle" && <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />}
      </motion.button>
    </form>
  );
}

const PDField = ({ label, children }) => (
  <label className="block">
    <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-ink/50">{label}</span>
    {children}
  </label>
);
