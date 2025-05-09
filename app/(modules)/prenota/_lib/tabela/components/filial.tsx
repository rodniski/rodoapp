/* prenota/tabela/FilialHoverCard.tsx
   — agora com avatar colorido, imagem opcional e fallback elegante */

   "use client";

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
import { cn } from "@/_core/utils";
   
   interface FilialHoverCardProps {
     filialNumero: string;
     observation?: string;
   }
   
   export const FilialHoverCard: React.FC<FilialHoverCardProps> = ({
     filialNumero,
     observation,
   }) => {
     /* meta = { nome completo, classe de cor, src do avatar } */
     const { nome, cor, avatarSrc } = useFilialMeta(filialNumero);
   
     /*  ——— avatar que aparece na célula da tabela ——— */
     const triggerAvatar = (
       <Avatar
         className={`size-10 shrink-0 ring-1 ring-border overflow-hidden ${cor}`}
       >
         <AvatarFallback className={cn({cor}, "text-xs font-semibold")}>
           {filialNumero}
         </AvatarFallback>
       </Avatar>
     );
   
     return (
       <HoverCard openDelay={200}>
         <HoverCardTrigger asChild>{triggerAvatar}</HoverCardTrigger>
   
         <HoverCardContent className="w-72">
           <div className="flex items-center gap-3">
             {/* avatar maior dentro do cartão */}
             <Avatar className={`size-14 p-3 flex justify-center items-center border border-foreground ${cor}`}>
               {avatarSrc && <AvatarImage src={avatarSrc} alt={nome} className="size-full"/>}
               <AvatarFallback className="text-xs font-semibold">
                 {filialNumero}
               </AvatarFallback>
             </Avatar>
   
             <div className="min-w-0">
               <p className="font-medium truncate">{nome}</p>
               {observation && (
                 <p className="text-xs text-muted-foreground line-clamp-3">
                   {observation}
                 </p>
               )}
             </div>
           </div>
         </HoverCardContent>
       </HoverCard>
     );
   };
   