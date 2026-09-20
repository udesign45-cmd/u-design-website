// Visual QA helper. Usage: node scripts/visual-snapshot.mjs <outdir> <width> <path> [path...]  (full-page screenshots)
import { chromium } from "@playwright/test";
const [outDir, width, ...paths] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: Number(width), height: 900 } });
for (const p of paths) {
  await page.goto(`http://localhost:3000${p}`, { waitUntil: "networkidle" });
  const name =
    (p === "/" ? "home" : p.replace(/[\/#?=&]+/g, "_").replace(/^_/, "")) + `-${width}.png`;
  await page.screenshot({ path: `${outDir}/${name}`, fullPage: true });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  process.stdout.write(`${name} overflow=${overflow}\n`);
}
await browser.close();
