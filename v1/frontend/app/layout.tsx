"use client";

import React, {useEffect, useState} from "react";
import {Nunito_Sans} from "next/font/google";
import {QueryProvider} from "lib";
import {ThemeProvider} from "components/theme/theme-provider";
import "./globals.css";
import {Toaster} from "sonner";
import {useAtom} from "jotai";
import {tokenAtom} from "%/atoms";

const nunitoSans = Nunito_Sans({
    subsets: ["latin"],
    weight: ["400", "700"],
});

export function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    const [token] = useAtom(tokenAtom);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient) {
            try {
                const path = window.location.pathname;

                if (!token && path !== '/') {
                    window.location.href = '/';
                } else if (token && path === '/') {
                    window.location.href = '/central';
                }
            } catch (error) {
                console.error('Erro ao verificar autenticação:', error);
            }
        }
    }, [isClient, token]);

    return (
        <html lang="en">
        <body
            className={`antialiased max-w-screen lg:max-h-screen lg:overflow-hidden  ${nunitoSans.className}`}
        >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <Toaster closeButton richColors position="top-center" expand={true}/>
            <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}