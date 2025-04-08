"use client";

import { useTheme } from "next-themes";
import { Moon, Sun, Monitor } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "lib"; // Função utilitária de classes dinâmicas.
import { motion } from "framer-motion";

export function ThemeSwitcher() {
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

  return (
    <div
      className={cn(
        "relative flex items-center p-1 rounded-full border border-muted bg-background shadow-md w-[6.6rem] h-10"
      )}
    >
      {/* Indicador animado de fundo */}
      <motion.div
        className="absolute top-1 left-1 h-8 w-8 rounded-full bg-muted border border-foreground/10"
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
          "relative z-10 flex items-center justify-center w-8 h-8 rounded-full text-muted-foreground",
          theme === "light" && "text-accent-foreground"
        )}
        onClick={() => setTheme("light")}
        aria-label="Light Mode"
      >
        <Sun className="w-4 h-4" />
      </button>

      {/* Botão System */}
      <button
        className={cn(
          "relative z-10 flex items-center justify-center w-8 h-8 rounded-full text-muted-foreground",
          theme === "system" && "text-accent-foreground"
        )}
        onClick={() => setTheme("system")}
        aria-label="System Theme"
      >
        <Monitor className="w-4 h-4" />
      </button>

      {/* Botão Dark */}
      <button
        className={cn(
          "relative z-10 flex items-center justify-center w-8 h-8 rounded-full text-muted-foreground",
          theme === "dark" && "text-accent-foreground"
        )}
        onClick={() => setTheme("dark")}
        aria-label="Dark Mode"
      >
        <Moon className="w-4 h-4" />
      </button>
    </div>
  );
}
