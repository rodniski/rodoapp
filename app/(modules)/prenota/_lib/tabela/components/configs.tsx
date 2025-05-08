import { useAuthStore } from "@login/stores";
import { useCallback } from "react";
import { FilialMeta } from "../config";
import {
  TriangleUpIcon,
  MinusIcon,
  TriangleDownIcon,
  InfoCircledIcon,
  TimerIcon,
  CheckCircledIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
import {
  parseDateYYYYMMDD,
  parseDateBR,
  formatDateBR,
  differenceInCalendarDays,
} from "utils";

export const getFilialColor = (filialName: string) => {
  if (filialName.startsWith("RODOPARANA"))
    return "dark:text-sky-400 text-sky-600 bg-muted";
  if (filialName.startsWith("TIMBER"))
    return "dark:text-amber-500 text-amber-600 bg-muted";
  return "bg-muted text-muted-foreground";
};

export const getAvatarSrc = (filialName: string) => {
  if (filialName.startsWith("RODOPARANA")) return "/rodo1.svg";
  if (filialName.startsWith("TIMBER")) return "/timber.svg";
  return "";
};

export function useFilialMeta(
  filialNumero: string | null | undefined
): FilialMeta {
  const selector = useCallback(
    (s: ReturnType<typeof useAuthStore.getState>) =>
      s.filiais.find((f) => f.M0_CODFIL === filialNumero),
    [filialNumero]
  );

  const filial = useAuthStore(selector);

  return {
    nome: filial?.M0_FILIAL ?? "Desconhecida",
    cor: filial
      ? getFilialColor(filial.M0_FILIAL)
      : "bg-muted text-muted-foreground",
    avatarSrc: filial ? getAvatarSrc(filial.M0_FILIAL) : "",
  };
}

/* ─────────────── PRIORIDADES ─────────────── */

export const priorityConfig = {
  Alta: {
    color: "text-red-600",
    icon: <TriangleUpIcon className="size-8" />,
    tooltip: "Prioridade Alta – requer atenção imediata.",
  },
  Media: {
    color: "text-yellow-500",
    icon: <MinusIcon className="size-8" />,
    tooltip: "Prioridade Média – atenção necessária.",
  },
  Baixa: {
    color: "text-green-600",
    icon: <TriangleDownIcon className="size-8" />,
    tooltip: "Prioridade Baixa – nenhuma ação imediata.",
  },

  /** 〝catch-all〞  para valores não mapeados                   */
  _default: {
    color: "text-muted-foreground",
    icon: <InfoCircledIcon className="size-6" />,
    tooltip: "Prioridade desconhecida.",
  },
} as const;

type PriorityKey = keyof typeof priorityConfig; // "Alta" | "Media" | "Baixa" | "_default"
type KnownPriority = Exclude<PriorityKey, "_default">; // "Alta" | "Media" | "Baixa"

/* Helper opcional – evita repetir a lógica no componente */
export function GetPriorityConfig(p: string | null | undefined) {
  return priorityConfig[(p ?? "") as KnownPriority] ?? priorityConfig._default;
}

/* ─────────────── STATUS ─────────────── */

// A configuração de status permanece a mesma
export const StatusConfig = {
  Pendente: {
    color: "text-sky-500",
    icon: <TimerIcon className="w-5 h-5" />,
    tooltip: "Status: Pendente",
  },
  Classificada: {
    color: "text-lime-500",
    icon: <CheckCircledIcon className="w-5 h-5" />,
    tooltip: "Status: Classificada",
  },
  Revisar: {
    color: "text-amber-500",
    icon: <ExclamationTriangleIcon className="w-5 h-5" />,
    tooltip: "Status: A Revisar",
  },
  // Mantemos um fallback para caso o valor de Status seja inesperado
  Desconhecido: {
    color: "text-muted-foreground",
    icon: <InfoCircledIcon className="w-5 h-5" />,
    tooltip: "Status desconhecido",
  },
} as const;

/* ─────────── utils/vencimento.ts ─────────── */

/**
 * Preset devolvido pela função utilitária.
 */
export interface VencimentoPreset {
  /** Texto que vai dentro do badge (`Sem Venc.`, `14/05/2025` …) */
  label: string;
  /** Classe tailwind ou css-module p/ cor do badge */
  colorClass: string;
  /** Tooltip que explica a situação */
  tooltip: string;
  /** Quantos dias faltam (negativo = já venceu) */
  diffDays: number | null;
  /** Flag para estado especial */
  state: "sem-venc" | "invalido" | "ok";
}

/**
 * Converte a string de `vencimento` numa estrutura pronta para UI.
 * Aceita “yyyyMMdd” **ou** “dd/MM/yyyy”.
 * Se estiver vazia ou com formato inválido, devolve presets adequados.
 */
export function getVencimentoPreset(
  vencimento?: string | null
): VencimentoPreset {
  /* 1 ────────── Sem vencimento informado */
  if (!vencimento?.trim()) {
    return {
      label: "Sem Venc.",
      colorClass: "text-muted-foreground border-border",
      tooltip: "Documento sem data de vencimento.",
      diffDays: null,
      state: "sem-venc",
    };
  }

  /* 2 ────────── Parse da data (yyyyMMdd  ↔  dd/MM/yyyy) */
  const date =
    parseDateYYYYMMDD(vencimento) ?? // tenta primeiro yyyyMMdd
    parseDateBR(vencimento); // depois dd/MM/yyyy

  if (!date) {
    /* formato realmente inválido */
    return {
      label: "Data Inválida",
      colorClass: "text-destructive border-destructive/50 bg-destructive/10",
      tooltip: `Formato de data inválido (${vencimento}).`,
      diffDays: null,
      state: "invalido",
    };
  }

  /* 3 ────────── Data válida → calcula diferença */
  const diff = differenceInCalendarDays(date); // hoje – vencimento
  const label = formatDateBR(date); // sempre dd/MM/yyyy

  /* 4 ────────── Decide as cores/tooltip */
  let colorClass = "";
  let tooltip = "";

  switch (true) {
    case diff < 0: // já venceu
      colorClass = "text-red-700 border-red-500/50 bg-red-500/10";
      tooltip = `Vencido há ${Math.abs(diff)} dia(s)`;
      break;

    case diff <= 2: // hoje / 1-2
      colorClass = "text-orange-600 border-orange-400/50 bg-orange-500/10";
      tooltip = diff === 0 ? "Vence hoje" : `Vence em ${diff} dia(s)`;
      break;

    case diff <= 7: // 3-7
      colorClass = "text-yellow-600 border-yellow-400/50 bg-yellow-500/10";
      tooltip = `Vence em ${diff} dia(s)`;
      break;

    case diff <= 14: // 8-14
      colorClass = "text-green-600 border-green-400/50 bg-green-500/10";
      tooltip = `Vence em ${diff} dia(s)`;
      break;

    default: // 15+
      colorClass = "text-teal-600 border-teal-400/50 bg-teal-500/10";
      tooltip = `Vence em ${diff} dia(s)`;
  }

  return {
    label,
    colorClass,
    tooltip,
    diffDays: diff,
    state: "ok",
  };
}
