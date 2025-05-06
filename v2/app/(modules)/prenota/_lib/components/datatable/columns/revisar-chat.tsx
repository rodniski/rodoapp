// HistoricoChatView.tsx
"use client";

import React from "react";
import { useHistoricoPreNota } from "@prenota/hooks";
import type { HistoricoEntry } from "@prenota/types";
import { cn, formatUsername } from "utils"; // Mantendo seu formatUsername
import { Separator } from "ui";

interface HistoricoChatViewProps {
  recId: string | number | null | undefined;
  currentLoggedInUsername: string;
}

const HistoricoChatView: React.FC<HistoricoChatViewProps> = ({
  recId,
  currentLoggedInUsername,
}) => {
  const recIdAsString = typeof recId === "number" ? recId.toString() : recId;

  const {
    data: historicoCompleto,
    isLoading,
    isError,
    error,
  } = useHistoricoPreNota(recIdAsString);

  const statusMessageBaseClasses = "text-center text-muted-foreground py-4";
  const statusContainerClasses =
    "max-h-96 overflow-y-auto rounded-lg border bg-background p-4";

  // ... (estados de loading, error, sem recId, sem revisões filtradas - permanecem os mesmos) ...
  if (!recId) {
    return (
      <div className={statusContainerClasses}>
        <p className={statusMessageBaseClasses}>
          Nenhuma pré-nota selecionada para exibir o histórico de revisões.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={statusContainerClasses}>
        <p className={statusMessageBaseClasses}>
          Carregando histórico de revisões...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={statusContainerClasses}>
        <p className={`${statusMessageBaseClasses} text-destructive`}>
          Erro ao carregar histórico: {error?.message || "Erro desconhecido"}
        </p>
      </div>
    );
  }

  const revisoesFiltradas =
    historicoCompleto?.filter((entry) => entry.campo === "F1_ZOBSREV") || [];

  if (revisoesFiltradas.length === 0) {
    return (
      <div className={statusContainerClasses}>
        <p className={statusMessageBaseClasses}>
          Nenhuma observação de revisão (F1_ZOBSREV) encontrada para esta
          pré-nota.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-3 p-4 h-full overflow-y-auto rounded-lg border bg-muted/50 custom-scrollbar">
      {revisoesFiltradas.map((entry: HistoricoEntry, index: number) => {
        const rawTimestamp = entry.timestamp
          ? new Date(entry.timestamp).toLocaleString() // Se tiver timestamp, use-o e formate
          : `${entry.data} ${entry.hora}`; // Caso contrário, combine data e hora

        // Dividindo o timestamp em data e hora
        // Assumindo que rawTimestamp será "DD/MM/YYYY, HH:MM:SS" ou "DD/MM/YYYY HH:MM:SS"
        let datePart = "";
        let timePart = "";

        if (rawTimestamp.includes(",")) {
          [datePart, timePart] = rawTimestamp.split(", ");
        } else if (rawTimestamp.includes(" ")) {
          // Fallback se não houver vírgula mas houver espaço
          const parts = rawTimestamp.split(" ");
          datePart = parts[0];
          timePart = parts.slice(1).join(" "); // Pega o resto como hora
        } else {
          datePart = rawTimestamp; // Se não conseguir dividir, mostra o rawTimestamp como data
        }

        const key = `${entry.chave}-${entry.data}-${entry.hora}-${entry.campo}-${index}`;
        const isCurrentUserMessage = entry.usuario === currentLoggedInUsername;

        return (
          <div
            key={key}
            className={cn(
              "flex flex-col rounded-xl p-3 shadow-sm border max-w-[85%] sm:max-w-[75%]",
              isCurrentUserMessage
                ? "self-end bg-muted text-primary-foreground" // Estilo do seu último código para usuário logado
                : "self-start bg-primary text-card-foreground" // Estilo do seu último código para outros usuários
            )}
          >
            <div className="flex items-center justify-between mb-1">
              {" "}
              {/* items-start para alinhar melhor com multi-linhas */}
              {/* Usuário */}
              <div className="flex-grow mr-2">
                {" "}
                {/* Adicionado flex-grow e mr-2 para o nome não colidir com timestamp */}
                {!isCurrentUserMessage && (
                  <span
                    className={cn(
                      "font-semibold",
                      // Cor para nome de outros usuários (usando text-card-foreground que é o texto principal do balão bg-primary)
                      "text-card-foreground/90" // Ou uma cor específica se preferir
                    )}
                  >
                    {formatUsername(entry.usuario) || "Desconhecido"}
                  </span>
                )}
                {isCurrentUserMessage && (
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      // Cor para "Você" (usando text-primary-foreground que é o texto principal do balão bg-muted)
                      "text-primary-foreground/90"
                    )}
                  >
                    Você
                  </span>
                )}
              </div>
              {/* Timestamp Dividido */}
              <div
                className={cn(
                  "flex flex-col text-end text-xs shrink-0 pl-2 font-semibold", // shrink-0 para não ser comprimido
                  isCurrentUserMessage
                    ? "text-muted-foreground" // Cor do timestamp no balão do usuário atual
                    : "text-primary-foreground" // Cor do timestamp no balão de outros (ajuste se text-primary-foreground for muito claro/escuro)
                  // Ou poderia ser text-card-foreground/70 para consistência com o texto do balão
                )}
              >
                {datePart && <span>{datePart}</span>}
                {timePart && <span>{timePart}</span>}
              </div>
            </div>
            <Separator />
            {/* Conteúdo da Mensagem */}
            <p
              className={cn(
                "pt-2 text-xs whitespace-pre-wrap break-words",
                isCurrentUserMessage
                  ? "text-primary-foreground"
                  : "text-card-foreground"
              )}
            >
              {entry.atual}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export { HistoricoChatView };
