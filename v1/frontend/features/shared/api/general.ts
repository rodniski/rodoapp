import { AccessFilial, CargaInicioData, UnidadeMedida, CondicaoPagamento, CentroCusto } from "types";
import {config} from "config";

export async function fetchCargaInicio(username: string): Promise<CargaInicioData> {
  const cleanUsername = username.replace(/^"+|"+$/g, ""); // Remove aspas extras
  const headers = new Headers();
  headers.append("Content-Type", "application/json");
  headers.append("usr", cleanUsername); // Use o username sem aspas extras

  console.log("Headers enviados na requisição:", Object.fromEntries(headers.entries()));

  const response = await fetch(
    `${config.API_PRODUCTION_URL}reidoapsdu/consultar/cargaInicio`,
    { method: "GET", headers }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error("Resposta com erro:", error);
    throw new Error(`Erro na API: ${response.statusText}`);
  }

  const data = await response.json();
  console.log("Dados retornados da API:", data);

  return {
    UnidadeMedida:
      data.UnidadeMedida?.map((um: UnidadeMedida) => ({
        ...um,
        UM: um.UM.trim(),
        DESCRICAO: um.DESCRICAO.trim(),
        DESC: um.DESC.trim(),
      })) || [],
    Condicoes:
      data.Condicoes?.map((cond: CondicaoPagamento) => ({
        ...cond,
        E4_CODIGO: cond.E4_CODIGO.trim(),
        E4_DESCRI: cond.E4_DESCRI.trim(),
        Desc: cond.Desc.trim(),
      })) || [],
    CentroCusto:
      data.CentoCusto?.map((cc: CentroCusto) => ({
        ...cc,
        CTT_CUSTO: cc.CTT_CUSTO.trim(),
        CTT_DESC01: cc.CTT_DESC01.trim(),
        DESC: cc.DESC.trim(),
      })) || [],
    Filiais:
      data.Filiais?.map((filial: AccessFilial) => ({
        M0_CODFIL: filial.M0_CODFIL.trim(),
        M0_FILIAL: filial.M0_FILIAL.trim(),
        M0_CGC: filial.M0_CGC.trim(),
      })) || [],
  };
}
