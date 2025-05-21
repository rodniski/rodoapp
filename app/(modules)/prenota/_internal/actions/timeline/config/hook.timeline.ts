import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { TimelineResponse } from "@prenota/actions";
import { fetchTimeline } from "@prenota/actions";

/**
 * Hook personalizado para buscar e gerenciar dados da timeline de uma pré-nota.
 * @param recsf1 - ID da pré-nota (R_E_C_N_O_)
 * @returns Resultado da query com dados, status e erro
 */
export function useTimeline(
  recsf1: string | number | null
): UseQueryResult<TimelineResponse, Error> {
  const recsf1AsString = recsf1?.toString().trim();
  const queryKey = ["timeline", recsf1AsString];

  return useQuery({
    queryKey,
    queryFn: () => {
      if (!recsf1AsString) {
        console.warn("[useTimeline] RECSF1 é necessário.");
        return Promise.resolve([]);
      }
      return fetchTimeline(recsf1AsString);
    },
    enabled: !!recsf1AsString,
  });
}
