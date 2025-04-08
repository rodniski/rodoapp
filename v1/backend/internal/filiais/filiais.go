package filiais

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
)

// FilialAPI representa como vem cada filial no JSON da API externa,
// com todos os campos originais (M0_CODFIL, etc.). Mas vamos usar só o código.
type FilialAPI struct {
	M0_CODFIL string `json:"M0_CODFIL"`
}

// CargaInicioResponse representa o JSON que a API retorna (só a parte "Filiais")
// Estamos ignorando UnidadeMedida, Condicoes, etc.
type CargaInicioResponse struct {
	Filiais []FilialAPI `json:"Filiais"`
}

// Filial é a struct "simplificada" que vamos retornar internamente
// apenas com o campo codFil no JSON.
type Filial struct {
	CodFil string `json:"codFil"`
}

// GetFiliaisFromAPI faz um GET em "cargaInicio",
// usando o header "usr" com o valor de username.
// Depois, converte os dados para []Filial (só codFil).
func GetFiliaisFromAPI(username string) ([]Filial, error) {
	url := "http://172.16.99.174:8400/rest/reidoapsdu/consultar/cargaInicio"

	// Cria a requisição
	req, err := http.NewRequest(http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}
	// Header "usr" é obrigatório para a API
	req.Header.Set("usr", username)

	// Executa a requisição
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	// Verifica se retornou 200 OK
	if resp.StatusCode != http.StatusOK {
		return nil, errors.New(fmt.Sprintf("status inesperado da API: %d", resp.StatusCode))
	}

	// Lê o body
	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	// Faz unmarshal na struct que representa o JSON
	var carga CargaInicioResponse
	if err := json.Unmarshal(bodyBytes, &carga); err != nil {
		return nil, err
	}

	// Converte de FilialAPI para Filial (só mantendo codFil)
	var filiais []Filial
	for _, fa := range carga.Filiais {
		filiais = append(filiais, Filial{
			CodFil: fa.M0_CODFIL,
		})
	}

	return filiais, nil
}
