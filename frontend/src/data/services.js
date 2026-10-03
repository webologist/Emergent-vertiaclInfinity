import { Rocket, Workflow, Layers, Bot, PenTool, ShoppingBag, Gauge, LifeBuoy } from "lucide-react";

export const SERVICE_INDEX = {
  "product-development": {
    name: "Product Development",
    path: "/product-development",
    icon: Rocket,
    blurb: "From idea to launch and beyond — built to your budget, with full IP ownership.",
  },
  "workflow-automation": {
    name: "Workflow Automation",
    path: "/workflow-automation",
    icon: Workflow,
    blurb: "Map, design and connect the manual processes that slow your team down.",
  },
  "legacy-modernization": {
    name: "Legacy Modernization",
    path: "/legacy-modernization",
    icon: Layers,
    blurb: "Stabilise ageing platforms and rebuild them in phases — without risky big-bang rewrites.",
  },
  "ai-automation": {
    name: "AI & Automation",
    path: "/ai-automation",
    icon: Bot,
    blurb: "Practical assistants, agents and automations wired into the systems you already use.",
  },
  "experience-design": {
    name: "Experience Design",
    path: "/experience-design",
    icon: PenTool,
    blurb: "Research-led UX and UI that turns visitors into customers and users into fans.",
  },
  "digital-commerce": {
    name: "Digital Commerce",
    path: "/digital-commerce",
    icon: ShoppingBag,
    blurb: "Storefronts, catalog and ERP integrations, and checkouts that convert.",
  },
  "performance-services": {
    name: "Performance Services",
    path: "/performance-services",
    icon: Gauge,
    blurb: "Speed, Core Web Vitals, SEO and reliability engineering for platforms that must not stall.",
  },
  "managed-support": {
    name: "Managed Support",
    path: "/managed-support",
    icon: LifeBuoy,
    blurb: "Monitoring, maintenance and steady enhancements so you can stop worrying.",
  },
};

export const RELATED_SERVICES = {
  "product-development": ["experience-design", "ai-automation", "managed-support"],
  "workflow-automation": ["ai-automation", "legacy-modernization", "managed-support"],
  "legacy-modernization": ["performance-services", "workflow-automation", "managed-support"],
  "ai-automation": ["workflow-automation", "product-development", "digital-commerce"],
  "experience-design": ["product-development", "digital-commerce", "performance-services"],
  "digital-commerce": ["experience-design", "performance-services", "ai-automation"],
  "performance-services": ["managed-support", "legacy-modernization", "digital-commerce"],
  "managed-support": ["performance-services", "product-development", "workflow-automation"],
};
