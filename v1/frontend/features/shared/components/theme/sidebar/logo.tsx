"use client"

import * as React from "react"
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem} from "ui"
import Image from "next/image";
import Link from "next/link";

export function Logo({}) {
    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <Link href={"/central"}>
                    <SidebarMenuButton
                        size="lg"
                        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                        <div
                            className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                            <Image src={"/logo.svg"} alt={"Logo"} width={64} height={64}
                                   className={"w-6 h-6 invert aspect-square p-0"}/>
                        </div>


                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">RodoApp</span>
                        </div>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

