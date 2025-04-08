import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { Parcela } from "#/incluir/interfaces";
import { config } from "config";

interface CondicaoPagamentoParams {
    valor: number;
    condpag: string;
    dtEmissao: string;
    codForn: string;
    lojaForn: string;
}

interface CondicaoPagamentoResponse {
    dados: {
        chave_pix: string;
        cpf_cnpj_destinatario: string;
    };
    Pagamentos: Parcela[];
}

export interface CondicaoPagamentoFull {
    dados: {
        chave_pix: string;
        cpf_cnpj_destinatario: string;
    };
    pagamentos: Parcela[];
}

function formatDtEmissao(dt: string): string {
    // Se dt estiver no formato "YYYYMMDD", converte para "DD/MM/YYYY"
    if (/^\d{8}$/.test(dt)) {
        const year = dt.slice(0, 4);
        const month = dt.slice(4, 6);
        const day = dt.slice(6, 8);
        return `${day}/${month}/${year}`;
    }
    return dt;
}

export const useCondicaoPagamento = (
    params: CondicaoPagamentoParams
): UseQueryResult<CondicaoPagamentoFull, Error> => {
    const { valor, condpag, dtEmissao, codForn, lojaForn } = params;
    const baseURL = config.API_PRODUCTION_URL; // Exemplo: "http://172.16.99.174:8400/rest/"
    console.log("useCondicaoPagamento - Início:", { params, baseURL });

    return useQuery({
        queryKey: ["condicaoPagamento", valor, condpag, dtEmissao, codForn, lojaForn],
        queryFn: async (): Promise<CondicaoPagamentoFull> => {
            const formattedDtEmissao = formatDtEmissao(dtEmissao);
            console.log("useCondicaoPagamento - dtEmissao formatado:", formattedDtEmissao);

            const myHeaders = new Headers();
            myHeaders.append("valor", valor.toString());
            myHeaders.append("condpag", condpag);
            myHeaders.append("dtEmissao", formattedDtEmissao);
            myHeaders.append("codForn", codForn);
            myHeaders.append("lojaForn", lojaForn);

            const requestOptions = {
                method: "GET",
                headers: myHeaders,
                redirect: "follow" as RequestRedirect,
            };

            const url = `${baseURL}reidoapsdu/condicaov2`;
            console.log("useCondicaoPagamento - URL da requisição:", url);
            console.log("useCondicaoPagamento - Headers da requisição:", myHeaders);

            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Erro ${response.status}: ${errorText}`);
            }

            // Lê a resposta como texto e remove possíveis vírgulas extras
            const rawText = await response.text();
            console.log("useCondicaoPagamento - Raw response:", rawText);
            const fixedText = rawText.replace(/,\s*([}\]])/g, "$1");
            console.log("useCondicaoPagamento - Fixed response:", fixedText);

            try {
                const result: CondicaoPagamentoResponse = JSON.parse(fixedText);
                console.log("useCondicaoPagamento - Dados da resposta (Pagamentos):", result.Pagamentos);
                return {
                    dados: result.dados,
                    pagamentos: result.Pagamentos,
                };
            } catch (e) {
                console.error("Erro ao fazer parse do JSON corrigido:", e);
                throw new Error("Erro ao interpretar resposta da API.");
            }
        },
        enabled: Boolean(valor && condpag && dtEmissao && codForn && lojaForn),
        onError: (error: Error) => {
            console.error("useCondicaoPagamento - onError:", error);
        },
    });
};
