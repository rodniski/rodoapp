package main

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"log"
    "strings" // Import strings para HasErrorPrefix

	_ "github.com/denisenkom/go-mssqldb"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"

	"github.com/rodniski/websocket/internal/config"
	"github.com/rodniski/websocket/internal/handlers"
	"github.com/rodniski/websocket/internal/prenotas"
)

var (
	db  *sql.DB
	rdb *redis.Client
	ctx = context.Background()
)

const redisearchIndexName = "idx:prenotas" // Mesmo nome usado em service.go

func main() {
	var err error

	// --- Conexões ---
	log.Println("🔌 Iniciando conexão com MSSQL...")
	db, err = sql.Open("sqlserver", config.MSSQLConnectionString())
	if err != nil {
		log.Fatalf("❌ Erro fatal ao abrir conexão MSSQL: %v", err)
	}
	if err = db.Ping(); err != nil {
		log.Fatalf("❌ Erro fatal no ping MSSQL: %v", err)
	}
	log.Println("✅ Conexão MSSQL estabelecida.")

	log.Println("🔌 Iniciando conexão com Redis...")
	rdb = redis.NewClient(&redis.Options{
		Addr:     config.RedisURL(), // Ex: localhost:6379
		Password: "",
		DB:       1,                 // Usando DB 1
	})
	if _, err := rdb.Ping(ctx).Result(); err != nil {
		log.Fatalf("❌ Erro fatal ao conectar no Redis (DB 1): %v", err)
	}
	log.Println("✅ Conexão Redis (DB 1) estabelecida.")

	// --- Garantir Índice RediSearch ---
	log.Println("🔎 Verificando/Criando índice RediSearch...")
	err = ensureRediSearchIndex(rdb) // Chama a função para criar o índice
	if err != nil {
		log.Fatalf("❌ Erro fatal ao garantir índice RediSearch: %v", err)
	}

	// --- Carga Inicial dos Dados (SQL -> Redis Hashes) ---
	// A lógica foi movida para dentro da função updateRedisHashes em service.go
	// e é chamada imediatamente ao iniciar o pooling.
	// Se preferir fazer a carga aqui antes de iniciar o pooling:
	// log.Println("🔄 Iniciando carga inicial: SQL -> Redis Hashes...")
	// prenotas.UpdateRedisHashes(db, rdb) // Chamaria a função diretamente

	// --- Iniciar Pooling para Atualizações Periódicas ---
	prenotas.StartPooling(db, rdb) // Inicia o pooling (que já faz uma carga inicial)

	// --- Configuração e Inicialização do Servidor Web (Gin) ---
	log.Println("⚙️ Configurando servidor web (Gin)...")
	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowAllOrigins:  true,
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"},
		AllowHeaders:     []string{"*"},
		ExposeHeaders:    []string{"*"},
		AllowCredentials: true,
		MaxAge:           12 * 60 * 60,
	}))

	// --- Rotas da API ---
    // Registra o NOVO handler para a busca de pré-notas
	r.GET("/prenotas", handlers.QueryPreNotasHandler(rdb))

	// Rota Timeline (mantida)
	r.GET("/timeline", handlers.TimelineHandler(db))

	// --- Iniciar Servidor ---
	port := ":8080"
	log.Printf("✅ Servidor web pronto para rodar na porta %s", port)
	if err := r.Run(port); err != nil {
		log.Fatalf("❌ Erro fatal ao iniciar servidor Gin: %v", err)
	}
}

// ensureRediSearchIndex verifica se o índice existe e o cria se necessário.
func ensureRediSearchIndex(rdb *redis.Client) error {
	_, err := rdb.Do(ctx, "FT.INFO", redisearchIndexName).Result()
	if err != nil {
		// Assume que redis.Nil ou erro contendo "Unknown Index name" significa que não existe
		if errors.Is(err, redis.Nil) || strings.Contains(err.Error(), "Unknown Index name") {
			log.Printf("ℹ️ Índice RediSearch '%s' não encontrado. Criando...", redisearchIndexName)
			// Schema definition (ajuste tipos e SORTABLE conforme necessidade)
			args := []interface{}{
				redisearchIndexName, "ON", "HASH", "PREFIX", "1", "prenota:", "SCHEMA",
				"Rec", "NUMERIC", "SORTABLE",
				"F4Tranfil", "TAG",
				"F1Filial", "TAG", "SORTABLE",
				"F1Doc", "TEXT", "SORTABLE",
				"F1Serie", "TAG",
				"F1Status", "TAG", "SORTABLE",
				"A2Cod", "TAG",
				"A2Loja", "TAG",
				"A2Nome", "TEXT", "SORTABLE", "WEIGHT", "1.5",
				"Fornece", "TEXT", "WEIGHT", "1.2",
				"F1Emissao", "TAG", "SORTABLE", // Tratando YYYYMMDD como TAG ordenável
				"F1DtDigit", "TAG", "SORTABLE", // Tratando YYYYMMDD como TAG ordenável
				"F1ValBrut", "NUMERIC", "SORTABLE",
				"F1XTipo", "TAG", "SORTABLE",
				"F1XPrior", "TAG",
				"F1XOri", "TAG",
				"F1XUsrra", "TEXT",
				"F1XObs", "TEXT", "WEIGHT", "0.8",
				"F1ZObsRev", "TEXT", "WEIGHT", "0.7",
				"F1XRev", "TAG", // Ex: TAG se for código/sigla
				"Usuario", "TEXT",
				"Vencimento", "TAG", "SORTABLE", // Tratando YYYYMMDD como TAG ordenável
				"Anexo", "TEXT",
				"AnexoPath", "TAG",
			}
			_, createErr := rdb.Do(ctx, "FT.CREATE", args).Result()
			if createErr != nil {
				return fmt.Errorf("falha ao criar índice RediSearch '%s': %w", redisearchIndexName, createErr)
			}
			log.Printf("✅ Índice RediSearch '%s' criado com sucesso.", redisearchIndexName)
		} else {
			return fmt.Errorf("erro ao verificar índice RediSearch '%s': %w", redisearchIndexName, err)
		}
	} else {
		log.Printf("✅ Índice RediSearch '%s' já existe.", redisearchIndexName)
	}
	return nil
}