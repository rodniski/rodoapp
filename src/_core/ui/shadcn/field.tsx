/* components/Field.tsx ----------------------------------------------*/
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Tooltip, TooltipTrigger, TooltipContent } from "ui";
import clsx from "clsx";

interface FieldProps {
  label: string;
  value?: React.ReactNode;
  className?: string; // para permitir sm:col-span-2 etc.
}

export const Field: React.FC<FieldProps> = ({ label, value, className }) => (
  <div className={clsx("flex items-start gap-1.5", className)}>
    <span className="min-w-[110px] font-medium text-muted-foreground">
      {label}:
    </span>

    {value ? (
      <span>{value}</span>
    ) : (
      <Tooltip>
        <TooltipTrigger asChild>
          <InfoCircledIcon className="size-4 text-muted-foreground cursor-help" />
        </TooltipTrigger>
        <TooltipContent>Não informado</TooltipContent>
      </Tooltip>
    )}
  </div>
);
