# Tailwind

Este projeto utiliza o **TailwindCSS** como ferramenta de estilização para oferecer design consistente e escalável. Abaixo estão as configurações atuais e orientações para personalizar ainda mais.

## 3. shared

### 1. hooks
A pasta features\shared\hooks contém hooks personalizados reutilizáveis, que encapsulam funcionalidades específicas para serem usadas em diferentes partes do projeto. Hooks ajudam a organizar e reaproveitar lógica relacionada a estado ou efeitos no React.

- **use-mobile.tsx**: Este hook detecta se a largura da janela está abaixo de um ponto de interrupção (breakpoint), ajudando a diferenciar layouts para dispositivos móveis. <br><br>
- **index.ts**: Centraliza e facilita a exportação dos hooks da pasta hooks, permitindo importações mais simples e organizadas. <br>

### 2. lib
A pasta features\shared\lib contém recursos globais reutilizáveis que oferecem suporte ao funcionamento do projeto. Esses recursos incluem funções utilitárias, provedores de contexto e configurações de estado ou dados. Tudo aqui é compartilhado entre diferentes partes do sistema, garantindo modularidade e consistência.

- **utils.ts**: Fornece uma função utilitária chamada cn para combinar classes CSS, especialmente útil quando se trabalha com TailwindCSS. Resolve conflitos de classes usando clsx e tailwind-merge. <br><br>
- **queryProvider.tsx**: Configura o React Query no projeto, permitindo o gerenciamento de cache, chamadas assíncronas de APIs e debugging durante o desenvolvimento. <br><br>
- **breadcrumbsContext.tsx**: erencia o estado global de breadcrumbs (trilhas de navegação), permitindo que diferentes componentes adicionem ou modifiquem os breadcrumbs exibidos. <br><br>
- **index.ts**: Facilita a exportação de todos os recursos da pasta lib em um único arquivo, tornando mais simples a importação nos demais módulos do projeto. <br><br>

### 3. components
A pasta features\shared\components é projetada para centralizar todos os componentes reutilizáveis do projeto. Isso inclui elementos de UI (interface de usuário), temas, tabelas e outros recursos visuais compartilhados

**features\shared\components\ui**:<br>
- avatar.tsx: Exibe avatares com imagem, fallback e estilo.<br>
- badge.tsx: Exibe badges com suporte a variantes.<br>
- breadcrumb.tsx: Componentes para trilhas de navegação (breadcrumbs) com links e separadores.<br>
- button.tsx: Componente de botão altamente personalizável com suporte e variantes de estilo e tamanhos.<br>
- card.tsx: Conjunto de componentes para criar cartões estilizados com cabeçalho, titulo, descrição, conteúdo e rodapé.<br>
- command.tsx: Cria componentes para construir menus de comando e atalhos personalizados.<br>
- dialog.tsx: Implemente um sistema de diálogo com animações e design adaptável.<br>
- dropdownmenu.tsx: Componente de menus suspensos reutilizáveis e acessíveis.<br>
- input.tsx: Para campos de entrada reutilizáveis com estilização padrão do TailwindCSS.<br>
- label.tsx: Componente reutilizavel para rótulos de formulários<br>
- popover.tsx: Popover estilizado que suporta animações e alonhamento.<br>
- separator.tsx: Um separador decorativo ou semântico, usado para dividir seções de layout.<br>
- sidebarprovider.tsx: Gerencia o estado e contexto da Sidebar, permitindo alternar entre expandido e colapsado.<br>