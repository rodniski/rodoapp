"use client";

import React from "react";
import { AnimatedButton } from "@/app/(modules)/controle/borracharia/_lib/components/buttons/AnimationButton";
import { BorrachariaItem, ItemNF } from "../../types";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { useBorrachariaStore } from "../../stores";
import axios from "axios";

interface EnviarButtonProps {
    item: BorrachariaItem;
    respRet: string;
    placa: string;
    obs: string;
    respCarreg: string;
    retirado: string; // Adiciona retirado
    onSuccess?: () => void;
}

export function EnviarButton({
                                 item,
                                 respRet,
                                 placa,
                                 obs,
                                 respCarreg,
                                 retirado,
                                 onSuccess,
                             }: EnviarButtonProps) {
    const selectedItems = useBorrachariaStore((state) => state.selectedItems);

    const handleSend = async () => {
        console.log("[EnviarButton] Iniciando handleSend", {
            itemDoc: item.Doc,
            respRet,
            placa,
            retirado,
            selectedItemsCount: selectedItems.length,
        });

        try {
            if (!respRet) {
                console.warn("[EnviarButton] Validação falhou: responsável pela retirada não informado");
                toast.error("Informe o responsável pela retirada.");
                return;
            }
            if (!placa) {
                console.warn("[EnviarButton] Validação falhou: placa do veículo não informada");
                toast.error("Informe a placa do veículo.");
                return;
            }

            const itemsToDeliver = selectedItems.filter(
                (itemNF: ItemNF) => itemNF.SaldoSelecionado > 0
            );
            console.log("[EnviarButton] Itens a entregar filtrados", {
                itemsToDeliverCount: itemsToDeliver.length,
                itemsToDeliver,
            });

            if (itemsToDeliver.length === 0) {
                console.warn("[EnviarButton] Validação falhou: nenhum item com quantidade a entregar");
                toast.error("Informe a quantidade a entregar para pelo menos um item.");
                return;
            }

            const requests = itemsToDeliver.map((itemNF: ItemNF) => {
                const url = "http://172.16.0.245:9011/rest/MovPortaria/CarregaSaida";
                const queryParams = {
                    Filial: item.Filial || "",
                    Origem: "S",
                    Doc: item.Doc || "",
                    Serie: item.Serie || "3",
                    CodCliente: item.CodCliente || "",
                    Loja: item.Loja || "",
                    ProdutoCod: itemNF.ProdutoCod,
                    Item: itemNF.Item,
                    Retirado: retirado, // Usa o valor do Switch
                    RespRet: respRet,
                    Placa: placa,
                    Obs: obs || "",
                    RespCarreg: respCarreg || "",
                    Quantidade: itemNF.SaldoSelecionado,
                };
                console.log("[EnviarButton] Preparando requisição", {
                    url,
                    queryParams,
                });
                return axios.post(url, "", {
                    params: queryParams,
                    headers: {
                        "User-Agent": "Apidog/1.0.0 (https://apidog.com)",
                        "Content-Type": "application/json",
                    },
                });
            });

            console.log("[EnviarButton] Enviando requisições para a API", {
                totalRequests: requests.length,
            });
            const responses = await Promise.all(requests);
            console.log("[EnviarButton] Respostas recebidas da API", {
                responses: responses.map((r : any) => ({
                    status: r.status,
                    data: r.data,
                })),
            });

            toast.success("Entregas registradas com sucesso!");
            console.log("[EnviarButton] Sucesso no envio, chamando onSuccess");
            onSuccess?.();
        } catch (error: any) {
            console.error("[EnviarButton] Erro ao registrar entrega", {
                message: error.message,
                status: error.response?.status,
                responseData: error.response?.data,
                requestConfig: error.config,
            });
            toast.error(`Erro ao registrar entrega: ${error.message}`);
        }
    };

    return (
        <AnimatedButton
            text="Enviar"
            icon={<Send />}
            variant="success"
            onClick={handleSend}
        />
    );
}