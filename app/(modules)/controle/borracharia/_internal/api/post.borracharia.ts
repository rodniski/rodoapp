
// /lib/api/carregaSaida.ts
import type { EstornoParams } from "@portaria/types";
import { config } from "logic";
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

function fixMalformedJson(json: string): string {
  return json
    .replace(/}(\s*){/g, "},\n{")
    .replace(/\[\s*{/g, "[\n{")
    .replace(/}\s*]/g, "\n}]");
}

export const fetchMovEstornoSaida = async (params: EstornoParams) => {
  const queryParams = new URLSearchParams({
    Sequencia: params.Sequencia,
    RespEstor: params.RespEstor,
    OrigemEst: "b",
  });

  const url = `${config.API_BORRACHARIA_URL}MovPortaria/EstornoSaida?${queryParams}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });

  const text = await response.text();
  if (!response.ok) {
    console.error("❌ fetchMovEstornoSaida erro:", text);
    throw new Error(`Erro ao rejeitar entrega: ${text}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    console.warn("⚠️ JSON malformado, tentando corrigir...");
    return JSON.parse(fixMalformedJson(text));
  }
};