"use client"

import { columns, usePreNotas } from "#/dashboard"
import { DataTable } from "#/dashboard/components/datatable"
import { useBreadcrumbs } from "lib"
import { useCallback, useEffect, useState } from "react"
import type { PreNota } from "#/dashboard/interfaces"
import { useAtomValue } from "jotai"
import { usernameAtom } from "%/atoms"

const Page = () => {
    const { setBreadcrumbs } = useBreadcrumbs()
    const [notas, setNotas] = useState<PreNota[]>([])
    const [isRefetching, setIsRefetching] = useState(false)
    const username = useAtomValue(usernameAtom) || ""

    const { data, isLoading, refetch: apiRefetch, isFetching } = usePreNotas(username)

    // Atualiza as notas quando os dados mudam
    useEffect(() => {
        if (data?.prenotasFiltradas?.length) {
            setNotas((prevNotas) => {
                const existingIds = new Set(prevNotas.map((nota) => nota.Rec))
                const novasPrenotas = data.prenotasFiltradas.filter((nota) => !existingIds.has(nota.Rec))
                return [...prevNotas, ...novasPrenotas]
            })
        }
    }, [data])

    // Configura os breadcrumbs
    useEffect(() => {
        setBreadcrumbs([
            { label: "RodoApp", href: "/central" },
            { label: "Pré Notas", href: "/central/prenota" },
            { label: "Dashboard" },
        ])
    }, [setBreadcrumbs])

    // Função para atualizar os dados
    const handleRefetch = useCallback(async () => {
        setIsRefetching(true)
        try {
            if (apiRefetch) {
                // Chama refetch sem opções inválidas
                const result = await apiRefetch()
                if (result?.data?.prenotasFiltradas) {
                    // Atualiza diretamente com os novos dados
                    setNotas(result.data.prenotasFiltradas)
                } else {
                    console.warn("Nenhum dado retornado pelo refetch")
                }
            }
        } catch (error) {
            console.error("Erro ao atualizar dados:", error)
        } finally {
            setIsRefetching(false)
        }
    }, [apiRefetch])

    return (
        <div className="flex bg-muted/30 flex-col justify-start w-full h-[calc(100vh-60px)] lg:overflow-hidden p-10">
            <DataTable
                columns={columns}
                data={notas}
                isLoading={isLoading || isFetching}
                onRefetch={handleRefetch}
                isRefetching={isRefetching}
            />
        </div>
    )
}

export default Page