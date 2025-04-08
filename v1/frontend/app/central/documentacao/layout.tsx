"use client";

import { PageTOC } from "doc/components/page-toc";
import { DocSidebar } from "./components/doc-sidebar";
import { ScrollArea, SidebarProvider } from "ui";
import { usePathname } from "next/navigation";

export function DocumentacaoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideToc = pathname === "/central/documentacao";

  return (
    <SidebarProvider>
      <div className="flex justify-between w-full h-full max-h-[calc(100vh-60px)]">
        <DocSidebar />
        <div className="flex-grow">
          <ScrollArea className="w-full h-full overflow-y-auto">
            <main
              className={`flex-grow flex ${
                hideToc ? "justify-center" : "justify-between"
              }`}
            >
              <div className={`${!hideToc ? "pr-80" : ""} w-full`}>
                {children}
              </div>

              {!hideToc && (
                <aside className="w-fit fixed right-10 lg:w-64 shrink-0 mt-8">
                  <PageTOC />
                </aside>
              )}
            </main>
          </ScrollArea>
        </div>
      </div>
    </SidebarProvider>
  );
}
