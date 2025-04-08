"use client";

import { DadosBancariosForm } from "#/incluir/components/comboboxes/banks";
import { PixForm } from "#/incluir/components/comboboxes/pix";
import {
    dataIncAtom,
    fornecedorAtom,
    fornecedorSupAtom,
    lojaAtom,
    pagamentosAtom,
    totalGeralAtom,
} from "#/incluir/atoms";
import { useCondicaoPagamento } from "#/incluir/hooks";
import { useAtomValue, useSetAtom } from "jotai";
import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
    Button,
    CurrencyInput,
    DatePicker,
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "ui";
import { Parcela } from "#/incluir/interfaces";

interface CondicaoPagamentoModalProps {
    condicao: string;
    onClose: () => void;
    isOpen: boolean;
}

const CONDICOES_DEPOSITO = ["C27", "C28", "C29", "C32"];

export function CondicaoPagamentoModal({
                                           condicao,
                                           onClose,
                                           isOpen,
                                       }: CondicaoPagamentoModalProps) {
    // Obtenção de dados de átomos
    const supplierCnpj = useAtomValue(fornecedorSupAtom);
    const valor = useAtomValue(totalGeralAtom);
    const dtEmissao = useAtomValue(dataIncAtom);
    const codForn = useAtomValue(fornecedorAtom);
    const lojaForn = useAtomValue(lojaAtom);
    const setPagamentos = useSetAtom(pagamentosAtom);

    // Estado para dados bancários
    const [dadosBancarios, setDadosBancarios] = useState({
        banco: "",
        agencia: "",
        agenciaDigito: "",
        conta: "",
        contaDigito: "",
        cnpjFornecedor: "",
    });

    // Estado para dados PIX – agora somente para visualização/edição; os dados PIX serão armazenados no hubAtom (CGCPIX e CHAVEPIX)
    const [dadosPix, setDadosPix] = useState({
        cnpjDestinatario: supplierCnpj,
        chavePix: "",
    });

    // Chamando o hook que retorna { dados, pagamentos }
    const { data: condicaoData, isLoading, error, isError } = useCondicaoPagamento({
        valor,
        condpag: condicao,
        dtEmissao,
        codForn,
        lojaForn,
    });

    // Estado para as parcelas (que serão exibidas e editadas)
    const [localParcelas, setLocalParcelas] = useState<Parcela[]>([]);
    const isDeposito = CONDICOES_DEPOSITO.includes(condicao);

    useEffect(() => {
        if (condicaoData) {
            // Atualiza o estado de PIX com os dados retornados, se existirem
            setDadosPix({
                cnpjDestinatario: condicaoData.dados.chave_pix || supplierCnpj,
                chavePix: condicaoData.dados.cpf_cnpj_destinatario || "",
            });
            // Atualiza as parcelas com o array retornado
            setLocalParcelas(condicaoData.pagamentos);
        }
    }, [condicaoData, supplierCnpj]);

    const handleSave = () => {
        if (isDeposito) {
            const camposVazios = Object.values(dadosBancarios).some(
                (valor) => !valor || valor.trim() === ""
            );
            if (camposVazios) {
                toast.error("Preencha todos os dados bancários");
                return;
            }
        }

        // Atualiza o átomo de pagamentos com o array de parcelas diretamente
        setPagamentos(localParcelas);
        onClose();
    };

    const updateParcelaVencimento = (index: number, novaData: string) => {
        setLocalParcelas((prevParcelas) =>
            prevParcelas.map((p, i) =>
                i === index ? { ...p, Vencimento: novaData } : p
            )
        );
    };

    const updateParcelaValor = (index: number, novoValor: number | null) => {
        setLocalParcelas((prevParcelas) =>
            prevParcelas.map((p, i) =>
                i === index ? { ...p, Valor: novoValor === null ? 0 : novoValor } : p
            )
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Editar Condições de Pagamento</DialogTitle>
                </DialogHeader>

                {isError && (
                    <div className="p-4 mb-4 text-sm text-red-800 bg-red-100 rounded-lg" role="alert">
                        Ocorreu um erro ao carregar as condições de pagamento: {error?.message}
                    </div>
                )}

                {isLoading ? (
                    <div className="flex items-center justify-center p-6">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span className="ml-2">Carregando...</span>
                    </div>
                ) : (
                    <>
                        {localParcelas.length > 0 && (
                            <div className="max-h-[400px] overflow-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">Parcela</TableHead>
                                            <TableHead>Vencimento</TableHead>
                                            <TableHead>Valor</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {localParcelas.map((parcela, index) => (
                                            <TableRow key={`${parcela.Parcela}-${index}`}>
                                                <TableCell>{parcela.Parcela}</TableCell>
                                                <TableCell>
                                                    <DatePicker
                                                        initialDate={parcela.Vencimento === "27/01/1900" ? "" : parcela.Vencimento}
                                                        onChange={(date) => updateParcelaVencimento(index, date)}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <CurrencyInput
                                                        value={parcela.Valor}
                                                        onChange={(newValue) => updateParcelaValor(index, newValue)}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}

                        <PixForm dados={dadosPix} onChange={setDadosPix} />

                        {isDeposito && (
                            <div className="space-y-4">
                                <h4 className="text-sm font-medium">Dados Bancários</h4>
                                <DadosBancariosForm dados={dadosBancarios} onChange={setDadosBancarios} />
                            </div>
                        )}
                    </>
                )}
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave}>Salvar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
