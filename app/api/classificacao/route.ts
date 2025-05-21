/* app/api/classificacao/metadata/route.ts ---------------------------*/
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/server/prisma";

export interface Natureza {
  COD: string;
  DESCR: string;
}
export interface TipoOper {
  COD: string;
  DESCR: string;
}

export async function GET(_req: NextRequest) {
  try {
    /* ---------- Naturezas (SED010) -------------------------------- */
    // • filtra ED_TIPO (' ' ou '2')
    // • trim() nos campos
    // • agrupa por COD  ➜  1 linha por código
    const naturezas = await prisma.$queryRawUnsafe<Natureza[]>(`
      SELECT
        LTRIM(RTRIM(SED.ED_CODIGO))            AS COD,
        MAX(LTRIM(RTRIM(SED.ED_DESCRIC)))      AS DESCR
      FROM   SED010 SED  WITH (NOLOCK)
      WHERE  SED.D_E_L_E_T_ <> '*'
        AND  SED.ED_TIPO IN (' ', '2')
      GROUP BY LTRIM(RTRIM(SED.ED_CODIGO))
      ORDER BY COD
    `);

    /* ---------- Tipos de Operação (SX5 – tabela DJ) --------------- */
    const tiposOperacao = await prisma.$queryRawUnsafe<TipoOper[]>(`
      SELECT
        LTRIM(RTRIM(SX5.X5_CHAVE))             AS COD,
        MAX(LTRIM(RTRIM(SX5.X5_DESCRI)))       AS DESCR
      FROM   SX5010 SX5 WITH (NOLOCK)
      WHERE  SX5.X5_TABELA = 'DJ'
        AND  SX5.D_E_L_E_T_ <> '*'
      GROUP BY LTRIM(RTRIM(SX5.X5_CHAVE))
      ORDER BY COD
    `);

    return NextResponse.json(
      { naturezas, tiposOperacao },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("[GET /api/classificacao/metadata] erro →", err);
    return NextResponse.json(
      { error: "Falha ao buscar metadados de classificação." },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
