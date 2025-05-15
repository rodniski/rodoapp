"use client";

import GenericDocumentationPage, {
  GenericDocumentationPageProps,
} from "../../_internal/ui/GenericDocumentationPage";

const Page = () => {
  const kardexContent: GenericDocumentationPageProps = {
    title: "Ordens de Serviço",
    group: "Protheus",
    date: "22 de Fevereiro de 2024",
    description:
      "Nesta página, você aprenderá sobre as ordens de serviço.",
    sections: [
      {
        id: "tutorial",
        title: "Tutorial",
        content: "A Ordem de Serviço é um documento essencial para formalizar solicitações de trabalho em uma empresa. Ela descreve de forma detalhada as tarefas a serem realizadas, os prazos, os responsáveis e os recursos necessários, promovendo organização e eficiência nos processos. Além disso, permite acompanhar e controlar as atividades, garantindo que os serviços sejam executados conforme o planejado.",
        additionalContent: [
            {
                type: "iframe", 
                content: "https://www.youtube.com/embed/2PqngeLvoZ8", 
                props: {
                  className: "w-[700px] h-[400px] my-3",
                  allow:
                    "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
                  allowFullScreen: true,
                },
              },
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
