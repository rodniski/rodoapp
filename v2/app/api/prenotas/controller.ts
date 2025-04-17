import { NextResponse } from "next/server";
import { getPrenotas } from "./service";

export async function handleGetPrenotas(request: Request) {
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
    console.error("Erro no controller de prenotas:", error);
    return NextResponse.json(
      { error: "Erro ao processar requisição" },
      { status: 500 }
    );
  }
}

// compatível com Next.js route handler
export { handleGetPrenotas as POST };