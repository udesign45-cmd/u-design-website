// Local Lighthouse runner (Windows-friendly). Lighthouse CI's Chrome launcher
// fails to clean up its temp profile on Windows, so this script launches
// Chromium through Playwright and points Lighthouse at its debugging port.
// CI (Linux) uses `npm run lhci` with lighthouserc.json instead.
//
// Usage: node scripts/lighthouse-local.mjs [baseUrl] [path...]
import { mkdirSync, writeFileSync } from "node:fs";
import { chromium } from "@playwright/test";
import lighthouse from "lighthouse";

const [baseUrl = "http://localhost:3100", ...rest] = process.argv.slice(2);
const paths = rest.length
  ? rest
  : [
      "/",
      "/solutions/erp",
      "/industries/manufacturing",
      "/portfolio/manufacturing-erp",
      "/contact",
    ];

const PORT = 9333;
const browser = await chromium.launch({ args: [`--remote-debugging-port=${PORT}`] });
mkdirSync(".lighthouseci/local", { recursive: true });

const out = (s) => process.stdout.write(`${s}\n`);
let failed = false;

const RUNS = Number(process.env.LH_RUNS ?? 3);

// Optional calibration (LH_CALIBRATE=1): Lighthouse's 4x CPU slowdown assumes a
// reference host (benchmarkIndex around 1400). On a slower or busy machine the
// same multiplier emulates a far slower phone, so scale it to the measured
// benchmark to approximate the standard mobile profile used by CI/PageSpeed.
let flags = { port: PORT, output: "json", logLevel: "error" };
// LH_METHOD=devtools applies real network/CPU throttling instead of simulation.
if (process.env.LH_METHOD === "devtools") flags = { ...flags, throttlingMethod: "devtools" };
if (process.env.LH_CALIBRATE === "1") {
  const probe = await lighthouse(`${baseUrl}/`, { ...flags, onlyCategories: ["performance"] });
  const benchmark = probe.lhr.environment.benchmarkIndex;
  const multiplier = Math.max(1, Math.min(4, (4 * benchmark) / 1400));
  out(
    `calibrated cpuSlowdownMultiplier=${multiplier.toFixed(2)} (benchmarkIndex ${Math.round(benchmark)})`,
  );
  flags = { ...flags, throttling: { cpuSlowdownMultiplier: multiplier } };
}

for (const path of paths) {
  const url = `${baseUrl}${path}`;
  // Run several times and keep the median performance run (Lighthouse CI default).
  const runs = [];
  for (let i = 0; i < RUNS; i++) {
    runs.push(await lighthouse(url, flags));
  }
  runs.sort(
    (a, b) => (a.lhr.categories.performance.score ?? 0) - (b.lhr.categories.performance.score ?? 0),
  );
  const result = runs[Math.floor(runs.length / 2)];
  const lhr = result.lhr;
  const score = (k) => Math.round((lhr.categories[k]?.score ?? 0) * 100);
  const metric = (id) => lhr.audits[id]?.numericValue ?? NaN;
  const scripts = lhr.audits["resource-summary"]?.details?.items?.find(
    (i) => i.resourceType === "script",
  );
  const styles = lhr.audits["resource-summary"]?.details?.items?.find(
    (i) => i.resourceType === "stylesheet",
  );
  const row = {
    path,
    performance: score("performance"),
    accessibility: score("accessibility"),
    bestPractices: score("best-practices"),
    seo: score("seo"),
    lcpMs: Math.round(metric("largest-contentful-paint")),
    cls: Number(metric("cumulative-layout-shift").toFixed(3)),
    tbtMs: Math.round(metric("total-blocking-time")),
    scriptKB: Math.round((scripts?.transferSize ?? 0) / 1024),
    cssKB: Math.round((styles?.transferSize ?? 0) / 1024),
    benchmark: Math.round(lhr.environment.benchmarkIndex),
  };
  out(JSON.stringify(row));
  writeFileSync(`.lighthouseci/local/${path.replace(/\W+/g, "_") || "home"}.json`, result.report);
  // Next.js 16 + React 19 runtime alone is ~140 KB gzip; budget = runtime + app code.
  const budgetScript = path === "/contact" ? 170 : 160;
  if (
    row.performance < 90 ||
    row.accessibility < 90 ||
    row.bestPractices < 90 ||
    row.seo < 90 ||
    row.lcpMs > 2500 ||
    row.cls > 0.1 ||
    row.tbtMs > 200 ||
    row.scriptKB > budgetScript ||
    row.cssKB > 30
  ) {
    failed = true;
  }
}

await browser.close();
if (failed) {
  out("Budget check FAILED");
  process.exit(1);
}
out("Budget check passed");
