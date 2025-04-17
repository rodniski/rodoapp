/**
 * @file LoginPage.js
 * @description Página inicial de login, estruturada com animação e estilização utilizando TailwindCSS.
 * @module LoginPage
 */

"use client";

/**
 * Importação de componentes e dependências.
 * - Vortex: Estruturação visual e animação (container estilizado).
 * - LoginCard: Componente responsável por renderizar o formulário de login.
 */
import {Boxes} from "components/aceternity";
import LoginCard from "%/components/card";
import React from "react";
import Image from "next/image";
import {EllipsisVertical} from "lucide-react";


/**
 * Componente funcional LoginPage.
 * Renderiza a página de login centralizada com animações e um formulário.
 */
const LoginPage = () => {
    return (
        <div
            className="h-screen relative w-full lg:overflow-hidden bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center rounded-lg">
            <div
                className="absolute inset-0 w-full h-full bg-slate-300/50 dark:bg-slate-950 z-20 [mask-image:radial-gradient(transparent,white)] pointer-events-none"/>
            <Boxes/>
            <LoginCard/>
            <div className={"absolute bottom-5 z-50 flex gap-7 items-center justify-center"}>
                <Image
                    src={"/empresa/rodoparana.svg"}
                    className={"aspect-auto dark:invert"}
                    alt={"rodoparana"}
                    height={180}
                    width={230}
                />
                <EllipsisVertical className={"text-foreground h-full"}/>
                <Image
                    src={"/empresa/timber.svg"}
                    className={"dark:invert"}
                    alt={"timber"}
                    height={180}
                    width={190}
                />
            </div>
        </div>
    );
};

export default LoginPage;

