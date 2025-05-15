"use client";

import React, { useMemo } from "react";
import { Progress } from "ui";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "ui";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { usePreNotaStore } from "@inclusao/stores";

// Interface local para os itens de verificação
interface CheckItem {
  label: string;
  done: boolean;
  optional?: boolean;
}

export function FormProgressHoverCard() {
  // --- Store Data ---
  const draft = usePreNotaStore((s) => s.draft);
  const { header, PAGAMENTOS, RATEIOS, itens, ARQUIVOS } = draft;

  // --- Verificações de Preenchimento por Seção (SIMPLIFICADO) ---
  const completionChecks = useMemo(() => {
    const results = {
      header: [] as CheckItem[],
      pagamento: [] as CheckItem[],
      produtos: [] as CheckItem[],
    };

    // --- Cabeçalho ---
    results.header.push({ label: "Fornecedor/Loja", done: Boolean(header.FORNECEDOR && header.LOJA) });
    results.header.push({ label: "Tipo NF (Rod.)", done: Boolean(header.tiporodo) });
    results.header.push({ label: "Prioridade/Justif.", done: Boolean(header.prioridade && (header.prioridade !== 'Alta' || (header.prioridade === 'Alta' && header.JUSTIFICATIVA?.trim()))) });
    results.header.push({ label: "Documento/Série", done: Boolean(header.DOC && header.SERIE) });
    results.header.push({ label: "Emissão", done: Boolean(header.DTINC) });
    results.header.push({ label: "Filial", done: Boolean(header.FILIAL) });
    results.header.push({ label: "Cond. Financeira", done: Boolean(header.CONDFIN) });

    // --- Pagamento & Outros ---
    const parcelasPresentes = PAGAMENTOS && PAGAMENTOS.length > 0;
    const rateiosPresentes = RATEIOS && RATEIOS.length > 0;
    const anexosPresentes = ARQUIVOS && ARQUIVOS.length > 0;

    results.pagamento.push({ label: "Parcelas Informadas", done: parcelasPresentes });
    results.pagamento.push({ label: "Rateio Informado", done: rateiosPresentes });
    // Anexo agora obrigatório
    results.pagamento.push({ label: "Anexo(s)", done: anexosPresentes });

    // --- Produtos ---
    const itensPresentes = itens && itens.length > 0;
    results.produtos.push({ label: "Pelo menos 1 item", done: itensPresentes });
    if (itensPresentes) {
      results.produtos.push({ label: "Itens c/ Produto", done: itens.every(it => Boolean(it.PRODUTO?.trim())) });
      results.produtos.push({ label: "Itens c/ PC", done: itens.every(it => Boolean(it.PC?.trim())) });
      results.produtos.push({ label: "Itens c/ Item PC", done: itens.every(it => Boolean(it.ITEMPC?.trim())) });
      results.produtos.push({ label: "Itens c/ UM", done: itens.every(it => Boolean(it.B1_UM?.trim())) });
      results.produtos.push({ label: "Itens c/ Origem", done: itens.every(it => it.ORIGEM !== undefined && it.ORIGEM !== null && it.ORIGEM !== "") });
      results.produtos.push({ label: "Valores dos Itens Ok", done: itens.every(it => (it.QUANTIDADE ?? 0) > 0 && (it.VALUNIT ?? 0) > 0 && (it.TOTAL ?? 0) > 0) });
    }

    return results;

  }, [header, PAGAMENTOS, RATEIOS, itens, ARQUIVOS]);


  // --- Cálculo do Progresso ---
  const allChecks = Object.values(completionChecks).flat().filter(c => !c.optional);
  const totalChecks = allChecks.length;
  const doneChecks = allChecks.filter((c) => c.done).length;
  const percent = totalChecks > 0 ? Math.round((doneChecks / totalChecks) * 100) : 0;

  // --- Renderização ---
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className="w-full cursor-pointer">
          <Progress value={percent} className="h-2 rounded bg-muted" title={`Progresso: ${percent}%`} />
        </div>
      </HoverCardTrigger>

      <HoverCardContent side="top" align="center" className="w-auto max-w-screen-md">
        <div className="space-y-3">
          <p className="text-center font-semibold border-b pb-2 mb-3">Progresso de Preenchimento: {percent}%</p>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-start">

            {/* Seção Cabeçalho */}
            <div className="flex-1 min-w-0">
              <p className="font-medium mb-1 text-center md:text-left">Cabeçalho</p>
              <ul className="space-y-1 pl-1">
                {completionChecks.header.map(({ label, done }) => (
                  <li key={`header-${label}`} className="flex items-center gap-1.5 text-xs">
                    {done ? <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                      : <XCircle className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />}
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Seção Pagamento & Outros */}
            <div className="flex-1 min-w-0 border-t md:border-t-0 md:border-l md:pl-4 pt-2 md:pt-0">
              <p className="font-medium mb-1 text-center md:text-left">Pagamento & Outros</p>
              <ul className="space-y-1 pl-1">
                {completionChecks.pagamento.map(({ label, done }) => (
                  <li key={`pag-${label}`} className="flex items-center gap-1.5 text-xs">
                    {done ? <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                      : <XCircle className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />}
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Seção Produtos */}
            <div className="flex-1 min-w-0 border-t md:border-t-0 md:border-l md:pl-4 pt-2 md:pt-0">
              <p className="font-medium mb-1 text-center md:text-left">Produtos</p>
              <ul className="space-y-1 pl-1">
                {completionChecks.produtos.map(({ label, done }) => (
                  <li key={`prod-${label}`} className="flex items-center gap-1.5 text-xs">
                     {done ? <CheckCircle className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                      : <XCircle className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />}
                    <span>{label}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
