"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Half2Icon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { ThemeSwitcher } from "../ui/theme-toggle";
import { Popover, PopoverContent, PopoverTrigger, Button } from "ui";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import GlowingSVG from "@/public/logo/logo";
import {
  prenotaItems,
  controleItensItems,
  outrosItems,
  NavMenu,
  NavUser,
} from ".";

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const getThemeIcon = () => {
    if (!mounted) return <SunIcon className="size-5" />;

    switch (theme) {
      case "light":
        return <SunIcon className="size-5" />;
      case "dark":
        return <MoonIcon className="size-5" />;
      case "system":
        return <Half2Icon className="size-5" />;
      default:
        return <SunIcon className="size-5" />;
    }
  };

  // Não mostrar navbar nas páginas de login
  if (pathname === "/login" || pathname?.startsWith("/login/")) {
    return null;
  }

  const navItems = [prenotaItems, controleItensItems, outrosItems];

  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href={isAuthenticated ? "/dashboard" : "/"}
              className="mr-6 flex items-center space-x-2"
            >
              <GlowingSVG className="size-9" color="var(--primary)" />
              <span className="font-bold text-xl">RodoApp</span>
            </Link>
          </motion.div>

          {isAuthenticated && <NavMenu items={navItems} />}
        </div>

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="secondary"
                  size="icon"
                  className="border border-primary"
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={theme || "light"}
                      initial={{ rotate: -180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 180, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {getThemeIcon()}
                    </motion.div>
                  </AnimatePresence>
                </Button>
              </motion.div>
            </PopoverTrigger>
            <PopoverContent
              align="center"
              className="w-auto bg-transparent border-none shadow-none p-0"
            >
              <ThemeSwitcher />
            </PopoverContent>
          </Popover>

          {isAuthenticated ? (
            <NavUser />
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button asChild>
                <Link href="/login">Entrar</Link>
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
