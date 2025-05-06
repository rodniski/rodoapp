// api/pedido-compra.ts
import axios from "axios";
import { config } from "config";
import type {
  PedidoCompraRequest,
  PedidoCompraResponse,
} from "..";

const PEDIDO_COMPRA_URL = `${config.API_DEVELOPMENT_URL}restPedidoDeCompra/PedidoCompra`;

/**
 * Envia dados de um novo Pedido de Compra ao endpoint Protheus
 * @param payload Dados do pedido de compra
 */
export async function postPedidoCompra(
  payload: PedidoCompraRequest
): Promise<PedidoCompraResponse> {
  // Back espera text/plain com JSON no body
  const { data } = await axios.request<PedidoCompraResponse>({
    method: "get",
    url: PEDIDO_COMPRA_URL,
    headers: { "Content-Type": "text/plain" },
    data: JSON.stringify(payload),
  });
  return data;
}
