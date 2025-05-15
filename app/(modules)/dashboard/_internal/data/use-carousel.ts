// useCarousel.ts
import { useEffect, useRef, useState } from "react";

const DRAG_SENSITIVITY = 2;

export function useCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftRef = useRef(0);
  const velocity = useRef(0);
  const animationFrame = useRef<number | null>(null);

  const checkScrollable = () => {
    if (!containerRef.current) return;
    setCanScrollLeft(containerRef.current.scrollLeft > 0);
    setCanScrollRight(
      containerRef.current.scrollLeft <
        containerRef.current.scrollWidth - containerRef.current.clientWidth - 1
    );
  };

  const smoothScroll = (direction: "left" | "right") => {
    if (!containerRef.current) return;
    const scrollAmount = containerRef.current.offsetWidth * 0.8;
    const targetScroll =
      direction === "left"
        ? containerRef.current.scrollLeft - scrollAmount
        : containerRef.current.scrollLeft + scrollAmount;

    const start = containerRef.current.scrollLeft;
    const change = targetScroll - start;
    let startTime: number | null = null;

    const animateScroll = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / 300, 1);
      containerRef.current!.scrollLeft = start + change * progress;
      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

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
      velocity.current *= 0.95;
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
    const maxScroll =
      containerRef.current.scrollWidth - containerRef.current.clientWidth;
    containerRef.current.scrollLeft = Math.max(0, Math.min(newScrollLeft, maxScroll));
    velocity.current = walk * 0.1;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    if (containerRef.current) {
      containerRef.current.style.cursor = "grab";
    }
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    isDragging.current = true;
    startX.current = e.touches[0].pageX - containerRef.current.offsetLeft;
    scrollLeftRef.current = containerRef.current.scrollLeft;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging.current || !containerRef.current) return;
    const x = e.touches[0].pageX - containerRef.current.offsetLeft;
    const walk = (x - startX.current) * DRAG_SENSITIVITY;
    const newScrollLeft = scrollLeftRef.current - walk;
    const maxScroll =
      containerRef.current.scrollWidth - containerRef.current.clientWidth;
    containerRef.current.scrollLeft = Math.max(0, Math.min(newScrollLeft, maxScroll));
    velocity.current = walk * 0.1;
  };

  useEffect(() => {
    checkScrollable();
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

  return {
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
  };
}
