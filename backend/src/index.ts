import cors from "cors";
import "dotenv/config";
import express from "express";
import { rateLimit } from "express-rate-limit";
import { randomUUID } from "node:crypto";
import { handleWebhook } from "./webhook.js";

const apiKey = process.env.ABACATEPAY_API_KEY;
const productId = process.env.ABACATEPAY_PRODUCT_ID;
const webhookSecret = process.env.ABACATEPAY_WEBHOOK_SECRET;
const port = Number(process.env.PORT ?? 3333);
const corsOrigins = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (!apiKey) {
  throw new Error("ABACATEPAY_API_KEY must be configured in backend/.env");
}

if (!productId) {
  throw new Error("ABACATEPAY_PRODUCT_ID must be configured in backend/.env");
}

if (!webhookSecret) {
  throw new Error("ABACATEPAY_WEBHOOK_SECRET must be configured in backend/.env");
}

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, !origin || corsOrigins.includes(origin));
    },
  }),
);
app.use(express.json({ limit: "10kb" }));

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.post(
  "/api/payments/checkout",
  rateLimit({ windowMs: 60_000, limit: 10 }),
  async (_request, response) => {
    const checkoutPayload = {
      items: [{ id: productId, quantity: 1 }],
      methods: ["PIX", "CARD"],
      externalId: randomUUID(),
      ...(process.env.PAYMENT_RETURN_URL && {
        returnUrl: process.env.PAYMENT_RETURN_URL,
      }),
      ...(process.env.PAYMENT_COMPLETION_URL && {
        completionUrl: process.env.PAYMENT_COMPLETION_URL,
      }),
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
        console.error("AbacatePay checkout request failed", {
          status: providerResponse.status,
        });
        response.status(502).json({ error: "Could not create payment checkout" });
        return;
      }

      response.json({ url: checkoutUrl });
    } catch (error) {
      console.error("AbacatePay request failed", error);
      response.status(502).json({ error: "Payment provider is unavailable" });
    }
  },
);

app.post(
  "/api/payments/webhook",
  async (request, response) => {
    const result = await handleWebhook(
      request.headers["x-webhook-secret"] as string | undefined,
      webhookSecret,
      request.body,
    );
    response.status(result.status).json(result.body);
  },
);

app.listen(port, "0.0.0.0", () => {
  console.log(`Payment API listening on http://localhost:${port}`);
});