# RodoApp 🚛

## 📋 Sobre
Hub de intranet desenvolvido para o Grupo Rodoparaná, integrando diversos módulos em uma única plataforma. O projeto serve como ponto central de acesso para todas as ferramentas internas do grupo, incluindo a empresa Grupo Timber.

## 🏗️ Arquitetura
O projeto é estruturado como um hub central que se conecta a diversos microfrontends independentes. Cada microfrontend é um projeto separado, mantendo a independência e facilitando a manutenção.

### Estrutura de Comunicação
- Proxy reverso para gerenciamento de requisições
- Hospedagem unificada em servidor único
- Portas distintas para cada microfrontend
- Stack tecnológica consistente entre todos os módulos

## 🛠️ Stack Tecnológica
- **Frontend:** React
- **Estilização:** 
  - Tailwind CSS
  - Shadcn UI
  - Aceternity UI
  - Dice UI
- **Autenticação:** 
  - Next Auth
- **Analytics:** PostHog (futuro)
- **API:** tRPC
- **Framework:** Next.js
- **Linguagem:** TypeScript
- **Banco de Dados:** 
  - MSSQL (Protheus - módulo Prenota)
- **ORM:** Prisma (módulo Prenota)
- **Hospedagem:** Oracle Server (Ubuntu)
- **Gerenciamento de Estado:** Zustand (preferido)
- **Gerenciador de Pacotes:** pnpm

## 📦 Módulos

### 1. Hub (Em Desenvolvimento)
- Ponto central de acesso
- Landing Page em `/app`
- Header responsivo
- Navegação entre módulos

### 2. Prenotas
- Cadastro de pré-documentos de entrada do Protheus
- Integração com MSSQL do Protheus
- Requer atualizações futuras

### 3. Controle de Saída
- Gerenciamento de saída de pneus
- Exclusivo para Rodoparaná
- Sistema de vendas integrado

### 4. Documentação
- Processos da empresa
- Acesso livre (sem autenticação)
- Base de conhecimento

## 🔐 Autenticação
- Integração com API TOTVS Protheus
- Sessão compartilhada entre módulos
- Identificação de grupo e filial
- Documentação sem restrições de acesso

## 📅 Roadmap de Desenvolvimento
1. **Fase 1:** Hub (Atual)
   - Estrutura base
   - Componentes principais
   - Navegação

2. **Fase 2:** Módulos Existentes
   - Controle de Saída
   - Documentação

3. **Fase 3:** Prenota
   - Atualizações necessárias
   - Integrações

## 🚀 Estado Atual
- Header básico implementado
- Landing Page em desenvolvimento
- Componentes em fase de melhoria
- Autenticação e funcionalidades avançadas pendentes

## 📝 Notas
- Cada microfrontend é um projeto independente
- Stack tecnológica consistente entre módulos
- Foco em manutenibilidade e escalabilidade