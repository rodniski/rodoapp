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
      { label: "GNRE" },
    ]);
  }, [setBreadcrumbs]);

  const gnreContent: GenericDocumentationPageProps = {
    title: "GNRE",
    date: "20 de Outubro de 2024",
    description:
      "Nesta página, você aprenderá sobre a GNRE, um documento essencial para o recolhimento de tributos estaduais em operações interestaduais. Utilizada principalmente para o ICMS, a GNRE padroniza e simplifica o pagamento de impostos, garantindo que os valores sejam corretamente direcionados aos estados beneficiários.",
    sections: [
      {
        id: "tutorial",
        title: "Tutorial",
        content: "Para aprender, assista o vídeo abaixo!",
        additionalContent: [
          {
            type: "iframe", 
            content: "https://www.youtube.com/embed/4MlDcyyXw6Q", 
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
      <GenericDocumentationPage {...gnreContent} />
    </div>
  );
};

export default Page;
