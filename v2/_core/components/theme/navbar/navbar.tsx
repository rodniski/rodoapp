// app/(modules)/_lib/components/Navbar.tsx
"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import Logo from "@/public/logo/logo";
import { NavMenu, aplicacoesGroup, corporativoGroup, NavMobile, NavUser } from ".";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  ThemeSwitcher,
} from "ui";
import { SunIcon, MoonIcon, Half2Icon } from "@radix-ui/react-icons";

import { useAuth } from "@login/hooks";

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  // usa nosso hook, não useSession()
  const { isLoading, isAuthenticated } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Não renderiza na tela de login
  if (pathname === "/login" || pathname.startsWith("/login/")) {
    return null;
  }

  const navItems = [aplicacoesGroup, corporativoGroup];
  const themeIcon = !mounted ? (
    <SunIcon className="size-4" />
  ) : theme === "light" ? (
    <SunIcon className="size-4" />
  ) : theme === "dark" ? (
    <MoonIcon className="size-4" />
  ) : (
    <Half2Icon className="size-4" />
  );

  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex h-12 items-center justify-between px-8">
        {/* Logo e navegação */}
        <div className="flex items-center space-x-6 w-full">
          {isAuthenticated && (
            <div className="lg:hidden">
              <NavMobile items={navItems} />
            </div>
          )}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href={isAuthenticated ? "/dashboard" : "/"}
              className="flex items-center space-x-2"
            >
              <Logo className="size-8" color="var(--primary)" />
              <span className="font-bold text-xl">RodoApp</span>
            </Link>
          </motion.div>
          {isAuthenticated && (
            <div className="hidden lg:block">
              <NavMenu items={navItems} />
            </div>
          )}
        </div>

        {/* Ações à direita: tema + usuário */}
        <div className="hidden lg:flex items-center space-x-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button size="icon" variant="secondary">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={theme || "light"}
                    initial={{ rotate: -180, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 180, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {themeIcon}
                  </motion.div>
                </AnimatePresence>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="center"
              className="p-0 bg-transparent border-none shadow-none"
            >
              <ThemeSwitcher />
            </PopoverContent>
          </Popover>

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
    </motion.header>
  );
}
