// Renders the preview-only placeholder used before real screenshots exist (task T121).
// Usage: node scripts/render-pending-screenshot.mjs
import { chromium } from "@playwright/test";

const html = `<!doctype html><html><body style="margin:0">
<div style="width:1600px;height:1000px;box-sizing:border-box;background:#F7F8FA;display:flex;align-items:center;justify-content:center;font-family:Segoe UI,Arial,sans-serif">
  <div style="width:1360px;height:800px;border:4px dashed #767676;border-radius:32px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;background:#FFFFFF">
    <div style="width:120px;height:120px;border-radius:24px;background:#003D1A;display:flex;align-items:center;justify-content:center">
      <div style="width:56px;height:40px;border:6px solid #00D84A;border-radius:8px"></div>
    </div>
    <div style="font-size:64px;font-weight:700;color:#0B0B0B">Screenshot pending</div>
    <div style="font-size:36px;color:#555555">Preview only &mdash; replaced with real product UI before publishing</div>
  </div>
</div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
await page.setContent(html);
await page.screenshot({ path: "src/assets/portfolio/pending-screenshot.png" });
await browser.close();
process.stdout.write(`wrote src/assets/portfolio/pending-screenshot.png${String.fromCharCode(10)}`);
