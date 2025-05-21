import { useQuery } from "@tanstack/react-query";
import { HistoricoParams, useMovHistoricoOptions } from "../types";
import { fetchMovHistorico } from "../api";

export const useMovHistorico = ({
                                   type = "historico",
                                   filial = "0101",
                                   conferido = "N",
                                   enabled = true,
                                   page = 1,
                                   pageSize = 100,
                                   filters = {},
                               }: useMovHistoricoOptions) => {

    const query = useQuery({
        queryKey: ["movPortaria", type, filial, conferido, page, pageSize, filters],
        queryFn: async () => {
            const result = await fetchMovHistorico(type, {
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


export const useHistory = (params: HistoricoParams) => {
    console.log("🏢 useHistorico Iniciado:");
    return useMovHistorico({
        type: "historico",
        ...params,
    });
};

export * from '@controle/hooks'
