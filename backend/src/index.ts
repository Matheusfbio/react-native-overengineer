import cors from "cors";
import "dotenv/config";
import express from "express";
import { rateLimit } from "express-rate-limit";
import { randomUUID } from "node:crypto";
import { handleWebhook } from "./webhook.js";
import { logger } from "./logger.js";

const apiKey = process.env.ABACATEPAY_API_KEY;
const productId = process.env.ABACATEPAY_PRODUCT_ID;
const webhookSecret = process.env.ABACATEPAY_WEBHOOK_SECRET;
const port = Number(process.env.PORT ?? 3333);
const corsOrigins = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (!apiKey) throw new Error("ABACATEPAY_API_KEY must be configured in backend/.env");
if (!productId) throw new Error("ABACATEPAY_PRODUCT_ID must be configured in backend/.env");
if (!webhookSecret) throw new Error("ABACATEPAY_WEBHOOK_SECRET must be configured in backend/.env");

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      const allowed = !origin || corsOrigins.includes(origin);
      if (!allowed) logger.warn("cors", "Blocked request from disallowed origin", { origin });
      callback(null, allowed);
    },
  }),
);
app.use(express.json({ limit: "10kb" }));

// ── Audit: log every incoming request ────────────────────────────────────────
app.use((request, _response, next) => {
  logger.info("http", `${request.method} ${request.path}`, {
    ip: request.ip,
    origin: request.headers.origin ?? null,
  });
  next();
});

app.get("/health", (_request, response) => {
  logger.info("health", "Health check OK");
  response.json({ status: "ok" });
});

app.get("/api/payments/products", async (_request, response) => {
  try {
    const providerResponse = await fetch(
      "https://api.abacatepay.com/v2/products/list",
      { headers: { Authorization: `Bearer ${apiKey}` } },
    );
    const payload: unknown = await providerResponse.json();
    const data =
      typeof payload === "object" && payload !== null && "data" in payload
        ? payload.data
        : null;
    if (!providerResponse.ok || !Array.isArray(data)) {
      response.status(502).json({ error: "Could not fetch products" });
      return;
    }
    response.json({ products: data });
  } catch {
    response.status(502).json({ error: "Payment provider is unavailable" });
  }
});

app.post(
  "/api/payments/checkout",
  rateLimit({
    windowMs: 60_000,
    limit: 10,
    handler: (request, response) => {
      logger.warn("checkout", "Rate limit exceeded", { ip: request.ip });
      response.status(429).json({ error: "Too many requests" });
    },
  }),
  async (_request, response) => {
    const externalId = randomUUID();
    logger.info("checkout", "Creating checkout", { externalId, productId });

    const checkoutPayload = {
      items: [{ id: productId, quantity: 1 }],
      methods: ["CARD"],
      externalId,
      ...(process.env.PAYMENT_RETURN_URL && { returnUrl: process.env.PAYMENT_RETURN_URL }),
      ...(process.env.PAYMENT_COMPLETION_URL && { completionUrl: process.env.PAYMENT_COMPLETION_URL }),
    };

    try {
      const providerResponse = await fetch(
        "https://api.abacatepay.com/v2/checkouts/create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(checkoutPayload),
        },
      );

      const payload: unknown = await providerResponse.json();

      logger.info("checkout", "AbacatePay raw response", {
        httpStatus: providerResponse.status,
        payload,
        externalId,
      });

      const data =
        typeof payload === "object" && payload !== null && "data" in payload
          ? payload.data
          : null;
      const checkoutUrl =
        typeof data === "object" && data !== null && "url" in data
          ? data.url
          : null;

      if (
        !providerResponse.ok ||
        typeof checkoutUrl !== "string" ||
        !checkoutUrl.startsWith("https://")
      ) {
        logger.error("checkout", "AbacatePay returned invalid response", {
          httpStatus: providerResponse.status,
          payload,
          externalId,
        });
        response.status(502).json({ error: "Could not create payment checkout" });
        return;
      }

      logger.info("checkout", "Checkout created successfully", { externalId, checkoutUrl });
      response.json({ url: checkoutUrl });
    } catch (error) {
      logger.error("checkout", "Request to AbacatePay failed", {
        externalId,
        error: error instanceof Error ? error.message : String(error),
      });
      response.status(502).json({ error: "Payment provider is unavailable" });
    }
  },
);

app.post("/api/payments/webhook", async (request, response) => {
  const ip = request.ip;
  const hasSecret = !!request.headers["x-webhook-secret"];
  logger.info("webhook", "Webhook received", { ip, hasSecret });

  const result = await handleWebhook(
    request.headers["x-webhook-secret"] as string | undefined,
    webhookSecret,
    request.body,
  );

  if (result.status === 401) {
    logger.warn("webhook", "Rejected: invalid or missing secret", { ip });
  } else if (result.status === 400) {
    logger.warn("webhook", "Rejected: malformed payload", { body: request.body });
  } else {
    logger.info("webhook", "Webhook processed", { response: result.body });
  }

  response.status(result.status).json(result.body);
});

app.listen(port, "0.0.0.0", () => {
  logger.info("server", `Payment API listening on http://localhost:${port}`, {
    corsOrigins,
    productId,
  });
});
