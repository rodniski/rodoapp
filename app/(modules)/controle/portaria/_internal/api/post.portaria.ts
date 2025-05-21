// api/fetchMovConferenciaEstorno.ts
import { config } from "config";
import { ConferenciaParams, EstornoParams } from "../types";

function fixMalformedJson(json: string): string {
  return json
    .replace(/}(\s*){/g, "},\n{")
    .replace(/\[\s*{/g, "[\n{")
    .replace(/}\s*]/g, "\n}]");
}

export const fetchMovConferenciaSaida = async (params: ConferenciaParams) => {
  const queryParams = new URLSearchParams({
    Sequencia: params.Sequencia,
    RespConf: params.RespConf,
  });

  const url = `${config.API_BORRACHARIA_URL}MovPortaria/ConferenciaSaida?${queryParams}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });

  const text = await response.text();
  if (!response.ok) {
    console.error("❌ fetchMovConferenciaSaida erro:", text);
    throw new Error(`Erro ao confirmar conferência: ${text}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    console.warn("⚠️ JSON malformado, tentando corrigir...");
    return JSON.parse(fixMalformedJson(text));
  }
};

export const fetchMovEstornoSaida = async (params: EstornoParams) => {
  const queryParams = new URLSearchParams({
    Sequencia: params.Sequencia,
    RespEstor: params.RespEstor,
    OrigemEst: "p",
  });

  const url = `${config.API_BORRACHARIA_URL}MovPortaria/EstornoSaida?${queryParams}`;
  console.log(url);
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
