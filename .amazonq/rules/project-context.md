# Contexto do projeto — react-native-til

## O que é este projeto

App mobile Expo/React Native com backend Express integrado ao **AbacatePay** (gateway de pagamento brasileiro).
Toda a documentação de features está em `specs/` na raiz do projeto.

## Leia sempre antes de codar

- `docs/README.md` — visão geral, stack e convenções
- `docs/01-backend-webhook.md` — webhook de confirmação de pagamento
- `docs/02-frontend-payment-screen.md` — tela de pagamento no app
- `docs/03-e2e-maestro.md` — testes E2E
- `docs/04-payment-screen-evolution.md` — evoluções pós spec 02

## Regras obrigatórias

- Rotas ficam em `src/app/` (Expo Router file-based). Não criar rotas fora dali.
- Componentes reutilizáveis ficam em `src/components/`, hooks em `src/hooks/`.
- Usar `ThemedView` e `ThemedText` para suporte a dark/light mode.
- O botão padrão é `CustonButton` (typo intencional — não renomear).
- `API_HOST` vem de `src/constants/api.ts` — nunca hardcodar URLs de API.
- Nunca expor `ABACATEPAY_API_KEY` ou `ABACATEPAY_PRODUCT_ID` no app mobile.
- Retorno do browser após checkout ≠ confirmação de pagamento. Confirmação vem pelo webhook.
- Backend usa ESM (`"type": "module"`). Imports TypeScript precisam de extensão `.js`.
- Antes de instalar pacotes: `npx expo install <pkg>` (resolve versão compatível com o SDK).

## Stack resumida

| Camada | Tecnologia |
|--------|-----------|
| App | React Native 0.86 + Expo SDK 57 |
| Roteamento | Expo Router (file-based, `src/app/`) |
| Backend | Express 5 + TypeScript ESM (`backend/`) |
| Pagamentos | AbacatePay (checkout hospedado + webhook) |
| Browser in-app | expo-web-browser |
| Testes E2E | Maestro (`.maestro/`) |
