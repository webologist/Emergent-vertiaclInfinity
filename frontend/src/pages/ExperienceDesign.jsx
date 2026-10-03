import {
  Search, PenTool, Layout, Repeat,
  Eye, Smile, Accessibility, MousePointerClick, Palette, Heart, Users,
} from "lucide-react";
import ServicePage from "@/pages/ServicePage";
import { BeforeAfter } from "@/components/diagrams/PDDiagrams";

export const config = {
  slug: "experience-design",
  path: "/experience-design",
  breadcrumb: "Experience Design",
  title: "UI UX Design Agency in Mumbai | Vertical Infinity",
  metaDescription:
    "UI UX design agency in Mumbai — research-led UX and clean, intuitive UI that turn visitors into customers. Built to your budget since 2003.",
  ogTitle: "Experience Design (UX/UI) Services | Vertical Infinity",
  ogDescription: "Research-led UX and beautiful, accessible UI that makes your product a joy to use — and easy to buy from.",
  jsonLdServiceType: "Experience Design (UX/UI)",
  metaKeywords: "UI UX design agency Mumbai, experience design",
  hero: {
    overline: "What we build",
    titleParts: [
      { text: "UI/UX design that " },
      { text: "people actually enjoy", accent: true },
      { text: "." },
    ],
    sub: "Great design isn't decoration — it's how easily someone gets what they came for. We combine real user research with clean, confident interface design so your product feels obvious to use, looks the part, and quietly turns more visitors into customers.",
    primaryCta: "Improve my experience",
  },
  values: {
    overline: "Why it matters",
    title: "Clarity converts. Confusion costs.",
    items: [
      { icon: Eye, title: "Instantly clear", body: "People understand what to do and where to go — no manual, no head-scratching." },
      { icon: Smile, title: "A joy to use", body: "Thoughtful interactions and polish that make your product feel premium." },
      { icon: MousePointerClick, title: "More conversions", body: "We remove the friction between interest and action, so more visitors say yes." },
      { icon: Accessibility, title: "Accessible to all", body: "Designs that work for everyone — on every screen and every ability." },
    ],
  },
  process: {
    overline: "The journey",
    title: "How we design — Understand to Iterate.",
    intro: "We design around real people and real evidence, not guesswork — then keep refining after launch.",
    cta: "Map my design plan",
    steps: [
      { icon: Search, title: "Understand", desc: "We study your users, goals and pain points to design for what really matters." },
      { icon: PenTool, title: "Wireframe", desc: "We shape the structure and flow first, so the experience makes sense before it's pretty." },
      { icon: Layout, title: "Design", desc: "We craft a beautiful, consistent interface with your brand at its heart." },
      { icon: Repeat, title: "Iterate", desc: "We test with real users and refine based on how people actually behave." },
    ],
  },
  highlight: {
    overline: "Before & after",
    title: "From confusing to effortless.",
    body: "Cluttered screens, unclear next steps and clunky flows quietly push customers away. We redesign around clarity and confidence — so the right action is always the obvious one, and using your product feels smooth from the first click.",
    bullets: ["Fewer clicks to the goal", "Consistent, on-brand visuals", "Designed and tested with real users"],
    cta: "See a design opportunity",
    diagram: (
      <BeforeAfter
        beforeTitle="Cluttered today"
        afterTitle="Designed with us"
        before={[
          "Unclear next steps",
          "Inconsistent, dated visuals",
          "Too many clicks to convert",
          "Hard to use on mobile",
        ]}
        after={[
          "Obvious, guided journeys",
          "Clean, on-brand interface",
          "Fewer steps, more conversions",
          "Flawless on every screen",
        ]}
      />
    ),
  },
  outcomes: {
    overline: "What you get",
    title: "Design that works as hard as you do.",
    items: [
      { icon: Palette, title: "A distinctive look", body: "An interface that feels unmistakably yours — not a generic template." },
      { icon: Heart, title: "Loyal, happy users", body: "Experiences people enjoy come back to, recommend and trust." },
      { icon: Users, title: "Higher conversion", body: "Clearer journeys mean more sign-ups, purchases and completed tasks." },
    ],
  },
  faqs: [
    { q: "What does experience design include?", a: "It covers the whole experience — user research, information architecture, wireframes, interaction design, visual/UI design and usability testing — so your product is both easy to use and beautiful." },
    { q: "Can you redesign an existing product?", a: "Absolutely. We often start by auditing your current experience, finding the friction points, and improving them step-by-step so you see quick wins without a disruptive overhaul." },
    { q: "Do you design for mobile too?", a: "Yes — every design is responsive and tested across devices, so it looks and works beautifully on phones, tablets and desktops." },
    { q: "How does this fit my budget?", a: "We prioritize the screens and flows with the biggest impact on your goals first, then expand — so your budget goes where it moves the needle most." },
    { q: "Do I own the designs?", a: "Yes — completely. You get full ownership of all design files and assets, so your team can build on them freely." },
  ],
  contact: {
    heading: "Tell us where it feels clunky.",
    sub: "Share the screens or journeys that frustrate your users and we'll show you how good design can fix it — with a budget-aware plan.",
    topics: ["UX/UI Design", "Redesign", "Design Audit", "Not sure yet"],
  },
};

export default function ExperienceDesign() {
  return <ServicePage config={config} />;
}
