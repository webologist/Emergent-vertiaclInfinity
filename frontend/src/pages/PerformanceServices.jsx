import {
  Gauge, Search, Wrench, Activity,
  Zap, TrendingUp, Smartphone, Server, Timer, DollarSign,
} from "lucide-react";
import ServicePage from "@/pages/ServicePage";
import { BeforeAfter } from "@/components/diagrams/PDDiagrams";

const config = {
  slug: "performance-services",
  path: "/performance-services",
  breadcrumb: "Performance Services",
  title: "Website & App Performance Services | Vertical Infinity — Make It Fast",
  metaDescription:
    "Vertical Infinity makes slow websites and apps fast — better speed, Core Web Vitals and reliability that lift conversions and rankings. Built to your budget since 2003.",
  ogTitle: "Performance Services | Vertical Infinity",
  ogDescription: "Slow costs you sales and rankings. We diagnose and fix performance so your site is fast, stable and profitable.",
  jsonLdServiceType: "Website & Application Performance Optimization",
  hero: {
    overline: "What we build",
    titleParts: [
      { text: "Performance tuning that " },
      { text: "wins back lost sales", accent: true },
      { text: "." },
    ],
    sub: "Every extra second of load time quietly costs you customers and search rankings. We find exactly what's slowing your site or app down and fix it — so pages load in a blink, your platform stays rock-solid under load, and more visitors stick around to convert.",
    primaryCta: "Speed up my site",
  },
  values: {
    overline: "Why speed pays",
    title: "Faster feels better — and sells more.",
    items: [
      { icon: Zap, title: "Instant-feel pages", body: "Snappy loads keep visitors engaged instead of bouncing to a competitor." },
      { icon: TrendingUp, title: "Better rankings", body: "Search engines reward fast, stable sites — speed is an SEO advantage." },
      { icon: DollarSign, title: "Higher conversion", body: "Shave seconds off load time and watch sign-ups and sales climb." },
      { icon: Server, title: "Stable under load", body: "We make sure traffic spikes mean more sales, not crashes." },
    ],
  },
  process: {
    overline: "The journey",
    title: "How we optimize — Measure to Monitor.",
    intro: "We diagnose with real data, fix the biggest bottlenecks first, and keep watch so speed stays fast.",
    cta: "Audit my performance",
    steps: [
      { icon: Search, title: "Measure", desc: "We benchmark your speed, Core Web Vitals and reliability to find what's really slow." },
      { icon: Gauge, title: "Diagnose", desc: "We pinpoint the heaviest bottlenecks — code, images, servers and third-parties." },
      { icon: Wrench, title: "Optimize", desc: "We fix the highest-impact issues first for fast, visible improvements." },
      { icon: Activity, title: "Monitor", desc: "We set up ongoing monitoring so regressions get caught before your users do." },
    ],
  },
  highlight: {
    overline: "Before & after",
    title: "From sluggish to lightning-fast.",
    body: "Slow, heavy pages frustrate visitors and drag down your rankings and revenue. We strip out the bloat, tune the delivery and harden reliability — turning a sluggish experience into one that feels instant and keeps people buying.",
    bullets: ["Faster loads across the board", "Higher Core Web Vitals scores", "Fewer crashes under traffic spikes"],
    cta: "Get a performance audit",
    diagram: (
      <BeforeAfter
        beforeTitle="Slow today"
        afterTitle="Optimized with us"
        before={[
          "Pages take seconds to load",
          "High bounce rates",
          "Poor Core Web Vitals",
          "Crashes during traffic spikes",
        ]}
        after={[
          "Near-instant page loads",
          "Visitors stay and convert",
          "Green Core Web Vitals",
          "Stable under heavy load",
        ]}
      />
    ),
  },
  outcomes: {
    overline: "What you get",
    title: "Speed you can measure — and bank.",
    items: [
      { icon: Timer, title: "Measurable gains", body: "Clear before/after numbers on load time, vitals and reliability — not vague promises." },
      { icon: Smartphone, title: "Great on mobile", body: "Fast on real phones and networks, where most of your visitors actually are." },
      { icon: TrendingUp, title: "More revenue", body: "Faster, steadier experiences lift conversions, retention and search visibility." },
    ],
  },
  faqs: [
    { q: "How do you know what's slowing my site down?", a: "We start with real-world measurement — page speed, Core Web Vitals, server response and third-party scripts — to find the exact bottlenecks, so we fix causes rather than guessing." },
    { q: "Will speeding it up break anything?", a: "No. We optimize carefully and test each change, rolling out improvements safely so your site stays stable while it gets faster." },
    { q: "Does performance really affect sales and SEO?", a: "Yes, significantly. Faster pages reduce bounce, increase conversions, and are favoured by search engines through Core Web Vitals — so speed directly impacts revenue and visibility." },
    { q: "Can you help within my budget?", a: "Yes. We tackle the highest-impact fixes first, so you see meaningful speed gains quickly, then continue optimizing at a pace that suits your budget." },
    { q: "Do you offer ongoing monitoring?", a: "We can. We set up monitoring and alerts so performance regressions are caught early — before they cost you customers." },
  ],
  contact: {
    heading: "Tell us what feels slow.",
    sub: "Share your site or app and the pages that lag, and we'll come back with a clear, budget-aware plan to make it fast.",
    topics: ["Performance Audit", "Speed Fixes", "Monitoring", "Not sure yet"],
  },
};

export default function PerformanceServices() {
  return <ServicePage config={config} />;
}
