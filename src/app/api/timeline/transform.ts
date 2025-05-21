import type { FullTimelineSqlRow, TimelineEvento, TimelineMarco } from ".";

export function mapFullTimelineToEventos(
  rows: FullTimelineSqlRow[]
): TimelineEvento[] {
  if (!rows.length) return [];

  const first = rows[0];
  const eventos: TimelineEvento[] = [];

  /* 1 ▸ Pedido --> NF emitida */
  if (first.PEDIDO && first.EMISSAO_PEDIDO && first.EMISSAO_NF) {
    eventos.push({
      tipo: "pedido_nfEmitida",
      codigo: first.PEDIDO,
      nome: first.USUARIO_PEDIDO ?? "",
      obs: first.OBS_PEDIDO?.trim(),
      inicio: first.EMISSAO_PEDIDO,
      fim: first.EMISSAO_NF?.trim() || "",
      status: "concluido",
    });
  }

  /* 2 ▸ NF emitida --> NF recebida */
  if (first.EMISSAO_NF && first.DATA_LANCAMENTO_REAL) {
    eventos.push({
      tipo: "nfEmitida_recebida",
      codigo: `${first.NOTA}-${first.SERIE}`,
      nome: first.FORNECEDOR ?? "",
      inicio: first.EMISSAO_NF,
      fim: first.DATA_LANCAMENTO_REAL?.trim() || "",
      status: "concluido",
    });
  }

  /* 3 ▸ NF recebida --> Classificada */
  const marcosZ05: TimelineMarco[] = rows
    .filter((r) => r.CAMPO && r.CAMPO !== "XX")
    .map((r) => ({
      campo: r.CAMPO!,
      valor: r.OBSERVACAO_HISTORICO?.trim(),
      data: r.DATA_HISTORICO ?? "",
      usuario: r.USUARIO_HISTORICO ?? "",
    }));

  if (first.DATA_LANCAMENTO_REAL) {
    eventos.push({
      tipo: "recebida_classificada",
      codigo: `${first.NOTA}-${first.SERIE}`,
      nome: first.USUARIO_LANCAMENTO ?? "",
      obs: first.OBS_COMPLEMENTAR?.trim(),
      inicio: first.DATA_LANCAMENTO_REAL,
      fim: first.DATA_CLASSIFICACAO?.trim() || "",
      status: first.DATA_CLASSIFICACAO ? "concluido" : "in-progress",
      marcos: marcosZ05,
    });
  }

  /* 4 ▸ NF emitida --> Pagamento / Vencimento */
  const parcelas: TimelineMarco[] = rows
    .filter((r) => r.VENCIMENTO)
    .map((r) => ({
      campo: `Parc. ${r.NUMERO_PARCELA}`,
      valor: r.VALOR_PARCELA?.toFixed(2),
      data: r.VENCIMENTO!,
      usuario: r.USUARIO_HISTORICO ?? "",
    }));

  if (first.EMISSAO_NF && first.VENCIMENTO) {
    eventos.push({
      tipo: "nfEmitida_pago",
      codigo: `${first.NOTA}-${first.SERIE}`,
      nome: first.FORNECEDOR ?? "",
      inicio: first.EMISSAO_NF,
      fim: first.DATA_BAIXA?.trim() || "",
      status: first.DATA_BAIXA ? "concluido" : "in-progress",
      marcos: parcelas,
    });
  }

  return eventos;
}
