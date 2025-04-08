"use client";

import React, {useEffect} from "react";
import {useCargaInicio} from "hooks";
import {toast} from "sonner";
import {useAtomValue, useSetAtom} from "jotai";
import {accessFiliaisAtom, centrosCustoAtom, condicoesPagamentoAtom, unidadeMedidaAtom,} from "atoms";
import {usernameAtom} from "%/atoms";

interface CargaInicioProviderProps {
    children: React.ReactNode;
}


export function CargaInicioProvider({children}: CargaInicioProviderProps) {
    let username = useAtomValue(usernameAtom)
    if (!username) {
        username = ''
    }
    const setUnidadeMedida = useSetAtom(unidadeMedidaAtom);
    const setCondicoesPagamento = useSetAtom(condicoesPagamentoAtom);
    const setCentrosCusto = useSetAtom(centrosCustoAtom);
    const setFiliais = useSetAtom(accessFiliaisAtom);

    // Chama o hook que busca os dados iniciais
    const {data, isError, error} = useCargaInicio(username);

    useEffect(() => {
        if (data) {
            // Atualiza os átomos com os dados retornados
            setUnidadeMedida(data.UnidadeMedida);
            setCondicoesPagamento(data.Condicoes);
            setCentrosCusto(data.CentroCusto);
            setFiliais(data.Filiais);
        }
    }, [data, setUnidadeMedida, setCondicoesPagamento, setCentrosCusto, setFiliais]);

    useEffect(() => {
        if (isError) {
            console.error("CargaInicioProvider - Erro ao carregar dados:", error);
            toast.error("Erro ao carregar os dados iniciais.");
        }
    }, [isError, error]);


    return <>{children}</>;
}
