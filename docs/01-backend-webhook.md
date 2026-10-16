# Spec 01 — Backend: Webhook de Confirmação de Pagamento

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

- O AbacatePay envia o header `x-webhook-secret` com o valor de `ABACATEPAY_WEBHOOK_SECRET`.
- Header ausente ou incorreto → `401`, sem processar.
- `ABACATEPAY_WEBHOOK_SECRET` ausente no env → servidor recusa inicialização.

## Comportamento esperado

| Cenário | Status | Body |
|---|---|---|
| Secret inválido / ausente | 401 | `{ "error": "Unauthorized" }` |
| Evento desconhecido (não `billing.paid`) | 200 | `{ "received": true }` |
| Payload malformado (sem `data.billing`) | 400 | `{ "error": "Invalid payload" }` |
| `billing.paid` válido | 200 | `{ "received": true, "billingId": "bill_xxx" }` |

## Efeito colateral (billing.paid)

- Loga `[webhook] billing paid billingId=<id> externalId=<uuid>` no stdout.
- Ponto de extensão: `onPaymentConfirmed(billing)` exportado em `webhook.ts` —
  sobrescreva para persistir em banco ou disparar notificação push.

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `ABACATEPAY_API_KEY` | Sim | Chave da API AbacatePay |
| `ABACATEPAY_PRODUCT_ID` | Sim | ID do produto no painel AbacatePay |
| `ABACATEPAY_WEBHOOK_SECRET` | Sim | Secret configurado no painel AbacatePay |
| `PAYMENT_RETURN_URL` | Não | URL que o AbacatePay abre após checkout |
| `PAYMENT_COMPLETION_URL` | Não | URL de conclusão do checkout |

## Arquivos implementados

| Arquivo | Papel |
|---|---|
| `backend/src/webhook.ts` | Handler puro, sem dependência do Express (testável isolado) |
| `backend/src/index.ts` | Registra `POST /api/payments/webhook` + valida env no boot |
| `backend/.env.example` | Documenta todas as variáveis necessárias |

## Status

- [x] Implementado
