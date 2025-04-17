import {useQuery} from "@tanstack/react-query";
import {PreNota, PreResposta} from "#/dashboard/interfaces";
import {config} from "config";

// Função para formatar datas do Protheus (yyyyMMdd → dd/mm/yyyy)
const formatarData = (data: string | null): string => {
    if (!data || data.length !== 8) return "";
    return `${data.slice(6, 8)}/${data.slice(4, 6)}/${data.slice(0, 4)}`;
};

// Função para determinar status
const determinarStatus = (nota: PreNota): string => {
    if (nota.F1ZObsRev && nota.F1ZObsRev.trim() !== "") return "Revisar";
    if (nota.F1Status && nota.F1Status.trim() !== "") return "Classificada";
    return "Pendente";
};

// Hook para buscar pré-notas e formatar os dados antes de retornar
export function usePreNotas(username: string) {
    return useQuery<PreResposta>({
        queryKey: ["filiais-init", username],
        queryFn: async () => {
            const res = await fetch(`${config.API_RUST_URL}/filiais/init`, {
                headers: {usr: username},
            });

            if (!res.ok) {
                throw new Error("Falha ao consultar /filiais/init");
            }

            const data: PreResposta = await res.json();
            console.log("➡️ /filiais/init:", data.message, "Group:", data.groupID);

            // 🔹 Trata os dados antes de retornar
            return {
                ...data,
                prenotasFiltradas: data.prenotasFiltradas?.map((nota) => ({
                    ...nota,
                    F1Emissao: formatarData(nota.F1Emissao),
                    F1DtDigit: formatarData(nota.F1DtDigit),
                    Vencimento: formatarData(nota.Vencimento),
                    F1Status: determinarStatus(nota), // Aplica a lógica do status
                })) || [],
            };
        },
        enabled: !!username,
        refetchInterval: 300000, // 🔄 Faz polling da API a cada 5 minuto
    });
}
