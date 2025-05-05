// @inclusao/types/pedido-compra.ts

/** Item de um Pedido de Compra */
export interface PedidoCompraItem {
    ITEM: string
    PRODUTO: string
    QUANTIDADE: number
    VALUNIT: number
  }
  
  /** Payload para criação de Pedido de Compra */
  export interface PedidoCompraRequest {
    FILIAL: string
    FILENTREGA: string
    OPCAO: number
    CONTATO: string
    OBS: string
    PC: string
    FORNECEDOR: string
    LOJA: string
    CONDFIN: string
    TIPOPED: string
    ITENS: PedidoCompraItem[]
  }
  
  /** Resposta retornada pelo endpoint de Pedido de Compra */
  export interface PedidoCompraResponse {
    /** Indicador de sucesso da operação */
    Sucesso: boolean
    /** Mensagem de erro ou informação adicional */
    Mensagem?: string
    /** Dados adicionais (ajuste conforme o payload real da API) */
    Data?: any
  }
