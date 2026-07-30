import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const source = join(root, "public", "site");
const output = join(root, "tmp", "github-pages");
const requestedBase = process.env.GITHUB_PAGES_BASE ?? "/";
const basePath = `/${requestedBase.replace(/^\/+|\/+$/g, "")}/`.replace("//", "/");

rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
cpSync(source, output, {
  recursive: true,
  filter: (entry) => {
    const relative = entry.slice(source.length).replaceAll("\\", "/");
    return relative !== "/.vercel" && relative !== "/.gitignore";
  },
});

const homePath = join(output, "index.html");
const home = readFileSync(homePath, "utf8").replaceAll(
  'href="/details/',
  `href="${basePath}details/`,
);

writeFileSync(homePath, home, "utf8");
writeFileSync(join(output, ".nojekyll"), "", "utf8");

console.log(`GitHub Pages output created at ${output} with base path ${basePath}`);
