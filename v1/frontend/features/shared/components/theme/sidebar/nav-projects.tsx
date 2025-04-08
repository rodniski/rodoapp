"use client"

import React from "react"
import { type LucideIcon } from "lucide-react"

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    useSidebar,
} from "ui"

export function NavProjects({
                                projects,
                            }: {
    projects: {
        name: string
        url: string
        icon: LucideIcon
    }[]
}) {
    const { state } = useSidebar()
    const isCollapsed = state === "collapsed"

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Links Rápidos</SidebarGroupLabel>
            <SidebarMenu>
                {projects.map((item) => (
                    <SidebarMenuItem key={item.name}>
                        {isCollapsed ? (
                            // Se estiver colapsada, envolver no Tooltip
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <SidebarMenuButton asChild>
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <item.icon />
                                        </a>
                                    </SidebarMenuButton>
                                </TooltipTrigger>
                                <TooltipContent side="right" align="center">
                                    {item.name}
                                </TooltipContent>
                            </Tooltip>
                        ) : (
                            // Se não estiver colapsada, mostra o item normal
                            <SidebarMenuButton asChild>
                                <a href={item.url} target="_blank" rel="noopener noreferrer">
                                    <item.icon />
                                    <span>{item.name}</span>
                                </a>
                            </SidebarMenuButton>
                        )}
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
