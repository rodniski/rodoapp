import {useMutation, useQuery} from "@tanstack/react-query";
import {conexaoNfeService} from "#/api/conexaoNFE";

export function useDetalhesXml(xml: string) {
    return useQuery({
        queryKey: ["detalhesXml", xml],
        queryFn: () => conexaoNfeService.getDetalhesXml(xml),
        enabled: !!xml,
    });
}

// Usando useMutation para evitar requisições automáticas desnecessárias
export function useDownloadDanfe() {
    return useMutation({
        mutationFn: (xml: string) => conexaoNfeService.downloadDanfe(xml),
    });
}
