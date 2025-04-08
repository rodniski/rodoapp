package timeline

type EventoTimeline struct {
	Filial              string `json:"filial"`
	Pedido              string `json:"pedido"`
	UsuarioPedido       string `json:"usuario_pedido"`
	EmissaoPedido       string `json:"emissao_pedido"`
	Nota                string `json:"nota"`
	Serie               string `json:"serie"`
	EmissaoNF           string `json:"emissao_nf"`
	CodFornecedor       string `json:"cod_fornecedor"`
	Fornecedor          string `json:"fornecedor"`
	Loja                string `json:"loja"`
	DataClassificacao   string `json:"data_classificacao"`
	RecF1               int64  `json:"rec_f1"`
	NumeroParcela       string `json:"numero_parcela"`
	Vencimento          string `json:"vencimento"`
	DataBaixa           string `json:"data_baixa"`
	Campo               string `json:"campo"`
	ObservacaoHistorico string `json:"observacao_historico"`
	UsuarioHistorico    string `json:"usuario_historico"`
	DataHistorico       string `json:"data_historico"`
	HoraHistorico       string `json:"hora_historico"`
}
