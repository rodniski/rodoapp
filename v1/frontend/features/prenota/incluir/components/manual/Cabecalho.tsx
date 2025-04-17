"use client";

import React, { useEffect, useState } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  accessFiliaisAtom,
  condicoesPagamentoAtom,
} from "atoms"; // Ajuste o caminho dos seus átomos
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Combobox,
  DatePicker,
  Input,
  Textarea,
} from "ui";
import { Comboboxes } from "#/incluir/interfaces";
import {
  filialCodAtom,
  obsAtom,
  condFinAtom,
  docAtom,
  serieAtom,
  dataIncAtom, // Adicionados: docAtom, serieAtom, dataIncAtom
} from "#/incluir/atoms";
import { FornecedorCombobox } from "."; // Exemplo de Combobox de fornecedor
import { DadosNf } from "#/incluir/components/comboboxes";

export default function ManualCabecalho() {
  const [observacoes, setObservacoes] = useAtom(obsAtom);

  // Para as condições de pagamento
  const [condicaoOptions, setCondicaoOptions] = useState<Comboboxes[]>([]);
  const condicoesPagamento = useAtomValue(condicoesPagamentoAtom);
  const setSelectedCondicao = useSetAtom(condFinAtom);

  // Para as filiais
  const [filiaisOptions, setFiliaisOptions] = useState<Comboboxes[]>([]);
  const filiais = useAtomValue(accessFiliaisAtom);
  const [selectedFilial, setSelectedFilial] = useAtom(filialCodAtom);

  // Para Documento, Série e Data
  const [doc, setDoc] = useAtom(docAtom);
  const [serie, setSerie] = useAtom(serieAtom);
  const [dataInc, setDataInc] = useAtom(dataIncAtom);

  // Atualiza as opções de condições de pagamento
  useEffect(() => {
    if (condicoesPagamento.length > 0) {
      const formattedCondicoes = condicoesPagamento.map((cond) => ({
        value: cond.E4_DESCRI.trim(),
        label: cond.E4_DESCRI.trim(),
      }));
      setCondicaoOptions(formattedCondicoes);
    }
  }, [condicoesPagamento]);

  // Atualiza as opções de filiais
  useEffect(() => {
    if (filiais.length > 0) {
      const formattedFiliais = filiais.map((filial) => ({
        value: filial.M0_CODFIL.trim(),
        label: filial.M0_FILIAL.trim(),
      }));
      setFiliaisOptions(formattedFiliais);
    }
  }, [filiais]);

  return (
    <div className="flex flex-col sm:flex-row flex-grow w-full gap-1">
      {/* Card com Informações Adicionais */}
      <div className="flex-1">
        <Card className="w-full flex flex-col h-full">
          <CardHeader>
            <CardTitle className="text-center">Informações Adicionais</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col h-full gap-6 justify-center w-full">
            <div className="flex gap-3 w-full">
              <div className="relative w-full">
                {/* INPUT para DOC: ligando ao docAtom */}
                <Input
                  placeholder="Documento"
                  required
                  className="w-full pr-28"
                  value={doc}
                  onChange={(e) => setDoc(e.target.value)} // salva no átomo docAtom
                />
                {/* Container para o addon: traço e input Série */}
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <div className="h-5 border-l-2 border-muted mx-2"></div>
                  {/* INPUT para SÉRIE: ligando ao serieAtom */}
                  <Input
                    placeholder="Série"
                    required
                    className="w-20 uw:w-36 rounded-l-none border-l-0"
                    value={serie}
                    onChange={(e) => setSerie(e.target.value)} // salva no átomo serieAtom
                  />
                </div>
              </div>
              <div className="w-1/3 2xl:w-full flex-1">
                {/* DatePicker ligado ao dataIncAtom */}
                <DatePicker
                  initialDate={dataInc}       // "10/02/2024" ou ""
                  onChange={(val) => setDataInc(val)} // Armazena a string dd/MM/yyyy no átomo
                  placeholder="Emissão"
                />
              </div>
            </div>

            {/* Combobox Filial + Fornecedor */}
            <div className="flex gap-3 w-full">
              <Combobox
                items={filiaisOptions}
                placeholder="Filial"
                onSelect={(value) => {
                  if (value) setSelectedFilial(value);
                }}
                selectedValue={selectedFilial}
              />
              {/* Combobox de Fornecedor (exemplo) */}
              <FornecedorCombobox />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Card lateral para Condição de Pagamento, etc. */}
      <div className="flex-1">
        <DadosNf
          condicaoOptions={condicaoOptions}
          onSelectCondicao={(value) => setSelectedCondicao(value)}
          tipo="manual"
        />
      </div>

      {/* Textarea de Observações */}
      <div className="flex-1">
        <Textarea
          placeholder="Adicione suas Observações..."
          className="w-full h-32 sm:h-full p-4 resize-none border rounded-md"
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
        />
      </div>
    </div>
  );
}
