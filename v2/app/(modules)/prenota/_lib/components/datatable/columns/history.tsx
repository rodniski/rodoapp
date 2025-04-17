// import React, { useState } from "react";
// import { Sheet, SheetContent } from "ui";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "ui";
// import { Loader2 } from "lucide-react";
// import { TimelineLayout } from "ui";
// import { useTimeline } from "#/dashboard/hooks";
// import type { PreNota } from "../interfaces";
// import { SolicitacaoRevisao } from ".";
// import type { TimelineParams } from "../interfaces";

// interface HistoricoRevisaoSheetProps {
//     isOpen: boolean;
//     onOpenChange: (open: boolean) => void;
//     preNota: PreNota;
// }

// export const HistoricoRevisaoSheet: React.FC<HistoricoRevisaoSheetProps> = ({
//                                                                                 isOpen,
//                                                                                 onOpenChange,
//                                                                                 preNota,
//                                                                             }) => {
//     // ✅ Definição correta dos parâmetros da timeline
//     const timelineParams: TimelineParams = {
//         rec_f1: preNota.Rec,

//     };

//     // ✅ Hook da timeline com parâmetros corretos
//     const { data, error, isLoading } = useTimeline(timelineParams);
//     const [tab, setTab] = useState("historico");

//     // 🏗️ Formatação dos dados para exibição na Timeline
//     const processData = (data: any[]) => {
//         return data.map((item) => {
//             const date =
//                 item?.emissao_pedido ||
//                 item?.emissao_nf ||
//                 item?.data_historico ||
//                 item?.data_classificacao ||
//                 item?.vencimento ||
//                 "Data não disponível";

//             const time = item?.hora_historico || "";

//             const details = Object.entries(item)
//                 .filter(([key, value]) => value && key !== "categoria")
//                 .map(([key, value]) => ({
//                     key: key.replace(/_/g, " ").toUpperCase(),
//                     value: value as string,
//                 }));

//             return {
//                 date,
//                 time,
//                 title: item?.categoria || "Sem categoria",
//                 details,
//             };
//         });
//     };

//     // ✅ Formata os dados caso existam
//     const formattedData = data ? processData(data) : [];

//     return (
//         <Sheet open={isOpen} onOpenChange={onOpenChange}>
//             <SheetContent
//                 side="right"
//                 className="w-auto max-w-full min-w-[600px] p-4 bg-muted overflow-x-hidden"
//             >
//                 {/* Tabs */}
//                 <Tabs
//                     defaultValue="historico"
//                     onValueChange={(value) => setTab(value)}
//                     className="pt-5"
//                 >
//                     <TabsList className="flex gap-2 border-b pb-2">
//                         <TabsTrigger value="historico">Histórico</TabsTrigger>
//                         <TabsTrigger value="revisao">Solicitar Revisão</TabsTrigger>
//                     </TabsList>

//                     {/* Conteúdo das Tabs */}
//                     <TabsContent
//                         value="historico"
//                         className="bg-background rounded-xl shadow-xl p-3 border border-muted-foreground/40"
//                     >
//                         <div className="pt-5 h-full overflow-y-auto">
//                             {isLoading && (
//                                 <div className="flex justify-center items-center h-40">
//                                     <Loader2 className="h-8 w-8 animate-spin" />
//                                 </div>
//                             )}
//                             {error && (
//                                 <div className="text-red-500 text-center">
//                                     Erro: {error.message}
//                                 </div>
//                             )}
//                             {formattedData.length > 0 ? (
//                                 <TimelineLayout items={formattedData} />
//                             ) : (
//                                 <p className="text-center text-muted-foreground">
//                                     Nenhum dado disponível.
//                                 </p>
//                             )}
//                         </div>
//                     </TabsContent>

//                     <TabsContent
//                         value="revisao"
//                         className="bg-background rounded-xl shadow-xl p-3 border border-muted-foreground/40"
//                     >
//                         <SolicitacaoRevisao
//                             onSubmit={(formData) => console.log("Revisão enviada:", formData)}
//                         />
//                     </TabsContent>
//                 </Tabs>
//             </SheetContent>
//         </Sheet>
//     );
// };
