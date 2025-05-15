import { DropdownMenuItem } from "ui";
import { MenuItemProps } from "@/app/(modules)/prenota/_internal/actions";

// Componente reutilizável para itens de menu
export const MenuItem: React.FC<MenuItemProps> = ({
  label,
  icon,
  onClick,
  disabled,
  className,
}) => (
  <DropdownMenuItem
    onClick={onClick}
    disabled={disabled}
    className={`flex justify-between w-full cursor-pointer ${className || ""}`}
  >
    <span>{label}</span>
    {icon}
  </DropdownMenuItem>
);
