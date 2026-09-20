import { defineConfig, devices } from "@playwright/test";

const PORT = 3000;
const GATE_PORT = 3001;
const baseURL = `http://localhost:${PORT}`;
const gateURL = `http://localhost:${GATE_PORT}`;

/** Environment for the production build under test (tasks T014, T202). */
export const testServerEnv: Record<string, string> = {
  NEXT_PUBLIC_SITE_URL: baseURL,
  CONTENT_INCLUDE_DRAFTS: "true",
  FORM_SIGNING_SECRET: "test-secret",
  FORM_MIN_FILL_MS: "0",
  FORM_RATE_LIMIT_MAX: "1000",
  LEAD_DELIVERY_PROVIDER: "webhook",
  LEAD_WEBHOOK_URL: "http://127.0.0.1:4010/hook",
  LEAD_WEBHOOK_SECRET: "test-webhook-secret",
};

/**
 * Second build with drafts gated off, in its own output directory (task T208): the
 * publication gate suite checks this build, which is what visitors actually get.
 */
const gateServerEnv: Record<string, string> = {
  NEXT_PUBLIC_SITE_URL: gateURL,
  // Explicitly off: a local .env.local may turn drafts on for development.
  CONTENT_INCLUDE_DRAFTS: "false",
  NEXT_DIST_DIR: ".next-gate",
  FORM_SIGNING_SECRET: "test-secret",
  LEAD_DELIVERY_PROVIDER: "console",
};

/** Site-wide sweeps run once, on desktop Chromium, to keep the suite fast. */
const SWEEPS = /sweeps\.spec\.ts/;
const GATE = /publication-gate\.spec\.ts/;

export default defineConfig({
  testDir: "./tests/e2e",
  globalSetup: "./tests/e2e/global-setup.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 4,
  timeout: 60_000,
  reporter: process.env.CI ? [["html", { open: "never" }], ["list"]] : "list",
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
      testIgnore: GATE,
    },
    { name: "chromium-mobile", use: { ...devices["Pixel 7"] }, testIgnore: [SWEEPS, GATE] },
    { name: "webkit-mobile", use: { ...devices["iPhone 14"] }, testIgnore: [SWEEPS, GATE] },
    {
      name: "publication-gate",
      testMatch: GATE,
      use: { ...devices["Desktop Chrome"], baseURL: gateURL },
    },
  ],
  webServer: [
    {
      command: "npm run build && npm start",
      url: baseURL,
      reuseExistingServer: !process.env.CI,
      timeout: 300_000,
      env: testServerEnv,
    },
    {
      command: `npm run build && npx next start -p ${GATE_PORT}`,
      url: gateURL,
      reuseExistingServer: !process.env.CI,
      timeout: 300_000,
      env: gateServerEnv,
    },
  ],
});
