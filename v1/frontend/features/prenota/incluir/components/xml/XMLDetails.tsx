"use client";

import React, {useEffect, useMemo} from "react"; // Importa useState e useEffect
import {
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "ui";
import {Info} from "lucide-react"; // Importa o ícone
import {useAtomValue, useSetAtom} from "jotai";
import {
    condFinAtom,
    docAtom,
    filialCodAtom,
    fornecedorAtom,
    fornecedorSupAtom,
    serieAtom,
    xmlDataAtom
} from "#/incluir/atoms";
import {accessFiliaisAtom, condicoesPagamentoAtom, filiaisAtom} from "$/atoms"; // Importa condicoesPagamentoAtom

interface XMLDetailsProps {
    className?: string;
}

export default function XMLDetails({className}: XMLDetailsProps) {
    const doc = useAtomValue(docAtom);
    const serie = useAtomValue(serieAtom);
    const condFin = useAtomValue(condFinAtom); // Código da condição
    const cnpjEmitente = useAtomValue(fornecedorSupAtom);
    const codEmitente = useAtomValue(fornecedorAtom);
    const xmlData = useAtomValue(xmlDataAtom);
    const filiais = useAtomValue(accessFiliaisAtom);
    const setFilial = useSetAtom(filialCodAtom);
    const condicoesPagamento = useAtomValue(condicoesPagamentoAtom)


    // useMemo para encontrar a descrição da condição de pagamento
    const condicaoDescricao = useMemo(() => {
        if (!condFin) {
            return "N/A"; // Ou qualquer outro valor padrão
        }
        const condicao = condicoesPagamento.find((c) => c.E4_CODIGO === condFin);
        return condicao ? condicao.E4_DESCRI.trim() : "Condição não encontrada";
    }, [condFin, condicoesPagamento]);


    useEffect(() => {
        console.log("XMLDetails - xmlData:", xmlData);
        console.log("XMLDetails - filiais:", filiais);
        if (
            xmlData &&
            "cnpjDestinatario" in xmlData &&
            xmlData.cnpjDestinatario &&
            filiais.length
        ) {
            console.log("XMLDetails - Procurando filial para cnpjDestinatario:", xmlData.cnpjDestinatario);
            const filialEncontrada = filiais.find((f) => {
                console.log("Comparando:", f.M0_CGC, "com", xmlData.cnpjDestinatario);
                return f.M0_CGC === xmlData.cnpjDestinatario;
            });
            console.log("XMLDetails - Filial encontrada:", filialEncontrada);
            if (filialEncontrada) {
                setFilial(filialEncontrada.M0_CODFIL);
                console.log("XMLDetails - Filial set:", filialEncontrada.M0_CODFIL);
            } else {
                console.warn("XMLDetails - Nenhuma filial encontrada para o CNPJ:", xmlData.cnpjDestinatario);
            }
        } else {
            console.warn("XMLDetails - xmlData ou filiais indisponíveis ou cnpjDestinatario inválido.");
        }
    }, [xmlData, filiais, setFilial]);


    return (
        <Card
            className={`flex flex-col h-auto md:h-full rounded-lg overflow-hidden bg-muted/30 ${className}`}
        >
            <CardHeader className="pb-2 relative">
                <CardTitle className="text-start text-base sm:text-lg md:text-xl font-medium">
                    Detalhes do XML:{" "}
                    <span>
            NF {doc || "N/A"} - {serie || "N/A"}
          </span>
                </CardTitle>

                <div className="absolute top-2 right-2 sm:top-4 sm:right-4">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="p-1 text-muted-foreground hover:text-foreground"
                            >
                                <Info className="h-5 w-5"/>
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            side="bottom"
                            align="end"
                            className="w-72 sm:w-80 text-xs sm:text-sm p-4 text-pretty"
                        >
                            <h4 className="font-medium mb-2 text-center">
                                Detalhes Adicionais
                            </h4>
                            <p className="text-muted-foreground">
                                {xmlData?.informacoesAdicionais ??
                                    "Nenhuma informação adicional disponível."}
                            </p>
                        </PopoverContent>
                    </Popover>
                </div>

                <CardDescription className="text-start text-xs sm:text-sm">
                    Informações do fornecedor e da nota fiscal
                </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 sm:px-5 md:px-6 py-4 space-y-4 overflow-auto md:overflow-hidden">
                {!doc ? (
                    <div className="flex flex-col items-center justify-center text-center px-4 sm:px-6">
                        <p className="text-muted-foreground text-xs sm:text-sm max-w-[90%] sm:max-w-md text-pretty">
                            Por favor, insira uma chave XML para buscar os detalhes.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs sm:text-sm font-medium text-foreground">
                                    <strong>Emitente:</strong>{" "}
                                    {xmlData && "nomeEmitente" in xmlData
                                        ? xmlData.nomeEmitente
                                        : cnpjEmitente || "N/A"}
                                </p>
                                <div className={"flex gap-3 justify-start items-center"}>
                                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                                        {xmlData && "cnpjEmitente" in xmlData
                                            ? xmlData.cnpjEmitente
                                            : "CNPJ não disponível"}
                                    </p>
                                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                                        -
                                    </p>
                                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                                        {codEmitente || "N/A"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col items-start md:items-end">
                                <p className="text-sm font-medium text-foreground">
                                    {xmlData && "dataEmissao" in xmlData
                                        ? xmlData.dataEmissao
                                        : "Data não disponível"}
                                </p>
                            </div>

                            <div className="flex flex-col gap-1 col-span-full">
                                <div className={"flex justify-between w-full"}>
                                    <p className="text-xs sm:text-sm font-medium text-foreground">
                                        <strong>Destinatário:</strong>{" "}
                                        {filiais.find(
                                            (f) =>
                                                xmlData &&
                                                "cnpjDestinatario" in xmlData &&
                                                f.M0_CGC === xmlData.cnpjDestinatario
                                        )?.M0_FILIAL || "Filial não encontrada"}
                                    </p>
                                    {/* Condição de Pagamento - abaixo da data */}
                                    <p className="text-xs sm:text-sm font-medium text-foreground">
                                        <strong>Condição:</strong> {condicaoDescricao}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                                        {xmlData && "cnpjDestinatario" in xmlData
                                            ? xmlData.cnpjDestinatario
                                            : "CNPJ não disponível"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </CardContent>

        </Card>
    );
}