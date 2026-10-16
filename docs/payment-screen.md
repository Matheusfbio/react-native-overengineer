# Tela de Pagamento — Micro Loja AbacatePay

Documentação completa da tela `/payment`, dos hooks e do backend que a sustentam.

---

## Visão geral

A rota `/payment` é uma micro loja que lista os produtos cadastrados no painel do **AbacatePay** e permite ao usuário iniciar um checkout com um toque. O fluxo de pagamento usa o checkout hospedado do AbacatePay (URL externa aberta via `expo-web-browser`). A confirmação de pagamento **nunca** vem do retorno do browser — ela chega exclusivamente pelo webhook.

```
Usuário abre /payment
  → app busca GET /api/payments/products  (backend → AbacatePay)
  → lista de produtos renderizada em cards
  → usuário toca "Comprar"
  → app faz POST /api/payments/checkout   (backend → AbacatePay)
  → recebe { url }
  → expo-web-browser abre a URL
  → usuário conclui o pagamento no site do AbacatePay
  → AbacatePay dispara POST /api/payments/webhook
  → backend confirma o pagamento
```

---

## Arquivos envolvidos

| Arquivo | Camada | Responsabilidade |
|---|---|---|
| `src/app/payment.tsx` | UI | Tela da loja, renderização dos cards, pull-to-refresh |
| `src/hooks/use-products.ts` | Hook | Busca e estado da lista de produtos |
| `src/hooks/use-checkout.ts` | Hook | Inicia o checkout e gerencia estados de loading/erro |
| `src/constants/api.ts` | Config | `API_HOST` por plataforma |
| `backend/src/index.ts` | Backend | Endpoints `GET /products` e `POST /checkout` |
| `backend/src/webhook.ts` | Backend | Handler de confirmação de pagamento |

---

## Tela — `src/app/payment.tsx`

### Layout

```
┌─────────────────────────────────┐
│  🏪 Loja                        │  ← ThemedText type="subtitle"
│  Puxe para baixo para atualizar │  ← ThemedText themeColor="textSecondary"
│                                 │
│  ┌─────────────────────────┐    │
│  │ 🛍️  Nome do produto     │    │  ← ProductCard
│  │     Descrição           │    │
│  │     R$ 99,00    [Comprar]│   │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │ 🛍️  Outro produto       │    │
│  │     ...         [Comprar]│   │
│  └─────────────────────────┘    │
│                                 │
│  (overlay: spinner + "Abrindo   │  ← visível só durante checkout
│   checkout…" durante checkout)  │
└─────────────────────────────────┘
```

### Componentes usados

| Componente | Origem | Uso |
|---|---|---|
| `ThemedView` | `@/components/themed-view` | Container com suporte a dark/light mode |
| `ThemedText` | `@/components/themed-text` | Textos temáticos |
| `CustonButton` | `@/components/CustonButton` | Botão padrão do projeto (typo intencional) |
| `FlatList` | `react-native` | Lista virtualizada de produtos |
| `RefreshControl` | `react-native` | Pull-to-refresh nativo |
| `ActivityIndicator` | `react-native` | Spinner de loading |
| `SafeAreaView` | `react-native-safe-area-context` | Respeita notch/status bar |

### Estados da tela

| Estado | O que aparece |
|---|---|
| Carregando produtos | `ActivityIndicator` centralizado |
| Erro ao carregar | Mensagem de erro + botão "Tentar novamente" |
| Produtos carregados | `FlatList` com cards |
| Checkout em andamento | Overlay com spinner + "Abrindo checkout…", botões desabilitados |
| Erro no checkout | Mensagem de erro abaixo da lista |

### Pull-to-refresh

Implementado via `RefreshControl` no `FlatList`. O gesto de arrastar a lista para baixo (padrão iOS/Android) dispara `refresh()` do hook `useProducts`, que recarrega a lista sem apagar o conteúdo atual — o spinner nativo do sistema aparece no topo da lista enquanto a requisição está em andamento.

```tsx
<FlatList
  refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={refresh} />
  }
  ...
/>
```

### Componente `ProductCard`

Componente interno da tela (não exportado). Recebe um `Product`, formata o preço em BRL e renderiza o card.

```
Props:
  product  — Product (id, name, description?, price em centavos)
  onBuy    — () => void  (dispara startCheckout com o id do produto)
  disabled — boolean     (true durante checkout em andamento)
```

O preço é convertido de centavos para reais com `Intl.NumberFormat` via `toLocaleString`:

```ts
(product.price / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
```

---

## Hook — `src/hooks/use-products.ts`

Gerencia o ciclo de vida da listagem de produtos.

### Retorno

```ts
{
  state:      { status: "loading" }
            | { status: "error"; message: string }
            | { status: "ok"; products: Product[] }
  refreshing: boolean   // true somente durante pull-to-refresh
  refresh:    () => void
}
```

### Tipo `Product`

```ts
type Product = {
  id: string;
  name: string;
  description?: string;
  price: number; // em centavos
}
```

### Comportamento de `load(isRefresh)`

| `isRefresh` | Efeito |
|---|---|
| `false` (carga inicial) | Seta `state = { status: "loading" }` — apaga lista anterior |
| `true` (pull-to-refresh) | Seta `refreshing = true` — mantém lista visível enquanto recarrega |

Ambos os caminhos chamam o mesmo `fetch` e atualizam `state` ao final. O `finally` garante que `refreshing` volta para `false` independente de sucesso ou erro.

### Endpoint consumido

```
GET {API_HOST}/api/payments/products
→ 200  { products: Product[] }
→ 502  { error: string }
```

---

## Hook — `src/hooks/use-checkout.ts`

Gerencia o fluxo de abertura do checkout hospedado.

### Retorno

```ts
{
  status:       "idle" | "loading" | "error"
  errorMessage: string | null
  startCheckout: (productId?: string) => Promise<void>
}
```

### Fluxo de `startCheckout(productId?)`

1. Seta `status = "loading"`
2. `POST {API_HOST}/api/payments/checkout` com `{ productId }` no body (se fornecido)
3. Recebe `{ url: string }`
4. Chama `openBrowserAsync(url)` — abre o checkout hospedado no browser nativo
5. Browser fecha → `status = "idle"`
6. Qualquer erro → `status = "error"`, `errorMessage` preenchido

> O retorno do browser **não confirma** o pagamento. A confirmação vem pelo webhook.

---

## Backend — `backend/src/index.ts`

### `GET /api/payments/products`

Proxy para a API do AbacatePay. A `ABACATEPAY_API_KEY` nunca sai do servidor.

```
→ AbacatePay GET /v2/products/list
← { data: Product[] }
→ app        { products: Product[] }
```

Respostas de erro:
- `502` se a AbacatePay retornar erro ou payload inesperado
- `502` se a requisição falhar (rede)

### `POST /api/payments/checkout`

Cria um checkout hospedado na AbacatePay.

```
Body (app → backend):  { productId?: string }
→ AbacatePay POST /v2/checkouts/create
   {
     items: [{ id: ABACATEPAY_PRODUCT_ID, quantity: 1 }],
     methods: ["CARD"],
     externalId: <uuid>,
     returnUrl?,
     completionUrl?
   }
← { data: { url: "https://..." } }
→ app  { url: "https://..." }
```

Rate limit: 10 requisições por minuto por IP.

### `POST /api/payments/webhook`

Recebe eventos do AbacatePay após pagamento concluído.

```
Header: x-webhook-secret: <ABACATEPAY_WEBHOOK_SECRET>
Body:
{
  "event": "billing.paid",
  "data": {
    "billing": {
      "id": "bill_xxx",
      "externalId": "<uuid do checkout>",
      "status": "PAID",
      "amount": 9900
    }
  }
}
```

| Cenário | Status |
|---|---|
| Secret inválido/ausente | `401` |
| Evento desconhecido | `200 { received: true }` |
| Payload malformado | `400` |
| `billing.paid` válido | `200 { received: true, billingId }` |

O handler `onPaymentConfirmed` em `webhook.ts` é um ponto de extensão — sobrescreva para persistir em banco ou disparar push notification.

---

## Variáveis de ambiente (backend)

| Variável | Obrigatória | Descrição |
|---|---|---|
| `ABACATEPAY_API_KEY` | Sim | Chave da API AbacatePay |
| `ABACATEPAY_PRODUCT_ID` | Sim | ID do produto padrão no painel AbacatePay |
| `ABACATEPAY_WEBHOOK_SECRET` | Sim | Secret configurado no painel AbacatePay |
| `PORT` | Não | Porta do servidor (padrão: `3333`) |
| `CORS_ORIGINS` | Não | Origins permitidas separadas por vírgula |
| `PAYMENT_RETURN_URL` | Não | URL que o AbacatePay abre após o checkout |
| `PAYMENT_COMPLETION_URL` | Não | URL de conclusão do checkout |

---

## Constante `API_HOST` — `src/constants/api.ts`

```ts
Platform.select({
  android: "https://<ngrok-ou-ip-lan>",  // emulador/dispositivo físico
  default: "http://localhost:3333",       // iOS simulator / web
})
```

Nunca hardcode URLs de API fora deste arquivo.

---

## Regras importantes

- `ABACATEPAY_API_KEY` e `ABACATEPAY_PRODUCT_ID` ficam **somente** no `.env` do backend.
- O retorno do browser após o checkout **não é** confirmação de pagamento.
- A confirmação de pagamento vem **exclusivamente** pelo webhook (`POST /api/payments/webhook`).
- Antes de instalar novos pacotes: `npx expo install <pkg>` para garantir compatibilidade com o SDK.
