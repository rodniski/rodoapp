# Configurações do Projeto

## 1. `tsconfig.json`
Os aliases foram configurados para facilitar os imports e organizar o código. Veja `aliases.md` para detalhes.

## 2. TailwindCSS
- Configurado em `tailwind.config.ts`.
- Plugins utilizados:
  - `@tailwindcss/typography` para tipografia personalizada.
- Uma explicaçao mais detalhada da configuração e um guia estão descritos em `tailwind.md`

## 3. Fonte Inter
- Configurada como fonte padrão no projeto usando o sistema de fontes do Next.js.
- Declarada no `layout.tsx`.

## 4. Gerenciamento de Estado
- Substituímos o Zustand pelo **Jotai**.
- Configuração centralizada para gerenciamento de estado simples e modular.

## 5. React Query
- **TanStack Query** foi integrado para chamadas e cache de APIs.
- Um `QueryProvider` foi criado dentro de `shared/lib/queryProvider.tsx`.
