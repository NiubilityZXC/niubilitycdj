import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ts from "typescript";

const root = fileURLToPath(new URL("..", import.meta.url));
const detailsRoot = join(root, "public", "site", "details");
const detailsSource = readFileSync(join(root, "app", "details", "data.ts"), "utf8");
const transpiledDetails = ts.transpileModule(detailsSource, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const detailsModuleUrl = `data:text/javascript;base64,${Buffer.from(transpiledDetails).toString("base64")}`;
const { details } = await import(detailsModuleUrl);

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const RIGHTS_NOTICE =
  "除了简历可以下载转发，此网站任何资料、视频、文章以及任何形式的文件版权（包括简历版权）均归 Xuecong Zhou 所有。禁止盗取、借鉴创意、转发、修改、使用、发表或商用。如有任何违规，将依法追究法律责任。";

const renderSections = (sections) =>
  sections
    .map(
      (section, index) => `
        <article class="detail-section">
          <span class="detail-section-number">${String(index + 1).padStart(2, "0")}</span>
          <div>
            <h2>${escapeHtml(section.title)}</h2>
            ${(section.paragraphs ?? []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("\n")}
            ${
              section.bullets?.length
                ? `<ul>${section.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join("\n")}</ul>`
                : ""
            }
          </div>
        </article>`,
    )
    .join("\n");

const renderLinks = (links) => {
  if (!links?.length) return "";

  return `
      <section class="detail-links" aria-labelledby="detail-links-title">
        <div>
          <p>简历中的超链接</p>
          <h2 id="detail-links-title">相关链接</h2>
        </div>
        <div class="detail-link-list">
          ${links
            .map(
              (link) => `
            <a href="${escapeHtml(link.href)}" target="_blank" rel="noreferrer">
              <span><strong>${escapeHtml(link.label)}</strong><small>${escapeHtml(link.description)}</small></span>
              <i aria-hidden="true">↗</i>
            </a>`,
            )
            .join("\n")}
        </div>
      </section>`;
};

const renderMediaGroups = (groups) => {
  if (!groups?.length) return "";

  return groups
    .map((group) => {
      const staticGroup = {
        ...group,
        items: group.items.map((item) => ({
          ...item,
          assetBase: item.assetBase.replace(/^\/site\/media/, "../../media"),
          videos: item.videos?.map((video) => ({
            ...video,
            source: video.source.replace(/^\/site\/media/, "../../media"),
            poster: video.poster.replace(/^\/site\/media/, "../../media"),
          })),
        })),
      };

      return `<section class="detail-media-band" data-media-preview="${escapeHtml(JSON.stringify(staticGroup))}"></section>`;
    })
    .join("\n");
};

const renderPage = (detail, index) => {
  const previous = details[(index - 1 + details.length) % details.length];
  const next = details[(index + 1) % details.length];
  const repeatedTags = [
    ...detail.tags,
    RIGHTS_NOTICE,
    ...detail.tags,
    RIGHTS_NOTICE,
  ];

  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${escapeHtml(detail.summary)}" />
    <meta name="theme-color" content="#0c0c0c" />
    <title>${escapeHtml(detail.title)} | 周学聪</title>
    <link rel="icon" href="../../favicon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="../styles.css?v=20260803video" />
  </head>
  <body>
    <main class="detail-page detail-accent-${detail.accent}">
      <header class="detail-header">
        <a class="detail-brand" href="../../" aria-label="返回周学聪个人网站首页"><span>XZ</span><strong>周学聪</strong></a>
        <div class="detail-header-actions">
          <a class="detail-resume" href="../../xuecong-zhou-cv-cn.pdf" download="周学聪-中文简历.pdf"><span aria-hidden="true">↓</span>下载简历</a>
          <a class="detail-back" href="../../"><span aria-hidden="true">←</span>返回首页</a>
        </div>
      </header>

      <section class="detail-hero" aria-labelledby="detail-title">
        <div class="detail-orbit" aria-hidden="true"><span>${detail.number}</span></div>
        <p class="detail-eyebrow">${detail.number} / ${detail.category}</p>
        <h1 id="detail-title">${escapeHtml(detail.title)}</h1>
        <p class="detail-summary">${escapeHtml(detail.summary)}</p>
        <dl class="detail-meta">
          <div><dt>单位 / 课程</dt><dd>${escapeHtml(detail.subtitle)}</dd></div>
          <div><dt>时间</dt><dd>${escapeHtml(detail.period)}</dd></div>
          <div><dt>地点</dt><dd>${escapeHtml(detail.location)}</dd></div>
        </dl>
      </section>

      <div class="detail-ticker" aria-hidden="true"><div>${repeatedTags.map((tag) => `<span${tag === RIGHTS_NOTICE ? ' class="detail-ticker-rights"' : ""}>${escapeHtml(tag)}</span>`).join("")}</div></div>

      <section class="detail-content" aria-label="${escapeHtml(detail.title)}详细信息">
        <aside class="detail-aside">
          <p>简历详情</p><strong>${String(detail.sections.length).padStart(2, "0")}</strong><span>个内容部分</span>
        </aside>
        <div class="detail-sections">${renderSections(detail.sections)}</div>
      </section>

      ${renderMediaGroups(detail.mediaGroups)}

      ${renderLinks(detail.links)}

      <nav class="detail-pagination" aria-label="浏览其他项目和经历">
        <a href="../${previous.slug}/"><span>← 上一个</span><strong>${escapeHtml(previous.title)}</strong></a>
        <a href="../${next.slug}/"><span>下一个 →</span><strong>${escapeHtml(next.title)}</strong></a>
      </nav>

      <footer class="detail-footer">
        <span>© ${new Date().getFullYear()} Xuecong Zhou</span>
        <a href="mailto:xzhou455@gatech.edu">xzhou455@gatech.edu</a>
      </footer>
    </main>
    <script src="../preview.js?v=20260803video" defer></script>
  </body>
</html>
`;
};

mkdirSync(detailsRoot, { recursive: true });

const appStyles = readFileSync(join(root, "app", "globals.css"), "utf8");
const staticStyles = `@font-face {
  font-family: "Manrope Variable";
  src: url("../assets/fonts/manrope-latin-wght-normal.woff2") format("woff2");
  font-style: normal;
  font-weight: 200 800;
  font-display: swap;
}

${appStyles}`;
writeFileSync(join(detailsRoot, "styles.css"), staticStyles, "utf8");

details.forEach((detail, index) => {
  const targetDir = join(detailsRoot, detail.slug);
  mkdirSync(targetDir, { recursive: true });
  writeFileSync(join(targetDir, "index.html"), renderPage(detail, index), "utf8");
});

console.log(`Generated ${details.length} static detail pages in ${pathToFileURL(detailsRoot).href}`);
