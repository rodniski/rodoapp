// /app/(modules)/prenota/_internal/editar/config/editar.hook.ts
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import type {
  PreNotaDraft,
  PreNotaItem,
  Parcela,
  Rateio,
} from "@inclusao/types";
import { usePreNotaStore } from "@inclusao/stores";
import { config } from "config";
import {
  UsePrenotaDetailsProps,
  ProtheusErrorResponse,
  EditarPrenotaResponse,
} from "./editar.types";
import { format } from "date-fns";

export const usePrenotaDetails = ({
  usr,
  rec,
}: UsePrenotaDetailsProps): UseQueryResult<EditarPrenotaResponse, Error> => {
  const router = useRouter();

  const setHeader = usePreNotaStore((s) => s.setHeader);
  const setItens = usePreNotaStore((s) => s.setItens);
  const setParcelas = usePreNotaStore((s) => s.setParcelas);
  const addRateio = usePreNotaStore((s) => s.addRateio);
  const setModoManual = usePreNotaStore((s) => s.setModoManual);
  const clearAnexos = usePreNotaStore((s) => s.clearAnexos);

  const query = useQuery<EditarPrenotaResponse, Error>({
    queryKey: ["prenotaDetails", usr, rec],
    queryFn: async () => {
      try {
        const response = await axios.get(
          `${config.API_PRODUCTION_URL}PreNota`,
          {
            headers: {
              usr,
              rec,
              "Content-Type": "application/json",
            },
          }
        );
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const err = error as AxiosError<ProtheusErrorResponse>;
          const msg =
            err.response?.data?.message ||
            err.response?.data?.detailedMessage ||
            `Erro ${err.response?.status || "desconhecido"}`;
          throw new Error(msg);
        }
        throw new Error("Erro inesperado ao buscar dados da Pré-Nota");
      }
    },
    enabled: false,
    retry: false,
  });

  useEffect(() => {
    if (query.isSuccess && query.data) {
      const data = query.data;

      setModoManual();
      clearAnexos();

      setHeader({
        FILIAL: data.F1_FILIAL,
        OPCAO: 3,
        TIPO: data.F1_XTIPO?.trim() === "Despesa/Imobilizado" ? "C" : "N",
        FORNECEDOR: data.F1_FORNECE,
        LOJA: data.F1_LOJA,
        DOC: data.F1_DOC,
        SERIE: data.F1_SERIE?.trim(),
        OLDSERIE: data.F1_SERIE?.trim(),
        ESPECIE: "NF",
        CONDFIN: data.F1_COND,
        CHVNF: data.F1_CHVNFE?.trim(),
        USERAPP: "",
        OBS: data.F1_XOBS?.trim(),
        prioridade:
          data.F1_XPRIOR?.trim() === "Alta"
            ? "Alta"
            : data.F1_XPRIOR?.trim() === "Baixa"
            ? "Baixa"
            : data.F1_XPRIOR?.trim() === "Media" ||
              data.F1_XPRIOR?.trim() === "Média"
            ? "Media"
            : "",
        JUSTIFICATIVA: "",
        tiporodo: data.F1_XTIPO?.trim() as any,
        DTINC: data.F1_EMISSAO
          ? (`${data.F1_EMISSAO.slice(6, 8)}/${data.F1_EMISSAO.slice(
              4,
              6
            )}/${data.F1_EMISSAO.slice(
              0,
              4
            )}` as `${number}/${number}/${number}`)
          : "",
        CGCPIX: "",
        CHAVEPIX: "",
      });

      const itens = (data.ITENS ?? []).map(
        (item): PreNotaItem => ({
          ITEM: item.D1_ITEM,
          PRODUTO: item.D1_COD,
          QUANTIDADE: item.D1_QUANT,
          VALUNIT: item.D1_VUNIT,
          TOTAL: item.D1_TOTAL,
          PRODFOR: item.A5_CODPRF,
          DESCFOR: item.A5_NOMPROD,
          ORIGEMXML: "",
          PC: item.C7_NUM?.trim() ?? "",
          ITEMPC: item.C7_ITEM?.trim() ?? "",
          B1_UM: item.B1_UM,
          SEGUN: "",
          TPFATO: "",
          CONV: 1,
          ORIGEM: item.B1_ORIGEM,
          B1_DESC: item.B1_DESC,
        })
      );

      const rateios = (data.RATEIO ?? []).map(
        (r): Rateio => ({
          seq: r.Z10_ITEM,
          id: `${r.Z10_ITEM}-${r.Z10_CC}`,
          FIL: r.Z10_FILRAT,
          cc: r.Z10_CC,
          percent: r.Z10_PERC,
          valor: r.Z10_VALOR,
          REC: r.REC,
        })
      );

      const parcelas = (data.PAGAMENTOS ?? []).map(
        (p): Parcela => ({
          Parcela: p.Parcela,
          Vencimento: p.Vencimento,
          Valor: p.Valor,
        })
      );

      setItens(itens);
      setParcelas(parcelas);
      rateios.forEach((r) => addRateio(r));
    }
  }, [query.isSuccess, query.data]);

  return query;
};
