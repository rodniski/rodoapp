"use client";

import { documentacaoData } from "./_lib/data/menu-items";
import { DocSidebar } from "./_lib/components/doc-sidebar";
import { SidebarProvider } from "@/_core/components";

export default function DocumentacaoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full h-[calc(100vh-50px)] flex overflow-hidden">
      <SidebarProvider defaultOpen>
        <DocSidebar items={documentacaoData} />
        <main className="p-3 bg-muted/30 h-calc(100vh-60px) w-full">
          {children}
        </main>
      </SidebarProvider>
    </div>
  );  
}
