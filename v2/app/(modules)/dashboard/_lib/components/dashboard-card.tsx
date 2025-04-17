"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ExternalLink } from "lucide-react";
import type { Card } from "../data";
import { Badge } from "ui";
import { GlowingEffect } from "comp/aceternity";
import { CardIcon } from ".";
import { useGroupPermissions } from "hooks";
import React from "react";

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

  // Se houver subLink ativo, utiliza o ícone dele; senão, o ícone principal do card.
  const currentIcon = activeSubLink
    ? card.subLinks
        ?.find((sl) => sl.id === activeSubLink)
        ?.icon?.toLowerCase?.() || card.icon?.toLowerCase?.()
    : card.icon?.toLowerCase?.();

  // Filtra os subLinks conforme as permissões.
  const visibleSubLinks = card.subLinks?.filter((subLink) => {
    if (isAdmin) return true;
    if (!subLink.requiresGroup || subLink.requiresGroup.length === 0)
      return true;
    return hasAnyGroup(subLink.requiresGroup);
  });

  return (
    <div
      className="w-full 
                 max-w-[450px] sm:max-w-[450px] md:max-w-[600px] fhd:max-w-[900px] qhd:max-w-[800px] 
                 transition-all duration-300 cursor-pointer bg-background flex flex-col flex-1"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={handleCardClick}
    >
      <div className="relative flex flex-col flex-grow p-2 border rounded-md shadow-lg bg-card h-full">
        <GlowingEffect
          blur={0}
          borderWidth={2}
          spread={60}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
        />

        <div className="flex flex-col items-start justify-start gap-3 w-full relative h-full lg:min-h-[180px] fhd:min-h-[220px] qhd:min-h-[300px] overflow-hidden rounded-md border p-4 qhd:p-8 dark:shadow-[0px_0px_27px_0px_#2D2D2D] flex-1">
          <div className="flex items-center justify-between w-full">
            <div className="flex flex-col gap-1 items-start">
              {(() => {
                const activeIcon = activeSubLink
                  ? card.subLinks?.find((sl) => sl.id === activeSubLink)?.icon
                  : card.icon;

                return (
                  activeIcon && (
                    <div className="flex items-center justify-center text-primary aspect-square">
                      {React.createElement(activeIcon, {
                        className: "size-6 sm:size-8 text-primary",
                      })}
                    </div>
                  )
                );
              })()}
              <h3 className="font-medium text-base sm:text-lg lg:text-xl fhd:text-2xl qhd:text-3xl text-start">
                {card.title}
              </h3>
            </div>
            {card.external && (
              <ExternalLink className="ml-2 h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 fhd:h-4 fhd:w-4 qhd:h-5 qhd:w-5 text-muted-foreground" />
            )}
          </div>

          {hasSubLinks && visibleSubLinks && (
            <motion.div
              variants={linkVariants}
              initial="hidden"
              animate={isActive ? "visible" : "hidden"}
              transition={{ duration: 0.2 }}
              className="flex flex-wrap justify-center gap-1"
            >
              {visibleSubLinks.map((subLink) => (
                <Badge
                  key={subLink.id}
                  variant="secondary"
                  className="flex justify-end text-[0.65rem] sm:text-[0.65rem] lg:text-xs fhd:text-base qhd:text-2xl shadow hover:border-primary"
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

          <motion.div
            variants={descVariants}
            initial="hidden"
            animate={isActive ? "visible" : "hidden"}
            transition={{ duration: 0.2 }}
            className="mt-auto pt-2 sm:pt-2 md:pt-3"
          >
            <p className="text-[0.65rem] lg:text-sm fhd:text-base qhd:text-2enxl text-muted-foreground">
              {activeSubLink
                ? card.subLinks?.find((sl) => sl.id === activeSubLink)
                    ?.description
                : card.description}
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
