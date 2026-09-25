import { renderToStaticMarkup } from "react-dom/server";
import { StaticRouter } from "react-router";
import { AppInner } from "@/App";
import { buildJsonLd } from "@/pages/ServicePage";
import { config as productDevelopment } from "@/pages/ProductDevelopment";
import { config as workflowAutomation } from "@/pages/WorkflowAutomation";
import { config as legacyModernization } from "@/pages/LegacyModernization";
import { config as aiAutomation } from "@/pages/AiAutomation";
import { config as experienceDesign } from "@/pages/ExperienceDesign";
import { config as digitalCommerce } from "@/pages/DigitalCommerce";
import { config as performanceServices } from "@/pages/PerformanceServices";
import { config as managedSupport } from "@/pages/ManagedSupport";
import { LEGAL_PAGES } from "@/data/legal";

const SERVICES = [
  productDevelopment, workflowAutomation, legacyModernization, aiAutomation,
  experienceDesign, digitalCommerce, performanceServices, managedSupport,
];

export const ROUTES = ["/", ...SERVICES.map((c) => c.path), ...LEGAL_PAGES.map((p) => p.path)];

export function render(path) {
  const html = renderToStaticMarkup(
    <StaticRouter location={path}>
      <AppInner />
    </StaticRouter>,
  );
  const cfg = SERVICES.find((c) => c.path === path);
  const jsonLd = cfg
    ? buildJsonLd(cfg).map((o) => `<script type="application/ld+json" data-sp-jsonld="${cfg.slug}">${JSON.stringify(o)}</script>`).join("\n")
    : "";
  return { html, jsonLd };
}
