# Prompt para Desenvolvimento do Componente DataTable - Módulo por Módulo

## Objetivo
Desenvolver o componente `DataTable` genérico para o **RodoApp**, baseado no `DataTable` do Shadcn (TanStack Table), com funcionalidades modulares (ex.: paginação, filtro complexo, classificação complexa, agrupamento, etc.), implementadas uma a uma. Cada módulo será construído inicialmente no cliente (UI e estado com TanStack Table) e, ao final, migrado para server-side com um hook Prisma/TanStack Query, garantindo que **nenhuma das 40 mil linhas seja carregada no cliente**. O componente deve ser configurável via props, inspirado em ferramentas do AG Grid, e atender às tabelas "diferentemente parecidas" do projeto, especialmente Prenotas (contabilidade/financeiro).

## Contexto do Projeto
- **RodoApp**: Intranet modular para o Grupo Rodoparaná, com microfrontends (Prenotas, Controle de Saída, Documentação).
- **Stack**: Next.js, React, TypeScript, Tailwind CSS, Shadcn UI, Prisma (MSSQL/Protheus), TanStack Table (via Shadcn `DataTable`), TanStack Query.
- **Tabela de Prenotas**: 40 mil registros, exige recursos avançados (filtros, classificação, agrupamento, exportação). Outras tabelas são mais simples.
- **Restrição crítica**: Paginação, filtragem e classificação são **100% server-side** via Prisma. O cliente só renderiza UI, nunca carrega 40 mil linhas.
- **Funcionalidades confirmadas**:
  1. Agrupamento de colunas (opcional, usuário seleciona).
  2. Filtro complexo (múltiplas colunas, AND/OR).
  3. Classificação complexa (ordenação múltipla).
  4. Paginação (navegação com consultas SQL por página).
  5. Colunas com largura adaptável (`w-fit`, com resize).
  6. Tamanho máximo com scroll (vertical/horizontal, cabeçalhos fixos).
  7. Exportação de dados (CSV/Excel).
  8. Pinning de colunas (fixar esquerda/direita).
  9. Colunas ocultáveis (mostrar/esconder via menu).
  10. Carregamento e feedback (skeleton, toasts).
- **Excluídas**: Edição inline, seleção de linhas, resumo/footer.
- **Estratégia**: Implementar UI/estado no cliente com TanStack Table, usando props (ex.: `enablePagination`), e migrar para server-side com Prisma ao final.

## Prompt para Cada Módulo

**Módulo atual**: [NOME_DO_MÓDULO] (ex.: Paginação, Filtro Complexo, etc.)

### 1. Descrição do Módulo
- **O que é?** Descrever a funcionalidade (ex.: "Paginação permite navegar por páginas de registros, com controles para anterior/próxima e tamanhos de página").
- **Por que é importante?** Justificar, especialmente para Prenotas (ex.: "Gerencia 40 mil registros, carregando apenas 10-50 por vez").
- **Inspiração no AG Grid**: Detalhar elementos a replicar (ex.: "Controles intuitivos como botões numerados e indicador 'Página X de Y'").
- **Uso em outras tabelas**: Como se aplica a tabelas mais simples (ex.: "Pode ser desativado em tabelas pequenas").

### 2. Requisitos Funcionais
- **Comportamento esperado**:
  - No cliente (fase inicial): Como a UI/estado será gerenciado (ex.: "Botões para mudar página, estado `page` no TanStack Table").
  - No server-side (fase final): Como será mapeado para Prisma (ex.: "`skip: (page - 1) * pageSize, take: pageSize`").
- **Props relacionadas**:
  - Prop para ativar/desativar (ex.: `enablePagination?: boolean`).
  - Configurações específicas (ex.: `paginationConfig?: { pageSize: number, pageSizes?: number[] }`).
- **Restrições**:
  - Garantir que **nenhuma das 40 mil linhas seja carregada no cliente**.
  - Cada ação (ex.: clicar em "próxima") dispara uma consulta SQL específica.
- **Integração com UI**:
  - Componentes Shadcn a usar (ex.: `Button`, `Input`, `DropdownMenu`).
  - Estilização com Tailwind CSS para consistência.

### 3. Estrutura da Implementação
- **Fase 1 (Cliente)**:
  - **Objetivo**: Criar UI e gerenciar estado com TanStack Table.
  - **Passos**:
    - Adicionar prop ao `DataTable` (ex.: `enablePagination`).
    - Configurar estado no TanStack Table (ex.: `pagination: { pageIndex, pageSize }`).
    - Renderizar UI com Shadcn (ex.: botões para "Anterior", "Próxima").
    - Simular dados mock, usando `manualPagination: true` para preparar server-side.
    - Garantir responsividade (ex.: adaptar a diferentes resoluções).
  - **Saída**: Atualizar o arquivo `DataTable.tsx` with the module, mantendo o `artifact_id` existente (`fcd3eb6f-e920-411b-a4d9-0e1606e2e581`).
- **Fase 2 (Server-side, ao final)**:
  - **Objetivo**: Criar hook `useDataTableQuery` para queries Prisma.
  - **Passos**:
    - Mapear estado do TanStack Table para Prisma (ex.: `pageIndex` → `skip`).
    - Usar TanStack Query para fetch assíncrono.
    - Retornar apenas dados necessários (ex.: 10 linhas por página).
  - **Saída**: Novo artefato para o hook (novo `artifact_id`).

### 4. Detalhes Específicos do Módulo
- **UI/UX**:
  - Como o usuário interage (ex.: "Clicar em 'Próxima' muda a página").
  - Feedback visual (ex.: "Skeleton durante loading, toast para erros").
- **Estado**:
  - Estados gerenciados (ex.: `pageIndex`, `pageSize` para paginação).
  - Integração com outros módulos (ex.: filtros afetam paginação).
- **Configurações**:
  - Opções personalizáveis via props (ex.: `pageSizes: [10, 25, 50]`).
  - Comportamento padrão (ex.: `pageSize: 10`).

### 5. Critérios de Sucesso
- **Cliente**:
  - UI funcional e intuitiva, usando Shadcn/Tailwind.
  - Estado corretamente gerenciado no TanStack Table.
  - Preparado para server-side (ex.: `manualPagination: true`).
- **Server-side (futuro)**:
  - Consultas Prisma eficientes, retornando apenas dados necessárias.
  - Zero processamento de dados no cliente.
  - Suporta 40 mil registros com performance.
- **Geral**:
  - Configurável via props, reutilizável em Prenotas e outras tabelas.
  - Alinhado com inspiração do AG Grid (ex.: controles polidos).
  - Código limpo, com TypeScript e manutenção fácil.

### 6. Artefato Esperado
- **Fase 1 (Cliente)**:
  - Atualizar `DataTable.tsx` com o módulo.
  - Usar `artifact_id="fcd3eb6f-e920-411b-a4d9-0e1606e2e581"`.
  - Incluir apenas o código necessário para o módulo atual.
- **Formato**:

 // Código atualizado do DataTable com o módulo [NOME_DO_MÓDULO]

### 7. Próximos Passos
- **Após implementar o módulo atual**:
  - Confirmar se está alinhado com Prenotas (40 mil registros).
  - Escolher o próximo módulo (ex.: de Paginação para Filtros).
- **Lista de módulos restantes**:
  - [ ] Agrupamento de colunas
  - [ ] Filtro complexo
  - [ ] Classificação complexa
  - [ ] Paginação
  - [ ] Colunas com largura adaptável
  - [ ] Tamanho máximo com scroll
  - [ ] Exportação de dados
  - [ ] Pinning de colunas
  - [ ] Colunas ocultáveis
  - [ ] Carregamento e feedback
- **Finalização**:
  - Criar hook `useDataTableQuery` para server-side.
  - Testar com 40 mil registros simulados.

## Notas
- **Memórias**: Alinhar com preferências anteriores (server-side, toasts, 40 mil registros nunca no cliente; 14/04/2025, 15:22; 02/04/2025, 06:19).
- **AG Grid**: Inspirar-se em UI/UX (ex.: filtros flutuantes, botões intuitivos), mas garantir controle server-side.
- **Ordem sugerida**: Começar com **Paginação** (base para performance), seguido por Filtros, Classificação, Agrupamento, etc.

## Módulo Atual: [A DEFINIR]
- **Sugestão**: Iniciar com **Paginação**, pois é crítico para gerenciar 40 mil registros.
- **Pergunta**: Qual módulo implementar primeiro? (Paginação, Filtros, Classificação, Agrupamento, etc.)