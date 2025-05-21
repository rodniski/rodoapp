"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ExternalLink } from "lucide-react";
import type { Card } from "../data";
import { Badge } from "ui";
import { GlowingEffect } from "ui";
import { hasAccessToGrupo } from "utils/finders"; // ← usa a função centralizada

interface DashboardCardProps {
  card: Card;
  isActive: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const descContentVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const transitionConfig = { duration: 0.2 };

export function DashboardCard({
  card,
  isActive,
  onMouseEnter,
  onMouseLeave,
}: DashboardCardProps) {
  const [activeSubLink, setActiveSubLink] = useState<string | null>(null);

  const hasSubLinks = !!card.subLinks?.length;

  const visibleSubLinks = card.subLinks?.filter((sub) => {
    if (!sub.requiresGroup?.length) return true;
    return sub.requiresGroup.some((grupo) => hasAccessToGrupo(grupo));
  });

  const handleCardClick = () => {
    if ((!visibleSubLinks || visibleSubLinks.length === 0) && card.url) {
      window.open(card.url, card.external ? "_blank" : "_self");
    }
  };

  const currentDescription = activeSubLink
    ? card.subLinks?.find((sl) => sl.id === activeSubLink)?.description ??
      card.description
    : card.description;

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
              {(() => {
                const IconComponent =
                  card.subLinks?.find((s) => s.id === activeSubLink)?.icon ||
                  card.icon;

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
            {card.external && !hasSubLinks && (
              <ExternalLink className="size-4 text-muted-foreground" />
            )}
          </div>

          {hasSubLinks && visibleSubLinks && visibleSubLinks.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {visibleSubLinks.map((sub) => (
                <Badge
                  key={sub.id}
                  variant="secondary"
                  className="text-xs hover:border-primary cursor-pointer"
                  onMouseEnter={() => setActiveSubLink(sub.id)}
                  onMouseLeave={() => setActiveSubLink(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(sub.url, "_blank");
                  }}
                >
                  {sub.title}
                </Badge>
              ))}
            </div>
          )}

          <div className="mt-auto pt-2 min-h-14 overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.p
                key={activeSubLink || "main_description"}
                variants={descContentVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={transitionConfig}
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
