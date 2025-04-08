"use client"

import Link from "next/link";
import Image from "next/image";
import { Button, ThemeSwitcher } from "ui";
import { cn } from "utils";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

export function Navbar() {
  const [showThemeSwitcher, setShowThemeSwitcher] = useState(false);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evita renderizar no servidor
  useEffect(() => {
    setMounted(true);
  }, []);

  // Função para obter o ícone correto baseado no tema
  const getThemeIcon = () => {
    if (!mounted) return <Sun className="h-5 w-5" />;
    
    switch (theme) {
      case "light":
        return <Sun className="h-5 w-5" />;
      case "dark":
        return <Moon className="h-5 w-5" />;
      case "system":
        return <Monitor className="h-5 w-5" />;
      default:
        return <Sun className="h-5 w-5" />;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image
              src="/logo/logo.svg"
              alt="RodoApp Logo"
              width={28}
              height={28}
              className="dark:invert size-7"
            />
            <span className="font-bold">
              RodoApp
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/pre-notas"
              className={cn(
                "transition-colors hover:text-foreground/80",
                "text-foreground/60"
              )}
            >
              Pre Notas
            </Link>
            <Link
              href="/controle-de-saidas"
              className={cn(
                "transition-colors hover:text-foreground/80",
                "text-foreground/60"
              )}
            >
              Controle de Saídas
            </Link>
            <Link
              href="/documentacao"
              className={cn(
                "transition-colors hover:text-foreground/80",
                "text-foreground/60"
              )}
            >
              Documentação
            </Link>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative flex items-center">
            <Button 
              variant="outline"
              size="icon"
              onClick={() => setShowThemeSwitcher(!showThemeSwitcher)}
              className="relative z-10 overflow-hidden"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme || "light"}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {getThemeIcon()}
                </motion.div>
              </AnimatePresence>
            </Button>
            <AnimatePresence>
              {showThemeSwitcher && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-full mr-2"
                >
                  <ThemeSwitcher onThemeChange={() => setShowThemeSwitcher(false)} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <Button asChild>
            <Link href="/login">
              Entrar
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
