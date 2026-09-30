# Spec Driven Development — Maestro E2E Tests

## Contexto

Tela principal (`index.tsx`): formulário com campos **Nome** e **Email**, botão **Entrar** e um **Modal** que exibe os dados preenchidos.

---

## Fluxos a testar

### 1. Preencher formulário e abrir modal
**Dado** que o app está na tela inicial  
**Quando** o usuário preenche Nome e Email e toca em "Entrar"  
**Então** o modal aparece com os dados corretos

### 2. Fechar modal
**Dado** que o modal está visível  
**Quando** o usuário toca em "Fechar"  
**Então** o modal é dispensado

### 3. Abrir modal com campos vazios
**Dado** que os campos estão vazios  
**Quando** o usuário toca em "Entrar"  
**Então** o modal abre mostrando Nome e Email em branco

---

## Flows Maestro

### `.maestro/fill_and_open_modal.yaml`
```yaml
appId: com.reactnativetil
---
- launchApp
- tapOn: "Nome:"
- inputText: "João Silva"
- tapOn: "Email:"
- inputText: "joao@email.com"
- tapOn: "Entrar"
- assertVisible: "Dados preenchidos"
- assertVisible: "Nome: João Silva"
- assertVisible: "Email: joao@email.com"
```

### `.maestro/close_modal.yaml`
```yaml
appId: com.reactnativetil
---
- launchApp
- tapOn: "Nome:"
- inputText: "João Silva"
- tapOn: "Email:"
- inputText: "joao@email.com"
- tapOn: "Entrar"
- assertVisible: "Dados preenchidos"
- tapOn: "Fechar"
- assertNotVisible: "Dados preenchidos"
```

### `.maestro/open_modal_empty_fields.yaml`
```yaml
appId: com.reactnativetil
---
- launchApp
- tapOn: "Entrar"
- assertVisible: "Dados preenchidos"
- assertVisible: "Nome: "
- assertVisible: "Email: "
- tapOn: "Fechar"
```

---

## Setup

```bash
# Instalar Maestro CLI
curl -Ls "https://get.maestro.mobile.dev" | bash

# Rodar todos os flows
maestro test .maestro/

# Rodar flow individual
maestro test .maestro/fill_and_open_modal.yaml
```

> **Pré-requisito:** app rodando em emulador/dispositivo com `appId` configurado em `app.json` (`android.package` / `ios.bundleIdentifier`).

---

## Checklist de implementação

- [ ] Adicionar `testID` nos elementos interativos (ver seção abaixo)
- [ ] Criar os arquivos `.yaml` em `.maestro/`
- [ ] Configurar `appId` correto no `app.json`
- [ ] Validar flows no emulador Android e simulador iOS

---

## testIDs recomendados

Adicionar `testID` nos elementos de `index.tsx` para seletores mais robustos:

| Elemento        | testID sugerido       |
|-----------------|-----------------------|
| TextInput Nome  | `input-name`          |
| TextInput Email | `input-email`         |
| Botão Entrar    | `button-submit`       |
| Modal           | `modal-profile`       |
| Botão Fechar    | `button-close-modal`  |

Com testIDs, os flows usam `id:` em vez de texto:
```yaml
- tapOn:
    id: "input-name"
- inputText: "João Silva"
```
