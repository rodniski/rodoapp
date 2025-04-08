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
      { label: "Agrupar Ordens de Serviço para Faturamento" },
    ]);
  }, [setBreadcrumbs]);

  const kardexContent: GenericDocumentationPageProps = {
    title: "Agrupar Ordens de Serviço para Faturamento",
    date: "16 de fevereiro de 2024",
    description:
      "Nesta página, você aprenderá como agrupar ordens de serviço para faturamento, utilizando filtros para localizar as OS desejadas, marcando os itens selecionados e agrupando-os corretamente, respeitando os critérios do sistema.",
    sections: [
        {
            id: "tutorial",
            title: "Tutorial",
            content: "Durante o fechamento, utilize os filtros no cabeçalho da tela para localizar as ordens de serviço que deseja agrupar. O sistema permite agrupar ordens e tipos de tempo distintos, desde que sejam do mesmo cliente. Após localizar os itens, marque os checkboxes correspondentes, clique em 'Selecionar para Fechamento' e prossiga com o processo normalmente.",
            additionalContent: [
                {
                    type: "image",
                    content: "/documentacao/protheus/agrupar-os-faturamento.png",
                    props: { alt: "Print Tutorial", width: 1000, height: 8000 }
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
