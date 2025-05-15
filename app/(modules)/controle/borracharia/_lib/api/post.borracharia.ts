import { config } from "config";
import axios from "axios";

export interface CarregaSaidaParams {
  Filial: string;
  Origem: "S" | "E"; // Saída ou Entrada
  Doc: string;
  Serie: string;
  CodCliente: string;
  Loja: string;
  ProdutoCod: string;
  Item: string;
  Retirado: string;
  RespRet: string;
  Placa: string;
  Obs?: string;
  RespCarreg: string;
  Quantidade: number;
}

export async function carregaSaida(params: CarregaSaidaParams): Promise<any> {
  const baseURL = config.API_BORRACHARIA_URL;

  const queryString = new URLSearchParams({
    Filial: params.Filial,
    Origem: params.Origem,
    Doc: params.Doc,
    Serie: params.Serie,
    CodCliente: params.CodCliente,
    Loja: params.Loja,
    ProdutoCod: params.ProdutoCod,
    Item: params.Item,
    Retirado: params.Retirado,
    RespRet: params.RespRet,
    Placa: params.Placa,
    Obs: params.Obs ?? "",
    RespCarreg: params.RespCarreg,
    Quantidade: params.Quantidade.toString(),
  });

  const url = `${baseURL}MovPortaria/CarregaSaida?${queryString.toString()}`;

  const response = await axios.post(
    url,
    {},
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}