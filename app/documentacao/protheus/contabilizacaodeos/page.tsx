"use client";

import GenericDocumentationPage, {
  GenericDocumentationPageProps,
} from "../../_lib/components/GenericDocumentationPage";

const Page = () => {
  const vendaDePecasContent: GenericDocumentationPageProps = {
    title: "Contabilização de OS's",
    group: "Protheus",
    date: "11 de janeiro de 2024",
    description:
      "Nesta página, você aprenderá como realizar alterações nos centros de custo de notas fiscais que foram faturadas incorretamente. Para atender a essa necessidade, foi desenvolvida uma rotina que permite que o departamento de contabilidade faça essas alterações diretamente.",
    sections: [
      {
        id: "tutorial",
        title: "Tutorial",
        content: "Para garantir a correta contabilização das OS's internas, é necessário informar a filial e o centro de custo aos quais os valores da OS serão debitados. Essas informações devem ser preenchidas no momento do fechamento da OS nos campos    Filial Despesa  e   CC OS Interno . Além disso, o centro de custo de crédito deve ser especificado ao selecionar os itens para fechamento, nas abas    Negociar Peças  e   Negociar Serviços .",
        additionalContent: [
            {
                type: "image",
                content: "/documentacao/protheus/contabilizacao-de-os/1.webp",
                props: { alt: "Configurando assinatura do outlook", width: 850, height: 50 }
            },
            {
                type: "image",
                content: "/documentacao/protheus/contabilizacao-de-os/2.webp",
                props: { alt: "Configurando assinatura do outlook", width: 1000, height: 50 }
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
      <GenericDocumentationPage {...vendaDePecasContent} />
    </div>
  );
};

export default Page;
