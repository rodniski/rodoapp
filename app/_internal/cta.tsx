"use client";

import { motion } from "motion/react";
import { Button } from "ui";
import { ExternalLink } from "lucide-react";
import { ShimmerButton } from "ui";

/**
 * Componente CTA (Call To Action)
 *
 * @description
 * Renderiza uma seção com título, descrição e botão animado que direciona o usuário
 * para a plataforma HESK de abertura de chamados. Utiliza animações suaves com Framer Motion
 * e estilização via TailwindCSS.
 *
 * @remarks
 * - Acessível e responsivo
 * - Usa animações ao entrar na viewport
 * - Integração com a plataforma externa via link seguro
 *
 * @example
 * ```tsx
 * import { CTA } from '@/components/cta';
 *
 * export default function SuportePage() {
 *   return (
 *     <main>
 *       <CTA />
 *     </main>
 *   );
 * }
 * ```
 *
 * @returns {React.ReactElement} Seção com chamada para ação animada
 */

export function CTA() {
  return (
    <section>
      <div className="container flex flex-col items-center gap-4 py-24 text-center md:py-32">
        <motion.h2
          className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Precisa de suporte técnico?
        </motion.h2>
        <motion.p
          className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Acesse o HESK, nossa plataforma de abertura de chamados, para
          solicitar suporte técnico, reportar problemas ou solicitar melhorias
          em qualquer um dos módulos do hub.
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mt-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <ShimmerButton className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-transparent hover:bg-transparent"
              asChild
            >
              <a
                href="http://hesk.rodoparana.com.br"
                target="_blank"
                rel="noopener noreferrer"
              >
                Acessar HESK <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </ShimmerButton>
        </motion.div>
      </div>
    </section>
  );
}
