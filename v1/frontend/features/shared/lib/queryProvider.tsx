"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider as JotaiProvider } from "jotai";

export function QueryProvider({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <JotaiProvider>{children}</JotaiProvider>
        </QueryClientProvider>
    );
}
