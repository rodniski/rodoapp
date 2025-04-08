"use client";

import { useBreadcrumbs } from "lib";
import { useEffect } from "react";
import GenericDocumentationPage, {
  GenericDocumentationPageProps,
} from "doc/components/GenericDocumentationPage";

const Page = () => {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: "RodoApp", href: "/" },
      { label: "Central", href: "/central" },
      { label: "Documentação", href: "/central/documentacao" },
      { label: "Protheus", href: "/central/documentacao/protheus" },
      { label: "Erro ao Transmitir Notas Fiscais" },
    ]);
  }, [setBreadcrumbs]);

  const erroContent: GenericDocumentationPageProps = {
    title: "Erro ao Transmitir Notas Fiscais",
    date: "21 de Fevereiro de 2024",
    description:
      "Nesta página, você aprenderá sobre a rejeição 029 - Falha no schema do XML, um erro comum ao transmitir notas fiscais para a SEFAZ. Descubra como identificar e corrigir o problema, passo a passo, utilizando o sistema.",
    sections: [
      {
        id: "tutorial",
        title: "Erro 029",
        content:
          "A rejeição 029 - 'Falha no schema do XML' pode ocorrer ao transmitir notas fiscais para a SEFAZ. Para corrigir, clique no botão 'Schema' no canto inferior da tela para visualizar o XML gerado. Na janela exibida, selecione todo o texto com CTRL + A, copie com CTRL + C, cole em um bloco de notas, e clique em 'OK' no sistema. O sistema exibirá uma mensagem perguntando se deseja visualizar as possíveis causas do erro; clique em 'Sim'. Na próxima tela, selecione a mensagem de erro e clique em 'Possibilidade'. Por exemplo, um erro comum é na tag CEAN, onde o valor deve ser numérico ou conter 'SEM GTIN'.",
        additionalContent: [
          {
            type: "image",
            content: "/documentacao/protheus/erro-notas-fiscais/erro029/1.png",
            props: { alt: "Print Tutorial", width: 900, height: 100 },
          },
          {
            type: "image",
            content: "/documentacao/protheus/erro-notas-fiscais/erro029/2.png",
            props: { alt: "Print Tutorial", width: 450, height: 100 },
          },
          {
            type: "image",
            content: "/documentacao/protheus/erro-notas-fiscais/erro029/3.png",
            props: { alt: "Print Tutorial", width: 450, height: 100 },
          },
          {
            type: "image",
            content: "/documentacao/protheus/erro-notas-fiscais/erro029/4.png",
            props: { alt: "Print Tutorial", width: 450, height: 100 },
          },
        ],
      },
        {
            id: "outros-erros",
            title: "Outros Erros",
            content:
            "Erros relacionados a peças, como NCM ou GTIN, devem ser encaminhados ao setor de compras. Já os erros no cadastro de clientes, como endereço ou CEP, devem ser direcionados ao financeiro ou ao responsável pela filial. Problemas relacionados a impostos devem ser enviados para a contabilidade. Para identificar o produto com erro, volte ao bloco de notas onde o XML foi colado. Utilize CTRL + F para localizar o valor '45841'. Observe a tag anterior para identificar o código do produto (por exemplo, RD65001677). Neste caso, será necessário solicitar ao setor de compras a validação do GTIN do produto.",
            additionalContent: [
            {
                type: "image",
                content:
                "/documentacao/protheus/erro-notas-fiscais/outros-erros/1.png",
                props: { alt: "Print Tutorial", width: 750, height: 100 },
            },
            {
                type: "video",
                content: "/documentacao/protheus/erro-notas-fiscais/outros-erros/2.mp4",
                props: {
                className: "w-full max-w-[750px] h-auto",
                muted: true,
                controls: true,
                },
            },
            ],
        },
        {
            id: "outros-casos",
            title: "Outros Casos - Notas de Serviço",
            content:
            "Em caso de notas de serviço, será necessário clicar no botão 'Histórico' para verificar o motivo da rejeição.",
            additionalContent: [
            {
                type: "image",
                content:
                "/documentacao/protheus/erro-notas-fiscais/outros-casos.png",
                props: { alt: "Print Tutorial", width: 1000, height: 100 },
            }
            ],
        },
        {
            id: "resgatar-xml",
            title: "Resgatar o XML",
            content:
            "Para resgatar o XML, Utilize o botão Schema.",
            additionalContent: [
            {
                type: "image",
                content:
                "/documentacao/protheus/erro-notas-fiscais/resgatar-xml.png",
                props: { alt: "Print Tutorial", width: 1000, height: 100 },
            }
            ],
        },
      {
        id: "outros-problemas",
        title: "Outros Problemas",
        content:
          "Se estiver enfrentando outra dificuldade, abra um chamado e, assim que possível, um membro da equipe de TI entrará em contato para ajudá-lo!",
      },
    ],
    footerButton: {
      text: "Abrir Chamado",
      onClick: () =>
        window.open("http://hesk.rodoparana.com.br/index.php?a=add", "_blank"),
    },
  };

  return (
    <div className="h-full w-full pt-20 pl-20">
      <GenericDocumentationPage {...erroContent} />
    </div>
  );
};

export default Page;
