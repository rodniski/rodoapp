// /lib/api/fetchItensNF.ts

import { config } from "config";
import axios from "axios";
import { ItemNFParams } from "../types";

export async function fetchItensNF(params: ItemNFParams): Promise<any> {
  const baseURL = config.API_BORRACHARIA_URL;

  const queryString = new URLSearchParams({
    Filial: params.Filial,
    Doc: params.Doc,
    Serie: params.Serie,
    CodCliente: params.CodCliente,
    Loja: params.Loja,
  });

  const url = `${baseURL}MovPortaria/ListaItensNF?${queryString.toString()}`;

  const response = await axios.get(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
}
