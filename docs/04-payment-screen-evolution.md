# Spec 04 — Evolução da Tela de Pagamento (pós spec 02)

Documenta todas as mudanças feitas após a criação do `02-frontend-payment-screen.md`.

## 1. Loja de produtos dinâmica

A tela `/payment` evoluiu de um botão único "Assinar agora" para uma **loja com listagem dinâmica de produtos** buscados da API do AbacatePay.

### Novos arquivos

| Arquivo | Papel |
|---|---|
| `src/hooks/use-products.ts` | Busca `GET /api/products` e gerencia estados `loading / ready / error` + pull-to-refresh |

### Novo layout

```
┌─────────────────────────────┐
│  🏪 Loja                    │  ← ThemedText type="subtitle"
│  Puxe para baixo p/ atualiz │  ← ThemedText themeColor="textSecondary"
│                             │
│  ┌─────────────────────┐    │
│  │ 🛍️ │ Nome produto   │    │  ← ProductCard (ThemedView type="backgroundElement")
│  │    │ Descrição      │    │
│  │    │ R$ 80,00       │    │
│  │    │ [ Comprar ]    │    │  ← CustonButton disabled durante checkout
│  └─────────────────────┘    │
│  ... (FlatList)             │
│                             │
│  [overlay loading checkout] │  ← ActivityIndicator + texto (durante checkout)
│  [mensagem de erro]         │  ← só no estado error
└─────────────────────────────┘
```

### Estados da tela

| Estado produtos | Exibe |
|---|---|
| `loading` | `ActivityIndicator` centralizado |
| `error` | mensagem + botão "Tentar novamente" |
| `ready` (vazio) | "Nenhum produto disponível no momento." |
| `ready` (com dados) | `FlatList` de `ProductCard` |

---

## 2. Correções em componentes existentes

### `CustonButton` — prop `disabled`

- Adicionado `disabled?: boolean` na interface `ISellButtonProps`
- `TouchableOpacity` recebe `disabled={props.disabled}`
- Feedback visual: `opacity: 0.5` quando desabilitado

### `ThemedText` — tipo removido

- `defaultSemiBold` não existe nos tipos válidos — substituído por `smallBold`

---

## 3. Retorno automático para a loja após checkout

Após o browser de checkout fechar, o app navega de volta para `/payment` automaticamente.

### Mudança em `use-checkout.ts`

```
openBrowserAsync(url)
  → result.type === CANCEL | DISMISS
  → router.replace("/payment")
```

- Usa `WebBrowserResultType` do `expo-web-browser` para detectar o fechamento
- `router.replace` (não `push`) para não acumular histórico

---

## 4. Conectividade — `API_HOST` por ambiente

O `src/constants/api.ts` passou por três iterações até funcionar no dispositivo físico:

| Iteração | Valor Android | Motivo da mudança |
|---|---|---|
| 1 | `http://10.0.2.2:3333` | Só funciona no emulador AVD |
| 2 | `http://192.168.0.109:3333` | IP Wi-Fi da máquina (LAN) |
| 3 | `https://<hash>.ngrok-free.app` | App rodando via tunnel Expo (`exp.direct`) |

> URL do ngrok muda a cada reinício — atualizar `ANDROID_HOST` em `api.ts` quando necessário.

---

## 5. Correções no backend

### API Key e Produto

| Problema | Causa | Solução |
|---|---|---|
| `Insufficient permissions` | Chave de exemplo no `.env` | Substituída pela chave real da conta |
| `PIX Automático is not available` | Conta sem PIX habilitado | Removido `"PIX"` de `methods`, ficou só `["CARD"]` |
| `No products found` | `PRODUCT_ID` de outra conta | Atualizado com ID real via `GET /v2/products/list` |

### Produto ativo em uso

```
ABACATEPAY_PRODUCT_ID=prod_uTXS2Dr6Khj3T3LsnQBP4sZg
# "Camisa com estampa 120x120" — R$ 80,00 — devMode: true
```

---

## Arquivos modificados (resumo)

| Arquivo | O que mudou |
|---|---|
| `src/app/payment.tsx` | Reescrito: loja com FlatList, ProductCard, pull-to-refresh |
| `src/hooks/use-checkout.ts` | `startCheckout(productId)`, retorno automático via `router.replace` |
| `src/hooks/use-products.ts` | Novo — listagem dinâmica de produtos |
| `src/constants/api.ts` | `ANDROID_HOST` atualizado para ngrok |
| `src/components/CustonButton.tsx` | Prop `disabled` adicionada |
| `backend/.env` | `API_KEY`, `PRODUCT_ID` e `WEBHOOK_SECRET` corrigidos |
| `backend/src/index.ts` | `methods: ["CARD"]` (removido PIX), logs de auditoria completos |
| `backend/src/logger.ts` | Novo — logger centralizado com timestamp e nível |

## Status

- [x] Loja dinâmica de produtos
- [x] CustonButton com disabled
- [x] Retorno automático para /payment após checkout
- [x] Conectividade via ngrok para dispositivo físico
- [x] Backend funcional em devMode com produto real
