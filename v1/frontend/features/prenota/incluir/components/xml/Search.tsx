"use client";

import React, { useEffect, useState } from "react";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "ui";
import { Download, History, PackageSearch } from "lucide-react";
import { toast } from "sonner";
import { useSetAtom } from "jotai";
import {
  chaveNfAtom,
  condFinAtom,
  dataIncAtom,
  docAtom,
  especieAtom,
  fornecedorSupAtom,
  itensAtom,
  origemDadosAtom,
  serieAtom,
  totalGeralAtom,
  xmlDataAtom,
} from "#/incluir/atoms";
import { useDetalhesXml, useDownloadDanfe } from "#/incluir/hooks";
import { AnimatedButton } from "#/incluir/components/buttons";

const HISTORY_KEY = "xml-search-history";
const MAX_HISTORY = 5;

const Search = () => {
  const [xml, setXml] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const setFornecedor = useSetAtom(fornecedorSupAtom);
  const setXmlKeyAtomGlobal = useSetAtom(chaveNfAtom);
  const setTotalGeral = useSetAtom(totalGeralAtom);
  const setOrigem = useSetAtom(origemDadosAtom);
  const setXmlData = useSetAtom(xmlDataAtom);
  const setEspecie = useSetAtom(especieAtom);
  const setCondFin = useSetAtom(condFinAtom);
  const setItens = useSetAtom(itensAtom);
  const setData = useSetAtom(dataIncAtom);
  const setSerie = useSetAtom(serieAtom);
  const setDoc = useSetAtom(docAtom);

  const downloadDanfe = useDownloadDanfe();
  const detalhesXmlQuery = useDetalhesXml(xml);

  useEffect(() => {
    const history = localStorage.getItem(HISTORY_KEY);
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  const updateHistory = (value: string) => {
    const newHistorySet = new Set([value, ...searchHistory]);
    const newHistory = Array.from(newHistorySet).slice(0, MAX_HISTORY);
    setSearchHistory(newHistory);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
  };

  const handleBuscarXML = async () => {
    if (!xml.trim() || xml.trim().length !== 44) {
      toast.error("A chave XML é inválida.");
      return;
    }

    try {
      updateHistory(xml.trim());
      setXmlKeyAtomGlobal(xml.trim());

      toast.promise(detalhesXmlQuery.refetch(), {
        loading: "Buscando XML...",
        success: (result) => {
          if (result.data) {
            setXmlData(result.data);
            setFornecedor(result.data.cnpjEmitente);
            setDoc(result.data.numero);
            setSerie(result.data.serie);
            setEspecie("NF");
            setOrigem("xml");
            setCondFin(result.data.condicaoPagamento || "");

            const formattedDate = result.data.dataEmissao.split(" ")[0];
            setData(formattedDate);

            const produtos = result.data.itens.map((xmlItem, i) => ({
              ITEM: String(i + 1).padStart(5, "0"),
              PRODUTO: xmlItem.descProduto,
              QUANTIDADE: Number(xmlItem.quantidade) || 0,
              VALUNIT: Number(xmlItem.valorUnitario) || 0,
              PRODFOR: xmlItem.codProduto || "",
              DESCFOR: xmlItem.descProduto || "",
              ORIGEMXML: xmlItem.origem || "",
              TOTAL: Number(xmlItem.valorTotal) || 0,
              PC: "",
              ITEMPC: "",
              B1_UM: xmlItem.unidade || "",
              SEGUN: "",
              TPFATO: "",
              CONV: 1,
              ORIGEM: "",
            }));
            setItens(produtos);

            const total = produtos.reduce(
              (acc, produto) => acc + produto.TOTAL,
              0
            );
            setTotalGeral(total);

            return "XML carregado com sucesso.";
          }

          return "Erro: XML não encontrado.";
        },
        error: () => "Erro ao buscar detalhes do XML.",
      });
    } catch (error) {
      toast.error(`Erro na validação: ${error.message}`);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Input
          type="text"
          className="w-full outline-none pr-10"
          placeholder="Buscar XML"
          value={xml}
          onChange={(e) => {
            const onlyNumbers = e.target.value.replace(/\D/g, ""); // só números
            setXml(onlyNumbers);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleBuscarXML()}
        />
        {searchHistory.length > 0 && (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <History className="h-4 w-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="end">
              <Command>
                <CommandList>
                  <CommandGroup heading="Histórico">
                    {searchHistory.map((item) => (
                      <CommandItem
                        key={item}
                        onSelect={() => {
                          setXml(item);
                          setOpen(false);
                        }}
                      >
                        {item}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </div>
      <AnimatedButton
        variant="default"
        text="Buscar"
        icon={<PackageSearch className="w-5 h-5 flex-shrink-0" />}
        onClick={handleBuscarXML}
      />
      <AnimatedButton
        text="Baixar DANFE"
        icon={<Download className="w-5 h-5 flex-shrink-0" />}
        onClick={async () => {
          try {
            await downloadDanfe.mutateAsync(xml.trim());
            toast.success("Download do DANFE iniciado com sucesso!");
          } catch (error) {
            console.error("Erro ao baixar DANFE:", error);
            toast.error(
              "Erro ao baixar DANFE. Verifique a chave XML e tente novamente."
            );
          }
        }}
      />
    </div>
  );
};

export default Search;