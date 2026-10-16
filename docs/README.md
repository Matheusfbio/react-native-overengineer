# Docs — react-native-til

Expo/React Native app com backend Express integrado ao AbacatePay.

## Estrutura do projeto

```
react-native-til/
├── src/
├── backend/
└── docs/                   ← você está aqui
    ├── README.md
    ├── 01-backend-webhook.md
    ├── 02-frontend-payment-screen.md
    ├── 03-e2e-maestro.md
    ├── 04-payment-screen-evolution.md
    └── payment-screen.md
```

## Specs disponíveis

| # | Arquivo | Feature |
|---|---------|---------|
| 01 | [backend-webhook](./01-backend-webhook.md) | Webhook de confirmação de pagamento (backend) |
| 02 | [frontend-payment-screen](./02-frontend-payment-screen.md) | Tela de pagamento no app (frontend) |
| 03 | [e2e-maestro](./03-e2e-maestro.md) | Testes E2E com Maestro |
| 04 | [payment-screen-evolution](./04-payment-screen-evolution.md) | Evolução da tela: loja dinâmica, correções e conectividade |
| — | [payment-screen](./payment-screen.md) | Documentação técnica completa da tela /payment |

## Convenções do projeto

- Roteamento via **Expo Router** — arquivos em `src/app/` viram rotas automaticamente
- Componentes temáticos: `ThemedView`, `ThemedText` (suportam dark/light mode via `useTheme`)
- Botão padrão: `CustonButton` (typo intencional, não renomear)
- Constantes de cor/espaçamento em `src/constants/theme.ts`
- Host da API em `src/constants/api.ts` — diferente por plataforma (Android emulator usa `10.0.2.2`)
- Backend nunca recebe `API_KEY` ou `PRODUCT_ID` do app — ficam apenas no `.env` do servidor
- Pagamento: nunca tratar retorno do browser como confirmação — usar webhook

## Stack

| Camada | Tecnologia |
|--------|-----------|
| App | React Native 0.86 + Expo SDK 57 |
| Roteamento | Expo Router (file-based) |
| Backend | Express 5 + TypeScript (ESM) |
| Pagamentos | AbacatePay (checkout hospedado + webhook) |
| Browser in-app | expo-web-browser |
| Testes E2E | Maestro |
