"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { DropdownMenuItem } from "ui";
import { toast } from "sonner";
import { usePrenotaDetails } from "@prenota/editar";

interface EditPrenotaButtonProps {
  usr: string;
  rec: number;
}

export const EditPrenotaButton: React.FC<EditPrenotaButtonProps> = ({
  usr,
  rec,
}) => {
  const router = useRouter();
  const { refetch } = usePrenotaDetails({ usr, rec });

  const handleEdit = () => {
    toast.promise(refetch(), {
      loading: "Carregando pré-nota...",
      success: () => {
        router.push("/prenota/inclusao");
        return "Pré-nota carregada com sucesso!";
      },
      error: "Falha ao carregar a pré-nota",
    });
  };

  return (
    <DropdownMenuItem
      onClick={handleEdit}
      className="flex justify-between w-full cursor-pointer"
    >
      Editar
      <Pencil1Icon className="size-4" />
    </DropdownMenuItem>
  );
};
