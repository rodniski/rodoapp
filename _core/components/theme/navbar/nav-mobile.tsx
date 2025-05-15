/* ───────────────────────────  NavMobile.tsx  ───────────────────────────
 * Drawer de navegação mobile – foco em layout e ergonomia.
 *  • Sheet ocupa máx 20 rem (≈ 320 px) – não cobre toda a tela.
 *  • Cabeçalho fixo + área com scroll independente.
 *  • Agrupamento em Accordion (Radix) para colapsar seções.
 *  • Itens têm ícone, label e highlight da rota ativa.
 *  • Touch‑target 48 × 48 px (p‑3) e background acessível.
 *  --------------------------------------------------------------------*/

"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { m } from "motion/react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  Button,
  Separator,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Input,
} from "ui";
import { HamburgerMenuIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { aplicacoesGroup, corporativoGroup, NavGroup } from "./navigation";
import { useAuth } from "@login/hooks";
import { cn } from "utils";
import { UserMenuContent } from "./user-content";

/* ── helpers ───────────────────────────────────────────────────────── */
const GROUPS: NavGroup[] = [aplicacoesGroup, corporativoGroup];

function flatten(groups: NavGroup[]) {
  return groups.flatMap((g) => g.subGroups.flatMap((sg) => sg.items));
}

/* ── component ─────────────────────────────────────────────────────── */
export function NavMobile() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoading, isAuthenticated } = useAuth();

  /* pesquisa local */
  const [query, setQuery] = useState("");
  const listedGroups = useMemo(() => {
    if (!query) return GROUPS;
    const q = query.toLowerCase();
    return GROUPS.map((g) => ({
      ...g,
      subGroups: g.subGroups
        .map((sg) => ({
          ...sg,
          items: sg.items.filter((i) => i.label.toLowerCase().includes(q)),
        }))
        .filter((sg) => sg.items.length),
    })).filter((g) => g.subGroups.length);
  }, [query]);

  /* animação para itens */
  const variants = {
    hidden: { opacity: 0, x: -15 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: 0.05 * i },
    }),
  } as const;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="secondary"
          className="border border-primary"
        >
          <HamburgerMenuIcon className="size-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[min(90vw,20rem)] p-0 flex flex-col"
      >
        {/* header sticky */}
        <div className="sticky top-0 z-10 flex items-center gap-2 border-b bg-background px-4 py-3">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <MagnifyingGlassIcon className="size-4 text-muted-foreground" />
          <Input
            placeholder="Buscar…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-8 bg-muted/40"
          />
        </div>

        {/* scrollable nav */}
        <div className="flex-1 overflow-y-auto px-2">
          <Accordion type="multiple" defaultValue={[listedGroups[0]?.id ?? ""]}>
            {listedGroups.map((group) => (
              <AccordionItem
                key={group.id}
                value={group.id}
                className="mb-2 border-none"
              >
                <AccordionTrigger className="px-4 py-3 mb-2 text-sm font-medium rounded border border-muted/foreground">
                  <span className="flex items-center gap-2">
                    {group.icon &&
                      React.createElement(group.icon, { className: "size-4" })}
                    {group.label}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-2">
                  {group.subGroups.map((sg) => (
                    <div key={sg.id} className="space-y-1">
                      <ul className="">
                        {sg.items.map((item) => (
                          <li key={item.id}>
                            <Link
                              href={item.href}
                              className={cn(
                                "flex items-center gap-2 rounded px-3 py-3 text-sm",
                                pathname === item.href
                                  ? "bg-primary/10 text-primary"
                                  : ""
                              )}
                              onClick={() => router.push(item.href)}
                            >
                              {item.icon &&
                                React.createElement(item.icon, {
                                  className: "size-4 shrink-0",
                                })}
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* footer */}
        <div className="border-t px-4 py-4 space-y-4">
          {isLoading ? (
            <span className="text-sm text-muted-foreground">Carregando…</span>
          ) : isAuthenticated ? (
            <UserMenuContent />
          ) : (
            <Button className="w-full" onClick={() => router.push("/login")}>
              Entrar
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
