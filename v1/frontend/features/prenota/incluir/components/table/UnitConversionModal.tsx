import React, {useState, useEffect} from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
    Input,
    Label,
} from "ui";
import {useAtomValue} from "jotai";
import {unidadeMedidaAtom} from "$/atoms";

// Interface para garantir o formato correto
export interface UnidadeMedida {
    UM: string;
    DESCRICAO: string;
    DESC: string;
}

// Definição de tipos para maior clareza
interface UnitConversionModalProps {
    isOpen: boolean,
    onClose: () => void,
    pedidoUnidade: string,
    xmlUnidade: string,
    xmlQuantidade: number,
    pedidoQuantidade: number,
    onSave: (convertedQuantity: number, segundaUnidade?: string) => void,
    produto?: any
}

export const UnitConversionModal: React.FC<UnitConversionModalProps> = ({
                                                                            isOpen,
                                                                            onClose,
                                                                            pedidoUnidade,
                                                                            xmlQuantidade,
                                                                            pedidoQuantidade,
                                                                            onSave,
                                                                            produto
                                                                        }) => {
    // Busca as unidades de medida
    const unidadesMedida = useAtomValue(unidadeMedidaAtom);

    // Estados para controle da conversão
    const [conversionType, setConversionType] = useState<
        "multiplicar" | "dividir"
    >("multiplicar");
    const [conversionFactor, setConversionFactor] = useState<number>(1);
    const [convertedQuantity, setConvertedQuantity] =
        useState<number>(xmlQuantidade);
    const [selectedUnidadeMedida, setSelectedUnidadeMedida] = useState<
        string | null
    >(null);

    // Lógica de conversão
    const calculateConvertedQuantity = (
        factor: number,
        type: "multiplicar" | "dividir"
    ) => {
        if (type === "multiplicar") {
            return xmlQuantidade * factor;
        } else {
            return xmlQuantidade / factor;
        }
    };

    // Calcular fator de conversão automaticamente
    const calculateConversionFactor = () => {
        // Se quantidade do pedido for zero, não podemos calcular
        if (pedidoQuantidade === 0) {
            alert("Quantidade do pedido não pode ser zero.");
            return;
        }

        // Calcula o fator de conversão dividindo a quantidade do XML pela quantidade do pedido
        const factor = xmlQuantidade / pedidoQuantidade;

        setConversionFactor(factor);
        setConversionType("multiplicar"); // Assume multiplicação por padrão
    };

    // Efeito para atualizar quantidade convertida quando mudam os parâmetros de conversão
    useEffect(() => {
        const newConvertedQuantity = calculateConvertedQuantity(
            conversionFactor,
            conversionType
        );
        setConvertedQuantity(newConvertedQuantity);
    }, [conversionFactor, conversionType, xmlQuantidade]);

    // Manipulador para salvar a conversão
    const handleSave = () => {
        onSave(convertedQuantity, selectedUnidadeMedida || undefined);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[625px]">
                <DialogHeader>
                    <DialogTitle>Conversão de Unidades</DialogTitle>
                    <DialogDescription>
                        Converta a quantidade entre unidades de medida
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 py-4">
                    {/* Primeira Coluna */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 items-center gap-4">
                            <Label>Unidade do Pedido</Label>
                            <Input value={pedidoUnidade} readOnly className="col-span-3"/>
                        </div>

                        <div className="grid grid-cols-1 items-center gap-4">
                            <Label>Tipo de Conversão</Label>
                            <Select
                                value={conversionType}
                                onValueChange={(value: "multiplicar" | "dividir") =>
                                    setConversionType(value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione o tipo de conversão"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="multiplicar">Multiplicar</SelectItem>
                                    <SelectItem value="dividir">Dividir</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-1 items-center gap-4">
                            <Label>Quantidade do Pedido</Label>
                            <Input
                                type="number"
                                value={pedidoQuantidade}
                                readOnly
                                className="col-span-3"
                            />
                        </div>
                    </div>

                    {/* Segunda Coluna */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 items-center gap-4">
                            <Label>2ª Unidade de Medida</Label>
                            <Select
                                value={selectedUnidadeMedida || ""}
                                onValueChange={(value) => setSelectedUnidadeMedida(value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione a Unidade de Medida"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {unidadesMedida.map((unidade) => (
                                        <SelectItem key={unidade.UM} value={unidade.UM}>
                                            {unidade.DESC}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-1 items-center gap-4">
                            <Label>Fator de Conversão</Label>
                            <div className="flex space-x-2">
                                <Input
                                    type="number"
                                    value={conversionFactor}
                                    onChange={(e) => setConversionFactor(Number(e.target.value))}
                                    placeholder="Digite o fator de conversão"
                                    className="flex-grow"
                                />
                                <button
                                    onClick={calculateConversionFactor}
                                    className="bg-secondary text-secondary-foreground px-3 py-2 rounded-md hover:bg-secondary/90"
                                >
                                    Calcular
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 items-center gap-4">
                            <Label>Quantidade do XML</Label>
                            <Input value={xmlQuantidade} readOnly className="col-span-3"/>
                        </div>
                    </div>
                </div>

                {/* Resultado da Conversão */}
                <div className="mt-4 p-3 bg-muted rounded-md">
                    <Label className="font-bold">Valor Convertido:</Label>
                    <div className="flex items-center space-x-2 mt-2">
                        <Input
                            value={convertedQuantity.toFixed(4)}
                            readOnly
                            className="flex-grow"
                        />
                    </div>
                </div>

                {/* Botão de Salvar */}
                <div className="mt-4 flex justify-end">
                    <button
                        onClick={handleSave}
                        className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
                    >
                        Salvar Conversão
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UnitConversionModal;