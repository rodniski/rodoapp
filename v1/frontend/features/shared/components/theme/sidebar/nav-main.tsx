"use client"

import React from "react";
import { ChevronRight, LucideIcon } from "lucide-react";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from "ui";

export function NavMain({
                            items,
                        }: {
    items: {
        title: string;
        url: string;
        icon?: LucideIcon;
        isActive?: boolean;
        items?: {
            title: string;
            url: string;
        }[];
    }[];
}) {
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Sistema</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <Collapsible key={item.title} asChild defaultOpen={true} className="group/collapsible">
                        <SidebarMenuItem>
                            {isCollapsed ? (
                                // -----------------------------
                                // Exemplo com Hover no Dropdown
                                // -----------------------------
                                <HoverableDropdown item={item} />
                            ) : (
                                <>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                            <ChevronRight
                                                className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                                            />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {item.items?.map((subItem) => (
                                                <SidebarMenuSubItem key={subItem.title}>
                                                    <SidebarMenuSubButton asChild>
                                                        <a href={subItem.url}>
                                                            <span>{subItem.title}</span>
                                                        </a>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </>
                            )}
                        </SidebarMenuItem>
                    </Collapsible>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}

// Extraímos a lógica de hover em um componente para ficar mais organizado:
function HoverableDropdown({
                               item,
                           }: {
    item: {
        title: string;
        url: string;
        icon?: LucideIcon;
        items?: {
            title: string;
            url: string;
        }[];
    };
}) {
    const [open, setOpen] = React.useState(false);

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            {/*
        Envolvemos o Trigger e o Content em uma div,
        para que onMouseEnter / onMouseLeave funcione em todo o container.
      */}
            <div
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
            >
                <DropdownMenuTrigger asChild>
                    <SidebarMenuButton>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                    </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" align="start" className="w-56">
                    <DropdownMenuLabel>{item.title}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {item.items?.map((subItem) => (
                        <DropdownMenuItem key={subItem.title} asChild>
                            <a href={subItem.url} className="flex w-full cursor-pointer">
                                {subItem.title}
                            </a>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </div>
        </DropdownMenu>
    );
}
