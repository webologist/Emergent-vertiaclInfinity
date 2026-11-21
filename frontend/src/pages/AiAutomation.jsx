import {
  Brain, Database, Cpu, Bot,
  Sparkles, Clock, ShieldCheck, TrendingUp, MessageSquare, Search, Gauge,
} from "lucide-react";
import ServicePage from "@/pages/ServicePage";
import { LadderDiagram } from "@/components/diagrams/PDDiagrams";

const TIERS = [
  { label: "Assist", h: 40, note: "AI helps your team work faster" },
  { label: "Automate", h: 72, note: "AI runs tasks end-to-end" },
  { label: "Predict", h: 100, note: "AI anticipates & recommends" },
];

export const config = {
  slug: "ai-automation",
  path: "/ai-automation",
  breadcrumb: "AI & Automation",
  title: "AI Agents for Business & Chatbot Development | Vertical Infinity",
  metaDescription:
    "AI agents for business from an AI chatbot development company in India — assistants, smart automation and predictions that save time and cut costs.",
  ogTitle: "AI & Automation Services | Vertical Infinity",
  ogDescription: "Practical, safe AI that actually helps — from smart assistants to automated workflows and predictions.",
  jsonLdServiceType: "AI & Automation",
  metaKeywords: "AI automation agency in Mumbai, AI agents for business, AI chatbot development company India",
  hero: {
    overline: "What we build",
    titleParts: [
      { text: "AI agents & automation for business that do real work — " },
      { text: "not just hype", accent: true },
      { text: "." },
    ],
    sub: "Everyone's talking about AI. We help you actually use it — safely and sensibly. From smart assistants and document processing to automated decisions and predictions, we plug practical AI into your day-to-day so your team moves faster and your customers get better answers.",
    primaryCta: "Explore AI for my business",
  },
  values: {
    overline: "Why it works",
    title: "Practical AI, grounded in your business.",
    items: [
      { icon: Clock, title: "Save real hours", body: "AI handles summarizing, drafting, tagging and routing so your people don't have to." },
      { icon: MessageSquare, title: "Smarter customer answers", body: "Assistants trained on your content reply instantly and accurately, around the clock." },
      { icon: ShieldCheck, title: "Safe & private", body: "We keep your data protected with the right guardrails, access controls and review steps." },
      { icon: TrendingUp, title: "Better decisions", body: "Turn your data into predictions and recommendations you can actually act on." },
    ],
  },
  process: {
    overline: "The journey",
    title: "How we bring AI in — Identify to Improve.",
    intro: "We look for where AI genuinely helps, then build it in carefully with humans in the loop.",
    cta: "Find my AI opportunities",
    steps: [
      { icon: Search, title: "Identify", desc: "We find the tasks and decisions where AI saves the most time or money." },
      { icon: Database, title: "Prepare", desc: "We connect and clean the data the AI needs to be accurate and useful." },
      { icon: Cpu, title: "Build", desc: "We build the assistant or automation with guardrails and human review." },
      { icon: Brain, title: "Improve", desc: "We monitor quality, retrain and refine so it keeps getting better over time." },
    ],
  },
  highlight: {
    overline: "From assist to predict",
    title: "Start small, grow into intelligence.",
    body: "You don't need a moonshot to benefit from AI. We start with a focused assistant or automation that pays off quickly, then expand toward automated workflows and predictive insight as trust and value grow.",
    bullets: ["Human-in-the-loop by default", "Your data stays yours and protected", "Measurable time and cost savings"],
    cta: "Plan my AI roadmap",
    diagram: (
      <LadderDiagram
        tiers={TIERS}
        caption="Grow from AI that assists your team to AI that automates and predicts — at your pace."
        testid="ai-ladder-diagram"
      />
    ),
  },
  outcomes: {
    overline: "What you get",
    title: "AI that earns its keep.",
    items: [
      { icon: Bot, title: "Assistants that actually help", body: "Grounded in your content, so answers are accurate — not confidently wrong." },
      { icon: Gauge, title: "Faster operations", body: "Repetitive thinking-work gets done in seconds, freeing your team for judgement calls." },
      { icon: Sparkles, title: "An edge over competitors", body: "Use your data to spot opportunities and risks before the rest of your market does." },
    ],
  },
  faqs: [
    { q: "What can AI realistically do for my business?", a: "Plenty of practical things — answering customer questions, drafting and summarizing content, extracting data from documents, tagging and routing requests, and surfacing predictions from your data. We focus on the uses that clearly save time or money for you." },
    { q: "Is my data safe with AI?", a: "Yes. We design with privacy and guardrails from the start — controlling what data is used, where it goes, and adding human review where it matters. Your data stays yours." },
    { q: "Will AI replace my team?", a: "No — we build AI to support your team, not replace it. It removes tedious work and speeds up decisions, so your people focus on the judgement and relationships only humans can handle." },
    { q: "Do I need a huge budget to start?", a: "No. We start with one high-value use case that pays off quickly, then expand only as it proves its worth — so spend stays tied to results." },
    { q: "Who owns the AI solutions you build?", a: "You do — completely. You retain full ownership of the workflows, integrations and code, so you're never locked in." },
  ],
  contact: {
    heading: "Tell us where AI could help.",
    sub: "Describe a task or decision that eats time in your business and we'll show you a practical, safe way AI can help — with a budget-aware plan.",
    topics: ["AI Assistant", "Automation", "Data & Insights", "Not sure yet"],
  },
};

export default function AiAutomation() {
  return <ServicePage config={config} />;
}
