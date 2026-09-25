// Build-time prerender: renders "/" + service routes to static HTML inside build/.
// Runs as `postbuild`. Never fails the build — on any error the plain SPA build is kept.
import { build } from "esbuild";
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const buildDir = join(root, "build");
const outFile = join(root, "node_modules", ".cache", "prerender", "entry.cjs");

// Head tags that a route may override; matching static tags are removed before injection.
const HEAD_KEYS = [
  [/<title>[\s\S]*?<\/title>/g, () => true],
  [/<meta\s+name="description"[^>]*>/g, () => true],
  [/<link\s+rel="canonical"[^>]*>/g, () => true],
  [/<meta\s+property="og:(title|description|url|type|image)"[^>]*>/g, () => true],
  [/<meta\s+name="twitter:(title|description|card)"[^>]*>/g, () => true],
];

function splitHoistables(markup) {
  // React 19 emits <title>/<meta>/<link> hoistables inline; lift them into <head>.
  const head = [];
  const body = markup.replace(
    /<title>[\s\S]*?<\/title>|<meta\s[^>]*>|<link\s+rel="canonical"[^>]*>/g,
    (tag) => {
      head.push(tag);
      return "";
    },
  );
  return { head: head.join("\n"), body };
}

function mergeHead(template, extraHead) {
  let out = template;
  for (const [re] of HEAD_KEYS) {
    const matches = extraHead.match(re);
    if (matches && matches.length) {
      const keys = new Set(
        matches.map((m) => (m.match(/(?:name|property)="([^"]+)"/) || [])[1] || "title"),
      );
      out = out.replace(re, (tag) => {
        const key = (tag.match(/(?:name|property)="([^"]+)"/) || [])[1] || "title";
        return keys.has(key) ? "" : tag;
      });
    }
  }
  return out.replace("</head>", `${extraHead}\n</head>`);
}

async function main() {
  if (!existsSync(join(buildDir, "index.html"))) throw new Error("build/index.html not found");
  mkdirSync(dirname(outFile), { recursive: true });

  await build({
    entryPoints: [join(root, "src", "prerender-entry.jsx")],
    bundle: true,
    platform: "node",
    format: "cjs",
    target: "node18",
    outfile: outFile,
    jsx: "automatic",
    loader: { ".js": "jsx", ".css": "empty", ".png": "empty", ".svg": "empty", ".webp": "empty", ".jpg": "empty" },
    alias: { "@": join(root, "src") },
    define: {
      "process.env.NODE_ENV": '"production"',
      "process.env.REACT_APP_BACKEND_URL": JSON.stringify(process.env.REACT_APP_BACKEND_URL || ""),
    },
    logLevel: "silent",
  });

  const mod = await import(pathToFileURL(outFile).href);
  const { ROUTES, render } = mod.default || mod;
  const template = readFileSync(join(buildDir, "index.html"), "utf8");
  const written = [];

  for (const route of ROUTES) {
    const { html, jsonLd } = render(route);
    const { head, body } = splitHoistables(html);
    let page = mergeHead(template, [head, jsonLd].filter(Boolean).join("\n"));
    page = page.replace('<div id="root"></div>', `<div id="root">${body}</div>`);
    const target = route === "/" ? join(buildDir, "index.html") : join(buildDir, route.slice(1), "index.html");
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, page);
    written.push(route);
  }
  rmSync(dirname(outFile), { recursive: true, force: true });
  console.log(`[prerender] wrote ${written.length} routes: ${written.join(", ")}`);
}

main().catch((err) => {
  console.warn("[prerender] skipped — keeping SPA build. Reason:", err && err.message ? err.message : err);
  process.exitCode = 0;
});
