"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { cn } from "utils"; // Função utilitária de classes dinâmicas.
import { motion } from "motion/react";
import { Half2Icon, MoonIcon, SunIcon } from "@radix-ui/react-icons"
interface ThemeSwitcherProps {
  onThemeChange?: () => void;
}

export function ThemeSwitcher({ onThemeChange }: ThemeSwitcherProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evita renderizar no servidor
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Define as posições do indicador para cada tema
  const getPosition = () => {
    switch (theme) {
      case "light":
        return "0rem"; // Primeira posição
      case "system":
        return "2rem"; // Segunda posição
      case "dark":
        return "4rem"; // Terceira posição
      default:
        return "0rem";
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    if (onThemeChange) {
      onThemeChange();
    }
  };

  return (
    <div
      className={cn(
        "relative flex items-center p-1 rounded-full border border-primary bg-background shadow-md w-[6.6rem] h-10"
      )}
    >
      {/* Indicador animado de fundo */}
      <motion.div
        className="absolute top-[0.2rem] left-1 size-8 rounded-full bg-primary"
        animate={{
          x: getPosition(),
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
      />

      {/* Botão Light */}
      <button
        className={cn(
          "relative z-10 flex items-center justify-center size-8 rounded-full text-muted-foreground",
          theme === "light" && "text-foreground"
        )}
        onClick={() => handleThemeChange("light")}
        aria-label="Light Mode"
      >
        <SunIcon className="size-5"/>
      </button>

      {/* Botão System */}
      <button
        className={cn(
          "relative z-10 flex items-center justify-center size-8 rounded-full text-muted-foreground",
          theme === "system" && "text-foreground"
        )}
        onClick={() => handleThemeChange("system")}
        aria-label="System Theme"
      >
        <Half2Icon className="size-5"/>
      </button>

      {/* Botão Dark */}
      <button
        className={cn(
          "relative z-10 flex items-center justify-center size-8 rounded-full text-muted-foreground",
          theme === "dark" && "text-foreground"
        )}
        onClick={() => handleThemeChange("dark")}
        aria-label="Dark Mode"
      >
        <MoonIcon className="size-5"/>
      </button>
    </div>
  );
}