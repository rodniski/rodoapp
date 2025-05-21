# 🚛 RodoApp

[![Next.js](https://img.shields.io/badge/Next.js-14-blue?logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styled-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-Global%20State-orange?logo=react)](https://github.com/pmndrs/zustand)
[![Status](https://img.shields.io/badge/Status-Em%20Evolu%C3%A7%C3%A3o%20Constante-green)](#)

> Hub corporativo completo para o **Grupo Rodoparaná** e **Grupo Timber**, integrando sistemas internos em uma única plataforma moderna, modular e escalável.

---

## 📖 Visão Geral

O **RodoApp** é uma intranet modular que centraliza ferramentas internas da organização, como o controle de pré-notas, documentação de processos e gestão de pneus, oferecendo **acesso unificado**, **autenticação via API TOTVS** e uma experiência de uso fluida e responsiva.

---

## 🧱 Arquitetura

A arquitetura do RodoApp é projetada para modularidade e escalabilidade, com uma clara separação de responsabilidades.

### Estrutura Geral

- **`_core/`**: Localizado na raiz do projeto (`./_core/`), este diretório contém todos os elementos compartilhados globalmente entre os diferentes módulos da aplicação. Isso inclui:
  - `components/`: Componentes React genéricos e reutilizáveis (ex: botões, modais).
    - `ui/`: Componentes de UI (ex: Shadcn UI, Aceternity UI) prontos para uso.
  - `config/`: Configurações globais da aplicação (ex: opções padrão para TanStack Query).
  - `utils/`: Funções utilitárias genéricas.
  - `hooks/`: Hooks React globais e reutilizáveis.
  * `stores/`: Stores Zustand globais.
  * `server/`: Lógica de backend compartilhada (ex: helpers para API Routes, se aplicável).
  * `types/`: Definições de tipos TypeScript globais.
- **`app/(modules)/[nomeDoModulo]/`**: Cada funcionalidade principal da aplicação reside em seu próprio módulo.
  - **`_internal/`**: Dentro de cada módulo (ou sub-rota complexa), a pasta `_internal/` isola o código específico daquele domínio, promovendo baixo acoplamento. Sua estrutura típica é:
    - `[featureSliceName]/` (ex: `listagem/`, `formulario/`): Agrupa funcionalidades específicas dentro do módulo.
      - `logic/`: Contém toda a lógica não visual.
        - `[featureSliceName].types.ts`: Tipos TypeScript.
        - `[featureSliceName].constants.ts`: Constantes (endpoints, chaves de query).
        - `[featureSliceName].api.ts`: Funções de chamada de API.
        - `[featureSliceName].queries.ts`: Hooks TanStack Query.
        - `index.ts`: Reexporta elementos de `logic/`.
      - `ui/`: Componentes React visuais específicos da feature slice.
        - `NomeDoComponente.tsx`
        - `index.ts` (opcional)
  - `page.tsx`, `layout.tsx`: Estrutura padrão do Next.js App Router.

> 📦 Esta abordagem promove **organização por contexto**, facilita a manutenção e garante maior independência e clareza entre os diferentes domínios da aplicação.

---

## 📦 Organização de Módulos

| Módulo       | Caminho                       | Descrição                                                 |
| ------------ | ----------------------------- | --------------------------------------------------------- |
| Hub          | `/app`                        | Landing page e navegação entre módulos                    |
| Login        | `/app/login`                  | Tela de login integrada à API do TOTVS                    |
| Dashboard    | `/app/(modules)/dashboard`    | Dashboard de navegação entre módulos                      |
| Prenotas     | `/app/(modules)/prenota`      | Gestão de pré-notas integradas ao Protheus                |
| Controle     | `/app/(modules)/controle`     | Gerenciamento de saída (ex: pneus, borracharia, portaria) |
| Documentação | `/app/(modules)/documentacao` | Documentação completa de processos da empresa             |

---

## ⚙️ Stack Tecnológica

| Camada       | Tecnologias                                                               |
| ------------ | ------------------------------------------------------------------------- |
| 🖥️ Frontend  | Next.js (App Router), React, TypeScript                                   |
| 🎨 Estilo    | TailwindCSS, Shadcn UI, Aceternity UI                                     |
| 🔐 Auth      | API do TOTVS Protheus                                                     |
| 💾 Banco     | MSSQL (Protheus)                                                          |
| 🔗 ORM       | Prisma (modular, usado no Prenota)                                        |
| 🌐 API       | Next.js API Routes (REST) (com tRPC em estudo)                            |
| 📊 Analytics | PostHog (em planejamento)                                                 |
| ☁️ Deploy    | Oracle Server (Ubuntu)                                                    |
| 📦 Pacotes   | Gerenciados com `pnpm`                                                    |
| 🔁 Estado    | Zustand (global em `_core/stores` e local em `_internal/[module]/stores`) |

---

## 📂 Estrutura de Imports (`paths`)

A estrutura de imports é baseada em aliases definidos no `tsconfig.json`, permitindo imports curtos e legíveis:

```json
{
"compilerOptions": {
"paths": {
"@/_": ["./_"],
"@/": ["./"],
"comp/_": ["./\_core/components/_"],
"ui": ["./_core/components"],
"config/_": ["./\_core/config/_"],
"logic": ["./_core/config"],
"ui/_": ["./\_core/components/ui/_"],
"ui": ["./_core/components/ui"],
"utils/_": ["./\_core/utils/_"],
"utils": ["./_core/utils"],
"hooks/_": ["./\_core/hooks/_"],
"hooks": ["./_core/hooks"],
"stores/_": ["./\_core/stores/_"],
"stores": ["./_core/stores"],
"server/_": ["./\_core/server/_"],
"server": ["./_core/server"],
"types/_": ["./\_core/types/_"],
"types": ["./_core/types"],

      "@modules/*": ["./app/(modules)/*"],
      "@login/*": ["./app/login/_internal/*"],
      "@prenota/*": ["./app/(modules)/prenota/_internal/*"],
      "@pedido/*": ["./app/(modules)/prenota/pedido/_internal/*"],
      "@inclusao/*": ["./app/(modules)/prenota/inclusao/_internal/*"],
      "@controle/*": ["./app/(modules)/controle/_internal/*"],
      "@borracharia/*": ["./app/(modules)/controle/borracharia/_internal/*"],
      "@portaria/*": ["./app/(modules)/controle/portaria/_internal/*"],
      "@documentacao/*": ["./app/(modules)/documentacao/_internal/*"]
    }

}
}
```

> 📁 Cada pasta que representa um domínio ou grupo de funcionalidades (`_core/*`, `_internal/*/[featureSliceName]/logic`, `_internal/*/[featureSliceName]/ui`) possui um `index.ts` que reexporta os itens públicos, permitindo importar diretamente da raiz da pasta ou do alias.
>
> Exemplo de uso:
>
> ```typescript
> import { Button } from "ui"; // De _core/components/ui
> import { useDebounce } from "hooks"; // De _core/hooks
> import { logger } from "utils"; // De _core/utils
> import { fetchViagens } from "@modules/viagens/_internal/listagem/logic"; // Exemplo mais específico
> // Ou, se @viagensListagem for um alias para app/(modules)/viagens/_internal/listagem/
> // import { fetchViagens } from "@viagensListagem/logic";
> ```

> ✅ Isso elimina a necessidade de navegar por caminhos profundos (`../../..`) e facilita a manutenção e leitura do código.

---

## 🔐 Autenticação

- Integração com a **API do TOTVS Protheus** para validação de credenciais.
- Gerenciamento de sessão e estado de autenticação pela aplicação.
- Identificação automática de grupo e filial do usuário após login.
- Módulo de Documentação potencialmente acessível sem autenticação completa (a definir).

---

## ✅ Roadmap Entregue

Todas as fases inicialmente planejadas foram concluídas:

| Fase | Descrição                         | Status      |
| ---- | --------------------------------- | ----------- |
| 1️⃣   | Implementação do Hub              | ✅ Completo |
| 2️⃣   | Integração dos Módulos Existentes | ✅ Completo |
| 3️⃣   | Expansão do Módulo Prenota        | ✅ Completo |

---

## 📋 Backlog de Próximas Funcionalidades

Com as fases principais do roadmap inicial concluídas, o foco se volta para as seguintes melhorias e novas funcionalidades:

### Módulo de Cobrança

- [ ] Corrigir cadastros de clientes para lojas corretas
- [ ] Consulta e negativação automática no SPC (_somente se já houve um contato de cobrança_)
- [ ] Cobrança pró-ativa via schedule
- [ ] Negativação SPC pelo Protheus (integrar ação)

### Processos Gerais

- [ ] Solicitação de imagens de câmeras
- [ ] Solicitação de transferência de bens e emissão de NF de transferência para contabilidade
- [ ] Abertura de filiais (processo digital)
- [ ] Controle de EPIs
- [ ] Controle de entradas na portaria (integrado ao módulo de Controle)

---

## 🚀 Estado Atual

- ✅ Header global e navegação implementados.
- ✅ Layout base da aplicação em produção.
- ✅ Módulo Prenota funcional e integrado com MSSQL (via Prisma).
- ✅ Autenticação via API TOTVS funcional.
- ✅ Documentação interna de processos em andamento e acessível.
- 🔄 Logger robusto implementado e em uso.
- 🔄 Estrutura de pastas e código padronizada com `_internal/`, `logic/`, `ui/`.

---

## 📝 Considerações

- A arquitetura busca facilitar a evolução para um modelo de **microfrontends lógicos**, onde cada módulo tem alta coesão e baixo acoplamento.
- Componentes, hooks e utilitários verdadeiramente globais residem em `_core/` para reuso máximo.
- Autonomia por módulo é incentivada, mantendo consistência na stack tecnológica principal.
- Planejamento futuro para suporte multi-empresas e um sistema de permissões mais granular.

---

## 📎 Contato & Contribuições

Este projeto é mantido por **Guilherme Rodniski Correia**.
