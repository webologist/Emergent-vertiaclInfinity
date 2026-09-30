import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import DOMPurify from "dompurify";

const API = process.env.REACT_APP_BACKEND_URL || "";
const CmsContext = createContext({ overrides: {}, setOverride: () => {}, loaded: false });

// Keys that must stay plain text (used in hrefs, comparisons, test ids, meta tags).
export const PLAIN_KEY_RE =
  /(^nav\.|^service\.[^.]+\.(title|metaDescription|ogTitle|ogDescription|breadcrumb|jsonLdServiceType)$|^legal\.[^.]+\.(title|metaDescription|updated)$|\.(label|overline|tags|topics|name|whatsapp|email|address|copyright|accentWord|lines|primaryCta|secondaryCta|cta|ctaLabel|kicker|badge|q|links|heading|value|no|author|stat|image|logo|src)(\.\d+)?$)/;
// Keys never exposed for editing.
export const SKIP_KEY_RE = /(^|\.)(slug|path|href|ctaHref|to|url|id|icon|accent|service|priority|mapQuery|picture|testid|external)(\.\d+)?$/;

const HAS_TAG = /<[a-z][\s\S]*>/i;
const stripTags = (s) => s.replace(/<[^>]+>/g, "");

const PURIFY_OPTS = {
  ALLOWED_TAGS: ["p", "br", "strong", "b", "em", "i", "u", "s", "a", "ul", "ol", "li", "span", "h1", "h2", "h3", "h4", "blockquote", "sub", "sup"],
  ALLOWED_ATTR: ["href", "target", "rel", "class"],
  ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
};

// Server already sanitises with nh3; DOMPurify here is defence in depth (client-only — SSR never renders overrides).
export function Rich({ html, className = "" }) {
  const clean = typeof window === "undefined" ? "" : DOMPurify.sanitize(html, PURIFY_OPTS);
  const m = clean.match(/^\s*<p>([\s\S]*?)<\/p>\s*$/);
  const inner = m && !m[1].includes("<p") ? m[1] : clean;
  return <span className={`cms-rich ${className}`} dangerouslySetInnerHTML={{ __html: inner }} />;
}

function walk(node, prefix, overrides) {
  if (typeof node === "string") {
    const ov = overrides[prefix];
    if (ov === undefined) return node;
    if (PLAIN_KEY_RE.test(prefix)) return stripTags(ov);
    return HAS_TAG.test(ov) ? <Rich key={prefix} html={ov} /> : ov;
  }
  if (Array.isArray(node)) return node.map((v, i) => walk(v, `${prefix}.${i}`, overrides));
  if (node && typeof node === "object" && !node.$$typeof) {
    const out = {};
    for (const k of Object.keys(node)) out[k] = walk(node[k], prefix ? `${prefix}.${k}` : k, overrides);
    return out;
  }
  return node;
}

export function applyOverrides(prefix, obj, overrides) {
  if (!overrides || Object.keys(overrides).length === 0) return obj;
  return walk(obj, prefix, overrides);
}

export function ContentProvider({ children }) {
  const [overrides, setOverrides] = useState({});
  const [preview, setPreview] = useState({});
  const [loaded, setLoaded] = useState(false);

  // Live preview: when embedded in the admin editor's iframe, accept draft overrides via postMessage.
  useEffect(() => {
    if (typeof window === "undefined" || window.self === window.top) return;
    const onMsg = (e) => {
      if (e.origin !== window.location.origin || e.data?.type !== "cms-preview") return;
      setPreview(e.data.overrides || {});
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ type: "cms-preview-ready" }, window.location.origin);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  useEffect(() => {
    fetch(`${API}/api/content`)
      .then((r) => (r.ok ? r.json() : {}))
      .then((d) => setOverrides(d || {}))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const setOverride = useCallback((key, value) => {
    setOverrides((prev) => {
      const next = { ...prev };
      if (value === null || value === undefined) delete next[key];
      else next[key] = value;
      return next;
    });
  }, []);

  const merged = useMemo(() => ({ ...overrides, ...preview }), [overrides, preview]);
  const value = useMemo(() => ({ overrides: merged, saved: overrides, setOverride, loaded }), [merged, overrides, setOverride, loaded]);
  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export const useCms = () => useContext(CmsContext);

// Returns `obj` with any saved overrides applied under `prefix`.
export function useContent(prefix, obj) {
  const { overrides } = useCms();
  return useMemo(() => applyOverrides(prefix, obj, overrides), [prefix, obj, overrides]);
}
