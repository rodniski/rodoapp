"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "ui";

const docStructure = [
  {
    title: "TI",
    items: [
      { title: "Agendamento de Reunião", href: "#" },
      { title: "Assinatura de E-mail", href: "/central/documentacao/ti/assinaturaemail" },
      { title: "Central anti-ameaças", href: "#" },
      { title: "E-mail automático (aviso de férias)", href: "#" },
      { title: "E-mails limitados", href: "#" },
      { title: "Gmail Dicas", href: "/central/documentacao/ti/gmaildicas" },
      { title: "Gmail no Celular", href: "/central/documentacao/ti/gmailcelular" },
      { title: "Google Meet - Videoconferências", href: "/central/documentacao/ti/videoconferencias" },
      { title: "Power BI", href: "#" },
      { title: "Proxy", href: "#" },
    ],
  },
  {
    title: "Core Concepts",
    items: [
      { title: "Routing", href: "/docs/routing" },
      { title: "Data Fetching", href: "/docs/data-fetching" },
      { title: "Rendering", href: "/docs/rendering" },
    ],
  },
];

export function DocumentationSidebar() {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar className="w-64 border-r h-[calc(100vh-60px)]" >
        <SidebarHeader>
          <h2 className="px-4 text-lg font-semibold">Documentation</h2>
        </SidebarHeader>
        <SidebarContent>
          {docStructure.map((section, index) => (
            <SidebarGroup key={index}>
              <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map((item, itemIndex) => (
                    <SidebarMenuItem key={itemIndex}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                      >
                        <Link href={item.href}>{item.title}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
