// hooks/hook.borracharia.ts
import {useQuery} from "@tanstack/react-query";
import {BorrachariaParams} from "../types";
import { defaultQueryOptions } from "@/app/(modules)/prenota/_lib";
import { fetchMovBorracharia } from "../api";

export const useMovBorracharia = (params: BorrachariaParams) => {
  console.log("🔴 Executando useMovBorracharia com params:", params);
  return useQuery({
    queryKey: ["movBorracharia", params.Page, params.PageSize, params.Filial, params.Filters],
    queryFn: () =>
      fetchMovBorracharia(params),
    ...defaultQueryOptions,
  });
};