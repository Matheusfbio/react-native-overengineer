export type Billing = {
  id: string;
  externalId: string;
  status: string;
  amount: number;
};

// Ponto de extensão: sobrescreva para persistir/notificar
export let onPaymentConfirmed: (billing: Billing) => void | Promise<void> = (
  billing,
) => {
  console.log(
    `[webhook] billing paid billingId=${billing.id} externalId=${billing.externalId}`,
  );
};

export type WebhookResult =
  | { status: 401; body: { error: string } }
  | { status: 400; body: { error: string } }
  | { status: 200; body: { received: true; billingId?: string } };

export async function handleWebhook(
  secret: string | undefined,
  expectedSecret: string,
  rawBody: unknown,
): Promise<WebhookResult> {
  if (!secret || secret !== expectedSecret) {
    return { status: 401, body: { error: "Unauthorized" } };
  }

  const body = rawBody as Record<string, unknown>;

  if (body?.event !== "billing.paid") {
    return { status: 200, body: { received: true } };
  }

  const billing = (body?.data as Record<string, unknown>)
    ?.billing as Billing | undefined;

  if (!billing?.id || !billing?.externalId) {
    return { status: 400, body: { error: "Invalid payload" } };
  }

  await onPaymentConfirmed(billing);

  return { status: 200, body: { received: true, billingId: billing.id } };
}
