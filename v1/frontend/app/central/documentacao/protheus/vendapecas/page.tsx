"use client";

import { useBreadcrumbs } from "lib";
import { useEffect } from "react";
import GenericDocumentationPage, { GenericDocumentationPageProps } from "doc/components/GenericDocumentationPage";

const Page = () => {
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    setBreadcrumbs([
      { label: "RodoApp", href: "/" },
      { label: "Central", href: "/central" },
      { label: "Documentação", href: "/central/documentacao" },
      { label: "Protheus", href: "/central/documentacao/protheus" },
      { label: "Venda de Peças" },
    ]);
  }, [setBreadcrumbs]);

  const vendaDePecasContent: GenericDocumentationPageProps = {
    title: "Venda de peças",
    date: "24 de Outubro de 2024",
    description: "Nesta página, você encontrará um tutorial detalhado e prático sobre como utilizar o sistema TOTVS Oficina para realizar vendas de peças na sua empresa. Este material foi desenvolvido para capacitar colaboradores, ajudando-os a compreender e dominar as funcionalidades do software, otimizando assim os processos de venda e garantindo maior eficiência nas operações.",
    sections: [
      {
        id: "tutorial",
        title: "Tutorial",
        content: "Para aprender a realizar o processo de venda de peças, assista o vídeo abaixo!",
        additionalContent: [
          {
            type: "video",
            content: "/documentacao/protheus/venda-pecas.mp4",
            props: { className: "w-[700px] h-auto", controls: true, muted: true }
          }
        ]
      },
      {
        id: "outros-problemas",
        title: "Outros Problemas",
        content: "Se estiver enfrentando outra dificuldade, abra um chamado e, assim que possível, um membro da equipe de TI entrará em contato para ajudá-lo!"
      }
    ],
    footerButton: {
      text: "Abrir Chamado",
      onClick: () => window.open("http://hesk.rodoparana.com.br/index.php?a=add", "_blank")
    }
  };

  return (
    <div className="h-full w-full pt-20 pl-20">
      <GenericDocumentationPage {...vendaDePecasContent} />
    </div>
  );
};

export default Page;