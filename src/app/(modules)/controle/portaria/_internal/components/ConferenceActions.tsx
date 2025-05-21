"use client";

import React, { useState } from "react";
import { Check, X } from "lucide-react";
import { AnimatedButton } from "@borracharia/components";
import { ConferenceDialog } from ".";
import axios from "axios";
import {config} from "logic";
import { ConferenceActionsProps } from "../types";
import { getCurrentUsername } from "utils";


const ConferenceActions: React.FC<ConferenceActionsProps> = ({ produto }) => {
    const [openApprove, setOpenApprove] = useState(false);
    const [openReject, setOpenReject] = useState(false);
    const [username] = getCurrentUsername();
    const [isLoadingApprove, setIsLoadingApprove] = useState(false);
    const [isLoadingReject, setIsLoadingReject] = useState(false);

    if (!username) {
        return null;
    }


    const handleApprove = async () => {
        setIsLoadingApprove(true);
        try {
            const url = `${config.API_BORRACHARIA_URL}MovPortaria/ConferenciaSaida`;
            const queryParams = {
                Sequencia: produto.Sequencia,
                RespConf: username,
            };
            const response = await axios.post(url, "", {
                params: queryParams,
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log("[ConferenceActions] Conferência aprovada:", response.data);
            setOpenApprove(false); // Fecha o diálogo
            window.location.reload(); // Força o recarregamento da tela
        } catch (error: any) {
            console.log("[ConferenceActions] Erro ao aprovar entrega:", {
                message: error.message,
                status: error.response?.status,
                responseData: error.response?.data,
            });
        } finally {
            setIsLoadingApprove(false);
        }
    };

    const handleReject = async () => {
        setIsLoadingReject(true);
        try {
            const url = `${config.API_BORRACHARIA_URL}MovPortaria/EstornoSaida`;
            const queryParams = {
                Sequencia: produto.Sequencia,
                RespEstor: username,
                OriEstorno: "p",
            };
            const response = await axios.post(url, "", {
                params: queryParams,
                headers: {
                    "Content-Type": "application/json",
                },
            });
            console.log("[ConferenceActions] Entrega recusada:", response.data);
            setOpenReject(false); // Fecha o diálogo
            // Opcional: window.location.reload() aqui também, se quiser recarregar na rejeição
        } catch (error: any) {
            console.log("[ConferenceActions] Erro ao recusar entrega:", {
                message: error.message,
                status: error.response?.status,
                responseData: error.response?.data,
            });
        } finally {
            setIsLoadingReject(false);
        }
    };

    const isLoading = isLoadingApprove || isLoadingReject;

    return (
        <div className="flex gap-2">
            {/* Botão Recusar */}
            <div>
                <AnimatedButton
                    icon={<X className="h-4 w-4" />}
                    text="Recusar"
                    variant="destructive"
                    onClick={() => setOpenReject(true)}
                    disabled={isLoading}
                />
                <ConferenceDialog
                    produto={produto}
                    isOpen={openReject}
                    onClose={() => setOpenReject(false)}
                    onConfirm={handleReject}
                    isLoading={isLoadingReject}
                    title="Você está recusando a entrega de:"
                    confirmText="Recusar Entrega"
                    variant="destructive"
                />
            </div>

            {/* Botão Confirmar */}
            <div>
                <AnimatedButton
                    icon={<Check className="h-4 w-4" />}
                    text="Confirmar"
                    variant="default"
                    onClick={() => setOpenApprove(true)}
                    disabled={isLoading}
                />
                <ConferenceDialog
                    produto={produto}
                    isOpen={openApprove}
                    onClose={() => setOpenApprove(false)}
                    onConfirm={handleApprove}
                    isLoading={isLoadingApprove}
                    title="Você está confirmando a entrega de:"
                    confirmText="Confirmar Entrega"
                />
            </div>
        </div>
    );
};

export default ConferenceActions;