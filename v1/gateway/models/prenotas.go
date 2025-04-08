package models

import "time"

type Prenota struct {
	REC         int       `json:"rec"`
	F4Tranfil   string    `json:"f4_tranfil"`
	F1Filial    string    `json:"f1_filial"`
	F1Doc       string    `json:"f1_doc"`
	F1Serie     string    `json:"f1_serie"`
	F1Status    string    `json:"f1_status"`
	A2Cod       string    `json:"a2_cod"`
	A2Loja      string    `json:"a2_loja"`
	A2Nome      string    `json:"a2_nome"`
	Fornece     string    `json:"fornece"`
	F1Emissao   string    `json:"f1_emissao"`
	F1DtDigit   string    `json:"f1_dtdigit"`
	F1ValBrut   float64   `json:"f1_valbrut"`
	F1XTipo     string    `json:"f1_xtipo"`
	F1XPrior    string    `json:"f1_xprior"`
	F1XOri      string    `json:"f1_xori"`
	F1XUsrRa    string    `json:"f1_xusrra"`
	F1XObs      string    `json:"f1_xobs"`
	F1ZObsRev   string    `json:"f1_zobsrev"`
	F1XRev      string    `json:"f1_xrev"`
	Usuario     string    `json:"usuario"`
	Vencimento  string    `json:"vencimento"`
	Z07Desc     string    `json:"z07_desc"`
	Z07Chave    string    `json:"z07_chave"`
	LastUpdated time.Time `json:"last_updated"` // Para rastrear mudanças
}