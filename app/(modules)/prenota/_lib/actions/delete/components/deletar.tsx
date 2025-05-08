"use client";

import { useDeletePrenota, DeletePrenotaButtonProps } from "@prenota/actions";
import { TrashIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { Button } from "ui";
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
    <Button
      variant="ghost"
      className="w-full justify-start text-destructive focus:text-destructive focus:bg-destructive/10"
      disabled={isPending}
      onClick={handleClick}
    >
      {isPending ? (
        <div className="animate-spin h-4 w-4 border-2 rounded-full border-destructive border-t-transparent mr-2" />
      ) : (
        <TrashIcon className="h-4 w-4 mr-2" />
      )}
      Excluir
    </Button>
  );
};
