"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from "@radix-ui/react-icons";
import { useState } from "react";
import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "ui";
import { useDataTableStore } from ".";
import { useReactTableContext } from ".";

export function DataTablePagination({
  pageSizeOptions = [10, 25, 50, 100],
}: {
  pageSizeOptions?: number[];
}) {
  const table = useReactTableContext();
  const { pagination, pageIndex, pageSize, setPageIndex, setPageSize } =
    useDataTableStore();

  const [jumpToPage, setJumpToPage] = useState("");

  const handleJumpToPage = () => {
    const page = Number(jumpToPage);
    if (!isNaN(page) && page >= 1 && page <= pagination.totalPages) {
      setPageIndex(page - 1);
      setJumpToPage("");
    }
  };

  return (
    <div className="flex items-center justify-between w-full gap-4 p-2 flex-wrap border-t bg-muted/40">
      <span className="text-sm text-muted-foreground whitespace-nowrap">
        Mostrando{" "}
        {Math.min(
          pagination.pageSize * (pagination.page - 1) + 1,
          pagination.totalCount
        )}{" "}
        a{" "}
        {Math.min(pagination.page * pagination.pageSize, pagination.totalCount)}{" "}
        de {pagination.totalCount}
      </span>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setPageIndex(0)}
          disabled={pagination.page === 1}
        >
          <DoubleArrowLeftIcon className="size-4" />
        </Button>
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
          <span className="text-sm">Página</span>
          <input
            type="number"
            min={1}
            max={pagination.totalPages}
            value={jumpToPage || pagination.page}
            onChange={(e) => setJumpToPage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleJumpToPage()}
            onBlur={handleJumpToPage}
            className="size-8 fhd:size-10 qhd:size-12 border border-primary bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 text-center font-thin
              inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm sm:text-base lg:text-lg fhd:text-xl qhd:text-2xl font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 sm:[&_svg:not([class*='size-'])]:size-5 lg:[&_svg:not([class*='size-'])]:size-6 fhd:[&_svg:not([class*='size-'])]:size-7 qhd:[&_svg:not([class*='size-'])]:size-8 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive
              [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield]"
            aria-label="Pular para página"
          />
          <span className="text-sm">de {pagination.totalPages}</span>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setPageIndex(pageIndex + 1)}
          disabled={pagination.page === pagination.totalPages}
        >
          <ChevronRightIcon className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => setPageIndex(pagination.totalPages - 1)}
          disabled={pagination.page === pagination.totalPages}
        >
          <DoubleArrowRightIcon className="size-4" />
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
