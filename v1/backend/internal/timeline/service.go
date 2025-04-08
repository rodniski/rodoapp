package timeline

import (
	"context"
	"database/sql"
	"github.com/rodniski/websocket/internal/config"
	"log"
	"sort"
	"time"
)

// 📌 Converte `sql.NullString` para `string`
func toString(ns sql.NullString) string {
	if ns.Valid {
		return ns.String
	}
	return ""
}

// 📌 Categoriza os eventos conforme a estrutura do Rust
func CategorizarEventos(eventos []EventoTimeline) []map[string]interface{} {
	timeline := []map[string]interface{}{}
	seen := make(map[string]bool)

	// 🚀 Itera pelos eventos para agrupar corretamente
	for _, evento := range eventos {
		// 📌 PEDIDOS
		if evento.Pedido != "" {
			key := "PEDIDOS-" + evento.Pedido
			if !seen[key] {
				timeline = append(timeline, map[string]interface{}{
					"categoria":        "PEDIDOS",
					"pedido":           evento.Pedido,
					"usuario_do_pedido": evento.UsuarioPedido,
					"emissao_pedido":   evento.EmissaoPedido,
				})
				seen[key] = true
			}
		}

		// 📌 EMISSÃO NF
		if evento.EmissaoNF != "" {
			key := "EMISSAO_NF-" + evento.EmissaoNF
			if !seen[key] {
				timeline = append(timeline, map[string]interface{}{
					"categoria":      "EMISSÃO NF",
					"cod_fornecedor": evento.CodFornecedor,
					"fornecedor":     evento.Fornecedor,
					"loja":           evento.Loja,
					"emissao_nf":     evento.EmissaoNF,
				})
				seen[key] = true
			}
		}

		// 📌 HISTÓRICO
		if evento.Campo != "" {
			key := "HISTORICO-" + evento.Campo
			if !seen[key] {
				timeline = append(timeline, map[string]interface{}{
					"categoria":           "HISTÓRICO",
					"campo":               evento.Campo,
					"observacao_historico": evento.ObservacaoHistorico,
					"usuario_historico":   evento.UsuarioHistorico,
					"data_historico":      evento.DataHistorico,
					"hora_historico":      evento.HoraHistorico,
				})
				seen[key] = true
			}
		}

		// 📌 CLASSIFICAÇÃO DA NOTA
		if evento.DataClassificacao != "" {
			key := "CLASSIFICACAO-" + evento.DataClassificacao
			if !seen[key] {
				timeline = append(timeline, map[string]interface{}{
					"categoria":          "CLASSIFICAÇÃO DA NOTA",
					"data_classificacao": evento.DataClassificacao,
				})
				seen[key] = true
			}
		}

		// 📌 TÍTULOS
		if evento.NumeroParcela != "" {
			key := "TITULOS-" + evento.NumeroParcela
			if !seen[key] {
				timeline = append(timeline, map[string]interface{}{
					"categoria":   "TÍTULOS",
					"parcela":     evento.NumeroParcela,
					"vencimento":  evento.Vencimento,
					"baixa":       evento.DataBaixa,
				})
				seen[key] = true
			}
		}
	}

	// 📌 Ordena categorias na sequência correta
	categoryOrder := map[string]int{
		"PEDIDOS":               1,
		"EMISSÃO NF":            2,
		"PRÉ DOCUMENTO ENTRADA": 3,
		"HISTÓRICO":             4,
		"CLASSIFICAÇÃO DA NOTA": 5,
		"TÍTULOS":               6,
	}

	sort.Slice(timeline, func(i, j int) bool {
		return categoryOrder[timeline[i]["categoria"].(string)] < categoryOrder[timeline[j]["categoria"].(string)]
	})

	return timeline
}

// 🚀 **Busca eventos da timeline no SQL filtrando por `REC_F1`**
func GetTimelineFromSQL(db *sql.DB, recF1 int64) ([]map[string]interface{}, error) {
	query := config.GetSQLQueryTimelineEventos() // ✅ Usa a query do módulo `config`
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	rows, err := db.QueryContext(ctx, query, sql.Named("rec_f1", recF1))
	if err != nil {
		log.Println("❌ Erro ao executar query da timeline:", err)
		return nil, err
	}
	defer rows.Close()

	var eventos []EventoTimeline
	for rows.Next() {
		var evento EventoTimeline
		var pedido, usuarioPedido, emissaoPedido, nota, serie, emissaoNF sql.NullString
		var codFornecedor, fornecedor, loja, dataClassificacao, numeroParcela sql.NullString
		var vencimento, dataBaixa, campo, observacaoHistorico, usuarioHistorico sql.NullString
		var dataHistorico, horaHistorico sql.NullString

		err := rows.Scan(
			&evento.Filial, &pedido, &usuarioPedido, &emissaoPedido,
			&nota, &serie, &emissaoNF, &codFornecedor,
			&fornecedor, &loja, &dataClassificacao, &evento.RecF1,
			&numeroParcela, &vencimento, &dataBaixa, &campo,
			&observacaoHistorico, &usuarioHistorico, &dataHistorico, &horaHistorico,
		)
		if err != nil {
			log.Println("❌ Erro ao escanear evento da timeline:", err)
			continue
		}

		// ✅ **Convertendo NULL para string vazia**
		evento.Pedido = toString(pedido)
		evento.UsuarioPedido = toString(usuarioPedido)
		evento.EmissaoPedido = toString(emissaoPedido)
		evento.Nota = toString(nota)
		evento.Serie = toString(serie)
		evento.EmissaoNF = toString(emissaoNF)
		evento.CodFornecedor = toString(codFornecedor)
		evento.Fornecedor = toString(fornecedor)
		evento.Loja = toString(loja)
		evento.DataClassificacao = toString(dataClassificacao)
		evento.NumeroParcela = toString(numeroParcela)
		evento.Vencimento = toString(vencimento)
		evento.DataBaixa = toString(dataBaixa)
		evento.Campo = toString(campo)
		evento.ObservacaoHistorico = toString(observacaoHistorico)
		evento.UsuarioHistorico = toString(usuarioHistorico)
		evento.DataHistorico = toString(dataHistorico)
		evento.HoraHistorico = toString(horaHistorico)

		eventos = append(eventos, evento)
	}

	log.Printf("✅ Encontrados %d eventos para REC_F1=%d\n", len(eventos), recF1)
	return CategorizarEventos(eventos), nil
}
