import {
  Search, GitBranch, PlugZap, Activity,
  Clock, ShieldCheck, TrendingDown, Repeat, Zap, LineChart, Users,
} from "lucide-react";
import ServicePage from "@/pages/ServicePage";
import { BeforeAfter } from "@/components/diagrams/PDDiagrams";

const config = {
  slug: "workflow-automation",
  path: "/workflow-automation",
  breadcrumb: "Workflow Automation",
  title: "Workflow Automation Services | Vertical Infinity — Cut Busywork, Move Faster",
  metaDescription:
    "Vertical Infinity automates the repetitive work slowing your team down — connecting your tools into reliable, error-free workflows. Clear process, full ownership, built to your budget since 2003.",
  ogTitle: "Workflow Automation Services | Vertical Infinity",
  ogDescription: "Stop doing by hand what software can do for you. Reliable, custom automation that saves hours every week.",
  jsonLdServiceType: "Workflow Automation",
  hero: {
    overline: "What we build",
    titleParts: [
      { text: "Workflow automation that " },
      { text: "gives you back your time", accent: true },
      { text: "." },
    ],
    sub: "Manual tasks and disconnected tools quietly drain your team every single day. We connect your systems and automate the repetitive work — so things just happen, accurately, without anyone chasing them. Less busywork, fewer errors, more hours for the work that matters.",
    primaryCta: "Automate my workflows",
  },
  values: {
    overline: "Why teams love it",
    title: "Less manual work. Fewer mistakes. More momentum.",
    items: [
      { icon: Clock, title: "Hours back every week", body: "We remove the copy-paste, the chasing and the double-entry that eat your team's day." },
      { icon: ShieldCheck, title: "Fewer human errors", body: "Automated steps run the same way every time — no missed handoffs or typos." },
      { icon: PlugZap, title: "Your tools, connected", body: "We wire up the apps you already use so data flows between them automatically." },
      { icon: TrendingDown, title: "Lower running cost", body: "Do more with the same team — automation scales without adding headcount." },
    ],
  },
  process: {
    overline: "The journey",
    title: "How we automate — Map to Monitor.",
    intro: "We start by understanding exactly how you work today, then automate it step-by-step without disrupting your operations.",
    cta: "Map my workflows",
    steps: [
      { icon: Search, title: "Map", desc: "We shadow your current process and pinpoint the repetitive, error-prone steps." },
      { icon: GitBranch, title: "Design", desc: "We design a clear automated flow with the right checks and approvals built in." },
      { icon: PlugZap, title: "Connect", desc: "We integrate your tools and build the automation in small, testable pieces." },
      { icon: Activity, title: "Monitor", desc: "We watch it run, tune it, and keep it reliable as your business changes." },
    ],
  },
  highlight: {
    overline: "Before & after",
    title: "From chaos to a calm, reliable flow.",
    body: "Most teams are stitched together with spreadsheets, email threads and manual follow-ups. We replace that friction with automation that quietly does the work in the background — freeing your people to focus on customers, not clerical tasks.",
    bullets: ["No more copy-paste between apps", "Nothing slips through the cracks", "Real-time visibility into every step"],
    cta: "See what we can automate",
    diagram: (
      <BeforeAfter
        beforeTitle="Manual today"
        afterTitle="Automated with us"
        before={[
          "Copy-pasting data between tools",
          "Chasing approvals over email",
          "Missed steps and typos",
          "No clear view of status",
        ]}
        after={[
          "Data syncs across tools instantly",
          "Approvals routed automatically",
          "Consistent, error-free runs",
          "Live dashboards for everyone",
        ]}
      />
    ),
  },
  outcomes: {
    overline: "What you get",
    title: "Automation that pays for itself.",
    items: [
      { icon: Zap, title: "Work that runs itself", body: "Routine tasks trigger and complete automatically — day or night, without reminders." },
      { icon: LineChart, title: "Measurable time saved", body: "We track the hours reclaimed so you can see the return, not just feel it." },
      { icon: Users, title: "A happier team", body: "People stop doing soul-draining busywork and get back to meaningful, high-value work." },
    ],
  },
  faqs: [
    { q: "What kinds of workflows can you automate?", a: "Almost any repetitive, rules-based process — lead capture and routing, invoicing and reminders, onboarding, data entry between tools, reporting, approvals and notifications. If your team does it the same way each time, we can usually automate it." },
    { q: "Will automation disrupt my current operations?", a: "No. We map your existing process first and roll out automation in small, testable pieces alongside your current way of working, so there's no risky big-bang switch." },
    { q: "Do I need to replace the software I already use?", a: "Usually not. We connect the tools you already rely on so data flows between them automatically — we only recommend a change when it genuinely saves you money or effort." },
    { q: "Is this built to my budget?", a: "Yes. We start by automating the highest-impact tasks first so you see value quickly, then expand at a pace that fits your budget." },
    { q: "Who owns the automations you build?", a: "You do — completely. You keep full ownership of the workflows, integrations and any code, so you're never locked in." },
  ],
  contact: {
    heading: "Tell us what's slowing you down.",
    sub: "Describe the manual work eating your team's time and we'll show you what can be automated — with a clear, budget-aware plan.",
    topics: ["Automation", "Integrations", "Reporting", "Not sure yet"],
  },
};

export default function WorkflowAutomation() {
  return <ServicePage config={config} />;
}
