"use client";

import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, Button, Separator, ThemeSwitcher } from "ui";
import { formatUsername, getInitials } from "utils";
import { useAuth } from "@login/hooks";
import { useAuthStore } from "@login/stores/auth-store";

export function UserMenuContent() {
  const { logout } = useAuth();
  const { user } = useAuthStore();
  return (
    <div className="flex flex-col gap-2">
      {/* Seção de usuário */}
      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
        <Avatar className="rounded size-9">
          <AvatarFallback className="rounded border border-primary hover:bg-primary hover:text-foreground font-semibold text-base">
            {getInitials(user?.username || "")}
          </AvatarFallback>
        </Avatar>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium text-muted-foreground text-xs">
            Bem vindo,
          </span>
          <span className="truncate font-semibold">
            {formatUsername(user?.username || "")}
          </span>
        </div>
        <div className="lg:hidden block">
          <ThemeSwitcher />
        </div>
      </div>

      {/* Separador */}
      <Separator className="w-full hidden lg:block" />
      {/* Botão de logout */}
      <button
        className="hidden lg:flex justify-between items-center px-2 py-1.5 text-sm hover:font-bold group hover:border hover:shadow border-red-500 rounded"
        onClick={logout}
      >
        <span className="group-hover:text-red-500">Sair do RodoApp</span>
        <LogOut className="group-hover:text-red-500 size-4" />
      </button>
      <Button
        variant="destructive"
        size="sm"
        className="lg:hidden flex justify-between items-center text-sm hover:font-bold group hover:border hover:shadow border-red-500 rounded"
        onClick={logout}
      >
        <span className="">Sair do RodoApp</span>
        <LogOut className=" size-4" />

      </Button>
    </div>
  );
}
