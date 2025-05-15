"use client";

import { useDeletePrenota, DeletePrenotaButtonProps } from "@/app/(modules)/prenota/_internal/actions";
import { TrashIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { DropdownMenuItem } from "ui";
import React from "react";

export const DeletePrenotaButton: React.FC<DeletePrenotaButtonProps> = ({
  rec,
  onDeleted,
}) => {
  const { mutate: deletePrenota, isPending } = useDeletePrenota({
    onSuccess: () => {
      toast.success("Pré-nota excluída com sucesso!");
      onDeleted?.();
    },
    onError: (err) => {
      toast.error(`Falha na exclusão: ${err.message}`);
      console.error("[DeletePrenotaButton] erro:", err);
    },
  });

  const handleClick = () => {
    if (isPending) return;
    if (!confirm("Tem certeza que deseja excluir esta pré-nota?")) return;
    deletePrenota(rec);
  };

  return (
    <DropdownMenuItem
      disabled={isPending}
      onClick={handleClick}
    className="flex justify-between w-full cursor-pointer text-destructive"
    >
      Excluir
      {isPending ? (
        <div className="animate-spin size-4 " />
      ) : (
        <TrashIcon className="size-4 text-destructive" />
      )}
    </DropdownMenuItem>
  );
};
