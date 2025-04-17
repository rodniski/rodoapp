"use client";
import { Loader2, Save } from "lucide-react";
import { DropdownMenuItem } from "ui";
import { useSalvarPreNota } from "../hooks";
import { useState } from "react";

interface SalvarButtonProps {
  onSaveSuccess?: (rec: string) => void;
  onSaveError?: (error: Error) => void;
  onOpenAnexo?: () => void;
  onOpenRateio?: () => void;
}

const SalvarButton: React.FC<SalvarButtonProps> = ({
  onSaveSuccess,
  onSaveError,
  onOpenAnexo,
  onOpenRateio,
}) => {
  const { salvar, isLoading } = useSalvarPreNota();

  const handleSalvar = async () => {
    try {
      await salvar(onSaveSuccess, {
        openAnexo: onOpenAnexo,
        openRateio: onOpenRateio,
      });
    } catch (error) {
      onSaveError?.(error as Error);
    }
  };

  return (
    <DropdownMenuItem
      className="hover:font-bold group hover:border hover:shadow border-lime-500 justify-between h-full flex"
      onClick={handleSalvar}
      disabled={isLoading}
    >
      <span className={"group-hover:text-lime-500"}>
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Save className="w-5 h-5" />
        )}
      </span>

      <span className={"group-hover:text-lime-500"}>
        {isLoading ? "Salvando..." : "Salvar"}
      </span>
    </DropdownMenuItem>
  );
};

export default SalvarButton;