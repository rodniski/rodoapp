"use client";

import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "ui";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { UserMenuContent } from "."; // Importe o novo componente
import { getInitials } from "utils";

export function NavUser() {
  const { data: session } = useSession();
  const router = useRouter();
  const username = session?.user?.username || "";

  const handleLogout = async () => {
    document.cookie.split(";").forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substring(0, eqPos) : cookie;
      document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Secure;`;
    });

    localStorage.clear();
    sessionStorage.clear();

    await signOut({ redirect: false });
    router.push("/");
  };

  if (!session) {
    return (
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => router.push("/login")}
        className="border border-primary"
      >
        Login
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="border border-primary hover:bg-primary hover:border-muted">
          <span className="font-semibold text-sm fhd:text-base qhd:text-2xl">
            {getInitials(username)}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-56 rounded"
        side="bottom"
        align="end"
        sideOffset={4}
      >
        <UserMenuContent username={username} onLogout={handleLogout} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}