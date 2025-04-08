// app/prenotas/page.tsx (ou o caminho correto para sua página)
"use client"; // Necessário para useState, useMemo, useQuery

import React, {useMemo, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {type PaginationState} from "@tanstack/react-table"; // Importa o tipo
// Importe seus componentes e definições (ajuste os paths conforme sua estrutura)
// Assume que 'ui' exporta seu DataTable adaptado para server-side
import {DataTable} from "#/dashboard/components/datatable"
// Importa as definições de coluna
import {columns} from "#/dashboard"

// Importa a Server Action (ajuste o path !)
import {getPrenotasServerAction} from '!/app/actions/prenotaActions';

// Componente da Página
export function PrenotasPage() {
    // Estado para controlar a paginação (índice baseado em 0)
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0, // Página inicial é 0
        pageSize: 25, // Quantidade de itens por página (ajuste conforme preferir)
    });

    // Monta os parâmetros para a Server Action de forma memoizada
    const fetchParams = useMemo(() => ({
        page: pagination.pageIndex + 1, // Server Action espera página baseada em 1
        perPage: pagination.pageSize,
    }), [pagination.pageIndex, pagination.pageSize]);

    // Busca os dados usando TanStack Query e a Server Action
    const {
        data: queryResult, // Renomeia data para evitar conflito
        isLoading,
        isError,
        error,
        refetch,
        isRefetching,
        isPlaceholderData, // Útil para UX durante refetch de paginação
    } = useQuery({
        // Chave da query: identifica unicamente esta busca.
        // Inclui os parâmetros de paginação para que a query seja refeita quando eles mudarem.
        queryKey: ['prenotas', fetchParams],
        // A função que será executada para buscar os dados
        queryFn: () => getPrenotasServerAction(fetchParams),
        // Mantém os dados da página anterior visíveis enquanto carrega a próxima (melhora UX)
        placeholderData: (previousData) => previousData,
        // Opcional: Configura por quanto tempo os dados são considerados "frescos"
        // staleTime: 1000 * 60 * 1, // Ex: 1 minuto
    });

    // Calcula o número total de páginas (necessário para o componente de paginação)
    // Arredonda para cima para incluir a última página parcial, se houver.
    const pageCount = useMemo(() => {
        const total = queryResult?.total ?? 0;
        const size = pagination.pageSize;
        return total > 0 && size > 0 ? Math.ceil(total / size) : 0;
    }, [queryResult?.total, pagination.pageSize]);

    // Memoiza os dados a serem passados para a tabela (ou array vazio se não houver)
    const tableData = useMemo(() => queryResult?.data ?? [], [queryResult?.data]);

    // Renderiza estado de erro
    if (isError) {
        return (
            <div className="container mx-auto py-10 px-4 text-red-600">
                <p className="mb-2">Erro ao carregar dados das pré-notas:</p>
                <pre className="text-sm bg-red-100 p-2 rounded mb-4">
                    {(error instanceof Error) ? error.message : 'Erro desconhecido'}
                </pre>
                <button
                    onClick={() => refetch()}
                    className="px-4 py-2 border rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                    Tentar Novamente
                </button>
            </div>
        );
    }

    // Renderiza a página com a DataTable
    return (
        // Adapte o container/layout conforme seu projeto
        <div className="container mx-auto py-6 lg:py-10 px-4 h-full flex flex-col">
            {/* Título da Página */}
            <h1 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6">
                Pré-Notas
            </h1>

            {/* Container da DataTable para ocupar espaço vertical */}
            <div className="flex-1 overflow-hidden  rounded-md shadow-sm"> {/* Adicionado border/shadow */}
                <DataTable
                    columns={columns}
                    data={tableData}
                    // Passa estados de loading/refetching
                    isLoading={isLoading && !isPlaceholderData} // Mostra loading apenas na carga inicial
                    isRefetching={isRefetching}
                    onRefetch={refetch} // Conecta o botão de refresh da toolbar

                    // --- Passa props para Paginação Server-Side ---
                    pageCount={pageCount} // Total de páginas calculado
                    pagination={pagination} // Estado de paginação atual
                    onPaginationChange={setPagination} // Função para atualizar o estado de paginação
                />
            </div>
        </div>
    );
}