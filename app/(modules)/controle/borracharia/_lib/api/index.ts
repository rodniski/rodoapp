// api/movPortaria.ts
import { config } from "config";
import {
  BorrachariaParams,
  ConferenciaParams,
  EstornoParams,
  HistoricoParams,
  ItemNFParams,
  PortariaParams,
} from "../types";

type MovPortariaType =
  | "borracharia"
  | "portaria"
  | "historico"
  | "listaItensNF"
  | "grupoFilial"
  | "conferenciaSaida"
  | "estornoSaida";

type ParamsType =
  | PortariaParams
  | BorrachariaParams
  | HistoricoParams
  | ItemNFParams
  | { Usuario: string }
  | ConferenciaParams
  | EstornoParams;

function fixMalformedJson(jsonString: string): string {
  // Replace multiple consecutive objects without commas
  return jsonString
    .replace(/}(\s*){/g, "},\n{")
    .replace(/\[\s*{/g, "[\n{")
    .replace(/}\s*]/g, "\n}]");
}

export const fetchMovPortaria = async (
    type: MovPortariaType,
    params: ParamsType,
    usePost: boolean = false // flag para definir se deve usar POST
) => {
  console.log("🚀 Iniciando fetchMovPortaria:", { type, params, usePost });

  let queryParams = new URLSearchParams();
  let endpoint = "";

  // Montagem dos parâmetros e definição do endpoint
  switch (type) {
    case "borracharia":
    case "portaria":
    case "historico": {
      const movParams = params as
          | PortariaParams
          | BorrachariaParams
          | HistoricoParams;
      queryParams.append("Page", movParams.Page.toString());
      if ("Filial" in movParams && movParams.Filial) {
        queryParams.append("Filial", movParams.Filial.toString());
      }
      if (type === "portaria" && "Conferido" in movParams) {
        queryParams.append("Conferido", movParams.Conferido);
      }
      if ("PageSize" in movParams) {
        queryParams.append("PageSize", movParams.PageSize.toString());
      }
      const endpointMap = {
        borracharia: "Borracharia",
        portaria: "Portaria",
        historico: "Historico",
      };
      endpoint = endpointMap[type];
      break;
    }
    case "listaItensNF": {
      const itensParams = params as ItemNFParams;
      queryParams = new URLSearchParams({
        Filial: itensParams.Filial.toString(),
        Doc: itensParams.Doc.toString(),
        Serie: itensParams.Serie.toString(),
        CodCliente: itensParams.CodCliente.toString(),
        Loja: itensParams.Loja.toString(),
      });
      endpoint = "ListaItensNF";
      break;
    }
    case "conferenciaSaida": {
      const confParams = params as ConferenciaParams;
      // Se for POST, os dados serão enviados no corpo
      // Se for GET, podemos enviar via query string
      queryParams.append("Sequencia", confParams.Sequencia);
      queryParams.append("RespConf", confParams.RespConf);
      endpoint = "ConferenciaSaida";
      break;
    }
    case "estornoSaida": {
      const estornoParams = params as EstornoParams;
      queryParams.append("Sequencia", estornoParams.Sequencia);
      queryParams.append("RespEstor", estornoParams.RespEstor);
      // Mesmo que "OriEstorno" seja fixo, pode ser enviado tanto via query quanto no body
      queryParams.append("OriEstorno", "p");
      endpoint = "EstornoSaida";
      break;
    }
    case "grupoFilial": {
      const userParams = params as { Usuario: string };
      queryParams.append("Usuario", userParams.Usuario);
      endpoint = "GrupoFilial";
      break;
    }
    default:
      throw new Error(`Endpoint não suportado: ${type}`);
  }

  // Monta a URL base
  const baseUrl = `${config.API_BORRACHARIA_URL}MovPortaria/${endpoint}`;

  // Se for para usar POST, envia os dados no corpo
  if (usePost) {
    console.log("📡 Enviando via POST");
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Erro na requisição POST:", {
        status: response.status,
        statusText: response.statusText,
        errorText,
        type,
        endpoint,
      });
      throw new Error(`Erro ao realizar operação ${type}: ${errorText}`);
    }
    const responseText = await response.text();
    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      const fixedJsonString = fixMalformedJson(responseText);
      try {
        return JSON.parse(fixedJsonString);
      } catch (finalParseError) {
        console.error("Não foi possível analisar JSON mesmo após correção", {
          originalError: parseError,
          finalParseError,
          fixedJsonString,
        });
        throw finalParseError;
      }
    }
  } else {
    // Se não for POST, envia via GET com query string
    const url = `${baseUrl}?${queryParams.toString()}`;
    console.log("🌐 URL Construída:", url);
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Erro na requisição GET:", {
        status: response.status,
        statusText: response.statusText,
        errorText,
        type,
        endpoint,
      });
      throw new Error(`Erro ao realizar operação ${type}: ${errorText}`);
    }
    const responseText = await response.text();
    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      const fixedJsonString = fixMalformedJson(responseText);
      try {
        return JSON.parse(fixedJsonString);
      } catch (finalParseError) {
        console.error("Não foi possível analisar JSON mesmo após correção", {
          originalError: parseError,
          finalParseError,
          fixedJsonString,
        });
        throw finalParseError;
      }
    }
  }
};

