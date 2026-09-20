// Renders the featured illustration for the first blog article (brand tokens only).
// Usage: node scripts/render-blog-image.mjs
import { chromium } from "@playwright/test";

const cells = Array.from(
  { length: 42 },
  (_, i) =>
    `<div style="height:34px;border:1px solid #e4e6eb;background:${i % 7 === 0 ? "#f7f8fa" : "#fff"}"></div>`,
).join("");
const bars = [44, 70, 58, 86, 64, 100, 80]
  .map(
    (h, i) =>
      `<div style="flex:1;height:${h}%;border-radius:8px 8px 0 0;background:${i === 5 ? "#00D84A" : "#008A2E"}"></div>`,
  )
  .join("");

const html = `<!doctype html><html><body style="margin:0">
<div style="width:1600px;height:900px;background:#003D1A;display:flex;align-items:center;justify-content:center;gap:56px;font-family:Segoe UI,Arial,sans-serif">
  <div style="width:560px;background:#fff;border-radius:24px;padding:28px;box-shadow:0 30px 60px -20px rgba(0,0,0,.5)">
    <div style="font-size:22px;font-weight:700;color:#0B0B0B;margin-bottom:18px">production_plan_FINAL_v7.xlsx</div>
    <div style="display:grid;grid-template-columns:repeat(7,1fr)">${cells}</div>
  </div>
  <div style="width:96px;height:96px;border-radius:999px;background:#00D84A;display:flex;align-items:center;justify-content:center;font-size:56px;color:#0B0B0B;font-weight:700">&rarr;</div>
  <div style="width:560px;background:#fff;border-radius:24px;padding:28px;box-shadow:0 30px 60px -20px rgba(0,0,0,.5)">
    <div style="font-size:22px;font-weight:700;color:#0B0B0B;margin-bottom:18px">Operations dashboard</div>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:16px">
      <div style="height:70px;border-radius:12px;background:#F7F8FA;border:1px solid #e4e6eb"></div>
      <div style="height:70px;border-radius:12px;background:#F7F8FA;border:1px solid #e4e6eb"></div>
      <div style="height:70px;border-radius:12px;background:#F7F8FA;border:1px solid #e4e6eb"></div>
    </div>
    <div style="height:176px;display:flex;align-items:flex-end;gap:12px;padding:16px;border-radius:12px;border:1px solid #e4e6eb">${bars}</div>
  </div>
</div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
await page.setContent(html);
await page.screenshot({
  path: "src/assets/blog/signs-your-business-has-outgrown-spreadsheets.png",
});
await browser.close();
process.stdout.write(`wrote featured image${String.fromCharCode(10)}`);
