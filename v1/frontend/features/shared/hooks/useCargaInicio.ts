import { useQuery } from "@tanstack/react-query";
import { fetchCargaInicio } from "api";
import { CargaInicioData } from "types";

export function useCargaInicio(username: string) {
  return useQuery<CargaInicioData, Error>({
    queryKey: ["cargaInicio", username],
    queryFn: () => fetchCargaInicio(username),
    refetchOnWindowFocus: false,
  });
}
