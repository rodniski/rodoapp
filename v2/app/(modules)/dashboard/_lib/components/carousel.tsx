// Carousel.tsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";
import type { CarouselProps } from "../data";
import { motion } from "motion/react";
import { useCarousel } from "../data";  // Importe o hook criado
import { DashboardCard } from ".";
import { Button } from "ui";
import { cn } from "utils";

export const Carousel = ({ cards, className, category }: CarouselProps) => {
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const {
    containerRef,
    canScrollLeft,
    canScrollRight,
    isDragging,
    smoothScroll,
    checkScrollable,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleTouchStart,
    handleTouchMove,
  } = useCarousel();

  return (
    <div className={cn("w-full overflow-visible relative", className)}>
      {(category || canScrollLeft || canScrollRight) && (
        <div className="w-full flex items-center justify-between pb-1 fhd:pb-5">
          {category && (
            <h3 className="text-lg sm:text-xl lg:text-base fhd:text-2xl qhd:text-4xl font-semibold truncate">
              {category}
            </h3>
          )}
          {(canScrollLeft || canScrollRight) && (
            <div className="flex items-center flex-shrink-0">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => smoothScroll("left")}
                className={cn(
                  "border border-primary rounded-none rounded-l group",
                  !canScrollLeft && "opacity-50 cursor-not-allowed"
                )}
                disabled={!canScrollLeft}
                aria-label="Scroll left"
              >
                <ChevronLeft size={18} className="group-hover:text-primary" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => smoothScroll("right")}
                className={cn(
                  "border border-primary rounded-none rounded-r group",
                  !canScrollRight && "opacity-50 cursor-not-allowed"
                )}
                disabled={!canScrollRight}
                aria-label="Scroll right"
              >
                <ChevronRight size={18} className="group-hover:text-primary" />
              </Button>
            </div>
          )}
        </div>
      )}

      <div
        ref={containerRef}
        className={cn(
            "carousel-container relative flex gap-3  md:gap-5 fhd:gap-7 qhd:gap-9 items-stretch overflow-x-auto",
            "w-full mx-auto",
            "snap-x snap-mandatory select-none cursor-grab",
            // Adicionando a máscara de esmaecimento com Tailwind
            "mask-image-linear mask-linear mask-from-transparent mask-via-black mask-to-transparent",
            "mask-size-[10%_100%,_80%_100%,_10%_100%] mask-position-[0_0,_10%_0,_90%_0]"
        )}
        onScroll={checkScrollable}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={() => (isDragging.current = false)}
        onTouchMove={handleTouchMove}
      >
        {cards.map((card, index) => (
          <motion.div
            key={card.id}
            className="snap-start flex items-stretch min-w-[250px] lg:min-w-[300px] fhd:min-w-[400px] flex-shrink-0 w-[calc(100%-2rem)] sm:w-[calc(50%-1.5rem)] md:w-[calc(33.333%-1.33rem)] lg:w-[calc(25%-1.25rem)]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <DashboardCard
              card={card}
              isActive={activeCardId === card.id}
              onMouseEnter={() => setActiveCardId(card.id)}
              onMouseLeave={() => setActiveCardId(null)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
