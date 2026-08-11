import {
  Headphones, Activity, Wrench, RefreshCw,
  ShieldCheck, Clock, TrendingUp, Bell, HeartPulse, Users,
} from "lucide-react";
import ServicePage from "@/pages/ServicePage";
import { BeforeAfter } from "@/components/diagrams/PDDiagrams";

const config = {
  slug: "managed-support",
  path: "/managed-support",
  breadcrumb: "Managed Support",
  title: "Managed Support & Maintenance | Vertical Infinity — We Keep It Running",
  metaDescription:
    "Vertical Infinity keeps your website and apps secure, updated and running smoothly — proactive monitoring, fast fixes and continuous improvement. Built to your budget since 2003.",
  ogTitle: "Managed Support & Maintenance | Vertical Infinity",
  ogDescription: "Stop firefighting. Proactive support that keeps your platform secure, fast and always online.",
  jsonLdServiceType: "Managed Support & Maintenance",
  hero: {
    overline: "What we build",
    titleParts: [
      { text: "Managed support that " },
      { text: "lets you stop worrying", accent: true },
      { text: "." },
    ],
    sub: "Once you're live, the last thing you want is to babysit your website or app. We keep everything secure, updated and running smoothly in the background — spotting issues before they become outages and continuously improving your platform — so you can focus on your business, not your tech.",
    primaryCta: "Get covered",
  },
  values: {
    overline: "Why teams rely on us",
    title: "Proactive, not reactive.",
    items: [
      { icon: Bell, title: "Issues caught early", body: "We monitor around the clock and fix problems before your users ever notice." },
      { icon: ShieldCheck, title: "Always secure", body: "Regular updates and security patches keep your platform protected and compliant." },
      { icon: Clock, title: "Fast response", body: "When something needs a human, you get a real, responsive team — not a ticket void." },
      { icon: TrendingUp, title: "Always improving", body: "We don't just maintain — we keep refining speed, features and reliability." },
    ],
  },
  process: {
    overline: "The journey",
    title: "How support works — Onboard to Improve.",
    intro: "We get to know your platform, watch over it continuously, and keep making it better — with clear communication throughout.",
    cta: "Start support",
    steps: [
      { icon: Headphones, title: "Onboard", desc: "We learn your platform inside-out and set up monitoring, backups and access." },
      { icon: Activity, title: "Monitor", desc: "We watch uptime, security and performance 24/7, catching issues early." },
      { icon: Wrench, title: "Maintain", desc: "We handle updates, patches, backups and fixes so nothing slips or breaks." },
      { icon: RefreshCw, title: "Improve", desc: "We suggest and ship enhancements that keep your platform sharp over time." },
    ],
  },
  highlight: {
    overline: "Before & after",
    title: "From firefighting to peace of mind.",
    body: "Without dedicated support, small problems quietly pile up until something breaks at the worst possible moment. We flip that — with proactive monitoring, regular upkeep and a team on standby — so your platform stays healthy and you get your evenings back.",
    bullets: ["Problems fixed before customers notice", "Predictable, transparent monthly cover", "A team that already knows your system"],
    cta: "See support options",
    diagram: (
      <BeforeAfter
        beforeTitle="On your own"
        afterTitle="Managed with us"
        before={[
          "Problems found by angry users",
          "Security patches forgotten",
          "Scrambling when things break",
          "No one who knows your system",
        ]}
        after={[
          "Issues caught before users notice",
          "Always patched and secure",
          "Calm, fast fixes on standby",
          "A team that knows it inside-out",
        ]}
      />
    ),
  },
  outcomes: {
    overline: "What you get",
    title: "A platform that just keeps working.",
    items: [
      { icon: HeartPulse, title: "Reliable uptime", body: "Your site and apps stay online and healthy — no nasty surprises at 2am." },
      { icon: ShieldCheck, title: "Ongoing security", body: "Continuous patching and monitoring keep threats and vulnerabilities at bay." },
      { icon: Users, title: "A partner on call", body: "Real people who know your platform and respond fast when you need them." },
    ],
  },
  faqs: [
    { q: "What does managed support cover?", a: "Continuous monitoring, security updates and patches, backups, bug fixes, uptime and performance checks, and ongoing improvements — essentially everything needed to keep your platform healthy, secure and fast." },
    { q: "Do you only support things you built?", a: "No. We can take over support for existing websites and apps too. We start by learning your platform and setting up monitoring and backups so we can look after it confidently." },
    { q: "How quickly do you respond to problems?", a: "Because we monitor proactively, we often fix issues before you even notice. When something needs your input, you get a responsive, real team — with clear response times agreed up front." },
    { q: "Is this affordable for a small business?", a: "Yes. Support is offered in clear, predictable tiers so you only pay for the level of cover you need, and can scale it up as your platform grows." },
    { q: "Do I stay in control of my platform?", a: "Always. You keep full ownership of your code, data and infrastructure — we're your support partner, never a lock-in." },
  ],
  contact: {
    heading: "Tell us what needs looking after.",
    sub: "Share your website or app and any worries you have, and we'll put together a clear, budget-friendly support plan.",
    topics: ["Managed Support", "Maintenance", "Security", "Not sure yet"],
  },
};

export default function ManagedSupport() {
  return <ServicePage config={config} />;
}
