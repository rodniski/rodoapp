package prenotas

// PreNota define a estrutura de dados de uma pré-nota.
// Os campos devem corresponder ao que é lido do SQL e salvo/lido do Redis Hash.
type PreNota struct {
	Rec       int64   `json:"rec"`        // SF1.R_E_C_N_O_
	F4Tranfil string  `json:"f4Tranfil"`  // F4_TRANFIL
	F1Filial  string  `json:"f1Filial"`   // F1_FILIAL
	F1Doc     string  `json:"f1Doc"`      // F1_DOC
	F1Serie   string  `json:"f1Serie"`    // F1_SERIE
	F1Status  string  `json:"f1Status"`   // F1_STATUS
	A2Cod     string  `json:"a2Cod"`      // A2_COD
	A2Loja    string  `json:"a2Loja"`     // A2_LOJA
	A2Nome    string  `json:"a2Nome"`     // A2_NOME
	Fornece   string  `json:"fornece"`    // A2_COD + ' ' + A2_LOJA + ' - ' + A2_NOME
	F1Emissao string  `json:"f1Emissao"`  // F1_EMISSAO (YYYYMMDD string)
	F1DtDigit string  `json:"f1DtDigit"`  // F1_DTDIGIT (YYYYMMDD string)
	F1ValBrut float64 `json:"f1ValBrut"`  // SUM(D1_TOTAL)
	F1XTipo   string  `json:"f1XTipo"`    // F1_XTIPO
	F1XPrior  string  `json:"f1XPrior"`   // F1_XPRIOR
	F1XOri    string  `json:"f1XOri"`     // F1_XORI
	F1XUsrra  string  `json:"f1XUsrra"`   // F1_XUSRRA
	F1XObs    string  `json:"f1XObs"`     // F1_XOBS
	F1ZObsRev string  `json:"f1ZObsRev"`  // F1_ZOBSREV
	F1XRev    string  `json:"f1XRev"`     // F1_XREV
	Usuario   string  `json:"usuario"`    // Substring / manipulação do F1_USERLGI
	Vencimento string `json:"vencimento"` // Z10.Z10_VENCTO (YYYYMMDD string)
	Anexo     string  `json:"anexo"`      // Z07_DESC
	AnexoPath string  `json:"anexoPath"`  // Z07_CHAVE
}

// QueryParams define os parâmetros aceitos pela busca no Redis via RediSearch.
type QueryParams struct {
	UserFiliais  []string // Filiais permitidas para o usuário (não vem da URL, obtido internamente)
	GlobalSearch string   // Termo de busca global (query param 'q')
	Tipo         string   // Filtro por tipo (query param 'tipo')
	Status       string   // Filtro por status (query param 'status')
	SortBy       string   // Campo para ordenar (query param 'sortBy') - deve corresponder a um campo SORTABLE no índice
	SortOrder    string   // Ordem ASC ou DESC (query param 'sortOrder')
	Page         int      // Número da página (query param 'page')
	PageSize     int      // Itens por página (query param 'pageSize')
}

// PaginatedPreNotasResult define a estrutura da resposta da API
// com os dados da página atual e metadados de paginação.
type PaginatedPreNotasResult struct {
	Items       []PreNota `json:"items"`        // A lista de pré-notas da página atual
	TotalItems  int64     `json:"totalItems"`   // Total de itens que correspondem aos filtros (sem paginação)
	TotalPages  int       `json:"totalPages"`   // Número total de páginas
	CurrentPage int       `json:"currentPage"`  // A página atual retornada
	PageSize    int       `json:"pageSize"`     // O número de itens por página solicitado
}