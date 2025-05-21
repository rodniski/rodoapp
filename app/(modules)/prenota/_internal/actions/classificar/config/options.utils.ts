// /app/(modules)/prenota/_internal/actions/classificar/config/options.utils.ts
import type { ProdutoClassificacao } from "@prenota/actions";

export function applyCombustivelDefaults(
  itens: ProdutoClassificacao[]
): ProdutoClassificacao[] {
  return itens.map((it) => {
    const cod = it.COD.trim().toUpperCase();
    const isCombustivel = cod === "5021" || cod === "5021S";

    return isCombustivel
      ? {
          ...it,
          NATUREZA: "2010050",
          TIPO_OP: "57",
          _locked: true,
        }
      : it;
  });
}
