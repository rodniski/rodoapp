// api/movPortaria.ts
import { config } from "logic";
import {
  ConferenciaParams,
  EstornoParams,
  PortariaParams,
} from "../types";

type MovPortariaType =
  | "portaria"
  | "conferenciaSaida"
  | "estornoSaida";

type ParamsType =
  | PortariaParams
  | ConferenciaParams
  | EstornoParams

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
    case "portaria":
    {
      const movParams = params as PortariaParams

      queryParams.append("Page", movParams.Page.toString());
			queryParams.append("PageSize", movParams.PageSize.toString());
			queryParams.append("Filial", movParams.Filial.toString());
			
      if (type === "portaria" && "Conferido" in movParams) {
        queryParams.append("Conferido", movParams.Conferido);
      }
      
      const endpointMap = {portaria: "Portaria"};

      endpoint = endpointMap[type];
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
      console.log("❌ Erro na requisição POST:", {
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
        console.log("Não foi possível analisar JSON mesmo após correção", {
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
      console.log("❌ Erro na requisição GET:", {
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
        console.log("Não foi possível analisar JSON mesmo após correção", {
          originalError: parseError,
          finalParseError,
          fixedJsonString,
        });
        throw finalParseError;
      }
    }
  }
};

