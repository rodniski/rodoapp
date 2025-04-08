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
    Separator
} from 'ui';
import {useBreadcrumbs} from 'lib'
import React from 'react';
import {AnexosStored, HubDevelopmentSheet, Rateio} from "#/incluir/components/buttons";
import Link from "next/link";
import {ArrowLeft, FileCode2, Pencil, SlidersHorizontal} from "lucide-react";
import SalvarButton from "#/incluir/SalvarButton";

export const BreadcrumbDisplay = () => {
    const {breadcrumbs} = useBreadcrumbs();

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
                            <BreadcrumbSeparator className="text-foreground hover:text-primary font-medium"/>
                        )}
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export function renderTopButtons(pathname: string) {
    // Se estivermos em /xml ou /manual
    if (pathname.includes("/xml") || pathname.includes("/manual")) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button size={"sm"} variant={"secondary"}><SlidersHorizontal/> Outras Opções</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={"flex flex-col gap-2"}>
                    <DropdownMenuGroup className={"flex flex-col gap-2"}>
                        <HubDevelopmentSheet/>
                        <Rateio/>
                        <AnexosStored/>
                    </DropdownMenuGroup>
                    <Separator className={"w-full"}/>
                    <DropdownMenuGroup className={"flex flex-col gap-2"}>
                        <Link href="/central/prenota">
                            <DropdownMenuItem
                                className={"hover:font-bold group hover:border hover:shadow border-red-500 justify-between h-full flex"}>
                                <ArrowLeft className="w-5 h-5 group-hover:text-red-500"/>
                                <span className={"group-hover:text-red-500"}>
                                    Voltar
                                </span>
                            </DropdownMenuItem>
                        </Link>
                        <SalvarButton/>
                    </DropdownMenuGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        )
            ;
    } else if (pathname === "/central/prenota") {
        // Se estivermos na raiz /prenota
        return (
            <div className="flex gap-2">
                <Link href="/central/prenota/xml">
                    <Button size={"sm"} variant="secondary" className="flex gap-2">
                        <FileCode2 className="w-5 h-5"/>
                        Inclusão via XML
                    </Button>
                </Link>
                <Link href="/central/prenota/manual">
                    <Button size={"sm"} variant="secondary" className="flex gap-2">
                        <Pencil className="w-5 h-5"/>
                        Inclusão Manual
                    </Button>
                </Link>
            </div>
        );
    }
    // Se não, não renderiza nada
    return null;
}