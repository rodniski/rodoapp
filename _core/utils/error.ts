import { NextResponse } from "next/server";

/**
 * Classe de erro customizado para uso em APIs.
 */
export class ApiError extends Error {
  public statusCode: number;
  public cause?: unknown;

  constructor(message: string, statusCode = 400, cause?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.cause = cause;
  }
}

/**
 * Lida com erros e gera resposta padronizada da API.
 * @param error - Erro capturado
 * @param logPrefix - Prefixo de log para contexto
 * @returns Resposta JSON com detalhes de erro
 */
export function handleApiError(
  error: unknown,
  logPrefix = "[API]"
): NextResponse {
  const timestamp = new Date().toISOString();
  let status = 500;
  let message = "Erro interno do servidor";
  let code = "internal_error";

  console.group(`${logPrefix} Erro capturado @ ${timestamp}`);

  if (error instanceof ApiError) {
    status = error.statusCode;
    message = error.message;
    code = error.name.toLowerCase();
    console.error(`[ApiError ${status}] ${message}`, error.cause ?? "");
  } else if (error instanceof Error) {
    status = 400;
    message = error.message;
    code = error.name.toLowerCase();
    console.error(`[Error ${status}] ${message}`, error.stack ?? "");
  } else {
    console.error(`[Unknown Error]`, error);
  }

  console.groupEnd();

  return NextResponse.json(
    {
      code,
      error: message,
      timestamp,
    },
    { status }
  );
}
