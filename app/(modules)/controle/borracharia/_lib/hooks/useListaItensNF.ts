import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { config } from "config";
import { ItemNF } from "@/app/(modules)/controle/borracharia/_lib/types";

interface ListaItensNFParams {
    Filial: string;
    Doc: string;
    Serie: string;
    CodCliente: string;
    Loja: string;
}

export const useListaItensNF = (params: ListaItensNFParams, enabled = true) => {
    const fetchItensNF = async () => {
        const configRequest = {
            method: 'get',
            url: `${config.API_BORRACHARIA_URL}MovPortaria/ListaItensNF`,
            params: {
                Filial: params.Filial,
                Doc: params.Doc,
                Serie: params.Serie,
                CodCliente: params.CodCliente,
                Loja: params.Loja,
            },
            headers: {
                'Content-Type': 'application/json',
            },
        };

        try {
            console.log("Chamando API com config:", configRequest);
            const response = await axios(configRequest);
            if (!Array.isArray(response.data)) {
                throw new Error("Resposta da API não é um array");
            }
            console.log("Resposta da API:", response.data);
            return response.data.map((item: any) => ({
                ...item,
                SaldoSelecionado: 0, // Inicializa como 0
            })) as ItemNF[];
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                throw new Error(`Erro ao buscar itens da NF: ${error.response?.data?.message || error.message}`);
            } else {
                throw new Error(`Erro ao buscar itens da NF: ${(error as Error).message}`);
            }
        }
    };

    const result = useQuery<ItemNF[]>({
        queryKey: ["listaItensNF", params],
        queryFn: fetchItensNF,
        enabled: enabled && Object.values(params).every(Boolean),
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        refetchOnMount: false,
        staleTime: 5 * 60 * 1000,
        retry: 2,
    });

    // Adicionar onError separadamente
    if (result.error) {
        console.error("Erro na query:", result.error);
    }

    return result;
};
