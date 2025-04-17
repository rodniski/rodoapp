"use client";

import React, {useEffect} from "react";
import {AppSidebar, BreadcrumbDisplay, NavUser, renderTopButtons} from "components/theme";
import {Separator, SidebarInset, SidebarProvider, SidebarTrigger,} from "ui";
import {BreadcrumbProvider} from "lib";
import {CargaInicioProvider, useCargaInicio} from "hooks";
import {toast} from "sonner";
import {useAtomValue} from "jotai/index";
import {usernameAtom} from "%/atoms";
import {usePathname} from "next/navigation";

/**
 * @function RootLayout
 * @description Layout principal da página "Central", incluindo barra lateral, breadcrumbs e área principal de conteúdo.
 */
export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    const username = useAtomValue(usernameAtom) || "";
    const {error} = useCargaInicio(username);
    const pathname = usePathname()
    useEffect(() => {
        if (error) {
            toast.error("Erro ao carregar os dados iniciais.");
        }
    }, [error]);

    return (
        <BreadcrumbProvider>
            <CargaInicioProvider>
                <SidebarProvider defaultOpen={false}>
                    <div className={"max-w-screen max-h-screen w-full h-screen flex"}>
                        <AppSidebar/>
                        <SidebarInset>
                            <header
                                className="flex h-16 shrink-0 items-center justify-between transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 px-4 border-b border-muted/40 shadow">
                                <div className="flex items-center gap-2 w-full">
                                    <SidebarTrigger className="-ml-1"/>
                                    <Separator orientation="vertical" className="mr-2 h-4"/>
                                    <BreadcrumbDisplay/>
                                </div>
                                <div className={"flex gap-2 items-center justify-end w-full"}>
                                    {renderTopButtons(pathname)}
                                    <Separator orientation="vertical" className="mr-2 h-4"/>
                                    <NavUser/>
                                </div>
                            </header>
                            {/* Área Principal */}
                            <main className="w-full h-full bg-muted/30">
                                {children}
                            </main>
                        </SidebarInset>
                    </div>
                </SidebarProvider>
            </CargaInicioProvider>
        </BreadcrumbProvider>
    )
        ;
}


