// _core/components/ui/data-table/action-header.tsx
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "ui";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  EyeClosedIcon,
  CaretSortIcon,
} from "@radix-ui/react-icons";
import { Column } from "@tanstack/react-table";
import { useDataTableStore } from "ui/data-table";
import { toast } from "sonner";

type Props<TData, TValue> = {
  column: Column<TData, TValue>;
  title: string;
};

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
}: Props<TData, TValue>) {
  const sorting = useDataTableStore((s) => s.sorting);
  const setSorting = useDataTableStore((s) => s.setSorting);
  const setPageIndex = useDataTableStore((s) => s.setPageIndex);

  // Verificação para garantir que setSorting é uma função
  if (typeof setSorting !== "function") {
    toast.error(
      "setSorting não é uma função. Verifique a implementação do useDataTableStore."
    );
    return <span>Erro na configuração da tabela</span>; // Feedback visual opcional
  }

  const columnId = column.id;
  const currentSort = sorting.find((s) => s.id === columnId);

  const updateSorting = (desc: boolean) => {
    const newSorting = sorting.filter((s) => s.id !== columnId);
    newSorting.unshift({ id: columnId, desc });
    setSorting(newSorting);
    setPageIndex(0); // Resetar página ao ordenar
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center justify-center w-full">
          <span>{title}</span>
          <CaretSortIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-50">
        <DropdownMenuItem onClick={() => updateSorting(false)}>
          <ArrowUpIcon className="mr-2 h-4 w-4" />
          Ordenar ascendente
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateSorting(true)}>
          <ArrowDownIcon className="mr-2 h-4 w-4" />
          Ordenar descendente
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => column.toggleVisibility()}>
          <EyeClosedIcon className="mr-2 h-4 w-4" />
          Ocultar coluna
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
