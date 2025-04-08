// src/#/incluir/hooks/usePrenotaDetails.ts

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import {Prenota, ProtheusErrorResponse} from "../interfaces";

const fetchPrenota = async (usr: string, rec: number): Promise<Prenota> => { // Parâmetros adicionados
    try {
        const config = {
            method: 'get',
            url: `${process.env.NEXT_PUBLIC_API_PRODUCTION_URL}PreNota`,
            headers: {
                'usr': usr,
                'rec': rec,
                'Content-Type': 'application/json'
            }
        };
        const response = await axios(config);
        return response.data;

    } catch (error) {
        if (axios.isAxiosError(error)) {
            const axiosError = error as AxiosError<ProtheusErrorResponse>;
            if (axiosError.response) {
                const status = axiosError.response.status;
                const typedData = axiosError.response.data as ProtheusErrorResponse

                const errorMessage =
                    (typedData && (typedData.message || typedData.error)) ||
                    `Erro ${status} desconhecido`;
                throw new Error(`Erro ${status}: ${errorMessage}`);
            } else if (axiosError.request) {
                throw new Error("Sem resposta do servidor.");
            } else {
                throw new Error("Erro ao configurar a requisição.");
            }
        } else {
            throw new Error("Um erro desconhecido ocorreu");
        }
    }
};

// Hook customizado (AGORA recebe usr e rec)
export interface UsePrenotaDetailsProps {
    usr: string;
    rec: number;
}

//Agora o hook recebe um objeto.
export const usePrenotaDetails = ({usr, rec}: UsePrenotaDetailsProps): UseQueryResult<Prenota, Error> => {
    return useQuery<Prenota, Error>({
        queryKey: ['prenotaDetails', usr, rec], // Importante: Inclui usr e rec na queryKey!
        queryFn: () => fetchPrenota(usr, rec), // Passa usr e rec para fetchPrenota
        enabled: !!usr && !!rec, // Só executa se ID, usr e rec existirem
        retry: false,
    });
};
