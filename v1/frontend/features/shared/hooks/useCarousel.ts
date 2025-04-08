"use client";

import {useEffect, useRef, useState} from "react";

/**
 * useCarousel encapsula toda a lógica de rolagem horizontal,
 * permitindo habilitar/desabilitar botões conforme o conteúdo excede ou não o container.
 */
export function useCarousel() {
    const containerRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Verifica se é possível rolar para a esquerda/direita.
    function checkScrollable() {
        if (!containerRef.current) return;
        const {scrollLeft, scrollWidth, clientWidth} = containerRef.current;

        // Arredonda para o inteiro mais próximo
        const left = Math.round(scrollLeft);
        const maxScroll = Math.round(scrollWidth - clientWidth);

        // Ajusta se quiser uma “margem de erro” (threshold)
        const threshold = 2;

        setCanScrollLeft(left > threshold);
        setCanScrollRight(left < maxScroll - threshold);
    }


    // Chama checkScrollable no primeiro render e quando a janela é redimensionada.
    useEffect(() => {
        checkScrollable();
        window.addEventListener("resize", checkScrollable);
        return () => {
            window.removeEventListener("resize", checkScrollable);
        };
    }, []);

    // Função para rolar suavemente (pra frente ou pra trás).
    const scroll = (direction: "left" | "right") => {
        if (!containerRef.current) return;
        const {clientWidth} = containerRef.current;
        const scrollAmount = direction === "left" ? -clientWidth / 2 : clientWidth / 2;
        containerRef.current.scrollBy({left: scrollAmount, behavior: "smooth"});

        // Espera um pouco e verifica novamente se ainda é possível rolar.
        setTimeout(checkScrollable, 500);
    };

    return {
        containerRef,
        canScrollLeft,
        canScrollRight,
        scroll,
        checkScrollable,
    };
}
