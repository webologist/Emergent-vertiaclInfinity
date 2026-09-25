import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowRight, Loader2, Check, ShieldCheck, ChevronRight } from "lucide-react";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Reveal } from "@/components/Reveal";
import { ProcessFlow } from "@/components/diagrams/PDDiagrams";
import { scrollToId } from "@/lib/scroll";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const API = `${process.env.REACT_APP_BACKEND_URL || ""}/api`;
const ORIGIN = "https://verticalinfinity.in";

export function buildJsonLd(cfg) {
  const canonical = `${ORIGIN}${cfg.path}`;
  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: cfg.jsonLdServiceType,
    provider: {
      "@type": "Organization",
      name: "Vertical Infinity Pvt. Ltd.",
      url: ORIGIN,
      foundingDate: "2003",
    },
    areaServed: "Worldwide",
    description: cfg.metaDescription,
    url: canonical,
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: ORIGIN },
      { "@type": "ListItem", position: 2, name: cfg.breadcrumb, item: canonical },
    ],
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: cfg.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return [service, breadcrumb, faq];
}

export default function ServicePage({ config }) {
  const cfg = config;
  const canonical = `${ORIGIN}${cfg.path}`;
  const jsonLd = buildJsonLd(cfg);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [cfg.path]);

  // Inject JSON-LD into <head> (React 19 hoists title/meta/link but not scripts).
  useEffect(() => {
    const existing = Array.from(document.head.querySelectorAll(`script[data-sp-jsonld="${cfg.slug}"]`));
    const nodes = existing.length ? existing : jsonLd.map((obj) => {
      const el = document.createElement("script");
      el.type = "application/ld+json";
      el.setAttribute("data-sp-jsonld", cfg.slug);
      el.textContent = JSON.stringify(obj);
      document.head.appendChild(el);
      return el;
    });
    return () => nodes.forEach((n) => n.remove());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cfg.path]);

  return (
    <>
      <title>{cfg.title}</title>
      <meta name="description" content={cfg.metaDescription} />
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={cfg.ogTitle} />
      <meta property="og:description" content={cfg.ogDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={`${ORIGIN}/vi-8-hero.png`} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={cfg.ogTitle} />
      <meta name="twitter:description" content={cfg.ogDescription} />

      <Nav />

      <main data-testid={`${cfg.slug}-page`}>
        {/* HERO */}
        <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28" data-testid={`${cfg.slug}-hero`}>
          <div className="pointer-events-none absolute right-[6%] top-16 -z-10 hidden h-[440px] w-[440px] items-center justify-center lg:right-[10%] md:flex" aria-hidden="true">
            <div className="vi-8-glow absolute h-[70%] w-[70%] rounded-full bg-crimson/20 blur-[100px]" />
            <img src="/vi-8-hero.png" alt="" className="vi-8-float h-full w-auto object-contain opacity-70" draggable={false} />
          </div>
          <div className="container-x">
            <nav className="mb-8 flex items-center gap-2 text-xs text-dim" aria-label="Breadcrumb" data-testid={`${cfg.slug}-breadcrumb`}>
              <Link to="/" className="transition-colors hover:text-crimson">Home</Link>
              <ChevronRight size={13} />
              <span className="text-white">{cfg.breadcrumb}</span>
            </nav>

            <Reveal>
              <span className="overline">{cfg.hero.overline}</span>
              <h1 className="mt-4 max-w-4xl font-display text-4xl font-extrabold uppercase leading-[0.98] tracking-tighter sm:text-5xl lg:text-6xl">
                {cfg.hero.titleParts.map((p, i) => (
                  <span key={i} className={p.accent ? "text-crimson" : ""}>{p.text}</span>
                ))}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-dim md:text-lg">{cfg.hero.sub}</p>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <button
                  onClick={() => scrollToId("#contact")}
                  data-testid={`${cfg.slug}-hero-cta-primary`}
                  className="group flex w-max items-center gap-3 rounded-full bg-crimson px-7 py-4 text-sm font-semibold text-cwhite transition-colors duration-300 hover:bg-white hover:text-ink"
                >
                  {cfg.hero.primaryCta}
                  <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
                <button
                  onClick={() => scrollToId("#process")}
                  data-testid={`${cfg.slug}-hero-cta-secondary`}
                  className="group flex w-max items-center gap-2 rounded-full border border-white/20 px-7 py-4 text-sm font-semibold transition-colors duration-300 hover:border-crimson"
                >
                  See how it works
                  <ArrowRight size={16} className="text-crimson transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </Reveal>
          </div>
        </section>

        {/* VALUES */}
        <section className="border-t border-white/10 py-20 md:py-28" data-testid={`${cfg.slug}-values`}>
          <div className="container-x">
            <Reveal>
              <span className="overline">{cfg.values.overline}</span>
              <h2 className="mt-4 max-w-2xl font-display text-3xl font-extrabold tracking-tighter sm:text-4xl">{cfg.values.title}</h2>
            </Reveal>
            <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
              {cfg.values.items.map((v, i) => (
                <Reveal key={v.title} delay={i * 0.08}>
                  <div className="flex h-full flex-col bg-surface p-8" data-testid={`${cfg.slug}-value-${i}`}>
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

        {/* PROCESS */}
        <section id="process" className="scroll-mt-24 border-t border-white/10 py-20 md:py-28" data-testid={`${cfg.slug}-process`}>
          <div className="container-x">
            <Reveal>
              <span className="overline">{cfg.process.overline}</span>
              <h2 className="mt-4 max-w-2xl font-display text-3xl font-extrabold tracking-tighter sm:text-4xl">{cfg.process.title}</h2>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-dim">{cfg.process.intro}</p>
            </Reveal>
            <div className="mt-16">
              <ProcessFlow steps={cfg.process.steps} />
            </div>
            <Reveal delay={0.1}>
              <div className="mt-14 flex justify-center">
                <button
                  onClick={() => scrollToId("#contact")}
                  data-testid={`${cfg.slug}-process-cta`}
                  className="group flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold transition-colors duration-300 hover:border-crimson"
                >
                  {cfg.process.cta}
                  <ArrowRight size={16} className="text-crimson transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </Reveal>
          </div>
        </section>

        {/* HIGHLIGHT + DIAGRAM */}
        <section className="border-t border-white/10 py-20 md:py-28" data-testid={`${cfg.slug}-highlight`}>
          <div className="container-x grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <div>
                <span className="overline">{cfg.highlight.overline}</span>
                <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tighter sm:text-4xl">{cfg.highlight.title}</h2>
                <p className="mt-6 text-base leading-relaxed text-dim">{cfg.highlight.body}</p>
                <ul className="mt-8 space-y-3">
                  {cfg.highlight.bullets.map((li) => (
                    <li key={li} className="flex items-center gap-3 text-sm text-white">
                      <Check size={16} className="text-crimson" /> {li}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => scrollToId("#contact")}
                  data-testid={`${cfg.slug}-highlight-cta`}
                  className="group mt-10 flex w-max items-center gap-3 rounded-full bg-crimson px-7 py-4 text-sm font-semibold text-cwhite transition-colors duration-300 hover:bg-white hover:text-ink"
                >
                  {cfg.highlight.cta}
                  <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </Reveal>
            <Reveal delay={0.1}>{cfg.highlight.diagram}</Reveal>
          </div>
        </section>

        {/* OUTCOMES */}
        <section className="border-t border-white/10 py-20 md:py-28" data-testid={`${cfg.slug}-outcomes`}>
          <div className="container-x">
            <Reveal>
              <span className="overline">{cfg.outcomes.overline}</span>
              <h2 className="mt-4 max-w-2xl font-display text-3xl font-extrabold tracking-tighter sm:text-4xl">{cfg.outcomes.title}</h2>
            </Reveal>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {cfg.outcomes.items.map((o, i) => (
                <Reveal key={o.title} delay={i * 0.08}>
                  <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-surface p-8 transition-colors duration-300 hover:border-crimson/50" data-testid={`${cfg.slug}-outcome-${i}`}>
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
        <section className="border-t border-white/10 py-20 md:py-28" data-testid={`${cfg.slug}-faq`}>
          <div className="container-x">
            <Reveal>
              <span className="overline">Good questions</span>
              <h2 className="mt-4 font-display text-3xl font-extrabold tracking-tighter sm:text-4xl">Frequently asked</h2>
            </Reveal>
            <div className="mx-auto mt-12 max-w-3xl divide-y divide-white/10 border-y border-white/10">
              {cfg.faqs.map((f, i) => (
                <details key={i} className="group py-5" data-testid={`${cfg.slug}-faq-${i}`}>
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

        {/* CONTACT */}
        <section id="contact" className="scroll-mt-24 border-t border-white/10 bg-crimson py-20 text-cwhite dark:bg-[#8F121F] md:py-28" data-testid={`${cfg.slug}-contact`}>
          <div className="container-x grid gap-12 lg:grid-cols-[1fr_1.1fr]">
            <Reveal>
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-cwhite/70">Let's talk</span>
                <h2 className="mt-4 font-display text-3xl font-extrabold uppercase leading-[0.98] tracking-tighter sm:text-4xl lg:text-5xl">{cfg.contact.heading}</h2>
                <p className="mt-6 max-w-md text-base leading-relaxed text-cwhite/85">{cfg.contact.sub}</p>
                <div className="mt-8 flex items-center gap-3 text-sm text-cwhite/80">
                  <ShieldCheck size={18} /> Your idea and IP stay 100% yours.
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <ServiceContactForm topics={cfg.contact.topics} slug={cfg.slug} />
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
      <ScrollToTop />
    </>
  );
}

function ServiceContactForm({ topics, slug }) {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "", topic: topics[0], website: "" });
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
      setForm({ name: "", email: "", company: "", message: "", topic: topics[0], website: "" });
      setTimeout(() => setStatus("idle"), 2500);
    } catch (err) {
      console.error(err);
      setStatus("idle");
      toast.error(
        err?.response?.status === 429
          ? "Too many messages from your network right now — please try again in a few minutes."
          : "Something went wrong. Please try again.",
      );
    }
  };

  return (
    <form onSubmit={submit} className="relative flex flex-col rounded-2xl bg-cwhite p-7 text-ink md:p-9" data-testid={`${slug}-contact-form`}>
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={update("website")}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        data-testid={`${slug}-honeypot-input`}
      />
      <div className="mb-6 flex flex-wrap gap-2">
        {topics.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setForm((f) => ({ ...f, topic: t }))}
            data-testid={`${slug}-topic-${t.split(" ")[0].toLowerCase()}`}
            className={`rounded-full border px-4 py-1.5 text-xs transition-colors duration-300 ${
              form.topic === t ? "border-crimson bg-crimson text-cwhite" : "border-ink/15 text-ink/60 hover:border-ink/40"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <SField label="Name*">
          <Input value={form.name} onChange={update("name")} placeholder="Jane Doe" data-testid={`${slug}-name-input`} className="border-ink/15 bg-transparent text-ink focus-visible:ring-crimson" />
        </SField>
        <SField label="Email*">
          <Input type="email" value={form.email} onChange={update("email")} placeholder="jane@company.com" data-testid={`${slug}-email-input`} className="border-ink/15 bg-transparent text-ink focus-visible:ring-crimson" />
        </SField>
      </div>
      <div className="mt-4">
        <SField label="Company">
          <Input value={form.company} onChange={update("company")} placeholder="Company name" data-testid={`${slug}-company-input`} className="border-ink/15 bg-transparent text-ink focus-visible:ring-crimson" />
        </SField>
      </div>
      <div className="mt-4">
        <SField label="Tell us what you need*">
          <Textarea value={form.message} onChange={update("message")} placeholder="A few lines about your goals + rough budget helps us reply well…" rows={5} data-testid={`${slug}-message-input`} className="resize-none border-ink/15 bg-transparent text-ink focus-visible:ring-crimson" />
        </SField>
      </div>
      <motion.button
        type="submit"
        disabled={status === "loading"}
        whileTap={{ scale: 0.98 }}
        data-testid={`${slug}-submit-btn`}
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

const SField = ({ label, children }) => (
  <label className="block">
    <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-ink/50">{label}</span>
    {children}
  </label>
);
