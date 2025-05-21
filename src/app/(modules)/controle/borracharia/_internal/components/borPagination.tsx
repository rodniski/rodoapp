"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon
} from "@radix-ui/react-icons";

import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "ui";

import { useDataTableStore } from "@/_core/components/ui/data-table/stores";
import { useReactTableContext } from "@/_core/components/ui/data-table/table";

export function BorPagination({
  pageSizeOptions = [10, 25, 50, 100],
	dataLength = 0,
}: {
  pageSizeOptions?: number[];
	dataLength?: number;
}) {
  const table = useReactTableContext();
  const { pagination, pageIndex, pageSize, setPageIndex, setPageSize } = useDataTableStore();
	
  return (
    <div className="flex items-center justify-between w-full gap-4 p-2 border-t bg-muted/40">
			<div className="w-[150px]"></div> {/* Placeholder para alinhamento da paginacao */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setPageIndex(pageIndex - 1)}
          disabled={pagination.page === 1}
        >
          <ChevronLeftIcon className="size-4" />
        </Button>

        <div className="flex items-center gap-2 mx-2">
          <span className="size-8 fhd:size-10 qhd:size-12 border border-primary bg-background shadow-xs text-center font-thin
  					inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm sm:text-base lg:text-lg fhd:text-xl qhd:text-2xl font-medium transition-all
  					disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none">
  					{pagination.page}
        	</span>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setPageIndex(pageIndex + 1)}
          disabled={dataLength < pageSize}
        >
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Itens por página:</span>
        <Select
          value={String(pageSize)}
          onValueChange={(value) => setPageSize(Number(value))}
        >
          <SelectTrigger className="h-8 w-[80px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
