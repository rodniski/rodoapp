"use client";

import GenericDocumentationPage, {
  GenericDocumentationPageProps,
} from "../../_lib/components/GenericDocumentationPage";

const Page = () => {
  const kardexContent: GenericDocumentationPageProps = {
    title: "Rel. Liberação Pré Nota",
    group: "Protheus",
    date: "23 de fevereiro de 2024",
    description:
      "Nesta página, você aprenderá sobre a liberação pré nota.",
    sections: [
      {
        id: "tutorial",
        title: "Tutorial",
        content: "Siga o tutorial abaixo:",
        additionalContent: [
            {
                type: "image",
                content: "/documentacao/protheus/liberacao-pre-nota/1.png",
                props: { alt: "Print Tutorial", width: 650, height: 300 }
            },
            {
                type: "image",
                content: "/documentacao/protheus/liberacao-pre-nota/2.png",
                props: { alt: "Print Tutorial", width: 550, height: 300 }
            },
            {
                type: "image",
                content: "/documentacao/protheus/liberacao-pre-nota/3.png",
                props: { alt: "Print Tutorial", width: 550, height: 300 }
            },
            {
                type: "image",
                content: "/documentacao/protheus/liberacao-pre-nota/4.png",
                props: { alt: "Print Tutorial", width: 1000, height: 300 }
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
