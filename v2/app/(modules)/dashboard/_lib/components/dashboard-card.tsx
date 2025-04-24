"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { ExternalLink } from "lucide-react";
import type { Card } from "../data";
import { Badge } from "ui";
import { GlowingEffect } from "comp/aceternity";
import { useAuth } from "@login/hooks"; // nosso hook de auth

interface DashboardCardProps {
  card: Card;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const linkVariants = {
  hidden: { opacity: 0, x: 10 },
  visible: { opacity: 1, x: 0 },
};

const descVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

export function DashboardCard({
  card,
  isActive,
  onMouseEnter,
  onMouseLeave,
}: DashboardCardProps) {
  const [activeSubLink, setActiveSubLink] = useState<string | null>(null);

  // 1) Puxamos os grupos do usuário
  const { grupos } = useAuth(); // GrupoFilial[]

  // 2) Função que checa se qualquer code exigido está no array de grupos
  function hasAnyGroup(requiredGroups: string[]) {
    return requiredGroups.some((rg) =>
      grupos.some((ug) => ug.Grupo === rg)
    );
  }

  const hasSubLinks = !!card.subLinks?.length;

  // 3) Aplica o filtro: se não exige grupo, ok; senão verifica hasAnyGroup
  const visibleSubLinks = card.subLinks?.filter((sub) => {
    if (!sub.requiresGroup || sub.requiresGroup.length === 0) {
      return true;
    }
    return hasAnyGroup(sub.requiresGroup);
  });

  const handleCardClick = () => {
    if (!hasSubLinks && card.url) {
      window.open(card.url, card.external ? "_blank" : "_self");
    }
  };

  return (
    <div
      className="w-full max-w-[600px] transition-all duration-300 cursor-pointer bg-background flex flex-col"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={handleCardClick}
    >
      <div className="relative flex flex-col flex-grow p-2 border rounded-md shadow-lg bg-card h-full">
        <GlowingEffect
          blur={0}
          borderWidth={2}
          spread={60}
          glow
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />

        <div className="flex flex-col items-start justify-start gap-3 w-full relative h-full overflow-hidden rounded-md border p-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-1 items-start">
              {/* Ícone */}
              {(() => {
                const IconComponent = activeSubLink
                  ? card.subLinks?.find((sl) => sl.id === activeSubLink)
                      ?.icon
                  : card.icon;
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

            {card.external && <ExternalLink className="size-4 text-muted-foreground" />}
          </div>

          {hasSubLinks && visibleSubLinks && (
            <motion.div
              variants={linkVariants}
              initial="hidden"
              animate={isActive ? "visible" : "hidden"}
              transition={{ duration: 0.2 }}
              className="flex flex-wrap gap-2 mt-2"
            >
              {visibleSubLinks.map((sub) => (
                <Badge
                  key={sub.id}
                  variant="secondary"
                  className="text-xs hover:border-primary"
                  onMouseEnter={() => setActiveSubLink(sub.id)}
                  onMouseLeave={() => setActiveSubLink(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(sub.url, sub.external ? "_blank" : "_self");
                  }}
                >
                  {sub.title}
                </Badge>
              ))}
            </motion.div>
          )}

          <motion.div
            variants={descVariants}
            initial="hidden"
            animate={isActive ? "visible" : "hidden"}
            transition={{ duration: 0.2 }}
            className="mt-auto pt-2"
          >
            <p className="text-sm text-muted-foreground">
              {activeSubLink
                ? card.subLinks?.find((sl) => sl.id === activeSubLink)?.description
                : card.description}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
