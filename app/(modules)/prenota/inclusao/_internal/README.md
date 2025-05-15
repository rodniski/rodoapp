# _lib – Camada de domínio “Inclusão de Pré‑Nota”

Este diretório concentra TODA a lógica de negócio (sem UI) do fluxo de inclusão
de pré‑nota.  O padrão seguido é “feature‑first”: cada responsabilidade tem seu
próprio subdiretório, com exports centralizados em `index.ts`.

Estrutura:

_lib/
├─ api/              ← Funções puras de rede
│  ├─ post-anexo.ts      (POST /Prenota/Anexo)
│  ├─ post-prenota.ts    (POST /Prenota)
│  └─ index.ts           (barrel de api)
│
├─ hooks/            ← Hooks TanStack Query / Mutation
│  ├─ use-anexo.ts       (mutation para upload)
│  ├─ use-prenota.ts     (mutation para salvar pré‑nota)
│  └─ index.ts
│
├─ stores/           ← Zustand (estado local)
│  ├─ store-anexo.ts     (fila / progresso de upload)
│  ├─ store-prenota.ts   (draft completo da pré‑nota)
│  └─ index.ts
│
├─ types/            ← Tipagens 100 % explícitas
│  ├─ type-anexo.ts      (payload/response do upload + alias do draft)
│  ├─ type-prenota.ts    (estado + payload/response do POST)
│  └─ index.ts
│
└─ components/       ← Componentes sem dependência visual pesada
   └─ (ex.: CabecalhoForm, ProdutosTable, SalvarButton …)

Regras:

1. API não importa store nem hooks – funções de rede são puras.
2. Hooks consomem API e, quando necessário, interagem com a store.
3. Stores conhecem apenas tipos; nunca chamam fetch direto.
4. Qualquer arquivo que precise ser importado fora do subdiretório
   DEVE ser exportado pelo respectivo `index.ts` (barrel).

Sugestão de import:

import { usePostPreNota } from "@inclusao/_lib/hooks";
import { postPreNota }    from "@inclusao/_lib/api";
import { usePreNotaStore } from "@inclusao/_lib/stores";
