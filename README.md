# react-native-til

> Um projeto propositalmente over-engineered para aprender React Native na prática.

A ideia é simples: pegar features que poderiam ser feitas em 50 linhas e construir do jeito "certo" — com backend separado, webhook, specs, logs de auditoria, testes E2E e tudo mais que um projeto de produção teria.

## O que tem aqui

Um app Expo/React Native com uma micro loja integrada ao **AbacatePay** (gateway de pagamento brasileiro). O usuário vê produtos, toca em "Comprar", é redirecionado para o checkout hospedado e o backend confirma o pagamento via webhook.

```
App (React Native)
  └── /payment          → lista produtos do AbacatePay
        → toca Comprar
        → abre browser com checkout hospedado
        → fecha browser → volta para a loja

Backend (Express)
  ├── POST /api/payments/checkout   → cria checkout na AbacatePay
  ├── GET  /api/payments/products   → lista produtos da AbacatePay
  └── POST /api/payments/webhook    → confirma pagamento (evento billing.paid)
```

## Stack

| Camada | Tecnologia |
|--------|-----------|
| App | React Native 0.86 + Expo SDK 57 |
| Roteamento | Expo Router (file-based) |
| Backend | Express 5 + TypeScript ESM |
| Pagamentos | AbacatePay (checkout hospedado + webhook) |
| Browser in-app | expo-web-browser |
| Testes E2E | Maestro |
| Túnel dev | ngrok |

## Rodar localmente

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
# preencha ABACATEPAY_API_KEY, ABACATEPAY_PRODUCT_ID e ABACATEPAY_WEBHOOK_SECRET
npm run dev
```

**App:**
```bash
yarn install
yarn start
```

Para dispositivo físico, exponha o backend com ngrok:
```bash
ngrok http 3333
# atualize ANDROID_HOST em src/constants/api.ts com a URL gerada
```

## Documentação

Toda a documentação de features está em [`docs/`](./docs/README.md).

| Doc | Conteúdo |
|-----|---------|
| [01-backend-webhook](./docs/01-backend-webhook.md) | Webhook de confirmação de pagamento |
| [02-frontend-payment-screen](./docs/02-frontend-payment-screen.md) | Tela de pagamento (spec original) |
| [03-e2e-maestro](./docs/03-e2e-maestro.md) | Testes E2E com Maestro |
| [04-payment-screen-evolution](./docs/04-payment-screen-evolution.md) | Evolução da loja: produtos dinâmicos, ngrok, correções |
| [payment-screen](./docs/payment-screen.md) | Documentação técnica completa da tela /payment |

## Estrutura

```
├── src/
│   ├── app/              # Rotas (Expo Router file-based)
│   ├── components/       # ThemedView, ThemedText, CustonButton...
│   ├── hooks/            # use-checkout, use-products, use-theme...
│   └── constants/        # theme.ts, api.ts
├── backend/
│   └── src/
│       ├── index.ts      # Servidor Express + rotas
│       ├── webhook.ts    # Handler de webhook isolado
│       └── logger.ts     # Logger centralizado com timestamp
├── docs/                 # Specs e documentação
└── .maestro/             # Flows de teste E2E
```

## Regras do projeto

- Rotas em `src/app/` — Expo Router file-based, nunca fora dali
- `CustonButton` — typo intencional, não renomear
- `API_HOST` vem de `src/constants/api.ts` — nunca hardcodar URLs
- `ABACATEPAY_API_KEY` nunca sai do backend
- Retorno do browser ≠ confirmação de pagamento — isso é responsabilidade do webhook
