/* utils/logger.ts -------------------------------------------------- */
import { consola, type ConsolaInstance } from "consola";
import { NextResponse } from "next/server";

/* ─── Níveis (mantidos p/ retro-compat) ──────────────────────────── */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}
const levelMap: Record<LogLevel, keyof ConsolaInstance> = {
  [LogLevel.DEBUG]: "debug",
  [LogLevel.INFO]: "info",
  [LogLevel.WARN]: "warn",
  [LogLevel.ERROR]: "error",
  [LogLevel.FATAL]: "fatal",
};

/* ─── Instância base do Consola ──────────────────────────────────── */
const base = consola.withTag(process.env.NEXT_PUBLIC_APP_NAME ?? "app");

/* ─── Nível inicial a partir do ambiente ─────────────────────────── */
let currentLevel: LogLevel = (() => {
  const raw =
    (typeof window === "undefined"
      ? process.env.LOG_LEVEL
      : process.env.NEXT_PUBLIC_LOG_LEVEL) ?? "";
  const map: Record<string, LogLevel> = {
    DEBUG: LogLevel.DEBUG,
    INFO: LogLevel.INFO,
    WARN: LogLevel.WARN,
    ERROR: LogLevel.ERROR,
    FATAL: LogLevel.FATAL,
  };
  return (
    map[raw.toUpperCase()] ??
    (process.env.NODE_ENV === "production" ? LogLevel.INFO : LogLevel.DEBUG)
  );
})();
base.level = currentLevel;

/* ─── Remote transport placeholder (opcional) ────────────────────── */
function remote(level: LogLevel, msg: string, extra?: unknown) {
  if (process.env.NODE_ENV !== "production" || level < LogLevel.ERROR) return;
  // TODO: Sentry / Logtail / Datadog …
}

/* ─── Helpers internos ───────────────────────────────────────────── */
type Ctx = Record<string, unknown> | undefined;
type LogFn = (...args: unknown[]) => void;

function getMethod(level: LogLevel): LogFn {
  return (base as unknown as Record<string, LogFn>)[levelMap[level]];
}

function log(level: LogLevel, messageOrErr: string | Error, ctx?: Ctx) {
  const fn = getMethod(level);
  const isErr = messageOrErr instanceof Error;
  const msg = isErr ? messageOrErr.message : messageOrErr;

  fn(msg, ctx, isErr ? messageOrErr : undefined);
  remote(level, msg, { ctx, err: isErr ? messageOrErr : undefined });
}

/* ─── API pública ────────────────────────────────────────────────── */
export const logger = {
  debug: (m: string, c?: Ctx) => log(LogLevel.DEBUG, m, c),
  info: (m: string, c?: Ctx) => log(LogLevel.INFO, m, c),
  warn: (m: string, c?: Ctx) => log(LogLevel.WARN, m, c),
  error: (m: string | Error, c?: Ctx) => log(LogLevel.ERROR, m, c),
  fatal: (m: string | Error, c?: Ctx) => log(LogLevel.FATAL, m, c),

  /* runtime tweaks */
  setLogLevel: (lvl: LogLevel) => {
    currentLevel = lvl;
    base.level = lvl;
    logger.info(`Log level set to ${LogLevel[lvl]}`);
  },
  getLogLevel: () => currentLevel,

  /* child-logger por tag(s) */
  child: (...tags: string[]) => {
    let inst: ConsolaInstance = base;
    tags.forEach((t) => (inst = inst.withTag(t)));
    return inst;
  },
};

/* ─── ApiError + handler HTTP (inalterados) ──────────────────────── */
export class ApiError extends Error {
  constructor(public message: string, public status = 500) {
    super(message);
    this.name = "ApiError";
  }
}

export function handleApiError(err: unknown, prefix = "[API]") {
  const apiErr =
    err instanceof ApiError ? err : new ApiError("Erro interno inesperado.");
  logger.error(apiErr, { prefix, status: apiErr.status });
  return NextResponse.json(
    { error: apiErr.message },
    { status: apiErr.status }
  );
}
