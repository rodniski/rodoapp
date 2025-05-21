import { AttachmentItemProps } from "@prenota/actions";
import { DropdownMenuItem } from "ui";
import { DownloadIcon } from "@radix-ui/react-icons";

// Componente reutilizável para itens de anexo
export const AttachmentItem: React.FC<AttachmentItemProps> = ({
  attachment,
  onDownload,
  index,
}) => (
  <DropdownMenuItem
    key={attachment.Z07_PATH || `att-${index}`}
    onClick={() => onDownload(attachment.Z07_PATH)}
    className="flex justify-between cursor-pointer"
  >
    <span className="truncate">{attachment.Z07_DESC}</span>
    <DownloadIcon className="size-4 text-muted-foreground" />
  </DropdownMenuItem>
);