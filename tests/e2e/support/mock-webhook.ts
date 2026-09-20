import { createServer, type Server } from "node:http";

export const MOCK_WEBHOOK_PORT = 4010;
export const MOCK_WEBHOOK_URL = `http://127.0.0.1:${MOCK_WEBHOOK_PORT}/hook`;

type Received = { lead: { company: string; [key: string]: unknown }; event: string };

/**
 * Deterministic lead-delivery target for e2e tests (task T202).
 * POST /hook → 500 when lead.company is "FAIL-TEST", otherwise 200.
 * GET /received → JSON array of payloads received so far.
 */
export function startMockWebhook(): Promise<Server> {
  const received: Received[] = [];
  const server = createServer((req, res) => {
    if (req.method === "GET" && req.url === "/received") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(received));
      return;
    }
    if (req.method === "POST" && req.url === "/hook") {
      let body = "";
      req.on("data", (chunk) => (body += chunk));
      req.on("end", () => {
        const payload = JSON.parse(body) as Received;
        if (payload.lead.company.startsWith("FAIL-TEST")) {
          res.writeHead(500).end();
          return;
        }
        received.push(payload);
        res.writeHead(200).end("{}");
      });
      return;
    }
    res.writeHead(404).end();
  });
  return new Promise((resolve) =>
    server.listen(MOCK_WEBHOOK_PORT, "127.0.0.1", () => resolve(server)),
  );
}

export async function receivedLeads(): Promise<Received[]> {
  const response = await fetch(`http://127.0.0.1:${MOCK_WEBHOOK_PORT}/received`);
  return (await response.json()) as Received[];
}
