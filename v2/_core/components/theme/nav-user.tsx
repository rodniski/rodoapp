"use client";

import { LogOut } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "ui";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

// Função para obter as iniciais do nome de usuário
function getInitials(username: string): string {
  if (!username) return "";
  return username
    .split(".")
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

// Função para formatar o nome de usuário
function formatUsername(username: string): string {
  if (!username) return "";
  return username
    .split(".")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function NavUser() {
  const { data: session } = useSession();
  const router = useRouter();
  const username = session?.user?.username || "";

  const handleLogout = async () => {
    // Limpa todos os cookies
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
      document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Secure;`;
    });

    // Limpa o localStorage e sessionStorage
    localStorage.clear();
    sessionStorage.clear();

    // Chama a função de logout do NextAuth
    await signOut({ redirect: false });

    // Redireciona para a página inicial
    router.push("/");
  };

  if (!session) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => router.push("/login")}
      >
        Login
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="border border-primary">
          <span className={"font-semibold text-base"}>{getInitials(username)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-56 rounded"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="rounded size-9">
              <AvatarFallback className="rounded border border-primary font-semibold text-base">
                {getInitials(username)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium text-muted-foreground text-xs">Bem vindo,</span>
              <span className="truncate font-semibold">
                {formatUsername(username)}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className={
            "mt-2 hover:font-bold group hover:border hover:shadow border-red-500 flex justify-between"
          }
          onClick={handleLogout}
        >
          <span className={"group-hover:text-red-500"}>Sair do RodoApp</span>
          <LogOut className="group-hover:text-red-500" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 