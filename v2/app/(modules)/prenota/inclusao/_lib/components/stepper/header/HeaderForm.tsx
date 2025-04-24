"use client";

import React, { useEffect, useMemo } from "react"; // Removido useState, useEffect não usados diretamente aqui
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Combobox,
  Input,
  DatePicker,
  Textarea,
} from "ui"; // Seus Componentes UI
import {
  PrioridadePopover,
  FornecedorDialog,
  XmlSearchInput,
  PedidoDialog,
} from "@inclusao/components"; // Seus Componentes de Inclusão
import { usePreNotaStore } from "@inclusao/stores"; // Store Principal
import { useAuxStore as useLoginAuxStore } from "@login/stores"; // Store Auxiliar do Login para filiais
import { TIPOS_NF_OPTIONS } from "@prenota/stores"; // Opções de Tipo
import type { FilialGeral } from "@/app/(modules)/login/_lib"; // Tipo Filial
import { isValid } from "date-fns";
import { formatDateBR, parseDateBR } from "utils"; // Seus Utilitários

export const HeaderForm = () => {
  // Lê estado e ações do store principal (seletores individuais)
  const header = usePreNotaStore((state) => state.draft.header);
  const mode = usePreNotaStore((state) => state.mode);
  const setHeader = usePreNotaStore((state) => state.setHeader);

  const isXmlMode = mode === "xml";

  // Lê filiais do useAuxStore de @login/stores
  // ** PONTO DE VERIFICAÇÃO 1: Garantir que 'filiais' aqui contém os dados esperados **
  const filiais = useLoginAuxStore((state) => state.filiais);
  console.log("[HeaderForm] Filiais lidas do useLoginAuxStore:", filiais); // Log para depuração

  // Mapeia as filiais para o formato do Combobox
  const filialOptions = useMemo(() => {
    console.log("[HeaderForm] Recalculando filialOptions...");
    return filiais.map((f: FilialGeral) => {
      // ** PONTO DE VERIFICAÇÃO 2: Confirmar nomes das propriedades abaixo **
      // 'numero' deve ser o código (ex: "0101") que é salvo em header.FILIAL
      // 'nomeFilial' (ou similar) deve ser o nome descritivo da filial
      const filialValue = f.numero; // Ex: "0101"
      const filialLabelName = f.filial || `Filial ${f.numero}`; // Ex: "FILIAL CURITIBA" ou "Filial 0101"

      return {
        value: filialValue, // Valor usado para salvar/comparar
        label: `${filialValue} - ${filialLabelName}`, // Texto exibido "0101 - FILIAL CURITIBA"
      };
    });
  }, [filiais]); // Recalcula apenas quando a lista de filiais mudar

  // Processa data (mantido)
  const parsedDate = parseDateBR(header.DTINC);
  const datePickerValue =
    parsedDate && isValid(parsedDate) ? parsedDate : undefined;

  // Log para depurar valor selecionado vs opções
  useEffect(() => {
    console.log("[HeaderForm] Header.FILIAL atual:", header.FILIAL);
    console.log("[HeaderForm] Opções de Filial geradas:", filialOptions);
  }, [header.FILIAL, filialOptions]);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-5">
      {/* Card de Importação (mantido) */}
      <Card className="w-full max-w-5xl">
        {/* ... CardHeader e CardContent com XmlSearchInput e FornecedorDialog ... */}
        <CardHeader>
          <CardTitle>Importar Nota Fiscal</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" htmlFor="xml-search">
              Chave NF‑e
            </label>
            <XmlSearchInput />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Fornecedor</label>
            <FornecedorDialog />
          </div>
        </CardContent>
      </Card>

      {/* Container dos Cards de Campos (mantido) */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card Esquerdo (mantido) */}
        <Card>
          <CardContent className="flex flex-col gap-6 pt-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Pedido de Compra</label>
              <PedidoDialog />
            </div>
            <div className="flex gap-3 w-full items-end">
              <div className="w-full flex flex-col gap-2">
                <label className="text-sm font-medium" htmlFor="tipo-nota">
                  Tipo (RodoApp)
                </label>
                <Combobox
                  items={TIPOS_NF_OPTIONS}
                  selectedValue={header.tiporodo}
                  onSelect={(value) => value && setHeader({ tiporodo: value })}
                  placeholder="Selecione o tipo"
                />
              </div>
              <div className="w-full flex flex-col gap-2">
                <label className="text-sm font-medium">Prioridade</label>
                <PrioridadePopover />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card Direito (Combobox Filial ajustado) */}
        <Card>
          <CardContent className="flex flex-col gap-6 pt-6">
            {/* Documento e Série (mantido) */}
            <div className="flex gap-3 w-full items-end">
              {/* ... Input Documento ... */}
              {/* ... Input Série ... */}
              <div className="w-full flex flex-col gap-2">
                <label className="text-sm font-medium" htmlFor="doc-numero">
                  Documento
                </label>
                <Input
                  id="doc-numero"
                  placeholder="Número"
                  required
                  className={`w-full bg-input/30 ${
                    isXmlMode ? "cursor-not-allowed opacity-70" : ""
                  }`}
                  readOnly={isXmlMode}
                  value={header.DOC || ""}
                  onChange={(e) => setHeader({ DOC: e.target.value })}
                  disabled={isXmlMode}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium" htmlFor="doc-serie">
                  Série
                </label>
                <Input
                  id="doc-serie"
                  placeholder="Série"
                  required
                  className={`w-24 uw:w-36 bg-input/30 ${
                    isXmlMode ? "cursor-not-allowed opacity-70" : ""
                  }`}
                  readOnly={isXmlMode}
                  value={header.SERIE || ""}
                  onChange={(e) => setHeader({ SERIE: e.target.value })}
                  disabled={isXmlMode}
                />
              </div>
            </div>

            {/* Emissão e Filial */}
            <div className="flex gap-3 w-full items-end">
              {/* ... DatePicker Emissão ... */}
              <div className="w-full flex flex-col gap-2">
                <label className="text-sm font-medium">Emissão</label>
                <DatePicker
                  value={datePickerValue}
                  onChange={(date) =>
                    setHeader({
                      DTINC: date && isValid(date) ? formatDateBR(date) : "",
                    })
                  }
                  placeholder="dd/mm/aaaa"
                  disabled={isXmlMode}
                />
              </div>

              {/* Combobox Filial */}
              <div className="w-full flex flex-col gap-2">
                <label className="text-sm font-medium" htmlFor="filial-select">
                  Filial
                </label>
                <Combobox
                  // id="filial-select" // Adicione se label usar htmlFor
                  items={filialOptions} // Usa as opções formatadas
                  selectedValue={header.FILIAL} // Lê o código "0101" do store
                  onSelect={(value) => {
                    // Salva apenas o código "0101" no store ao selecionar manualmente
                    if (value) {
                      console.log(
                        "[HeaderForm] Filial selecionada manualmente:",
                        value
                      );
                      setHeader({ FILIAL: value });
                    }
                  }}
                  placeholder={"Selecione a filial"}
                  disabled={isXmlMode} // Desabilitado em modo XML
                />
                {/* Log para ajudar a depurar o valor vs opções */}
                {/* <pre className="text-xs mt-1">Selected: {header.FILIAL || 'null'} | Options: {JSON.stringify(filialOptions.map(o=>o.value))}</pre> */}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Card de Observações (mantido) */}
      <Card className="w-full max-w-5xl">
        {/* ... Textarea Observações ... */}
        <CardContent className="pt-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium" htmlFor="observacoes">
              Observações
            </label>
            <Textarea
              id="observacoes"
              placeholder="Adicione suas Observações..."
              className="w-full min-h-[96px]"
              value={header.OBS || ""}
              onChange={(e) => setHeader({ OBS: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
