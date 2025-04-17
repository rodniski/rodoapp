// import React from 'react';
// import { usernameAtom } from "%/atoms";
// import { useAtomValue, useSetAtom } from "jotai";
// import { usePrenotaDetails, UsePrenotaDetailsProps } from "#/dashboard";
// import * as atoms from '#/incluir/atoms';
// import { useRouter } from 'next/navigation';
// import { toast } from "sonner";
// import {DropdownMenuItem} from "ui";
// import { PrenotaRow } from "@prenota/types";
// interface EditarProps {
//     rec?: number;
// }

// export const Editar = ({ rec }: EditarProps) => {
//     const router = useRouter();
//     const username = useAtomValue(usernameAtom);

//     // Setters dos átomos
//     const setFilialCod = useSetAtom(atoms.filialCodAtom);
//     const setOpcao = useSetAtom(atoms.opcaoAtom);
//     const setTipoNota = useSetAtom(atoms.tipoNotaAtom);
//     const setFornecedor = useSetAtom(atoms.fornecedorAtom);
//     const setLoja = useSetAtom(atoms.lojaAtom);
//     const setDoc = useSetAtom(atoms.docAtom);
//     const setSerie = useSetAtom(atoms.serieAtom);
//     const setOldSerie = useSetAtom(atoms.oldSerieAtom);
//     const setEspecie = useSetAtom(atoms.especieAtom);
//     const setCondFin = useSetAtom(atoms.condFinAtom);
//     const setChaveNf = useSetAtom(atoms.chaveNfAtom);
//     const setObs = useSetAtom(atoms.obsAtom);
//     const setPrioridade = useSetAtom(atoms.prioridadeAtom);
//     const setJustificativa = useSetAtom(atoms.justificativaAtom);
//     const setTipoRodo = useSetAtom(atoms.tipoRodoAtom);
//     const setDataInc = useSetAtom(atoms.dataIncAtom);
//     const setCgcPix = useSetAtom(atoms.cgcPixAtom);
//     const setChavePix = useSetAtom(atoms.chavePixAtom);
//     const setArquivos = useSetAtom(atoms.arquivosAtom);
//     const setPagamentos = useSetAtom(atoms.pagamentosAtom);
//     const setRateios = useSetAtom(atoms.rateiosAtom);
//     const setItens = useSetAtom(atoms.itensAtom);

//     // Chamada única do hook com refetch disponível
//     const { refetch } = usePrenotaDetails({
//         usr: username,
//         rec,
//     } as UsePrenotaDetailsProps);

//     const handleClick = () => {
//         console.log("Iniciando refetch da pré-nota para rec:", rec, "e usuário:", username);
//         // Utiliza refetch para buscar novamente os dados da prenota
//         const promise = refetch().then(result => {
//             console.log("Resultado do refetch:", result);
//             if (result.data) {
//                 console.log("Dados da pré-nota encontrados:", result.data);
//                 return { data: result.data };
//             }
//             console.error("Dados da prenota não encontrados");
//             throw new Error("Dados da prenota não encontrados");
//         });

//         toast.promise(promise, {
//             loading: 'Carregando dados da pré-nota...',
//             success: ({ data }: { data: Prenota }) => {
//                 console.log("Sucesso no carregamento da pré-nota:", data);
//                 setFilialCod(data.F1_FILIAL);
//                 setOpcao(3);
//                 setTipoNota(data.F1_XTIPO.trim() === "Despesa/Imobilizado" ? "N" : "C");
//                 setFornecedor(data.F1_FORNECE);
//                 setLoja(data.F1_LOJA);
//                 setDoc(data.F1_DOC);
//                 setSerie(data.F1_SERIE);
//                 setOldSerie("");
//                 setEspecie("NF");
//                 setCondFin(data.F1_COND);
//                 setChaveNf(data.F1_CHVNFE);
//                 setObs(data.F1_XOBS);
//                 setPrioridade(data.F1_XPRIOR);
//                 setJustificativa("");
//                 setTipoRodo("");
//                 setDataInc(data.F1_EMISSAO);
//                 setCgcPix("");
//                 setChavePix("");
//                 setArquivos([]);
//                 setPagamentos(data.PAGAMENTOS || []);
//                 setRateios(data.RATEIO || []);
//                 setItens(
//                     data.ITENS.map((item, index) => ({
//                         ITEM: String(index + 1).padStart(5, '0'),
//                         PRODUTO: item.B1_DESC,
//                         QUANTIDADE: item.D1_QUANT,
//                         VALUNIT: item.D1_VUNIT,
//                         PRODFOR: item.D1_COD,
//                         DESCFOR: item.A5_NOMPROD,
//                         ORIGEMXML: item.B1_ORIGEM,
//                         TOTAL: item.D1_TOTAL,
//                         PC: item.C7_NUM,
//                         ITEMPC: item.C7_ITEM,
//                         B1_UM: item.B1_UM,
//                         SEGUN: '',
//                         TPFATO: '',
//                         CONV: 1,
//                         ORIGEM: item.B1_ORIGEM,
//                     }))
//                 );

//                 // Redireciona com base na presença de F1_CHVNFE
//                 if (data.F1_CHVNFE) {
//                     console.log("Redirecionando para /central/prenota/xml");
//                     router.push('/central/prenota/xml');
//                 } else {
//                     console.log("Redirecionando para /central/prenota/manual");
//                     router.push('/central/prenota/manual');
//                 }
//                 return 'Pré-nota carregada com sucesso!';
//             },
//             error: (err: any) => {
//                 console.error("Erro ao carregar pré-nota:", err);
//                 return `Erro ao carregar pré-nota: ${err.message}`;
//             },
//         });
//     };

//     return (
//         <DropdownMenuItem onClick={handleClick}>
//             Editar
//         </DropdownMenuItem>
//     );
// };

