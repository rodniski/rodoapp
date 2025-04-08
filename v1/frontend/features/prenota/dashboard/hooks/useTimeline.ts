import {useQuery} from "@tanstack/react-query";
import type {TimelineItem, TimelineParams} from "#/dashboard/interfaces";
import {config} from "config";

export function useTimeline(filters: TimelineParams) {
    return useQuery({
        queryKey: ["timeline", filters],
        queryFn: async () => {
            const headers = new Headers();

            // 🔍 Adicionando filtros ao header apenas se existirem valores
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    headers.append(key, value.toString());
                }
            });

            const res = await fetch(`${config.API_RUST_URL}/timeline`, {headers});

            if (!res.ok) {
                throw new Error("❌ Falha ao buscar a timeline");
            }

            const data: TimelineItem[] = await res.json();
            return data;
        },
        enabled: Object.keys(filters).length > 0, // ✅ Só busca se houver filtros ativos
        refetchInterval: 60000, // 🔄 Atualiza automaticamente a cada 60 segundos
        staleTime: 30000, // ⚡ Evita múltiplas chamadas se os dados ainda estiverem recentes (30s)
    });
}
