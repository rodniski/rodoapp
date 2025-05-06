"use client";

import React, { useState } from "react";
// Garantir importações corretas (pode ser 'framer-motion')
import { motion, AnimatePresence } from "motion/react";
import { ExternalLink } from "lucide-react";
import type { Card } from "../data"; // Ajuste o caminho se necessário
import { Badge } from "ui"; // Ajuste o caminho se necessário
import { GlowingEffect } from "comp/aceternity"; // Ajuste o caminho se necessário
import { useAuth } from "@/app/login/_lib/hooks";

interface DashboardCardProps {
  card: Card;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

// Variants apenas para a animação de troca da descrição
const descContentVariants = {
  hidden: { opacity: 0, x: -20 }, // Inicia da esquerda, invisível
  visible: { opacity: 1, x: 0 },   // Termina na posição normal, visível
  // exit: { opacity: 0, x: 20 } // Opcional: animar para a direita ao sair
};

const transitionConfig = { duration: 0.2 }; // Duração da animação da descrição

export function DashboardCard({
  card,
  isActive,
  onMouseEnter,
  onMouseLeave,
}: DashboardCardProps) {
  // Estado para rastrear qual badge está com hover
  const [activeSubLink, setActiveSubLink] = useState<string | null>(null);

  const { grupos } = useAuth();

  // Função para verificar grupos (mantida)
  function hasAnyGroup(requiredGroups: string[] | undefined) {
    if (!requiredGroups || requiredGroups.length === 0) return true;
    return requiredGroups.some((rg) => grupos.some((ug) => ug.Grupo === rg));
  }

  const hasSubLinks = !!card.subLinks?.length;
  // Filtra sublinks visíveis (mantido)
  const visibleSubLinks = card.subLinks?.filter((sub) => hasAnyGroup(sub.requiresGroup));

  // Handler de clique no card (mantido)
  const handleCardClick = () => {
    if ((!visibleSubLinks || visibleSubLinks.length === 0) && card.url) {
      window.open(card.url, card.external ? "_blank" : "_self");
    }
  };

  // Determina a descrição a ser exibida
  const currentDescription = activeSubLink
    ? card.subLinks?.find((sl) => sl.id === activeSubLink)?.description ?? card.description
    : card.description;

  return (
    <div
      className="w-full max-w-[600px] transition-all duration-300 cursor-pointer bg-background flex flex-col"
      onMouseEnter={onMouseEnter} // Controla isActive
      onMouseLeave={onMouseLeave} // Controla isActive
      onClick={handleCardClick}
    >
      <div className="relative flex flex-col flex-grow p-2 border rounded-md shadow-lg bg-card h-full">
        {/* Efeito de Brilho - AGORA USA isActive */}
        <GlowingEffect
          blur={0}
          borderWidth={2}
          spread={60}
          glow
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />

        {/* Conteúdo Interno */}
        <div className="flex flex-col items-start justify-start gap-3 w-full relative h-full overflow-hidden rounded-md border p-4">
          {/* Cabeçalho */}
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-1 items-start">
              {/* ÍCONE: Sempre o principal */}
              {(() => {
                const IconComponent = card.icon;
                return (
                  IconComponent && (
                    <div className="text-primary size-8">
                      <IconComponent className="size-8 text-primary" />
                    </div>
                  )
                );
              })()}
              <h3 className="font-medium text-lg">{card.title}</h3>
            </div>
            {/* Ícone de link externo (se for link principal) */}
            {card.external && !hasSubLinks && (
              <ExternalLink className="size-4 text-muted-foreground" />
            )}
          </div>

          {/* BADGES: Container estático (sem motion aqui) */}
          {hasSubLinks && visibleSubLinks && visibleSubLinks.length > 0 && (
            // Remover motion.div daqui ou remover as props de animação dele
            <div className="flex flex-wrap gap-2 mt-2">
              {visibleSubLinks.map((sub) => (
                <Badge
                  key={sub.id}
                  variant="secondary"
                  className="text-xs hover:border-primary cursor-pointer"
                  // Handlers para trocar a descrição
                  onMouseEnter={() => setActiveSubLink(sub.id)}
                  onMouseLeave={() => setActiveSubLink(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(sub.url, sub.external ? "_blank" : "_self");
                  }}
                >
                  {sub.title}
                  {sub.external && <ExternalLink className="inline-block ml-1 size-3" />}
                </Badge>
              ))}
            </div>
          )}

          {/* DESCRIÇÃO: Container estático, conteúdo animado */}
          {/* Remover motion.div daqui ou remover as props de animação dele */}
          <div className="mt-auto pt-2 min-h-14 overflow-hidden relative">
            {/* AnimatePresence para animar a troca de texto */}
            <AnimatePresence mode="wait">
              <motion.p
                // Key dinâmica para AnimatePresence detectar a mudança
                key={activeSubLink || "main_description"}
                variants={descContentVariants} // Variants aplicadas ao texto
                initial="hidden"
                animate="visible"
                exit="hidden" // Define como o texto antigo sai
                transition={transitionConfig} // Define a duração/tipo da animação
                className="text-sm text-muted-foreground"
              >
                {currentDescription}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}