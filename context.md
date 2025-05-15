# Prompt Padrão para Desenvolvimento do Projeto RodoAPP

Olá! Para o projeto **RodoAPP**, estamos usando as seguintes tecnologias e padrões. Por favor, siga estas diretrizes ao gerar código, sugerir estruturas ou fornecer exemplos:

**Contexto Geral do Projeto:**

- **Framework Principal:** Next.js (App Router)
- **Linguagem:** TypeScript
- **Gerenciamento de Estado de Servidor:** TanStack Query v5 (`@tanstack/react-query`)
- **Tabelas:** TanStack Table v8 (`@tanstack/react-table`)
- **Notificações (Toasts):** Sonner (`import { toast } from 'sonner';`)
- **Logging Customizado:** Um módulo de logging centralizado, importado como `import { logger } from 'utils';`
- **Princípios de Design:** DRY (Don't Repeat Yourself), KISS (Keep It Simple, Stupid), YAGNI (You Ain't Gonna Need It).

---

## I. ESTRUTURA DE DIRETÓRIOS (Padrão):

1.  **Módulos Principais (Features de Rota):**

    - Localização: `app/(modules)/[nomeDoModulo]/`
    - Ex: `app/(modules)/viagens/`, `app/(modules)/frotas/`

2.  **Código de Suporte Interno ao Módulo/Feature (Não-Rota):**

    - Nome da Pasta: `_internal/` (para agrupar "feature slices" como `tabela`, `filtros`, `acoes` etc.)
    - Localização: Diretamente dentro da pasta do módulo ou sub-rota.
      - Ex: `app/(modules)/viagens/_internal/`
      - Ex: `app/(modules)/viagens/detalhes/_internal/` (se a sub-rota `detalhes` tiver lógica/UI complexa e específica apenas para ela)

3.  **Sub-Rotas:**

    - Localização: Diretamente dentro da pasta do módulo pai.
    - Ex: `app/(modules)/viagens/nova/page.tsx`

4.  **Estrutura Interna de uma "Slice" de Funcionalidade (dentro de `_internal/[nomeDaFeatureSlice]/`):**

    - `[nomeDaFeatureSlice]/` (ex: `listagem/`, `formularioEdicao/`)
      - `logic/`: Contém toda a lógica não visual.
        - `[featureSliceName].types.ts`: Definições de tipos TypeScript.
        - `[featureSliceName].constants.ts`: Constantes (endpoints de API, chaves de query).
        - `[featureSliceName].api.ts`: Funções para chamadas de API.
        - `[featureSliceName].queries.ts`: Hooks do TanStack Query (`useQuery`, `useMutation`).
        - `index.ts`: Barrel file para reexportar de `logic/`.
      - `ui/`: Contém os componentes React visuais.
        - `NomeDoComponente.tsx`
        - `index.ts` (opcional, para reexportar componentes de `ui/`)

5.  **Arquivos Padrão do Next.js App Router:**
    - `page.tsx` para páginas.
    - `layout.tsx` para layouts.
    - `loading.tsx`, `error.tsx` conforme necessário.

---

## II. CONVENÇÕES DE NOMENCLATURA DE ARQUIVOS:

1.  **Arquivos de Lógica (dentro de `logic/`):**

    - Padrão: `[nomeDaFeatureSlice].[papelDoArquivo].ts`
    - Separador: Ponto (`.`)
    - Exemplos: `listagemViagens.api.ts`, `formularioViagem.queries.ts`, `viagem.types.ts`.

2.  **Componentes React (dentro de `ui/`):**

    - Padrão: `PascalCase.tsx`
    - Exemplos: `TabelaViagens.tsx`, `CartaoDetalheVeiculo.tsx`.

3.  **Hooks Customizados (se fora de `*.queries.ts` e não relacionados a TanStack Query):**

    - Padrão: `useCamelCase.ts` (ex: `useContadorLocal.ts`)

4.  **Barrel Files:**
    - Sempre `index.ts`.

---

## III. ESTRUTURA E PADRÕES DE CÓDIGO:

1.  **Tipos (`*.types.ts`):**

    - Interfaces e tipos claros para parâmetros de API, respostas de API, opções de hooks e entidades de dados principais.
    - Comentários JSDoc detalhados, especialmente para campos com regras de negócio ou origem específica.
    - **EVITAR** reexportar tipos que pertencem a outros módulos (ex: tipos puramente visuais de uma biblioteca de UI devem ser importados de sua origem pelos componentes de UI, não de um arquivo `.types.ts` da lógica).

2.  **Constantes (`*.constants.ts`):**

    - Endpoints de API (ex: `export const VIAGENS_API_ENDPOINT = "/api/viagens";`).
    - Fábricas de chaves para TanStack Query (ex: `export const viagemQueryKeys = { all: ['viagens'], list: (params) => [...] };`).

3.  **Funções de API (`*.api.ts`):**

    - Funções `async`. Preferencialmente usando `Workspace`.
    - Parâmetros e retornos fortemente tipados.
    - Uso de constantes para URLs de endpoint.
    - Construção clara do corpo da requisição (`body`).
    - Tratamento de erro robusto:
      - Verificar `response.ok`.
      - Tentar parsear o corpo do erro (texto ou JSON).
      - Logar o erro detalhado usando `logger.error(new Error(mensagemExtraida), { contexto... });`.
      - Lançar (`throw`) um novo `Error` com uma mensagem amigável.
    - Retornar `Promise<TipoDaResposta>` com `response.json() as Promise<TipoDaResposta>`. Incluir tratamento para JSON de resposta inválido mesmo com status 2xx.

4.  **Hooks do TanStack Query (`*.queries.ts`):**

    - Incluir `"use client";` no topo.
    - Usar `useQuery` / `useMutation`.
    - Utilizar a fábrica de chaves de `*.constants.ts`.
    - Parâmetros tipados e com defaults.
    - Combinar parâmetros do hook com dados de stores externos (se aplicável).
    - Usar `placeholderData: keepPreviousData` (TanStack Query v5).
    - Usar `meta` (ex: `meta: { suppressGlobalErrorHandler: true }`) para coordenar com handlers globais.
    - **Tratamento de Efeitos Colaterais (Erros/Sucesso) via `useEffect`:**
      - **Erros:** Observar `queryResult.isError` e `queryResult.error`. Logar com `logger.warn()`. Disparar toast Sonner (`toast.error("Título", { description: error.message, action: { label: "Tentar Novamente", onClick: () => queryResult.refetch() } });`).
      - **Sucesso (Opcional para queries):** Observar `queryResult.isSuccess` e `queryResult.data`. Logar com `logger.info()`.

5.  **Logger (`logger` importado de `utils`):**

    - `logger.error(new Error(...), { ... })` na camada da API.
    - `logger.warn({ ... })` no `useEffect` de erro dos hooks.
    - `logger.info({ ... })` ou `logger.debug({ ... })` para informações/depuração.

6.  **Comentários:**
    - **JSDoc (`@description`, `@param`, `@returns`, `@throws`, `@hook`, `@function`, `@file`)** para todas as exportações públicas.
    - Estilo "Better Comments" para organização e destaque:
      - `//* Título da Seção`
      - `//! Alerta Importante`
      - `//? Dúvida ou Ponto de Investigação`
      - Evitar `//TODO:` no código final gerado, a menos que explicitamente parte de um rascunho.
    - Comentários úteis, concisos, explicando o "porquê" quando necessário.

---

## IV. EXEMPLO DE ESTRUTURA PARA UMA FEATURE "VIAGENS" (Listagem):

```typescript
/app/(modules)/viagens/
├── _internal/
│   └── listagem/  // Ou 'tabelaViagens', 'dadosViagens', etc.
│       ├── logic/
│       │   ├── listagemViagens.types.ts
│       │   ├── listagemViagens.constants.ts
│       │   ├── listagemViagens.api.ts
│       │   ├── listagemViagens.queries.ts
│       │   └── index.ts
│       └── ui/
│           ├── TabelaViagens.tsx
│           ├── FiltrosViagens.tsx
│           └── index.ts
├── page.tsx     // Página que usa os elementos de _internal/listagem/
└── layout.tsx
```
