// app/documentacao/_internal/components/mdx/styling/HtmlStyling.components.tsx
"use client"; // Adicionado "use client" pois estes são componentes de apresentação
              // que podem ser usados em árvores de cliente via MDXRemote.

import React from 'react';
import type { HTMLAttributes, AnchorHTMLAttributes } from 'react';
import { cn } from 'utils';

//? Este arquivo define componentes React simples para estilizar
//? elementos HTML padrão gerados a partir do Markdown.

export const H1 = React.memo((props: HTMLAttributes<HTMLHeadingElement>) => (
  <h1
    className={cn("text-3xl sm:text-4xl font-bold my-8 tracking-tight border-b pb-3", props.className)}
    style={{ color: 'var(--foreground)', borderColor: 'var(--border)' }}
    {...props}
  />
));
H1.displayName = "MdxH1";

export const H2 = React.memo((props: HTMLAttributes<HTMLHeadingElement>) => (
  <h2
    className={cn("text-2xl sm:text-3xl font-semibold my-7 tracking-tight border-b pb-2", props.className)}
    style={{ color: 'var(--foreground)', borderColor: 'var(--border)' }}
    {...props}
  />
));
H2.displayName = "MdxH2";

export const H3 = React.memo((props: HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={cn("text-xl sm:text-2xl font-semibold my-6 tracking-tight", props.className)}
    style={{ color: 'var(--foreground)' }}
    {...props}
  />
));
H3.displayName = "MdxH3";
//TODO: Adicionar H4, H5, H6 se necessário, seguindo o padrão.

export const P = React.memo((props: HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={cn("my-4 leading-relaxed text-base", props.className)}
    style={{ color: 'var(--foreground)' }}
    {...props}
  />
));
P.displayName = "MdxP";

export const A = React.memo((props: AnchorHTMLAttributes<HTMLAnchorElement>) => (
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  <a
    className={cn("font-medium hover:underline", props.className)}
    style={{ color: 'var(--primary)' }}
    // Adiciona target="_blank" e rel="noopener noreferrer" para links externos automaticamente
    target={props.href?.startsWith('http') ? '_blank' : undefined}
    rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    {...props}
  />
));
A.displayName = "MdxA";

export const UL = React.memo((props: HTMLAttributes<HTMLUListElement>) => (
  <ul
    className={cn("my-5 ml-6 list-disc space-y-2", props.className)}
    style={{ color: 'var(--foreground)' }}
    {...props}
  />
));
UL.displayName = "MdxUL";

export const OL = React.memo((props: HTMLAttributes<HTMLOListElement>) => (
  <ol
    className={cn("my-5 ml-6 list-decimal space-y-2", props.className)}
    style={{ color: 'var(--foreground)' }}
    {...props}
  />
));
OL.displayName = "MdxOL";

export const LI = React.memo((props: HTMLAttributes<HTMLLIElement>) => (
  <li className={cn("pl-2 my-1", props.className)} {...props} />
));
LI.displayName = "MdxLI";

export const CodeInline = React.memo((props: HTMLAttributes<HTMLElement>) => (
  <code
    className={cn(
      "relative rounded bg-muted px-[0.4rem] py-[0.2rem] font-mono text-sm",
      props.className
    )}
    style={{ color: 'var(--muted-foreground)'}} // Usando muted-foreground para contraste
    {...props}
  />
));
CodeInline.displayName = "MdxCodeInline";

export const Pre = React.memo((props: HTMLAttributes<HTMLPreElement>) => (
  // Para um highlighting de sintaxe real, você integraria uma biblioteca como 'react-syntax-highlighter'
  // ou usaria plugins rehype/remark para isso no 'serialize'.
  <pre
    className={cn(
      "p-4 my-6 rounded-md overflow-x-auto text-sm border bg-muted/50", // Fundo sutil para o bloco
      props.className
    )}
    style={{ borderColor: 'var(--border)'}}
    {...props}
  />
));
Pre.displayName = "MdxPre";

export const Blockquote = React.memo((props: HTMLAttributes<HTMLQuoteElement>) => (
  <blockquote
    className={cn("my-6 border-l-4 pl-4 py-2 italic", props.className)}
    style={{ borderColor: 'var(--primary)', color: 'var(--muted-foreground)' }}
    {...props}
  />
));
Blockquote.displayName = "MdxBlockquote";

export const Hr = React.memo((props: HTMLAttributes<HTMLHRElement>) => (
  <hr
    className={cn("my-8", props.className)}
    style={{ borderColor: 'var(--border)' }}
    {...props}
  />
));
Hr.displayName = "MdxHr";

//? Considere adicionar componentes para tabelas Markdown (<table>, <thead>, <tbody>, <tr>, <th>, <td>)
//? se você for usar tabelas Markdown extensivamente e o remarkGfm não for suficiente/estiver desabilitado.