"use client"

import {LogOut} from "lucide-react"
import {
    Avatar,
    AvatarFallback,
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    Separator,
    useSidebar
} from "ui"
import {usernameAtom} from "%/atoms";
import {useAtomValue, useSetAtom} from "jotai";
import {formatUsername, getInitials} from "lib";
import {router} from "next/client";
import {ThemeSwitcher} from "../theme-toggle";

export function NavUser({}) {
    const setUsername = useSetAtom(usernameAtom);
    const username = useAtomValue(usernameAtom) || ""
    const {isMobile} = useSidebar()

    const handleLogout = () => {
        // Limpa todos os cookies
        document.cookie.split(";").forEach((cookie) => {
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
            document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Secure;`;
        });

        // Limpa o localStorage e sessionStorage
        localStorage.clear();
        sessionStorage.clear();

        // Redefine estados globais
        setUsername(null);

        // Redireciona para a página de login
        router.push("/");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="rounded-xl size-9 bg-sidebar-primary text-white">
                    <span className={"font-semibold text-base"}>{getInitials(username)}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "bottom"}
                align="end"
                sideOffset={4}
            >
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarFallback
                                className="rounded-lg">{getInitials(username)}</AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">Bem vindo,</span>
                            <span className="truncate font-semibold">{formatUsername(username)}</span>

                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuGroup className="flex w-full justify-center items-center my-3">
                    <ThemeSwitcher/>
                </DropdownMenuGroup>
                <Separator/>
                <DropdownMenuItem
                    className={"mt-2 hover:font-bold group hover:border hover:shadow border-red-500 flex justify-between"}
                    onClick={handleLogout}>
                    <span className={"group-hover:text-red-500"}>
                        Sair do RodoApp
                    </span>
                    <LogOut className="group-hover:text-red-500"/>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

