# Spec: AbacatePay Webhook — Confirmação de Pagamento

## Objetivo

Receber e verificar eventos de pagamento enviados pelo AbacatePay via webhook,
confirmando que um checkout foi pago antes de liberar funcionalidades premium.

## Endpoint

```
POST /api/payments/webhook
```

## Contrato de entrada (AbacatePay webhook payload)

```json
{
  "event": "billing.paid",
  "data": {
    "billing": {
      "id": "bill_xxx",
      "externalId": "<uuid gerado no checkout>",
      "status": "PAID",
      "amount": 9900
    }
  }
}
```

## Segurança

- O AbacatePay envia o header `x-webhook-secret` com o valor configurado em `ABACATEPAY_WEBHOOK_SECRET`.
- Se o header estiver ausente ou não bater, responder `401` e não processar.
- Se `ABACATEPAY_WEBHOOK_SECRET` não estiver configurado no env, o servidor deve recusar inicialização (ou logar aviso e rejeitar todos os webhooks).

## Comportamento esperado

| Cenário | Status | Body |
|---|---|---|
| Secret inválido / ausente | 401 | `{ "error": "Unauthorized" }` |
| Evento desconhecido (não `billing.paid`) | 200 | `{ "received": true }` |
| Payload malformado (sem `data.billing`) | 400 | `{ "error": "Invalid payload" }` |
| `billing.paid` válido | 200 | `{ "received": true, "billingId": "bill_xxx" }` |

## Efeito colateral (billing.paid)

- Logar `[webhook] billing paid billingId=<id> externalId=<uuid>` no stdout.
- Ponto de extensão: chamar `onPaymentConfirmed(billing)` — função exportada que
  integrações futuras (banco de dados, notificação push) podem sobrescrever.

## Variáveis de ambiente novas

| Variável | Obrigatória | Descrição |
|---|---|---|
| `ABACATEPAY_WEBHOOK_SECRET` | Sim | Secret configurado no painel AbacatePay |

## Arquivos afetados

- `src/webhook.ts` — handler isolado (testável sem Express)
- `src/index.ts` — registra a rota `POST /api/payments/webhook`
- `.env.example` — adiciona `ABACATEPAY_WEBHOOK_SECRET`
