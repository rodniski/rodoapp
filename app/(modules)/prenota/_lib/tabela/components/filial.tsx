import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "ui";
import { useFilialMeta } from "./configs";

interface FilialHoverCardProps {
  filialNumero: string;
  observation?: string;
}

export const FilialHoverCard: React.FC<FilialHoverCardProps> = ({
  filialNumero,
  observation,
}) => {
  const { nome, cor, avatarSrc } = useFilialMeta(filialNumero);

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="underline cursor-pointer">{filialNumero}</span>
      </HoverCardTrigger>

      <HoverCardContent className="w-64">
        <div className="flex items-center gap-3">
          <Avatar className={cor}>
            <AvatarImage src={avatarSrc} alt={nome} />
            <AvatarFallback>{filialNumero}</AvatarFallback>
          </Avatar>

          <div>
            <p className="font-medium leading-none">{nome}</p>
            {observation && (
              <p className="text-xs text-muted-foreground">{observation}</p>
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
