"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "ui"
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { prenotaItems, controleSaidaItems, outrosItems, NavMenu } from ".";
import { ThemeSwitcher } from "../ui/theme-toggle";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const navItems = [prenotaItems, controleSaidaItems, outrosItems];

  return (
    <motion.header 
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Image
                src="/logo/logo.svg"
                alt="RodoApp Logo"
                width={28}
                height={28}
                className="dark:invert size-7"
              />
              <span className="font-bold">RodoApp</span>
            </Link>
          </motion.div>

          <NavMenu items={navItems} />
        </div>

        <div className="flex items-center space-x-4">
          <Popover>
            <PopoverTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline" size="icon">
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
            <PopoverContent align="center" className="w-auto bg-transparent border-none shadow-none p-0">
              <ThemeSwitcher />
            </PopoverContent>
          </Popover>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button asChild>
              <Link href="/login">Entrar</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
