"use client";

import {
  NavMenu,
  NavUser,
  aplicacoesGroup,
  corporativoGroup,
  NavMobile,
} from ".";
import { Half2Icon, MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { motion, AnimatePresence } from "motion/react";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Logo from "@/public/logo/logo";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  Button,
  ThemeSwitcher,
} from "ui";

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
    if (!mounted) return <SunIcon className="size-4 fhd:size-6 qhd:size-7" />;

    switch (theme) {
      case "light":
        return <SunIcon className="size-4 fhd:size-6 qhd:size-7" />;
      case "dark":
        return <MoonIcon className="size-4 fhd:size-6 qhd:size-7" />;
      case "system":
        return <Half2Icon className="size-4 fhd:size-6 qhd:size-7" />;
      default:
        return <SunIcon className="size-4 fhd:size-6 qhd:size-7" />;
    }
  };

  if (pathname === "/login" || pathname?.startsWith("/login/")) {
    return null;
  }

  const navItems = [aplicacoesGroup, corporativoGroup];

  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex h-12 fhd:h-16 qhd:h-20 items-center justify-between lg:px-8 fhd:px-12 qhd:px-20">
        <div className="flex items-center justify-between w-full">
          {isAuthenticated && (
            <div className="lg:hidden block px-5">
              <NavMobile items={navItems} />
            </div>
          )}
          <div className="flex items-center w-full">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href={isAuthenticated ? "/dashboard" : "/"}
              className="mr-6 flex items-center space-x-2"
            >
              <Logo
                className="size-8 fhd:size-11 qhd:size-14"
                color="var(--primary)"
              />
              <span className="font-bold text-lg lg:text-base fhd:text-xl qhd:text-3xl">
                RodoApp
              </span>
            </Link>
          </motion.div>

          {isAuthenticated && (
            <div className="hidden lg:block">
              <NavMenu items={navItems} />
            </div>
          )}
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="secondary"
                  size="icon"
                  className="border border-primary hover:bg-primary hover:border-muted"
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
              <Button size="lg" asChild>
                <Link href="/login">Entrar</Link>
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
}
