package handlers

import (
	// "context" - Removido pois ctx vem de c.Request.Context()
	"log"
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9" // Use a versão correta (v8 ou v9)

	"github.com/rodniski/websocket/internal/filiais"
	"github.com/rodniski/websocket/internal/prenotas"
)

// Constantes para valores padrão de paginação e ordenação
const (
	DefaultPage      = 1
	DefaultPageSize  = 20
	DefaultSortBy    = "Rec" // Campo padrão para ordenar (ID da PreNota)
	DefaultSortOrder = "DESC"
	MaxPageSize      = 100 // Limite máximo para evitar abuso
)

// QueryPreNotasHandler é o novo handler para buscar pré-notas usando RediSearch.
// Ele recebe os parâmetros de filtro/ordenação/paginação via query string.
func QueryPreNotasHandler(rdb *redis.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Usar o contexto da requisição Gin
		ctx := c.Request.Context() // Usa o contexto da requisição

		// --- 1. Obter Usuário e Filiais Permitidas ---
		username := c.GetHeader("usr")
		if username == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Header 'usr' não informado"})
			return
		}

		var userFiliais []string
		groupID, err := rdb.HGet(ctx, "userGroup", username).Result()
		if err == redis.Nil {
			log.Printf("ℹ️ Grupo de filiais não encontrado no Redis para user '%s'. Buscando via API...", username)
			filiaisListAPI, errAPI := filiais.GetFiliaisFromAPI(username)
			if errAPI != nil {
				log.Printf("❌ Erro ao buscar filiais via API para user '%s': %v", username, errAPI)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao obter filiais do usuário"})
				return
			}
			if len(filiaisListAPI) == 0 {
				log.Printf("⚠️ Usuário '%s' não possui filiais na API.", username)
				c.JSON(http.StatusForbidden, gin.H{"error": "Usuário não possui filiais associadas."})
				return
			}
			for _, f := range filiaisListAPI {
				userFiliais = append(userFiliais, f.CodFil)
			}
			// Opcional: Salvar associação no Redis
			// groupID, _ = filiais.GetOrCreateGroupID(rdb, userFiliais)
			// _ = filiais.AssociarUsuarioAoGrupo(rdb, username, groupID)

		} else if err != nil {
			log.Printf("❌ Erro ao buscar groupID do Redis para user '%s': %v", username, err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro interno (Redis group lookup)"})
			return
		} else {
			groupKey := "group:" + groupID
			userFiliais, err = rdb.SMembers(ctx, groupKey).Result()
			if err != nil {
				log.Printf("❌ Erro ao buscar membros do grupo '%s' do Redis para user '%s': %v", groupKey, username, err)
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro interno (Redis group members)"})
				return
			}
			if len(userFiliais) == 0 {
				log.Printf("⚠️ Grupo Redis '%s' encontrado para user '%s', mas está vazio.", groupKey, username)
				c.JSON(http.StatusForbidden, gin.H{"error": "Usuário não possui filiais associadas (grupo vazio)."})
				return
			}
		}
		log.Printf("ℹ️ Filiais para user '%s': %v", username, userFiliais)

		// --- 2. Parsear Query Parameters ---
		pageStr := c.DefaultQuery("page", strconv.Itoa(DefaultPage))
		pageSizeStr := c.DefaultQuery("pageSize", strconv.Itoa(DefaultPageSize))
		sortBy := c.DefaultQuery("sortBy", DefaultSortBy)
		sortOrder := strings.ToUpper(c.DefaultQuery("sortOrder", DefaultSortOrder))
		globalSearch := c.Query("q")
		tipoFilter := c.Query("tipo")
		statusFilter := c.Query("status")

		page, err := strconv.Atoi(pageStr)
		if err != nil || page < 1 {
			page = DefaultPage
		}
		pageSize, err := strconv.Atoi(pageSizeStr)
		if err != nil || pageSize < 1 {
			pageSize = DefaultPageSize
		}
		if pageSize > MaxPageSize {
			pageSize = MaxPageSize
		}
		if sortOrder != "ASC" && sortOrder != "DESC" {
			sortOrder = DefaultSortOrder
		}

		// --- 3. Montar Parâmetros para a Busca ---
		queryParams := prenotas.QueryParams{
			UserFiliais:  userFiliais,
			GlobalSearch: globalSearch,
			Tipo:         tipoFilter,
			Status:       statusFilter,
			SortBy:       sortBy,
			SortOrder:    sortOrder,
			Page:         page,
			PageSize:     pageSize,
		}

		// --- 4. Chamar a Função de Busca ---
		log.Printf("⚙️ Executando busca RediSearch com params: %+v", queryParams)
		results, err := prenotas.QueryPreNotasFromRedis(rdb, queryParams) // Chama a função implementada
		if err != nil {
			log.Printf("❌ Erro retornado por QueryPreNotasFromRedis: %v", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao realizar a busca de pré-notas."})
			return
		}

		// --- 5. Retornar os Resultados ---
		log.Printf("✅ Busca RediSearch retornou %d itens (Total: %d)", len(results.Items), results.TotalItems)
		c.JSON(http.StatusOK, results)
	}
}