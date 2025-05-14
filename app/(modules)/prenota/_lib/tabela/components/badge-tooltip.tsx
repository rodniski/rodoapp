/* ui/BadgeWithTooltip.tsx
   ------------------------------------------------------------------ */
   import { Tooltip, TooltipTrigger, TooltipContent } from "ui";
   import { BadgePreset } from "../config/tabela.type";
   
   export const BadgeWithTooltip: React.FC<{ preset: BadgePreset }> = ({
     preset,
   }) => (
     <Tooltip>
       <TooltipTrigger asChild>
         {/* p-1 para "respiro", justify-center para alinhar ícone, sem cor */}
         <span className="inline-flex items-center justify-center p-1">
           {preset.icon}
         </span>
       </TooltipTrigger>
       <TooltipContent className="text-xs font-medium">
         {preset.tooltip}
       </TooltipContent>
     </Tooltip>
   );