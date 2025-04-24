// @prenota/components/FilialHoverCard.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage, HoverCard, HoverCardContent, HoverCardTrigger } from "ui";
import { useAuthStore } from "@login/stores/auth-store";
import type { FilialAcesso } from "@login/types";

interface FilialHoverCardProps {
  filialNumero: string;
  observation?: string;
}

const getFilialColor = (filialName: string) => {
  if (filialName.startsWith("RODOPARANA")) return "dark:text-sky-400 text-sky-600 bg-muted";
  if (filialName.startsWith("TIMBER")) return "dark:text-amber-500 text-amber-600 bg-muted";
  return "bg-muted text-muted-foreground";
};

const getAvatarSrc = (filialName: string) => {
  if (filialName.startsWith("RODOPARANA")) return "/rodo1.svg";
  if (filialName.startsWith("TIMBER")) return "/timber.svg";
  return "";
};

export const FilialHoverCard: React.FC<FilialHoverCardProps> = ({ filialNumero, observation }) => {
  // Estado local para armazenar as filiais
  const [filiais, setFiliais] = useState<FilialAcesso[]>([]);

  // Carrega as filiais do useAuthStore apenas no cliente
  useEffect(() => {
    const { filiais } = useAuthStore.getState();
    setFiliais(filiais);

    // Assina mudanças no store para atualizar o estado local
    const unsubscribe = useAuthStore.subscribe((state) => {
      setFiliais(state.filiais);
    });

    return () => unsubscribe(); // Limpa a assinatura ao desmontar o componente
  }, []);

  // Busca a filial correspondente ao filialNumero
  const filial = filiais?.find((f: FilialAcesso) => f.M0_CODFIL === filialNumero);
  const displayName = filial ? filial.M0_FILIAL : "Desconhecida";
  const colorClass = filial ? getFilialColor(filial.M0_FILIAL) : "bg-muted text-muted-foreground";
  const avatarSrc = filial ? getAvatarSrc(filial.M0_FILIAL) : "";

  return (
    <HoverCard openDelay={150} closeDelay={50}>
      <HoverCardTrigger asChild>
        <div className="flex items-center justify-start">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-xl text-sm font-bold cursor-pointer ${colorClass}`}
            aria-label={filialNumero}
          >
            {filialNumero}
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent align="start" sideOffset={5} className="w-fit">
        <div className="flex flex-col justify-center items-start gap-2">
          <div className="flex items-center justify-start gap-2 w-full">
            <Avatar className="size-16 text-xl bg-muted text-foreground p-3">
              {avatarSrc ? (
                <AvatarImage src={avatarSrc} className="dark:invert" />
              ) : (
                <AvatarFallback>{filialNumero}</AvatarFallback>
              )}
            </Avatar>
            <div className="flex flex-col">
              <span className="text-lg font-bold capitalize">{displayName}</span>
              {filial && (
                <span className="text-muted-foreground text-sm">{filial.M0_CGC}</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-0 w-full pt-1 px-1">
            {observation && (
              <div className="text-sm w-full pt-1">
                <strong>Obs:</strong> {observation}
              </div>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};