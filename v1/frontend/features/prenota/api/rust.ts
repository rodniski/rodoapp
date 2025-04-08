import axios from "axios";
import {config} from "config";

const rustApi = axios.create({
    baseURL: config.API_RUST_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const rustService = {
    getTable: async (username: string, page = 1, perPage = 101, sortBy = "F1_FILIAL", sortOrder = "asc") => {
        const response = await rustApi.get("/table", {
            headers: {
                username,
                page: page.toString(),
                per_page: perPage.toString(),
                "sort-by": sortBy,
                "sort-order": sortOrder,
            },
        });
        return response.data;
    },

    postInit: async (username: string) => {
        console.log("Username no GET: ",username);
        const response = await rustApi.post("/init", {}, {
            headers: {username},
        });
        console.log(`Response status: ${response.status}`);
        return response.data;
    },
    getTimeline: async (username: string, filial: string, nota: string, serie: string, cod_fornecedor: string, loja: string) => {
        const response = await rustApi.get("/timeline", {
            headers: {
                username,
                filial,
                nota,
                serie,
                cod_fornecedor,
                loja,
            },
        });
        return response.data;
    },
};
