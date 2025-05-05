"use client";

import React from "react";
import { NavGroup } from "./navigation";
import {
  Button,
  Separator,
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "ui";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { motion } from "motion/react";
import { useAuth } from "@/app/login/_lib/hooks";
import { NavUser } from "./user";
import { useRouter } from "next/navigation";

interface NavMobileProps {
  items: NavGroup[];
}

export function NavMobile({ items }: NavMobileProps) {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  // Variantes para animação dos títulos (h4)
  const titleVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.5 + i * 0.05, // Atraso base de 0.5s + atraso progressivo menor
        duration: 0.3,
        ease: "easeOut",
      },
    }),
  };

  // Variantes para animação dos links
  const linkVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.5 + i * 0.1, // Atraso base de 0.5s + atraso progressivo
        duration: 0.3,
        ease: "easeOut",
      },
    }),
    hover: { x: 5, transition: { duration: 0.2 } }, // Efeito de hover
  };

  return (
    <Sheet>
      {/* Botão do menu hambúrguer */}
      <SheetTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="border border-primary"
        >
          <HamburgerMenuIcon className="size-5" />
        </Button>
      </SheetTrigger>

      {/* Conteúdo do drawer */}
      <SheetContent side="left" className="w-full h-screen p-4">
        <SheetTitle>Menu</SheetTitle>
        <div className="flex flex-col h-full justify-between">
          {/* Navegação */}
          <nav className="flex flex-col gap-4">
            {items.map((group, groupIndex) => (
              <div key={group.label} className="flex flex-col gap-8">
                {group.subGroups.map((subGroup, subGroupIndex) => (
                  <div key={subGroup.title} className="mt-2">
                    <motion.h4
                      custom={groupIndex + subGroupIndex} // Combina índices para atraso único
                      initial="hidden"
                      animate="visible"
                      variants={titleVariants}
                      className="text-lg font-medium text-muted-foreground"
                    >
                      {subGroup.title}
                    </motion.h4>
                    <ul className="mt-1 flex flex-col gap-3">
                      {subGroup.items.map((subItem, itemIndex) => (
                        <motion.li
                          key={subItem.href}
                          custom={itemIndex} // Índice apenas dos itens da lista
                          initial="hidden"
                          animate="visible"
                          variants={linkVariants}
                          whileHover="hover"
                        >
                          <Link
                            href={subItem.href}
                            className="text-base hover:text-primary block"
                          >
                            {subItem.label}
                          </Link>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ))}
          </nav>

          {/* Rodapé com ThemeSwitcher e UserMenuContent */}
          <div className="flex flex-col gap-4">
            <Separator className="w-full" />

            {isLoading ? (
              <span>Carregando...</span>
            ) : isAuthenticated ? (
              <NavUser />
            ) : (
              <Button size="lg" onClick={() => router.push("/login")}>
                Entrar
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
