import { startMockWebhook } from "./support/mock-webhook";

/** Starts the mock lead-delivery webhook for the whole run (task T202). */
export default async function globalSetup() {
  const server = await startMockWebhook();
  return async () => {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  };
}
