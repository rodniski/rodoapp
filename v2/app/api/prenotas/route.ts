// /app/api/prenotas/route.ts
import { NextResponse } from "next/server";
import { getPrenotas } from "./service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      pagination: { page = 1, pageSize = 10 } = {},
      filters = {},
      sorting = [],
      filials = ["0101"],
    } = body;

    const result = await getPrenotas({
      page,
      pageSize,
      filters,
      sorting,
      filials,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Erro ao processar requisição:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}