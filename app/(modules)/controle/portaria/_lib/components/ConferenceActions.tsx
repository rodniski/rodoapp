"use client";

import React, { useState } from "react";
import { Check, X } from "lucide-react";
import { AnimatedButton } from "@borracharia/components";
import { ConferenceDialog } from ".";
import { ConferenceActionsProps } from "../types";
import { getCurrentUsername } from "utils";
import { useMovConferenciaSaida, useMovEstornoSaida } from "../hooks";

const ConferenceActions: React.FC<ConferenceActionsProps> = ({ produto }) => {
    const [openApprove, setOpenApprove] = useState(false);
    const [openReject, setOpenReject] = useState(false);
    const username = getCurrentUsername();
    const [isLoadingApprove, setIsLoadingApprove] = useState(false);
    const [isLoadingReject, setIsLoadingReject] = useState(false);

    if (!username) {
        return null;
    }

    const { mutateAsync: approve } = useMovConferenciaSaida();
    const { mutateAsync: reject } = useMovEstornoSaida();

    const handleApprove = async () => {
        setIsLoadingApprove(true);
        try {
            await approve({ Sequencia: produto.Sequencia, RespConf: username });
            console.log("[ConferenceActions] Conferência aprovada!");
            setOpenApprove(false); // Fecha o diálogo
            window.location.reload(); // Força o recarregamento da tela
        } catch (error: any) {
            console.error("[ConferenceActions] Erro ao confirmar conferência:", 
                {
                    message: error.message,
                    status: error.response?.status,
                    responseData: error.response?.data,
                }
            );
        } finally {
            setIsLoadingApprove(false);
        }
    };

    const handleReject = async () => {
        setIsLoadingReject(true);
        try {
            await reject({ Sequencia: produto.Sequencia, RespEstor: username, OrigemEst: "p" });
           
            console.log("[ConferenceActions] Entrega recusada!");
            setOpenReject(false); // Fecha o diálogo
            // Opcional: window.location.reload() aqui também, se quiser recarregar na rejeição
        } catch (error: any) {
            console.error("[ConferenceActions] Erro ao recusar entrega:", {
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