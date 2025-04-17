import { useQuery } from '@tanstack/react-query';
import type { CargaInicio } from 'types';

export const useCargaInicio = () => {
  return useQuery<CargaInicio>({
    queryKey: ['cargaInicio'],
    queryFn: async () => {
      const response = await fetch(
        'http://172.16.99.174:8400/rest/reidoapsdu/consultar/cargaInicio',
        {
          method: 'GET',
          headers: {
            usr: 'guilherme.correia',
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar cargaInicio: ${response.statusText}`);
      }

      return response.json();
    },
    staleTime: 1000 * 60 * 60, // 1 hora
  });
};