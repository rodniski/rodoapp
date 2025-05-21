"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
/**
 * Componente Footer
 *
 * @description
 * Renderiza o rodapé da aplicação com seções de links internos e externos, incluindo acesso a módulos,
 * ferramentas externas e sites institucionais. Utiliza animações com Framer Motion e estilização responsiva.
 *
 * @remarks
 * - Links externos são abertos em nova aba com segurança (noopener noreferrer)
 * - Organização em colunas com títulos e listas de links
 * - Usa TailwindCSS para layout e responsividade
 *
 * @example
 * ```tsx
 * import { Footer } from '@/components/footer';
 *
 * export default function Layout() {
 *   return (
 *     <div>
 *       <main>...</main>
 *       <Footer />
 *     </div>
 *   );
 * }
 * ```
 *
 * @returns {React.ReactElement} Elemento de rodapé com seções de navegação
 */

export function Footer() {
  // Definindo estrutura de dados para os links do footer
  interface FooterLink {
    label: string;
    href: string;
    external?: boolean;
  }

  interface FooterSection {
    title: string;
    links: FooterLink[];
  }

  // Dados do footer
  const footerData: FooterSection[] = [
    {
      title: "Módulos",
      links: [
        { label: "Prenotas", href: "/central/prenota" },
        { label: "Controle de Saídas", href: "/central/portaria" },
        { label: "Documentação", href: "/central/documentacao" },
      ],
    },
    {
      title: "Links Externos",
      links: [
        {
          label: "Assinatura",
          href: "http://hesk.rodoparana.com.br/signaturegen",
          external: true,
        },
        {
          label: "Suporte",
          href: "http://hesk.rodoparana.com.br",
          external: true,
        },
        {
          label: "Intranet",
          href: "https://intranet.rodoparana.com.br/",
          external: true,
        },
      ],
    },
    {
      title: "Sites",
      links: [
        {
          label: "Rodoparaná",
          href: "https://rodoparana.com.br",
          external: true,
        },
        {
          label: "Grupo Timber",
          href: "https://grupotimber.com.br",
          external: true,
        },
      ],
    },
  ];
  
  return (
    <footer className="border-t w-full px-4 sm:px-14">
      <div className="container flex flex-col gap-8 py-8 md:flex-row md:py-12">
        <div className="flex-1 space-y-4">
          <motion.h2
            className="font-bold qhd:text-2xl"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Grupo Rodoparaná
          </motion.h2>
          <motion.p
            className="text-sm text-muted-foreground qhd:text-lg"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Hub de intranet para acesso centralizado às ferramentas internas.
          </motion.p>
        </div>

        <div className="grid flex-1 grid-cols-2 gap-6 sm:grid-cols-3">
          {footerData.map((section, index) => (
            <motion.div
              key={index}
              className="space-y-4"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
            >
              <h3 className="text-sm font-medium qhd:text-lg">
                {section.title}
              </h3>
              <ul className="space-y-3 text-sm qhd:text-lg">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="text-muted-foreground transition-colors hover:text-primary flex items-center"
                    >
                      {link.label}
                      {link.external && (
                        <ExternalLink className="ml-1 h-3 w-3" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="container flex flex-col items-center justify-center gap-4 py-5 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground qhd:text-lg">
          &copy; {new Date().getFullYear()} RODOPARANA IMPLEMENTOS RODOVIARIOS.
          Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
