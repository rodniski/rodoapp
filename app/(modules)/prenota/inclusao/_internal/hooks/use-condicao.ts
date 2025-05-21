import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import {
  getCondicaoPagamentoSimples,
  type CondicaoPagamentoParams,
  type CondicaoPagamentoResponse,
} from "@inclusao/api";
import { usePreNotaStore, usePreNotaAuxStore } from "@inclusao/stores";

const condKey = (p: CondicaoPagamentoParams | null) => [
  "condicao-pagamento",
  p,
];

/* ------- utilitário anti-trailing-comma ------- */
const fixTrailingCommas = (txt: string) =>
  txt.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]");

export function useCondicaoPagamento(
  explicitParams?: CondicaoPagamentoParams | null
) {
  const header   = usePreNotaStore((s) => s.draft.header);
  const valorNF  = usePreNotaAuxStore((s) => s.totalNf.valorTotalXml);
  const setData  = usePreNotaAuxStore((s) => s.condicaoPagamento.setData);

  /* ---------- LOG de diagnóstico ---------- */
  console.debug("[useCondPag] header.CONDFIN:", header.CONDFIN);
  console.debug("[useCondPag] header.DTINC  :", header.DTINC);
  console.debug("[useCondPag] valorNF       :", valorNF);

  /* ---------- monta parâmetros ------------ */
  const params: CondicaoPagamentoParams | null = useMemo(() => {
    if (explicitParams !== undefined) return explicitParams;

    if (!header.CONDFIN || !header.DTINC || !valorNF) {
      return null;
    }

    return {
      valor: valorNF,
      condpag: header.CONDFIN,
      dtemissao: header.DTINC,
      codForn: header.FORNECEDOR,
      lojaForn: header.LOJA,
    };
  }, [explicitParams, header, valorNF]);

  useEffect(() => {
    if (params) {
      console.table([params]); // array de 1 objeto = colunas bonitas
    } else {
      console.info("useCondicaoPagamento → params = null");
    }
  }, [params]);

  const query = useQuery<CondicaoPagamentoResponse, Error>({
    queryKey: condKey(params),
    enabled: !!params,
    queryFn: async () => {
      const rawResp: unknown = await getCondicaoPagamentoSimples(
        params as CondicaoPagamentoParams
      );
      console.debug("[CondPag hook] 🔙 resposta bruta:", rawResp);

      let parsed: CondicaoPagamentoResponse;

      if (typeof rawResp === "string") {
        try {
          parsed = JSON.parse(rawResp);
        } catch {
          console.warn(
            "[CondPag hook] ⚠️ JSON inválido, corrigindo trailing commas"
          );
          parsed = JSON.parse(fixTrailingCommas(rawResp));
        }
      } else if (typeof rawResp === "object" && rawResp !== null) {
        parsed = rawResp as CondicaoPagamentoResponse;
      } else {
        throw new Error("Formato inesperado da resposta da Condição");
      }

      console.debug("[CondPag hook] ✅ objeto final:", parsed);
      return parsed;
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (query.data) setData(query.data);
  }, [query.data, setData]);

  return query;
}
