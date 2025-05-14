// hooks/hook.borracharia.ts
import {useQuery} from "@tanstack/react-query";
import {fetchMovBorracharia} from "../api";
import {useMovBorrachariaOptions} from "../types";

export const useMovBorracharia = ({
                                   type,
                                   filial = "0101",
                                   conferido = "N",
                                   enabled = true,
                                   page = 1,
                                   pageSize = 100,
                                   filters = {},
                               }: useMovBorrachariaOptions) => {

    const query = useQuery({
        queryKey: ["movPortaria", type, filial, conferido, page, pageSize, filters],
        queryFn: async () => {
            const result = await fetchMovBorracharia(type, {
                Page: page.toString(),
                PageSize: pageSize.toString(),
                Filial: filial,
                Conferido: conferido,
                ...filters,
            });
            return result;
        },
        enabled,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
    });

    return query;
}

export * from './usePortariaPermissions'