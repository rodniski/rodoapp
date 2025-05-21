// NFDetails.tsx (novo arquivo)
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "ui";
import { BorrachariaItem } from "../types"; // Importa o tipo

interface NFDetailsProps {
    item: BorrachariaItem;
}

const NFDetails: React.FC<NFDetailsProps> = ({ item }) => {
    return (
        <Card className="mb-4 bg-muted/30 dark:bg-background/60">
            <CardHeader>
                <CardTitle>Detalhes da Nota Fiscal</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2 text-sm">
                <div>
                    <span className="font-bold">Nota Fiscal:</span> {item.NFLabel}
                </div>
                <div>
                    <span className="font-bold">Filial:</span> {item.Filial}
                </div>
                <div>
                    <span className="font-bold">Vendedor:</span> {item.VendLabel} (
                    {item.CodVendedor})
                </div>
                <div>
                    <span className="font-bold">Cliente:</span> {item.ClienteLabel} (
                    {item.CodCliente}-{item.Loja})
                </div>
                <div>
                    <span className="font-bold">Emissão:</span> {item.Emissao}
                </div>
                <div>
                    <span className="font-bold">Itens:</span> {item.QtdItens}
                </div>
            </CardContent>
        </Card>
    );
};

export default NFDetails;
