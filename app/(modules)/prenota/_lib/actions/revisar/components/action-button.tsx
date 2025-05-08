import { Button } from "ui";
import { ActionButtonProps } from "@/app/(modules)/prenota/_lib/lib/types";
import { UpdateIcon } from "@radix-ui/react-icons";

export const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  loadingLabel,
  isLoading,
  disabled,
  onClick,
  type = "button",
  variant = "default",
  form,
}) => (
  <Button
    type={type}
    variant={variant}
    onClick={onClick}
    disabled={disabled}
    form={form}
    className="w-full sm:w-auto min-w-[160px]"
  >
    {isLoading ? (
      <>
        <UpdateIcon className="size-4 animate-spin mr-2" />
        {loadingLabel}
      </>
    ) : (
      label
    )}
  </Button>
);
