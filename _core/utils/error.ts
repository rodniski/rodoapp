// src/utils/logger.ts

/**
 * @file Módulo de logging reutilizável e configurável para a aplicação.
 * Suporta diferentes níveis de log, transportes (console, remoto) e
 * formatação condicional para ambientes de desenvolvimento e produção.
 */

//* --- Definições de Nível de Log ---
export enum LogLevel {
  DEBUG = 0, // Logs detalhados para debugging.
  INFO = 1, // Eventos gerais da aplicação.
  WARN = 2, // Alertas sobre potenciais problemas.
  ERROR = 3, // Erros que não quebram a aplicação, mas precisam de atenção.
  FATAL = 4, // Erros críticos que podem quebrar a aplicação.
}

// Mapeamento de níveis para nomes amigáveis
const LOG_LEVEL_NAMES: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: "DEBUG",
  [LogLevel.INFO]: "INFO",
  [LogLevel.WARN]: "WARN",
  [LogLevel.ERROR]: "ERROR",
  [LogLevel.FATAL]: "FATAL",
};

//* --- Configuração Inicial ---
// Define o nível de log com base em variáveis de ambiente.
const getLogLevel = (): LogLevel => {
  // NEXT_PUBLIC_LOG_LEVEL para acesso no client-side, LOG_LEVEL para server-side
  const envLogLevel = (
    typeof window === "undefined"
      ? process.env.LOG_LEVEL
      : process.env.NEXT_PUBLIC_LOG_LEVEL
  )?.toUpperCase();

  switch (envLogLevel) {
    case "DEBUG":
      return LogLevel.DEBUG;
    case "INFO":
      return LogLevel.INFO;
    case "WARN":
      return LogLevel.WARN;
    case "ERROR":
      return LogLevel.ERROR;
    case "FATAL":
      return LogLevel.FATAL;
    default:
      // Em produção, o padrão é INFO. Em desenvolvimento, DEBUG.
      return process.env.NODE_ENV === "production"
        ? LogLevel.INFO
        : LogLevel.DEBUG;
  }
};

let currentLogLevel: LogLevel = getLogLevel();
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "MinhaApp"; // Nome do serviço/aplicação

interface LogContext {
  [key: string]: any; // Permite anexar qualquer dado contextual.
}

//* --- Transportes de Log ---
// Funções responsáveis por enviar o log para diferentes destinos.

/**
 * @private
 * @function consoleTransport
 * @description Envia logs para o console do navegador ou do servidor.
 * Formata a saída de forma diferente para desenvolvimento (mais legível)
 * e produção (JSON estruturado).
 */
const consoleTransport = (
  level: LogLevel,
  message: string,
  context?: LogContext,
  error?: Error
): void => {
  if (level < currentLogLevel) {
    return; // Ignora logs abaixo do nível configurado.
  }

  const timestamp = new Date().toISOString();
  const levelName = LOG_LEVEL_NAMES[level];

  // Seleciona o método do console apropriado.
  const logMethod =
    level === LogLevel.WARN
      ? console.warn
      : level >= LogLevel.ERROR
      ? console.error
      : level === LogLevel.INFO
      ? console.info
      : console.log; // DEBUG e outros.

  const baseLogOutput = {
    timestamp,
    level: levelName,
    service: APP_NAME,
    message,
  };

  let logDetails: Record<string, any> = {};

  if (context && Object.keys(context).length > 0) {
    logDetails.context = context;
  }

  if (error) {
    logDetails.error = {
      message: error.message,
      name: error.name,
      stack: error.stack?.split("\n").map((s) => s.trim()), // Limpa o stack trace
    };
  }

  if (process.env.NODE_ENV !== "production") {
    // Desenvolvimento: Saída mais legível, com objeto de detalhes.
    if (Object.keys(logDetails).length > 0) {
      logMethod(`[${levelName}] ${message}`, logDetails);
    } else {
      logMethod(`[${levelName}] ${message}`);
    }
  } else {
    // Produção: Saída em JSON estruturado, ideal para coletores de log.
    logMethod(JSON.stringify({ ...baseLogOutput, ...logDetails }));
  }
};

/**
 * @private
 * @function remoteTransport
 * @description Envia logs (especialmente erros) para um serviço de logging remoto.
 * //! Esta é uma implementação conceitual. Substitua pela integração real do seu serviço (Sentry, Logtail, etc.).
 */
const remoteTransport = (
  level: LogLevel,
  message: string,
  context?: LogContext,
  error?: Error
): void => {
  // Em produção, geralmente enviamos apenas erros ou níveis mais altos para serviços remotos.
  if (process.env.NODE_ENV !== "production" || level < LogLevel.ERROR) {
    //? Você pode querer habilitar isso para staging ou para níveis mais baixos com amostragem.
    return;
  }

  //TODO: Integrar com o SDK do seu serviço de logging preferido.
  // Exemplo com Sentry:
  // if (error) {
  //   Sentry.captureException(error, { extra: { messageOnLog: message, ...context } });
  // } else {
  //   Sentry.captureMessage(message, { level: sentryLevelMapping(level), extra: context });
  // }

  // Simulação para demonstração:
  const levelName = LOG_LEVEL_NAMES[level];
  console.log(`[SIMULATE REMOTE LOG - ${levelName}] Message: "${message}"`, {
    context,
    error: error ? { name: error.name, message: error.message } : undefined,
  });
};

//* --- API Pública do Logger ---

/**
 * @private
 * @function processLog
 * @description Função interna para processar e despachar uma entrada de log.
 */
function processLog(
  level: LogLevel,
  messageOrError: string | Error,
  context?: LogContext
): void {
  let message: string;
  let error: Error | undefined;

  if (messageOrError instanceof Error) {
    error = messageOrError;
    message = context?.overrideErrorMessage || error.message; // Permite sobrescrever a msg do erro se necessário
  } else {
    message = messageOrError;
  }

  // Despacha para todos os transportes configurados.
  consoleTransport(level, message, context, error);
  remoteTransport(level, message, context, error); // É "fire-and-forget"
}

/**
 * @description Objeto Logger principal com métodos para cada nível de log.
 */
const logger = {
  debug: (message: string, context?: LogContext): void =>
    processLog(LogLevel.DEBUG, message, context),
  info: (message: string, context?: LogContext): void =>
    processLog(LogLevel.INFO, message, context),
  warn: (message: string, context?: LogContext): void =>
    processLog(LogLevel.WARN, message, context),
  /**
   * @description Registra um erro. Pode receber uma string ou um objeto Error.
   * Se um objeto Error for fornecido, seus detalhes (mensagem, stack) serão logados.
   * @param messageOrError Mensagem de erro ou o objeto Error.
   * @param context Dados contextuais adicionais para o log.
   * Use `context.overrideErrorMessage` para uma mensagem de log customizada quando passar um Error.
   */
  error: (messageOrError: string | Error, context?: LogContext): void =>
    processLog(LogLevel.ERROR, messageOrError, context),
  fatal: (messageOrError: string | Error, context?: LogContext): void =>
    processLog(LogLevel.FATAL, messageOrError, context),

  /**
   * @description Permite ajustar o nível de log em tempo de execução.
   * Útil para depuração dinâmica em ambientes de desenvolvimento ou staging.
   * @param level Novo nível de log a ser definido.
   */
  setLogLevel: (level: LogLevel): void => {
    const oldLevelName = LOG_LEVEL_NAMES[currentLogLevel];
    const newLevelName = LOG_LEVEL_NAMES[level];
    currentLogLevel = level;
    // Loga a mudança de nível para informar o desenvolvedor.
    processLog(
      LogLevel.INFO,
      `Nível de log alterado de ${oldLevelName} para ${newLevelName}.`
    );
  },

  /**
   * @description Obtém o nível de log atualmente configurado.
   * @returns O nível de log atual.
   */
  getLogLevel: (): LogLevel => currentLogLevel,
};

//* --- Inicialização e Exportação ---
// O logger é configurado no momento da importação com base nas variáveis de ambiente.
// Uma mensagem de inicialização pode ser útil para verificar a configuração.
// logger.info("Logger inicializado.", {
//   configuredLogLevel: LOG_LEVEL_NAMES[currentLogLevel],
//   environment: process.env.NODE_ENV,
// });

export default logger;
