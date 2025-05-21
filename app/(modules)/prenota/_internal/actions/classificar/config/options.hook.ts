/* --------------------------------------------------------------------
 * React-Query hook – consumo com cache/erro/loading
 * ------------------------------------------------------------------*/
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import {
  fetchClassificacaoOptions,
  ClassificacaoMetadataResponse,
} from "./options.api";

// Chave única para cache (ajuste se quiser segmentar por filial etc.)
const QUERY_KEY = ["classificacao", "metadata"];

/**
 * Busca naturezas + tipos de operação.
 *
 * @param opts  Qualquer opção aceita por `useQuery` (ex.: enabled, staleTime…)
 */
export function useClassificacaoOptions(
  opts: Partial<
    UseQueryOptions<
      ClassificacaoMetadataResponse, // data
      unknown, // error
      ClassificacaoMetadataResponse, // select result
      typeof QUERY_KEY // queryKey type
    >
  > = {}
) {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: ({ signal }) => fetchClassificacaoOptions(signal),
    staleTime: 1000 * 60 * 30, // 30 min (padrão)
    refetchOnWindowFocus: false,
    ...opts, // ← merge das opções externas
  });
}

/* ------------------------------------------------------------------ */
/*      Helpers prontos para <Select> / <Combobox>                    */
/* ------------------------------------------------------------------ */

export function useNaturezaOptions(
  opts?: Parameters<typeof useClassificacaoOptions>[0]
) {
  const { data } = useClassificacaoOptions(opts);
  return (
    data?.naturezas.map((n) => ({
      value: n.COD.trim(),
      label: n.DESCR.trim(),
    })) ?? []
  );
}

export function useTipoOperacaoOptions(
  opts?: Parameters<typeof useClassificacaoOptions>[0]
) {
  const { data } = useClassificacaoOptions(opts);
  return (
    data?.tiposOperacao.map((t) => ({
      value: t.COD.trim(),
      label: t.DESCR.trim(),
    })) ?? []
  );
}
