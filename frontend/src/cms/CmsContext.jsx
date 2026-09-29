import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const API = process.env.REACT_APP_BACKEND_URL || "";
const CmsContext = createContext({ overrides: {}, setOverride: () => {}, loaded: false });

// Keys that must stay plain text (used in hrefs, comparisons, test ids, meta tags).
export const PLAIN_KEY_RE =
  /(^nav\.|^service\.[^.]+\.(title|metaDescription|ogTitle|ogDescription|breadcrumb|jsonLdServiceType)$|^legal\.[^.]+\.(title|metaDescription|updated)$|\.(label|overline|tags|topics|name|whatsapp|email|address|copyright|accentWord|lines|primaryCta|secondaryCta|cta|ctaLabel|kicker|badge|q|links|heading|value|no|author|stat)(\.\d+)?$)/;
// Keys never exposed for editing.
export const SKIP_KEY_RE = /(^|\.)(slug|path|href|ctaHref|to|url|src|id|icon|accent|service|priority|mapQuery|logo|picture|image|testid|external)(\.\d+)?$/;

const HAS_TAG = /<[a-z][\s\S]*>/i;
const stripTags = (s) => s.replace(/<[^>]+>/g, "");

export function Rich({ html, className = "" }) {
  const m = html.match(/^\s*<p>([\s\S]*?)<\/p>\s*$/);
  const inner = m && !m[1].includes("<p") ? m[1] : html;
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
  const [loaded, setLoaded] = useState(false);

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

  const value = useMemo(() => ({ overrides, setOverride, loaded }), [overrides, setOverride, loaded]);
  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export const useCms = () => useContext(CmsContext);

// Returns `obj` with any saved overrides applied under `prefix`.
export function useContent(prefix, obj) {
  const { overrides } = useCms();
  return useMemo(() => applyOverrides(prefix, obj, overrides), [prefix, obj, overrides]);
}
