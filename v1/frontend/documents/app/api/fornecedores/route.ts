// app/api/fornecedores/route.ts
import {NextResponse} from "next/server";
import {config} from 'config'

/**
 * Estrutura do fornecedor que o servidor real retorna.
 */
interface Fornecedor {
    loja: string;
    numero: string;
    fornecedor: string;
    rua: string;
    bairro: string;
    estado: string;
    cidade: string;
    cgc: string;
}

/**
 * A rota GET /api/fornecedores?search=...&limit=...
 * Carrega a lista COMPLETA do servidor real, filtra localmente e retorna apenas o subset.
 */
export async function GET(request: Request) {
    try {
        const {searchParams} = new URL(request.url);
        const busca = searchParams.get("search") || "";
        const limit = parseInt(searchParams.get("limit") || "50", 10);

        // 1) Carregamos a lista completa do servidor real. Ele ignora 'busca'.
        const baseUrl = `${config.API_PRODUCTION_URL}reidoapsdu/consultar/fornecedores/`;
        const headers: HeadersInit = {
            "RECA2": "",
            "busca": "", // Se não fizer efeito, pode remover
            "Content-Type": "application/json",
        };

        const response = await fetch(baseUrl, {
            method: "GET",
            headers,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Erro na API real:", errorText);
            return NextResponse.json({error: "Erro ao buscar fornecedores"}, {status: 500});
        }

        // 2) Lemos todos os dados
        const data: Fornecedor[] = await response.json();

        // 3) Filtramos localmente com base no 'busca'
        //    Ajuste a lógica de correspondência conforme necessário
        const buscaLower = busca.toLowerCase();
        let filtrados = data.filter((forn) => {
            return (
                forn.fornecedor.toLowerCase().includes(buscaLower) ||
                forn.cgc.includes(busca)
            );
            // Se quiser filtrar também por 'loja', 'numero', etc., inclua no condicional
        });

        // 4) Limitamos a quantidade
        filtrados = filtrados.slice(0, limit);

        // 5) Retornamos { fornecedores: [...] }
        return NextResponse.json({fornecedores: filtrados}, {status: 200});

    } catch (error) {
        console.error("Erro no route /api/fornecedores:", error);
        return NextResponse.json(
            {error: "Erro interno ao buscar fornecedores"},
            {status: 500}
        );
    }
}
