import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const sourceDir = join(root, "public", "site");
const stageRoot = resolve(root, "tmp", "meoo-deploy");
const expectedStagePrefix = `${resolve(root, "tmp")}${sep}`;

if (!stageRoot.startsWith(expectedStagePrefix)) {
  throw new Error(`Unsafe Meoo staging path: ${stageRoot}`);
}

const readText = (...parts) => readFileSync(join(sourceDir, ...parts), "utf8");
const dataUrl = (mimeType, ...parts) => {
  const encoded = readFileSync(join(sourceDir, ...parts)).toString("base64");
  return `data:${mimeType};base64,${encoded}`;
};

const manropeFont = dataUrl("font/woff2", "assets", "fonts", "manrope-latin-wght-normal.woff2");
const phosphorFont = dataUrl("font/woff2", "assets", "vendor", "phosphor", "Phosphor.woff2");
const systemsVisual = dataUrl("image/png", "assets", "systems-visual.png");
const favicon = dataUrl("image/svg+xml", "favicon.svg");

let mainCss = readText("styles.css").replace(
  'url("./assets/fonts/manrope-latin-wght-normal.woff2")',
  `url("${manropeFont}")`,
);

let phosphorCss = readText("assets", "vendor", "phosphor", "style.css").replace(
  /src:\s*url\("\.\/Phosphor\.woff2"\)[\s\S]*?;/,
  `src: url("${phosphorFont}") format("woff2");`,
);

const escapeStyle = (source) => source.replaceAll("</style", "<\\/style");
const escapeScript = (source) => source.replaceAll("</script", "<\\/script");

let html = readText("index.html");

const replaceOnce = (search, replacement, label) => {
  if (!html.includes(search)) {
    throw new Error(`Missing expected ${label} reference in index.html`);
  }
  html = html.replace(search, () => replacement);
};

replaceOnce(
  '<link rel="icon" href="./favicon.svg" type="image/svg+xml" />',
  `<link rel="icon" href="${favicon}" type="image/svg+xml" />`,
  "favicon",
);
replaceOnce(
  '<link rel="stylesheet" href="./assets/vendor/phosphor/style.css" />',
  "",
  "Phosphor stylesheet",
);
replaceOnce(
  '<link rel="stylesheet" href="./styles.css" />',
  `<style>\n${escapeStyle(phosphorCss)}\n${escapeStyle(mainCss)}\n</style>`,
  "main stylesheet",
);

html = html.replaceAll("./assets/systems-visual.png", systemsVisual);

replaceOnce(
  '<script src="./assets/vendor/gsap/gsap.min.js"></script>',
  `<script>${escapeScript(readText("assets", "vendor", "gsap", "gsap.min.js"))}</script>`,
  "GSAP script",
);
replaceOnce(
  '<script src="./assets/vendor/gsap/ScrollTrigger.min.js"></script>',
  `<script>${escapeScript(readText("assets", "vendor", "gsap", "ScrollTrigger.min.js"))}</script>`,
  "ScrollTrigger script",
);
replaceOnce(
  '<script src="./script.js" defer></script>',
  `<script>${escapeScript(readText("script.js"))}</script>`,
  "site script",
);

const unresolvedMarkup = html.match(/(?:src|href)=["']\.\/[^"']+/g) ?? [];
const unresolvedCss = html.match(/url\(["']?\.\//g) ?? [];
if (unresolvedMarkup.length || unresolvedCss.length) {
  throw new Error(`Unresolved Meoo asset references: ${[...unresolvedMarkup, ...unresolvedCss].join(", ")}`);
}

const outputFile = join(stageRoot, "dist", "index.html");
rmSync(stageRoot, { recursive: true, force: true });
mkdirSync(dirname(outputFile), { recursive: true });
writeFileSync(outputFile, html, "utf8");

console.log(`Built self-contained Meoo page: ${outputFile} (${Buffer.byteLength(html)} bytes)`);
