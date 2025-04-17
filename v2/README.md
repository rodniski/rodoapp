# 🚛 RodoApp

[![Next.js](https://img.shields.io/badge/Next.js-14-blue?logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Styled-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-Global%20State-orange?logo=react)](https://github.com/pmndrs/zustand)
[![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow)](#)

> Hub corporativo completo para o **Grupo Rodoparaná** e **Grupo Timber**, integrando sistemas internos em uma única plataforma moderna, modular e escalável.

---

## 📖 Visão Geral

O **RodoApp** é uma intranet modular que centraliza ferramentas internas da organização, como o controle de pré-notas, documentação de processos e gestão de pneus, oferecendo **acesso unificado**, **autenticação integrada** e uma experiência de uso fluida e responsiva.

---

## 🧱 Arquitetura

```bash
📁 /
├── _core/                
│   ├── components/        # Componentes globais (UI, layout, aceternity, theme, etc.)
│   ├── hooks/             # Hooks reutilizáveis globais
│   ├── stores/            # Zustand stores compartilhadas
│   ├── types/             # Tipagens globais
│   └── utils/             # Funções utilitárias

├── app/
│   ├── (modules)          # Módulos independentes (microfrontends)
│   │   ├── controle
│   │   │   ├── _lib
│   │   │   │   ├── api
│   │   │   │   │   └── index.ts
│   │   │   │   ├── components
│   │   │   │   │   └── index.ts
│   │   │   │   ├── stores
│   │   │   │   │   └── index.ts
│   │   │   │   └── types
│   │   │   │       └── index.ts
│   │   │   └── page.tsx

│   │   ├── prenota
│   │   │   ├── _lib
│   │   │   │   ├── api
│   │   │   │   ├── components
│   │   │   │   ├── stores
│   │   │   │   ├── types
│   │   │   │   └── hooks
│   │   │   └── page.tsx

│   │   ├── documentacao
│   │   │   ├── _lib
│   │   │   │   ├── api
│   │   │   │   ├── components
│   │   │   │   ├── stores
│   │   │   │   └── types
│   │   │   └── page.tsx

│   │   └── login
│   │       ├── _lib
│   │       │   ├── api
│   │       │   ├── components
│   │       │   ├── types
│   │       │   └── index.ts
│   │       └── page.tsx

│   ├── _lp/               # Landing page institucional
│   ├── api/              # API Routes (Next.js App Router)
│   └── layout.tsx        # Layout raiz da aplicação
```

> 📦 Cada módulo dentro de `(modules)` contém sua própria pasta `_lib`, isolando:
> - `api/`: chamadas específicas do domínio
> - `components/`: componentes locais
> - `stores/`: Zustand stores locais
> - `types/`: tipagens internas
> - `hooks/`: (quando necessário) lógica reutilizável
>
> Isso promove **organização por contexto**, facilita manutenção e garante independência entre os domínios.


---

## 📦 Organização de Módulos

| Módulo   | Caminho                      | Descrição                                     |
|----------|------------------------------|-----------------------------------------------|
| Hub      | `/app`                       | Landing page e navegação entre módulos        |
| Login    | `/app/(modules)/login`       | Tela de login integrada ao TOTVS              |
| Dashboard| `/app/(modules)/dashboard`   | Dashboard de navegação entre módulos          |
| Prenotas | `/app/(modules)/prenota`     | Gestão de pré-notas integradas ao Protheus    |
| Controle | `/app/(modules)/controle`    | Gerenciamento de saída (ex: pneus)            |
| Controle | `/app/(modules)/documentacao`| Documentação completa de processos da empresa |

---

## ⚙️ Stack Tecnológica

| Camada         | Tecnologias                                                                 |
|----------------|------------------------------------------------------------------------------|
| 🖥️ Frontend    | Next.js, React, TypeScript                                                  |
| 🎨 Estilo      | TailwindCSS, Shadcn UI, Aceternity UI                                       |
| 🔐 Auth        | NextAuth + API do TOTVS Protheus                                            |
| 💾 Banco       | MSSQL (Protheus)                                                            |
| 🔗 ORM         | Prisma (modular, usado no Prenota)                                          |
| 🌐 API         | REST (com tRPC em estudo)                                                   |
| 📊 Analytics   | PostHog (em planejamento)                                                   |
| ☁️ Deploy      | Oracle Server (Ubuntu)                                                      |
| 📦 Pacotes     | Gerenciados com `pnpm`                                                      |
| 🔁 Estado      | Zustand para gerenciamento global                                           |

---

## 📂 Estrutura de Imports (`paths`)

```json
"paths": {
  "@/*": ["./*"],
  "@/": ["./"],

  "comp/*": ["./_core/components/*"],
  "comp": ["./_core/components"],

  "ui/*": ["./_core/components/ui/*"],
  "ui": ["./_core/components/ui"],

  "utils/*": ["./_core/utils/*"],
  "utils": ["./_core/utils"],

  "hooks/*": ["./_core/hooks/*"],
  "hooks": ["./_core/hooks"],

  "stores/*": ["./_core/stores/*"],
  "stores": ["./_core/stores"],

  "server/*": ["./_core/server/*"],
  "server": ["./_core/server"],

  "types/*": ["./_core/types/*"],
  "types": ["./_core/types"],

  "@modules/*": ["./app/(modules)/*"],
  "@login/*": ["./app/(modules)/login/*"],
  "@prenota/*": ["./app/(modules)/prenota/_lib/*"],
  "@controle/*": ["./app/(modules)/controle/_lib/*"],
  "@documentacao/*": ["./app/(modules)/documentacao/_lib/*"]
}
```

> 📁 A estrutura de imports é baseada em aliases definidos no `tsconfig.json`, permitindo imports curtos e legíveis.
>
> 📦 Cada pasta que representa um domínio ou grupo de funcionalidades possui um `index.ts` que reexporta os itens internos, permitindo importar diretamente da raiz da pasta.
>
> Exemplo de uso:
>
> ```ts
> import { Button } from "ui";
> import { useMobile } from "hooks";
> import { columns } from "@prenota/components";
> ```

> ✅ Isso elimina a necessidade de navegar por caminhos profundos e facilita a manutenção e leitura do código.


---

## 🔐 Autenticação

- Integração com a **API do TOTVS Protheus**
- Sessão persistente entre todos os módulos
- Identificação automática de grupo e filial
- Documentação acessível sem autenticação

---

## 📅 Roadmap

| Fase | Descrição                                  | Status           |
|------|--------------------------------------------|------------------|
| 1️⃣   | Implementação do Hub                      | ✅ Completo        |
| 2️⃣   | Integração dos Módulos Existentes         | 🔜 Em breve        |
| 3️⃣   | Expansão do Módulo Prenota                | ⏳ Desenvolvimento |

---

## 🚀 Estado Atual

- ✅ Header global implementado  
- 🛠️ Layout base em produção  
- 🧾 Módulo Prenota funcional com MSSQL  
- 🔐 Autenticação integrada com NextAuth  
- 📚 Documentação interna em progresso  

---

## 📝 Considerações

- Estrutura baseada em **microfrontends**
- Componentes e hooks compartilhados via `_core`
- Autonomia por módulo com consistência de stack
- Suporte planejado para multi-empresas e permissões

---

## 📎 Contato & Contribuições

Este projeto é mantido por **Guilherme Rodniski Correia**.  
