// app/documentacao/_internal/components/doc-sidebar.tsx (ou caminho similar)
"use client"; // Necessário por causa do React.useState
import type { DocumentationCategoryConfig } from "@/app/documentacao/_internal/logic";
import { getCategorySlug } from "@/app/documentacao/_internal/logic";
import { ChevronDown } from "lucide-react";
import * as React from "react";
import Link from "next/link";
import {
  ScrollArea,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "ui";

/**
 * @interface DocSidebarProps
 * @description Propriedades para o componente DocSidebar.
 */
interface DocSidebarProps {
  /**
   * @property {DocumentationCategoryConfig[]} items - Array de categorias e seus subitens para exibir na sidebar.
   */
  items: DocumentationCategoryConfig[];
  //? Considere adicionar 'currentPathname?: string;' para destacar o link ativo.
}

/**
 * @component DocSidebar
 * @description Renderiza a barra lateral de navegação para a seção de documentação.
 * Gera URLs dinamicamente com base nos IDs das categorias e artigos.
 *
 * @param {DocSidebarProps} props - As propriedades do componente.
 */
export function DocSidebar({ items }: DocSidebarProps) {
  //* Estado para controlar quais seções (categorias) estão expandidas.
  //  Usa o 'title' da categoria como identificador para o estado de expansão.
  const [expandedSections, setExpandedSections] = React.useState<string[]>(
    () => {
      // Por padrão, expande todas as categorias ao iniciar.
      return items.map((item) => item.title);
    }
  );

  /**
   * @function toggleSection
   * @description Alterna o estado de expansão de uma seção da sidebar.
   * @param {string} title - O título da categoria a ser expandida/recolhida.
   */
  const toggleSection = (title: string) => {
    setExpandedSections((prevExpanded) =>
      prevExpanded.includes(title)
        ? prevExpanded.filter((t) => t !== title)
        : [...prevExpanded, title]
    );
  };

  return (
    <Sidebar className="absolute h-[calc(100vh-50px)] top-12 transition-all duration-300">
      <SidebarContent>
        <ScrollArea className="h-full bg-background/95 backdrop-blur">
          {" "}
          {/* Garante scroll para conteúdo longo */}
          <SidebarGroup>
            {items.map((category) => {
              const categorySlug = getCategorySlug(category.id); // Gera o slug da categoria (ex: "ti")
              const isExpanded = expandedSections.includes(category.title);

              return (
                <Collapsible
                  key={category.id}
                  className="mt-4" // Espaçamento entre categorias
                  open={isExpanded}
                  onOpenChange={() => toggleSection(category.title)}
                >
                  <CollapsibleTrigger className="w-full text-left text-muted-foreground flex items-center justify-between gap-2 text-sm py-1 mb-3 border-b cursor-pointer hover:text-foreground">
                    <div className="flex gap-2 items-center">
                      {category.icon && (
                        <category.icon className="size-5 flex-shrink-0" />
                      )}
                      <span className="font-medium">{category.title}</span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {category.subItems.map((subItem) => {
                          const articleUrl = `/documentacao/${categorySlug}/${subItem.id}`;

                          return (
                            <SidebarMenuItem key={subItem.id}>
                              <SidebarMenuButton asChild className="h-10">
                                <Link
                                  href={articleUrl}
                                  className="text-foreground cursor-pointer text-sm pl-7"
                                >
                                  {subItem.title}
                                </Link>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          );
                        })}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </Collapsible>
              );
            })}
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
}
