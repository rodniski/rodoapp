// app/actions/prenotaActions.ts
"use server";

// Ajuste o path para sua função getRedisClient
import { getRedisClient } from "lib";

// Interfaces (PrenotaTableData, FetchPrenotasParams, PrenotasResult - mantidas iguais)
// ... (cole as interfaces daqui de cima) ...
export interface PrenotaTableData {
    id: number; // Use REC as number ID
    rec: number;
    f4_tranfil: string;
    f1_filial: string;
    f1_doc: string;
    f1_serie: string;
    f1_status: string;
    a2_cod: string;
    a2_loja: string;
    a2_nome: string;
    fornece: string;
    f1_emissao: string;
    f1_dtdigit: string;
    f1_dtdigit_unix: number;
    f1_valbrut: number;
    f1_xtipo: string;
    f1_xprior: string;
    f1_xori: string;
    f1_xusrra: string;
    f1_xobs: string;
    f1_zobsrev: string;
    f1_xrev: string;
    usuario: string;
    vencimento: string;
    z07_desc: string;
    z07_chave: string;
    last_updated: string;
}


interface FetchPrenotasParams {
    page?: number;
    perPage?: number;
}

interface PrenotasResult {
    data: PrenotaTableData[];
    total: number;
    page: number;
    perPage: number;
}


// Função para parsear dados do Redis (mantida igual)
// ... (cole a função parsePrenotaData daqui de cima) ...
function parsePrenotaData(key: string, redisData: Record<string, string> | null): PrenotaTableData | null {
    if (!redisData) {
        console.warn(`[parsePrenotaData] No data found for key: ${key}`);
        return null;
    }

    try {
        const idStr = key.split(':').pop();
        const id = parseInt(idStr || '0', 10);
        if (isNaN(id) || id === 0) {
            console.warn(`[parsePrenotaData] Could not parse valid REC from key: ${key}. Extracted: '${idStr}'`);
            const recFromData = parseInt(redisData.rec || '0', 10);
            if (isNaN(recFromData) || recFromData === 0) {
                console.error(`[parsePrenotaData] Critical: Cannot determine ID for key ${key}`);
                return null;
            }
            return {
                id: recFromData,
                rec: recFromData,
                f4_tranfil: redisData.f4_tranfil || '',
                f1_filial: redisData.f1_filial || '',
                f1_doc: redisData.f1_doc || '',
                f1_serie: redisData.f1_serie || '',
                f1_status: redisData.f1_status || '',
                a2_cod: redisData.a2_cod || '',
                a2_loja: redisData.a2_loja || '',
                a2_nome: redisData.a2_nome || '',
                fornece: redisData.fornece || '',
                f1_emissao: redisData.f1_emissao || '',
                f1_dtdigit: redisData.f1_dtdigit || '',
                f1_dtdigit_unix: parseInt(redisData.f1_dtdigit_unix || '0', 10),
                f1_valbrut: parseFloat(redisData.f1_valbrut || '0'),
                f1_xtipo: redisData.f1_xtipo || '',
                f1_xprior: redisData.f1_xprior || '',
                f1_xori: redisData.f1_xori || '',
                f1_xusrra: redisData.f1_xusrra || '',
                f1_xobs: redisData.f1_xobs || '',
                f1_zobsrev: redisData.f1_zobsrev || '',
                f1_xrev: redisData.f1_xrev || '',
                usuario: redisData.usuario || '',
                vencimento: redisData.vencimento || '',
                z07_desc: redisData.z07_desc || '',
                z07_chave: redisData.z07_chave || '',
                last_updated: redisData.last_updated || '',
            };
        }
        const rec = parseInt(redisData.rec || '0', 10);
        return {
            id: id,
            rec: !isNaN(rec) ? rec : id,
            f4_tranfil: redisData.f4_tranfil || '',
            f1_filial: redisData.f1_filial || '',
            f1_doc: redisData.f1_doc || '',
            f1_serie: redisData.f1_serie || '',
            f1_status: redisData.f1_status || '',
            a2_cod: redisData.a2_cod || '',
            a2_loja: redisData.a2_loja || '',
            a2_nome: redisData.a2_nome || '',
            fornece: redisData.fornece || '',
            f1_emissao: redisData.f1_emissao || '',
            f1_dtdigit: redisData.f1_dtdigit || '',
            f1_dtdigit_unix: parseInt(redisData.f1_dtdigit_unix || '0', 10),
            f1_valbrut: parseFloat(redisData.f1_valbrut || '0'),
            f1_xtipo: redisData.f1_xtipo || '',
            f1_xprior: redisData.f1_xprior || '',
            f1_xori: redisData.f1_xori || '',
            f1_xusrra: redisData.f1_xusrra || '',
            f1_xobs: redisData.f1_xobs || '',
            f1_zobsrev: redisData.f1_zobsrev || '',
            f1_xrev: redisData.f1_xrev || '',
            usuario: redisData.usuario || '',
            vencimento: redisData.vencimento || '',
            z07_desc: redisData.z07_desc || '',
            z07_chave: redisData.z07_chave || '',
            last_updated: redisData.last_updated || '',
        };
    } catch (parseError) {
        console.error(`[parsePrenotaData] Error parsing data for key ${key}:`, parseError, "Raw Data:", redisData);
        return null;
    }
}


// Server Action CORRIGIDA usando sendCommand e multi() para pipeline
export async function getPrenotasServerAction({
                                                  page = 1,
                                                  perPage = 10,
                                              }: FetchPrenotasParams): Promise<PrenotasResult> {
    console.log(`Server Action: Buscando prenotas - Página: ${page}, Por Página: ${perPage}`);
    const redisKeyPrefix = "gateway";
    const sortedSetKey = `${redisKeyPrefix}:prenotas:by_dtdigit`;

    let redis;
    try {
        redis = await getRedisClient();

        const start = (page - 1) * perPage;
        const end = start + perPage - 1;

        // 1. Pegar chaves ordenadas usando sendCommand
        console.log(`Executando sendCommand ZREVRANGE em ${sortedSetKey} de ${start} até ${end}`);
        const keys = await redis.sendCommand<string[]>([
            'ZREVRANGE', sortedSetKey, String(start), String(end)
        ]);
        console.log(`Server Action: Chaves encontradas (${keys.length}) usando a chave ${sortedSetKey}:`, keys);

        // 2. Obter o número total de itens usando sendCommand
        console.log(`Executando sendCommand ZCARD em ${sortedSetKey}`);
        const total = await redis.sendCommand<number>(['ZCARD', sortedSetKey]);
        console.log(`Server Action: Total de prenotas (${sortedSetKey}): ${total}`);

        // 3. Buscar os dados de cada chave usando HGETALL via MULTI/EXEC
        let prenotasData: PrenotaTableData[] = [];
        if (keys.length > 0) {
            console.log(`Iniciando MULTI para buscar ${keys.length} HGETALL...`);
            // --- CORREÇÃO: Usar redis.multi() ---
            const multi = redis.multi();

            // Adiciona os comandos HGETALL ao objeto multi
            keys.forEach(key => {
                if (key.startsWith(`${redisKeyPrefix}:prenota:`)) {
                    multi.HGETALL(key); // Chama HGETALL no objeto multi
                } else {
                    console.warn(`Chave inesperada encontrada no Sorted Set ${sortedSetKey}: ${key}`);
                }
            });

            // Executa todos os comandos enfileirados no MULTI
            // O resultado é um array com os resultados de cada comando na ordem
            console.log('Executando multi.exec()...');
            const results = await multi.exec();
            console.log(`multi.exec() concluído. Resultados recebidos: ${results.length}`);

            // Processa os resultados do multi.exec()
            prenotasData = results
                // O resultado de multi().exec() para HGETALL geralmente é Record<string, string> | null
                .map((result, index) => {
                    // MULTI/EXEC não retorna erros individuais como pipeline,
                    // mas pode retornar null para comandos que falharam (raro para HGETALL se a chave existe)
                    // ou lançar um erro geral no await multi.exec() se a transação falhar.
                    if (result === null) {
                        console.error(`Resultado nulo no multi.exec() para a chave ${keys[index]}`);
                        return null;
                    }
                    return parsePrenotaData(keys[index], result as Record<string, string>); // Faz type assertion
                })
                .filter((item): item is PrenotaTableData => item !== null);
        }

        console.log(`Server Action: Dados retornados: ${prenotasData.length} itens parseados.`);
        return {
            data: prenotasData,
            total,
            page,
            perPage,
        };
    } catch (error) {
        console.error(`Server Action Error fetching prenotas (${sortedSetKey}):`, error);
        // Lança erro para o frontend tratar
        throw new Error(`Falha ao buscar dados das prenotas: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
}