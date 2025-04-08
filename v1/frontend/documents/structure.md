# Estrutura do Projeto

O projeto foi organizado para manter a modularidade e a escalabilidade. Aqui está uma explicação sobre a estrutura atual:

## Diretórios Principais

### `app/`

- Contém as rotas e layouts principais.
- Exemplo de rota: `/assinatura`, `/portaria`, `/prenota`.

### `features/`

- Contém os módulos independentes do projeto.
- Cada módulo está isolado e possui:
  - **Assinatura**: `/features/assinatura`
  - **Portaria**: `/features/portaria`
  - **Central de Pré-Nota**: `/features/prenota`

### `shared/`

- Recursos reutilizáveis compartilhados entre módulos:
  - `components/`: Componentes reutilizáveis.
  - `lib/`: Funções e provedores globais.
  - `hooks/`: Hooks React compartilhados.
  - `utils/`: Funções utilitárias.
  - `types/`: Interfaces e tipos TypeScript.
  - `constants/`: Constantes globais.

## Configuração de Rotas

As rotas são definidas dentro da pasta `app`, e cada módulo é consumido diretamente de `features`.
