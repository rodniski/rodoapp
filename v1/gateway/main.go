package main

import (
	"gateway/pkg/gateway"
)

func main() {
	gw, err := gateway.NewGateway()
	if err != nil {
		panic(err) // O logger já trata o erro em NewGateway
	}
	defer gw.Close()

	gw.Run()
}