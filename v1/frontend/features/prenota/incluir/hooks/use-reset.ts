import {useSetAtom} from "jotai";
import {
    arquivosAtom,
    cgcPixAtom,
    chaveNfAtom,
    chavePixAtom,
    condFinAtom,
    dataIncAtom,
    docAtom,
    especieAtom,
    filialCodAtom,
    fornecedorAtom,
    itensAtom,
    justificativaAtom,
    lojaAtom,
    obsAtom,
    oldSerieAtom,
    opcaoAtom,
    pagamentosAtom,
    prioridadeAtom,
    rateiosAtom,
    serieAtom,
    tipoNotaAtom,
    tipoRodoAtom,
} from "#/incluir/atoms";

/**
 * Hook para resetar múltiplos átomos.
 */
export const useResetAtoms = () => {
    const resetFunctions = [
        useSetAtom(filialCodAtom),
        useSetAtom(opcaoAtom),
        useSetAtom(tipoNotaAtom),
        useSetAtom(fornecedorAtom),
        useSetAtom(lojaAtom),
        useSetAtom(docAtom),
        useSetAtom(serieAtom),
        useSetAtom(oldSerieAtom),
        useSetAtom(especieAtom),
        useSetAtom(condFinAtom),
        useSetAtom(chaveNfAtom),
        useSetAtom(obsAtom),
        useSetAtom(prioridadeAtom),
        useSetAtom(justificativaAtom),
        useSetAtom(tipoRodoAtom),
        useSetAtom(dataIncAtom),
        useSetAtom(cgcPixAtom),
        useSetAtom(chavePixAtom),
        useSetAtom(arquivosAtom),
        useSetAtom(pagamentosAtom),
        useSetAtom(rateiosAtom),
        useSetAtom(itensAtom),
    ];

    return () => {
        resetFunctions.forEach((resetFunction) => {
            // Define o valor padrão com base no tipo do átomo
            const defaultValue = Array.isArray(resetFunction()) ? [] : "";
            resetFunction(defaultValue as never); // Força a tipagem para evitar erros temporários
        });
    };
};