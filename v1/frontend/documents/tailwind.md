# Tailwind

Este projeto utiliza o **TailwindCSS** como ferramenta de estilização para oferecer design consistente e escalável. Abaixo estão as configurações atuais e orientações para personalizar ainda mais.

## 1. tailwind.config.ts

- **Modo Escuro**:
O darkMode foi configurado como "class", o que significa que o modo escuro é ativado adicionando a classe dark ao elemento <html>. Isso facilita alternar entre temas claro e escuro.

- **Diretórios Monitorados**:
A propriedade content define os arquivos onde o Tailwind deve procurar classes CSS. No projeto, estão configurados:
- `./app/**/*.{js,ts,jsx,tsx}`: Inclui todos os arquivos no diretório app.
- `./components/**/*.{js,ts,jsx,tsx}`: Inclui os componentes personalizados.
- `./features/**/*.{js,ts,jsx,tsx}`: Inclui as pastas modulares de features.
- `./node_modules/@shadcn/ui/dist/**/*.{js,ts,jsx,tsx}`: Inclui componentes da biblioteca **Shadcn/UI**.

- **Personalização**:
Criamos cores persoanlizadas e adicionamos configurações específicas para títulos e outros blocos de código.

## 2. Como usar o Tailwind
1. **Instale o Tailwind**

2. **Configurar os Diretórios**:
Precisamos indicar onde estão os arquivos do projeto que usam classes do Tailwind, isso ajuda a gerar apenas o CSS necessário:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"], // Todos os arquivos dentro de "src" com extensões js,ts,jsx,tsx
  theme: {
    extend: {}, // Aqui você pode personalizar temas, como cores ou fontes
  },
  plugins: [], // Aqui você adiciona plugins extras, se necessário
}
```

3. **Configurar os CSS Principal**:
```javascript
Criamos um arquivo app\globals.css e adicionamos:
@tailwind base;       /* Define estilos base para resetar o CSS */
@tailwind components; /* Estilos pré-definidos de componentes */
@tailwind utilities;  /* Classes utilitárias como 'flex', 'bg-red-500' */
```

Após as diretivas principais, adicionamos customizações para estilos globais, por exemplo:
```javascript
h1 {
  @apply scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl;
}
```

Em seguida, usamos o @layer para organizar e definir regras que afetam todo o projeto

## 3. Resumo
- Configuração (tailwind.config.ts): Define temas, bordas, tipografia, e plugins.
- Estilos Globais (global.css): Centraliza a aplicação de estilos padrão e utilitários.