import {atom} from "jotai";
import {AnexoHub, Parcela, ProdutoPOST, Rateio, XmlItem} from "#/incluir/interfaces";
import {usernameAtom} from "%/atoms";
import {DadosBancarios, DadosPix} from "#/incluir/components/comboboxes";
export interface PagamentoData {
    parcelas: Parcela[];
    dadosBancarios?: DadosBancarios;
    dadosPix?: DadosPix;
}
// Átomo para armazenar os dados completos do XML
export const xmlDataAtom = atom<null | {
    itens: XmlItem[];
    cnpjEmitente: string;
    numero: string;
    serie: string;
    valorTotalDaNota: string;
    condicaoPagamento?: string;
    informacoesAdicionais?: string;
    cnpjDestinatario?: string;
    nomeEmitente?: string;
    dataEmissao?: string;
}>(null);

// Mesmo que não vamos usar para controlar a geração dos itens, o átomo permanece disponível
export const origemDadosAtom = atom<"xml" | "manual">("manual");

// Átomos de campos principais
export const filialCodAtom = atom("");
export const opcaoAtom = atom(3);
export const tipoNotaAtom = atom<"N" | "C">("N");
export const fornecedorAtom = atom("");
export const lojaAtom = atom("");
export const docAtom = atom("");
export const serieAtom = atom("");
export const oldSerieAtom = atom("");
export const especieAtom = atom("NF");
export const condFinAtom = atom("");
export const chaveNfAtom = atom("");
export const obsAtom = atom("");
export const prioridadeAtom = atom("");
export const justificativaAtom = atom("");
export const tipoRodoAtom = atom("");
export const dataIncAtom = atom("");
export const cgcPixAtom = atom("");
export const chavePixAtom = atom("");
export const userAppAtom = atom(
    (get) => get(usernameAtom),
    (_get, set, newValue: string) => set(usernameAtom, newValue)
);

// Átomos para armazenar listas
export const arquivosAtom = atom<AnexoHub[]>([]);
export const pagamentosAtom = atom<Parcela[]>([]);
export const rateiosAtom = atom<Rateio[]>([]);

/**
 Mapeamento para ProdutoPOST:
 - ITEM:       Será definido posteriormente como um sequencial de 5 dígitos.
 - PRODUTO:    Dados do pedido – B1_DESC (produto.descricao).
 - QUANTIDADE: Vem da XML – Number(xmlItem.quantidade); se não houver XML, fica 0.
 - VALUNIT:    Vem da XML – Number(xmlItem.valorUnitario); se não houver XML, fica 0.
 - PRODFOR:    Vem da XML – xmlItem.codProduto; se não houver XML, fica em branco.
 - DESCFOR:    Vem da XML – xmlItem.descProduto; se não houver XML, fica em branco.
 - ORIGEMXML:  Vem da XML – xmlItem.origem; se não houver XML, fica em branco.
 - TOTAL:      Vem da XML – Number(xmlItem.valorTotal); se não houver XML, pega do manual.
 - PC:         Dados do pedido – C7_NUM (produto.pedidoNumero).
 - ITEMPC:     Dados do pedido – C7_ITEM (produto.itemPedido).
 - B1_UM:      Dados do pedido – B1_UM (produto.unidade).
 - SEGUN, TPFATO e CONV: Conversão (ainda pendente; CONV default 1).
 - ORIGEM:     Dados do pedido – B1_ORIGEM (produto.origem).
 **/

// Átomo derivado que agrega os itens para a tabela.
// Para cada produto do pedido, se houver xmlData, tenta encontrar os xmlItems correspondentes;
// se não encontrar, ou se não houver xmlData, gera o item com os campos da XML em branco.
export const itensAtom = atom<ProdutoPOST[]>([]);

// Átomo derivado para compor o JSON final da aplicação
export const hubAtom = atom((get) => ({
    FILIAL: get(filialCodAtom),
    OPCAO: get(opcaoAtom),
    TIPO: get(tipoNotaAtom),
    FORNECEDOR: get(fornecedorAtom),
    LOJA: get(lojaAtom),
    DOC: get(docAtom),
    SERIE: get(serieAtom),
    OLDSERIE: get(oldSerieAtom),
    ESPECIE: get(especieAtom),
    CONDFIN: get(condFinAtom),
    CHVNF: get(chaveNfAtom),
    USERAPP: get(userAppAtom),
    OBS: get(obsAtom),
    prioridade: get(prioridadeAtom),
    JUSTIFICATIVA: get(justificativaAtom),
    tiporodo: get(tipoRodoAtom),
    DTINC: get(dataIncAtom),
    CGCPIX: get(cgcPixAtom),
    CHAVEPIX: get(chavePixAtom),
    ARQUIVOS: get(arquivosAtom),
    PAGAMENTOS: get(pagamentosAtom),
    RATEIOS: get(rateiosAtom),
    itens: get(itensAtom)
}));
