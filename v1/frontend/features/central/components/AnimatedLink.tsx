"use client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React from "react";

interface AnimatedLinkProps {
    href: string; // URL de destino
    children: React.ReactNode; // Conteúdo do link (texto, ícone, etc.)
    external?: boolean; // Se for um link externo
    className?: string; // Classes CSS adicionais
}

export function AnimatedLink({
                                         href,
                                         children,
                                         external = false,
                                         className,
                                     }: AnimatedLinkProps) {
    const router = useRouter();
    const [isAnimating, setIsAnimating] = React.useState(false);

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Impede o comportamento padrão do link
        setIsAnimating(true); // Inicia a animação

        // Após a animação terminar (0.3s), redireciona
        setTimeout(() => {
            if (external) {
                window.open(href, "_blank"); // Abre em nova aba para links externos
            } else {
                router.push(href); // Redireciona internamente com Next.js
            }
        }, 300); // Duração da animação em milissegundos
    };

    return (
        <motion.a
            href={href}
            onClick={handleClick}
            className={className}
            initial={{ scale: 1 }}
            animate={isAnimating ? { scale: 1.1 } : { scale: 1 }} // Expansão ao clicar
            transition={{ duration: 0.3 }} // Duração da animação
            style={{ display: "inline-block" }} // Garante que a animação funcione corretamente
        >
            {children}
        </motion.a>
    );
}