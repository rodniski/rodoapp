import axios from "axios";
import {config} from "config";

const conexaoNFEApi = axios.create({
    baseURL: config.CONEXAO_NFE_BASE_URL,
    headers: {
        Authorization: `Bearer ${config.CONEXAO_NFE_TOKEN}`,
        "Content-Type": "application/json",
    },
});

export const conexaoNfeService = {
    getDetalhesXml: async (xml: string) => {
        const response = await conexaoNFEApi.get(`/dfes/${xml}/detalhes/xml`);
        return response.data;
    },

    downloadDanfe: async (xmlKey: string): Promise<Blob> => {
        if (!xmlKey.trim()) {
            throw new Error("A chave XML não pode estar vazia.");
        }

        const response = await conexaoNFEApi.get(`/documento-auxiliar/${xmlKey}/gerar`, {
            responseType: "blob",
        });

        return response.data;
    },
};
