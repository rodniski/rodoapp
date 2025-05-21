/* ClassificarMenuItem.tsx ------------------------------------------- */
"use client";
import {
  DropdownMenuItem,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "ui";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { PrenotaRow } from "@prenota/tabela";
import { hasAccessToGrupo, gruposNomes } from "utils";

interface Props {
  row: PrenotaRow;
  onClick: () => void;      // abre o diálogo
}

export function ClassificarMenuItem({ row, onClick }: Props) {
  const tipo   = row.F1_XTIPO.trim();
  const status = row.Status.trim();

  const isDespesa        = tipo === "Despesa/Imobilizado";
  const isNotClassificado = status !== "Classificado";     // só se ainda não estiver classificado

  const gruposOK = [
    gruposNomes.contabilidade,
    gruposNomes.fiscalI,
    gruposNomes.fiscalII,
    gruposNomes.tes,
    gruposNomes.tesMaster,
    gruposNomes.fiscalTimber,
    gruposNomes.admin,
  ];
  const userInAllowedGroup = gruposOK.some((g) => hasAccessToGrupo(g));

  const podeClassificar = isDespesa && isNotClassificado && userInAllowedGroup;

  /* mensagem do tooltip quando bloquear */
  let motivo = "";
  if (!isDespesa)             motivo = `Disponível só p/ Despesa/Imobilizado (atual: ${tipo}).`;
  else if (!isNotClassificado) motivo = "Pré-nota já classificada.";
  else if (!userInAllowedGroup) motivo = "Somente usuários da Contabilidade/Admin.";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="w-full">
          <DropdownMenuItem
            disabled={!podeClassificar}
            onSelect={(e) => {
              e.preventDefault();           // evita fechar antes
              if (podeClassificar) onClick();
            }}
            className="flex justify-between w-full cursor-pointer"
          >
            <span>Classificar Pré-Nota</span>
            <InfoCircledIcon className="size-4 text-muted-foreground" />
          </DropdownMenuItem>
        </span>
      </TooltipTrigger>
      {!podeClassificar && <TooltipContent>{motivo}</TooltipContent>}
    </Tooltip>
  );
}
