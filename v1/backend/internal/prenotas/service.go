package prenotas

import (
	"context"
	"database/sql"
   _"errors" // Para IsNil
	"fmt"
	"log"
	"math" // Para Ceil em TotalPages
	"strconv"
	"strings"
	"time"

	"github.com/redis/go-redis/v9" // Ajuste para v8 se estiver usando essa versão
	"github.com/rodniski/websocket/internal/config"
)

// ctx é o contexto background usado nas operações Redis. Pode ser passado como argumento se necessário.
var ctx = context.Background()
const redisearchIndexName = "idx:prenotas" // Nome do índice usado em main.go também

// StartPooling inicia um loop para buscar dados do SQL e atualizar os Hashes no Redis.
// Atualiza a cada 1 minuto.
func StartPooling(db *sql.DB, rdb *redis.Client) {
	go func() {
		// Ticker para controlar a frequência da atualização.
		ticker := time.NewTicker(1 * time.Minute)
		defer ticker.Stop()

		// Executa uma vez imediatamente ao iniciar, depois a cada tick.
		updateRedisHashes(db, rdb) // Chama a lógica de atualização

		for {
			select {
			case <-ticker.C:
				// Chamado a cada tick do ticker (1 min)
				updateRedisHashes(db, rdb)
			case <-ctx.Done():
				log.Println("🛑 Pooling de pré-notas interrompido.")
				return
			}
		}
	}()
	log.Println("🚀 Pooling de pré-notas iniciado (atualização a cada 1 minuto).")
}

// updateRedisHashes contém a lógica para buscar do SQL e salvar/atualizar Hashes no Redis.
func updateRedisHashes(db *sql.DB, rdb *redis.Client) {
	log.Println("⏳ Iniciando busca de pré-notas no SQL para atualizar Redis...")

	// 1. Buscar os dados mais recentes do banco de dados SQL.
	preNotas, err := CarregarPreNotas(db)
	if err != nil {
		log.Printf("❌ Erro ao carregar pré-notas do SQL para atualização: %v", err)
		return
	}

	if len(preNotas) == 0 {
		log.Println("ℹ️ Nenhuma pré-nota encontrada no SQL para atualizar no Redis.")
		return
	}

	// 2. Preparar e executar a atualização no Redis usando Pipeline para eficiência.
	pipe := rdb.Pipeline()
	var notasProcessadas int = 0
	prefixoChave := "prenota:"

	for _, nota := range preNotas {
		key := prefixoChave + strconv.FormatInt(nota.Rec, 10)
		notaMap := map[string]interface{}{
			"Rec":        strconv.FormatInt(nota.Rec, 10),
			"F4Tranfil":  nota.F4Tranfil,
			"F1Filial":   nota.F1Filial,
			"F1Doc":      nota.F1Doc,
			"F1Serie":    nota.F1Serie,
			"F1Status":   nota.F1Status,
			"A2Cod":      nota.A2Cod,
			"A2Loja":     nota.A2Loja,
			"A2Nome":     nota.A2Nome,
			"Fornece":    nota.Fornece,
			"F1Emissao":  nota.F1Emissao,
			"F1DtDigit":  nota.F1DtDigit,
			"F1ValBrut":  strconv.FormatFloat(nota.F1ValBrut, 'f', 2, 64),
			"F1XTipo":    nota.F1XTipo,
			"F1XPrior":   nota.F1XPrior,
			"F1XOri":     nota.F1XOri,
			"F1XUsrra":   nota.F1XUsrra,
			"F1XObs":     nota.F1XObs,
			"F1ZObsRev":  nota.F1ZObsRev,
			"F1XRev":     nota.F1XRev,
			"Usuario":    nota.Usuario,
			"Vencimento": nota.Vencimento,
			"Anexo":      nota.Anexo,
			"AnexoPath":  nota.AnexoPath,
		}
		pipe.HSet(ctx, key, notaMap)
		notasProcessadas++
	}

	// 3. Executar todos os comandos enfileirados no pipeline.
	_, err = pipe.Exec(ctx)
	if err != nil {
		log.Printf("❌ Erro ao executar pipeline Redis para salvar pré-notas: %v", err)
		return
	}

	log.Printf("✅ %d pré-notas processadas e salvas/atualizadas como Hashes no Redis (prefixo: %s).", notasProcessadas, prefixoChave)
}

// CarregarPreNotas busca as pré-notas no banco de dados SQL.
func CarregarPreNotas(db *sql.DB) ([]PreNota, error) {
	ctxSQL, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()
	query := config.GetSQLQueryPreNotas()
	rows, err := db.QueryContext(ctxSQL, query)
	if err != nil {
		log.Printf("❌ Erro ao executar QueryContext em CarregarPreNotas: %v", err)
		return nil, fmt.Errorf("erro ao consultar prenotas no db: %w", err)
	}
	defer func() {
		if errClose := rows.Close(); errClose != nil {
			log.Printf("⚠️ Erro ao fechar *sql.Rows em CarregarPreNotas: %v", errClose)
		}
	}()

	var result []PreNota
	for rows.Next() {
		var pn PreNota
		errScan := rows.Scan(
			&pn.Rec, &pn.F4Tranfil, &pn.F1Filial, &pn.F1Doc, &pn.F1Serie,
			&pn.F1Status, &pn.A2Cod, &pn.A2Loja, &pn.A2Nome, &pn.Fornece,
			&pn.F1Emissao, &pn.F1DtDigit, &pn.F1ValBrut, &pn.F1XTipo, &pn.F1XPrior,
			&pn.F1XOri, &pn.F1XUsrra, &pn.F1XObs, &pn.F1ZObsRev, &pn.F1XRev,
			&pn.Usuario, &pn.Vencimento, &pn.Anexo, &pn.AnexoPath,
		)
		if errScan != nil {
			log.Printf("❌ Erro no rows.Scan em CarregarPreNotas: %v. Pulando esta linha.", errScan)
			continue
		}
		result = append(result, pn)
	}
	if err = rows.Err(); err != nil {
		log.Printf("❌ Erro em rows.Err() após o loop em CarregarPreNotas: %v", err)
		return nil, fmt.Errorf("erro ao iterar resultados das prenotas: %w", err)
	}
	return result, nil
}

// --- Nova Função de Busca com RediSearch ---

// QueryPreNotasFromRedis executa uma busca no índice RediSearch idx:prenotas.
func QueryPreNotasFromRedis(rdb *redis.Client, params QueryParams) (*PaginatedPreNotasResult, error) {
	searchCtx := context.Background() // Usar contexto background ou passado por argumento

	// 1. Construir a string de query do RediSearch
	queryParts := []string{}

	// Filtro obrigatório por filial do usuário
	if len(params.UserFiliais) == 0 {
		// Se não há filiais, não há o que buscar (ou retornar erro?)
		log.Println("⚠️ Tentativa de busca sem filiais de usuário definidas.")
		return &PaginatedPreNotasResult{Items: []PreNota{}, TotalItems: 0, CurrentPage: params.Page, PageSize: params.PageSize}, nil // Retorna vazio
		// return nil, errors.New("nenhuma filial de usuário fornecida para a busca")
	}
	escapedFiliais := make([]string, len(params.UserFiliais))
	for i, f := range params.UserFiliais {
		escapedFiliais[i] = escapeTagValue(f) // Escapa caracteres especiais para tags
	}
	filialFilter := fmt.Sprintf("@F1Filial:{%s}", strings.Join(escapedFiliais, "|"))
	queryParts = append(queryParts, filialFilter)

	// Filtro global (busca em campos TEXT definidos no índice)
	if params.GlobalSearch != "" {
		// Escapar caracteres especiais da sintaxe de query RediSearch se necessário
		// Uma abordagem simples é cercar com aspas se contiver espaços ou caracteres problemáticos,
		// ou escapar caracteres como -, @, etc. com \.
		// Para busca fuzzy simples, podemos adicionar % (requer configuração no índice ou usar *)
		// Exemplo: busca exata da frase ou termo (adaptar escape se necessário)
		// queryParts = append(queryParts, escapeQuerySyntax(params.GlobalSearch))
		// Exemplo: busca por termos em campos específicos
		queryParts = append(queryParts, fmt.Sprintf("@(F1Doc|A2Nome|Fornece|F1XObs|Usuario):(%s)", params.GlobalSearch)) // Simplesmente coloca o termo
	}

	// Filtro por Tipo (TAG)
	if params.Tipo != "" {
		queryParts = append(queryParts, fmt.Sprintf("@F1XTipo:{%s}", escapeTagValue(params.Tipo)))
	}

	// Filtro por Status (TAG)
	if params.Status != "" {
		queryParts = append(queryParts, fmt.Sprintf("@F1Status:{%s}", escapeTagValue(params.Status)))
	}

	// Combinar todas as partes da query com espaço (AND implícito)
	queryString := strings.Join(queryParts, " ")
	if queryString == "" {
		queryString = "*" // Busca tudo se não houver filtros (improvável devido ao filtro de filial)
	}

	// 2. Construir os argumentos para o comando FT.SEARCH
	args := []interface{}{redisearchIndexName, queryString} // Índice e Query são obrigatórios

	// Adicionar Ordenação (SORTBY) se especificado
	if params.SortBy != "" {
		// Validar se params.SortBy é um campo válido e SORTABLE no índice (importante!)
		// Por simplicidade, vamos assumir que é válido por enquanto.
		sortOrder := "ASC"
		if strings.ToUpper(params.SortOrder) == "DESC" {
			sortOrder = "DESC"
		}
		args = append(args, "SORTBY", params.SortBy, sortOrder)
	} else {
        // Adicionar uma ordenação padrão se nenhuma for fornecida
         args = append(args, "SORTBY", "Rec", "DESC") // Ordena por Rec DESC por padrão
    }

	// Adicionar Paginação (LIMIT)
	offset := (params.Page - 1) * params.PageSize
	args = append(args, "LIMIT", offset, params.PageSize)

	// 3. Executar o comando FT.SEARCH
	log.Printf("⚙️ Executando FT.SEARCH: %v", args)
    rawResult, err := rdb.Do(searchCtx, args...).Result()
	if err != nil {
		// Se o índice não existir, pode retornar um erro aqui.
		if redis.HasErrorPrefix(err, "Unknown Index name") {
			log.Printf("❌ Erro: Índice RediSearch '%s' não encontrado.", redisearchIndexName)
			// Retorna vazio, pois o índice deveria ter sido criado em main.go
			return &PaginatedPreNotasResult{Items: []PreNota{}, TotalItems: 0, CurrentPage: params.Page, PageSize: params.PageSize}, nil
		}
		log.Printf("❌ Erro ao executar FT.SEARCH: %v", err)
		return nil, fmt.Errorf("erro na busca redis: %w", err)
	}

	// 4. Parsear o resultado do FT.SEARCH
	// O formato é geralmente: [total_hits_int, key1_string, [field1, value1, field2, value2,...], key2_string, [...], ...]
	resultSlice, ok := rawResult.([]interface{})
	if !ok || len(resultSlice) < 1 {
		log.Printf("⚠️ Resultado inesperado do FT.SEARCH: %v", rawResult)
		return nil, fmt.Errorf("formato inesperado do resultado da busca redis")
	}

	totalItems, ok := resultSlice[0].(int64)
	if !ok {
		log.Printf("⚠️ Não foi possível converter total de hits para int64: %v", resultSlice[0])
		return nil, fmt.Errorf("erro ao ler total de hits da busca redis")
	}

	items := []PreNota{}
	documentsRaw := resultSlice[1:] // Resto são os documentos [chave, campos, chave, campos...]

	for i := 0; i < len(documentsRaw); i += 2 {
		// key := documentsRaw[i].(string) // Chave do hash (ex: "prenota:123") - não usada diretamente aqui
		fieldsAndValues, ok := documentsRaw[i+1].([]interface{})
		if !ok {
			log.Printf("⚠️ Formato inesperado para campos/valores do documento %d", i/2)
			continue // Pula este documento
		}

		// Converte o resultado [field1, value1, ...] para map[string]string
		dataMap := make(map[string]string)
		for j := 0; j < len(fieldsAndValues); j += 2 {
			fieldName, fok := fieldsAndValues[j].(string)
			fieldValue, vok := fieldsAndValues[j+1].(string) // RediSearch geralmente retorna strings
			if fok && vok {
				dataMap[fieldName] = fieldValue
			}
		}

		// Converte o map para a struct PreNota
		nota, errConv := mapToPreNota(dataMap)
		if errConv != nil {
			log.Printf("⚠️ Erro ao converter hash para PreNota (key: %v): %v", documentsRaw[i], errConv)
			continue // Pula esta nota
		}
		items = append(items, nota)
	}

	// 5. Calcular metadados de paginação
	totalPages := 0
	if totalItems > 0 && params.PageSize > 0 {
		// Usa math.Ceil para arredondar para cima a divisão
		totalPages = int(math.Ceil(float64(totalItems) / float64(params.PageSize)))
	}

	// 6. Montar e retornar o resultado final
	paginatedResult := &PaginatedPreNotasResult{
		Items:       items,
		TotalItems:  totalItems,
		TotalPages:  totalPages,
		CurrentPage: params.Page,
		PageSize:    params.PageSize,
	}

	return paginatedResult, nil
}

// mapToPreNota converte um map[string]string (vindo do HGetAll ou FT.SEARCH) para a struct PreNota.
// Precisa tratar erros de conversão de tipo (string para int/float).
func mapToPreNota(dataMap map[string]string) (PreNota, error) {
	nota := PreNota{}
	var err error

	// Usar um helper para simplificar a conversão e tratamento de erro
	getValue := func(key string) string { return dataMap[key] } // Retorna "" se não existir
	parseFloat := func(key string) float64 {
		val, _ := strconv.ParseFloat(getValue(key), 64) // Ignora erro de parse por simplicidade aqui
		return val
	}
	parseInt := func(key string) int64 {
		val, _ := strconv.ParseInt(getValue(key), 10, 64) // Ignora erro de parse
		return val
	}

	nota.Rec = parseInt("Rec") // Converte Rec de volta para int64
	nota.F4Tranfil = getValue("F4Tranfil")
	nota.F1Filial = getValue("F1Filial")
	nota.F1Doc = getValue("F1Doc")
	nota.F1Serie = getValue("F1Serie")
	nota.F1Status = getValue("F1Status")
	nota.A2Cod = getValue("A2Cod")
	nota.A2Loja = getValue("A2Loja")
	nota.A2Nome = getValue("A2Nome")
	nota.Fornece = getValue("Fornece")
	nota.F1Emissao = getValue("F1Emissao")
	nota.F1DtDigit = getValue("F1DtDigit")
	nota.F1ValBrut = parseFloat("F1ValBrut") // Converte F1ValBrut de volta para float64
	nota.F1XTipo = getValue("F1XTipo")
	nota.F1XPrior = getValue("F1XPrior")
	nota.F1XOri = getValue("F1XOri")
	nota.F1XUsrra = getValue("F1XUsrra")
	nota.F1XObs = getValue("F1XObs")
	nota.F1ZObsRev = getValue("F1ZObsRev")
	nota.F1XRev = getValue("F1XRev")
	nota.Usuario = getValue("Usuario")
	nota.Vencimento = getValue("Vencimento")
	nota.Anexo = getValue("Anexo")
	nota.AnexoPath = getValue("AnexoPath")

	// Se houvesse erros importantes de conversão, poderiam ser retornados aqui.
	// Por enquanto, retorna erro nil.
	return nota, err
}

// escapeTagValue escapa caracteres que têm significado especial em queries TAG do RediSearch.
// Lista básica: ',', '.', '<', '>', '{', '}', '[', ']', '"', "'", ':', ';', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '+', '=', '~', '|', ' '
// Simplesmente prefixa esses caracteres com '\'. Adapte conforme necessário.
func escapeTagValue(tag string) string {
	// Escapa espaços e outros caracteres problemáticos para TAGs
	replacer := strings.NewReplacer(
		` `, `\ `,
		`,`, `\,`,
		`.`, `\.`,
		`<`, `\<`,
		`>`, `\>`,
		`{`, `\{`,
		`}`, `\}`,
		`[`, `\[`,
		`]`, `\]`,
		`"`, `\"`,
		`'`, `\'`,
		`:`, `\:`,
		`;`, `\;`,
		`!`, `\!`,
		`@`, `\@`,
		`#`, `\#`,
		`$`, `\$`,
		`%`, `\%`,
		`^`, `\^`,
		`&`, `\&`,
		`*`, `\*`,
		`(`, `\(`,
		`)`, `\)`,
		`-`, `\-`,
		`+`, `\+`,
		`=`, `\=`,
		`~`, `\~`,
		`|`, `\|`, // Pipe é especialmente importante no OR de tags: {tag1|tag2}
	)
	return replacer.Replace(tag)
}
