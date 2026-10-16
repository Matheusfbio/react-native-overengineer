# Spec 02 — Frontend: Tela de Pagamento AbacatePay

## Objetivo

Exibir uma tela de pagamento no app que inicia um checkout hospedado pelo AbacatePay,
abre a URL retornada no browser nativo e trata os estados de loading, erro e retorno.

## Rota

```
/payment
```

Tab registrada em `src/components/app-tabs.tsx` com label "Premium".

## Fluxo do usuário

```
Tela /payment
  → usuário toca "Assinar agora"
  → loading spinner visível, botão desabilitado
  → POST {API_HOST}/api/payments/checkout
  → recebe { url: "https://..." }
  → abre url com expo-web-browser (openBrowserAsync)
  → browser fecha → volta ao estado idle
  → erro de rede ou 4xx/5xx → mensagem visível, botão reabilitado
```

## Estados da tela

| Estado | Botão | Feedback visual |
|---|---|---|
| `idle` | habilitado | — |
| `loading` | desabilitado | `ActivityIndicator` |
| `error` | habilitado | texto de erro abaixo do botão |

## Contrato com o backend

```
POST {API_HOST}/api/payments/checkout
→ 200  { url: "https://..." }
→ 4xx/5xx  { error: "mensagem" }
```

`API_HOST` vem de `src/constants/api.ts`:
- iOS / web: `http://localhost:3333`
- Android emulator: `http://10.0.2.2:3333`

## Layout

```
┌─────────────────────────────┐
│  🔒                         │  ← ThemedText type="title"
│  Premium                    │  ← ThemedText type="subtitle"
│  Acesse todos os recursos   │  ← ThemedText themeColor="textSecondary"
│                             │
│  [ Assinar agora 💳 ]       │  ← CustonButton (idle) ou ActivityIndicator (loading)
│                             │
│  [mensagem de erro]         │  ← ThemedText type="small" (só no estado error)
└─────────────────────────────┘
```

## Regras

- Nunca enviar `ABACATEPAY_API_KEY` ou `ABACATEPAY_PRODUCT_ID` pelo app.
- Retorno do browser ≠ confirmação de pagamento — confirmação vem pelo webhook (spec 01).
- Usar componentes existentes: `ThemedView`, `ThemedText`, `CustonButton`.

## Arquivos implementados

| Arquivo | Papel |
|---|---|
| `src/app/payment.tsx` | Screen da rota `/payment` |
| `src/hooks/use-checkout.ts` | Lógica de fetch + máquina de estados |
| `src/constants/api.ts` | `API_HOST` por plataforma |
| `src/components/app-tabs.tsx` | Tab "Premium" adicionada |

## Status

- [x] Implementado
