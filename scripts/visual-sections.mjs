// Visual QA helper: screenshots each top-level <section> (and header/footer) of a page.
// Usage: node scripts/visual-sections.mjs <outdir> <width> <path>
import { chromium } from "@playwright/test";
const [outDir, width, path] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: Number(width), height: 900 } });
await page.goto(`http://localhost:3000${path}`, { waitUntil: "networkidle" });
const handles = await page.$$("main > section, main > * > section, footer");
const base =
  (path === "/" ? "home" : path.replace(/[\/#?=&]+/g, "_").replace(/^_/, "")) + `-${width}`;
let i = 0;
for (const h of handles) {
  const box = await h.boundingBox();
  if (!box || box.height < 10) continue;
  await h.screenshot({ path: `${outDir}/${base}-s${String(i).padStart(2, "0")}.png` });
  process.stdout.write(`${base}-s${String(i).padStart(2, "0")} h=${Math.round(box.height)}\n`);
  i++;
}
await browser.close();
