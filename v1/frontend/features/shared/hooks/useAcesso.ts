import {useQuery} from "@tanstack/react-query";
import {useSetAtom} from "jotai";
import {filiaisAtom, filiaisLoadingAtom, Filial} from "$/atoms";
import {protheusService} from "#/api";
import {config} from "$/config";

export const useAcesso = () => {
    const setFiliais = useSetAtom(filiaisAtom);
    const setFiliaisLoading = useSetAtom(filiaisLoadingAtom);

    return useQuery({
        queryKey: ["filiais"],
        queryFn: async () => {
            setFiliaisLoading(true);

            try {
                const data = await protheusService.get<Filial[]>(
                    config.API_PRODUCTION_URL,
                    "/reidoapsdu/consultar/filiais/"
                );

                const formattedData = data.map((filial) => ({
                    numero: filial.numero.trim(),
                    filial: filial.filial.trim(),
                    cnpjFilial: filial.cnpjFilial.trim(),
                }));

                setFiliais(formattedData);
                return formattedData;
            } catch (error) {
                console.error("Erro ao buscar filiais:", error);
                throw error;
            } finally {
                setFiliaisLoading(false);
            }
        },
        staleTime: 1000 * 60 * 5, // Cache por 5 minutos
    });
};
