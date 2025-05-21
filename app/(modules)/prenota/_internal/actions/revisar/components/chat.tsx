"use client";

import React from "react";
import { useHistoricoPreNota } from "@prenota/actions";
import type {
  HistoricoChatViewProps,
  MessageProps,
  TimestampProps,
} from "@prenota/actions";
import { cn, formatUsername } from "utils";
import { Separator } from "ui";

const Timestamp: React.FC<TimestampProps> = ({ timestamp, isCurrentUser }) => {
  let datePart = "";
  let timePart = "";

  if (timestamp.includes(",")) {
    [datePart, timePart] = timestamp.split(", ");
  } else if (timestamp.includes(" ")) {
    const parts = timestamp.split(" ");
    datePart = parts[0];
    timePart = parts.slice(1).join(" ");
  } else {
    datePart = timestamp;
  }

  return (
    <div
      className={cn(
        "flex flex-col text-end text-xs shrink-0 pl-2 font-semibold",
        isCurrentUser ? "text-muted-foreground" : "text-primary-foreground"
      )}
    >
      {datePart && <span>{datePart}</span>}
      {timePart && <span>{timePart}</span>}
    </div>
  );
};

const Message: React.FC<MessageProps> = ({ entry, isCurrentUser, index }) => {
  const rawTimestamp = entry.timestamp
    ? new Date(entry.timestamp).toLocaleString()
    : `${entry.data} ${entry.hora}`;

  return (
    <div
      key={`${entry.chave}-${entry.data}-${entry.hora}-${entry.campo}-${index}`}
      className={cn(
        "flex flex-col rounded-xl p-3 shadow-sm border min-w-[50%] max-w-[60%]",
        isCurrentUser
          ? "self-end bg-muted"
          : "self-start bg-primary text-card-foreground"
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex-grow mr-2">
          <span
            className={cn(
              "font-semibold",
              isCurrentUser
                ? "text-primary text-base"
                : "text-card-foreground/90"
            )}
          >
            {isCurrentUser
              ? "Você"
              : formatUsername(entry.usuario) || "Desconhecido"}
          </span>
        </div>
        <Timestamp timestamp={rawTimestamp} isCurrentUser={isCurrentUser} />
      </div>
      <Separator />
      <p
        className={cn(
          "pt-2 text-sm whitespace-pre-wrap break-words",
          isCurrentUser ? "text-primary" : "text-card-foreground"
        )}
      >
        {entry.atual}
      </p>
    </div>
  );
};

const StatusMessage: React.FC<{ message: string; isError?: boolean }> = ({
  message,
  isError,
}) => (
  <div className="p-4">
    <p
      className={cn(
        "text-center text-muted-foreground py-4",
        isError && "text-destructive"
      )}
    >
      {message}
    </p>
  </div>
);

const HistorySection: React.FC<{
  recId: string | number;
  username: string;
  children: React.ReactNode;
}> = ({ recId, username, children }) => (
  <div className="flex flex-col w-full h-full border-r border-border overflow-hidden">
    <div className="p-4 shrink-0 border-b border-border">
      <h4 className="font-semibold text-foreground">
        Histórico de Observações
      </h4>
    </div>
    <div className="flex-grow overflow-y-auto custom-scrollbar p-2 md:p-4">
      {children}
    </div>
  </div>
);

const HistoricoChatView: React.FC<HistoricoChatViewProps> = ({
  recId,
  currentLoggedInUsername,
}) => {
  const recIdAsString = String(recId);
  const {
    data: historicoCompleto,
    isLoading,
    isError,
    error,
  } = useHistoricoPreNota(recIdAsString);

  if (!recId) {
    return (
      <HistorySection recId={recIdAsString} username={currentLoggedInUsername}>
        <StatusMessage message="Nenhuma pré-nota selecionada para exibir o histórico de revisões." />
      </HistorySection>
    );
  }

  if (isLoading) {
    return (
      <HistorySection recId={recId} username={currentLoggedInUsername}>
        <StatusMessage message="Carregando histórico de revisões..." />
      </HistorySection>
    );
  }

  if (isError) {
    return (
      <HistorySection recId={recId} username={currentLoggedInUsername}>
        <StatusMessage
          message={`Erro ao carregar histórico: ${
            error?.message || "Erro desconhecido"
          }`}
          isError
        />
      </HistorySection>
    );
  }

  const revisoesFiltradas =
    historicoCompleto?.filter((entry) => entry.campo === "F1_ZOBSREV") || [];

  if (revisoesFiltradas.length === 0) {
    return (
      <HistorySection recId={recId} username={currentLoggedInUsername}>
        <StatusMessage message="Nenhuma observação de revisão (F1_ZOBSREV) encontrada para esta pré-nota." />
      </HistorySection>
    );
  }

  return (
    <HistorySection recId={recId} username={currentLoggedInUsername}>
      <div className="flex flex-col space-y-3">
        {revisoesFiltradas.map((entry, index) => (
          <Message
            key={`${entry.chave}-${index}`}
            entry={entry}
            isCurrentUser={entry.usuario === currentLoggedInUsername}
            index={index}
          />
        ))}
      </div>
    </HistorySection>
  );
};

export { HistoricoChatView };
