"use client";

import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "ui";
import { MessageCircleX, PackageCheck } from "lucide-react";
import { BorrachariaItem } from "../types";

import { useBorrachariaStore } from "../stores";
import { EnviarButton } from "./buttons/EnviarButton";

import NFDetails from "./NFDetails";
import ItemsTable from "./itemsTable"; 
import DeliveryForm from "./DeliveryForm";
import { AnimatedButton } from "./buttons/AnimationButton"; 

interface BorDeliverProps {
    item: BorrachariaItem;
}

const BorDeliver: React.FC<BorDeliverProps> = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Estado local para valores do item
    const [filial] = useState(item.Filial || "");
    const [doc] = useState(item.Doc || "");
    const [serie] = useState(item.Serie || "");
    const [codCliente] = useState(item.CodCliente || "");
    const [loja] = useState(item.Loja || "");

    // Estado local para campos editáveis
    const [respRet, setRespRet] = useState("");
    const [placa, setPlaca] = useState("");
    const [obs, setObs] = useState("");
    const [respCarreg, setRespCarreg] = useState("");
    const [retirado, setRetirado] = useState("C"); // "C" como padrão

    // Atomo global do Zustand(stores/index.ts) para itens selecionados
    const selectedItems = useBorrachariaStore((state) => state.selectedItems);
    const setSelectedItems = useBorrachariaStore((state) => state.setSelectedItems);

    if (!item) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <AnimatedButton text="Entregar" icon={<PackageCheck />} isDialog />

            <DialogContent className="!max-w-[1200px] max-h-[80vh] overflow-y-auto overflow-x-hidden dark:bg-muted/30 bg-white/90 backdrop-blur">
                <DialogHeader>
                    <DialogTitle className="text-3xl">Entregar Pneus</DialogTitle>
                </DialogHeader>

                <div className="flex gap-8">
                    <div className="w-[400px]">
                        <NFDetails item={item} />
                        <DeliveryForm
                            respRet={respRet}
                            setRespRet={setRespRet}
                            placa={placa}
                            setPlaca={setPlaca}
                            obs={obs}
                            setObs={setObs}
                            respCarreg={respCarreg}
                            setRespCarreg={setRespCarreg}
                            retirado={retirado}
                            setRetirado={setRetirado}
                        />
                    </div>
                    <ItemsTable
                        filial={filial}
                        doc={doc}
                        serie={serie}
                        codCliente={codCliente}
                        loja={loja}
                        onItemsChange={setSelectedItems}
                    />
                </div>

                <DialogFooter className="w-[1140px] flex justify-between">
                    <AnimatedButton
                        variant="destructive"
                        onClick={() => setIsOpen(false)}
                        text="Cancelar"
                        icon={<MessageCircleX />}
                    />
                    <EnviarButton
                        item={item}
                        respRet={respRet}
                        placa={placa}
                        obs={obs}
                        respCarreg={respCarreg}
                        retirado={retirado} // Passa o valor de retirado
                        onSuccess={() => {
                            setIsOpen(false);
                            setSelectedItems([]);
                        }}
                    />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default BorDeliver;
