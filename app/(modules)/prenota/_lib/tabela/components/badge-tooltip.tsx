/* ui/BadgeWithTooltip.tsx
   ------------------------------------------------------------------ */
   import { Tooltip, TooltipTrigger, TooltipContent } from "ui";

   export interface BadgePreset {
     color: string; // classes tailwind (text-… ou bg-…) - usado apenas no icon
     icon: React.ReactNode; // qualquer nó: ícone, badge, texto…
     tooltip: string; // texto do tooltip
   }
   
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