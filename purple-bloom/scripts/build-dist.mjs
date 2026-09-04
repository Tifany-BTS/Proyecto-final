// Assembles the static site into dist/ for deployment (e.g. Netlify's
// publish directory). Run after `tsc` via `npm run build`.
import { cpSync, rmSync, mkdirSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

const staticDirs = ["css", "img", "js"];
const staticFiles = ["robots.txt", "sitemap.xml"];

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist);

for (const entry of readdirSync(root, { withFileTypes: true })) {
  if (entry.isFile() && entry.name.endsWith(".html")) {
    cpSync(join(root, entry.name), join(dist, entry.name));
  }
}

for (const dir of staticDirs) {
  cpSync(join(root, dir), join(dist, dir), { recursive: true });
}

for (const file of staticFiles) {
  cpSync(join(root, file), join(dist, file));
}

console.log("dist/ listo para publicar.");
