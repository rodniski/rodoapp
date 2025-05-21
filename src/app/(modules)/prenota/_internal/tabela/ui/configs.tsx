/* ──────────────────────────────────────────────────────────────────────────
 * prenota/_config/index.ts
 * --------------------------------------------------------------------------
 * • Helpers de filial  (cores + avatar + hook meta)
 * • Prioridades        (config + helper GetPriorityConfig)
 * • Status             (cores + ícones)
 * • Vencimento         (getVencimentoPreset)
 * ------------------------------------------------------------------------ */

import { useAuthStore } from "@login/stores";
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
import { Badge } from "ui";
import { cn } from "utils";
import { BadgePreset, FilialMeta } from "@prenota/tabela";


/* ╔══════════════════════════════════════════════╗
   ║ 1 ▸ FILIAIS (cor, avatar, hook de meta)      ║
   ╚══════════════════════════════════════════════╝ */

const getFilialColor = (nome: string): string => {
  if (nome.startsWith("RODOPARANA")) {
    return "bg-sky-100 text-sky-500 dark:bg-sky-900/40 dark:text-sky-300";
  }
  if (nome.startsWith("TIMBER")) {
    return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
  }
  return "bg-muted text-muted-foreground";
};

const getAvatarSrc = (nome: string): string => {
  if (nome.startsWith("RODOPARANA")) return "/rodo1.svg";
  if (nome.startsWith("TIMBER")) return "/timber.svg";
  return "";
};

/** Hook para obter metadados da filial (cor, avatar, nome completo) */
function useFilialMeta(filialNumero: string | null | undefined): FilialMeta {
  const sel = (s: ReturnType<typeof useAuthStore.getState>) =>
    s.filiais.find((f) => f.M0_CODFIL === filialNumero);

  const filial = useAuthStore(sel);

  return {
    nome: filial?.M0_FILIAL ?? "Desconhecida",
    cor: filial
      ? getFilialColor(filial.M0_FILIAL)
      : "bg-muted text-muted-foreground",
    avatarSrc: filial ? getAvatarSrc(filial.M0_FILIAL) : "",
  };
}

/* ╔══════════════════════════════════════════════╗
   ║ 2 ▸ PRIORIDADES (badge de triângulos)        ║
   ╚══════════════════════════════════════════════╝ */

const priorityConfig = {
  Alta: {
    color: "text-red-600",
    icon: (
      <span className="text-red-600">
        <TriangleUpIcon className="size-8" />
      </span>
    ),
    tooltip: "Prioridade Alta – atenção imediata.",
  },
  Media: {
    color: "text-yellow-500",
    icon: (
      <span className="text-yellow-500">
        <MinusIcon className="size-8" />
      </span>
    ),
    tooltip: "Prioridade Média – atenção necessária.",
  },
  Baixa: {
    color: "text-green-600",
    icon: (
      <span className="text-green-600">
        <TriangleDownIcon className="size-8" />
      </span>
    ),
    tooltip: "Prioridade Baixa – sem urgência.",
  },
  _default: {
    color: "text-muted-foreground",
    icon: (
      <span className="text-muted-foreground">
        <InfoCircledIcon className="size-8" />
      </span>
    ),
    tooltip: "Prioridade desconhecida.",
  },
} as const;

type PriorityKey = keyof typeof priorityConfig;
type KnownPriority = Exclude<PriorityKey, "_default">;

/** Helper → devolve o preset correto já fazendo *fallback* */
const getPriorityPreset = (p?: string | null) =>
  priorityConfig[(p ?? "") as KnownPriority] ?? priorityConfig._default;

/* ╔══════════════════════════════════════════════╗
   ║ 3 ▸ STATUS (badge/tooltip de situação)       ║
   ╚══════════════════════════════════════════════╝ */

const statusConfig = {
  Pendente: {
    color: "text-sky-500",
    icon: (
      <span className="text-sky-500">
        <TimerIcon className="w-5 h-5" />
      </span>
    ),
    tooltip: "Status: Pendente",
  },
  Classificada: {
    color: "text-lime-500",
    icon: (
      <span className="text-lime-500">
        <CheckCircledIcon className="w-5 h-5" />
      </span>
    ),
    tooltip: "Status: Classificada",
  },
  Revisar: {
    color: "text-amber-500",
    icon: (
      <span className="text-amber-500">
        <ExclamationTriangleIcon className="w-5 h-5" />
      </span>
    ),
    tooltip: "Status: A Revisar",
  },
  Desconhecido: {
    color: "text-muted-foreground",
    icon: (
      <span className="text-muted-foreground">
        <InfoCircledIcon className="w-5 h-5" />
      </span>
    ),
    tooltip: "Status desconhecido",
  },
} as const;

type StatusKey = keyof typeof statusConfig;

/** Helper semelhante ao de prioridade – garante *fallback* seguro */
const getStatusPreset = (s?: string | null) =>
  statusConfig[(s ?? "") as StatusKey] ?? statusConfig.Desconhecido;

/* ╔══════════════════════════════════════════════╗
   ║ 4 ▸ VENCIMENTO (preset de cor / tooltip)     ║
   ╚══════════════════════════════════════════════╝ */

function getVencimentoPreset(venc?: string | null): BadgePreset {
  /* Sem data -------------------------------------------------------------- */
  if (!venc?.trim()) {
    return {
      color: "text-muted-foreground",
      icon: (
        <Badge className="font-medium text-xs text-muted-foreground border-border">
          Sem Venc.
        </Badge>
      ),
      tooltip: "Documento sem data de vencimento.",
    };
  }

  /* Parse ----------------------------------------------------------------- */
  const date =
    parseDateYYYYMMDD(venc) ?? // yyyyMMdd
    parseDateBR(venc); // dd/MM/yyyy

  if (!date) {
    return {
      color: "text-destructive",
      icon: (
        <Badge className="font-medium text-xs text-destructive border-destructive/50 bg-destructive/10">
          Data Inválida
        </Badge>
      ),
      tooltip: `Formato inválido (${venc}).`,
    };
  }

  /* Diferença de dias ----------------------------------------------------- */
  const diff = differenceInCalendarDays(date);
  const label = formatDateBR(date);

  /* Cores + tooltip ------------------------------------------------------- */
  let colorClass = "";
  let tooltip = "";

  switch (true) {
    case diff < 0:
      colorClass = "text-red-700 border-red-500/50 bg-red-500/10";
      tooltip = `Vencido há ${Math.abs(diff)} dia(s)`;
      break;
    case diff <= 2:
      colorClass = "text-orange-600 border-orange-400/50 bg-orange-500/10";
      tooltip = diff === 0 ? "Vence hoje" : `Vence em ${diff} dia(s)`;
      break;
    case diff <= 7:
      colorClass = "text-yellow-600 border-yellow-400/50 bg-yellow-500/10";
      tooltip = `Vence em ${diff} dia(s)`;
      break;
    case diff <= 14:
      colorClass = "text-green-600 border-green-400/50 bg-green-500/10";
      tooltip = `Vence em ${diff} dia(s)`;
      break;
    default:
      colorClass = "text-teal-600 border-teal-400/50 bg-teal-500/10";
      tooltip = `Vence em ${diff} dia(s)`;
  }

  return {
    color: colorClass,
    icon: (
      <Badge className={cn("font-medium text-xs", colorClass)}>
        {label}
      </Badge>
    ),
    tooltip,
  };
}

/* ╔══════════════════════════════════════════════╗
   ║ 5 ▸ EXPORTS “NOMINADOS”                      ║
   ╚══════════════════════════════════════════════╝ */

export {
  /* filial */
  getFilialColor,
  getAvatarSrc,
  useFilialMeta,
  /* prioridade */
  priorityConfig,
  getPriorityPreset,
  /* status */
  statusConfig,
  getStatusPreset,
  /* vencimento */
  getVencimentoPreset,
};