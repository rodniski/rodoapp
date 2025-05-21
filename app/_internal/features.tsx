"use client";

import { motion } from "motion/react";
import { GlowingEffect } from "ui";
import { FileText, ClipboardList, BookOpen } from "lucide-react";

const features = [
  {
    name: "Prenotas",
    description:
      "Cadastre pré-documentos de entrada do Protheus de forma rápida e eficiente, com ferramentas avançadas que otimizam seu fluxo de trabalho.",
    icon: FileText,
  },
  {
    name: "Controle de Saídas",
    description:
      "Gerencie a saída de pneus com total controle e eficiência, simplificando o processo de venda do início ao fim.",
    icon: ClipboardList,
  },
  {
    name: "Documentação",
    description:
      "Acesse de forma centralizada todos os processos e documentos da empresa, tornando a consulta e o aprendizado mais práticos e acessíveis.",
    icon: BookOpen,
  },
];

export function Features() {
  return (
    <section className="z-10 container space-y-16 pt-12 pb-24 max-w-7xl mx-auto">
      <div className="mx-auto max-w-[58rem] text-center">
        <motion.h2
          className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          Módulos Integrados
        </motion.h2>
        <motion.p
          className="mt-4 text-muted-foreground text-lg fhd:text-xl qhd:text-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Descubra como os módulos do hub de intranet do Grupo Rodoparaná
          transformam sua rotina com mais eficiência e controle.
        </motion.p>
      </div>
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3">
        {features.map((feature, index) => (
          <motion.div
            key={feature.name}
            className="relative min-h-[14rem] rounded-md border p-2 md:p-3 bg-card shadow-color-tint"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
          >
            <GlowingEffect
              blur={0}
              borderWidth={2}
              spread={60}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
            />
            <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-md border-0.75 p-6 dark:shadow-[0px_0px_27px_0px_#2D2D2D] md:p-6">
              <div className="relative flex flex-1 flex-col justify-between gap-3">
                <div className="w-fit rounded-md border border-primary p-2">
                  <feature.icon className="size-6 fhd:size-8 qhd:size-10 text-foreground" />
                </div>
                <div className="space-y-3 h-full flex flex-col justify-start">
                  <h3 className="pt-0.5 text-xl/[1.375rem] font-semibold font-sans -tracking-4 md:text-2xl/[1.875rem] qhd:text-3xl text-balance text-foreground">
                    {feature.name}
                  </h3>
                  <p className="font-sans text-xs fhd:text-base text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
