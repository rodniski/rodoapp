"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation"; // Detectar mudanças no caminho
import { cn } from "lib";
import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "ui";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useThrottle } from "doc/hooks/use-throttle";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function PageTOC() {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname(); // Hook do Next.js para capturar o caminho atual

  // Atualiza os tópicos quando o pathname muda
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll("h2")).map(
      (element) => ({
        id: element.id,
        text: element.textContent ?? "",
        level: parseInt(element.tagName[1]),
      })
    );
    setHeadings(elements);
    setActiveId(""); // Resetar o tópico ativo
  }, [pathname]); // Reexecuta quando o caminho muda

  const throttledScroll = useThrottle(() => {
    const scrollContainer = document.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLElement;

    if (scrollContainer) {
      const headingElements = Array.from(
        scrollContainer.querySelectorAll("h2")
      );
      const visibleHeadings = headingElements.filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top >= 0 && rect.top <= window.innerHeight / 2;
      });
      if (visibleHeadings.length > 0) {
        setActiveId(visibleHeadings[0].id);
      }
    }
  }, 200);

  useEffect(() => {
    const scrollContainer = document.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLElement;

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", throttledScroll);
      return () =>
        scrollContainer.removeEventListener("scroll", throttledScroll);
    }
  }, [throttledScroll]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    const scrollContainer = document.querySelector(
      "[data-radix-scroll-area-viewport]"
    ) as HTMLElement;

    if (element && scrollContainer) {
      const yOffset = -120;
      const y =
        element.getBoundingClientRect().top +
        scrollContainer.scrollTop -
        scrollContainer.getBoundingClientRect().top +
        yOffset;

      scrollContainer.scrollTo({ top: y, behavior: "smooth" });
      setActiveId(id);
    }
  };

  if (headings.length === 0) {
    return null;
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-2"
    >
      <div className="flex items-center justify-between px-4">
        <h1 className="text-lg font-semibold">Conteúdo da Página</h1>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="w-9 p-0">
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <span className="sr-only">Abrir Conteudo</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent className="space-y-2">
        {headings.map((heading) => (
          <Button
            key={heading.id}
            variant="ghost"
            className={cn(
              "block w-full text-left truncate", // Adicione truncate aqui
              activeId === heading.id && "font-medium text-primary"
            )}
            onClick={() => handleClick(heading.id)}
          >
            {heading.text}
          </Button>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
