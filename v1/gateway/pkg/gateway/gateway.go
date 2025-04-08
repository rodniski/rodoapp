package gateway

import (
	"context"
	"database/sql"
	"fmt"
	"os"
	"strconv"
	"time"

	"gateway/config"
	"gateway/models"

	_ "github.com/denisenkom/go-mssqldb"
	"github.com/redis/go-redis/v9"
	"github.com/rs/zerolog"
)

const (
	redisNamespace = "gateway"    // Define o namespace base
	logBatchSize   = 5000         // Tamanho do grupo para logs de progresso
)

type Gateway struct {
	db     *sql.DB
	rdb    *redis.Client
	ctx    context.Context
	logger zerolog.Logger
}

// Helper para gerar chaves com o namespace
func redisKey(parts ...string) string {
	key := redisNamespace
	for _, part := range parts {
		key += ":" + part
	}
	return key
}

func NewGateway() (*Gateway, error) {
	logger := zerolog.New(os.Stdout).With().Timestamp().Logger()

	db, err := sql.Open("sqlserver", config.MSSQLConnectionString())
	if err != nil {
		logger.Error().Err(err).Msg("Falha ao abrir conexão com MSSQL")
		return nil, err
	}
	if err := db.Ping(); err != nil {
		logger.Error().Err(err).Msg("Falha ao pingar MSSQL")
		db.Close()
		return nil, err
	}

	rdb := redis.NewClient(&redis.Options{
		Addr: config.RedisURL(),
	})
	if _, err := rdb.Ping(context.Background()).Result(); err != nil {
		logger.Error().Err(err).Msg("Falha ao pingar Redis")
		db.Close()
		return nil, err
	}

	logger.Info().Msg("Gateway iniciado com sucesso")
	return &Gateway{
		db:     db,
		rdb:    rdb,
		ctx:    context.Background(),
		logger: logger,
	}, nil
}

func (g *Gateway) Close() {
	g.db.Close()
	g.rdb.Close()
	g.logger.Info().Msg("Gateway encerrado")
}

func (g *Gateway) SyncPrenotas() error {
	g.logger.Info().Msg("Iniciando sincronização de pré-notas")
	rows, err := g.db.Query(config.GetSQLQueryPreNotas())
	if err != nil {
		g.logger.Error().Err(err).Msg("Erro ao executar query no MSSQL")
		return err
	}
	defer rows.Close()

	// Chaves dos índices com namespace
	prenotasAllKey := redisKey("prenotas", "all")
	prenotasByDtDigitKey := redisKey("prenotas", "by_dtdigit")

	// --- Limpeza Opcional ---
	// Considerar se a limpeza total a cada ciclo é necessária ou se apenas
	// a sobrescrita dos Hashes e atualização dos Sets é suficiente.
	// A limpeza garante que não fiquem registros órfãos se forem deletados no MSSQL.
	g.logger.Info().Msg("Iniciando limpeza de chaves antigas no Redis...")
	keysToDelete, err := g.rdb.Keys(g.ctx, redisKey("prenota", "*")).Result()
	deletedCount := 0
	if err != nil {
		g.logger.Warn().Err(err).Msg("Erro ao buscar chaves de prenotas para deletar. Limpeza parcial pode ocorrer.")
	} else {
		keysToDelete = append(keysToDelete, prenotasAllKey, prenotasByDtDigitKey) // Adiciona índices à lista
		if len(keysToDelete) > 0 {
			deletedCmd := g.rdb.Del(g.ctx, keysToDelete...)
			if err := deletedCmd.Err(); err != nil {
				g.logger.Warn().Err(err).Msg("Erro ao executar DEL em lote para chaves antigas e índices no Redis")
			} else {
				deletedCount = int(deletedCmd.Val()) // Pega o número de chaves realmente deletadas
				g.logger.Info().Int("deleted_count", deletedCount).Msg("Limpeza de chaves antigas e índices concluída no Redis")
			}
		} else {
			g.logger.Info().Msg("Nenhuma chave antiga encontrada para limpar.")
		}
	}
	// --- Fim da Limpeza ---


	totalProcessed := 0

	for rows.Next() {
		var p models.Prenota
		// Atenção: Garanta que a ordem e quantidade dos campos no Scan
		// correspondem exatamente às colunas na sua query SQL.
		err := rows.Scan(
			&p.REC, &p.F4Tranfil, &p.F1Filial, &p.F1Doc, &p.F1Serie, &p.F1Status,
			&p.A2Cod, &p.A2Loja, &p.A2Nome, &p.Fornece, &p.F1Emissao, &p.F1DtDigit,
			&p.F1ValBrut, &p.F1XTipo, &p.F1XPrior, &p.F1XOri, &p.F1XUsrRa, &p.F1XObs,
			&p.F1ZObsRev, &p.F1XRev, &p.Usuario, &p.Vencimento, &p.Z07Desc, &p.Z07Chave,
		)
		if err != nil {
			g.logger.Error().Err(err).Msg("Erro ao escanear linha do MSSQL. Verifique ordem/quantidade de colunas na query SQL vs struct Prenota.")
			if cols, errCols := rows.Columns(); errCols == nil {
				g.logger.Debug().Strs("sql_columns", cols).Msg("Colunas esperadas pela query SQL")
			}
			// Considerar se deve retornar o erro ou continuar com os próximos registros
			// Retornar aqui interrompe a sincronização completa.
			return fmt.Errorf("erro ao escanear linha do MSSQL: %w", err)
		}

		// Gerar chave do Hash com namespace
		hashKey := redisKey("prenota", strconv.Itoa(p.REC))

		// Converter F1DtDigit para timestamp Unix
		var dtdigitUnix int64
		if dtdigitTime, err := time.Parse("20060102", p.F1DtDigit); err == nil {
			dtdigitUnix = dtdigitTime.Unix()
		} else {
			if p.F1DtDigit != "" { // Só loga o aviso se a data não for vazia
				g.logger.Warn().Err(err).Str("f1_dtdigit", p.F1DtDigit).Int("rec", p.REC).Msg("Erro ao parsear F1DtDigit, usando timestamp 0")
			}
			dtdigitUnix = 0
		}

		// ---- Salvar dados individualmente no Redis ----

		// 1. Salvar o Hash principal
		err = g.rdb.HSet(g.ctx, hashKey, map[string]interface{}{
			"rec":             p.REC,
			"f4_tranfil":      p.F4Tranfil,
			"f1_filial":       p.F1Filial,
			"f1_doc":          p.F1Doc,
			"f1_serie":        p.F1Serie,
			"f1_status":       p.F1Status,
			"a2_cod":          p.A2Cod,
			"a2_loja":         p.A2Loja,
			"a2_nome":         p.A2Nome,
			"fornece":         p.Fornece,
			"f1_emissao":      p.F1Emissao,
			"f1_dtdigit":      p.F1DtDigit,
			"f1_dtdigit_unix": dtdigitUnix,
			"f1_valbrut":      p.F1ValBrut,
			"f1_xtipo":        p.F1XTipo,
			"f1_xprior":       p.F1XPrior,
			"f1_xori":         p.F1XOri,
			"f1_xusrra":       p.F1XUsrRa,
			"f1_xobs":         p.F1XObs,
			"f1_zobsrev":      p.F1ZObsRev,
			"f1_xrev":         p.F1XRev,
			"usuario":         p.Usuario,
			"vencimento":      p.Vencimento,
			"z07_desc":        p.Z07Desc,
			"z07_chave":       p.Z07Chave,
			"last_updated":    time.Now().UTC().Format(time.RFC3339),
		}).Err()
		if err != nil {
			g.logger.Error().Err(err).Str("key", hashKey).Msg("Erro ao salvar HASH no Redis")
			// Considerar continuar ou retornar erro
			continue // Pula para o próximo registro em caso de erro no HSet
		}

		// 2. Adicionar ao índice Set (prenotas:all)
		err = g.rdb.SAdd(g.ctx, prenotasAllKey, hashKey).Err()
		if err != nil {
			g.logger.Error().Err(err).Str("key", hashKey).Str("set_key", prenotasAllKey).Msg("Erro ao adicionar ao SET de índices no Redis")
			// Considerar continuar ou retornar erro
			continue // Pula para o próximo registro
		}

		// 3. Adicionar ao índice Sorted Set (prenotas:by_dtdigit)
		err = g.rdb.ZAdd(g.ctx, prenotasByDtDigitKey, redis.Z{Score: float64(dtdigitUnix), Member: hashKey}).Err()
		if err != nil {
			g.logger.Error().Err(err).Str("key", hashKey).Str("zset_key", prenotasByDtDigitKey).Msg("Erro ao adicionar ao SORTED SET de índices no Redis")
			// Considerar continuar ou retornar erro
			continue // Pula para o próximo registro
		}

		// ---- Fim do salvamento individual ----

		totalProcessed++

		// Logar progresso a cada logBatchSize itens processados
		if totalProcessed%logBatchSize == 0 {
			g.logger.Info().Int("processed_count", totalProcessed).Msg("Progresso da sincronização...")
		}
	}

	// Verificar erro final do loop rows.Next()
	if err := rows.Err(); err != nil {
		g.logger.Error().Err(err).Msg("Erro durante iteração das linhas do MSSQL")
		// Retorna o erro, pois pode indicar um problema maior na leitura do DB
		return err
	}

	g.logger.Info().Int("total_processed", totalProcessed).Msg("Sincronização de pré-notas concluída")
	return nil
}


func (g *Gateway) Run() {
	g.logger.Info().Msg("Executando sincronização inicial...")
	if err := g.SyncPrenotas(); err != nil {
		g.logger.Error().Err(err).Msg("Erro na sincronização inicial")
	}

	ticker := time.NewTicker(5 * time.Minute) // Intervalo de 5 minutos
	defer ticker.Stop()

	for range ticker.C {
		g.logger.Info().Msg("Iniciando ciclo de sincronização periódica")
		if err := g.SyncPrenotas(); err != nil {
			g.logger.Error().Err(err).Msg("Erro no ciclo de sincronização periódica")
		}
	}
}