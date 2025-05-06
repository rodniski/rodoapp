// app/(modules)/_lib/components/NavUser.tsx
"use client";

import React from "react";
import {
  Button,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "ui";
import { getInitials } from "utils";
import { UserMenuContent } from ".";
import { useAuthStore } from "@/app/login/_lib/stores/auth-store";

export function NavUser() {
  const { user } = useAuthStore();
  const username = user?.username ?? "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon">
          <span className="font-semibold">{getInitials(username)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end" sideOffset={4}>
        <UserMenuContent />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
