"use client";

import GenericDocumentationPage, {
  GenericDocumentationPageProps,
} from "../../_internal/ui/GenericDocumentationPage";

const Page = () => {
  const kardexContent: GenericDocumentationPageProps = {
    title: "Kardex",
    group: "Protheus",
    date: "17 de outubro de 2024",
    description:
      "Nesta página, você aprenderá sobre o Kardex.",
    sections: [
      {
        id: "tutorial",
        title: "Tutorial",
        content: "No módulo Estoque/Custos, acesse o menu Relatórios > Rastreabilidade > Kardex. Em seguida, clique em 'Outras Ações', selecione 'Parâmetros' e insira os filtros desejados para gerar o relatório conforme sua necessidade.",
        additionalContent: [
            {
                type: "image",
                content: "/documentacao/protheus/kardex/1.png",
                props: { alt: "Print Tutorial", width: 200, height: 100 }
            },
            {
                type: "image",
                content: "/documentacao/protheus/kardex/2.png",
                props: { alt: "Print Tutorial", width: 500, height: 300 }
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
      <GenericDocumentationPage {...kardexContent} />
    </div>
  );
};

export default Page;
