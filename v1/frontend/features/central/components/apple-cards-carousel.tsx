"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "lib";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CarouselProps } from "&/lib";
import { DashboardCard } from "&/components";
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
        <div className={cn("w-full pb-4 overflow-visible", className)}>
            {(category || canScrollLeft || canScrollRight) && (
                <div className="mb-2 max-w-[90vw] sm:max-w-[80vw] md:max-w-[75vw] flex items-center">
                    <div className="flex items-center gap-5">
                        {category && (
                            <h3 className="text-lg fhd:text-3xl font-semibold">
                                {category}
                            </h3>
                        )}
                        <div className="flex">
                            {canScrollLeft && (
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => smoothScroll("left")}
                                    className="rounded-none rounded-l-md"
                                    aria-label="Scroll left"
                                >
                                    <ChevronLeft size={18} />
                                </Button>
                            )}
                            {canScrollRight && (
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => smoothScroll("right")}
                                    className="rounded-none rounded-r-md"
                                    aria-label="Scroll right"
                                >
                                    <ChevronRight size={18} />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div
                ref={containerRef}
                className={cn(
                    "carousel-container relative flex gap-5 items-stretch overflow-x-auto",
                    "pb-8 px-4 mx-auto max-w-[90vw] sm:max-w-[80vw]",
                    "snap-x snap-mandatory select-none cursor-grab"
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
                        className="snap-start flex items-stretch min-w-[280px] flex-shrink-0"
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