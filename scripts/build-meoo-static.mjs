import { cpSync, copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
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
const coastMotionPoster = dataUrl("image/webp", "assets", "coast-motion-meoo-poster.webp");
const coastMotionVideo = dataUrl("video/mp4", "assets", "coast-motion-meoo-hd.mp4");
const visionDemoPoster = dataUrl("image/webp", "media", "visionrl", "video", "main-demo-poster.webp");
const visionDemoVideo = dataUrl("video/mp4", "media", "visionrl", "video", "main-demo.mp4");
const favicon = dataUrl("image/svg+xml", "favicon.svg");
const resumePdfBase64 = readFileSync(join(sourceDir, "xuecong-zhou-cv-cn.pdf")).toString("base64");

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
  '<link rel="stylesheet" href="./styles.css?v=20260730media" />',
  `<style>\n${escapeStyle(phosphorCss)}\n${escapeStyle(mainCss)}\n</style>`,
  "main stylesheet",
);

html = html.replaceAll("./assets/systems-visual.png", systemsVisual);
html = html.replaceAll("./assets/coast-motion-hd-poster.webp", coastMotionPoster);
html = html.replaceAll("./assets/coast-motion-hd.mp4", coastMotionVideo);
html = html.replaceAll("./media/visionrl/video/main-demo-poster.webp", visionDemoPoster);
html = html.replaceAll("./media/visionrl/video/main-demo.mp4", visionDemoVideo);
html = html.replaceAll("./xuecong-zhou-cv-cn.pdf", "#download-resume");
html = html.replace(/href="\/details\/([^"]+)"/g, 'href="./details/$1/index.html"');

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
  '<script src="./script.js?v=20260730media" defer></script>',
  `<script>${escapeScript(readText("script.js"))}</script>`,
  "site script",
);
replaceOnce(
  "</body>",
  `<script>
    (() => {
      const binary = atob("${resumePdfBase64}");
      const bytes = new Uint8Array(binary.length);
      for (let index = 0; index < binary.length; index += 1) {
        bytes[index] = binary.charCodeAt(index);
      }
      const resumeUrl = URL.createObjectURL(new Blob([bytes], { type: "application/pdf" }));
      document.querySelectorAll('a[href="#download-resume"]').forEach((link) => {
        link.href = resumeUrl;
      });
      window.addEventListener("pagehide", () => URL.revokeObjectURL(resumeUrl), { once: true });
    })();
  </script>
</body>`,
  "body closing tag",
);

const unresolvedMarkup = (html.match(/(?:src|href)=["']\.\/[^"']+/g) ?? []).filter(
  (reference) => !reference.startsWith('href="./details/'),
);
const unresolvedCss = html.match(/url\(["']?\.\//g) ?? [];
if (unresolvedMarkup.length || unresolvedCss.length) {
  throw new Error(`Unresolved Meoo asset references: ${[...unresolvedMarkup, ...unresolvedCss].join(", ")}`);
}

const outputFile = join(stageRoot, "dist", "index.html");
const outputDir = dirname(outputFile);
rmSync(stageRoot, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });
writeFileSync(outputFile, html, "utf8");

const copyTree = (source, target) =>
  cpSync(source, target, { recursive: true, filter: () => true });

copyTree(join(sourceDir, "details"), join(outputDir, "details"));
copyTree(join(sourceDir, "media"), join(outputDir, "media"));
copyTree(join(sourceDir, "assets", "fonts"), join(outputDir, "assets", "fonts"));
copyFileSync(join(sourceDir, "favicon.svg"), join(outputDir, "favicon.svg"));
copyFileSync(join(sourceDir, "xuecong-zhou-cv-cn.pdf"), join(outputDir, "xuecong-zhou-cv-cn.pdf"));

console.log(
  `Built Meoo multipage site with an embedded homepage and local detail media: ${outputDir}`,
);
