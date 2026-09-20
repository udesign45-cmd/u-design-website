import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

/**
 * Launch-readiness gate (task T219): `npm run check:launch`. Kept separate from
 * vitest.config.ts so it runs only the launch checks, against the production
 * environment. MDX bodies are irrelevant here, so they load as stubs.
 */
export default defineConfig({
  plugins: [
    {
      name: "stub-mdx",
      enforce: "pre",
      resolveId(id) {
        return id.endsWith(".mdx") ? "\0stub-mdx" : null;
      },
      load(id) {
        return id === "\0stub-mdx" ? "export default function StubMdx() { return null; }" : null;
      },
    },
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "server-only": fileURLToPath(new URL("./tests/stubs/server-only.ts", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["tests/launch/**/*.test.ts"],
    // The gate must see exactly what a production deployment publishes.
    env: { NODE_ENV: "production", CONTENT_INCLUDE_DRAFTS: "false" },
  },
});
