# app/
A pasta app/ é a base das rotas e layouts do projeto. Cada subpasta ou arquivo dentro dela representa uma rota (ou grupo de rotas) no sistema, e os arquivos relacionados definem como o conteúdo é renderizado, quais provedores são utilizados, e como o layout é estruturado.

<hr>

- **page.tsx**: <br>
Página inicial de login. <br>
A estrutura de layout é flexível e utiliza classes utilitárias do Tailwind.

- **layout.tsx**: <br>
Define a estrutura global da aplicação (raiz). <br>
Usa o ThemeProvider para alternar entre os modos claro/escuro e integra o QueryProvider para gerenciar chamadas API de forma eficiente.

- **global.css**: <br>
Estilos globais utilizando o TailwindCSS. <br>
Define variáveis CSS para temas claro e escuro.
    
- **central/layout.tsx**: <br>
Gerencia o layout da página "Central", incluindo breadcrumbs e sidebar. <br>
Carrega uma barra lateral com um AppSidebar e exibe a navegação em trilha utilizando o BreadcrumbDisplay.

- **central/page.tsx**: <br>
Renderiza a página principal da "Central" com animações de fundo e breadcrumbs. <br>
O BentoInicial é o componente principal da página e é carregado dinamicamente.

<hr>

- **Resumo**: <br>
**app/page.tsx**: Página inicial do login. <br>
**app/layout.tsx**: Layout global, configurando temas, fontes e notificações. <br>
**app/central/layout.tsx**: Layout da página "Central" com sidebar e breadcrumbs. <br>
**app/central/page.tsx**: Renderiza a página principal da Central com animações e fundo dinâmico. <br>
**app/globals.css**: Estilos globais com configurações de tema claro/escuro. <br>

- **O que colocar nessa pasta?**: <br>
Na pasta app/, você coloca layout.tsx para definir layouts compartilhados, page.tsx para o conteúdo principal de cada rota, e utiliza componentes dinâmicos quando necessário.
