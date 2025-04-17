"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Separator,
} from "ui";
import { useBreadcrumbs } from "lib";
import React, { useState } from "react";
import {
  AnexosStored,
  HubDevelopmentSheet,
  Rateio,
} from "#/incluir/components/buttons";
import Link from "next/link";
import {
  ArrowLeft,
  FileCode2,
  GitFork,
  Paperclip,
  Pencil,
  Pickaxe,
  SlidersHorizontal,
} from "lucide-react";
import { SalvarButton } from "#/incluir/saving";

export const BreadcrumbDisplay = () => {
  const { breadcrumbs } = useBreadcrumbs();

  return (
    <Breadcrumb>
      <BreadcrumbList className="flex items-center gap-2 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {crumb.href ? (
                <BreadcrumbLink
                  href={crumb.href}
                  className="text-foreground hover:text-primary font-medium"
                >
                  {crumb.label}
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage className="text-primary text-sm font-medium">
                  {crumb.label}
                </BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && (
              <BreadcrumbSeparator className="text-foreground hover:text-primary font-medium" />
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export function renderTopButtons(pathname: string) {
  const [rateioOpen, setRateioOpen] = useState(false);
  const [hubOpen, setHubOpen] = useState(false);
  const [anexosOpen, setAnexosOpen] = useState(false);

  // Se estivermos em /xml ou /manual
  if (pathname.includes("/xml") || pathname.includes("/manual")) {
    return (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button size={"sm"} variant={"secondary"}>
              <SlidersHorizontal /> Outras Opções
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className={"flex flex-col gap-2"}>
            <DropdownMenuGroup className={"flex flex-col gap-2"}>
              <DropdownMenuItem
                className="hover:font-semibold group hover:border hover:shadow border-muted-foreground justify-between h-full flex"
                onSelect={() => setHubOpen(true)}
              >
                <Pickaxe className="w-5 h-5 group-hover:text-muted-foreground" />
                <span className={"group-hover:text-muted-foreground"}>
                  Progresso
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:font-semibold group hover:border hover:shadow border-muted-foreground justify-between h-full flex"
                onSelect={() => setRateioOpen(true)}
              >
                <GitFork className="w-5 h-5" />
                <span>Rateio</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className={
                  "hover:font-semibold group hover:border hover:shadow border-muted-foreground justify-between h-full flex"
                }
                onSelect={() => setAnexosOpen(true)}
              >
                <Paperclip className="group-hover:text-muted-foreground w-5 h-5" />
                <span className={"group-hover:text-muted-foreground"}>
                  Anexos
                </span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <Separator className={"w-full"} />
            <DropdownMenuGroup className={"flex flex-col gap-2"}>
              <Link href="/central/prenota">
                <DropdownMenuItem
                  className={
                    "hover:font-bold group hover:border hover:shadow border-red-500 justify-between h-full flex"
                  }
                >
                  <ArrowLeft className="w-5 h-5 group-hover:text-red-500" />
                  <span className={"group-hover:text-red-500"}>Voltar</span>
                </DropdownMenuItem>
              </Link>
              <SalvarButton
                onSaveSuccess={(rec) => console.log("Salvo com sucesso", rec)}
                onOpenAnexo={() => setAnexosOpen(true)}
                onOpenRateio={() => setRateioOpen(true)}
              />
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Rateio open={rateioOpen} onOpenChange={setRateioOpen} />
        <AnexosStored open={anexosOpen} onOpenChange={setAnexosOpen} />
        <HubDevelopmentSheet open={hubOpen} onOpenChange={setHubOpen} />
      </>
    );
  } else if (pathname === "/central/prenota") {
    // Se estivermos na raiz /prenota
    return (
      <div className="flex gap-2">
        <Link href="/central/prenota/xml">
          <Button size={"sm"} variant="secondary" className="flex gap-2">
            <FileCode2 className="w-5 h-5" />
            Inclusão via XML
          </Button>
        </Link>
        <Link href="/central/prenota/manual">
          <Button size={"sm"} variant="secondary" className="flex gap-2">
            <Pencil className="w-5 h-5" />
            Inclusão Manual
          </Button>
        </Link>
      </div>
    );
  }
  // Se não, não renderiza nada
  return null;
}
