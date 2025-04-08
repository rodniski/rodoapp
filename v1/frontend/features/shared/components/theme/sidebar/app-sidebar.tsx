"use client"

import type * as React from "react"
import {Separator, Sidebar, SidebarContent, SidebarHeader, SidebarRail} from "ui"
import {GraduationCap, LifeBuoy, MailCheck, Receipt, RefreshCcwDot, TreePine, Truck, Usb,} from "lucide-react"
import {Logo, NavMain, NavProjects} from ".";

// Dados de navegação atualizados
const data = {
    navMain: [
        {
            title: "Lançamento de Notas",
            url: "#",
            icon: Receipt,
            items: [
                {
                    title: "Lista de Pre Notas",
                    url: "/central/prenota",
                },
                {
                    title: "Incluir Manualmente",
                    url: "/central/prenota/manual",
                },
                {
                    title: "Incluir XML",
                    url: "/central/prenota/xml",
                },
            ],
        },
        {
            title: "Controle de Itens",
            url: "#",
            icon: RefreshCcwDot,
            items: [
                {
                    title: "Borracharia",
                    url: "/central/portaria/lancamento",
                },
                {
                    title: "Conferência",
                    url: "/central/portaria/conferencia",
                },
                {
                    title: "Histórico de Conferência",
                    url: "/central/portaria/historico",
                },
            ],
        },
    ],
    projects: [
        {
            name: "Documentação",
            url: "/central/documentacao",
            icon: GraduationCap,
        },
        {
            name: "Assinatura de Email",
            url: "http://hesk.rodoparana.com.br/signaturegen",
            icon: MailCheck,
        },
        {
            name: "Suporte",
            url: "http://hesk.rodoparana.com.br",
            icon: LifeBuoy,
        },
        {
            name: "Intranet",
            url: "https://intranet.rodoparana.com.br/",
            icon: Usb,
        },
        {
            name: "Rodoparaná",
            url: "https://rodoparana.com.br",
            icon: Truck,
        },
        {
            name: "Timber",
            url: "https://grupotimber.com.br",
            icon: TreePine,
        },
    ],
}

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props} className={"bg-background"}>
            <SidebarHeader>
                <Logo/>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain}/>
                <Separator className="my-2"/>
                <NavProjects projects={data.projects}/>
            </SidebarContent>
            <SidebarRail/>
        </Sidebar>
    )
}