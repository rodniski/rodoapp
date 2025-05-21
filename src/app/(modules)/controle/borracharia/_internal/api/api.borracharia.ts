// api/api.borracharia.ts
import { config } from "config";
import { BorrachariaParams} from "../types";

type MovBorrachariaType = "borracharia";
type ParamsType = BorrachariaParams;

function fixMalformedJson(jsonString: string): string {
  // Replace multiple consecutive objects without commas
  return jsonString
    .replace(/}(\s*){/g, "},\n{")
    .replace(/\[\s*{/g, "[\n{")
    .replace(/}\s*]/g, "\n}]");
}

export const fetchMovBorracharia = async (
    type: MovBorrachariaType,
    params: ParamsType,
    usePost: boolean = false // flag para definir se deve usar POST
) => {
  console.log("🚀 Iniciando fetchMovBorracharia:", { type, params, usePost });

  let queryParams = new URLSearchParams();
  let endpoint = "";

  // Montagem dos parâmetros e definição do endpoint
  switch (type) {
    case "borracharia":
   {
      const movParams = params as BorrachariaParams;

      queryParams.append("Page", movParams.Page.toString());
      queryParams.append("PageSize", movParams.PageSize.toString());
      queryParams.append("Filial", movParams.Filial.toString());

      if ("Doc" in movParams && movParams.Doc) {
        queryParams.append("Doc", movParams.Doc.toString());
      } 
      if ("Serie" in movParams && movParams.Serie) {
        queryParams.append("Serie", movParams.Serie.toString());
      }  
      if ("CodCliente" in movParams && movParams.CodCliente) {  
        queryParams.append("CodCliente", movParams.CodCliente.toString());
      }
      if ("Loja" in movParams && movParams.Loja) {
        queryParams.append("Loja", movParams.Loja.toString());
      }
      if ("DescCliente" in movParams && movParams.DescCliente) {
        queryParams.append("DescCliente", movParams.DescCliente.toString());
      }
      if ("ProdutoCod" in movParams && movParams.ProdutoCod) {
        queryParams.append("ProdutoCod", movParams.ProdutoCod.toString());
      }
      if ("ProdutoDesc" in movParams && movParams.ProdutoDesc) {
        queryParams.append("ProdutoDesc", movParams.ProdutoDesc.toString());
      }
      if ("DataEmissao" in movParams && movParams.DataEmissao) {
        const { from, to } = movParams.DataEmissao as { from: string; to: string };
        
        queryParams.append("Dataini", from.replaceAll("-", ""));
        queryParams.append("datafim", to.replaceAll("-", ""));
      }

      const endpointMap = { borracharia: "Borracharia" };

      endpoint = endpointMap[type];
      break;
    }
    default:
      throw new Error(`Endpoint não suportado: ${type}`);
  }

  // Monta a URL base
  const baseUrl = `${config.API_BORRACHARIA_URL}MovPortaria/${endpoint}`;

  if (usePost) {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: queryParams.toString(),
    }); 
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
}

