// // hooks/useMovPortaria.ts
// import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

// import {fetchMovPortaria} from "../api";
// import {
//     ConferenciaParams,
//     EstornoParams,
//     HistoricoParams,
//     UseMovPortariaOptions,
// } from "../types";
// import {toast} from "sonner";
// import { useUserStore } from "../stores";



// export const useMovPortaria = ({
//                                    type,
//                                    filial = "0101",
//                                    conferido = "N",
//                                    enabled = true,
//                                    page = 1,
//                                    pageSize = 100,
//                                    filters = {},
//                                }: UseMovPortariaOptions) => {
//     const queryClient = useQueryClient();

//     const query = useQuery({
//         queryKey: ["movPortaria", type, filial, conferido, page, pageSize, filters],
//         queryFn: async () => {
//             const result = await fetchMovPortaria(type, {
//                 Page: page.toString(),
//                 PageSize: pageSize.toString(),
//                 Filial: filial,
//                 Conferido: conferido,
//                 ...filters,
//             });
//             return result;
//         },
//         enabled,
//         refetchOnWindowFocus: false,
//         refetchOnReconnect: false,
//         refetchOnMount: false,
//     });

//     const conferenciaSaida = useMutation({
//         mutationFn: async (params: ConferenciaParams) => {
//             console.log("🔵 Iniciando Conferência:", params);
//             // Passa o terceiro argumento como true para usar POST
//             const result = await fetchMovPortaria("conferenciaSaida", params, true);
//             console.log("✅ Conferência realizada:", result);
//             return result;
//         },
//         onSuccess: () => {
//             console.log("✨ Conferência bem sucedida - Invalidando queries");
//             toast.success("Entrega confirmada com sucesso!");
//             queryClient.invalidateQueries({queryKey: ["movPortaria"]});
//         },
//         onError: (error) => {
//             console.error("❌ Erro na Conferência:", error);
//             toast.error("Erro ao confirmar entrega");
//         },
//     });

//     const estornoSaida = useMutation({
//         mutationFn: async (params: EstornoParams) => {
//             console.log("🔴 Iniciando Estorno:", params);
//             const result = await fetchMovPortaria("estornoSaida", params);
//             console.log("✅ Estorno realizado:", result);
//             return result;
//         },
//         onSuccess: () => {
//             console.log("✨ Estorno bem sucedido - Invalidando queries");
//             toast.success("Entrega rejeitada com sucesso!");
//             queryClient.invalidateQueries({queryKey: ["movPortaria"]});
//         },
//         onError: (error) => {
//             console.error("❌ Erro no Estorno:", error);
//             toast.error("Erro ao rejeitar entrega");
//         },
//     });

//     return {
//         ...query,
//         conferenciaSaida,
//         estornoSaida,
//     };
// };

// export const useHistory = (params: HistoricoParams) => {
//     console.log("🏢 useHistorico Iniciado:");
//     return useMovPortaria({
//         type: "historico",
//         ...params,
//     });
// };

// type FilialLoja = {
//     Loja: string;
// };

// type GrupoFilial = {
//     Grupo: string;
//     Filial: FilialLoja[];
// };

// export const useGrupoFilial = (enabled = true) => {
//     console.log("👥 useGrupoFilial Iniciado");
//     const username = useUserStore((state) => state.username);

//     return useQuery<GrupoFilial[]>({
//         queryKey: ["grupoFilial", username],
//         queryFn: async () => {
//             if (!username) {
//                 console.error("❌ Usuário não encontrado");
//                 throw new Error("Usuário não encontrado");
//             }

//             console.log("🔄 Buscando Grupos Filiais:", {username});
//             const result = await fetchMovPortaria("grupoFilial", {
//                 Usuario: username,
//             });
//             console.log("✅ Grupos Filiais recebidos:", result);
//             return result;
//         },
//         enabled: enabled && !!username,
//         refetchOnWindowFocus: false,
//         refetchOnReconnect: false,
//         refetchOnMount: false,
//         staleTime: 5 * 60 * 1000, // Cache por 5 minutos
//         retry: 2,
//     });
// };

// export * from './usePortariaPermissions'