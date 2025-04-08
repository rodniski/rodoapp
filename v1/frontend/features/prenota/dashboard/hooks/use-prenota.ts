// hooks/use-prenota.ts
"use client"; // Hooks que usam useState/useEffect/useMemo precisam ser client-side

import {useMemo, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {type PaginationState} from "@tanstack/react-table";

// Importe a Server Action e tipos necessários (ajuste os paths!)
import {getPrenotasServerAction} from '!/app/actions/prenotaActions';

// Interface para as opções do hook (pode ser expandida com filtros, ordenação, etc.)
interface UsePrenotaOptions {
    initialPageSize?: number;
}

// O Hook Dedicado
export function usePrenota({initialPageSize = 25}: UsePrenotaOptions = {}) {
    // Estado interno do hook para controlar a paginação
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0, // Página inicial é 0
        pageSize: initialPageSize,
    });

    // Memoiza os parâmetros para a Server Action, dependendo da paginação
    const fetchParams = useMemo(() => ({
        page: pagination.pageIndex + 1, // Converte para página base 1
        perPage: pagination.pageSize,
    }), [pagination.pageIndex, pagination.pageSize]);

    // Busca os dados usando TanStack Query
    const query = useQuery({
        queryKey: ['prenotas', fetchParams], // Chave depende dos parâmetros
        queryFn: () => getPrenotasServerAction(fetchParams),
        placeholderData: (previousData) => previousData, // Mantém dados antigos durante fetch
        // staleTime: 1000 * 60 * 1, // Opcional: Cache
    });

    // Calcula o número total de páginas de forma memoizada
    const pageCount = useMemo(() => {
        const total = query.data?.total ?? 0;
        const size = pagination.pageSize;
        return total > 0 && size > 0 ? Math.ceil(total / size) : 0;
    }, [query.data?.total, pagination.pageSize]);

    // Prepara os dados para a tabela de forma memoizada
    const tableData = useMemo(() => query.data?.data ?? [], [query.data?.data]);

    // Retorna tudo que o componente de UI precisa
    return {
        // Estado de Paginação e Setter
        pagination,
        setPagination,

        // Dados e Estado da Query
        tableData,
        queryResult: query.data, // Resultado completo da query, se necessário
        isLoading: query.isLoading && !query.isPlaceholderData, // Loading inicial
        isError: query.isError,
        error: query.error,
        refetch: query.refetch,
        isRefetching: query.isRefetching,
        isPlaceholderData: query.isPlaceholderData,

        // Informações Calculadas
        pageCount,
        totalRows: query.data?.total ?? 0, // Total de registros
    };
}