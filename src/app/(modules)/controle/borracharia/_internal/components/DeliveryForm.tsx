import React from "react";
import { Card, CardContent, CardHeader, CardTitle, Input, Label, Switch } from "ui";

interface DeliveryFormProps {
    respRet: string;
    setRespRet: (value: string) => void;
    placa: string;
    setPlaca: (value: string) => void;
    obs: string;
    setObs: (value: string) => void;
    respCarreg: string;
    setRespCarreg: (value: string) => void;
    retirado: string; // Adiciona o estado de retirado
    setRetirado: (value: string) => void; // Setter para atualizar retirado
}

const DeliveryForm: React.FC<DeliveryFormProps> = ({
                                                       respRet,
                                                       setRespRet,
                                                       placa,
                                                       setPlaca,
                                                       obs,
                                                       setObs,
                                                       respCarreg,
                                                       setRespCarreg,
                                                       retirado,
                                                       setRetirado,
                                                   }) => (
    <Card className="bg-muted/30 dark:bg-background/60">
        <CardHeader>
            <CardTitle className={"flex justify-between items-center"}>
                Carregamento
                <div className={"flex gap-1 justify-center items-center"}>
                    <span className={"text-sm"}>Cliente</span>
                    <Switch
                        checked={retirado === "R"} // "R" quando ligado, "C" quando desligado
                        onCheckedChange={(checked) => setRetirado(checked ? "R" : "C")}
                    />
                    <span className={"text-sm"}>Rodoparaná</span>
                </div>
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className={"flex w-full gap-8"}>
                <div className="w-full flex flex-col items-center justify-center gap-2">
                    <Label htmlFor="respRet">Responsável Retirada</Label>
                    <Input
                        id="respRet"
                        value={respRet}
                        onChange={(e) => setRespRet(e.target.value)}
                    />
                </div>
                <div className="w-full flex flex-col items-center justify-center gap-2">
                    <Label htmlFor="respCarreg">Responsável Carregamento</Label>
                    <Input
                        id="respCarreg"
                        value={respCarreg}
                        onChange={(e) => setRespCarreg(e.target.value)}
                    />
                </div>
            </div>
            <div className={"flex w-full gap-8 mt-2"}>
                <div className="w-full flex flex-col items-center justify-center gap-2">
                    <Label htmlFor="placa">Placa do Veículo</Label>
                    <Input
                        id="placa"
                        value={placa}
                        onChange={(e) => setPlaca(e.target.value)}
                        
                    />
                </div>
                <div className="w-full flex flex-col items-center justify-center gap-2">
                    <Label htmlFor="obs">Observações</Label>
                    <Input
                        id="obs"
                        value={obs}
                        onChange={(e) => setObs(e.target.value)}
                    />
                </div>
            </div>
        </CardContent>
    </Card>
);

export default DeliveryForm;
