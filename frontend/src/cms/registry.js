import { NAV, HERO, FOCUS, SME, GROWTH, JOURNEY, CONTACT, FOOTER } from "@/data/content";
import { PRIVACY_POLICY, TERMS_OF_SERVICE } from "@/data/legal";
import { SITUATIONS, PRIORITIES } from "@/data/serviceHelper";
import { SERVICE_INDEX } from "@/data/services";
import { config as productDevelopment } from "@/pages/ProductDevelopment";
import { config as workflowAutomation } from "@/pages/WorkflowAutomation";
import { config as legacyModernization } from "@/pages/LegacyModernization";
import { config as aiAutomation } from "@/pages/AiAutomation";
import { config as experienceDesign } from "@/pages/ExperienceDesign";
import { config as digitalCommerce } from "@/pages/DigitalCommerce";
import { config as performanceServices } from "@/pages/PerformanceServices";
import { config as managedSupport } from "@/pages/ManagedSupport";
import { PLAIN_KEY_RE, SKIP_KEY_RE } from "./CmsContext";

const SERVICES = [productDevelopment, workflowAutomation, legacyModernization, aiAutomation, experienceDesign, digitalCommerce, performanceServices, managedSupport];

// prefix → source object. Prefixes must match the ones components pass to useContent().
export const CONTENT_GROUPS = [
  { id: "home", label: "Homepage", sources: { nav: NAV, hero: HERO, focus: FOCUS, sme: SME, growth: GROWTH, journey: JOURNEY, contact: CONTACT, finder: { situations: SITUATIONS, priorities: PRIORITIES }, services: SERVICE_INDEX } },
  { id: "footer", label: "Footer", sources: { footer: FOOTER } },
  ...SERVICES.map((c) => ({ id: `service-${c.slug}`, label: `Service · ${c.breadcrumb}`, sources: { [`service.${c.slug}`]: c } })),
  { id: "legal", label: "Legal pages", sources: { "legal.privacy-policy": PRIVACY_POLICY, "legal.terms-of-service": TERMS_OF_SERVICE } },
];

const humanize = (key) =>
  key
    .split(".")
    .slice(1)
    .map((p) => (/^\d+$/.test(p) ? `#${Number(p) + 1}` : p.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())))
    .join(" › ");

export function flattenSource(prefix, node, out = []) {
  if (typeof node === "string") {
    if (SKIP_KEY_RE.test(prefix) || /^(\/|#|https?:|mailto:|tel:)/.test(node) || !node.trim()) return out;
    out.push({ key: prefix, defaultValue: node, label: humanize(prefix), rich: !PLAIN_KEY_RE.test(prefix) });
  } else if (Array.isArray(node)) {
    node.forEach((v, i) => flattenSource(`${prefix}.${i}`, v, out));
  } else if (node && typeof node === "object") {
    Object.keys(node).forEach((k) => flattenSource(`${prefix}.${k}`, node[k], out));
  }
  return out;
}

export function fieldsForGroup(group) {
  return Object.entries(group.sources).flatMap(([prefix, src]) => flattenSource(prefix, src));
}
