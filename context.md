# 📘 Guia de Contexto e Boas Práticas - RodoApp

## 🧠 Visão Geral do Projeto
O **RodoApp** é uma plataforma corporativa modular (intranet) desenvolvida para centralizar os serviços internos dos grupos **Rodoparaná** e **Timber**. O projeto está estruturado para ser **moderno**, **escalável** e de fácil manutenção, com foco em integração com o TOTVS Protheus e outros sistemas internos.

---

## 🏗️ Estrutura do Projeto

### Diretórios Globais (`/_core`)
- `components/`: Componentes compartilhados (UI, layout base, ícones, etc.)
- `hooks/`: Hooks reutilizáveis e universais
- `stores/`: Zustand stores globais
- `types/`: Tipagens universais utilizadas em múltiplos domínios
- `utils/`: Funções utilitárias reutilizáveis

### Diretórios de Módulos (`/app/(modules)`)
Cada módulo é um microfrontend com autonomia, contendo:
- `_lib/api/`: Endpoints REST específicos do domínio
- `_lib/components/`: Componentes usados somente dentro do módulo
- `_lib/stores/`: Stores locais com Zustand
- `_lib/types/`: Tipos específicos
- `_lib/hooks/`: Hooks locais (se necessário)

Exemplo de estrutura para um módulo:
```
/app/(modules)/prenota/
├── _lib/
│   ├── tabela/
│   │   ├── config/
│   │   │   ├──tabela.api.ts
│   │   │   ├──tabela.hooks.ts
│   │   │   ├──tabela.types.ts
│   │   │   └──index.ts
│   │   └── components/
│   │   │   ├──columns.tsx
│   │   │   └──tabela.tsx
│   ├── actions/
│   │   ├──anexo/
│   │   │   ├── config/
│   │   │   │   ├──anexo.api.ts
│   │   │   │   ├──anexo.hooks.ts
│   │   │   │   ├──anexo.types.ts
│   │   │   │   └──index.ts
│   │   │   └── components/
│   │   │   │   ├──anexoDownload.tsx
│   │   │   │   └──editar.tsx
│   │   │   └──index.ts
│   │   ├── editar/
│   │   │   ├──config/
│   │   │   │   ├──editar.api.ts
│   │   │   │   ├──editar.hooks.ts
│   │   │   │   ├──editar.types.ts
│   │   │   │   └──index.ts
│   │   │   └──components/
│   │   │   │   ├──editar.tsx
│   │   │   │   └──index.ts
│   │   │   └──index.ts
│   │   ├── editar/
│   │   │   ├──config/
│   │   │   │   ├──editar.api.ts
│   │   │   │   ├──editar.hooks.ts
│   │   │   │   ├──editar.types.ts
│   │   │   │   └──index.ts
│   │   │   └──components/
│   │   │   │   ├──editar.tsx
│   │   │   │   └──index.ts
│   │   │   └──index.ts
│   │   └── index.ts
│   └── filtro/
└── page.tsx
```

---

## 🧩 Organização dos Imports

### Alias definidos no `tsconfig.json`
```json
"paths": {
  "@/*": ["./*"],
  "comp/*": ["./_core/components/*"],
  "ui/*": ["./_core/components/ui/*"],
  "utils/*": ["./_core/utils/*"],
  "hooks/*": ["./_core/hooks/*"],
  "stores/*": ["./_core/stores/*"],
  "types/*": ["./_core/types/*"],
  "@modules/*": ["./app/(modules)/*"],
  "@prenota/*": ["./app/(modules)/prenota/_lib/*"]
}
```

### Boas Práticas
- Sempre que possível, importar de `index.ts` para evitar caminhos longos.
- Evite caminhos relativos como `../../../components`; use os aliases.
- Centralize as exportações por domínio ou módulo.

#### Exemplo de importação limpa:
```ts
import { Button } from "ui";
import { useMobile } from "hooks";
import { columns } from "@prenota/components";
```

---

## 🔐 Autenticação
- Integração via **NextAuth** + API TOTVS Protheus
- Sessão persistente entre módulos
- Detecção de grupo e filial automática ao logar
- A documentação (documentacao) é pública e acessível sem login

---

## 🚚 Módulos Existentes
| Módulo       | Caminho                          | Descrição                                     |
|--------------|----------------------------------|-----------------------------------------------|
| Hub          | `/app`                           | Navegação geral da intranet                   |
| Login        | `/app/(modules)/login`           | Tela de login integrada ao Protheus          |
| Dashboard    | `/app/(modules)/dashboard`       | Acesso central aos módulos                    |
| Prenota      | `/app/(modules)/prenota`         | Pré-notas integradas ao Protheus             |
| Controle     | `/app/(modules)/controle`        | Controle de movimentações (ex: pneus)        |
| Documentação | `/app/(modules)/documentacao`    | Repositório de documentos internos           |

---

## 🧰 Stack Técnica

| Camada       | Tecnologias                                     |
|--------------|--------------------------------------------------|
| Frontend     | Next.js 15 React 19, TypeScript                  |
| Estilização  | TailwindCSS 4.1, Shadcn UI, Aceternity UI        |
| Estado       | Zustand                                          |
| Backend API  | TANSTACK QUERY + autenticação com API Protheus   |
| Banco        | MSSQL (Protheus)                                 |
| ORM          | Prisma (módulo Prenota)                          |
| Deploy       | Oracle Server (Ubuntu)                           |
| Analytics    | PostHog (em planejamento)                        |
| Gerenciador  | `pnpm`                                           |

---

## 📚 Convenções e Padrões
- **`index.ts` obrigatório** em pastas de componentes, stores, hooks e types
- **Imports sempre por alias**, mesmo para arquivos dentro do mesmo módulo
- **Evite dependências cruzadas entre módulos**, a não ser por `_core`
- **Autonomia por módulo**, favorecendo testes, manutenção e escalabilidade

---

## 📅 Status Atual
- ✅ Header global implementado
- ✅ Módulo Prenota funcional (com MSSQL via Prisma)
    |- Inclusao pendente
- ✅ Auth funcional (NextAuth + Protheus)
- 📚 Módulo de Documentação em progresso
- ✅ Layout geral da aplicação consolidado

---

## 🙌 Responsável Técnico
**Guilherme Rodniski Correia**
- Email: guilherme.correia@rodoparana.com.br
- Projeto: interno para Rodoparaná e Timber

