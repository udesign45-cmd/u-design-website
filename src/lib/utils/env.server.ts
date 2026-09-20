import "server-only";

/** Reads a required server variable, throwing a descriptive error when missing. */
export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}. See .env.example.`);
  }
  return value;
}

export function optionalEnv(name: string): string | undefined {
  return process.env[name] || undefined;
}

export function intEnv(name: string, fallback: number): number {
  const raw = process.env[name];
  if (raw === undefined || raw === "") return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

export const serverEnv = {
  leadDeliveryProvider: () => optionalEnv("LEAD_DELIVERY_PROVIDER") ?? "console",
  formSigningSecret: () => requireEnv("FORM_SIGNING_SECRET"),
  formMinFillMs: () => intEnv("FORM_MIN_FILL_MS", 3000),
  formRateLimitMax: () => intEnv("FORM_RATE_LIMIT_MAX", 5),
  isProductionDeployment: () => process.env.VERCEL_ENV === "production",
};
