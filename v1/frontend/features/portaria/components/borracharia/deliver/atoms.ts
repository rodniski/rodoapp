// atoms.ts (ou onde você guarda seus átomos)
import {atom} from 'jotai';
import {ItemNF} from "@/types";

export const filialBorrAtom = atom<string>(""); // Filial (ex: "0101")
export const origemBorrAtom = atom<string>("S"); // Origem (fixo "S"?)
export const docBorrAtom = atom<string>("");    // Documento (NF)
export const serieBorrAtom = atom<string>("");   // Série da NF
export const codClienteBorrAtom = atom<string>(""); // Código do Cliente
export const lojaBorrAtom = atom<string>("");    // Loja do Cliente
export const produtoCodBorrAtom = atom<string>(""); // Código do Produto
export const itemBorrAtom = atom<string>("");     // Item (sequencial)
export const retiradoBorrAtom = atom<string>("C"); // Retirado (fixo "C"?)
export const respRetBorrAtom = atom<string>("");  // Responsável pela Retirada
export const placaBorrAtom = atom<string>("");    // Placa do Veículo
export const obsBorrAtom = atom<string>("");      // Observações
export const respCarregBorrAtom = atom<string>(""); // Responsável pelo Carregamento
export const quantidadeBorrAtom = atom<number>(0);  // Quantidade

export const paramsAtom = atom((get) => ({
    Filial: get(filialBorrAtom),
    Doc: get(docBorrAtom),
    Serie: get(serieBorrAtom),
    CodCliente: get(codClienteBorrAtom),
    Loja: get(lojaBorrAtom),
    ProdutoCod: get(produtoCodBorrAtom),
    Item: get(itemBorrAtom),
    Retirado: get(retiradoBorrAtom),
    RespRet: get(respRetBorrAtom),
    Placa: get(placaBorrAtom),
    Obs: get(obsBorrAtom),
    RespCarreg: get(respCarregBorrAtom),
    Quantidade: get(quantidadeBorrAtom),
}));

export const selectedItemsBorrAtom = atom<ItemNF[]>([]);