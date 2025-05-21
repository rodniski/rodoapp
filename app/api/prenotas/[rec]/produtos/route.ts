import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export interface ProdutoPrenota {
  ITEM: number;
  COD: string;
  DESCRICAO: string; // alias novo
  UM: string;
  QTDE: number;
  TOTAL: number;
  GRUPO: string;
  ORIGEM: string;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { rec: string } }
) {
  const rec = Number(params.rec);
  if (isNaN(rec)) {
    return NextResponse.json({ error: "REC inválido." }, { status: 400 });
  }

  const rows = await prisma.$queryRaw<ProdutoPrenota[]>`
    SELECT
      SD1.D1_ITEM   AS ITEM,
      SD1.D1_COD    AS COD,
      SB1.B1_DESC   AS DESCRICAO,     -- alias sem conflito
      SD1.D1_UM     AS UM,
      SD1.D1_QUANT  AS QTDE,
      SD1.D1_TOTAL  AS TOTAL,
      SB1.B1_GRUPO  AS GRUPO,
      SB1.B1_ORIGEM AS ORIGEM
    FROM SD1010 SD1 WITH (NOLOCK)
    INNER JOIN SF1010 SF1 WITH (NOLOCK)
      ON SF1.F1_FILIAL  = SD1.D1_FILIAL
     AND SF1.F1_DOC     = SD1.D1_DOC
     AND SF1.F1_SERIE   = SD1.D1_SERIE
     AND SF1.F1_FORNECE = SD1.D1_FORNECE
     AND SF1.F1_LOJA    = SD1.D1_LOJA
     AND SF1.R_E_C_N_O_ = ${rec}        -- ← binding seguro
     AND SF1.D_E_L_E_T_ <> '*'
    INNER JOIN SB1010 SB1 WITH (NOLOCK)
      ON SB1.B1_COD = SD1.D1_COD
     AND SB1.D_E_L_E_T_ <> '*'
    WHERE SD1.D_E_L_E_T_ <> '*'
    ORDER BY SD1.D1_ITEM;
  `;

  await prisma.$disconnect();
  return NextResponse.json(rows, { status: 200 });
}
