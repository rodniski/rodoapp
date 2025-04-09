"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CarouselProps } from "../data";
import { DashboardCard } from ".";
import { Button } from "ui";

const DRAG_SENSITIVITY = 2; // Ajustado para melhor sensibilidade

export const Carousel = ({ cards, className, category }: CarouselProps) => {
    const [activeCardId, setActiveCardId] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeftRef = useRef(0);
    const velocity = useRef(0);
    const animationFrame = useRef<number | null>(null);

    // Verificação de scroll
    const checkScrollable = () => {
        if (!containerRef.current) return;
        setCanScrollLeft(containerRef.current.scrollLeft > 0);
        setCanScrollRight(
            containerRef.current.scrollLeft <
            containerRef.current.scrollWidth - containerRef.current.clientWidth - 1
        );
    };

    // Scroll suave
    const smoothScroll = (direction: "left" | "right") => {
        const scrollAmount = containerRef.current!.offsetWidth * 0.8;
        const targetScroll =
            direction === "left"
                ? containerRef.current!.scrollLeft - scrollAmount
                : containerRef.current!.scrollLeft + scrollAmount;

        const start = containerRef.current!.scrollLeft;
        const change = targetScroll - start;
        let startTime: number | null = null;

        const animateScroll = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / 300, 1); // 300ms duration

            containerRef.current!.scrollLeft = start + change * progress;

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            }
        };

        requestAnimationFrame(animateScroll);
    };

    // Efeito de inércia
    useEffect(() => {
        const handleInertia = () => {
            if (
                !containerRef.current ||
                Math.abs(velocity.current) < 0.1 ||
                isDragging.current
            ) {
                return;
            }

            containerRef.current.scrollLeft += velocity.current;
            velocity.current *= 0.95; // Fator de decaimento
            animationFrame.current = requestAnimationFrame(handleInertia);
        };

        if (!isDragging.current) {
            handleInertia();
        }

        return () => {
            if (animationFrame.current) {
                cancelAnimationFrame(animationFrame.current);
            }
        };
    }, []);

    // Handlers de mouse
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        isDragging.current = true;
        startX.current = e.pageX - containerRef.current.offsetLeft;
        scrollLeftRef.current = containerRef.current.scrollLeft;
        containerRef.current.style.cursor = "grabbing";
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging.current || !containerRef.current) return;
        e.preventDefault();

        const x = e.pageX - containerRef.current.offsetLeft;
        const walk = (x - startX.current) * DRAG_SENSITIVITY;
        const newScrollLeft = scrollLeftRef.current - walk;

        // Limitar os limites do scroll
        const maxScroll =
            containerRef.current.scrollWidth - containerRef.current.clientWidth;
        containerRef.current.scrollLeft = Math.max(
            0,
            Math.min(newScrollLeft, maxScroll)
        );

        velocity.current = walk * 0.1; // Atualizar velocidade para inércia
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        if (containerRef.current) {
            containerRef.current.style.cursor = "grab";
        }
    };

    // Handlers de touch
    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        isDragging.current = true;
        startX.current =
            e.touches[0].pageX - containerRef.current.offsetLeft;
        scrollLeftRef.current = containerRef.current.scrollLeft;
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!isDragging.current || !containerRef.current) return;

        const x = e.touches[0].pageX - containerRef.current.offsetLeft;
        const walk = (x - startX.current) * DRAG_SENSITIVITY;
        const newScrollLeft = scrollLeftRef.current - walk;

        // Limitar os limites do scroll
        const maxScroll =
            containerRef.current.scrollWidth - containerRef.current.clientWidth;
        containerRef.current.scrollLeft = Math.max(
            0,
            Math.min(newScrollLeft, maxScroll)
        );

        velocity.current = walk * 0.1;
    };

    // Efeito inicial
    useEffect(() => {
        checkScrollable();
        // Adicionar estilo para scrollbar
        const style = document.createElement("style");
        style.textContent = `
      .carousel-container::-webkit-scrollbar {
        display: none;
      }
      .carousel-container {
        -ms-overflow-style: none;
        scrollbar-width: none;
        scroll-behavior: smooth;
      }
    `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);

    return (
        <div className={cn("w-full pb-4 md:pb-0 overflow-visible relative", className)}>
            {(category || canScrollLeft || canScrollRight) && (
                <div className="mb-4 w-full px-4 flex items-center justify-between">
                    {category && (
                        <h3 className="text-lg sm:text-xl md:text-xl fhd:text-3xl font-semibold truncate mr-4">
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
                                <ChevronLeft size={18} className="group-hover:text-primary"/>
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
                                <ChevronRight size={18} className="group-hover:text-primary"/>
                            </Button>
                        </div>
                    )}
                </div>
            )}

            <div
                ref={containerRef}
                className={cn(
                    "carousel-container relative flex gap-3 sm:gap-4 md:gap-5 items-stretch overflow-x-auto",
                    "pb-8 px-4 w-full mx-auto",
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
                        className="snap-start flex items-stretch min-w-[250px] sm:min-w-[280px] md:min-w-[300px] flex-shrink-0 w-[calc(100%-2rem)] sm:w-[calc(50%-1.5rem)] md:w-[calc(33.333%-1.33rem)] lg:w-[calc(25%-1.25rem)]"
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