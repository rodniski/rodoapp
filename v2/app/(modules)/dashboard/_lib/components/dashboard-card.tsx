"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ExternalLink } from "lucide-react";
import type { Card } from "../data";
import { Badge } from "ui";
import { GlowingEffect } from "comp/aceternity";
import { CardIcon } from ".";
import { useGroupPermissions } from "hooks";

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
  const hasSubLinks = card.subLinks && card.subLinks.length > 0;

  const { hasAnyGroup, isAdmin } = useGroupPermissions();

  const handleCardClick = () => {
    if (!hasSubLinks && card.url) {
      window.open(card.url, card.external ? "_blank" : "_self");
    }
  };

  // Checa se existe um subLink ativo (hover). Se sim, pega o ícone dele; se não, pega o ícone principal do card
  const currentIcon = activeSubLink
    ? card.subLinks?.find((sl) => sl.id === activeSubLink)?.icon?.toLowerCase?.() ||
      card.icon?.toLowerCase?.()
    : card.icon?.toLowerCase?.();

  // Filtra sublinks de acordo com a permissão
  const visibleSubLinks = card.subLinks?.filter((subLink) => {
    if (isAdmin) return true;
    if (!subLink.requiresGroup || subLink.requiresGroup.length === 0) return true;
    return hasAnyGroup(subLink.requiresGroup);
  });

  return (
    <div
      className="w-[450px] flex flex-col items-stretch transition-all duration-300 cursor-pointer bg-background"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={handleCardClick}
    >
      <div className="relative flex flex-col flex-grow p-2 border rounded-md shadow-lg bg-card">
        <GlowingEffect
          blur={0}
          borderWidth={2}
          spread={60}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />

        <div className="flex flex-col items-start justify-start gap-3 w-full relative h-full  overflow-hidden rounded-md border-0.75 p-4 dark:shadow-[0px_0px_27px_0px_#2D2D2D]">
          <div className="flex items-center justify-between w-full">
            <div className={"flex gap-3 justify-start items-start"}>
              {/* Ícone principal (ou subLink) */}
              <CardIcon icon={currentIcon} />
              <h3 className="mt-2 text-base font-semibold fhd:text-xl">
                {card.title}
              </h3>
            </div>
            {card.external && (
              <ExternalLink className="ml-2 h-3 w-3 sm:h-3.5 md:h-4 sm:w-3.5 md:w-4 text-muted-foreground" />
            )}
          </div>

          {/* Listagem dos subLinks, exibida somente se existir subLinks e permissões */}
          {hasSubLinks && visibleSubLinks && (
            <motion.div
              variants={linkVariants}
              initial="hidden"
              animate={isActive ? "visible" : "hidden"}
              transition={{ duration: 0.2 }}
              className="flex justify-center gap-1 flex-wrap"
            >
              {visibleSubLinks.map((subLink) => (
                <Badge
                  key={subLink.id}
                  variant="secondary"
                  className="flex justify-end fhd:text-base text-end shadow hover:border-primary"
                  onMouseEnter={() => setActiveSubLink(subLink.id)}
                  onMouseLeave={() => setActiveSubLink(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(subLink.url, "_self");
                  }}
                >
                  {subLink.title}
                </Badge>
              ))}
            </motion.div>
          )}

          {/* Descrição dinâmica: muda caso exista um subLink hoverado */}
          <motion.div
            variants={descVariants}
            initial="hidden"
            animate={isActive ? "visible" : "hidden"}
            transition={{ duration: 0.2 }}
            className="mt-auto pt-2 sm:pt-3"
          >
            <p className="text-xs fhd:text-base text-muted-foreground">
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
