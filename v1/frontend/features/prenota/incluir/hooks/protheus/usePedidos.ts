// hooks.ts (MUITO MAIS SIMPLES!)

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios from "axios";
import { FornecedorAPI } from "#/incluir/interfaces"; // Importa FornecedorAPI (simplificada)
import { config } from "config";

// Função para buscar os fornecedores (SIMPLIFICADA!)
export const fetchPedidos = async ({ cnpj }: { cnpj: string }): Promise<FornecedorAPI[]> => { // Retorna DIRETO FornecedorAPI[]
    const response = await axios.get(
        `${config.API_PRODUCTION_URL}reidoapsdu/consultar/likefor`,
        {
            headers: {
                "Content-Type": "application/json",
                busca: cnpj,
            },
        }
    );
    return response.data as FornecedorAPI[]; // Retorna DIRETO response.data como FornecedorAPI[]
};

// Hook usePedidosUnified (SUPER SIMPLIFICADO!)
export const usePedidosUnified = ({
                                      cnpj,
                                  }: {
    cnpj?: string;
}): UseQueryResult<FornecedorAPI[]> => { // Retorna UseQueryResult<FornecedorAPI[]>
    return useQuery<FornecedorAPI[], Error, FornecedorAPI[], (string | undefined)[]>({ // Tipagem SIMPLIFICADA!
        queryKey: ["fornecedores", cnpj], // Mudando queryKey para "fornecedores" (mais semântico)
        queryFn: async (): Promise<FornecedorAPI[]> => { // queryFn retorna Promise<FornecedorAPI[]>
            if (!cnpj) return [];
            return fetchPedidos({ cnpj }); // Chama fetchPedidos e retorna DIRETO o resultado
        },
        enabled: Boolean(cnpj),
    });
};

// Função auxiliar (permanece a mesma)
export const getOrderOptions = (pedidos?: any[]): { value: string; label: string }[] => { // Mantém "any" para simplificar (ou tipar PedidoAPI[] se precisar)
    if (!pedidos) return [];
    return pedidos.map((pedido: any) => ({ // Mantém "any" para simplificar (ou tipar PedidoAPI se precisar)
        value: pedido.C7_NUM, // Usa C7_NUM diretamente (propriedade de PedidoAPI)
        label: pedido.STATUS || `Pedido ${pedido.C7_NUM}`, // Usa STATUS e C7_NUM diretamente
    }));
};
