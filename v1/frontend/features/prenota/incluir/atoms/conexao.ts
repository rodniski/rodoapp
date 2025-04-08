import { atom } from 'jotai';
import {Conexao} from "#/incluir/interfaces";


const initialConexao: Conexao = {
    numero: '',
    serie: '',
    dataEmissao: '',
    valorTotalDaNota: '',
    nomeEmitente: '',
    cnpjEmitente: '',
    ufEmitente: '',
    nomeDestinatario: '',
    cnpjDestinatario: '',
    ufDestinatario: '',
    informacoesAdicionais: '',
    itens: [],

    getTotalItens: () => 0,
    getValorTotal: () => 0,
    getItemByCodigo: () => undefined,
};

export const conexaoAtom = atom<Conexao>({
    ...initialConexao,
    getTotalItens: () => initialConexao.itens.length,
    getValorTotal: () => Number(initialConexao.valorTotalDaNota) || 0,
    getItemByCodigo: (codigo) => initialConexao.itens.find(item => item.codProduto === codigo),
});